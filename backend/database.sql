CREATE DATABASE LMS;
GO
USE LMS;
GO
-- ========================
-- 1. USER TABLE
-- ========================
CREATE TABLE [User] (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    status VARCHAR(10) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'locked')),
    created_at DATE DEFAULT GETDATE()
);
GO

INSERT INTO [User] (username, password_hash, first_name, last_name, email, status)
VALUES 
('huy123', 'password1', 'Huy', 'Nguyen', 'huy123@gmail.com', 'active'),
('linhtran', 'password2', 'Linh', 'Tran', 'linhtran@gmail.com', 'active'),
('minhvo', 'password3', 'Minh', 'Vo', 'minhvo@gmail.com', 'inactive'),
('thanhle', 'password4', 'Thanh', 'Le', 'thanhle@gmail.com', 'active'),
('quangpham', 'password5', 'Quang', 'Pham', 'quangpham@gmail.com', 'locked'),
('anhdao', 'password6', 'Anh', 'Dao', 'anhdao@gmail.com', 'active'),
('hoangmai', 'password7', 'Hoang', 'Mai', 'hoangmai@gmail.com', 'active'),
('trungkien', 'password8', 'Trung', 'Kien', 'trungkien@gmail.com', 'inactive'),
('phuongnguyen', 'password9', 'Phuong', 'Nguyen', 'phuongnguyen@egmail.com', 'active'),
('tuananh', 'password10', 'Tuan', 'Anh', 'tuananh@gmail.com', 'active');
GO

-- ========================
-- 2. STUDENT TABLE
-- ========================
CREATE TABLE Student (
    student_id INT PRIMARY KEY,
    enrolled_since DATE DEFAULT GETDATE(),
    CONSTRAINT FK_Student_User FOREIGN KEY (student_id) REFERENCES [User](user_id)
);
GO

INSERT INTO Student (student_id)
VALUES 
(1), (2), (3), (4), (5);  
GO

-- ========================
-- 3. TEACHER TABLE
-- ========================
CREATE TABLE Teacher (
    teacher_id INT PRIMARY KEY,
    CONSTRAINT FK_Teacher_User FOREIGN KEY (teacher_id) REFERENCES [User](user_id)
);
GO

INSERT INTO Teacher (teacher_id)
VALUES 
(6), (7), (8), (9), (10);
GO

-- ========================
-- 4. TEACHER_DEGREE TABLE
-- ========================
CREATE TABLE Teacher_Degree (
    degree_id INT IDENTITY(1,1) PRIMARY KEY,
    teacher_id INT NOT NULL,
    degree_name VARCHAR(100) NOT NULL,
    institution VARCHAR(100),
    year_awarded INT CHECK (year_awarded BETWEEN 1950 AND YEAR(GETDATE())),
    CONSTRAINT FK_TeacherDegree_Teacher FOREIGN KEY (teacher_id) REFERENCES Teacher(teacher_id)
);
GO

INSERT INTO Teacher_Degree (teacher_id, degree_name, institution, year_awarded)
VALUES
(6, 'Master of Computer Science', 'HCMUT', 2015),
(7, 'PhD in Mathematics', 'VNU-HCM', 2012),
(8, 'Master of Education', 'UEH', 2018),
(9, 'Bachelor of Physics', 'HUS', 2010);
GO


-- ========================
-- 5. COURSE TABLE
-- ========================
CREATE TABLE Course (
    course_id INT IDENTITY(1,1) PRIMARY KEY,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(80),
    credits INT CHECK (credits >= 0),
    language VARCHAR(10),
    description NVARCHAR(MAX) NOT NULL,
    pass_threshold_pct DECIMAL(5,2) NOT NULL CHECK (pass_threshold_pct BETWEEN 0 AND 100),
    created_at DATE DEFAULT GETDATE(),
    price_vnd INT CHECK (price_vnd >= 0)
);
GO

INSERT INTO Course (course_code, title, credits, language, description, pass_threshold_pct, price_vnd)
VALUES
('CS101', 'Introduction to Programming', 3, 'EN', N'Learn basic programming concepts.', 60.00, 1500000),
('MATH201', 'Advanced Calculus', 4, 'VI', N'In-depth study of calculus.', 65.00, 1800000),
('EDU301', 'Teaching Methodologies', 2, 'EN', N'Explore modern teaching techniques.', 70.00, 1200000),
('PHY101', 'Fundamentals of Physics', 3, 'VI', N'Basic principles of physics.', 55.00, 1400000),
('CS201', 'Data Structures and Algorithms', 4, 'EN', N'Learn about arrays, linked lists, trees, and algorithms.', 65.00, 2000000),
('HIS101', 'World History Overview', 3, 'VI', N'Explore major events in world history.', 60.00, 1300000),
('ENG301', 'Academic Writing Skills', 2, 'EN', N'Develop skills for writing essays and reports.', 70.00, 1100000),
('BIO101', 'Introduction to Biology', 3, 'VI', N'Basic concepts of cell biology and genetics.', 55.00, 1450000),
('IT401', 'Database Management Systems', 4, 'EN', N'Learn relational databases, SQL, and normalization.', 68.00, 1900000);
GO

