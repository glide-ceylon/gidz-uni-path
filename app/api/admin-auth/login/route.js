import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

// Create service role client for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper function to generate session token
const generateSessionToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Helper function to hash password (basic implementation)
const hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

// POST /api/admin-auth/login - Admin login
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, remember_me = false } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // For now, we'll use a simple password check
    // In production, you should use proper password hashing
    const validPasswords = {
      "admin@gidz-uni-path.com": "admin123",
      "manager@gidz-uni-path.com": "manager123",
      "staff@gidz-uni-path.com": "staff123",
    };

    // Check if admin exists and credentials are valid
    const { data: adminUser, error: adminError } = await supabaseAdmin
      .from("admin_users")
      .select("id, email, first_name, last_name, role, department, is_active")
      .eq("email", email.toLowerCase().trim())
      .eq("is_active", true)
      .single();

    if (adminError || !adminUser) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Password validation with fallback to Supabase Auth
    let isPasswordValid = false;

    // First check hardcoded passwords for demo users
    if (validPasswords[email] && validPasswords[email] === password) {
      isPasswordValid = true;
    } else {
      // If not in validPasswords, check with Supabase Auth
      try {
        const { data: authResult, error: authError } =
          await supabaseAdmin.auth.signInWithPassword({
            email: email,
            password: password,
          });

        if (authResult?.user && !authError) {
          isPasswordValid = true;
          // Immediately sign out the auth session since we're only validating credentials
          if (authResult.session) {
            await supabaseAdmin.auth.signOut();
          }
        }
      } catch (authValidationError) {
        console.log(
          "Supabase Auth validation failed:",
          authValidationError.message
        );
        // Continue with isPasswordValid = false
      }
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate session token
    const sessionToken = generateSessionToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + (remember_me ? 24 * 7 : 8)); // 7 days or 8 hours

    // Get client IP and user agent
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0]
      : request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Create admin session
    const { data: session, error: sessionError } = await supabaseAdmin
      .from("admin_sessions")
      .insert([
        {
          admin_id: adminUser.id,
          session_token: sessionToken,
          expires_at: expiresAt.toISOString(),
          ip_address: ip,
          user_agent: userAgent,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (sessionError) {
      console.error("Session creation error:", sessionError);
      return NextResponse.json(
        { error: "Failed to create session" },
        { status: 500 }
      );
    }

    // Update last login
    await supabaseAdmin
      .from("admin_users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", adminUser.id);

    // Get admin permissions
    const { data: permissions, error: permError } = await supabaseAdmin.rpc(
      "get_admin_permissions",
      { admin_email: adminUser.email }
    );

    const response = NextResponse.json({
      success: true,
      data: {
        admin: {
          id: adminUser.id,
          email: adminUser.email,
          first_name: adminUser.first_name,
          last_name: adminUser.last_name,
          role: adminUser.role,
          department: adminUser.department,
        },
        session: {
          token: sessionToken,
          expires_at: expiresAt.toISOString(),
        },
        permissions: permissions || [],
      },
      message: "Login successful",
    });

    // Set secure session cookie
    response.cookies.set("admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: expiresAt,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin-auth/login - Admin logout
export async function DELETE(request) {
  try {
    const sessionToken =
      request.cookies.get("admin_session")?.value ||
      request.headers.get("x-session-token");

    if (!sessionToken) {
      return NextResponse.json({ error: "No session found" }, { status: 400 });
    }

    // Deactivate session
    await supabaseAdmin
      .from("admin_sessions")
      .update({ is_active: false })
      .eq("session_token", sessionToken);

    const response = NextResponse.json({
      success: true,
      message: "Logout successful",
    });

    // Clear session cookie
    response.cookies.delete("admin_session");

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
