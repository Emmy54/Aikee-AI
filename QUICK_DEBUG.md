# Quick Start: Debug Your Save Issue

**Problem:** CVs not saving, user_id is NULL in Supabase

## What Changed
We added automatic debugging tools to help figure out what's wrong.

## Step 1: Start Your App
```bash
npm run dev
```

## Step 2: Look Bottom-Right Corner
You'll see a blue/gray box that says "🔍 Auth Debug". This shows your authentication status.

## Step 3: Check the Status

**Everything is green ✅?**
→ Your auth is working! The issue is elsewhere. Check the browser console (F12) for exact error.

**User ID shows ❌ NULL?**
→ You're not logged in. Click "Sign In" first, then try saving.

**Email shows ❌?**
→ Check your email for Supabase verification link and click it.

**Session shows ❌ No session?**
→ Your environment variables might be wrong. Check `.env.local` has:
```
VITE_SUPABASE_PUBLIC_URL=https://xxx.supabase.co
VITE_SUPABASE_PUBLIC_ANON_KEY=xxx
```

**RLS Test shows ❌?**
→ Database permissions issue. Run the SQL verification script.

## Step 4: Run Database Verification

Go to Supabase Dashboard → SQL Editor → New Query

Copy and paste [DATABASE_VERIFICATION.sql](DATABASE_VERIFICATION.sql)

Run each query and look for:
- ✅ RLS is enabled (`rowsecurity = t`)
- ✅ Policies exist (4 for cvs, 3 for ai_cache)
- ✅ Your email is in auth.users
- ✅ Email is confirmed (email_confirmed_at is NOT NULL)

## Step 5: Try Saving Again

1. Make sure you're logged in (see your email in top-right)
2. Click "💾 Save" button
3. Enter a CV title
4. Click "Save CV"

## Step 6: Check Console (F12)

Open DevTools Console tab and look for:
- `✅ Saving CV for user: uuid...` → Success!
- `❌ User not authenticated` → Login first
- `❌ missing_data_added` → RLS policy issue
- `❌ RLS violation` → Database permissions issue

## Most Common Issues

### Issue 1: User ID is NULL
**Fix:** Click "Sign In" first, then try saving

### Issue 2: Email not confirmed
**Fix:** Check your email for Supabase confirmation link, click it

### Issue 3: RLS violation error
**Fix:** Run DATABASE_VERIFICATION.sql and check if policies exist

### Issue 4: Still having trouble?
**Share:** 
1. Screenshot of debug panel (bottom-right)
2. Browser console error messages (F12 → Console)
3. Which RLS test query failed in DATABASE_VERIFICATION.sql

## Advanced: Manual Database Test

In Supabase SQL Editor:

```sql
-- First get your user ID:
SELECT id FROM auth.users WHERE email = 'your-email@example.com';

-- Copy the UUID and paste below:
INSERT INTO cvs (user_id, title, target_role, data)
VALUES (
  'PASTE-UUID-HERE',
  'Test',
  'Test',
  '{"test": true}'::jsonb
);

-- Check if it worked:
SELECT * FROM cvs WHERE title = 'Test';
```

If INSERT works but app save doesn't → Likely RLS issue
If INSERT fails → Schema setup issue

## Next Steps

Once everything is working:
1. Save some CVs
2. Refresh page
3. Click "📂 Load" 
4. Your CVs should appear!

Need help? Check [DEBUGGING_SAVE_ISSUES.md](DEBUGGING_SAVE_ISSUES.md) for detailed guide.
