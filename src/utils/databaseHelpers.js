// Database Helper Functions for CV Builder AI
// Simplifies common database operations with error handling

import { supabase } from '../../lib/supabaseClient';
import crypto from 'crypto';

/**
 * Hash input string for AI cache matching
 * Allows deduplication based on content, not exact string match
 */
export const hashInput = (input) => {
  return crypto.createHash('md5').update(JSON.stringify(input)).digest('hex');
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
    
    const aiResult = await aiFunction(input);

    if (!aiResult || !aiResult.success) {
      const errorMsg = aiResult?.error || 'AI function failed';
      console.error(`[CACHE] ❌ AI function failed: ${errorMsg}`);
      throw new Error(errorMsg);
    }

    console.log(`[CACHE] 🤖 AI API succeeded, attempting to save to cache...`);
    
    // Save to cache (don't fail if cache save doesn't work)
    const saveResult = await cacheOperations.saveCache(cacheType, input, aiResult.data);
    if (saveResult.success) {
      console.log(`[CACHE] ✅ Successfully cached result`);
    } else {
      console.warn(`[CACHE] ⚠️  Failed to cache result: ${saveResult.error}`);
    }

    return {
      success: true,
      data: aiResult.data,
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
   */
  async getUserProfile() {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
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
        .from('user_profiles')
        .upsert({
          id: user.id,
          email: user.email,
          first_name: firstName,
          last_name: lastName,
          avatar_url: avatarUrl,
          updated_at: new Date(),
        }, { onConflict: 'id' })
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
        .from('user_profiles')
        .update({ first_name: firstName, last_name: lastName, updated_at: new Date() })
        .eq('id', user.id)
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
