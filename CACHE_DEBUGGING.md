# AI Cache Debugging Guide

## Why Cache is Empty

The AI cache (`ai_cache` table) stays empty when:

1. **User not authenticated** - Cache only works for logged-in users
2. **AI functions using fallbacks** - If Gemini/Groq is not configured, fallback is used instead of caching
3. **Cache save silently failing** - User might not be authenticated when `saveCache()` runs
4. **Email not verified** - Even logged-in users might not have permissions if email isn't confirmed

## How to Check if Cache is Working

### Step 1: Open Browser Console (F12)

You'll see logs like:
```
[CACHE] === Starting withCache for skills ===
[CACHE] Checking skills cache for hash: a1b2c3d4...
[CACHE] ❌ Cache MISS for skills
[CACHE] 🔄 Cache miss for skills - calling AI API
[CACHE] 🤖 AI API succeeded, attempting to save to cache...
[CACHE] 💾 Saving skills cache for user 8f9g0h1i...
[CACHE] ✅ Successfully saved skills cache with ID: uuid-here...
```

### Step 2: Look for These Signs

**If you see this,** cache is working ✅:
```
[CACHE] ✅ Cache HIT for skills
[CACHE] ✅ Successfully saved skills cache
```

**If you see this,** there's a problem ❌:
```
[CACHE] Cannot save cache - user not authenticated
[CACHE] RPC error saving cache: ...
```

### Step 3: Test the Cache Workflow

1. **Generate skills** by filling job target and answering skill questions
2. Click **"Generate AI Skills"** button
3. Watch the console for `[CACHE]` logs
4. Look for `✅ Successfully saved` message
5. Open Supabase Dashboard → Data → `ai_cache` table
6. Check if a new row was added

## Common Issues and Fixes

### Issue 1: User Not Authenticated ❌
**Log:** `Cannot save cache - user not authenticated`

**Fix:**
- Make sure you're logged in (check email in top-right)
- Try signing out and back in
- Verify your email address in Supabase auth

### Issue 2: RLS Permission Denied ❌
**Log:** `RPC error saving cache: 42501 permission denied` (or similar)

**Fix:**
- Run [DATABASE_VERIFICATION.sql](DATABASE_VERIFICATION.sql)
- Check RLS policies exist for ai_cache table
- Verify email is confirmed in Supabase auth

### Issue 3: Cache Miss Every Time ❌
**Log:** `Cache MISS for skills` every time you generate

This is NORMAL if:
- You're entering different input each time
- The `input_hash` is different → Different cache key → Different cache entry

The cache is based on **input content**, not just type. Same input = same cache entry.

### Issue 4: Fallback Being Used ❌
**Log:** `Cannot check cache - user not authenticated` before even calling API

**Fix:**
- Sign in first
- Verify email is confirmed
- Check debug panel shows User ID and Session as ✅

## Testing Cache Manually

### Test 1: Same Input = Cached Result
```
1. Generate skills with input "junior software engineer"
2. Console shows: [CACHE] Successfully saved skills cache
3. Wait 5 seconds
4. Generate skills with SAME input "junior software engineer"
5. Console shows: [CACHE] ✅ Cache HIT for skills (no API call)
```

### Test 2: Different Input = New Cache Entry
```
1. Generate skills with "junior software engineer"
2. Generate skills with "senior data scientist"
3. Both are saved as different cache entries (different input_hash)
4. Each subsequent matching input hits cache
```

### Test 3: Check in Supabase
Go to Supabase Dashboard:
1. Database → `ai_cache` table
2. Click the table to view data
3. You should see rows like:
   ```
   id           uuid
   user_id      your-user-id
   type         'skills' | 'experience' | 'summary'
   input_hash   md5-hash-of-input
   output       { full AI response as JSON }
   created_at   timestamp
   ```

## Cache Behavior Explained

### How Input Hashing Works
```javascript
Input: { answers: ["answer1", "answer2"], role: "Developer" }
↓ (hashed with MD5)
input_hash: "a1b2c3d4e5f6g7h8..."
```

Same input → Same hash → Same cache entry → Instant lookup

### Cache Fields
- `type`: 'skills' | 'experience' | 'summary' - What kind of content
- `user_id`: Your authenticated user ID - RLS ensures only you see it
- `input_hash`: MD5 hash of the input - For deduplication
- `output`: The actual AI response stored as JSON
- `created_at`: When the cache was saved

## Performance Impact

**Without caching:**
```
Generate skills → Call Gemini API (2-5 seconds) → Show results
Generate skills again (same input) → Call Gemini API again (2-5 seconds)
```

**With caching:**
```
Generate skills → Call Gemini API (2-5 seconds) → Save cache → Show results
Generate skills again (same input) → Get from cache (instant) → Show results
```

## Next Steps

1. **Generate some AI content** (skills, experience, summary)
2. **Watch the console** for [CACHE] logs
3. **Check Supabase Dashboard** to see cache entries
4. **Try generating with same input twice** - should see cache hit on second try

If you see:
- ✅ `[CACHE] ✅ Successfully saved` → Caching works! 🎉
- ❌ `[CACHE] Cannot save cache` → Check user auth (Step 1 of QUICK_DEBUG.md)
- ❌ `[CACHE] RPC error` → Run DATABASE_VERIFICATION.sql

## Debugging Commands

In browser console:
```javascript
// Check all cache entries for current user
const result = await (await import('/src/utils/databaseHelpers.js')).cacheOperations.getCacheByType('skills');
console.log('Skills cache:', result.data);

// Clear all old cache (> 30 days)  
const cleared = await (await import('/src/utils/databaseHelpers.js')).cacheOperations.clearOldCache(30);
console.log('Cleared entries:', cleared);
```

## Still Not Working?

Share in console:
1. When you try to generate AI content, what do you see in [CACHE] logs?
2. Screenshot of debug panel (bottom-right)
3. Do you see any errors in console?
4. What do the DATABASE_VERIFICATION.sql queries show?
