# Debugging Database Save Issues

## The Problem
CVs aren't saving to Supabase - `user_id` is NULL and tables remain empty.

## Root Cause
The most likely issue is that `auth.uid()` in your RLS policies is returning NULL, which means:
1. **User is not authenticated** in Supabase
2. **OR** Session is not being passed to database queries
3. **OR** Email is not verified in Supabase auth

## Troubleshooting Checklist

### Step 1: Check Auth Status (New Debug Panel)
A debug panel now appears in the bottom-right corner when you run the app.

**Look for:**
- ✅ "User ID" should show a long UUID (starts with blue box)
- ✅ "Email" should show your email address
- ✅ "Session" should show "✅ Active"
- ✅ "RLS Test" should show "✅ Can read CVs"

If you see ❌ on any of these:
- **User ID: NULL** → You're not logged in. Sign in first.
- **Session: No session** → Supabase auth isn't working. Check env variables.
- **RLS Test error** → Database permissions issue. See Step 3.

### Step 2: Verify Supabase Environment Variables

Check `.env.local` has:
```
VITE_SUPABASE_PUBLIC_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLIC_ANON_KEY=your-anon-key-here
```

Get these from: Supabase Dashboard → Settings → API

### Step 3: Verify Email is Confirmed

In Supabase Dashboard → Authentication → Users:
- Look for your user
- Check "Email Confirmed At" - should have a timestamp
- If it's empty, your email isn't confirmed
- **Fix:** Check your email for confirmation link and click it

### Step 4: Enable RLS Policies

Check RLS is enabled in Supabase Dashboard → SQL Editor:

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('cvs', 'ai_cache');

-- You should see:
-- cvs          | t
-- ai_cache     | t
```

If they show `f` (false), enable RLS:
```sql
ALTER TABLE cvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_cache ENABLE ROW LEVEL SECURITY;
```

### Step 5: Verify RLS Policies Exist

In Supabase Dashboard → RLS:

**For `cvs` table, you should see:**
- ✅ "Users can view their own CVs" (SELECT)
- ✅ "Users can insert their own CVs" (INSERT)
- ✅ "Users can update their own CVs" (UPDATE)
- ✅ "Users can delete their own CVs" (DELETE)

**For `ai_cache` table, you should see:**
- ✅ "Users can view their own AI cache" (SELECT)
- ✅ "Users can insert into their AI cache" (INSERT)
- ✅ "Users can delete their own AI cache" (DELETE)

If policies are missing, run the schema again:
1. Go to SQL Editor
2. Create new query
3. Paste contents of `database/schema.sql`
4. Click Run

### Step 6: Test the Save Function Manually

Open browser console (F12) and run:
```javascript
// Import from the app
const { cvOperations } = await import('/src/utils/databaseHelpers.js');

// Try to save
const result = await cvOperations.saveCV({
  cvId: null,
  title: "Test CV",
  targetRole: "Software Engineer",
  data: { test: true }
});

console.log('Save result:', result);
```

Check console for error messages - they'll give exact details of what failed.

### Step 7: Check Browser Console

The app now logs detailed errors. Open DevTools (F12) and:
1. Click "Save" button
2. Look at Console tab
3. You should see logs like:
   - "Saving CV for user: uuid-here" ✅
   - Or "User not authenticated" ❌
   - Or specific RLS error with code

**Common RLS errors:**
- `"missing_data_added"` → User ID not matching
- `"42P04"` → Constraint violation
- `"42501"` → Permission denied (RLS issue)

### Step 8: Manually Insert Test Data

In Supabase SQL Editor:
```sql
-- First, get your user ID from auth
SELECT id, email FROM auth.users LIMIT 1;

-- Then insert a test CV
INSERT INTO cvs (user_id, title, target_role, data)
VALUES (
  'paste-your-user-id-here',
  'Test CV',
  'Software Engineer',
  '{"test": true}'::jsonb
);
```

If this fails, you have a schema or permission issue, not a code issue.

## Quick Fix Checklist

```
[ ] Email is confirmed in Supabase auth
[ ] RLS is enabled on cvs and ai_cache tables
[ ] RLS policies exist for all operations
[ ] Environment variables are set correctly
[ ] User is logged in (check debug panel)
[ ] Session is active (check debug panel)
[ ] Browser console shows no auth errors
```

## Still Not Working?

1. **Check Supabase Status** - Is the service up? https://status.supabase.com
2. **Look at Supabase Logs** - Dashboard → Logs → Authentication
3. **Check Database Permissions** - Can you manually insert in SQL Editor?
4. **Clear Browser Cache** - Ctrl+Shift+Delete and try again
5. **Check RLS Query** - Add test RLS that allows all:
   ```sql
   DROP POLICY "Users can insert their own CVs" ON cvs;
   CREATE POLICY "test_allow_all" ON cvs USING (true);
   ```
   If this works, the problem is your RLS logic.

## What the Debug Panel Shows

```
User ID: xxxxxxxx...     → Your auth.users.id
Email: user@email.com    → Your auth email
Session: ✅ Active       → Supabase session is valid
RLS Test: ✅ Can read    → auth.uid() is working in function calls
```

All green ✅? Then code is working correctly. Check the actual save in console.
All red ❌? Then it's an auth configuration issue - not the code.

## Next: Verify Everything Works

Once all checks pass:
1. Try saving a test CV
2. Refresh the page
3. Click Load
4. Your CV should appear in the list

If you're still having issues, share the exact error message from the console!
