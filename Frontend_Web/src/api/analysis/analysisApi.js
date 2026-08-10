import api from "@/api/axios";

export const analyzeCandidate = (form, token) =>
  api.post("/api/analysis/candidate", form, { token });
export const analyzeRecruiterBatch = (form, token) =>
  api.post("/recruiter/analyze", form, { token });
export const rankCandidates = (jobId, form, token) =>
  api.post(`/api/rankings/${jobId}`, form, { token });
export const listResults = ({
  token,
  page = 1,
  limit = 12,
  admin = false,
} = {}) =>
  api.get(admin ? "/api/admin/results" : "/api/results", {
    params: { page, limit },
    token,
  });
export const listResultsFrom = (
  endpoint,
  { token, page = 1, limit = 12 } = {},
) => api.get(endpoint, { params: { page, limit }, token });
export const listRecommendations = (resultId, token) =>
  api.get(`/api/recommendations/result/${resultId}`, { token });