-- ========================
-- 6. TAG TABLE (weak entity of COURSE)
-- ========================
CREATE TABLE Tag (
    course_id INT NOT NULL,
    tag_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (course_id, tag_name),
    CONSTRAINT FK_Tag_Course FOREIGN KEY (course_id) REFERENCES Course(course_id)
);
GO

INSERT INTO Tag (course_id, tag_name)
VALUES
(1, 'programming'), (2, 'calculus'), (3, 'pedagogy'), (4, 'physics');
GO

-- ========================
-- 7. SECTION TABLE
-- ========================
CREATE TABLE Section (
    section_id INT IDENTITY(1,1) PRIMARY KEY,
    course_id INT NOT NULL,
    created_by INT NOT NULL,
    section_code VARCHAR(20) NOT NULL,
    semester_no INT NOT NULL,
    created_at DATE DEFAULT GETDATE(),
    CONSTRAINT UQ_Section UNIQUE (course_id, section_code, semester_no),
    CONSTRAINT FK_Section_Course FOREIGN KEY (course_id) REFERENCES Course(course_id),
    CONSTRAINT FK_Section_Teacher FOREIGN KEY (created_by) REFERENCES Teacher(teacher_id)
);
GO

INSERT INTO Section (course_id, created_by, section_code, semester_no)
VALUES
(1, 6, 'CS101-A', 1), (2, 7, 'MATH201-B', 1), (3, 8, 'EDU301-C', 2), (4, 9, 'PHY101-D', 2), (5, 6, 'CS201-E', 1), 
(6, 7, 'HIS101-F', 2), (7, 9, 'ENG301-G', 1), (8, 9, 'BIO101-H', 2), (9, 9, 'IT401-I', 3);
GO

-- ========================
-- 8. MODULE TABLE
-- ========================
CREATE TABLE Module (
    module_id INT IDENTITY(1,1) PRIMARY KEY,
    section_id INT NOT NULL,
    title VARCHAR(80) NOT NULL,
    position INT CHECK (position >= 1)
    CONSTRAINT FK_Module_Section FOREIGN KEY (section_id) REFERENCES Section(section_id)
);
GO

INSERT INTO Module (section_id, title, position)
VALUES
(1, 'Variables and Data Types', 1), (2, 'Limits and Continuity', 1), (3, 'Student Engagement', 1), (4, 'Newton’s Laws', 1),
(1, 'Control Structures', 2), (2, 'Differentiation Techniques', 2), (3, 'Classroom Management Strategies', 2),
(4, 'Work and Energy', 2), (1, 'Functions and Scope', 3);
GO

-- ========================
-- 9. ASSIGNMENT TABLE
-- ========================
CREATE TABLE Assignment (
    assignment_id INT IDENTITY(1,1) PRIMARY KEY,
    section_id INT NOT NULL,                       
    created_by INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    weight_pct DECIMAL(5,2) CHECK (weight_pct BETWEEN 0 AND 100),
    due_at DATETIME,
    max_score DECIMAL(4,2) DEFAULT 10 CHECK (max_score > 0),
    CONSTRAINT FK_Assignment_Section FOREIGN KEY (section_id) REFERENCES Section(section_id),
    CONSTRAINT FK_Assignment_Teacher FOREIGN KEY (created_by) REFERENCES Teacher(teacher_id)

);
GO

INSERT INTO Assignment (section_id, created_by, title, weight_pct, due_at)
VALUES
(1, 9, 'Assignment 1: Hello World', 20.00, '2025-12-23'),
(2, 6, 'Assignment 1: Derivatives', 25.00, '2025-12-22'),
(3, 7, 'Assignment 1: Lesson Planning', 15.00, '2025-12-25'),
(4, 8, 'Assignment 1: Motion Analysis', 30.00, '2025-12-28');
GO

-- ========================
-- 10. QUIZ TABLE
-- ========================
CREATE TABLE Quiz (
    quiz_id INT IDENTITY(1,1) PRIMARY KEY,
    section_id INT NOT NULL,
    created_by INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    time_limit_min INT CHECK (time_limit_min >= 0),
    attempts_allowed INT NULL,
    CONSTRAINT FK_Quiz_Section FOREIGN KEY (section_id) REFERENCES Section(section_id),
    CONSTRAINT FK_Quiz_Teacher FOREIGN KEY (created_by) REFERENCES Teacher(teacher_id)
);
GO

