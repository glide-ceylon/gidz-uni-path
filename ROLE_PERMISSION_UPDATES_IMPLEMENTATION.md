# Role-Based Permission Updates Implementation

## Overview

The admin management system now automatically updates user permissions when their role is changed. This ensures that users always have the appropriate permissions for their assigned role without manual intervention.

## Features Implemented

### 1. Automatic Permission Updates

- **When**: Permissions are automatically updated whenever an admin's role is changed
- **How**: The system uses predefined permission sets for each role
- **Safety**: Only updates permissions if no custom permissions are explicitly provided

### 2. Visual Feedback

- **Edit Modal**: Shows a notification when role is being changed, indicating permission updates
- **Success Messages**: Detailed feedback about role changes and permission updates
- **Create Modal**: Information about automatic permission assignment

### 3. Centralized Permission Management

- **Utility Functions**: Added to `lib/adminAuth.js` for consistent permission handling
- **Single Source of Truth**: All permission definitions are centralized
- **Maintainability**: Easy to update permissions across the entire application

## Permission Structure by Role

### Super Admin

```json
{
  "timeline.read": true,
  "timeline.create": true,
  "timeline.update": true,
  "timeline.delete": true,
  "admin.read": true,
  "admin.create": true,
  "admin.update": true,
  "admin.delete": true,
  "can_manage_admins": true,
  "can_access_all_data": true
}
```

### Admin

```json
{
  "timeline.read": true,
  "timeline.create": true,
  "timeline.update": true,
  "timeline.delete": true,
  "admin.read": true,
  "can_manage_timeline": true
}
```

### Manager

```json
{
  "timeline.read": true,
  "timeline.create": true,
  "timeline.update": true,
  "admin.read": true,
  "can_manage_timeline": true
}
```

### Staff (Student Visa Consultant)

```json
{
  "timeline.read": true,
  "can_view_basic_data": true
}
```

### Finance Manager

```json
{
  "applications.read": true,
  "can_view_applications": true
}
```

## API Changes

### Updated Files

1. **`app/api/admin-users/[id]/route.js`**

   - Added automatic permission updates on role change
   - Integrated centralized permission management
   - Added logging for permission updates

2. **`app/api/admin-users/route.js`**

   - Updated to use centralized permission utilities
   - Consistent permission assignment during creation

3. **`lib/adminAuth.js`**
   - Added `getDefaultPermissions(role)` utility function
   - Added `shouldUpdatePermissions(oldRole, newRole)` helper
   - Added `getRoleInfo(role)` for role metadata

### API Behavior

- **Role Update with No Custom Permissions**: Automatically assigns default permissions for the new role
- **Role Update with Custom Permissions**: Respects the provided custom permissions
- **New Admin Creation**: Automatically assigns default permissions based on role

## Frontend Changes

### Admin Management Page (`app/admin/admins/page.jsx`)

1. **Enhanced Update Feedback**

   - Shows detailed success messages for role changes
   - Indicates when permissions have been updated
   - Auto-dismisses messages after 5 seconds

2. **Visual Indicators**

   - Edit modal shows permission update notice when role changes
   - Create modal explains automatic permission assignment
   - Real-time feedback about permission implications

3. **User Experience Improvements**
   - Clear indication of role changes and their effects
   - Informative help text about permission assignments
   - Better error handling and user feedback

## Usage Examples

### Creating a New Admin

```javascript
// When creating an admin with role 'manager'
const newAdmin = {
  email: "manager@example.com",
  first_name: "John",
  last_name: "Doe",
  role: "manager",
  // permissions will be automatically set to manager defaults
};
```

### Updating an Admin Role

```javascript
// When updating from 'staff' to 'admin'
const updateData = {
  role: "admin",
  // permissions will be automatically updated to admin defaults
};
```

### Custom Permissions (Override)

```javascript
// When providing custom permissions
const updateData = {
  role: "admin",
  permissions: {
    // Custom permission set - overrides defaults
    "custom.permission": true,
  },
};
```

## Testing

A test script (`test-role-permission-updates.js`) has been created to verify:

- Permission structures for all roles
- Automatic assignment during creation
- Automatic updates during role changes
- Centralized permission management

## Security Considerations

1. **Permission Validation**: All permission updates are validated server-side
2. **Role Validation**: Only valid roles can be assigned
3. **Authentication Required**: All operations require proper admin authentication
4. **Audit Trail**: All changes are logged for security and debugging

## Future Enhancements

1. **Permission History**: Track permission changes over time
2. **Custom Permission Sets**: Allow creation of custom permission templates
3. **Role Hierarchy**: Implement role-based inheritance
4. **Bulk Updates**: Update permissions for multiple admins at once
5. **Permission Analytics**: Report on permission usage and access patterns

## Migration Notes

- **Existing Admins**: No migration required - permissions remain as-is until role is updated
- **New Admins**: Automatically get role-appropriate permissions
- **Backward Compatibility**: System maintains compatibility with existing permission structures
- **Testing**: Thoroughly test role changes in development environment before production deployment

## Troubleshooting

### Common Issues

1. **Permissions Not Updating**: Check if custom permissions are being provided in the request
2. **Role Change Failed**: Verify admin has proper permissions to update roles
3. **UI Not Reflecting Changes**: Refresh the admin list after role updates

### Debug Tips

1. Check browser console for permission update logs
2. Verify API responses include updated permission structure
3. Test with different role combinations to ensure consistency
