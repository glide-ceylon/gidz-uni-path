# Work Visa Assignment Implementation Guide

## Overview

This guide provides the complete implementation for adding staff assignment functionality to work visa applications, matching the functionality already implemented for student visa applications.

## 1. Database Setup

### Add Assignment Columns to work_visa Table

Run the following SQL commands in your Supabase Dashboard (SQL Editor):

```sql
-- Add assignment columns to work_visa table
ALTER TABLE work_visa ADD COLUMN assigned_to UUID NULL;
ALTER TABLE work_visa ADD COLUMN assigned_at TIMESTAMP WITH TIME ZONE NULL;
ALTER TABLE work_visa ADD COLUMN assigned_by UUID NULL;

-- Add foreign key constraints
ALTER TABLE work_visa ADD CONSTRAINT fk_work_visa_assigned_to
FOREIGN KEY (assigned_to) REFERENCES admin_users(id);

ALTER TABLE work_visa ADD CONSTRAINT fk_work_visa_assigned_by
FOREIGN KEY (assigned_by) REFERENCES admin_users(id);
```

## 2. API Implementation

### Work Assignment API Route

✅ **COMPLETED**: `app/api/admin/assign-work/route.js`

- POST: Assign work visa application to staff
- DELETE: Unassign work visa application from staff
- Uses service role client for admin operations
- Validates admin session and permissions

## 3. Frontend Implementation

### Required Changes to work/page.tsx

The work visa page needs the following additions:

1. **State Management**:

   - Add staff members state
   - Add assignment modal state
   - Add current user state for role-based access

2. **User Authentication**:

   - Fetch current user information
   - Role-based filtering (staff only see assigned applications)

3. **Staff Data Fetching**:

   - Fetch staff members for assignment dropdown
   - Use existing `/api/admin/staff` endpoint

4. **Assignment Functionality**:

   - Assignment modal component
   - Staff dropdown selection
   - Assign/unassign operations

5. **Table Updates**:

   - Add "Assigned To" column (for admin/super_admin roles)
   - Show assigned staff information
   - Hide assignment column for staff users

6. **Database Query Updates**:
   - Include assigned staff information in queries
   - Filter by assigned_to for staff users

## 4. Implementation Status

### ✅ Completed

- [x] Work assignment API route (`/api/admin/assign-work`)
- [x] Import path fixes for all API routes
- [x] Student visa assignment (full implementation)
- [x] Database schema documentation

### 🔄 Pending

- [ ] Add assignment columns to work_visa table (SQL commands provided)
- [ ] Update work/page.tsx with assignment functionality
- [ ] Test work visa assignment system
- [ ] End-to-end testing of both student and work visa assignments

## 5. Files Created/Modified

### New Files

- `app/api/admin/assign-work/route.js` - Work visa assignment API
- `scripts/add-work-visa-assignment-columns.js` - Database setup script
- `WORK_VISA_ASSIGNMENT_GUIDE.md` - This implementation guide

### Modified Files

- `app/api/admin/assign-student/route.js` - Fixed import path
- `app/api/admin/assign-student/route_fixed.js` - Fixed import path

## 6. Next Steps

1. **Run SQL Commands**: Execute the database setup SQL in Supabase Dashboard
2. **Update Work Page**: Implement assignment UI in `app/admin/entries/work/page.tsx`
3. **Test System**: Verify both student and work visa assignments work correctly
4. **Documentation**: Update main README with assignment feature information

## 7. Testing

After implementation, test the following:

- Admin can assign work visa applications to staff
- Staff can only see their assigned work visa applications
- Assignment/unassignment works correctly
- Role-based access control functions properly
- API endpoints return correct data and error messages