INSERT INTO Quiz (section_id, created_by, title, time_limit_min, attempts_allowed)
VALUES
(1, 10, 'Quiz 1: Basics of Programming', 30, 3),
(2, 6, 'Quiz 1: Calculus Concepts', 45, 2),
(3, 7, 'Quiz 1: Teaching Strategies', 25, 1),
(4, 8, 'Quiz 1: Physics Fundamentals', 40, 2);
GO

-- ========================
-- 11. ENROLLMENT TABLE (N-N: STUDENT <-> SECTION)
-- ========================
CREATE TABLE Enrollment (
    student_id INT NOT NULL,
    section_id INT NOT NULL,
    enrolled_at DATETIME DEFAULT GETDATE(),
    status VARCHAR(10) NOT NULL CHECK (status IN ('active', 'dropped', 'completed')),
    origin VARCHAR(10) NOT NULL CHECK (origin IN ('sync', 'manual')),
    PRIMARY KEY (student_id, section_id),
    CONSTRAINT FK_Enroll_Student FOREIGN KEY (student_id) REFERENCES Student(student_id),
    CONSTRAINT FK_Enroll_Section FOREIGN KEY (section_id) REFERENCES Section(section_id)
);
GO

INSERT INTO Enrollment (student_id, section_id, status, origin)
VALUES
(1, 1, 'active', 'manual'),
(2, 2, 'active', 'sync'),
(3, 3, 'completed', 'manual'),
(4, 4, 'dropped', 'sync');
GO

-- ========================
-- 12. SUBMISSION TABLE
-- ========================
CREATE TABLE Submission (
    submission_id INT IDENTITY(1,1) PRIMARY KEY,
    assignment_id INT NOT NULL,
    student_id INT NOT NULL,
    submitted_at DATETIME DEFAULT GETDATE(),
    status VARCHAR(10) NOT NULL CHECK (status IN ('on_time', 'late', 'missing')),
    CONSTRAINT FK_Sub_Assignment FOREIGN KEY (assignment_id) REFERENCES Assignment(assignment_id),
    CONSTRAINT FK_Sub_Student FOREIGN KEY (student_id) REFERENCES Student(student_id)
);
GO

INSERT INTO Submission (assignment_id, student_id, status)
VALUES
(1, 1, 'on_time'),
(2, 2, 'late'),
(3, 3, 'missing'),
(4, 4, 'on_time');
GO

-- ========================
-- 13. QUIZ_ATTEMPT TABLE
-- ========================
CREATE TABLE Quiz_Attempt (
    attempt_id INT IDENTITY(1,1) PRIMARY KEY,
    quiz_id INT NOT NULL,
    student_id INT NOT NULL,
    start_at DATETIME DEFAULT GETDATE(),
    end_at DATETIME,
    score DECIMAL(4,2) CHECK (score BETWEEN 0 AND 10),
    attempt_no INT CHECK (attempt_no >=1),
    status VARCHAR(15) NOT NULL CHECK (status IN ('in_progress', 'submitted', 'timed_out', 'graded' )),
    CONSTRAINT CHK_Quiz_Time CHECK (end_at IS NULL OR end_at > start_at),
    CONSTRAINT FK_Attempt_Quiz FOREIGN KEY (quiz_id) REFERENCES Quiz(quiz_id),
    CONSTRAINT FK_Attempt_Student FOREIGN KEY (student_id) REFERENCES Student(student_id)
);
GO

INSERT INTO Quiz_Attempt (quiz_id, student_id, start_at, end_at, score, attempt_no, status)
VALUES
(1, 1, '2025-11-20 09:00', '2025-11-20 10:30', 8.5, 1, 'submitted'),
(2, 2, '2025-11-22 10:00', '2025-11-22 11:00', 7.0, 1, 'submitted'),
(3, 3, '2025-11-22 10:00', '2025-11-22 11:00', 9, 1, 'submitted'),
(4, 4, '2025-11-28 08:30', '2025-11-28 09:45', 9.0, 2, 'submitted');
GO


-- ========================
-- 14. SUBMISSION_VERSION TABLE
-- ========================
CREATE TABLE Submission_Version (
    submission_id INT NOT NULL,                  
    version_id INT NOT NULL,                    
    version_no INT NOT NULL CHECK (version_no >= 1), 
    content_url NVARCHAR(500) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_Submission_Version PRIMARY KEY (submission_id, version_id),
    CONSTRAINT FK_Sub_Ver_Sub FOREIGN KEY (submission_id) REFERENCES Submission(submission_id),
);
GO

