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

// GET /api/timeline-event-requests - Get all requests (admin) or user's requests
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get("applicationId");
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");

    // Check admin authentication first
    const adminAuth = validateAdminAuth(request);

    if (adminAuth.isValid) {
      // Admin can view all requests with filtering
      let query = supabaseAdmin
        .from("timeline_event_requests")
        .select(
          `
          *,
          applications!timeline_event_requests_application_id_fkey(id, first_name, last_name, email)
        `
        )
        .order("created_at", { ascending: false });

      // Apply filters
      if (applicationId) {
        if (!isValidUUID(applicationId)) {
          return NextResponse.json(
            { error: "Invalid application ID format" },
            { status: 400 }
          );
        }
        query = query.eq("application_id", applicationId);
      }

      if (status) {
        const validStatuses = ["pending", "approved", "rejected"];
        if (!validStatuses.includes(status)) {
          return NextResponse.json(
            {
              error: `Invalid status filter. Must be one of: ${validStatuses.join(
                ", "
              )}`,
            },
            { status: 400 }
          );
        }
        query = query.eq("status", status);
      }

      if (priority) {
        const validPriorities = ["low", "medium", "high"];
        if (!validPriorities.includes(priority)) {
          return NextResponse.json(
            {
              error: `Invalid priority filter. Must be one of: ${validPriorities.join(
                ", "
              )}`,
            },
            { status: 400 }
          );
        }
        query = query.eq("priority", priority);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Database error:", error);
        return NextResponse.json(
          { error: "Failed to fetch event requests" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data,
        metadata: {
          total: data.length,
          requestedBy: "admin",
          filters: { applicationId, status, priority },
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

    // User can only view their own requests
    const userApplicationId = applicationId || userAuth.user.id;

    if (applicationId && applicationId !== userAuth.user.id) {
      return NextResponse.json(
        { error: "Access denied: Can only view your own event requests" },
        { status: 403 }
      );
    }

    let query = supabase
      .from("timeline_event_requests")
      .select("*")
      .eq("application_id", userApplicationId)
      .order("created_at", { ascending: false });

    // Apply status filter if provided
    if (status) {
      const validStatuses = ["pending", "approved", "rejected"];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          {
            error: `Invalid status filter. Must be one of: ${validStatuses.join(
              ", "
            )}`,
          },
          { status: 400 }
        );
      }
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch event requests" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      metadata: {
        total: data.length,
        requestedBy: "user",
        applicationId: userApplicationId,
        filters: { status },
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

// POST /api/timeline-event-requests - Create new event request (user)
export async function POST(request) {
  try {
    // Validate user authentication (only users can create requests)
    const userAuth = await validateUserAuth(request);

    if (!userAuth.isValid) {
      return NextResponse.json(
        { error: "User authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const {
      title,
      description,
      requested_date,
      category,
      priority = "medium",
    } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "title and description are required" },
        { status: 400 }
      );
    }

    // Validate enum values
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

    if (!validPriorities.includes(priority)) {
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
    let parsedDate = null;
    if (requested_date) {
      parsedDate = new Date(requested_date);
      if (isNaN(parsedDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid date format for requested_date" },
          { status: 400 }
        );
      }
      // Check if date is in the future
      if (parsedDate < new Date()) {
        return NextResponse.json(
          { error: "requested_date must be in the future" },
          { status: 400 }
        );
      }
    }

    // Create the event request
    const requestData = {
      application_id: userAuth.user.id,
      requested_by: userAuth.user.id,
      title: title.trim(),
      description: description.trim(),
      requested_date: parsedDate ? parsedDate.toISOString() : null,
      category,
      priority,
      status: "pending",
    };

    const { data, error } = await supabase
      .from("timeline_event_requests")
      .insert([requestData])
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to create event request" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data,
        message: "Event request created successfully",
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
