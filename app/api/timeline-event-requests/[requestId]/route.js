import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";
import { createClient } from "@supabase/supabase-js";

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

// Helper function to validate admin authentication
const validateAdminAuth = (request) => {
  const adminAuth = request.headers.get("x-admin-auth");
  const adminData = request.headers.get("x-admin-data");

  if (!adminAuth || adminAuth !== "true" || !adminData) {
    return { isValid: false, adminData: null };
  }

  try {
    const parsedAdminData = JSON.parse(adminData);
    return { isValid: true, adminData: parsedAdminData };
  } catch (error) {
    return { isValid: false, adminData: null };
  }
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

// PUT /api/timeline-event-requests/[requestId] - Update request status (admin) or request details (user)
export async function PUT(request, { params }) {
  try {
    const { requestId } = params;

    if (!isValidUUID(requestId)) {
      return NextResponse.json(
        { error: "Invalid request ID format" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Check admin authentication first
    const adminAuth = validateAdminAuth(request);

    if (adminAuth.isValid) {
      // Admin can update request status and add response
      const { status, admin_response } = body;

      if (!status) {
        return NextResponse.json(
          { error: "status is required for admin updates" },
          { status: 400 }
        );
      }

      const validStatuses = ["pending", "approved", "rejected"];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          {
            error: `Invalid status. Must be one of: ${validStatuses.join(
              ", "
            )}`,
          },
          { status: 400 }
        );
      }

      // Check if request exists
      const { data: existingRequest, error: fetchError } = await supabaseAdmin
        .from("timeline_event_requests")
        .select("*")
        .eq("id", requestId)
        .single();

      if (fetchError) {
        if (fetchError.code === "PGRST116") {
          return NextResponse.json(
            { error: "Event request not found" },
            { status: 404 }
          );
        }
        console.error("Database error:", fetchError);
        return NextResponse.json(
          { error: "Failed to fetch event request" },
          { status: 500 }
        );
      }

      // Update the request
      const updateData = {
        status,
        admin_response: admin_response || null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabaseAdmin
        .from("timeline_event_requests")
        .update(updateData)
        .eq("id", requestId)
        .select()
        .single();

      if (error) {
        console.error("Database error:", error);
        return NextResponse.json(
          { error: "Failed to update event request" },
          { status: 500 }
        );
      }

      // If approved, optionally create the timeline event
      let createdEvent = null;
      if (status === "approved") {
        const eventData = {
          application_id: existingRequest.application_id,
          event_type: "user_request",
          title: existingRequest.title,
          description: existingRequest.description,
          event_date: existingRequest.requested_date,
          status: "upcoming",
          category: existingRequest.category,
          created_by: "admin",
          metadata: {
            approved_from_request: requestId,
            approved_by_admin: adminAuth.adminData.email || "unknown",
            approved_at: new Date().toISOString(),
          },
        };

        const { data: eventResult, error: eventError } = await supabaseAdmin
          .from("timeline_events")
          .insert([eventData])
          .select()
          .single();

        if (!eventError) {
          createdEvent = eventResult;
        }
      }

      return NextResponse.json({
        success: true,
        data,
        createdEvent,
        message: `Event request ${status} successfully`,
      });
    }

    // Check user authentication for user updates
    const userAuth = await validateUserAuth(request);

    if (!userAuth.isValid) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // User can only update their own pending requests
    const { title, description, requested_date, category, priority } = body;

    // Check if request exists and belongs to user
    const { data: existingRequest, error: fetchError } = await supabase
      .from("timeline_event_requests")
      .select("*")
      .eq("id", requestId)
      .eq("application_id", userAuth.user.id)
      .eq("status", "pending") // Only pending requests can be edited
      .single();

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        return NextResponse.json(
          { error: "Event request not found or cannot be edited" },
          { status: 404 }
        );
      }
      console.error("Database error:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch event request" },
        { status: 500 }
      );
    }

    // Validate enum values if provided
    const validCategories = [
      "academic",
      "visa",
      "personal",
      "university",
      "documentation",
    ];
    const validPriorities = ["low", "medium", "high"];

    if (category && !validCategories.includes(category)) {
      return NextResponse.json(
        {
          error: `Invalid category. Must be one of: ${validCategories.join(
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

    // Validate date if provided
    let parsedDate = existingRequest.requested_date;
    if (requested_date !== undefined) {
      if (requested_date) {
        parsedDate = new Date(requested_date);
        if (isNaN(parsedDate.getTime())) {
          return NextResponse.json(
            { error: "Invalid date format for requested_date" },
            { status: 400 }
          );
        }
        if (parsedDate < new Date()) {
          return NextResponse.json(
            { error: "requested_date must be in the future" },
            { status: 400 }
          );
        }
        parsedDate = parsedDate.toISOString();
      } else {
        parsedDate = null;
      }
    }

    // Prepare update data
    const updateData = {
      ...(title !== undefined && { title: title.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(requested_date !== undefined && { requested_date: parsedDate }),
      ...(category !== undefined && { category }),
      ...(priority !== undefined && { priority }),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("timeline_event_requests")
      .update(updateData)
      .eq("id", requestId)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to update event request" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: "Event request updated successfully",
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/timeline-event-requests/[requestId] - Delete request (user can delete own pending requests)
export async function DELETE(request, { params }) {
  try {
    const { requestId } = params;

    if (!isValidUUID(requestId)) {
      return NextResponse.json(
        { error: "Invalid request ID format" },
        { status: 400 }
      );
    }

    // Check if admin (can delete any request) or user (can delete own pending requests)
    const adminAuth = validateAdminAuth(request);

    if (adminAuth.isValid) {
      // Admin can delete any request
      const { data: existingRequest, error: fetchError } = await supabaseAdmin
        .from("timeline_event_requests")
        .select("*")
        .eq("id", requestId)
        .single();

      if (fetchError) {
        if (fetchError.code === "PGRST116") {
          return NextResponse.json(
            { error: "Event request not found" },
            { status: 404 }
          );
        }
        console.error("Database error:", fetchError);
        return NextResponse.json(
          { error: "Failed to fetch event request" },
          { status: 500 }
        );
      }

      const { error } = await supabaseAdmin
        .from("timeline_event_requests")
        .delete()
        .eq("id", requestId);

      if (error) {
        console.error("Database error:", error);
        return NextResponse.json(
          { error: "Failed to delete event request" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Event request deleted successfully",
        deletedRequest: {
          id: existingRequest.id,
          title: existingRequest.title,
          application_id: existingRequest.application_id,
        },
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

    // User can only delete their own pending requests
    const { data: existingRequest, error: fetchError } = await supabase
      .from("timeline_event_requests")
      .select("*")
      .eq("id", requestId)
      .eq("application_id", userAuth.user.id)
      .eq("status", "pending") // Only pending requests can be deleted
      .single();

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        return NextResponse.json(
          { error: "Event request not found or cannot be deleted" },
          { status: 404 }
        );
      }
      console.error("Database error:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch event request" },
        { status: 500 }
      );
    }

    const { error } = await supabase
      .from("timeline_event_requests")
      .delete()
      .eq("id", requestId);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to delete event request" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Event request deleted successfully",
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