INSERT INTO Submission_Version (submission_id, version_id, version_no, content_url)
VALUES
(1, 1, 1, N'https://example.com/submissions/1/v1'),
(2, 1, 1, N'https://example.com/submissions/2/v1'),
(4, 1, 1, N'https://example.com/submissions/4/v1'),
(4, 2, 2, N'https://example.com/submissions/4/v2');
GO

-- ========================
-- 15. RUBRIC TABLE
-- ========================
CREATE TABLE Rubric (
    rubric_id INT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(200),
    assignment_id INT NOT NULL,
    CONSTRAINT FK_Rubric_Assignment FOREIGN KEY (assignment_id) REFERENCES Assignment(assignment_id)
);
GO

INSERT INTO Rubric (title, assignment_id)
VALUES
(N'Programming Rubric', 1),
(N'Math Rubric', 2),
(N'Education Rubric', 3),
(N'Physics Rubric', 4);
GO

-- ========================
-- 16. RUBRIC_CRITERION TABLE
-- ========================
CREATE TABLE Rubric_Criterion (
    criterion_id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(200) NOT NULL,
    max_score DECIMAL(4,2) NOT NULL CHECK (max_score >= 0), 
    rubric_id INT NOT NULL,
    CONSTRAINT FK_Rubric_Criterion_Rubric FOREIGN KEY (rubric_id) REFERENCES Rubric(rubric_id)
);
GO

INSERT INTO Rubric_Criterion (name, max_score, rubric_id)
VALUES
(N'Code Quality', 5.00, 1),
(N'Accuracy', 5.00, 2),
(N'Clarity', 5.00, 3),
(N'Application', 5.00, 4);
GO

-- ========================
-- 17. RUBRIC_SCORE TABLE
-- ========================
CREATE TABLE Rubric_Score (
    rubric_score_id INT IDENTITY(1,1) PRIMARY KEY,
    submission_id INT NOT NULL,
    criterion_id INT NOT NULL,
    scorer_id INT NOT NULL,
    score DECIMAL(4,2) NOT NULL CHECK (score >= 0),
    commented_at DATETIME NULL,
    CONSTRAINT FK_Rubric_Score_Sub FOREIGN KEY (submission_id) REFERENCES Submission(submission_id),
    CONSTRAINT FK_Rubric_Score_Criterion FOREIGN KEY (criterion_id) REFERENCES Rubric_Criterion(criterion_id),
    CONSTRAINT FK_Rubric_Score_User FOREIGN KEY (scorer_id) REFERENCES [User](user_id),
    
    CONSTRAINT UQ_Rubric_Score UNIQUE (submission_id, criterion_id)
);
GO

INSERT INTO Rubric_Score (submission_id, criterion_id, scorer_id, score, commented_at)
VALUES
(1, 1, 5, 4.5, '2025-11-20 11:00'),
(2, 2, 6, 4.0, '2025-11-22 12:00'),
(3, 3, 7, 0.0, '2025-11-20 12:00'),
(4, 4, 8, 4.8, '2025-11-28 10:00');
GO

-- ========================
-- 18. MODULE_ITEM TABLE
-- ========================
CREATE TABLE Module_Item (
    item_id INT IDENTITY(1,1) PRIMARY KEY,
    module_id INT NOT NULL,
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('page', 'file', 'lecture', 'assignment', 'quiz', 'discussion')),
    ref_id BIGINT NOT NULL,
    position INT NOT NULL CHECK (position >= 1),
    CONSTRAINT FK_ModuleItem_Module FOREIGN KEY (module_id) REFERENCES Module(module_id)
);
GO

INSERT INTO Module_Item (module_id, item_type, ref_id, position)
VALUES
(1, 'assignment', 1, 1),
(2, 'quiz', 2, 1),
(3, 'lecture', 1, 1),
(4, 'discussion', 101, 1);
GO

-- ========================
-- 19. LECTURE TABLE
-- ========================
CREATE TABLE Lecture (
    lecture_id INT IDENTITY(1,1) PRIMARY KEY,
    section_id INT NOT NULL,
    created_by INT NOT NULL,
    title NVARCHAR(200) NOT NULL,
    content_url NVARCHAR(200),
    reference_links NVARCHAR(MAX),
    position INT,
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Lecture_Section FOREIGN KEY (section_id) REFERENCES Section(section_id),
    CONSTRAINT FK_Lecture_Teacher FOREIGN KEY (created_by) REFERENCES Teacher(teacher_id)
);
GO

INSERT INTO Lecture (section_id, created_by, title, content_url, reference_links, position)
VALUES
(1, 10, N'Intro to Programming', N'https://example.com/lectures/1', N'https://docs.example.com', 1),
(2, 6, N'Calculus Deep Dive', N'https://example.com/lectures/2', N'https://math.example.com', 1),
(3, 7, N'Teaching Models', N'https://example.com/lectures/3', N'https://edu.example.com', 1),
(4, 8, N'Physics Basics', N'https://example.com/lectures/4', N'https://phys.example.com', 1);
GO

