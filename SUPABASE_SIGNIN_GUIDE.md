# Supabase Sign-In Setup Guide

## 🎯 What Was Added

A complete authentication system with sign-in/sign-up pages and user management using Supabase.

### Features:
- ✅ Email/Password Authentication
- ✅ Sign-Up with Email Confirmation
- ✅ Google OAuth Integration
- ✅ GitHub OAuth Integration
- ✅ User Session Management
- ✅ Sign-Out Functionality
- ✅ Protected CV Builder (redirects to sign-in if not authenticated)

---

## 🔐 Environment Variables Setup

### 1. Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project or select an existing one
3. Go to **Settings → API**
4. Copy the following:
   - **Project URL** → `VITE_SUPABASE_PUBLIC_URL`
   - **Anon/Public Key** → `VITE_SUPABASE_PUBLIC_ANON_KEY`

### 2. Create `.env.local` File

In your project root, create a `.env.local` file:

```env
# Supabase Configuration
VITE_SUPABASE_PUBLIC_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLIC_ANON_KEY=your-anon-key-here

# Keep your other environment variables
VITE_USE_SERVER=true
VITE_API_BASE_URL=
GEMINI_API_KEY=your_key_here
STABILITY_API_KEY=your_key_here
```

---

## 🔑 Optional: OAuth Provider Setup (Google & GitHub)

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the **Google+ API**
4. Create OAuth 2.0 credentials (Web Application)
5. In Supabase Dashboard:
   - Go to **Authentication → Providers**
   - Select **Google**
   - Enter your Client ID and Client Secret
   - Add your redirect URL: `https://your-project.supabase.co/auth/v1/callback`

### GitHub OAuth Setup

1. Go to [GitHub Settings → Developer Applications](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in the details:
   - **Authorization callback URL**: `https://your-project.supabase.co/auth/v1/callback`
4. Copy the Client ID and Client Secret
5. In Supabase Dashboard:
   - Go to **Authentication → Providers**
   - Select **GitHub**
   - Enter your credentials

---

## 📱 Component Overview

### SignIn.jsx (`src/components/pages/SignIn.jsx`)
Handles user authentication with:
- Email/password sign-in
- Sign-up form
- OAuth buttons (Google, GitHub)
- Error and success messages
- Loading states

**Props:**
- `onSignInSuccess` - Callback when user successfully signs in

### Updated App.jsx
- Checks authentication on mount
- Shows loading state while checking auth
- Redirects to SignIn if not authenticated
- Passes user data to Header

### Updated Header.jsx
- Displays user dropdown menu
- Shows user email
- Sign-out button

---

## 🚀 Usage

### For Users
1. Visit the CV Builder
2. If not signed in, you'll see the Sign-In page
3. Click "Don't have an account?" to create a new account
4. Verify your email (check spam folder)
5. Sign in and build your CV

### For Developers

**Check if user is authenticated:**
```javascript
import { supabase } from "../lib/supabaseClient";

const { data: { user } } = await supabase.auth.getUser();
```

**Sign out:**
```javascript
await supabase.auth.signOut();
```

**Get session info:**
```javascript
const { data: { session } } = await supabase.auth.getSession();
```

---

## 🐛 Troubleshooting

### "SUPABASE_PUBLIC_URL is undefined"
- Make sure you created `.env.local` in the project root
- Restart your development server after adding env variables
- Check that variable names match exactly (case-sensitive)

### OAuth buttons don't work
- Ensure you've configured the OAuth provider in Supabase
- Check the redirect URL matches your Supabase project URL
- Verify the Client ID and Secret are correct

### "Invalid login credentials"
- Make sure you've verified your email (check spam)
- Double-check password matches what you entered during sign-up

### Stuck on loading screen
- Check browser console for errors
- Ensure Supabase credentials are correct
- Try clearing browser cache/localStorage

---

## 📚 Next Steps (Optional Features)

You can add:
- **Password Reset**: `supabase.auth.resetPasswordForEmail(email)`
- **Profile Page**: Store user data in a `profiles` table
- **Email Verification**: `supabase.auth.resend()`
- **Social Profile Data**: Store OAuth profile info after sign-in
- **Two-Factor Authentication**: Supabase MFA

---

## 🔗 Useful Links

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase JavaScript SDK](https://supabase.com/docs/reference/javascript)
- [OAuth Providers Setup](https://supabase.com/docs/guides/auth/social-login)

---

## 📝 Security Notes

- ✅ Never commit `.env.local` to version control (it's in `.gitignore`)
- ✅ Anon key is safe to expose (it's meant to be public)
- ✅ Keep your Service Role Key secret (don't use in frontend)
- ✅ Row Level Security (RLS) is enabled by default in Supabase

Enjoy building with authentication! 🎉
