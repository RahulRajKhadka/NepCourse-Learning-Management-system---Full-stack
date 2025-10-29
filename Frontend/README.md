# NepCourses — Frontend

React (Vite) frontend for NepCourses using Redux, Tailwind CSS and Firebase Auth.

## Overview
- React + Vite
- Redux Toolkit for state (user, course, enrollment)
- Tailwind CSS for styling
- Firebase for Google Sign-In
- Integrates with backend for auth, courses and payments

## Prerequisites
- Node.js 16+
- npm
- Backend running (default expected at `http://localhost:8000`)

## Quick start (Windows)
1. Open terminal in frontend folder:
   cd "c:\Users\Rahul Raj Khadka\Desktop\Major projects\NepCourses\Frontend"
2. Install:
   npm install
3. Create `.env` (Vite expects `VITE_` prefix) — see env section
4. Run dev server:
   npm run dev

## Frontend env (`.env`)
Create `.env` in `Frontend` with your Firebase keys:
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

Important: `serverUrl` is exported in `src/App.jsx`:
```js
export const serverUrl = "http://localhost:8000";
```
Ensure this URL matches your backend.

## Key folders & files
- Pages: `src/pages/*` (Home.jsx, SignUp.jsx, Login.jsx, Payment.jsx, Success.jsx, Failure.jsx, ViewCourses.jsx)
- Components: `src/Component/*` (Nav, Card, EnrollmentButton, etc.)
- Redux: `src/redux/*` (userSlice, courseSlice, enrollmentSlice, store.js)
- Hooks: `src/customHooks/*` (useGetCurrentUser, useAllPublishedCourses)
- Utils: `src/utils/firebase.js` (exports auth & provider)
- Assets: `src/assets/*` (images) — ensure folder name `assets` (not `assests`)

## Important flows
### Google Sign-In
- In SignUp/Login, get idToken:
  `const idToken = await user.getIdToken();`
- Send to backend:
  `axios.post(`${serverUrl}/api/auth/googleauth`, { idToken }, { withCredentials: true })`
- Backend must verify via Firebase Admin.

### Payment (eSewa)
- Payment page calls backend to initiate payment.
- Backend returns `paymentUrl` and `paymentData`.
- Frontend creates and submits a POST form to `paymentUrl` with `paymentData`.
- On redirect to `/payment-success`, frontend calls backend to verify transaction.

### Payment (Khalti)
- Use Khalti JS SDK on frontend or backend-initiated redirect.
- Verify `pidx` on backend.

### Free course enrollment
- If course price === 0:
  - Dispatch Redux action to add course to enrolled list.
  - POST to backend to persist enrollment (recommended).
  - Button text switches to "Watch Now" and navigates to course page.

## Common issues & fixes
- Asset import error: verify folder name `assets` and correct relative path
- Axios Network Error / ERR_CONNECTION_REFUSED: ensure backend running and `serverUrl` correct
- CORS: frontend must use `axios` with `{ withCredentials: true }` if backend uses cookies
- Google Sign-In: ensure Firebase config in `.env` and you send idToken to backend

## Routes (frontend)
- `/` — Home
- `/login` — Login
- `/signup` — Signup
- `/profile` — Profile (protected)
- `/payment/:courseId` — Payment page
- `/payment-success` — Payment success (verify)
- `/payment-failure` — Payment failure
- `/course/:courseId` — Course page

## Notes & tips
- Persist enrolled courses on backend for cross-device access
- Add loading states and user-friendly error messages during network calls
- Keep API keys and secrets out of repository; use `.env` and hosting secret managers

## Deploy
- Build for production:
  npm run build
- Host on Vercel/Netlify; set env vars in dashboard
- Update backend `SUCCESS_URL` and `FAILURE_URL` to production frontend URLs and switch payment keys to production
