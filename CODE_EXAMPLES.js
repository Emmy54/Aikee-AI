/**
 * CODE EXAMPLES - Quick Reference for Gemini Integration
 * Copy & paste snippets for common tasks
 */

// ============================================================================
// EXAMPLE 1: Using Skills Generation
// ============================================================================

// Import the service
import { generateSkillsFromGemini } from './services/geminiService';

// In your component
const handleGenerateSkills = async () => {
  const skillAnswers = {
    0: "Yes, I led a team of 3 people",
    1: "I use Excel and Tableau for reporting",
    2: "Yes, I use Slack and Asana daily",
  };
  
  const jobTitle = "Product Manager";
  
  const questions = [
    "Have you managed any projects or teams?",
    "Do you have experience with data analysis?",
    "Have you used collaboration tools?",
  ];
  
  try {
    const skills = await generateSkillsFromGemini(
      skillAnswers,
      jobTitle,
      questions
    );
    
    console.log('Generated skills:', skills);
    // ["Product Strategy", "Data Visualization", "Team Leadership", ...]
    
    setSkills(skills); // Update your state
  } catch (error) {
    console.error('Error:', error);
    // Handle error - maybe show fallback
  }
};

// ============================================================================
// EXAMPLE 2: Using Experience Enhancement
// ============================================================================

import { enhanceExperienceWithGemini } from './services/geminiService';

const handleEnhanceExperience = async () => {
  const rawExp = "Worked at the family restaurant on weekends, helped serve customers and managed the cash register";
  const jobTitle = "Operations Manager";
  
  try {
    const bullets = await enhanceExperienceWithGemini(
      rawExp,
      jobTitle,
      jobTitle
    );
    
    console.log('Enhanced bullets:', bullets);
    // [
    //   "• Managed daily operations and customer service for 50+ transactions",
    //   "• Maintained accuracy in cash handling and reconciliation",
    //   "• Provided excellent service resulting in positive customer feedback"
    // ]
    
    setExperienceBullets(bullets);
  } catch (error) {
    console.error('Error:', error);
  }
};

// ============================================================================
// EXAMPLE 3: Using Professional Summary Generation
// ============================================================================

import { generateProfessionalSummaryWithGemini } from './services/geminiService';

// const handleGenerateSummary = async () => {
//   try {
//     const summary = await generateProfessionalSummaryWithGemini(
//       name: "John Doe",           // string
//       jobTitle: "Software Engineer",  // string
//       company: "Google",          // string
//       skills: ["Python", "React", "AWS"],  // array
//       experiences: [              // array of exp objects
//         { title: "Developer", company: "Startup A" },
//         { title: "Intern", company: "Startup B" }
//       ]
//     );
    
//     console.log('Generated summary:', summary);
//     // "Driven Software Engineer with expertise in Python and React..."
    
//     setSummary(summary);
//   } catch (error) {
//     console.error('Error:', error);
//   }
// };

// ============================================================================
// EXAMPLE 4: Checking API Configuration
// ============================================================================

import { isGeminiConfigured, getApiStatus } from './services/geminiService';

// Quick check
if (isGeminiConfigured()) {
  console.log('Gemini API is configured!');
} else {
  console.log('Please add VITE_GEMINI_API_KEY to .env.local');
}

// Detailed check
const checkAPI = async () => {
  const status = await getApiStatus();
  console.log(status);
  
  if (status.configured && status.valid) {
    console.log('✓ API key is valid');
  } else {
    console.log('✗ API issue:', status.message);
  }
};

// ============================================================================
// EXAMPLE 5: Error Handling Pattern
// ============================================================================

const safeGenerateSkills = async (answers, jobTitle, questions) => {
  try {
    setLoading(true);
    
    const skills = await generateSkillsFromGemini(
      answers,
      jobTitle,
      questions
    );
    
    if (!skills || skills.length === 0) {
      throw new Error('No skills generated');
    }
    
    setSkills(skills);
    showSuccess('Skills generated successfully');
    
  } catch (error) {
    console.error('Skill generation failed:', error);
    
    // Fallback to basic skills
    const fallbackSkills = ["Communication", "Problem Solving"];
    setSkills(fallbackSkills);
    
    showError('Using default skills. Please check API key.');
    
  } finally {
    setLoading(false);
  }
};

// ============================================================================
// EXAMPLE 6: React Hooks Pattern
// ============================================================================

import { useState, useEffect } from 'react';
import { generateSkillsFromGemini, isGeminiConfigured } from './services/geminiService';

