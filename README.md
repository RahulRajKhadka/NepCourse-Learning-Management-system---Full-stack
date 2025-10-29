# NepCourses — Learning Management System

Monorepo containing Backend (Node.js + Express + MongoDB) and Frontend (React + Vite + Redux + Tailwind + Firebase).  
This README explains how to set up and run both projects, environment variables, key endpoints, payment flows (eSewa / Khalti), and troubleshooting.

---

## Repository layout
- `NepCourses/Backend` — Express API, MongoDB models, payment controllers, auth, transactions
- `NepCourses/Frontend` — React (Vite) app, Redux slices, Tailwind, Firebase auth

---

## Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB (Atlas or local)
- (Optional) Firebase project for Google Sign-In

---

## Quick start (Windows)

Backend:
```powershell
cd "c:\Users\Rahul Raj Khadka\Desktop\Major projects\NepCourses\Backend"
npm install
npm run dev   # or npm start
```

Frontend:
```powershell
cd "c:\Users\Rahul Raj Khadka\Desktop\Major projects\NepCourses\Frontend"
npm install
npm run dev
```

Make sure backend port and `serverUrl` in frontend match (default backend port 8000).

---

## Backend — Setup & env

Create `Backend/.env` (DO NOT COMMIT secrets). Example keys used in the codebase:

```
PORT=8000
NODE_ENV=development
MONGODB_URL=<your_mongo_connection_string>
JWT_SECRET=<jwt_secret>

# Gmail (for OTP / emails)
GMAIL_USER=<email>
GMAIL_PASS=<app_password>

# Firebase Admin (if used)
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# eSewa (test/prod)
ESEWA_MERCHANT_ID=EPAYTEST
ESEWA_SECRET=<esewa_secret>
ESEWA_PAYMENT_URL=https://rc-epay.esewa.com.np/api/epay/main/v2/form
ESEWA_PAYMENT_STATUS_CHECK_URL=https://rc.esewa.com.np/api/epay/transaction/status/

# Khalti
KHALTI_PUBLIC_KEY=<khalti_public_key>
KHALTI_SECRET_KEY=<khalti_secret_key>
KHALTI_PAYMENT_URL=https://a.khalti.com/api/v2/epayment/initiate/
KHALTI_VERIFICATION_URL=https://a.khalti.com/api/v2/epayment/lookup/

# Frontend callback URLs
SUCCESS_URL=http://localhost:5173/payment-success
FAILURE_URL=http://localhost:5173/payment-failure
```

Important:
- Initialize Firebase Admin in backend if verifying Google idTokens.
- Enable CORS with credentials for frontend origin.

---

## Frontend — Setup & env

Create `Frontend/.env` (Vite env use `VITE_` prefix):

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Also confirm `serverUrl` export in `Frontend/src/App.jsx`:
```js
export const serverUrl = "http://localhost:8000";
```
Import `serverUrl` where API requests are made.

---

## Key backend routes (examples)

Auth
- POST `/api/auth/signup`
- POST `/api/auth/login`
- POST `/api/auth/googleauth` — expects Google idToken from frontend (verify with Firebase Admin)
- GET `/api/auth/logout`

User
- GET `/api/user/getcurrentuser` — returns current user (cookie/session/auth required)

Courses
- GET `/api/courses/published` (or similar)
- GET `/api/courses/:id`

Payments
- POST `/api/payment/initiate-esewa` or `/api/payment/initiate-khalti` (or combined `initiate-payment`)
- POST `/api/payment/payment-status` — verify and update transaction status
- GET `/api/payment/esewa-success` and `/api/payment/esewa-failure` (optional server endpoints)

Transaction model:
- Save transactions with fields: customerDetails, product_id, amount, payment_gateway, status, gateway response, timestamps.

---

## Frontend flows

- Google Sign-In: obtain `idToken` on frontend (Firebase auth) and send to backend:
  ```js
  const idToken = await user.getIdToken();
  axios.post(`${serverUrl}/api/auth/googleauth`, { idToken, name, email }, { withCredentials: true })
  ```
  Backend must verify token using Firebase Admin before creating session/user.

- Free course enrollment:
  - If `course.price === 0`, dispatch Redux action to add course to enrolled list and optionally persist to backend.
  - Change button text to "Watch Now" when enrolled.

- Payment (eSewa):
  - Frontend requests initiation endpoint -> backend returns `paymentUrl` & `paymentData`.
  - Frontend programmatically creates a POST form and submits to eSewa.
  - eSewa redirects to `SUCCESS_URL` or `FAILURE_URL`. Frontend then calls backend to verify and finalize transaction.

- Payment (Khalti):
  - Recommended: use Khalti JS SDK on frontend for checkout; verify `pidx` on backend.

---

## Success & Failure pages
- Add routes `/payment-success` and `/payment-failure` in Frontend.
- On success page, verify payment with backend (`/api/payment/payment-status`) using `product_id` or `pidx`. Update transaction and enroll user.

---

## Troubleshooting

1. Axios Network Error / ERR_CONNECTION_REFUSED
   - Ensure backend running and port matches `serverUrl`.
   - Test `http://localhost:8000/` or the API route in browser/Postman.

2. CORS
   - Enable `cors({ origin: "<frontend-url>", credentials: true })` on backend.
   - Use `axios` with `{ withCredentials: true }` if using cookies.

3. Firebase Google Sign-In
   - Frontend: send `idToken` not only email/name.
   - Backend: verify idToken using Firebase Admin SDK.

4. Asset import errors
   - Verify folder names (`assets` not `assests`) and relative import path.

5. Payment issues
   - Check gateway test endpoints, keys in `.env`, and backend logs.
   - Ensure success/failure URLs match gateway configuration.

---

## Developer tips

- Keep secrets out of git; use `.env` and `.gitignore`.
- Use Postman to debug endpoints.
- Add server-side request validation (express-validator / Joi).
- Persist free enrollments to backend to maintain state across devices.
- Add robust logging around payment initiation & verification.

---

## What I validated
- Backend routes exist for auth, payments and transactions.
- Frontend has hooks for current user, published courses, and payment page.
- Payment flow architecture (initiate -> gateway -> verify) implemented for eSewa and Khalti.
- Redux slices exist for user, course, and enrollment; ensure enrollment persistence on free enrollment.

---

## Next steps you can request
- Generate `Backend/.env.example` and `Frontend/.env.example`.
- Add sample Firebase Admin init code for backend.
- Add endpoint to persist free enrollments and update enrolledStudents in Course model.
- Add unit tests for payment controller and transaction flow.

---

If you want, I will create `Backend/README.md` and `Frontend/README.md` files separately and add `.env.example` files for both folders.