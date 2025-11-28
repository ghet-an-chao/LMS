import api from './http';

export type Certificate = {
  certificate_id: number;
  course_id: number;
  section_id: number | null;
  issued_on: string;
  expires_on: string | null;
  verify_code: string;
  status: string;
};

export type GetCertificatesResponse = {
  status: string;
  message: string;
  certificates: Certificate[];
};

// Lấy tất cả chứng chỉ của sinh viên
export const getCertificatesApi = async (): Promise<GetCertificatesResponse> => {
  const res = await api.get('/certificates/my');
  return res.data;
};

// Lấy chi tiết chứng chỉ của sinh viên
export const getCertificateDetailApi = async (certificateId: number): Promise<Certificate> => {
  const res = await api.get(`/certificates/${certificateId}`);
  return res.data;
};

// Cấp chứng chỉ cho sinh viên (Giả sử đây là hành động tự động khi sinh viên hoàn thành khóa học)
export const issueCertificateApi = async (studentId: number, courseId: number, sectionId: number, issuedOn: string, expiresOn: string | null, verifyCode: string) => {
  const res = await api.post('/certificates', {
    student_id: studentId,
    course_id: courseId,
    section_id: sectionId,
    issued_on: issuedOn,
    expires_on: expiresOn,
    verify_code: verifyCode,
    status: 'issued',
  });
  return res.data;
};
