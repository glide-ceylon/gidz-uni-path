# Staff Assignment Dropdown Troubleshooting

## Issue: No staff members appear in the assignment dropdown

### Debugging Steps Added

I've added comprehensive debugging to help identify the issue:

1. **Console Logging**: Added detailed console logs to track the API call and response
2. **Visual Indicators**: Added error message when no staff members are available
3. **Debug Information**: Logs current user and staff members state

### How to Debug

1. **Open Browser Console** (F12)

2. **Login as Admin User** (not staff):

   - `thushanjana@gmail.com` (super_admin)
   - `admin@gidz-uni-path.com` (super_admin)
   - `manager@gidz-uni-path.com` (admin)

3. **Navigate to Student Applications** page

4. **Click "Assign Staff"** button on any student

5. **Check Console Output**:
   - Look for "🔍 Fetching staff members..."
   - Check the response status and data
   - See what staff members are being rendered

### Expected Console Output

```
🔍 Fetching staff members...
📡 Response status: 200
📊 Response data: { success: true, staff: [...] }
✅ Setting staff members: [...]
🔍 Opening assignment modal for student: {...}
🔍 Current staff members: [...]
🔍 Current user: {...}
🔍 Rendering staff members: [...]
```

### Common Issues and Solutions

#### 1. **Authentication Issues**

**Symptoms**: Response status 401
**Solution**:

- Ensure you're logged in as admin/super_admin (not staff)
- Check if session is valid
- Clear cookies and re-login

#### 2. **Role Restriction**

**Symptoms**: Staff fetch doesn't trigger
**Solution**:

- Verify currentUser.role is not "staff"
- Staff users cannot assign students (by design)

#### 3. **API Endpoint Issues**

**Symptoms**: Response status 404 or 500
**Solution**:

- Check if `/api/admin/staff/route.js` exists
- Verify API route is properly configured
- Check server logs

#### 4. **Database Issues**

**Symptoms**: Empty staff array despite users existing
**Solution**:

- Run: `node scripts/debug-staff-api.js`
- Verify admin_users table has active users
- Check database permissions

### Manual API Test

Copy and paste this into browser console (after logging in):

```javascript
fetch("/api/admin/staff", {
  method: "GET",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
})
  .then((res) => res.json())
  .then((data) => console.log("API Response:", data))
  .catch((err) => console.error("API Error:", err));
```

### Quick Fixes

#### 1. **Force Refresh Staff List**

Add this temporary button to test:

```jsx
<button
  onClick={() => {
    console.log("🔄 Force refreshing staff list...");
    fetchStaffMembers();
  }}
>
  Refresh Staff List
</button>
```

#### 2. **Check State Values**

Add this to see current state:

```jsx
<div>
  <p>Current User Role: {currentUser?.role}</p>
  <p>Staff Members Count: {staffMembers.length}</p>
  <p>Staff Members: {JSON.stringify(staffMembers)}</p>
</div>
```

### Next Steps

1. **Follow the debugging steps** above
2. **Check the console output** when opening the modal
3. **Share the console logs** if the issue persists
4. **Test the manual API call** to isolate the problem

The database contains 5 active staff members, so the issue is likely in the frontend API call or authentication.
