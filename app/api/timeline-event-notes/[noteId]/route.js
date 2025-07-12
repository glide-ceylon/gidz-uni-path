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

// GET /api/timeline-event-notes/[noteId] - Get specific note
export async function GET(request, { params }) {
  try {
    const { noteId } = params;

    if (!isValidUUID(noteId)) {
      return NextResponse.json(
        { error: "Invalid note ID format" },
        { status: 400 }
      );
    }

    // Check admin authentication first
    const adminAuth = validateAdminAuth(request);

    if (adminAuth.isValid) {
      // Admin can view any note
      const { data, error } = await supabaseAdmin
        .from("timeline_event_notes")
        .select(
          `
          *,
          timeline_events(id, title, application_id),
          applications(id, first_name, last_name, email)
        `
        )
        .eq("id", noteId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return NextResponse.json(
            { error: "Note not found" },
            { status: 404 }
          );
        }
        console.error("Database error:", error);
        return NextResponse.json(
          { error: "Failed to fetch note" },
          { status: 500 }
        );
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

    // User can only view notes for their own application
    const { data, error } = await supabase
      .from("timeline_event_notes")
      .select(
        `
        *,
        timeline_events(id, title)
      `
      )
      .eq("id", noteId)
      .eq("application_id", userAuth.user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Note not found or access denied" },
          { status: 404 }
        );
      }
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch note" },
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

// PUT /api/timeline-event-notes/[noteId] - Update note
export async function PUT(request, { params }) {
  try {
    const { noteId } = params;

    if (!isValidUUID(noteId)) {
      return NextResponse.json(
        { error: "Invalid note ID format" },
        { status: 400 }
      );
    }

    // Both admin and user can update notes
    const adminAuth = validateAdminAuth(request);
    const userAuth = adminAuth.isValid ? null : await validateUserAuth(request);

    if (!adminAuth.isValid && !userAuth?.isValid) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { note_text, is_private } = body;

    if (!note_text) {
      return NextResponse.json(
        { error: "note_text is required" },
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

    // Check if note exists and user has permission
    let noteQuery = client
      .from("timeline_event_notes")
      .select("*")
      .eq("id", noteId);

    // If user, restrict to their own notes
    if (!adminAuth.isValid) {
      noteQuery = noteQuery.eq("application_id", userAuth.user.id);
    }

    const { data: existingNote, error: fetchError } = await noteQuery.single();

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        return NextResponse.json(
          { error: "Note not found or access denied" },
          { status: 404 }
        );
      }
      console.error("Database error:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch note" },
        { status: 500 }
      );
    }

    // Prepare update data
    const updateData = {
      note_text: note_text.trim(),
      ...(is_private !== undefined && { is_private: Boolean(is_private) }),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await client
      .from("timeline_event_notes")
      .update(updateData)
      .eq("id", noteId)
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
        { error: "Failed to update note" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: "Note updated successfully",
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/timeline-event-notes/[noteId] - Delete note
export async function DELETE(request, { params }) {
  try {
    const { noteId } = params;

    if (!isValidUUID(noteId)) {
      return NextResponse.json(
        { error: "Invalid note ID format" },
        { status: 400 }
      );
    }

    // Both admin and user can delete notes
    const adminAuth = validateAdminAuth(request);
    const userAuth = adminAuth.isValid ? null : await validateUserAuth(request);

    if (!adminAuth.isValid && !userAuth?.isValid) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const client = adminAuth.isValid ? supabaseAdmin : supabase;

    // Check if note exists and user has permission
    let noteQuery = client
      .from("timeline_event_notes")
      .select("*")
      .eq("id", noteId);

    // If user, restrict to their own notes
    if (!adminAuth.isValid) {
      noteQuery = noteQuery.eq("application_id", userAuth.user.id);
    }

    const { data: existingNote, error: fetchError } = await noteQuery.single();

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        return NextResponse.json(
          { error: "Note not found or access denied" },
          { status: 404 }
        );
      }
      console.error("Database error:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch note" },
        { status: 500 }
      );
    }

    // Delete the note
    const { error } = await client
      .from("timeline_event_notes")
      .delete()
      .eq("id", noteId);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to delete note" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Note deleted successfully",
      deletedNote: {
        id: existingNote.id,
        note_text: existingNote.note_text.substring(0, 50) + "...",
        event_id: existingNote.event_id,
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