-- ========================
-- 20. QUESTION_BANK TABLE
-- ========================
CREATE TABLE Question_Bank (
    bank_id INT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(200) NOT NULL
);
GO

INSERT INTO Question_Bank (title)
VALUES
(N'Programming Basics'),
(N'Advanced Calculus'),
(N'Teaching Strategies'),
(N'Physics Principles');
GO

-- ========================
-- 21. QUESTION TABLE
-- ========================
CREATE TABLE Question (
    question_id INT IDENTITY(1,1) PRIMARY KEY,
    bank_id INT NULL, 
    question_type VARCHAR(20) NOT NULL DEFAULT 'mcq',
    title VARCHAR(500) NOT NULL,
    CONSTRAINT FK_Question_Bank FOREIGN KEY (bank_id) REFERENCES Question_Bank(bank_id)
);
GO

INSERT INTO Question (bank_id, title)
VALUES
(1, 'What is a variable in programming?'),
(2, 'What is the derivative of x^2?'),
(3, 'What is student-centered learning?'),
(4, 'What is Newton’s first law?');
GO

-- ========================
-- 22. QUESTION_OPTION TABLE
-- ========================
CREATE TABLE Question_Option (
    option_id INT IDENTITY(1,1) PRIMARY KEY,
    question_id INT NOT NULL,
    text NVARCHAR(500) NOT NULL,
    is_correct BIT NOT NULL,
    CONSTRAINT FK_QuestionOption_Question FOREIGN KEY (question_id) REFERENCES Question(question_id)
);
GO

INSERT INTO Question_Option (question_id, text, is_correct)
VALUES
(1, N'A named storage for data', 1),
(1, N'A type of loop', 0),
(2, N'2x', 1),
(2, N'x^2', 0),
(3, N'Focuses on student needs and participation', 1),
(3, N'Teacher lectures only', 0),
(4, N'An object remains at rest or in motion unless acted upon', 1),
(4, N'Force equals mass times acceleration', 0);
GO

-- ========================
-- 23. CERTIFICATE TABLE
-- ========================
CREATE TABLE Certificate (
    certificate_id INT IDENTITY(1,1) PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    section_id INT NULL, 
    issued_on DATE NOT NULL,
    expires_on DATE NULL,
    verify_code VARCHAR(50) NOT NULL UNIQUE,
    status VARCHAR(10) NOT NULL CHECK (status IN ('issued','revoked')),
    CONSTRAINT FK_Certificate_Student FOREIGN KEY (student_id) REFERENCES Student(student_id),
    CONSTRAINT FK_Certificate_Course FOREIGN KEY (course_id) REFERENCES Course(course_id),
    CONSTRAINT FK_Certificate_Section FOREIGN KEY (section_id) REFERENCES Section(section_id)
);
GO

INSERT INTO Certificate (student_id, course_id, section_id, issued_on, expires_on, verify_code, status)
VALUES
(1, 1, 1, '2025-11-30', '2026-11-30', 'CERT001', 'issued'),
(2, 2, 2, '2025-11-30', NULL, 'CERT002', 'issued'),
(3, 3, 3, '2025-11-30', '2026-11-30', 'CERT003', 'revoked'),
(4, 4, 4, '2025-11-30', NULL, 'CERT004', 'issued');
GO

-- ========================
-- 24. ROADMAP TABLE
-- ========================
CREATE TABLE Roadmap (
    rm_id INT IDENTITY(1,1) PRIMARY KEY,
    owner_id INT NOT NULL,
    title NVARCHAR(50) NOT NULL,
    description NVARCHAR(500),
    tips NVARCHAR(1000),
    CONSTRAINT FK_Roadmap_Teacher FOREIGN KEY (owner_id) REFERENCES Teacher(teacher_id)
);
GO

INSERT INTO Roadmap (owner_id, title, description, tips)
VALUES
(10, N'Programming Roadmap', N'Learn programming from basics to advanced.', N'Start with variables and loops.'),
(6, N'Calculus Roadmap', N'Master calculus step by step.', N'Focus on limits and derivatives.'),
(7, N'Teaching Roadmap', N'Effective teaching strategies.', N'Engage students actively.'),
(8, N'Physics Roadmap', N'Understand physical laws.', N'Use real-world examples.');
GO

-- ========================
-- 25. RCERTIFICATE TABLE
-- ========================
CREATE TABLE RCertificate (
    rcertificate_id INT IDENTITY(1,1) PRIMARY KEY,
    student_id INT NOT NULL,
    rm_id INT NOT NULL,
    issued_on DATE NOT NULL,
    expires_on DATE NULL,
    verify_code VARCHAR(50) NOT NULL UNIQUE,
    status VARCHAR(10) NOT NULL CHECK (status IN ('issued','revoked')),
    CONSTRAINT FK_RCertificate_Student FOREIGN KEY (student_id) REFERENCES Student(student_id),
    CONSTRAINT FK_RCertificate_Roadmap FOREIGN KEY (rm_id) REFERENCES Roadmap(rm_id)
);
GO