function SkillsComponent() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [geminiEnabled, setGeminiEnabled] = useState(false);
  
  // Check API on mount
  useEffect(() => {
    setGeminiEnabled(isGeminiConfigured());
  }, []);
  
  // Generate skills when answers change
  useEffect(() => {
    if (Object.keys(skillAnswers).length >= 2 && geminiEnabled) {
      generateSkills();
    }
  }, [skillAnswers, jobTitle]);
  
  const generateSkills = async () => {
    setLoading(true);
    try {
      const result = await generateSkillsFromGemini(
        skillAnswers,
        jobTitle,
        questions
      );
      setSkills(result);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      {loading && <p>Generating skills...</p>}
      {skills.map(skill => <div key={skill}>{skill}</div>)}
      {!geminiEnabled && <p>Gemini not configured</p>}
    </div>
  );
}

// ============================================================================
// EXAMPLE 7: Custom Prompts (Advanced)
// ============================================================================

// Modify geminiService.js to accept custom prompts

export const generateWithCustomPrompt = async (prompt) => {
  if (!GEMINI_API_KEY) throw new Error('API key not found');
  
  try {
    const response = await fetch(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      }
    );
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};

// // Usage:
// const customSkillPrompt = `You are a Silicon Valley recruiter. Suggest 5 modern tech skills for a startup engineer...`;
// const result = await generateWithCustomPrompt(customSkillPrompt);

// ============================================================================
// EXAMPLE 8: Batch Processing Multiple Experiences
// ============================================================================

const enhanceAllExperiences = async (experiences, jobTitle) => {
  try {
    const enhancedExperiences = await Promise.all(
      experiences.map((exp, i) =>
        enhanceExperienceWithGemini(exp.raw, jobTitle, jobTitle)
          .then(bullets => ({ index: i, bullets }))
          .catch(err => ({ index: i, error: err }))
      )
    );
    
    // Create map of results
    const bulletsMap = {};
    enhancedExperiences.forEach((result) => {
      if (!result.error) {
        bulletsMap[result.index] = result.bullets;
      }
    });
    
    setExperienceBullets(bulletsMap);
    return bulletsMap;
    
  } catch (error) {
    console.error('Batch enhancement error:', error);
  }
};

// ============================================================================
// EXAMPLE 9: Caching Generated Content
// ============================================================================

const skillsCache = {};

const generateSkillsWithCache = async (answers, jobTitle, questions) => {
  const cacheKey = JSON.stringify({ answers, jobTitle });
  
  // Check cache first
  if (skillsCache[cacheKey]) {
    console.log('Using cached skills');
    return skillsCache[cacheKey];
  }
  
  // Generate if not cached
  const skills = await generateSkillsFromGemini(
    answers,
    jobTitle,
    questions
  );
  
  // Store in cache
  skillsCache[cacheKey] = skills;
  
  return skills;
};

// ============================================================================
// EXAMPLE 10: Progress Tracking
// ============================================================================

const trackGenerationProgress = async (feature, step) => {
  const timestamp = new Date().toISOString();
  
  console.log(`[${timestamp}] ${feature} - Step: ${step}`);
  
  // Could send to analytics service:
  // analytics.track('generation_progress', { feature, step });
  
  // Or log to server:
  // fetch('/api/analytics', { body: JSON.stringify({ feature, step }) });
};

// Usage:
const generateSkillsWithTracking = async (answers, jobTitle, questions) => {
  trackGenerationProgress('skills', 'started');
  
  try {
    const skills = await generateSkillsFromGemini(answers, jobTitle, questions);
    trackGenerationProgress('skills', 'success');
    return skills;
  } catch (error) {
    trackGenerationProgress('skills', 'error');
    throw error;
  }
};

// ============================================================================
// EXAMPLE 11: Rate Limiting
// ============================================================================

let lastRequestTime = 0;
const MIN_REQUEST_DELAY = 1000; // 1 second between requests

const rateLimitedGenerate = async (generateFn) => {
  const timeSinceLastRequest = Date.now() - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_DELAY) {
    const delayNeeded = MIN_REQUEST_DELAY - timeSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, delayNeeded));
  }
  
  lastRequestTime = Date.now();
  return await generateFn();
};

// Usage:
const result = await rateLimitedGenerate(() =>
  generateSkillsFromGemini(answers, jobTitle, questions)
);

// ============================================================================
// EXAMPLE 12: Retry Logic
// ============================================================================

const retryWithBackoff = async (
  fn,
  maxRetries = 3,
  initialDelay = 1000
) => {
  let delay = initialDelay;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      
      console.log(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
};

// Usage:
const skills = await retryWithBackoff(
  () => generateSkillsFromGemini(answers, jobTitle, questions),
  3,  // max retries
  1000  // initial delay
);
