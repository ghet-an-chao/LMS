import api from './http';

export type Section = {
  section_id: number;
  course_id: number;
  section_code: string;
  semester_no: number;
  created_at: string;
  teacher_name: string;
};

export type GetSectionsResponse = {
  status: string;
  message: string;
  sections: Section[];
};

// Lấy danh sách lớp học phần của khóa học
export const getCourseSectionsApi = async (courseId: number): Promise<GetSectionsResponse> => {
  const res = await api.get(`/courses/${courseId}/sections`);
  return res.data;
};

// Lấy thông tin chi tiết lớp học phần
export const getSectionDetailApi = async (sectionId: number): Promise<Section> => {
  const res = await api.get(`/sections/${sectionId}`);
  return res.data;
};
