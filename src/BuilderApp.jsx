import { useRef, useState, useEffect, useMemo, useDeferredValue } from "react";
import html2pdf from "html2pdf.js";
import { supabase } from "../lib/supabaseClient";
import { cvOperations } from "./utils/databaseHelpers";
import {
  generateSkillsFromGemini,
  enhanceExperienceWithGemini,
  generateProfessionalSummaryWithGemini,
  generateEnhancedCVExperienceWithGemini,
  isGeminiConfigured,
  getApiStatus,
  rewriteSummaryWithGemini,
  generateFullCVData,
} from "./services/geminiService";
import { generateRoleQuestionsWithGroq, isGroqConfigured } from "./services/groqService";
import { getStabilityStatus } from "./services/stabilityService";

// Constants
import { getStepsForExperienceLevel, STEP_LABELS } from "./constants/steps";
import { colors, css } from "./constants/theme";
// Utils
import { getQuestionsForRoleMeta, generateSkillsFromAnswers, generateExperienceBullets } from "./utils/helpers";

// Components
import Header from "./components/Header";
import JobTargetStep from "./components/steps/JobTargetStep";
import PersonalInfoStep from "./components/steps/PersonalInfoStep";
import SkillsStep from "./components/steps/SkillsStep";
import ExperienceStep from "./components/steps/ExperienceStep";
import EducationStep from "./components/steps/EducationStep";
import CertificationsStep from "./components/steps/CertificationsStep";
import ExtrasStep from "./components/steps/ExtrasStep";
import SummaryStep from "./components/steps/SummaryStep";
import ProjectsStep from "./components/steps/ProjectsStep";
import InterestsStep from "./components/steps/InterestsStep";
import ExtraStep from "./components/steps/ExtraStep";
import AwardsStep from "./components/steps/AwardsStep";
import ActivitiesStep from "./components/steps/ActivitiesStep";
import CVPreview from "./components/preview/CVPreview";
import LiveCVPreview from "./components/preview/LiveCVPreview";
import HeadshotGenerator from "./components/pages/HeadshotGenerator";
import SaveCVModal from "./components/modals/SaveCVModal";
import LoadCVModal from "./components/modals/LoadCVModal";
// import DebugAuthStatus from "./components/DebugAuthStatus";

