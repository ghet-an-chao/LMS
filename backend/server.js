const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const config = require('./config');
const multer = require('multer');

//
const { handleRegister } = require('./src/register');
const { handleLogin } = require('./src/login');
const { handleLogout } = require('./src/logout');
const { handleCreateCourse } = require('./src/createcourse');
const { handleEnrollStudent } = require('./src/enrollment');
const { handleCreateAssignment } = require('./src/createassignment');
const { handleSubmitAssignment } = require('./src/submission');
const { handleIssueCertificate } = require('./src/certificate');
const { handleGetProfile } = require('./src/getprofile');
const { authMiddleware } = require('./src/auth');
const { handleUpdateProfile } = require('./src/updateprofile');
const { handleGetSections } = require('./src/getsection');
const { handleCreateQuiz } = require('./src/createquiz');
const { handleGetQuiz } = require('./src/getquiz');
const { handleGetRoadmap } = require('./src/getroadmap');
const { handleAddCourseToRoadmap } = require('./src/car');
const { handleGetCertificate } = require('./src/getcertificate');
const { handleCreateTransaction } = require('./src/tran');
const { handleUpdateTransaction } = require('./src/updatetran');
const { handleGetMyTransactions } = require('./src/gettran');
const { handleGetCourse } = require('./src/getcourse');
const { handleGetGrades } = require('./src/getgrades'); 
const { handleGetAssignment } = require('./src/getassignment');
const { handleCreateQuestion } = require('./src/createquestion');
const { handleGetQuizQuestions } = require('./src/getquestion');
const { handleStartQuiz } = require('./src/startquiz');
const { handleSubmitQuiz } = require('./src/submitquiz');
const { handleReviewAttempt } = require('./src/review');
const { handleCreateRoadmap } = require('./src/createroadmap');
const { handleCreateLecture } = require('./src/createlecture');
const { handleGetLecture } = require('./src/getlecture');
const { handleGetAllLectures } = require('./src/getalllecture');
const { handleGetAllCourses } = require('./src/getallcourse');
const { handleGetAllRoadmaps } = require('./src/getallroadmap');
const { handleCreateSection } = require('./src/createsection');
const { handleGetAllAssignments } = require('./src/getallassignment');
const { handleGetAllQuizzes } = require('./src/getallquiz');
const { handleDeleteQuestion } = require('./src/deletequestion');
const { handleGetAllEnroll } = require('./src/getallenroll');
const { handleGetBill } = require('./src/getbill');
const { handlePayment } = require('./src/pay');
const { handleGetAllCertificate } = require('./src/getallcertificate');
const { handleViewResults } = require('./src/viewresults');
const { handleGetAverageScore } = require('./src/getaveragescore');

const app = express();
app.use(cors());
app.use(express.json());

sql.connect(config);

// Authentication
app.post('/auth/register', handleRegister); // ok
app.post('/auth/login', handleLogin); // ok
app.post('/auth/logout', handleLogout); //ok

// User / Profile
app.get('/users/me', authMiddleware, handleGetProfile); // ok
app.put('/users/:id', handleUpdateProfile); // ok

// Course Management
app.post('/courses', handleCreateCourse); // ok
app.get('/courses/:id', handleGetCourse); // ok
app.get('/courses', handleGetAllCourses); // ok //
app.get('/courses/:id/sections', handleGetSections); // ok

//section
app.post('/sections', handleCreateSection); // ok
app.get('/sections/:section_id/assignments', handleGetAllAssignments); // ok //
app.get('/sections/:section_id/quizzes', handleGetAllQuizzes); // ok //

// Student
app.get('/enrollments', handleGetAllEnroll); // ok //
app.post('/students/enroll', handleEnrollStudent);
app.get('/students/:id/grades', handleGetGrades);

// Assignment
app.post('/assignments', handleCreateAssignment); // ok
app.get('/assignments/:id', handleGetAssignment);
app.post('/assignments/:id/submit', handleSubmitAssignment); // ok

// Quiz
app.post('/quizzes', handleCreateQuiz);// ok
app.get('/quizzes/:id', handleGetQuiz);
app.post('/quizzes/:id/questions', handleCreateQuestion); // ok
app.get('/quizzes/:id/questions', handleGetQuizQuestions); // ok
app.delete('/quizzes/:quizId/questions/:questionId', handleDeleteQuestion); // ok //
app.post('/quizzes/:id/attempts', handleStartQuiz); // ok
app.patch('/quiz-attempts/:id/submit', handleSubmitQuiz); // ok
app.get('/quiz-attempts/:id', handleReviewAttempt);
app.get('/quizzes/:quizId/results', handleViewResults); // ok //


// Roadmap
app.post('/roadmaps', handleCreateRoadmap); // ok
app.get('/roadmaps/:id', handleGetRoadmap);
app.get('/roadmaps', handleGetAllRoadmaps); //  ok //
app.post('/roadmaps/:id/courses', handleAddCourseToRoadmap); //ok

// Certificate
app.get('/certificates', handleGetAllCertificate);// ok //
app.post('/certificates', handleIssueCertificate);
app.get('/certificates/:id', handleGetCertificate);

// Transaction
app.get('/bill/:courseId/:sectionId', handleGetBill); // ok //
app.post('/pay', handlePayment); // ok //
app.post('/transactions', handleCreateTransaction);
app.patch('/transactions/:id', handleUpdateTransaction);
app.get('/transactions/my', handleGetMyTransactions);

//Lecture
app.post('/lectures', handleCreateLecture); // ok
app.get('/lectures/:lectureId', handleGetLecture);
app.get('/sections/:sectionId/lectures', handleGetAllLectures); // ok

//function
app.get('/students/average-score', handleGetAverageScore);


app.listen(3000, () => console.log(' Server chạy tại http://localhost:3000'));