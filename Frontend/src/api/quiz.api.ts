import api from './http';

export type Quiz = {
  quiz_id: number;
  section_id: number;
  created_by: number;
  title: string;
  time_limit_min: number;
  attempts_allowed: number | null;
};

export type GetQuizzesResponse = {
  status: string;
  message: string;
  quizzes: Quiz[];
};

export type StartQuizResponse = {
  attempt_id: number;
  quiz_id: number;
  student_id: number;
  attempt_no: number;
  start_at: string;
  time_limit_min: number;
  status: string;
  questions: {
    question_id: number;
    question_type: string;
    title: string;
    options: {
      option_id: number;
      text: string;
    }[];
    point: number;
    position: number;
  }[];
};

// Lấy danh sách quiz trong lớp học phần
export const getSectionQuizzes = async (sectionId: number | string): Promise<GetQuizzesResponse> => {
  const res = await api.get(`/sections/${sectionId}/quizzes`);
  return res.data;
};

// Bắt đầu quiz
export const startQuizApi = async (quizId: number | string): Promise<StartQuizResponse> => {
  const res = await api.post(`/quizzes/${quizId}/attempts`);
  return res.data;
};

// Nộp bài quiz
export const submitQuizApi = async (attemptId: number | string, answers: any) => {
  const res = await api.patch(`/quiz-attempts/${attemptId}/submit`, { answers });
  return res.data;
};

export type QuizResultsResponse = {
  quiz_id: number;
  student_id: number;
  attempts: {
    attempt_id: number;
    quiz_id: number;
    student_id: number;
    attempt_no: number;
    status: string;
    start_at: string;
    end_at: string | null;
    score: number;
    questions: {
      question_id: number;
      title: string;
      question_type: string;
      point: number;
      selected_option_ids: number[];
      answer_text: string | null;
      is_correct: boolean;
      options: {
        option_id: number;
        text: string;
        is_correct: boolean;
      }[];
    }[];
  }[];
};

// Hàm để lấy kết quả quiz
export const getQuizResultsApi = async (
  quizId: number | string
): Promise<QuizResultsResponse> => {
  const res = await api.get(`/quizzes/${quizId}/results`);
  return res.data;
};