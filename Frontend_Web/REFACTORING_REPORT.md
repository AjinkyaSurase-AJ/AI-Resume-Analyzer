# Architecture Refactoring Report

## Outcome

The original single-file React application was reorganized into role, domain, and infrastructure modules. UI markup, CSS classes, screen behavior, backend paths, payload field names, authentication persistence, and role navigation are preserved.

## Source moves

| Original source | New location(s) |
| --- | --- |
| `src/main.jsx` application bootstrap | `src/main.jsx`, `src/App.jsx` |
| Inline HTTP helper | `src/api/axios.js` |
| Inline authentication API calls | `src/api/auth/authApi.js` |
| Inline analysis, ranking, result, and recommendation calls | `src/api/analysis/analysisApi.js` |
| Inline resume API calls | `src/api/resume/resumeApi.js` |
| Inline job-description API calls | `src/api/recruiter/jobApi.js` |
| Inline admin API calls | `src/api/admin/adminApi.js`, `src/api/admin/skillsApi.js` |
| Inline health call | `src/api/system/systemApi.js` |
| Inline local-storage handling | `src/utils/storage.js`, `src/constants/storage.js` |
| Formatting and collection helpers | `src/utils/formatters.js` |
| SVG icon registry | `src/components/common/Icon.jsx` |
| Reusable UI controls | `src/components/common/index.jsx` |
| Dashboard presentation components | `src/components/dashboard/index.jsx` |
| Analysis detail component | `src/components/data/ResultDetail.jsx` |
| Authentication screen | `src/pages/Auth/AuthPage.jsx` |
| Candidate screens | `src/pages/Candidate/CandidateWorkspace.jsx` |
| Recruiter overview and batch analysis | `src/pages/Recruiter/RecruiterDashboard.jsx` |
| Recruiter/admin job screens | `src/pages/Recruiter/JobsPage.jsx` |
| Recruiter/admin resume screens | `src/pages/Recruiter/ResumesPage.jsx` |
| Recruiter role composition | `src/pages/Recruiter/RecruiterWorkspace.jsx` |
| Admin overview | `src/pages/Admin/AdminOverview.jsx` |
| Admin users, skills, and logs | `src/pages/Admin/UsersPage.jsx`, `src/pages/Admin/SkillsPage.jsx`, `src/pages/Admin/LogsPage.jsx` |
| Admin role composition | `src/pages/Admin/AdminWorkspace.jsx` |
| Shared results and profile screens | `src/pages/shared/ResultsPage.jsx`, `src/pages/shared/ProfilePage.jsx` |
| Application shell and navigation | `src/layouts/AppShell.jsx`, `src/constants/navigation.js` |
| Role selection and protection | `src/routes/AppRoutes.jsx`, `src/routes/ProtectedRoute.jsx`, `src/routes/RoleRoute.jsx` |
| Inline session state | `src/contexts/AuthContext.jsx`, `src/hooks/useAuth.js` |
| Inline toast state | `src/hooks/useToast.js` |
| `src/style.css` | `src/styles/global.css` |

## Import updates

- Vite now maps `@` to `src` in `vite.config.js`.
- Editor resolution uses the matching alias in `jsconfig.json`.
- Screen modules import UI, API, utility, hook, route, and layout dependencies through `@/...` paths and barrel exports.
- `src/api/index.js`, `src/components/index.js`, `src/hooks/index.js`, `src/layouts/index.js`, role page indexes, shared-page index, route index, and utility index provide stable public module boundaries.
- The bootstrap imports `App`, `AuthProvider`, and global styles from their new modules.

## API integration map

| Contract | Domain function |
| --- | --- |
| `POST /api/users/signin` | `signIn` |
| `POST /api/users/signup` | `signUp` |
| `PATCH /api/users/profile` | `updateProfile` |
| `POST /api/analysis/candidate` | `analyzeCandidate` |
| `POST /recruiter/analyze` | `analyzeRecruiterBatch` |
| `POST /api/rankings/:jobId` | `rankCandidates` |
| `GET /api/results`, `GET /api/admin/results` | `listResults`, `listResultsFrom` |
| `GET /api/recommendations/result/:resultId` | `listRecommendations` |
| Resume list/detail/delete endpoints | `listResumes`, `getResume`, `deleteResume` |
| Job list/detail/create/delete endpoints | `listJobs`, `getJob`, `createJob`, `deleteJob` |
| `GET /api/admin/dashboard` | `getAdminDashboard` |
| Admin user list/delete endpoints | `listUsers`, `deleteUser` |
| `GET /api/admin/logs` | `listLogs` |
| Skill list/create endpoints | `listSkills`, `createSkill` |
| `GET /health` | `checkHealth` |

All domain functions reuse `src/api/axios.js`. Its request interceptor supplies the JWT bearer token, its response interceptor preserves the original `payload.data ?? payload` behavior, and it centralizes timeout and backend error normalization. No refresh-token behavior was added because none existed in the uploaded application or its documented backend contract.

## Verification

- `npm install`: passed; zero reported vulnerabilities.
- `npm run build`: passed; 116 modules transformed.
- `npm run dev`: launched successfully.
- Browser smoke test: sign-in view rendered, sign-up mode switched correctly, expected fields were present, and no console warnings or errors were recorded.
- Endpoint inventory: every original backend path is represented by a domain API module.

## Remaining limitation

The uploaded ZIP contains only the frontend. The backend was not available during this refactor, so authenticated request/response flows could not be exercised against a live service. Their paths, methods, tokens, query parameters, multipart field names, JSON payloads, and response shapes were preserved statically.

## Recommendations

1. Add integration tests against a disposable backend database for all three roles.
2. Add component tests for authentication, pagination, deletion confirmation, upload validation, and role workspace selection.
3. Introduce URL-based React Router navigation only as a separately approved behavior change; the existing state-based navigation was deliberately preserved.
