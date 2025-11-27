// src/api/assignment.api.ts
import api from "./http";

export type Assignment = {
  assignment_id: number;
  section_id: number;
  created_by: number;
  title: string;
  weight_pct: number;
  due_at: string | null;
  max_score: number;
};

export type GetAssignmentsResponse = {
  status: string;
  message: string;
  assignments: Assignment[];
};

// GET /sections/:sectionId/assignments
export const getSectionAssignments = async (
  sectionId: number | string
): Promise<GetAssignmentsResponse> => {
  const res = await api.get(`/sections/${sectionId}/assignments`);
  return res.data;
};

// POST /assignments/:id/submit
export const submitAssignmentApi = async (params: {
  assignmentId: number | string;
  content_url: string;
}) => {
  const res = await api.post(`/assignments/${params.assignmentId}/submit`, {
    content_url: params.content_url,
  });
  return res.data;
};
