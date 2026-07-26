import api from "./api";

export const startInterview = (domain) => {
  return api.post("/interviews/start", { domain });
};

export const getCurrentQuestion = (interviewId) => {
  return api.get(`/interviews/${interviewId}/current-question`);
};

export const submitAnswer = (interviewId, questionId, answerText) => {
  return api.post(`/interviews/${interviewId}/answer`, {
    questionId,
    answerText,
  });
};

export const getSummary = (interviewId) => {
  return api.get(`/interviews/${interviewId}/summary`);
};

export const getHistoryList = (domain) => {
  const params = domain ? { domain } : {};
  return api.get("/interviews", { params });
};

export const getDashboardSummary = () => {
  return api.get("/dashboard/summary");
};