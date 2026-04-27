# Database Setup & Integration Guide

## Overview

This guide covers the complete database setup for CV Builder AI, including schema creation, RPC functions, and frontend integration.

## File Structure

```
database/
├── schema.sql          # Main schema with tables and RLS
└── queries.sql         # RPC functions and views

src/utils/
└── databaseHelpers.js  # Frontend wrapper functions
```

## Step 1: Create Schema in Supabase

1. Go to your Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Copy the entire contents of `database/schema.sql`
4. Click "Run"

This creates:
- `cvs` table - stores CV data
- `ai_cache` table - stores AI responses for deduplication
- RLS policies - ensures users only access their own data
- Auto-updating timestamps on CVs

## Step 2: Create RPC Functions

1. In Supabase SQL Editor, create a new query
2. Copy the entire contents of `database/queries.sql`
3. Click "Run"

This creates helper functions:
- `get_user_cvs()` - Get all user's CVs
- `get_cv_by_id(uuid)` - Get specific CV with full data
- `upsert_cv()` - Create/update CV
- `delete_cv()` - Delete CV
- `get_ai_cache()` - Check if result is cached
- `save_ai_cache()` - Store AI response
- `clear_old_cache()` - Cleanup old entries

## Step 3: frontend Integration

### Install Database Helpers

The `src/utils/databaseHelpers.js` file is already in your project. It provides:

```javascript
import { 
  cvOperations, 
  cacheOperations, 
  withCache, 
  getUserStats 
} from '../utils/databaseHelpers';
```

### CV Operations

#### Get all CVs
```javascript
const result = await cvOperations.getAllCVs();
if (result.success) {
  console.log(result.data); // Array of CVs
}
```

#### Get specific CV
```javascript
const result = await cvOperations.getCVById('cv-uuid');
if (result.success) {
  const cv = result.data;
  console.log(cv.data); // Full CV content
}
```

#### Save CV
```javascript
const result = await cvOperations.saveCV({
  cvId: null, // null for new, uuid for update
  title: 'My CV',
  targetRole: 'Software Engineer',
  data: { /* full CV object */ }
});
if (result.success) {
  console.log('CV ID:', result.id);
}
```

#### Delete CV
```javascript
const result = await cvOperations.deleteCV('cv-uuid');
console.log(result.message);
```

### AI Cache Operations

#### Check cache before calling AI
```javascript
const result = await cacheOperations.getCache('skills', userInput);
if (result.success && result.data?.output) {
  console.log('From cache:', result.data.output);
} else {
  // Cache miss - call AI
  const aiResult = await callGeminiAPI(userInput);
  // Then save to cache
  await cacheOperations.saveCache('skills', userInput, aiResult);
}
```

#### Recommended: Use withCache wrapper
```javascript
// In your AI service (geminiService.js, groqService.js, etc.)

const result = await withCache(
  'skills', 
  generateSkills, // Your AI function
  userInput
);

console.log(result.data); // AI response
console.log(result.fromCache); // boolean - was it cached?
```

### Integration with AI Services

#### Example: Update geminiService.js
```javascript
import { withCache } from '../utils/databaseHelpers';

export async function generateSkillsWithCache(userInput) {
  const result = await withCache(
    'skills',
    async (input) => {
      const response = await callGeminiAPI(input);
      return { success: true, data: response };
    },
    userInput
  );
  
  return result;
}
```

#### Example: In React Component
```javascript
import { cvOperations, cacheOperations } from '../utils/databaseHelpers';

function SkillsStep() {
  const handleGenerateSkills = async () => {
    // Try cache first
    const cached = await cacheOperations.getCache('skills', userInput);
    
    if (cached.success && cached.data?.output) {
      setSkills(cached.data.output);
      return;
    }

    // Generate with AI
    const aiResult = await generateSkillsWithCache(userInput);
    if (aiResult.success) {
      setSkills(aiResult.data);
    }
  };

  const handleSaveCV = async () => {
    const result = await cvOperations.saveCV({
      cvId: currentCVId,
      title: cvTitle,
      targetRole: targetRole,
      data: fullCVData
    });
    
    if (result.success) {
      console.log('CV saved:', result.id);
    }
  };
}
```

## Cache Type Values

Valid cache types for AI requests:
- `'skills'` - Generated skills list
- `'experience'` - Enhanced experience descriptions
- `'summary'` - Generated professional summary

Example:
```javascript
await cacheOperations.saveCache('skills', input, generatedSkills);
await cacheOperations.saveCache('experience', input, enhancedExperience);
await cacheOperations.saveCache('summary', input, generatedSummary);
```

## Database Schema Details

### CVs Table
```sql
id              uuid          - Primary key
user_id         uuid          - References auth.users(id)
title           text          - CV title
target_role     text          - Target job role
data            jsonb         - Full CV content as JSON
created_at      timestamp     - Auto-set on creation
updated_at      timestamp     - Auto-updated on changes
```

### AI Cache Table
```sql
id              uuid          - Primary key
user_id         uuid          - References auth.users(id)
type            text          - 'skills' | 'experience' | 'summary'
input_hash      text          - MD5 hash of input for deduplication
output          jsonb         - AI response stored as JSON
created_at      timestamp     - Auto-set on creation
```

## Row Level Security (RLS)

All tables have RLS enabled. Users can only:
- View their own data
- Insert new records
- Update/delete their own records

This is enforced at the database level for security.

## Performance Tips

1. **Use indexes** - The schema includes indexes on commonly queried columns
2. **Cache old results** - Periodically clear cache entries > 30 days:
   ```javascript
   await cacheOperations.clearOldCache(30);
   ```
3. **Input hashing** - The `hashInput()` function deduplicates similar inputs
4. **Batch operations** - Load user's CVs once and store in state

## Data Cleanup

Automatically handled:
- When a user deletes their account, all their CVs and cache entries are deleted
- Implement periodic cleanup for old cache: `clear_old_cache(days_old)`

## Troubleshooting

### Queries return empty results
- Check if RLS policies are enabled
- Verify user is authenticated (`auth.uid()` is set)
- Check user_id matches in the database

### "User not authenticated" errors
- Ensure Supabase auth is initialized before calling database functions
- Check session is valid: `const { data } = await supabase.auth.getSession()`

### JSONB data issues
- Always stringify objects before passing to database
- Use JSON parsing when retrieving: `JSON.parse(data.data)`

### CVs not saving (user_id is NULL)
**Check the new debug panel** (bottom-right corner) which shows:
- ✅ User ID
- ✅ Email
- ✅ Session status
- ✅ RLS test result

If any show ❌:
1. Check email is verified in Supabase auth
2. Verify RLS is enabled on cvs and ai_cache tables
3. Confirm RLS policies exist
4. Check environment variables are correct

See [DEBUGGING_SAVE_ISSUES.md](DEBUGGING_SAVE_ISSUES.md) for detailed troubleshooting steps.

Run [DATABASE_VERIFICATION.sql](DATABASE_VERIFICATION.sql) in Supabase SQL Editor to check setup.

## Next Steps

1. ✅ Create schema in Supabase
2. ✅ Create RPC functions
3. ✅ Update your AI service functions to use `withCache()`
4. ✅ Update React components to use `cvOperations` and `cacheOperations`
5. ✅ Add save/load functionality to CV builder
6. 📝 Display saved CVs in a list/dashboard
