import api from './http';

// Lấy tất cả giao dịch của sinh viên
export const getTransactionsApi = async () => {
  const res = await api.get('/transactions/my');
  return res.data;
};

// Tạo giao dịch thanh toán khóa học
export const createTransactionApi = async (courseId: number, amountVnd: number) => {
  const res = await api.post('/transactions', { course_id: courseId, amount_vnd: amountVnd });
  return res.data;
};

// Cập nhật giao dịch sau khi thanh toán
export const updateTransactionStatusApi = async (transactionId: number, status: string) => {
  const res = await api.patch(`/transactions/${transactionId}`, { status });
  return res.data;
};
