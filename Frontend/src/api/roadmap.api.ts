import api from './http';

export type Roadmap = {
  rm_id: number;
  title: string;
  description: string;
  tips: string;
  owner_name: string;
};

export type GetRoadmapsResponse = {
  status: string;
  message: string;
  roadmaps: Roadmap[];
};

// Lấy danh sách các lộ trình học
export const getRoadmapsApi = async (): Promise<GetRoadmapsResponse> => {
  const res = await api.get('/roadmaps');
  return res.data;
};

// Lấy chi tiết một lộ trình học
export const getRoadmapDetailApi = async (roadmapId: number): Promise<Roadmap> => {
  const res = await api.get(`/roadmaps/${roadmapId}`);
  return res.data;
};

// Thêm khóa học vào lộ trình
export const addCourseToRoadmapApi = async (roadmapId: number, courseCode: string, ordinal: number) => {
  const res = await api.post(`/roadmaps/${roadmapId}/courses`, { course_code: courseCode, ordinal });
  return res.data;
};