INSERT INTO RCertificate (student_id, rm_id, issued_on, expires_on, verify_code, status)
VALUES
(1, 1, '2025-12-01', '2026-12-01', 'RCERT001', 'issued'),
(2, 2, '2025-12-01', NULL, 'RCERT002', 'issued'),
(3, 3, '2025-12-01', '2026-12-01', 'RCERT003', 'revoked'),
(4, 4, '2025-12-01', NULL, 'RCERT004', 'issued');
GO

-- ========================
-- 26. ACTIVITY_LOG TABLE
-- ========================
CREATE TABLE Activity_Log (
    log_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    entity_type NVARCHAR(50) NOT NULL,
    entity_id BIGINT NOT NULL,
    action NVARCHAR(50) NOT NULL,
    at DATETIME DEFAULT GETDATE(),
    ip VARCHAR(45),
    CONSTRAINT FK_ActivityLog_User FOREIGN KEY (user_id) REFERENCES [User](user_id)
);
GO

INSERT INTO Activity_Log (user_id, entity_type, entity_id, action, ip)
VALUES
(1, N'Assignment', 1, N'Submitted', '192.168.1.1'),
(2, N'Quiz', 2, N'Attempted', '192.168.1.2'),
(5, N'Lecture', 1, N'Created', '192.168.1.5'),
(6, N'Course', 2, N'Updated', '192.168.1.6');
GO

-- ========================
-- 27. TRANSACTION TABLE
-- ========================
CREATE TABLE [Transaction] (
    txn_id INT IDENTITY(1,1) PRIMARY KEY,
    course_id INT NOT NULL,
    student_id INT,
    amount_vnd INT NOT NULL CHECK (amount_vnd >= 0),
    status VARCHAR(10) NOT NULL CHECK (status IN ('pending','paid','failed','refunded')),
    gateway_ref VARCHAR(100),
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Transaction_Course FOREIGN KEY (course_id) REFERENCES Course(course_id),
    CONSTRAINT FK_Transaction_Student FOREIGN KEY (student_id)REFERENCES Student(student_id)
);
GO

INSERT INTO [Transaction] (course_id, student_id, amount_vnd, status, gateway_ref)
VALUES
(1, 2, 1500000, 'paid', 'TXN001'),
(2, 3, 1800000, 'pending', 'TXN002');
GO

-- ========================
-- 28. OWN TABLE (User owns Question_Bank)
-- ========================
CREATE TABLE Own (
    user_id INT NOT NULL,
    bank_id INT NOT NULL,
    PRIMARY KEY (user_id, bank_id),
    CONSTRAINT FK_Own_User FOREIGN KEY (user_id) REFERENCES [User](user_id),
    CONSTRAINT FK_Own_QuestionBank FOREIGN KEY (bank_id) REFERENCES Question_Bank(bank_id)
);
GO

INSERT INTO Own (user_id, bank_id)
VALUES
(10, 1),
(6, 2),
(7, 3),
(8, 4);
GO

-- ========================
-- 29. LECTURE_PROGRESS TABLE
-- ========================
CREATE TABLE Lecture_Progress (
    lecture_id INT NOT NULL,
    student_id INT NOT NULL,
    PRIMARY KEY (lecture_id, student_id),
    status VARCHAR(20) NOT NULL CHECK (status IN ('not_started','in_progress','completed')),
    last_view_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Lecture_Pr_Lecture FOREIGN KEY (lecture_id) REFERENCES Lecture(lecture_id),
    CONSTRAINT FK_Lecture_Pr_Student FOREIGN KEY (student_id) REFERENCES Student(student_id)
);
GO

INSERT INTO Lecture_Progress (lecture_id, student_id, status)
VALUES
(1, 1, 'completed'),
(2, 2, 'in_progress'),
(3, 3, 'not_started'),
(4, 4, 'completed');
GO

-- ========================
-- 30. SECTION_MEMBERSHIP TABLE
-- ========================
CREATE TABLE Section_Membership (
    user_id INT NOT NULL,
    section_id INT NOT NULL,
    PRIMARY KEY (user_id, section_id),
    status VARCHAR(20) NOT NULL CHECK (status IN ('instructor','ta','student')),
    join_at DATE DEFAULT GETDATE(),
    CONSTRAINT FK_Section_M_User FOREIGN KEY (user_id) REFERENCES [User](user_id),
    CONSTRAINT FK_Section_M_Section FOREIGN KEY (section_id) REFERENCES Section(section_id)
);
GO