export default function BuilderApp({ initialUser }) {
  const STORAGE_KEY = "cv-builder-ai-form-v1";
  
  // Authentication state - use initialUser from parent.
  // BuilderApp only mounts after AppRoutes' ProtectedRoute has already verified
  // auth and handed us initialUser, so don't block on our own check when it's
  // present — otherwise a reload leaves authLoading stuck true (infinite spinner)
  // if the onAuthStateChange event is slow or deferred.
  const [user, setUser] = useState(initialUser);
  const [authLoading, setAuthLoading] = useState(!initialUser);
  
  // Navigation state
  const [mode, setMode] = useState("cv-builder"); // "cv-builder" or "headshot-generator"
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [geminiAvailable, setGeminiAvailable] = useState(false);
  const [groqAvailable, setGroqAvailable] = useState(false);

  // Which pane is visible below the two-pane breakpoint (1024px)
  const [mobileView, setMobileView] = useState("form"); // "form" | "preview"

  // Mirrors the 1023px CSS breakpoint. Needed because a display:none pane reports
  // clientWidth 0 and ResizeObserver never fires for it — the scale hook has to know
  // whether the preview is actually on screen.
  const [isNarrow, setIsNarrow] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 1023px)");
    const onChange = (e) => setIsNarrow(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Selecting a template also pins its folder, so a choice made in the live pane
  // survives into the final step (which filters the registry by selectedFolder).
  const handleSelectTemplate = (templateId, folder) => {
    setSelectedTemplate(templateId);
    if (folder) setSelectedFolder(folder);
  };

  // Template selection lives here (not in CVPreview) so a template chosen in the
  // live preview pane carries through to the final review step.
  const [selectedFolder, setSelectedFolder] = useState("Modern");
  // Must be a real id from the registry in cvTemplateEngine.jsx. The previous default
  // ("modern-standard") matched nothing and only worked via the fallback-to-first path.
  const [selectedTemplate, setSelectedTemplate] = useState("modern-geo");

  // Modal states
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [isSavingCV, setIsSavingCV] = useState(false);
  const [isLoadingCVList, setIsLoadingCVList] = useState(false);
  const [savedCVs, setSavedCVs] = useState([]);

  // Loading states
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [loadingExperience, setLoadingExperience] = useState({});
  const [loadingPDF, setLoadingPDF] = useState(false);

  // Form data - Step 1: Job Target
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("regular"); // "regular", "internship", "entry-level", "student"
  const [internshipDuration, setInternshipDuration] = useState("");

  // Form data - Step 2: Personal Info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Form data - Step 3: Skills
  const [skillAnswers, setSkillAnswers] = useState({});
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [geminiSkills, setGeminiSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState("");
  const [roleQuestions, setRoleQuestions] = useState([]);
  const [, setLoadingRoleQuestions] = useState(false);

  // Form data - Step 4: Experience
  const [experiences, setExperiences] = useState([
    { company: "", position: "", startDate: "", endDate: "", description: "" },
  ]);
  const [experienceBullets, setExperienceBullets] = useState({});
  const [projectBullets, setProjectBullets] = useState({});

  // Form data - Step 5: Education
  const [educations, setEducations] = useState([
    { school: "", degree: "", field: "", graduationYear: "" },
  ]);
  const [certifications, setCertifications] = useState([
    { name: "", issuer: "", year: "" },
  ]);
  const [professionalSummary, setProfessionalSummary] = useState("");
  const [languages, setLanguages] = useState([{ name: "", level: "" }]);
  const [references, setReferences] = useState([
    { name: "", title: "", company: "", email: "", phone: "" },
  ]);
  const [projects, setProjects] = useState([
    { name: "", role: "", tools: "", description: "" },
  ]);
  const [careerInterests, setCareerInterests] = useState("");
  const [extraDetails, setExtraDetails] = useState("");
  const [awards, setAwards] = useState([
    { title: "", issuer: "", year: "" },
  ]);
  const [activities, setActivities] = useState("");
  const [summaryToneLoading, setSummaryToneLoading] = useState(null);
  const [fullAILoading, setFullAILoading] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [fallbackUsed, setFallbackUsed] = useState(false);
  const fullAIInFlightRef = useRef({});
  const allowAuxiliaryAI = false;

  // CV data
  const [generatedSummary, setGeneratedSummary] = useState(null);
  const [enhancedCVData, setEnhancedCVData] = useState(null);
  const [loadingEnhancedCV, setLoadingEnhancedCV] = useState(false);
  const [geminiStatus, setGeminiStatus] = useState(null);
  const [stabilityStatus, setStabilityStatus] = useState(null);

  // ============================================================================
  // AUTHENTICATION
  // ============================================================================

  // Auth is now managed by parent (AppRoutes), just update on auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        setAuthLoading(false);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setStep(0);
      setMode("cv-builder");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // ============================================================================
  // DATABASE: Save/Load CV
  // ============================================================================

  const buildCVData = () => {
    return {
      jobTitle,
      company,
      experienceLevel,
      internshipDuration,
      name,
      email,
      phone,
      address,
      photoPreview,
      skillAnswers,
      selectedSkills,
      geminiSkills,
      customSkill,
      experiences,
      experienceBullets,
      educations,
      certifications,
      professionalSummary,
      languages,
      references,
      projects,
      projectBullets,
      careerInterests,
      extraDetails,
      awards,
      activities,
      roleQuestions,
      generatedSummary,
      enhancedCVData,
    };
  };

  const handleSaveCV = async ({ title, targetRole }) => {
    setIsSavingCV(true);
    try {
      const cvData = buildCVData();
      const result = await cvOperations.saveCV({
        cvId: null,
        title,
        targetRole,
        data: cvData,
      });

      if (result.success) {
        console.log("CV saved successfully:", result.id);
        setShowSaveModal(false);
        // Optionally show a success message
      } else {
        throw new Error(result.error || "Failed to save CV");
      }
    } catch (error) {
      console.error("Error saving CV:", error);
      throw error;
    } finally {
      setIsSavingCV(false);
    }
  };

  const handleLoadCVList = async () => {
    setShowLoadModal(true);
    setIsLoadingCVList(true);
    try {
      const result = await cvOperations.getAllCVs();
      if (result.success) {
        setSavedCVs(result.data || []);
      } else {
        throw new Error(result.error || "Failed to load CVs");
      }
    } catch (error) {
      console.error("Error loading CV list:", error);
      setSavedCVs([]);
    } finally {
      setIsLoadingCVList(false);
    }
  };

  const handleLoadCV = async (cvId) => {
    try {
      const result = await cvOperations.getCVById(cvId);
      if (result.success && result.data) {
        const cvData = result.data.data;

        // Restore all form data
        setJobTitle(cvData.jobTitle || "");
        setCompany(cvData.company || "");
        setExperienceLevel(cvData.experienceLevel || "regular");
        setInternshipDuration(cvData.internshipDuration || "");

        setName(cvData.name || "");
        setEmail(cvData.email || "");
        setPhone(cvData.phone || "");
        setAddress(cvData.address || "");
        setPhotoPreview(cvData.photoPreview || null);

        setSkillAnswers(cvData.skillAnswers || {});
        setSelectedSkills(cvData.selectedSkills || []);
        setGeminiSkills(cvData.geminiSkills || []);
        setCustomSkill(cvData.customSkill || "");
        setRoleQuestions(cvData.roleQuestions || []);

        setExperiences(cvData.experiences || [{ company: "", position: "", startDate: "", endDate: "", description: "" }]);
        setExperienceBullets(cvData.experienceBullets || {});
        setEducations(cvData.educations || [{ school: "", degree: "", field: "", graduationYear: "" }]);
        setCertifications(cvData.certifications || [{ name: "", issuer: "", year: "" }]);
        setProfessionalSummary(cvData.professionalSummary || "");
        setLanguages(cvData.languages || [{ name: "", level: "" }]);
        setReferences(cvData.references || [{ name: "", title: "", company: "", email: "", phone: "" }]);
        setProjects(cvData.projects || [{ name: "", role: "", tools: "", description: "" }]);
        setProjectBullets(cvData.projectBullets || {});
        setCareerInterests(cvData.careerInterests || "");
        setExtraDetails(cvData.extraDetails || "");
        setAwards(cvData.awards || [{ title: "", issuer: "", year: "" }]);
        setActivities(cvData.activities || "");
        setGeneratedSummary(cvData.generatedSummary || null);
        setEnhancedCVData(cvData.enhancedCVData || null);

        // Close modal and go back to first step
        setShowLoadModal(false);
        setStep(0);
      } else {
        throw new Error(result.error || "Failed to load CV");
      }
    } catch (error) {
      console.error("Error loading CV:", error);
      throw error;
    }
  };

  // ============================================================================
  // INITIAL LOAD / PERSISTENCE
  // ============================================================================

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (!saved) return;

      setJobTitle(saved.jobTitle || "");
      setCompany(saved.company || "");
      setExperienceLevel(saved.experienceLevel || "regular");
      setInternshipDuration(saved.internshipDuration || "");

      setName(saved.name || "");
      setEmail(saved.email || "");
      setPhone(saved.phone || "");
      setAddress(saved.address || "");
      setPhotoPreview(saved.photoPreview || null);

      setSkillAnswers(saved.skillAnswers || {});
      setSelectedSkills(saved.selectedSkills || []);
      setGeminiSkills(saved.geminiSkills || []);
      setCustomSkill(saved.customSkill || "");

      setExperiences(saved.experiences || [{ company: "", position: "", startDate: "", endDate: "", description: "" }]);
      setExperienceBullets(saved.experienceBullets || {});
      setEducations(saved.educations || [{ school: "", degree: "", field: "", graduationYear: "" }]);
      setCertifications(saved.certifications || [{ name: "", issuer: "", year: "" }]);
      setProfessionalSummary(saved.professionalSummary || "");
      setLanguages(saved.languages || [{ name: "", level: "" }]);
      setReferences(saved.references || [{ name: "", title: "", company: "", email: "", phone: "" }]);
      setProjects(saved.projects || [{ name: "", role: "", tools: "", description: "" }]);
      setProjectBullets(saved.projectBullets || {});
      setCareerInterests(saved.careerInterests || "");
      setExtraDetails(saved.extraDetails || "");
      setAwards(saved.awards || [{ title: "", issuer: "", year: "" }]);
      setActivities(saved.activities || "");
    } catch (error) {
      console.error("Failed to load saved form data:", error);
    }
  }, []);

  useEffect(() => {
    const payload = {
      jobTitle,
      company,
      experienceLevel,
      internshipDuration,
      name,
      email,
      phone,
      address,
      photoPreview,
      skillAnswers,
      selectedSkills,
      geminiSkills,
      customSkill,
      experiences,
      experienceBullets,
      educations,
      certifications,
      professionalSummary,
      languages,
      references,
      projects,
      projectBullets,
      careerInterests,
      extraDetails,
      awards,
      activities,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      console.error("Failed to save form data:", error);
    }
  }, [
    jobTitle,
    company,
    experienceLevel,
    internshipDuration,
    name,
    email,
    phone,
    address,
    photoPreview,
    skillAnswers,
    selectedSkills,
    geminiSkills,
    customSkill,
    experiences,
    experienceBullets,
    educations,
    certifications,
    professionalSummary,
    languages,
    references,
    projects,
    projectBullets,
    careerInterests,
    extraDetails,
    awards,
    activities,
  ]);

  // Check Gemini availability on mount
  useEffect(() => {
    const available = isGeminiConfigured();
    setGeminiAvailable(available);
  }, []);

  useEffect(() => {
    const available = isGroqConfigured();
    setGroqAvailable(available);
  }, []);

  useEffect(() => {
    if (!aiEnabled) return;
    const loadStatuses = async () => {
      const [gStatus, sStatus] = await Promise.all([
        getApiStatus(),
        getStabilityStatus(),
      ]);
      setGeminiStatus(gStatus);
      setStabilityStatus(sStatus);
    };

    loadStatuses().catch((error) => {
      console.warn("Status check failed:", error);
    });
  }, []);

  const steps = getStepsForExperienceLevel(experienceLevel);
  const prevStepsRef = useRef(steps);

  useEffect(() => {
    const prevSteps = prevStepsRef.current;
    const prevKey = prevSteps[step] || prevSteps[0];
    const nextIndex = steps.indexOf(prevKey);

    if (nextIndex !== -1 && nextIndex !== step) {
      setStep(nextIndex);
    } else if (step > steps.length - 1) {
      setStep(steps.length - 1);
    }

    prevStepsRef.current = steps;
  }, [steps, step]);

  const stepKey = steps[step];
  const stepTitle = STEP_LABELS[stepKey] || stepKey;
  // The final review step keeps the full-width layout (it already is a preview, and it
  // owns the template gallery + PDF export). This also guarantees #cv-preview and
  // #live-cv-preview are never in the DOM at the same time.
  const isFinalStep = stepKey === "preview";
  const { questions: baseQuestions, usedDefault: usedDefaultQuestions } = getQuestionsForRoleMeta(
    jobTitle,
    experienceLevel
  );
  const questions = roleQuestions.length > 0 ? roleQuestions : baseQuestions;

  useEffect(() => {
    const trimmedRole = jobTitle.trim();
    // Only generate AI questions when the role falls back to default questions.
    if (!trimmedRole || trimmedRole.length < 2 || !groqAvailable || !usedDefaultQuestions) {
      setRoleQuestions([]);
      setLoadingRoleQuestions(false);
      return;
    }

    let cancelled = false;
    setLoadingRoleQuestions(true);

    // Debounce: jobTitle changes on every keystroke, so this effect reruns for
    // each character. Wait until the user pauses before calling Groq — otherwise
    // every keystroke fires its own request and they rate-limit each other (429).
    // The cleanup below clears the pending timer, so only the last edit fires.
    const debounceId = setTimeout(() => {
      generateRoleQuestionsWithGroq(trimmedRole, experienceLevel, baseQuestions.length)
        .then((generated) => {
          if (cancelled) return;
          if (Array.isArray(generated) && generated.length > 0) {
            setRoleQuestions(generated);
          } else {
            setRoleQuestions([]);
          }
        })
        .catch((error) => {
          if (cancelled) return;
          console.warn("Failed to generate role questions:", error);
          setRoleQuestions([]);
        })
        .finally(() => {
          if (cancelled) return;
          setLoadingRoleQuestions(false);
        });
    }, 700);

    return () => {
      cancelled = true;
      clearTimeout(debounceId);
    };
  }, [jobTitle, experienceLevel, groqAvailable, usedDefaultQuestions, baseQuestions.length]);
  const fullAIInputSignature = JSON.stringify({
    jobTitle,
    company,
    experienceLevel,
    questions,
    skillAnswers: questions.map((_, i) => skillAnswers[i] || ""),
    experiences,
    selectedSkills,
    projects,
  });

  // Suggested skills from AI or fallback to local generation
  const suggestedSkills = geminiSkills.length > 0
    ? geminiSkills
    : generateSkillsFromAnswers(
      questions.map((_, i) => skillAnswers[i] || ""),
      jobTitle
    );

  const allSkills = [...new Set([...suggestedSkills, ...selectedSkills])];

  // ============================================================================
  // LIVE PREVIEW SNAPSHOT
  // ============================================================================

  // A stable, memoized view of the CV for the preview panes. Memoizing matters:
  // it is what lets useDeferredValue below and the engine's internal useMemo
  // actually skip work instead of rebuilding every template on every keystroke.
  const summaryText = professionalSummary || generatedSummary;
  const allSkillsKey = allSkills.join("|");
  const cvSnapshot = useMemo(
    () => ({
      name,
      jobTitle,
      email,
      phone,
      address,
      photoPreview,
      summary: summaryText,
      allSkills,
      experiences,
      educations,
      certifications,
      languages,
      references,
      projects,
      projectBullets,
      awards,
      experienceBullets,
    }),
    // allSkills is derived and gets a fresh identity each render, so depend on its
    // serialized form rather than the array itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      name, jobTitle, email, phone, address, photoPreview, summaryText, allSkillsKey,
      experiences, educations, certifications, languages, references, projects,
      projectBullets, awards, experienceBullets,
    ]
  );

  // Keeps typing on the high-priority path; the heavy template render is interruptible.
  const deferredCV = useDeferredValue(cvSnapshot);

  // ============================================================================
  // GEMINI INTEGRATION: Generate Skills from Q&A Answers
  // ============================================================================

  const generateAISkills = async () => {
    if (!allowAuxiliaryAI || !aiEnabled || !geminiAvailable || loadingSkills) return;

    setLoadingSkills(true);
    try {
      const skills = await generateSkillsFromGemini(
        questions.map((_, i) => skillAnswers[i] || ""),
        jobTitle,
        questions
      );
      setGeminiSkills(skills);
    } catch (error) {
      console.error("Failed to generate skills:", error);
    } finally {
      setLoadingSkills(false);
    }
  };

  // ============================================================================
  // GEMINI INTEGRATION: Enhance Experience Description
  // ============================================================================

  const generateAIExperience = async (expIndex) => {
    if (!allowAuxiliaryAI || !aiEnabled || !geminiAvailable || !experiences[expIndex].description.trim()) return;

    setLoadingExperience((prev) => ({ ...prev, [expIndex]: true }));
    try {
      const bullets = await enhanceExperienceWithGemini(
        experiences[expIndex].description,
        jobTitle,
        jobTitle
      );
      setExperienceBullets((prev) => ({ ...prev, [expIndex]: bullets }));
    } catch (error) {
      console.error("Failed to enhance experience:", error);
    } finally {
      setLoadingExperience((prev) => ({ ...prev, [expIndex]: false }));
    }
  };

  // ============================================================================
  // GEMINI INTEGRATION: Generate Professional Summary
  // ============================================================================

  const generateAISummary = async () => {
    if (!allowAuxiliaryAI || !aiEnabled || !geminiAvailable || generatedSummary) return;

    try {
      const summary = await generateProfessionalSummaryWithGemini(
        name,
        jobTitle,
        company,
        allSkills,
        experiences
      );
      setGeneratedSummary(summary);
    } catch (error) {
      console.error("Failed to generate summary:", error);
    }
  };

  // ============================================================================
  // GEMINI INTEGRATION: Enhanced CV Experience (Skills + Experience Combined)
  // ============================================================================

  const generateEnhancedCVData = async () => {
    if (!allowAuxiliaryAI || !aiEnabled || !geminiAvailable || enhancedCVData || !jobTitle) return;

    setLoadingEnhancedCV(true);
    try {
      // Collect skill answers as array
      const skillAnswersArray = questions.map((_, i) => skillAnswers[i] || "");

      // Call the combined analysis
      const enhanced = await generateEnhancedCVExperienceWithGemini(
        skillAnswersArray,
        experiences,
        jobTitle,
        jobTitle
      );
      
      setEnhancedCVData(enhanced);
    } catch (error) {
      console.error("Failed to generate enhanced CV data:", error);
    } finally {
      setLoadingEnhancedCV(false);
    }
  };

  // ============================================================================
  // FULL CV DATA (Single AI Call + Cache)
  // ============================================================================

  const hashString = (input) => {
    let hash = 0;
    for (let i = 0; i < input.length; i += 1) {
      hash = (hash << 5) - hash + input.charCodeAt(i);
      hash |= 0;
    }
    return `h${Math.abs(hash)}`;
  };

  const getFullAICacheKey = () => `cv_ai_cache_${hashString(fullAIInputSignature)}`;

  const applyFullAIData = (data) => {
    if (Array.isArray(data.skills)) {
      setGeminiSkills(data.skills);
    }
    if (Array.isArray(data.experienceBullets)) {
      const bulletsMap = {};
      data.experienceBullets.forEach((bullets, idx) => {
        bulletsMap[idx] = Array.isArray(bullets)
          ? bullets.map((b) => (b || "").replace(/<br>\s*$/i, "").trim())
          : [];
      });
      setExperienceBullets(bulletsMap);
    }
    if (Array.isArray(data.projectBullets)) {
      const bulletsMap = {};
      data.projectBullets.forEach((bullets, idx) => {
        bulletsMap[idx] = Array.isArray(bullets)
          ? bullets.map((b) => (b || "").replace(/<br>\s*$/i, "").trim())
          : [];
      });
      setProjectBullets(bulletsMap);
    }
    if (typeof data.summary === "string") {
      setProfessionalSummary(data.summary);
    }
  };

  const loadFullAICache = (key) => {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return false;
      const parsed = JSON.parse(cached);
      const data = parsed?.data || parsed;
      const meta = parsed?._meta || data?._meta;
      if (!data) return false;
      applyFullAIData(data);
      setFallbackUsed(!!meta?.fallbackUsed);
      return true;
    } catch (error) {
      console.warn("Failed to load AI cache:", error);
      return false;
    }
  };

  const generateFullAI = async () => {
    if (!geminiAvailable || fullAILoading) return;
    setAiEnabled(true);

    const cacheKey = getFullAICacheKey();

    if (loadFullAICache(cacheKey)) return;
    if (fullAIInFlightRef.current[cacheKey]) return fullAIInFlightRef.current[cacheKey];

    setFullAILoading(true);
    setFallbackUsed(false);
    try {
      const requestPromise = generateFullCVData({
        jobTitle,
        company,
        experienceLevel,
        questions,
        skillAnswers: questions.map((_, i) => skillAnswers[i] || ""),
        experiences,
        projects,
        selectedSkills,
      });
      fullAIInFlightRef.current[cacheKey] = requestPromise;
      const result = await requestPromise;
      applyFullAIData(result);
      setFallbackUsed(!!result?._meta?.fallbackUsed);
      localStorage.setItem(
        cacheKey,
        JSON.stringify({ data: result, _meta: result?._meta, savedAt: Date.now() })
      );
    } catch (error) {
      console.error("Full AI generation failed:", error);
    } finally {
      delete fullAIInFlightRef.current[cacheKey];
      setFullAILoading(false);
    }
  };

  // ============================================================================
  // GEMINI INTEGRATION: Rewrite Summary Tone
  // ============================================================================

  const rewriteSummaryTone = async (tone) => {
    if (!allowAuxiliaryAI || !aiEnabled || !geminiAvailable || !professionalSummary.trim()) return;

    setSummaryToneLoading(tone);
    try {
      const rewritten = await rewriteSummaryWithGemini(professionalSummary, tone);
      setProfessionalSummary(rewritten);
    } catch (error) {
      console.error("Failed to rewrite summary:", error);
    } finally {
      setSummaryToneLoading(null);
    }
  };

  // ============================================================================
  // PDF GENERATION
  // ============================================================================

  const generatePDF = async () => {
    const element = document.getElementById("cv-preview");
    if (!element) {
      alert("Preview not ready yet. Please try again in a moment.");
      return;
    }

    setLoadingPDF(true);
    try {
      await html2pdf()
        .set({
          margin: 5,
          filename: "cv.pdf",
          image: { type: "jpeg", quality: 1 },
          html2canvas: {
            scale: 3,
            useCORS: true,
            letterRendering: true,
            backgroundColor: "#ffffff",
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
          },
          pagebreak: { mode: ["css"] },
        })
        .from(element)
        .save();
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Sorry, something went wrong while generating the PDF.");
      setLoadingPDF(false);
      return;
    }
    setLoadingPDF(false);
  };

  // ============================================================================
  // FORM HANDLERS
  // ============================================================================

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const addExperience = () =>
    setExperiences((prev) => [...prev, { company: "", position: "", startDate: "", endDate: "", description: "" }]);

  const updateExp = (i, field, val) =>
    setExperiences((prev) => prev.map((e, idx) => (idx === i ? { ...e, [field]: val } : e)));

  const removeExp = (i) => setExperiences((prev) => prev.filter((_, idx) => idx !== i));

  const addEducation = () =>
    setEducations((prev) => [...prev, { school: "", degree: "", field: "", graduationYear: "" }]);

  const updateEdu = (i, field, val) =>
    setEducations((prev) => prev.map((e, idx) => (idx === i ? { ...e, [field]: val } : e)));

  const removeEdu = (i) => setEducations((prev) => prev.filter((_, idx) => idx !== i));

  const addCertification = () =>
    setCertifications((prev) => [...prev, { name: "", issuer: "", year: "" }]);

  const updateCertification = (i, field, val) =>
    setCertifications((prev) => prev.map((c, idx) => (idx === i ? { ...c, [field]: val } : c)));

  const removeCertification = (i) =>
    setCertifications((prev) => prev.filter((_, idx) => idx !== i));

  const addLanguage = () => setLanguages((prev) => [...prev, { name: "", level: "" }]);

  const updateLanguage = (i, field, val) =>
    setLanguages((prev) => prev.map((lang, idx) => (idx === i ? { ...lang, [field]: val } : lang)));

  const removeLanguage = (i) => setLanguages((prev) => prev.filter((_, idx) => idx !== i));

  const addReference = () =>
    setReferences((prev) => [...prev, { name: "", title: "", company: "", email: "", phone: "" }]);

  const updateReference = (i, field, val) =>
    setReferences((prev) => prev.map((ref, idx) => (idx === i ? { ...ref, [field]: val } : ref)));

  const removeReference = (i) => setReferences((prev) => prev.filter((_, idx) => idx !== i));

  const addProject = () =>
    setProjects((prev) => [...prev, { name: "", role: "", tools: "", description: "" }]);

  const updateProject = (i, field, val) =>
    setProjects((prev) => prev.map((proj, idx) => (idx === i ? { ...proj, [field]: val } : proj)));

  const removeProject = (i) => setProjects((prev) => prev.filter((_, idx) => idx !== i));

  const addAward = () =>
    setAwards((prev) => [...prev, { title: "", issuer: "", year: "" }]);

  const updateAward = (i, field, val) =>
    setAwards((prev) => prev.map((award, idx) => (idx === i ? { ...award, [field]: val } : award)));

  const removeAward = (i) => setAwards((prev) => prev.filter((_, idx) => idx !== i));

  const goToProjects = () => {
    const projectsIndex = steps.indexOf("projects");
    if (projectsIndex !== -1) {
      setStep(projectsIndex);
    }
  };

  const next = () => {
    if (step === steps.length - 2) {
      setGenerating(true);
      setTimeout(() => setGenerating(false), 2200);
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  // ============================================================================
  // RENDER
  // ============================================================================

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  // If in headshot generator mode, render that instead
  if (mode === "headshot-generator") {
    return (
      <>
        <style>{css}</style>
        <HeadshotGenerator
          onBack={() => setMode("cv-builder")}
          stabilityStatus={stabilityStatus}
        />
      </>
    );
  }

  // Otherwise render CV Builder
  return (
    <>
      <style>{css}</style>
      <div className="app">
        <Header 
          step={step} 
          steps={steps}
          onHeadshotGenerator={() => setMode("headshot-generator")}
          showHeadshotButton={true}
          geminiStatus={geminiStatus}
          stabilityStatus={stabilityStatus}
          user={user}
          onSignOut={handleSignOut}
          onSaveCV={() => setShowSaveModal(true)}
          onLoadCV={handleLoadCVList}
        />

        <main className="main">
          <div
            className={isFinalStep ? undefined : "builder-split"}
            data-mobile-view={isFinalStep ? undefined : mobileView}
            style={isFinalStep ? { width: "100%", display: "flex", justifyContent: "center" } : undefined}
          >
            {!isFinalStep && (
              <div className="builder-mobile-switch" style={{ gridColumn: "1 / -1" }}>
                <button
                  className={mobileView === "form" ? "active" : ""}
                  onClick={() => setMobileView("form")}
                >
                  ✏️ Questions
                </button>
                <button
                  className={mobileView === "preview" ? "active" : ""}
                  onClick={() => setMobileView("preview")}
                >
                  👁 Preview
                </button>
              </div>
            )}

            <div className={isFinalStep ? undefined : "builder-pane-form"}>
          {stepKey === "target" && (
            <JobTargetStep
              stepNumber={step + 1}
              stepTitle={stepTitle}
              jobTitle={jobTitle}
              setJobTitle={setJobTitle}
              company={company}
              setCompany={setCompany}
              experienceLevel={experienceLevel}
              setExperienceLevel={setExperienceLevel}
              internshipDuration={internshipDuration}
              setInternshipDuration={setInternshipDuration}
              next={next}
              back={step > 0 ? back : null}
            />
          )}

          {stepKey === "personal" && (
            <PersonalInfoStep
              stepNumber={step + 1}
              stepTitle={stepTitle}
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              phone={phone}
              setPhone={setPhone}
              address={address}
              setAddress={setAddress}
              photoPreview={photoPreview}
              handlePhotoUpload={handlePhotoUpload}
              next={next}
              back={back}
            />
          )}

          {stepKey === "skills" && (
            <SkillsStep
              stepNumber={step + 1}
              stepTitle={stepTitle}
              jobTitle={jobTitle}
              questions={questions}
              skillAnswers={skillAnswers}
              setSkillAnswers={setSkillAnswers}
              selectedSkills={selectedSkills}
              setSelectedSkills={setSelectedSkills}
              toggleSkill={toggleSkill}
              customSkill={customSkill}
              setCustomSkill={setCustomSkill}
              geminiAvailable={geminiAvailable}
              loadingSkills={loadingSkills}
              suggestedSkills={suggestedSkills}
              generateAISkills={generateAISkills}
              aiEnabled={aiEnabled}
              next={next}
              back={back}
            />
          )}

          {stepKey === "experience" && (
            <ExperienceStep
              stepNumber={step + 1}
              stepTitle={stepTitle}
              experiences={experiences}
              updateExp={updateExp}
              removeExp={removeExp}
              addExperience={addExperience}
              experienceBullets={experienceBullets}
              generateAIExperience={generateAIExperience}
              loadingExperience={loadingExperience}
              geminiAvailable={geminiAvailable}
              aiEnabled={aiEnabled}
              jobTitle={jobTitle}
              experienceLevel={experienceLevel}
              onGoToProjects={goToProjects}
              next={next}
              back={back}
            />
          )}

          {stepKey === "education" && (
            <EducationStep
              stepNumber={step + 1}
              stepTitle={stepTitle}
              educations={educations}
              updateEdu={updateEdu}
              removeEdu={removeEdu}
              addEducation={addEducation}
              next={next}
              back={back}
            />
          )}

          {stepKey === "certifications" && (
            <CertificationsStep
              stepNumber={step + 1}
              stepTitle={stepTitle}
              certifications={certifications}
              updateCertification={updateCertification}
              removeCertification={removeCertification}
              addCertification={addCertification}
              next={next}
              back={back}
            />
          )}

          {stepKey === "summary" && (
            <SummaryStep
              stepNumber={step + 1}
              stepTitle={stepTitle}
              professionalSummary={professionalSummary}
              setProfessionalSummary={setProfessionalSummary}
              geminiAvailable={geminiAvailable}
              aiEnabled={aiEnabled}
              onMakeCasual={() => rewriteSummaryTone("casual")}
              onMakeProfessional={() => rewriteSummaryTone("professional")}
              loadingTone={summaryToneLoading}
              onGenerateFullAI={generateFullAI}
              loadingFullAI={fullAILoading}
              next={next}
              back={back}
            />
          )}

          {stepKey === "extras" && (
            <ExtrasStep
              stepNumber={step + 1}
              stepTitle={stepTitle}
              languages={languages}
              updateLanguage={updateLanguage}
              addLanguage={addLanguage}
              removeLanguage={removeLanguage}
              references={references}
              updateReference={updateReference}
              addReference={addReference}
              removeReference={removeReference}
              next={next}
              back={back}
            />
          )}

          {stepKey === "projects" && (
            <ProjectsStep
              stepNumber={step + 1}
              stepTitle={stepTitle}
              projects={projects}
              updateProject={updateProject}
              removeProject={removeProject}
              addProject={addProject}
              projectBullets={projectBullets}
              next={next}
              back={back}
            />
          )}

          {stepKey === "interests" && (
            <InterestsStep
              stepNumber={step + 1}
              stepTitle={stepTitle}
              careerInterests={careerInterests}
              setCareerInterests={setCareerInterests}
              next={next}
              back={back}
            />
          )}

          {stepKey === "extra" && (
            <ExtraStep
              stepNumber={step + 1}
              stepTitle={stepTitle}
              extraDetails={extraDetails}
              setExtraDetails={setExtraDetails}
              next={next}
              back={back}
            />
          )}

          {stepKey === "awards" && (
            <AwardsStep
              stepNumber={step + 1}
              stepTitle={stepTitle}
              awards={awards}
              updateAward={updateAward}
              addAward={addAward}
              removeAward={removeAward}
              next={next}
              back={back}
            />
          )}

          {stepKey === "activities" && (
            <ActivitiesStep
              stepNumber={step + 1}
              stepTitle={stepTitle}
              activities={activities}
              setActivities={setActivities}
              next={next}
              back={back}
            />
          )}

          {stepKey === "preview" && (
            <CVPreview
              stepNumber={step + 1}
              stepTitle={stepTitle}
              experienceLevel={experienceLevel}
              name={name}
              jobTitle={jobTitle}
              company={company}
              email={email}
              phone={phone}
              address={address}
              photoPreview={photoPreview}
              summary={professionalSummary || generatedSummary}
              allSkills={allSkills}
              experiences={experiences}
              educations={educations}
              certifications={certifications}
              languages={languages}
              references={references}
              projects={projects}
              projectBullets={projectBullets}
              careerInterests={careerInterests}
              extraDetails={extraDetails}
              awards={awards}
              activities={activities}
              experienceBullets={experienceBullets}
              enhancedCVData={enhancedCVData}
              loadingEnhancedCV={loadingEnhancedCV}
              fallbackUsed={fallbackUsed}
              generateSummary={generateAISummary}
              generatePDF={generatePDF}
              loadingPDF={loadingPDF}
              next={next}
              back={back}
              selectedFolder={selectedFolder}
              selectedTemplate={selectedTemplate}
              onSelectFolder={setSelectedFolder}
              onSelectTemplate={setSelectedTemplate}
            />
          )}
            </div>

            {!isFinalStep && (
              <aside className="builder-pane-preview">
                <LiveCVPreview
                  cv={deferredCV}
                  experienceLevel={experienceLevel}
                  selectedFolder={selectedFolder}
                  selectedTemplate={selectedTemplate}
                  onSelectTemplate={handleSelectTemplate}
                  active={mobileView === "preview" || !isNarrow}
                />
              </aside>
            )}
          </div>
        </main>
      </div>

      {generating && (
        <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.7)", zIndex: 1000 }}>
          <div style={{ backgroundColor: colors.surfaceContainerLowest, padding: 40, borderRadius: 12, textAlign: "center" }}>
            <div className="gen-text">
              <strong>✨ Generating Your CV...</strong>
              <p>Hold tight, your AI-powered CV is being prepared.</p>
            </div>
          </div>
        </div>
      )}

      <SaveCVModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveCV}
        currentTitle={jobTitle}
        currentTargetRole={jobTitle}
        isSaving={isSavingCV}
      />

      <LoadCVModal
        isOpen={showLoadModal}
        onClose={() => setShowLoadModal(false)}
        onLoad={handleLoadCV}
        isLoading={isLoadingCVList}
        savedCVs={savedCVs}
      />

      {/* <DebugAuthStatus /> */}
    </>
  );
}

const styles = {
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid rgba(255, 255, 255, 0.3)",
    borderTop: "4px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "16px",
  },
};

// Add CSS animation for spinner
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}
