import { createClient } from "@supabase/supabase-js";

// Create service role client for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Validates admin session token and returns admin data with permissions
 * @param {Request} request - The incoming request object
 * @returns {Promise<{isValid: boolean, adminData: object|null, permissions: array}>}
 */
export async function validateAdminSession(request) {
  try {
    // Get session token from cookie or header
    let sessionToken = null;

    if (request.cookies && typeof request.cookies.get === "function") {
      // Next.js Request object
      sessionToken = request.cookies.get("admin_session")?.value;
    } else if (request.headers.get) {
      // Try header as fallback
      sessionToken = request.headers.get("x-session-token");
    }

    console.log(
      "🔍 Session validation - Token received:",
      sessionToken ? "Yes" : "No"
    );

    if (!sessionToken) {
      console.log("❌ No session token found");
      return { isValid: false, adminData: null, permissions: [] };
    }

    console.log("🔍 Looking up session in database...");
    // Validate session in database
    const { data: session, error: sessionError } = await supabaseAdmin
      .from("admin_sessions")
      .select(
        `
        id,
        admin_id,
        expires_at,
        is_active,
        admin_users (
          id,
          email,
          first_name,
          last_name,
          role,
          department,
          is_active,
          permissions
        )
      `
      )
      .eq("session_token", sessionToken)
      .eq("is_active", true)
      .single();

    if (sessionError || !session) {
      console.log(
        "❌ Session lookup failed:",
        sessionError?.message || "Session not found"
      );
      return { isValid: false, adminData: null, permissions: [] };
    }

    console.log("✅ Session found for admin:", session.admin_users?.email);

    // Check if session has expired
    const now = new Date();
    const expiresAt = new Date(session.expires_at);

    if (now > expiresAt) {
      console.log("❌ Session expired:", session.expires_at);
      // Deactivate expired session
      await supabaseAdmin
        .from("admin_sessions")
        .update({ is_active: false })
        .eq("id", session.id);

      return { isValid: false, adminData: null, permissions: [] };
    }

    // Check if admin user is still active
    if (!session.admin_users || !session.admin_users.is_active) {
      console.log("❌ Admin user not active or not found");
      return { isValid: false, adminData: null, permissions: [] };
    }

    console.log("🔍 Getting admin permissions...");

    // Get permissions from the user's permissions field or use role-based defaults
    let permissions = [];

    if (
      session.admin_users.permissions &&
      typeof session.admin_users.permissions === "object"
    ) {
      // Convert permissions object to array format expected by the system
      permissions = Object.keys(session.admin_users.permissions).filter(
        (key) => session.admin_users.permissions[key] === true
      );
      console.log("✅ Found permissions in user profile:", permissions);
    } else {
      // Fallback to role-based permissions
      console.log(
        "🔍 Using role-based permissions for role:",
        session.admin_users.role
      );
      switch (session.admin_users.role) {
        case "super_admin":
          permissions = [
            "timeline.read",
            "timeline.create",
            "timeline.update",
            "timeline.delete",
            "admin.read",
            "admin.create",
            "admin.update",
            "admin.delete",
            "can_manage_admins",
            "can_access_all_data",
          ];
          break;
        case "admin":
          permissions = [
            "timeline.read",
            "timeline.create",
            "timeline.update",
            "timeline.delete",
            "admin.read",
            "can_manage_timeline",
          ];
          break;
        case "manager":
          permissions = [
            "timeline.read",
            "timeline.update",
            "can_view_reports",
          ];
          break;
        case "staff":
          permissions = ["timeline.read", "can_view_basic_data"];
          break;
        default:
          permissions = ["timeline.read"];
      }
      console.log("✅ Using default permissions for role:", permissions);
    }

    console.log(
      "✅ Session validation successful, permissions:",
      permissions.length
    );
    return {
      isValid: true,
      adminData: session.admin_users,
      permissions: permissions,
    };
  } catch (error) {
    console.error("Session validation error:", error);
    return { isValid: false, adminData: null, permissions: [] };
  }
}

/**
 * Middleware-style function to protect admin routes
 * @param {Request} request - The incoming request object
 * @param {Array} requiredPermissions - Array of required permission names
 * @returns {Promise<{isAuthorized: boolean, adminData: object|null, permissions: array, response: Response|null}>}
 */
export async function requireAdminAuth(request, requiredPermissions = []) {
  const { isValid, adminData, permissions } = await validateAdminSession(
    request
  );

  if (!isValid) {
    return {
      isAuthorized: false,
      adminData: null,
      permissions: [],
      response: new Response(
        JSON.stringify({ error: "Unauthorized: Invalid or expired session" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      ),
    };
  }

  // Check if admin has required permissions
  if (requiredPermissions.length > 0) {
    const hasPermission = requiredPermissions.some((permission) =>
      permissions.includes(permission)
    );

    if (!hasPermission) {
      return {
        isAuthorized: false,
        adminData,
        permissions,
        response: new Response(
          JSON.stringify({
            error: "Forbidden: Insufficient permissions",
            required: requiredPermissions,
            current: permissions,
          }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        ),
      };
    }
  }

  return {
    isAuthorized: true,
    adminData,
    permissions,
    response: null,
  };
}

/**
 * Update session last activity
 * @param {string} sessionToken - The session token to update
 */
export async function updateSessionActivity(sessionToken) {
  try {
    await supabaseAdmin
      .from("admin_sessions")
      .update({ last_activity: new Date().toISOString() })
      .eq("session_token", sessionToken)
      .eq("is_active", true);
  } catch (error) {
    console.error("Failed to update session activity:", error);
  }
}

/**
 * Cleanup expired sessions
 */
export async function cleanupExpiredSessions() {
  try {
    const now = new Date().toISOString();
    await supabaseAdmin
      .from("admin_sessions")
      .update({ is_active: false })
      .lt("expires_at", now)
      .eq("is_active", true);
  } catch (error) {
    console.error("Failed to cleanup expired sessions:", error);
  }
}