INSERT INTO Section_Membership (user_id, section_id, status)
VALUES
(1, 1, 'student'),
(2, 2, 'student'),
(5, 1, 'instructor'),
(6, 2, 'instructor');
GO

-- ========================
-- 31. ROADMAP_COURSE TABLE
-- ========================
CREATE TABLE Roadmap_Course (
    mp_id INT NOT NULL,
    course_id INT NOT NULL,
    PRIMARY KEY (mp_id, course_id),
    ordinal INT CHECK (ordinal >=1)
    CONSTRAINT FK_Roadmap_C_Roadmap FOREIGN KEY (mp_id) REFERENCES Roadmap(rm_id),
    CONSTRAINT FK_Roadmap_C_Course FOREIGN KEY (course_id) REFERENCES Course(course_id)
);
GO

INSERT INTO Roadmap_Course (mp_id, course_id, ordinal)
VALUES
(1, 1, 1),  -- Programming Roadmap -> CS101
(2, 2, 1),  -- Calculus Roadmap -> MATH201
(3, 3, 1),  -- Teaching Roadmap -> EDU301
(4, 4, 1);  -- Physics Roadmap -> PHY101
GO

-- ========================
-- 32. PRE_REQUIST TABLE
-- ========================
CREATE TABLE Pre_Requist (
    course_id INT NOT NULL,
    pre_requist_id INT NOT NULL,
    PRIMARY KEY (course_id, pre_requist_id),
    CONSTRAINT FK_Pre_Requist_Course FOREIGN KEY (course_id) REFERENCES Course(course_id),
    CONSTRAINT FK_Pre_Requist_PreCourse FOREIGN KEY (pre_requist_id) REFERENCES Course(course_id)
);
GO

INSERT INTO Pre_Requist (course_id, pre_requist_id)
VALUES
(2, 1),  -- MATH201 yêu cầu CS101
(3, 1),  -- EDU301 yêu cầu CS101
(4, 2),  -- PHY101 yêu cầu MATH201
(4, 1);  -- PHY101 cũng yêu cầu CS101
GO

-- ========================
-- 33.ATTEMPT_ANSWER TABLE
-- ========================
CREATE TABLE Attempt_Answer (
    question_id INT NOT NULL,
    attempt_id INT NOT NULL,
    selected_option_ids VARCHAR(MAX), 
    is_correct BIT NOT NULL,         
    answer_text NVARCHAR(MAX),         
    PRIMARY KEY (question_id, attempt_id),
    CONSTRAINT FK_Attempt_A_Question FOREIGN KEY (question_id) REFERENCES Question(question_id),
    CONSTRAINT FK_Attempt_A_Quiz_Attempt FOREIGN KEY (attempt_id) REFERENCES Quiz_Attempt(attempt_id)
);
GO

INSERT INTO Attempt_Answer (question_id, attempt_id, selected_option_ids, is_correct, answer_text)
VALUES
(1, 1, '1', 1, N'A named storage for data'),
(2, 2, '3', 1, N'2x'),
(3, 3, '5', 0, N'Teacher lectures only'),
(4, 4, '7', 1, N'An object remains at rest or in motion unless acted upon');
GO

-- ========================
-- 34.QUIZ_QUESTION TABLE
-- ========================
CREATE TABLE Quiz_Question (
    question_id INT NOT NULL,
    quiz_id INT NOT NULL,
    point DECIMAL(4,2) CHECK (point>=0) NOT NULL,
    position INT NOT NULL,
    PRIMARY KEY (question_id, quiz_id),
    CONSTRAINT FK_Quiz_Question_Question FOREIGN KEY (question_id) REFERENCES Question(question_id),
    CONSTRAINT FK_Quiz_Question_Quiz FOREIGN KEY (quiz_id) REFERENCES Quiz(quiz_id)
);
GO

INSERT INTO Quiz_Question (question_id, quiz_id, point, position)
VALUES
(1, 1, 2.00, 1),
(2, 2, 2.00, 1),
(3, 3, 2.00, 1),
(4, 4, 2.00, 1);
GO


