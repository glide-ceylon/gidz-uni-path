# Student Assignment System Implementation

## Overview

The Student Assignment System allows admin users to assign student visa applications to specific staff members for review. This enables better workload distribution and tracking of application review progress.

## Features

### 1. Staff Assignment

- **Admin/Super Admin**: Can assign students to any staff member
- **Staff Members**: Can only view their assigned students
- **Assignment Tracking**: Tracks who assigned, when, and to whom

### 2. Role-Based Access

- **Super Admin**: Full access to all features
- **Admin**: Can assign students and view all applications
- **Staff**: Can only view assigned applications and update status

### 3. User Interface

- **Assignment Modal**: Clean interface for selecting staff members
- **Visual Indicators**: Shows assigned staff with profile information
- **Filter Support**: Staff members only see their assigned work
- **Responsive Design**: Works on all device sizes

## Database Schema

### New Columns Added to `student_visa` Table

```sql
-- Staff member assigned to review this application
assigned_to UUID REFERENCES admin_users(id) ON DELETE SET NULL

-- Timestamp when the assignment was made
assigned_at TIMESTAMPTZ

-- Admin user who made the assignment
assigned_by UUID REFERENCES admin_users(id) ON DELETE SET NULL
```

## API Endpoints

### 1. Get Staff Members

```
GET /api/admin/staff
```

- Returns all active admin users available for assignment
- Requires admin authentication

### 2. Assign Student

```
POST /api/admin/assign-student
Body: { studentId: string, staffId: string }
```

- Assigns a student to a staff member
- Updates assignment timestamps
- Requires admin authentication

### 3. Unassign Student

```
DELETE /api/admin/assign-student
Body: { studentId: string }
```

- Removes staff assignment from a student
- Clears assignment timestamps
- Requires admin authentication

## Implementation Details

### Frontend Components

#### 1. Assignment Modal

- **Location**: `app/admin/entries/student/page.tsx`
- **Features**:
  - Staff member selection dropdown
  - Student information display
  - Assignment confirmation
  - Error handling

#### 2. Role-Based UI

- **Admin View**: Shows assignment column with controls
- **Staff View**: Hides assignment column, shows only assigned students
- **Loading States**: Proper loading indicators during data fetch

#### 3. Visual Indicators

- **Assigned Students**: Green checkmark icon with staff details
- **Unassigned Students**: "Assign Staff" button
- **Assignment Info**: Shows staff name, role, and department

### Backend Logic

#### 1. Database Queries

- **With Assignments**: Joins with admin_users table for staff details
- **Staff Filtering**: Filters by assigned_to for staff users
- **Performance**: Indexed queries for better performance

#### 2. Permission Checks

- **Admin Authentication**: Validates admin session
- **Role Verification**: Checks user permissions
- **Data Filtering**: Applies role-based data access

## Usage Instructions

### For Administrators

1. **Assign a Student**:

   - Navigate to Student Visa Applications
   - Find the student in the table
   - Click "Assign Staff" button
   - Select staff member from dropdown
   - Click "Assign Student"

2. **Unassign a Student**:

   - Find assigned student in the table
   - Click the "X" button next to staff member name
   - Confirm unassignment

3. **View Assignment Status**:
   - Check the "Assigned To" column
   - See staff member details and assignment info

### For Staff Members

1. **View Assigned Students**:

   - Login to admin panel
   - Navigate to "My Assigned Applications"
   - See only students assigned to you

2. **Update Student Status**:
   - Toggle "Read/Unread" status
   - View student details
   - Cannot delete or reassign students

## File Structure

```
app/
├── admin/entries/student/
│   └── page.tsx (Main interface with assignment features)
├── api/
│   └── admin/
│       ├── staff/route.js (Get staff members)
│       └── assign-student/route.js (Assignment operations)
database/
└── migrations/
    └── 003_add_assignment_columns.sql (Database schema)
scripts/
├── add-assignment-columns.js (Migration script)
└── test-assignment-system.js (Testing script)
```

## Security Considerations

1. **Authentication**: All assignment operations require valid admin session
2. **Authorization**: Role-based access control enforced
3. **Data Validation**: Input validation on all endpoints
4. **SQL Injection**: Parameterized queries used throughout
5. **Session Management**: Secure session handling

## Testing

Run the test script to verify the implementation:

```bash
node scripts/test-assignment-system.js
```

## Migration Instructions

1. **Add Database Columns**:

   ```sql
   -- Run the migration SQL file
   psql -f database/migrations/003_add_assignment_columns.sql
   ```

2. **Verify Installation**:
   ```bash
   node scripts/test-assignment-system.js
   ```

## Troubleshooting

### Common Issues

1. **Database Columns Missing**:

   - Run the migration script manually
   - Check database permissions
   - Verify foreign key constraints

2. **Permission Errors**:

   - Verify admin user roles
   - Check authentication cookies
   - Confirm session validity

3. **Staff Not Showing**:
   - Ensure staff users have `is_active = true`
   - Check admin_users table data
   - Verify role assignments

### Error Messages

- **"Unauthorized"**: Invalid or expired admin session
- **"Staff member not found"**: Invalid staff ID or inactive user
- **"Failed to assign student"**: Database error or constraint violation

## Future Enhancements

1. **Email Notifications**: Notify staff when assigned new students
2. **Bulk Assignment**: Assign multiple students at once
3. **Assignment History**: Track assignment changes over time
4. **Workload Analytics**: Show assignment distribution statistics
5. **Due Dates**: Add review deadlines for assignments

## Support

For issues or questions about the assignment system:

1. Check the troubleshooting section
2. Run the test script for diagnostics
3. Review the error logs for specific issues
4. Verify database schema and permissions
