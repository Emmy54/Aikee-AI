# Gemini Integration Setup Checklist

## 📋 Step-by-Step Setup

### Phase 1: Get API Key (5 minutes)

- [ ] Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
- [ ] Sign in with your Google account (create one if needed)
- [ ] Click "Create API Key"
- [ ] Select your project (or create new one)
- [ ] Copy the API key (looks like: `AIza...`)
- [ ] Store it somewhere safe temporarily

### Phase 2: Configure Project (2 minutes)

- [ ] Open terminal in project root
- [ ] Run: `cp .env.example .env.local`
- [ ] Open `.env.local` in editor
- [ ] Replace `your_gemini_api_key_here` with your actual key
- [ ] Save file
- [ ] Verify `.env.local` is in `.gitignore` (should be already)

### Phase 3: Install & Start (2 minutes)

- [ ] Verify dependencies: `npm install`
- [ ] Start dev server: `npm run dev`
- [ ] Open http://localhost:5173 in browser
- [ ] You should see CV Builder app

### Phase 4: Test Skills Generation (3 minutes)

- [ ] Navigate to "Step 1 — Job Target"
- [ ] Enter job title: `Software Engineer`
- [ ] Enter company: `Google` (or any company)
- [ ] Click "Continue →"
- [ ] Fill in personal details (Name, Email required)
- [ ] Click "Continue →"
- [ ] You're now on "Step 3 — Skills"
- [ ] **Answer at least 2 questions**
- [ ] Click "✨ AI Generate" button
- [ ] ✓ Skills should appear below (e.g., "Software Development", "Cloud Platforms")

### Phase 5: Test Experience Enhancement (3 minutes)

- [ ] Click "Continue →" to go to Step 4 (Experience)
- [ ] Fill in: Job Title, Company, Years/Duration
- [ ] In "What did you actually do?" field, type:
  ```
  Helped manage inventory and customer service for the family restaurant on weekends
  ```
- [ ] Once text is 20+ characters, you'll see a "✨" button appear on the right
- [ ] Click the "✨" button
- [ ] ✓ The preview below should update with enhanced bullet points

### Phase 6: Test Summary Generation (2 minutes)

- [ ] Click "Continue →" through Education step
- [ ] Click "Generate My CV →"
- [ ] You'll see a loading animation briefly
- [ ] You're now on the Preview step
- [ ] Click "✨ Refine Summary with AI" button
- [ ] ✓ The professional summary should update with AI-generated content

---

## 🧪 Troubleshooting

### "API key not configured" or no AI buttons visible

**Problem**: The `✨ AI Generate` buttons aren't showing

**Solutions**:
1. Check `.env.local` file exists in root directory
2. Verify it contains: `VITE_GEMINI_API_KEY=your_key`
3. Make sure **no spaces** around the `=` sign
4. Restart dev server: Stop it (Ctrl+C) and run `npm run dev` again
5. Hard refresh browser (Ctrl+Shift+R)

### "Invalid API key" error in console

**Problem**: API calls fail with authentication error

**Solutions**:
1. Double-check your API key is copied correctly (no extra spaces)
2. Verify the key starts with `AIza`
3. Visit [Google AI Studio](https://aistudio.google.com/app/apikey) and regenerate if needed
4. Replace key in `.env.local` and restart server

### Slow response / timeout

**Problem**: Generating skills/experience takes too long

**Solutions**:
1. Check your internet connection
2. May happen on first request - give it 5-10 seconds
3. Gemini API can be slow during peak hours
4. Try again in a few minutes

### Getting "JSON parse error"

**Problem**: Response from Gemini is malformed

**Solutions**:
1. This is usually temporary
2. Try the generate button again
3. Check browser console for exact error message
4. Report at [Google AI Forum](https://discord.gg/google-ai-dev) if persists

### Features work but generate wrong/bad content

**Problem**: AI output quality is poor

**Solutions**:
1. Provide more detailed/specific answers to questions
2. Write longer experience descriptions (10+ words)
3. Edit and improve the generated content manually
4. Consider customizing the prompts in `geminiService.js`

---

## ✅ Everything Working?

Once all 6 phases pass:

- [x] Skills generation works
- [x] Experience enhancement works
- [x] Summary generation works
- [x] No errors in console
- [x] API key is secure in `.env.local`

You're ready to use and deploy! 🚀

---

## 📚 Next Steps

### Want to customize?

1. **Edit skill discovery prompts**: See `GEMINI_INTEGRATION.md` → Feature 1
2. **Change experience enhancement**: See `GEMINI_INTEGRATION.md` → Feature 2
3. **Add real headshots**: See `GEMINI_INTEGRATION.md` → Feature 3 → "To Upgrade"

### Want to add more features?

Check `CODE_EXAMPLES.js` for:
- Custom prompts
- Batch processing
- Caching
- Error handling
- Rate limiting

### Ready to deploy?

1. Build: `npm run build`
2. Deploy `dist/` folder to your hosting
3. Add `VITE_GEMINI_API_KEY` to environment variables:
   - **Vercel**: Settings → Environment Variables
   - **Netlify**: Site settings → Build & deploy → Environment
   - **Others**: Follow your host's env variable docs

---

## 🆘 Getting Help

**Stuck?** Try these in order:

1. Check console: Open DevTools (F12) and look for red errors
2. Read GEMINI_INTEGRATION.md for detailed info
3. Check CODE_EXAMPLES.js for copy-paste solutions
4. Visit [ai.google.dev](https://ai.google.dev/) for API docs
5. Check GitHub issues for similar problems

---

## 📊 Performance Notes

| Feature | Time | Notes |
|---------|------|-------|
| Skills Generation | 2-4s | First request may be slower |
| Experience Enhancement | 2-3s | Per experience entry |
| Summary Generation | 2-4s | Full biography analysis |
| Headshot Generation | <1s | Local SVG rendering |

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] `.env.local` is in `.gitignore`
- [ ] Never commit API key to git
- [ ] Use different keys for dev/prod if needed
- [ ] Set API key quotas in Google Cloud console
- [ ] Monitor usage at [Google Cloud Console](https://console.cloud.google.com/)
- [ ] Set up billing alerts

---

## 💡 Pro Tips

1. **Faster testing**: Use shorter job titles like "PM" or "Dev" instead of full titles
2. **Better skills**: Write detailed answers to questions (more context = better results)
3. **Better experiences**: Write 30+ character descriptions for best enhancement
4. **Debugging**: Check browser Network tab to see actual API requests/responses
5. **Offline mode**: App works without API key (uses fallbacks), good for testing UI

---

**Last Updated**: March 10, 2026
**Status**: Ready for production use ✓
