// Database Helper Functions for CV Builder AI
// Simplifies common database operations with error handling

import { supabase } from '../../lib/supabaseClient';

/**
 * Hash input string for AI cache matching
 * Allows deduplication based on content, not exact string match.
 *
 * Uses a synchronous FNV-1a hash (browser-safe — no Node 'crypto' dependency).
 * Cache keys only need stable dedup, not cryptographic strength.
 */
export const hashInput = (input) => {
  const str = JSON.stringify(input);
  // FNV-1a 32-bit
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  // Widen to 16 hex chars by mixing in a second pass for fewer collisions
  let h2 = 0xc9dc5118;
  for (let i = str.length - 1; i >= 0; i--) {
    h2 ^= str.charCodeAt(i);
    h2 = Math.imul(h2, 0x01000193);
  }
  const toHex = (n) => (n >>> 0).toString(16).padStart(8, '0');
  return toHex(h) + toHex(h2);
};

/**
 * CV Operations
 */
export const cvOperations = {
  /**
   * Get all CVs for the current user
   */
  async getAllCVs() {
    try {
      // Check if user is authenticated
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('User not authenticated when fetching CVs', userError);
        return { success: false, error: 'User not authenticated' };
      }

      const { data, error } = await supabase.rpc('get_user_cvs');
      if (error) {
        console.error('RPC error fetching CVs:', error);
        throw error;
      }
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching CVs:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get a specific CV by ID with full data
   */
  async getCVById(cvId) {
    try {
      // Check if user is authenticated
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('User not authenticated when fetching CV', userError);
        return { success: false, error: 'User not authenticated' };
      }

      const { data, error } = await supabase.rpc('get_cv_by_id', { cv_id: cvId });
      if (error) {
        console.error('RPC error fetching CV:', error);
        throw error;
      }
      return { success: true, data: data?.[0] };
    } catch (error) {
      console.error(`Error fetching CV ${cvId}:`, error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Create a new CV or update existing one
   * @param {Object} options - { cvId, title, targetRole, data }
   */
  async saveCV({ cvId = null, title, targetRole, data }) {
    try {
      // Check if user is authenticated
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        const errorMsg = 'User not authenticated. Please sign in first.';
        console.error(errorMsg, { userError, user });
        return { success: false, error: errorMsg };
      }

      console.log('Saving CV for user:', user.id);
      
      const { data: result, error } = await supabase.rpc('upsert_cv', {
        cv_id: cvId,
        cv_title: title,
        cv_target_role: targetRole,
        cv_data: data,
      });

      if (error) {
        console.error('RPC error details:', {
          message: error.message,
          code: error.code,
          status: error.status,
          hint: error.hint,
        });
        throw error;
      }

      console.log('CV saved successfully:', result);
      return { success: true, id: result };
    } catch (error) {
      console.error('Error saving CV:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete a CV by ID
   */
  async deleteCV(cvId) {
    try {
      const { data, error } = await supabase.rpc('delete_cv', { cv_id: cvId });
      if (error) throw error;
      return { success: data, message: data ? 'CV deleted' : 'CV not found' };
    } catch (error) {
      console.error('Error deleting CV:', error);
      return { success: false, error: error.message };
    }
  },
};

/**
 * AI Cache Operations
 * Use these to avoid redundant API calls to Gemini/Groq
 */
export const cacheOperations = {
  /**
   * Check if result exists in cache
   * @param {string} type - 'skills' | 'experience' | 'summary'
   * @param {Object} input - The user input to hash
   */
  async getCache(type, input) {
    try {
      // Check if user is authenticated
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.warn('[CACHE] Cannot check cache - user not authenticated');
        return { success: false, error: 'User not authenticated', cached: false };
      }

      const inputHash = hashInput(input);
      console.log(`[CACHE] Checking ${type} cache for hash: ${inputHash.slice(0, 8)}...`);
      
      const { data, error } = await supabase.rpc('get_ai_cache', {
        cache_type: type,
        cache_input_hash: inputHash,
      });

      if (error) {
        console.warn(`[CACHE] Error checking cache:`, error.message);
        throw error;
      }

      if (data?.[0]) {
        console.log(`[CACHE] ✅ Cache HIT for ${type}`);
        return { success: true, data: data[0], inputHash, cached: true };
      } else {
        console.log(`[CACHE] ❌ Cache MISS for ${type}`);
        return { success: true, data: null, inputHash, cached: false };
      }
    } catch (error) {
      console.error('[CACHE] Error checking cache:', error);
      return { success: false, error: error.message, cached: false };
    }
  },

  /**
   * Save AI result to cache
   * @param {string} type - 'skills' | 'experience' | 'summary'
   * @param {Object} input - The user input that was hashed
   * @param {Object} output - The AI response to cache
   */
  async saveCache(type, input, output) {
    try {
      // Check if user is authenticated
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.warn('[CACHE] Cannot save cache - user not authenticated');
        return { success: false, error: 'User not authenticated' };
      }

      const inputHash = hashInput(input);
      const outputSize = JSON.stringify(output).length;
      
      console.log(`[CACHE] 💾 Saving ${type} cache for user ${user.id.slice(0, 8)}...`);
      console.log(`[CACHE] Input hash: ${inputHash.slice(0, 8)}... | Output size: ${outputSize} bytes`);
      
      const { data, error } = await supabase.rpc('save_ai_cache', {
        cache_type: type,
        cache_input_hash: inputHash,
        cache_output: output,
      });

      if (error) {
        console.error(`[CACHE] ❌ RPC error saving cache:`, {
          message: error.message,
          code: error.code,
          status: error.status,
          hint: error.hint,
        });
        throw error;
      }

      console.log(`[CACHE] ✅ Successfully saved ${type} cache with ID: ${data?.slice ? data.slice(0, 8) : data}...`);
      return { success: true, id: data };
    } catch (error) {
      console.error('[CACHE] Error saving to cache:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get cache entries for a specific type
   */
  async getCacheByType(type) {
    try {
      // Check if user is authenticated
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.warn(`[CACHE] Cannot fetch ${type} cache - user not authenticated`);
        return { success: false, error: 'User not authenticated' };
      }

      const { data, error } = await supabase.rpc('get_user_cache_by_type', {
        cache_type: type,
      });
      if (error) throw error;
      
      console.log(`[CACHE] 📊 Found ${data?.length || 0} ${type} cache entries`);
      return { success: true, data };
    } catch (error) {
      console.error(`[CACHE] Error fetching ${type} cache:`, error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Clear cache entries older than specified days
   * @param {number} daysOld - Number of days (default: 30)
   */
  async clearOldCache(daysOld = 30) {
    try {
      const { data, error } = await supabase.rpc('clear_old_cache', {
        days_old: daysOld,
      });
      if (error) throw error;
      return { success: true, deleted: data, message: `Cleared ${data} old cache entries` };
    } catch (error) {
      console.error('Error clearing cache:', error);
      return { success: false, error: error.message };
    }
  },
};

/**
 * Higher-order function for AI operations with automatic caching
 * Use this in your AI service functions
 * 
 * @param {string} cacheType - The cache type ('skills', 'experience', 'summary')
 * @param {Function} aiFunction - The function that calls the AI API
 * @param {Object} input - The input to pass to the AI function
 * @returns {Object} - { success, data, fromCache }
 */
export const withCache = async (cacheType, aiFunction, input) => {
  try {
    console.log(`\n[CACHE] === Starting withCache for ${cacheType} ===`);
    
    // Check cache first
    const cacheResult = await cacheOperations.getCache(cacheType, input);
    
    if (cacheResult.cached && cacheResult.data?.output) {
      console.log(`[CACHE] ✅ Returning cached result for ${cacheType}`);
      return {
        success: true,
        data: cacheResult.data.output,
        fromCache: true,
      };
    }

    // Cache miss or error - call AI function
    if (!cacheResult.cached) {
      console.log(`[CACHE] 🔄 Cache miss for ${cacheType} - calling AI API`);
    } else {
      console.log(`[CACHE] ⚠️  Cache check failed (${cacheResult.error}) - calling AI API as fallback`);
    }

    // Call the AI function. By contract every _*API function in this app returns
    // the RAW result (array / string / object) on success and THROWS on error.
    // Do NOT expect a { success, data } wrapper here — that is withCache's own
    // return shape, not the aiFunction's. (Checking aiResult.success against a
    // raw array silently failed every cache miss for both Groq and Gemini.)
    const aiData = await aiFunction(input);

    if (aiData === null || aiData === undefined) {
      throw new Error('AI function returned no data');
    }

    console.log(`[CACHE] 🤖 AI API succeeded, attempting to save to cache...`);

    // Save to cache (don't fail if cache save doesn't work)
    const saveResult = await cacheOperations.saveCache(cacheType, input, aiData);
    if (saveResult.success) {
      console.log(`[CACHE] ✅ Successfully cached result`);
    } else {
      console.warn(`[CACHE] ⚠️  Failed to cache result: ${saveResult.error}`);
    }

    return {
      success: true,
      data: aiData,
      fromCache: false,
    };
  } catch (error) {
    console.error('[CACHE] ❌ Error in withCache:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Get user statistics
 * Returns total CVs, cache entries, and last update times
 */
export const getUserStats = async () => {
  try {
    const { data, error } = await supabase.from('user_stats').select('*').single();
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return { success: false, error: error.message };
  }
};

/**
 * User Profile Operations
 */
export const userProfileOperations = {
  /**
   * Get user profile
   *
   * @param {Object|null} authUser - Optional already-authenticated user object.
   *   Pass this when calling from inside supabase.auth.onAuthStateChange (or right
   *   after getSession) to AVOID calling supabase.auth.getUser() again — doing so
   *   inside the auth callback re-acquires the GoTrue lock and deadlocks, which
   *   leaves loading spinners stuck forever. When omitted, falls back to getUser().
   */
  async getUserProfile(authUser = null) {
    try {
      let user = authUser;
      if (!user) {
        const { data: { user: fetchedUser }, error: userError } = await supabase.auth.getUser();
        if (userError || !fetchedUser) {
          return { success: false, error: 'User not authenticated' };
        }
        user = fetchedUser;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return { success: true, data: data || null };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Create or update user profile
   */
  async saveUserProfile({ firstName, lastName, avatarUrl = null }) {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          email: user.email,
          first_name: firstName,
          last_name: lastName,
          avatar_url: avatarUrl,
          updated_at: new Date(),
        }, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error saving user profile:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Update display name only
   */
  async updateDisplayName(firstName, lastName) {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({ first_name: firstName, last_name: lastName, updated_at: new Date() })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error updating display name:', error);
      return { success: false, error: error.message };
    }
  },
};
