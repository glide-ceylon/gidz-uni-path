# Feedback System 500 Error - Troubleshooting Guide 🔧

## Quick Diagnosis Steps

### Step 1: Run Database Test Script

Copy and paste this into your browser console:

```javascript
// Paste the entire content of debug-feedback-database.js here
```

### Step 2: Check Server Logs

1. Open your development server terminal
2. Submit a feedback to trigger the error
3. Look for detailed error messages in the console

### Step 3: Verify Database Table Exists

#### Option A: Check via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to "Table Editor"
3. Look for a table named `feedbacks`
4. If it doesn't exist, create it using the SQL below

#### Option B: Create Table via SQL Editor

1. Go to Supabase → SQL Editor
2. Run the SQL from `database/create-feedbacks-table.sql`

## Common Causes & Solutions

### 🗄️ **Cause 1: Feedbacks Table Doesn't Exist**

**Symptoms:**

- 500 error when submitting feedback
- Console shows "relation 'feedbacks' does not exist"

**Solution:**

```sql
-- Run this in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID,
  client_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  program_type TEXT,
  university TEXT,
  allow_display_name BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 🔐 **Cause 2: Row Level Security (RLS) Issues**

**Symptoms:**

- 500 error with "insufficient privileges" message
- Table exists but inserts fail

**Solution:**

```sql
-- Temporarily disable RLS for testing
ALTER TABLE feedbacks DISABLE ROW LEVEL SECURITY;

-- Or create permissive policies
CREATE POLICY "Allow all operations for testing" ON feedbacks
  FOR ALL USING (true) WITH CHECK (true);
```

### 🌐 **Cause 3: Supabase Configuration Issues**

**Symptoms:**

- All Supabase operations fail
- Environment variables not set

**Solution:**
Check your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 📝 **Cause 4: Data Validation Issues**

**Symptoms:**

- Some feedbacks work, others don't
- Specific field validation errors

**Solution:**
Check the data being sent:

```javascript
// In FeedbackDialog.jsx, the data should look like:
{
  application_id: "some-uuid",
  client_name: "John Doe",
  rating: 5, // Must be 1-5
  title: "Great service",
  message: "Long message here",
  program_type: "Computer Science", // Optional
  university: "TU Munich", // Optional
  allow_display_name: true
}
```

## Step-by-Step Fix Process

### 1. Create/Verify Database Table

```bash
# Run in Supabase SQL Editor
\i database/create-feedbacks-table.sql
```

### 2. Test API Directly

```javascript
// Test in browser console
fetch("/api/feedbacks", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    application_id: "test-123",
    client_name: "Test User",
    rating: 5,
    title: "Test",
    message: "Test message",
  }),
})
  .then((r) => r.json())
  .then(console.log);
```

### 3. Check Server Logs

Look for these specific errors:

- `relation "feedbacks" does not exist` → Create table
- `insufficient privileges` → Fix RLS policies
- `violates check constraint` → Check data validation
- `duplicate key value` → Check for unique constraints

### 4. Verify Environment Variables

```javascript
// In browser console
console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log(
  "Supabase Key:",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not Set"
);
```

## Quick Fixes

### Fix 1: Minimal Table Creation

If you just want to get it working quickly:

```sql
CREATE TABLE feedbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id TEXT,
  client_name TEXT NOT NULL,
  rating INTEGER NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  program_type TEXT,
  university TEXT,
  allow_display_name BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Disable RLS for testing
ALTER TABLE feedbacks DISABLE ROW LEVEL SECURITY;
```

### Fix 2: Simplified API Test

```javascript
// Simple test without complex validation
fetch("/api/feedbacks", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    application_id: "test",
    client_name: "Test",
    rating: 5,
    title: "Test",
    message: "Test",
  }),
})
  .then((response) => {
    console.log("Status:", response.status);
    return response.json();
  })
  .then((data) => console.log("Data:", data))
  .catch((error) => console.error("Error:", error));
```

## Verification Steps

After applying fixes:

1. **Test API Endpoint:**

   ```bash
   curl -X POST http://localhost:3000/api/feedbacks \
     -H "Content-Type: application/json" \
     -d '{"application_id":"test","client_name":"Test","rating":5,"title":"Test","message":"Test"}'
   ```

2. **Test UI:**

   - Go to client portal
   - Navigate to Profile tab
   - Click "Write Feedback"
   - Submit a test feedback

3. **Check Database:**
   ```sql
   SELECT * FROM feedbacks ORDER BY created_at DESC LIMIT 5;
   ```

## Still Having Issues?

If you're still getting 500 errors:

1. **Enable detailed logging:**

   - Add more console.log statements in the API
   - Check browser Network tab for exact error messages

2. **Check Supabase logs:**

   - Go to Supabase Dashboard → Logs
   - Look for API and Database errors

3. **Try minimal implementation:**

   - Temporarily remove all validation
   - Use basic INSERT without complex logic
   - Test with hardcoded values first

4. **Contact for help:**
   - Provide exact error messages from server console
   - Share the current database table structure
   - Include the exact request data being sent

---

**Most Common Fix:** The feedbacks table doesn't exist. Run the SQL from `database/create-feedbacks-table.sql` in your Supabase SQL Editor, and the issue should be resolved!
