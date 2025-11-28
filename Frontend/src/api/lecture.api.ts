import api from './http';

export type Lecture = {
  lecture_id: number;
  title: string;
  position: number | null;
  content_url: string | null;
  reference_links: string | null;
  created_at: string;
  progress?: {
    status: string;
    last_view_at: string | null;
  } | null;
};

export type GetLecturesResponse = {
  section_id: number;
  lectures: Lecture[];
};

// Lấy danh sách bài giảng của lớp học phần
export const getSectionLectures = async (sectionId: number | string): Promise<GetLecturesResponse> => {
  const res = await api.get(`/sections/${sectionId}/lectures`);
  return res.data;
};
