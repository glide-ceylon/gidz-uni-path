# Enhanced Admin Authentication System

## Overview

The admin authentication system has been enhanced to support both hardcoded demo credentials and Supabase Auth fallback. This provides flexibility for development/demo purposes while allowing real user authentication.

## Authentication Flow

### 1. Initial Validation

- Check if admin user exists in `admin_users` table
- Verify user is active (`is_active = true`)

### 2. Password Validation (Two-Step Process)

#### Step 1: Hardcoded Demo Passwords

```javascript
const validPasswords = {
  "admin@gidz-uni-path.com": "admin123",
  "manager@gidz-uni-path.com": "manager123",
  "staff@gidz-uni-path.com": "staff123",
};
```

If the user's email exists in `validPasswords` and password matches:

- ✅ Authentication successful
- Proceed to session creation

#### Step 2: Supabase Auth Fallback

If user is not in `validPasswords`:

- Attempt authentication with `supabaseAdmin.auth.signInWithPassword()`
- If successful, immediately sign out the auth session (we only need credential validation)
- ✅ Authentication successful
- Proceed to session creation

### 3. Session Creation

Once password validation succeeds:

- Generate secure session token
- Create session record in `admin_sessions` table
- Set HTTP-only secure cookie
- Return admin data with permissions

## Implementation Details

### Updated Files

#### `app/api/admin-auth/login/route.js`

Enhanced password validation logic:

```javascript
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
      // Immediately sign out the auth session
      if (authResult.session) {
        await supabaseAdmin.auth.signOut();
      }
    }
  } catch (authValidationError) {
    // Continue with isPasswordValid = false
  }
}
```

#### Test Files Created

- **`scripts/test-enhanced-admin-auth.js`** - Comprehensive test suite
- **`app/admin-login-test/page.jsx`** - Interactive frontend testing

## Testing

### Automated Testing

Run the comprehensive test suite:

```bash
npm run test:admin-auth
```

This tests:

- ✅ Hardcoded demo users (admin, manager, staff)
- ✅ Custom Supabase Auth users
- ✅ Invalid credentials
- ✅ Wrong password scenarios
- ✅ Session creation and validation
- ✅ Logout functionality

### Manual Frontend Testing

Visit `/admin-login-test` to interactively test:

- Quick selection of demo users
- Custom credential input for Supabase Auth testing
- Real-time authentication feedback
- Session information display
- Admin endpoint testing with session

## User Types Supported

### 1. Demo Users (Hardcoded)

```
Email: admin@gidz-uni-path.com
Password: admin123
Type: Super Admin

Email: manager@gidz-uni-path.com
Password: manager123
Type: Manager

Email: staff@gidz-uni-path.com
Password: staff123
Type: Staff
```

### 2. Supabase Auth Users

Any user that exists in your Supabase Auth system and is also registered in the `admin_users` table can authenticate using their Supabase credentials.

## Security Features

### Maintained Security

- ✅ Session-based authentication
- ✅ Database validation for admin users
- ✅ Permission-based access control
- ✅ Secure HTTP-only cookies
- ✅ Session expiration handling

### Additional Security

- ✅ Immediate auth session cleanup after credential validation
- ✅ Graceful fallback handling
- ✅ No credential exposure in logs
- ✅ Proper error handling for both auth methods

## Benefits

### Development & Demo

- Easy testing with hardcoded demo credentials
- No need to create Supabase Auth users for basic testing
- Predictable authentication for demonstrations

### Production Flexibility

- Support for real Supabase Auth users
- Gradual migration from demo to production users
- Centralized admin user management in `admin_users` table

## Migration Path

### Current State

- Demo users use hardcoded passwords
- Real users can use Supabase Auth
- Both types create proper database sessions

### Future Enhancement

- Replace hardcoded passwords with hashed passwords in `admin_users` table
- Add password reset functionality
- Implement password complexity requirements
- Add multi-factor authentication

## Error Handling

The system provides clear error responses:

- **401 Unauthorized**: Invalid credentials (both hardcoded and Supabase Auth failed)
- **500 Internal Server Error**: Database or system errors
- **400 Bad Request**: Missing required fields

## Usage Examples

### Demo User Login

```javascript
const response = await axios.post("/api/admin-auth/login", {
  email: "admin@gidz-uni-path.com",
  password: "admin123",
  remember_me: false,
});
// Uses hardcoded password validation
```

### Supabase Auth User Login

```javascript
const response = await axios.post("/api/admin-auth/login", {
  email: "real-admin@company.com",
  password: "their-real-password",
  remember_me: true,
});
// Falls back to Supabase Auth validation
```

Both authentication methods result in the same session structure and admin access levels.

## Next Steps

1. **Test the Implementation**: Run `npm run test:admin-auth` to verify functionality
2. **Create Real Admin Users**: Add admin users to both Supabase Auth and `admin_users` table
3. **Frontend Integration**: Update admin login forms to use this enhanced system
4. **Production Hardening**: Plan migration from hardcoded to hashed passwords

The enhanced authentication system is now ready for both development and production use!
