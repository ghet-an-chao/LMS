import api from './http';

// Lấy tất cả khóa học
export const getCoursesApi = async () => {
  const res = await api.get('/courses');
  return res.data;
};

// Lấy chi tiết khóa học
export const getCourseDetailApi = async (courseId: number) => {
  const res = await api.get(`/courses/${courseId}`);
  return res.data;
};

// Lấy danh sách lớp học phần của khóa học
export const getCourseSectionsApi = async (courseId: number) => {
  const res = await api.get(`/courses/${courseId}/sections`);
  return res.data;
};