-------------------------------------------------
-- Trigger 1: tự động gán attempt_no cho Quiz_Attempt
-------------------------------------------------
CREATE TRIGGER TRG_QuizAttempt_SetAttemptNo
ON Quiz_Attempt
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @quiz_id    INT;
    DECLARE @student_id INT;
    DECLARE @next_no    INT;

    -- Lấy quiz_id và student_id của bản ghi vừa chèn
    SELECT 
        @quiz_id    = quiz_id,
        @student_id = student_id
    FROM inserted;

    -- Nếu người dùng đã tự truyền attempt_no khác NULL thì không đụng tới
    IF EXISTS (
        SELECT 1 FROM inserted
        WHERE attempt_no IS NOT NULL
    )
        RETURN;

    -- Đếm số attempt trước đó của SV cho quiz này
    SELECT 
        @next_no = ISNULL(MAX(attempt_no), 0) + 1
    FROM Quiz_Attempt
    WHERE quiz_id    = @quiz_id
      AND student_id = @student_id
      AND attempt_id NOT IN (SELECT attempt_id FROM inserted); -- chỉ tính bản ghi cũ

    -- Cập nhật attempt_no cho dòng vừa chèn (hiện tại đang NULL)
    UPDATE Quiz_Attempt
    SET attempt_no = @next_no
    WHERE attempt_id IN (SELECT attempt_id FROM inserted);
END;
GO

-------------------------------------------------
-- Trigger 2: ép nghiệp vụ khi cấp Certificate
-------------------------------------------------
CREATE TRIGGER TRG_Certificate_RequireCompletedCourse
ON Certificate
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Có bản ghi mới/sửa nào vi phạm không?
    IF EXISTS (
        SELECT 1
        FROM inserted c
        WHERE NOT EXISTS (
            SELECT 1
            FROM Enrollment e
            INNER JOIN Section s 
                ON e.section_id = s.section_id
            WHERE e.student_id = c.student_id
              AND s.course_id  = c.course_id
              AND e.status     = 'completed'
        )
    )
    BEGIN
        RAISERROR(
            'Cannot issue certificate: student has not completed this course.',
            16, 1
        );
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO


-- FUNCTION
CREATE OR ALTER FUNCTION GetStudentAverageScore
(
    @student_id INT
)
RETURNS DECIMAL(5,2)
AS
BEGIN
    DECLARE @avgScore DECIMAL(5,2);

    -- Kiểm tra đầu vào hợp lệ
    IF @student_id IS NULL OR @student_id <= 0
        RETURN NULL;

    SELECT @avgScore = AVG(rs.score)
    FROM RUBRIC_SCORE rs
    INNER JOIN SUBMISSION s ON rs.submission_id = s.submission_id
    WHERE s.student_id = @student_id;

    RETURN @avgScore;
END;
GO



CREATE OR ALTER FUNCTION CountCompletedCourses
(
    @student_id INT
)
RETURNS INT
AS
BEGIN
    DECLARE @count INT;

    IF @student_id IS NULL OR @student_id <= 0
        RETURN 0;

    SELECT @count = COUNT(*)
    FROM CERTIFICATE c
    WHERE c.student_id = @student_id
      AND c.status = 'issued';

    RETURN @count;
END;
GO


-- STORED PROCEDURE

CREATE OR ALTER PROCEDURE GetCourseRanking
    @course_id INT
AS
BEGIN
    SET NOCOUNT ON;

    IF @course_id IS NULL OR @course_id <= 0
    BEGIN
        PRINT 'Invalid Course ID!';
        RETURN;
    END

    SELECT 
        s.student_id,
        u.first_name + ' ' + u.last_name AS StudentName,
        AVG(rs.score) AS AverageScore
    FROM STUDENT s
    JOIN [USER] u ON s.student_id = u.user_id
    JOIN SUBMISSION sub ON sub.student_id = s.student_id
    JOIN ASSIGNMENT a ON a.assignment_id = sub.assignment_id
    JOIN RUBRIC_SCORE rs ON rs.submission_id = sub.submission_id
    WHERE a.section_id IN (
        SELECT section_id FROM SECTION WHERE course_id = @course_id
    )
    GROUP BY s.student_id, u.first_name, u.last_name
    HAVING AVG(rs.score) IS NOT NULL
    ORDER BY AverageScore DESC;
END;
GO



CREATE OR ALTER PROCEDURE AddSubmission
    @assignment_id INT,
    @student_id INT,
    @submitted_at DATETIME
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @due_at DATETIME;
    DECLARE @status VARCHAR(20);

    -- Kiểm tra input
    IF @assignment_id IS NULL OR @student_id IS NULL OR @submitted_at IS NULL
    BEGIN
        PRINT 'Missing parameters!';
        RETURN;
    END

    SELECT @due_at = due_at 
    FROM ASSIGNMENT 
    WHERE assignment_id = @assignment_id;

    IF @due_at IS NULL
    BEGIN
        PRINT 'Assignment not found!';
        RETURN;
    END

    -- So sánh hạn nộp
    IF @submitted_at <= @due_at
        SET @status = 'on_time';
    ELSE
        SET @status = 'late';

    INSERT INTO SUBMISSION (assignment_id, student_id, status, submitted_at)
    VALUES (@assignment_id, @student_id, @status, @submitted_at);

    PRINT 'Submission added successfully with status: ' + @status;
END;
GO

