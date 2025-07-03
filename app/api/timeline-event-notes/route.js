import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
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

// GET /api/timeline-event-notes - Get notes for specific event or application
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");
    const applicationId = searchParams.get("applicationId");

    if (!eventId && !applicationId) {
      return NextResponse.json(
        { error: "Either eventId or applicationId is required" },
        { status: 400 }
      );
    }

    if (eventId && !isValidUUID(eventId)) {
      return NextResponse.json(
        { error: "Invalid event ID format" },
        { status: 400 }
      );
    }

    if (applicationId && !isValidUUID(applicationId)) {
      return NextResponse.json(
        { error: "Invalid application ID format" },
        { status: 400 }
      );
    }

    // Check admin authentication first
    const adminAuth = validateAdminAuth(request);

    if (adminAuth.isValid) {
      // Admin can view all notes
      let query = supabaseAdmin
        .from("timeline_event_notes")
        .select(
          `
          *,
          timeline_events(id, title, application_id),
          applications(id, first_name, last_name, email)
        `
        )
        .order("created_at", { ascending: false });

      if (eventId) {
        query = query.eq("event_id", eventId);
      } else if (applicationId) {
        query = query.eq("application_id", applicationId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Database error:", error);
        return NextResponse.json(
          { error: "Failed to fetch event notes" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data,
        metadata: {
          total: data.length,
          requestedBy: "admin",
          eventId,
          applicationId,
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

    // User can only view notes for their own events/application
    let query = supabase
      .from("timeline_event_notes")
      .select(
        `
        *,
        timeline_events(id, title)
      `
      )
      .eq("application_id", userAuth.user.id)
      .order("created_at", { ascending: false });

    if (eventId) {
      // Verify the event belongs to the user
      const { data: eventCheck, error: eventError } = await supabase
        .from("timeline_events")
        .select("id")
        .eq("id", eventId)
        .eq("application_id", userAuth.user.id)
        .single();

      if (eventError || !eventCheck) {
        return NextResponse.json(
          { error: "Event not found or access denied" },
          { status: 404 }
        );
      }

      query = query.eq("event_id", eventId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch event notes" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      metadata: {
        total: data.length,
        requestedBy: "user",
        eventId,
        applicationId: userAuth.user.id,
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

// POST /api/timeline-event-notes - Create new note
export async function POST(request) {
  try {
    // Both admin and user can create notes
    const adminAuth = validateAdminAuth(request);
    const userAuth = adminAuth.isValid ? null : await validateUserAuth(request);

    if (!adminAuth.isValid && !userAuth?.isValid) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const { event_id, note_text, is_private = true } = body;

    if (!event_id || !note_text) {
      return NextResponse.json(
        { error: "event_id and note_text are required" },
        { status: 400 }
      );
    }

    if (!isValidUUID(event_id)) {
      return NextResponse.json(
        { error: "Invalid event ID format" },
        { status: 400 }
      );
    }

    if (typeof note_text !== "string" || note_text.trim().length === 0) {
      return NextResponse.json(
        { error: "note_text must be a non-empty string" },
        { status: 400 }
      );
    }

    const client = adminAuth.isValid ? supabaseAdmin : supabase;

    // Verify the event exists and get application_id
    let eventQuery = client
      .from("timeline_events")
      .select("id, application_id")
      .eq("id", event_id);

    // If user, restrict to their own events
    if (!adminAuth.isValid) {
      eventQuery = eventQuery.eq("application_id", userAuth.user.id);
    }

    const { data: event, error: eventError } = await eventQuery.single();

    if (eventError) {
      if (eventError.code === "PGRST116") {
        return NextResponse.json(
          { error: "Event not found or access denied" },
          { status: 404 }
        );
      }
      console.error("Database error:", eventError);
      return NextResponse.json(
        { error: "Failed to verify event" },
        { status: 500 }
      );
    }

    // Create the note
    const noteData = {
      event_id,
      application_id: event.application_id,
      note_text: note_text.trim(),
      is_private: Boolean(is_private),
    };

    const { data, error } = await client
      .from("timeline_event_notes")
      .insert([noteData])
      .select(
        `
        *,
        timeline_events(id, title)
      `
      )
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to create note" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data,
        message: "Note created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
