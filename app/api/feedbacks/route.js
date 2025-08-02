// Feedback Management API
import { supabase } from "../../../lib/supabase";
import { NextResponse } from "next/server";

// GET: Fetch feedbacks (with different access levels)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get("applicationId");
    const status = searchParams.get("status");
    const includePrivate = searchParams.get("includePrivate") === "true";

    let query = supabase
      .from("feedbacks")
      .select(
        `
        id,
        application_id,
        client_name,
        rating,
        title,
        message,
        program_type,
        university,
        allow_display_name,
        status,
        admin_notes,
        created_at,
        updated_at
      `
      )
      .order("created_at", { ascending: false });

    // Filter by application ID if provided (for client view)
    if (applicationId) {
      query = query.eq("application_id", applicationId);
    }

    // Filter by status if provided
    if (status) {
      query = query.eq("status", status);
    }

    // For public testimonials, only show approved feedbacks
    if (!includePrivate) {
      query = query.eq("status", "approved").eq("allow_display_name", true);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching feedbacks:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Create new feedback
export async function POST(request) {
  try {
    console.log("POST /api/feedbacks - Request received");
    const body = await request.json();
    console.log("Request body:", body);

    const {
      application_id,
      client_name,
      rating,
      title,
      message,
      program_type,
      university,
      allow_display_name = true,
    } = body;

    // Validation
    if (!application_id || !client_name || !rating || !title || !message) {
      console.log("Validation failed - missing required fields");
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: application_id, client_name, rating, title, message",
        },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      console.log("Validation failed - invalid rating:", rating);
      return NextResponse.json(
        { success: false, error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    console.log("Validation passed, inserting into database...");

    // Insert feedback
    const { data, error } = await supabase
      .from("feedbacks")
      .insert([
        {
          application_id,
          client_name,
          rating: parseInt(rating),
          title,
          message,
          program_type,
          university,
          allow_display_name,
          status: "pending", // Default status
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error creating feedback:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    console.log("Feedback created successfully:", data);
    return NextResponse.json({
      success: true,
      data,
      message:
        "Feedback submitted successfully! It will be reviewed by our team.",
    });
  } catch (error) {
    console.error("API Error in POST /api/feedbacks:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}

// PUT: Update feedback status (Admin only)
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, status, admin_notes } = body;

    // Basic validation
    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: id, status" },
        { status: 400 }
      );
    }

    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid status. Must be: pending, approved, or rejected",
        },
        { status: 400 }
      );
    }

    // Update feedback
    const { data, error } = await supabase
      .from("feedbacks")
      .update({
        status,
        admin_notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating feedback:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Feedback not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: `Feedback ${status} successfully!`,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Delete feedback (Admin only)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing feedback ID" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("feedbacks").delete().eq("id", id);

    if (error) {
      console.error("Error deleting feedback:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Feedback deleted successfully!",
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
