import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";
import { createClient } from "@supabase/supabase-js";
import {
  requireAdminAuth,
  updateSessionActivity,
} from "../../../../lib/adminAuth";

// Create service role client for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper function to validate UUID
const isValidUUID = (uuid) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Helper function to validate user authentication
const validateUserAuth = async (request) => {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { isValid: false, user: null };
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);
    if (error || !user) {
      return { isValid: false, user: null };
    }

    // Get user application data
    const { data: applicationData, error: appError } = await supabase
      .from("applications")
      .select("id, email, first_name, last_name")
      .eq("email", user.email)
      .single();

    if (appError || !applicationData) {
      return { isValid: false, user: null };
    }

    return { isValid: true, user: applicationData };
  } catch (error) {
    return { isValid: false, user: null };
  }
};

// GET /api/timeline-events/[eventId] - Get specific timeline event
export async function GET(request, { params }) {
  try {
    const { eventId } = params;

    if (!isValidUUID(eventId)) {
      return NextResponse.json(
        { error: "Invalid event ID format" },
        { status: 400 }
      );
    }

    // Check admin authentication first
    const adminAuth = await requireAdminAuth(request, ["timeline.read"]);

    if (adminAuth.isAuthorized) {
      // Admin can view any event
      const { data, error } = await supabaseAdmin
        .from("timeline_events")
        .select(
          `
          *,
          timeline_event_notes(*)
        `
        )
        .eq("id", eventId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return NextResponse.json(
            { error: "Timeline event not found" },
            { status: 404 }
          );
        }
        console.error("Database error:", error);
        return NextResponse.json(
          { error: "Failed to fetch timeline event" },
          { status: 500 }
        );
      }

      // Update session activity
      const sessionToken = request.cookies.get("admin_session")?.value;
      if (sessionToken) {
        await updateSessionActivity(sessionToken);
      }

      return NextResponse.json({
        success: true,
        data,
        requestedBy: "admin",
      });
    }

    // Check user authentication
    const userAuth = await validateUserAuth(request);

    if (!userAuth.isValid) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // User can only view events for their own application
    const { data, error } = await supabase
      .from("timeline_events")
      .select(
        `
        *,
        timeline_event_notes(*)
      `
      )
      .eq("id", eventId)
      .eq("student_id", userAuth.user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Timeline event not found or access denied" },
          { status: 404 }
        );
      }
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch timeline event" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      requestedBy: "user",
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/timeline-events/[eventId] - Update timeline event (admin only)
export async function PUT(request, { params }) {
  try {
    const { eventId } = params;

    if (!isValidUUID(eventId)) {
      return NextResponse.json(
        { error: "Invalid event ID format" },
        { status: 400 }
      );
    }

    // Validate admin authentication and permissions
    const adminAuth = await requireAdminAuth(request, ["timeline.update"]);

    if (!adminAuth.isAuthorized) {
      return adminAuth.response;
    }

    const body = await request.json();

    // Validate fields that can be updated
    const {
      event_type,
      title,
      description,
      due_date,
      priority,
      status,
      metadata = {},
    } = body;

    // Validate enum values if provided
    const validEventTypes = [
      "document_submission",
      "application_review",
      "interview_scheduled",
      "decision_pending",
      "acceptance_confirmed",
      "visa_application",
      "enrollment_deadline",
      "orientation_scheduled",
      "other",
    ];
    const validPriorities = ["low", "medium", "high", "urgent"];
    const validStatuses = ["pending", "in_progress", "completed", "cancelled"];

    if (event_type && !validEventTypes.includes(event_type)) {
      return NextResponse.json(
        {
          error: `Invalid event_type. Must be one of: ${validEventTypes.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    if (priority && !validPriorities.includes(priority)) {
      return NextResponse.json(
        {
          error: `Invalid priority. Must be one of: ${validPriorities.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Validate due_date format if provided
    if (due_date) {
      const parsedDate = new Date(due_date);
      if (isNaN(parsedDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid due_date format. Use ISO 8601 format" },
          { status: 400 }
        );
      }
    }

    // Check if event exists
    const { data: existingEvent, error: fetchError } = await supabaseAdmin
      .from("timeline_events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        return NextResponse.json(
          { error: "Timeline event not found" },
          { status: 404 }
        );
      }
      console.error("Database error:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch timeline event" },
        { status: 500 }
      );
    }

    // Prepare update data
    const updateData = {
      ...(event_type !== undefined && { event_type }),
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(due_date !== undefined && { due_date }),
      ...(priority !== undefined && { priority }),
      ...(status !== undefined && { status }),
      metadata: {
        ...existingEvent.metadata,
        ...metadata,
      },
      updated_at: new Date().toISOString(),
      updated_by: adminAuth.adminData.id,
    };

    // Update the timeline event
    const { data, error } = await supabaseAdmin
      .from("timeline_events")
      .update(updateData)
      .eq("id", eventId)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to update timeline event" },
        { status: 500 }
      );
    }

    // Update session activity
    const sessionToken = request.cookies.get("admin_session")?.value;
    if (sessionToken) {
      await updateSessionActivity(sessionToken);
    }

    return NextResponse.json({
      success: true,
      data,
      message: "Timeline event updated successfully",
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/timeline-events/[eventId] - Delete timeline event (admin only)
export async function DELETE(request, { params }) {
  try {
    const { eventId } = params;

    if (!isValidUUID(eventId)) {
      return NextResponse.json(
        { error: "Invalid event ID format" },
        { status: 400 }
      );
    }

    // Validate admin authentication and permissions
    const adminAuth = await requireAdminAuth(request, ["timeline.delete"]);

    if (!adminAuth.isAuthorized) {
      return adminAuth.response;
    }

    // Check if event exists
    const { data: existingEvent, error: fetchError } = await supabaseAdmin
      .from("timeline_events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        return NextResponse.json(
          { error: "Timeline event not found" },
          { status: 404 }
        );
      }
      console.error("Database error:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch timeline event" },
        { status: 500 }
      );
    }

    // Delete the timeline event (CASCADE will handle related notes)
    const { error } = await supabaseAdmin
      .from("timeline_events")
      .delete()
      .eq("id", eventId);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to delete timeline event" },
        { status: 500 }
      );
    }

    // Update session activity
    const sessionToken = request.cookies.get("admin_session")?.value;
    if (sessionToken) {
      await updateSessionActivity(sessionToken);
    }

    return NextResponse.json({
      success: true,
      message: "Timeline event deleted successfully",
      deletedEvent: {
        id: existingEvent.id,
        title: existingEvent.title,
        student_id: existingEvent.student_id,
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/timeline-events/[eventId] - Update event status (quick update)
export async function PATCH(request, { params }) {
  try {
    const { eventId } = params;

    if (!isValidUUID(eventId)) {
      return NextResponse.json(
        { error: "Invalid event ID format" },
        { status: 400 }
      );
    }

    // This endpoint can be used by both admins and users for status updates
    const adminAuth = await requireAdminAuth(request, ["timeline.update"]);
    const userAuth = adminAuth.isAuthorized
      ? null
      : await validateUserAuth(request);

    if (!adminAuth.isAuthorized && !userAuth?.isValid) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "status is required" },
        { status: 400 }
      );
    }

    const validStatuses = ["pending", "in_progress", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const client = adminAuth.isAuthorized ? supabaseAdmin : supabase;
    const userRestriction = adminAuth.isAuthorized
      ? {}
      : { student_id: userAuth.user.id };

    // Check if event exists and user has permission
    const { data: existingEvent, error: fetchError } = await client
      .from("timeline_events")
      .select("*")
      .eq("id", eventId)
      .match(userRestriction)
      .single();

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        return NextResponse.json(
          { error: "Timeline event not found or access denied" },
          { status: 404 }
        );
      }
      console.error("Database error:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch timeline event" },
        { status: 500 }
      );
    }

    // Update only the status
    const updateData = {
      status,
      updated_at: new Date().toISOString(),
      metadata: {
        ...existingEvent.metadata,
        status_updated_by: adminAuth.isAuthorized ? "admin" : "user",
        status_updated_at: new Date().toISOString(),
      },
    };

    const { data, error } = await client
      .from("timeline_events")
      .update(updateData)
      .eq("id", eventId)
      .match(userRestriction)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to update event status" },
        { status: 500 }
      );
    }

    // Update session activity if admin
    if (adminAuth.isAuthorized) {
      const sessionToken = request.cookies.get("admin_session")?.value;
      if (sessionToken) {
        await updateSessionActivity(sessionToken);
      }
    }

    return NextResponse.json({
      success: true,
      data,
      message: "Event status updated successfully",
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
