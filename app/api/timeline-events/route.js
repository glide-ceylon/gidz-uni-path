import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { createClient } from "@supabase/supabase-js";
import {
  requireAdminAuth,
  updateSessionActivity,
} from "../../../lib/adminAuth";

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

// GET /api/timeline-events - Get all timeline events (user) or filtered events (admin)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId =
      searchParams.get("application_id") || searchParams.get("student_id"); // Support both for compatibility
    const eventType = searchParams.get("event_type");
    const status = searchParams.get("status");

    // Check if this is an admin request
    const adminAuth = await requireAdminAuth(request, ["timeline.read"]);

    if (adminAuth.isAuthorized) {
      // Admin request - can view all events with filters
      let query = supabaseAdmin
        .from("timeline_events")
        .select("*")
        .order("created_at", { ascending: false });

      if (applicationId) {
        if (!isValidUUID(applicationId)) {
          return NextResponse.json(
            { error: "Invalid application ID format" },
            { status: 400 }
          );
        }
        query = query.eq("application_id", applicationId);
      }

      if (eventType) {
        query = query.eq("event_type", eventType);
      }

      if (status) {
        query = query.eq("status", status);
      }

      const { data: events, error } = await query;

      if (error) {
        console.error("Database error:", error);
        return NextResponse.json(
          { error: "Failed to fetch timeline events" },
          { status: 500 }
        );
      }

      // Update session activity
      const sessionToken = request.cookies.get("admin_session")?.value;
      if (sessionToken) {
        await updateSessionActivity(sessionToken);
      }

      return NextResponse.json({
        data: events,
        count: events.length,
        message: "Timeline events retrieved successfully",
      });
    }

    // User request - validate user authentication
    const { isValid: isUserValid, user } = await validateUserAuth(request);

    if (!isUserValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get events for the authenticated user only
    const { data: events, error } = await supabase
      .from("timeline_events")
      .select("*")
      .eq("application_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch timeline events" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: events,
      count: events.length,
      message: "Timeline events retrieved successfully",
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/timeline-events - Create a new timeline event (admin only)
export async function POST(request) {
  try {
    // Validate admin authentication and permissions
    const adminAuth = await requireAdminAuth(request, ["timeline.create"]);

    if (!adminAuth.isAuthorized) {
      return adminAuth.response;
    }

    const body = await request.json();
    const {
      student_id, // For backward compatibility
      application_id, // New field name to match database
      event_type,
      title,
      description,
      due_date, // Map to event_date in database
      event_date, // Direct database field
      priority = "medium",
      status = "pending",
      metadata = {},
    } = body;

    // Use application_id if provided, otherwise fall back to student_id for compatibility
    const finalApplicationId = application_id || student_id;

    // Validate required fields
    if (!finalApplicationId || !event_type || !title) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: application_id (or student_id), event_type, title",
        },
        { status: 400 }
      );
    }

    // Validate application_id format
    if (!isValidUUID(finalApplicationId)) {
      return NextResponse.json(
        { error: "Invalid application ID format" },
        { status: 400 }
      );
    }

    // Validate event_type - based on database table structure
    const validEventTypes = ["system", "admin_custom", "user_request"];

    if (!validEventTypes.includes(event_type)) {
      return NextResponse.json(
        {
          error: `Invalid event_type. Must be one of: ${validEventTypes.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    // Note: Priority is not in the database schema, so we'll skip that validation

    // Validate status - based on database constraints
    const validStatuses = ["completed", "in_progress", "upcoming", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Use event_date if provided, otherwise use due_date for compatibility
    const finalEventDate = event_date || due_date;

    // Validate event_date format if provided
    if (finalEventDate) {
      const parsedDate = new Date(finalEventDate);
      if (isNaN(parsedDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid event_date format. Use ISO 8601 format" },
          { status: 400 }
        );
      }
    }

    // Create the timeline event
    const { data: newEvent, error } = await supabaseAdmin
      .from("timeline_events")
      .insert([
        {
          application_id: finalApplicationId,
          event_type,
          title,
          description,
          event_date: finalEventDate,
          status,
          metadata,
          created_by: "admin", // String value as per database constraint
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to create timeline event" },
        { status: 500 }
      );
    }

    // Update session activity
    const sessionToken = request.cookies.get("admin_session")?.value;
    if (sessionToken) {
      await updateSessionActivity(sessionToken);
    }

    return NextResponse.json(
      {
        data: newEvent,
        message: "Timeline event created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/timeline-events - Bulk update timeline events (admin only)
export async function PUT(request) {
  try {
    // Validate admin authentication and permissions
    const adminAuth = await requireAdminAuth(request, ["timeline.update"]);

    if (!adminAuth.isAuthorized) {
      return adminAuth.response;
    }

    const body = await request.json();
    const { event_ids, updates } = body;

    // Validate required fields
    if (!Array.isArray(event_ids) || event_ids.length === 0 || !updates) {
      return NextResponse.json(
        {
          error: "Missing required fields: event_ids (array), updates (object)",
        },
        { status: 400 }
      );
    }

    // Validate all event IDs
    for (const id of event_ids) {
      if (!isValidUUID(id)) {
        return NextResponse.json(
          { error: `Invalid event ID format: ${id}` },
          { status: 400 }
        );
      }
    }

    // Validate updates object
    const allowedFields = [
      "event_type",
      "title",
      "description",
      "due_date",
      "priority",
      "status",
      "metadata",
    ];

    const updateFields = Object.keys(updates);
    const invalidFields = updateFields.filter(
      (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return NextResponse.json(
        {
          error: `Invalid update fields: ${invalidFields.join(
            ", "
          )}. Allowed: ${allowedFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Add updated_at timestamp and updated_by
    const finalUpdates = {
      ...updates,
      updated_at: new Date().toISOString(),
      updated_by: adminAuth.adminData.id,
    };

    // Perform bulk update
    const { data: updatedEvents, error } = await supabaseAdmin
      .from("timeline_events")
      .update(finalUpdates)
      .in("id", event_ids)
      .select();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to update timeline events" },
        { status: 500 }
      );
    }

    // Update session activity
    const sessionToken = request.cookies.get("admin_session")?.value;
    if (sessionToken) {
      await updateSessionActivity(sessionToken);
    }

    return NextResponse.json({
      data: updatedEvents,
      count: updatedEvents.length,
      message: `Successfully updated ${updatedEvents.length} timeline events`,
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/timeline-events - Bulk delete timeline events (admin only)
export async function DELETE(request) {
  try {
    // Validate admin authentication and permissions
    const adminAuth = await requireAdminAuth(request, ["timeline.delete"]);

    if (!adminAuth.isAuthorized) {
      return adminAuth.response;
    }

    const { searchParams } = new URL(request.url);
    const eventIdsParam = searchParams.get("event_ids");

    if (!eventIdsParam) {
      return NextResponse.json(
        { error: "Missing required parameter: event_ids (comma-separated)" },
        { status: 400 }
      );
    }

    const eventIds = eventIdsParam.split(",").map((id) => id.trim());

    // Validate all event IDs
    for (const id of eventIds) {
      if (!isValidUUID(id)) {
        return NextResponse.json(
          { error: `Invalid event ID format: ${id}` },
          { status: 400 }
        );
      }
    }

    // Delete the events
    const { data: deletedEvents, error } = await supabaseAdmin
      .from("timeline_events")
      .delete()
      .in("id", eventIds)
      .select();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to delete timeline events" },
        { status: 500 }
      );
    }

    // Update session activity
    const sessionToken = request.cookies.get("admin_session")?.value;
    if (sessionToken) {
      await updateSessionActivity(sessionToken);
    }

    return NextResponse.json({
      data: deletedEvents,
      count: deletedEvents.length,
      message: `Successfully deleted ${deletedEvents.length} timeline events`,
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
