// School Management System JavaScript
class SchoolManagementSystem {
    constructor() {
        this.students = JSON.parse(localStorage.getItem('students')) || [];
        this.teachers = JSON.parse(localStorage.getItem('teachers')) || [];
        this.staff = JSON.parse(localStorage.getItem('staff')) || [];
        this.admissions = JSON.parse(localStorage.getItem('admissions')) || [];
        this.attendance = JSON.parse(localStorage.getItem('attendance')) || {};
        this.exams = JSON.parse(localStorage.getItem('exams')) || [];
        this.schedules = JSON.parse(localStorage.getItem('schedules')) || {};
        this.activities = JSON.parse(localStorage.getItem('activities')) || [];
        this.settings = JSON.parse(localStorage.getItem('settings')) || this.getDefaultSettings();
        this.recycleBin = JSON.parse(localStorage.getItem('recycleBin')) || [];
        this.questionPapers = JSON.parse(localStorage.getItem('questionPapers')) || [];
        this.examSchedules = JSON.parse(localStorage.getItem('examSchedules')) || [];
        this.examResults = JSON.parse(localStorage.getItem('examResults')) || [];
        this.feeRecords = JSON.parse(localStorage.getItem('feeRecords')) || [];
        this.feeStructures = JSON.parse(localStorage.getItem('feeStructures')) || [];
        this.extraExpenses = JSON.parse(localStorage.getItem('extraExpenses')) || [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDashboardData();
        this.populateClassFilters();
        this.setCurrentDate();
        this.showSection('dashboard');
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.showSection(section);
            });
        });

        // Forms
        document.getElementById('admissionForm').addEventListener('submit', (e) => this.handleAdmission(e));
        document.getElementById('studentForm').addEventListener('submit', (e) => this.handleStudentSubmit(e));
        document.getElementById('teacherForm').addEventListener('submit', (e) => this.handleTeacherSubmit(e));
        document.getElementById('schoolInfoForm').addEventListener('submit', (e) => this.saveSchoolInfo(e));
        document.getElementById('systemPrefsForm').addEventListener('submit', (e) => this.saveSystemPreferences(e));
        document.getElementById('securityForm').addEventListener('submit', (e) => this.saveSecuritySettings(e));
        document.getElementById('extraExpenseForm').addEventListener('submit', (e) => this.handleExtraExpenseSubmit(e));

        // Theme toggle
        document.getElementById('theme').addEventListener('change', (e) => {
            const theme = e.target.value;
            this.settings.preferences.theme = theme;
            localStorage.setItem('settings', JSON.stringify(this.settings));
            this.applyTheme(theme);
        });

        // Search and filters
        document.getElementById('studentSearch').addEventListener('input', () => this.filterStudents());
        document.getElementById('teacherSearch').addEventListener('input', () => this.filterTeachers());
        document.getElementById('staffSearch').addEventListener('input', () => this.filterStaff());
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Show selected section
        document.getElementById(sectionName).classList.add('active');
        
        // Add active class to nav link
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Load section-specific data
        this.loadSectionData(sectionName);
    }

    loadSectionData(sectionName) {
        switch(sectionName) {
            case 'students':
                this.loadStudents();
                break;
            case 'teachers':
                this.loadTeachers();
                break;
            case 'attendance':
                this.loadAttendance();
                break;
            case 'schedule':
                this.loadSchedule();
                break;
            case 'exams':
                this.loadExams();
                break;
            case 'staff':
                this.loadStaff();
                break;
            case 'settings':
                this.loadSettings();
                break;
            case 'fees':
                this.showFeeTab('collect');
                break;
        }
    }

    // Dashboard Methods
    loadDashboardData() {
        // Update statistics
        document.getElementById('totalStudents').textContent = this.students.length;
        document.getElementById('totalTeachers').textContent = this.teachers.length;
        document.getElementById('pendingAdmissions').textContent = this.admissions.filter(a => a.status === 'pending').length;
        
        // Update today's attendance
        const today = new Date().toISOString().split('T')[0];
        const todayAttendance = this.attendance[today] || {};
        const presentCount = Object.values(todayAttendance).filter(status => status === 'present').length;
        document.getElementById('todayAttendance').textContent = presentCount;

        // Load recent activities
        this.loadRecentActivities();
    }

    loadRecentActivities() {
        const recentList = document.getElementById('recentList');
        if (this.activities.length === 0) {
            recentList.innerHTML = '<p>No recent activities</p>';
            return;
        }

        const recentActivities = this.activities.slice(-5).reverse();
        recentList.innerHTML = recentActivities.map(activity => 
            `<div class="activity-item">
                <span class="activity-time">${this.formatDate(activity.timestamp)}</span>
                <span class="activity-description">${activity.description}</span>
            </div>`
        ).join('');
    }

    addActivity(description) {
        const activity = {
            id: Date.now(),
            description,
            timestamp: new Date().toISOString()
        };
        this.activities.push(activity);
        localStorage.setItem('activities', JSON.stringify(this.activities));
        this.loadRecentActivities();
    }

    // Student Management
    showAddStudentForm() {
        document.getElementById('modalTitle').textContent = 'Add Student';
        document.getElementById('studentId').value = '';
        document.getElementById('studentForm').reset();
        document.getElementById('studentModal').style.display = 'block';
    }

    editStudent(studentId) {
        const student = this.students.find(s => s.id == studentId);
        if (!student) return;

        document.getElementById('modalTitle').textContent = 'Edit Student';
        document.getElementById('studentId').value = student.id;
        document.getElementById('editStudentName').value = student.name;
        document.getElementById('editClass').value = student.class;
        document.getElementById('editRollNo').value = student.rollNo;
        document.getElementById('editDateOfBirth').value = student.dateOfBirth;
        document.getElementById('editParentName').value = student.parentName;
        document.getElementById('editContact').value = student.contact;
        document.getElementById('editEmail').value = student.email;
        document.getElementById('editAddress').value = student.address;

        document.getElementById('studentModal').style.display = 'block';
    }

    handleStudentSubmit(e) {
        e.preventDefault();
        
        const studentData = {
            id: document.getElementById('studentId').value || Date.now(),
            name: document.getElementById('editStudentName').value,
            class: document.getElementById('editClass').value,
            rollNo: document.getElementById('editRollNo').value,
            dateOfBirth: document.getElementById('editDateOfBirth').value,
            parentName: document.getElementById('editParentName').value,
            contact: document.getElementById('editContact').value,
            email: document.getElementById('editEmail').value,
            address: document.getElementById('editAddress').value,
            admissionDate: new Date().toISOString()
        };

        const existingIndex = this.students.findIndex(s => s.id == studentData.id);
        if (existingIndex >= 0) {
            this.students[existingIndex] = studentData;
            this.addActivity(`Updated student: ${studentData.name}`);
        } else {
            this.students.push(studentData);
            this.addActivity(`Added new student: ${studentData.name}`);
        }

        localStorage.setItem('students', JSON.stringify(this.students));
        document.getElementById('studentModal').style.display = 'none';
        this.loadStudents();
        this.loadDashboardData();
    }

    loadStudents() {
        const studentsList = document.getElementById('studentsList');
        const classFilter = document.getElementById('classFilter').value;
        const searchTerm = document.getElementById('studentSearch').value.toLowerCase();

        let filteredStudents = this.students;

        if (classFilter) {
            filteredStudents = filteredStudents.filter(s => s.class === classFilter);
        }

        if (searchTerm) {
            filteredStudents = filteredStudents.filter(s => 
                s.name.toLowerCase().includes(searchTerm) || 
                s.rollNo.toLowerCase().includes(searchTerm)
            );
        }

        if (filteredStudents.length === 0) {
            studentsList.innerHTML = '<p>No students found. Add your first student!</p>';
            return;
        }

        studentsList.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Roll No</th>
                        <th>Name</th>
                        <th>Class</th>
                        <th>Parent</th>
                        <th>Contact</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredStudents.map(student => `
                        <tr>
                            <td>${student.rollNo}</td>
                            <td>${student.name}</td>
                            <td>${student.class}</td>
                            <td>${student.parentName}</td>
                            <td>${student.contact}</td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="schoolSystem.editStudent(${student.id})">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteStudent(${student.id})">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    deleteStudent(studentId) {
        if (confirm('Are you sure you want to delete this student?')) {
            const student = this.students.find(s => s.id == studentId);
            this.students = this.students.filter(s => s.id != studentId);
            localStorage.setItem('students', JSON.stringify(this.students));
            this.addActivity(`Deleted student: ${student.name}`);
            this.loadStudents();
            this.loadDashboardData();
        }
    }

    filterStudents() {
        this.loadStudents();
    }

    // Teacher Management
    showAddTeacherForm() {
        document.getElementById('teacherModalTitle').textContent = 'Add Teacher';
        document.getElementById('teacherId').value = '';
        document.getElementById('teacherForm').reset();
        document.getElementById('teacherModal').style.display = 'block';
    }

    editTeacher(teacherId) {
        const teacher = this.teachers.find(t => t.id == teacherId);
        if (!teacher) return;

        document.getElementById('teacherModalTitle').textContent = 'Edit Teacher';
        document.getElementById('teacherId').value = teacher.id;
        document.getElementById('teacherName').value = teacher.name;
        document.getElementById('fatherName').value = teacher.fatherName;
        document.getElementById('teacherDOB').value = teacher.dob;
        document.getElementById('aadharNumber').value = teacher.aadharNumber;
        document.getElementById('subjectSpecialization').value = teacher.subject;
        document.getElementById('yearsOfExperience').value = teacher.experience;
        document.getElementById('teacherEmail').value = teacher.email;
        document.getElementById('teacherContact').value = teacher.contact;
        document.getElementById('teacherAddress').value = teacher.address;
        document.getElementById('qualification').value = teacher.qualification;

        document.getElementById('teacherModal').style.display = 'block';
    }

    handleTeacherSubmit(e) {
        e.preventDefault();

        // Get form data
        const teacherData = {
            id: document.getElementById('teacherId').value || Date.now(),
            name: document.getElementById('teacherName').value,
            fatherName: document.getElementById('fatherName').value,
            dob: document.getElementById('teacherDOB').value,
            aadharNumber: document.getElementById('aadharNumber').value,
            subject: document.getElementById('subjectSpecialization').value,
            experience: document.getElementById('yearsOfExperience').value,
            email: document.getElementById('teacherEmail').value,
            contact: document.getElementById('teacherContact').value,
            address: document.getElementById('teacherAddress').value,
            qualification: document.getElementById('qualification').value,
            joinDate: new Date().toISOString()
        };

        // Validate required fields
        if (!teacherData.name || !teacherData.fatherName || !teacherData.dob || !teacherData.aadharNumber || !teacherData.subject || !teacherData.experience || !teacherData.contact || !teacherData.address) {
            alert('Please fill in all required fields marked with *');
            return;
        }

        // Validate Aadhar number (must be 12 digits)
        if (!/^\d{12}$/.test(teacherData.aadharNumber)) {
            alert('Aadhar number must be exactly 12 digits');
            return;
        }

        // Validate DOB (must be valid date and not in future)
        const dobDate = new Date(teacherData.dob);
        const today = new Date();
        if (dobDate >= today) {
            alert('Date of Birth must be in the past');
            return;
        }

        // Validate experience (must be between 0 and 50)
        const expNum = parseInt(teacherData.experience);
        if (expNum < 0 || expNum > 50) {
            alert('Years of experience must be between 0 and 50');
            return;
        }

        const existingIndex = this.teachers.findIndex(t => t.id == teacherData.id);
        if (existingIndex >= 0) {
            this.teachers[existingIndex] = teacherData;
            this.addActivity(`Updated teacher: ${teacherData.name}`);
        } else {
            this.teachers.push(teacherData);
            this.addActivity(`Added new teacher: ${teacherData.name}`);
        }

        // Save to localStorage (for now - will be replaced with API call)
        localStorage.setItem('teachers', JSON.stringify(this.teachers));

        document.getElementById('teacherModal').style.display = 'none';
        this.loadTeachers();
        this.loadDashboardData();

        alert('Teacher saved successfully!');
    }

    loadTeachers() {
        const teachersList = document.getElementById('teachersList');
        const subjectFilter = document.getElementById('subjectFilter').value;
        const searchTerm = document.getElementById('teacherSearch').value.toLowerCase();

        let filteredTeachers = this.teachers;

        if (subjectFilter) {
            filteredTeachers = filteredTeachers.filter(t => t.subject === subjectFilter);
        }

        if (searchTerm) {
            filteredTeachers = filteredTeachers.filter(t =>
                t.name.toLowerCase().includes(searchTerm) ||
                t.subject.toLowerCase().includes(searchTerm)
            );
        }

        if (filteredTeachers.length === 0) {
            teachersList.innerHTML = '<p>No teachers found. Add your first teacher!</p>';
            return;
        }

        teachersList.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Subject</th>
                        <th>Experience</th>
                        <th>Contact</th>
                        <th>Qualification</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredTeachers.map(teacher => `
                        <tr>
                            <td>${teacher.name}</td>
                            <td>${teacher.subject}</td>
                            <td>${teacher.experience} years</td>
                            <td>${teacher.contact}</td>
                            <td>${teacher.qualification || 'Not specified'}</td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="schoolSystem.editTeacher(${teacher.id})">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteTeacher(${teacher.id})">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    deleteTeacher(teacherId) {
        if (confirm('Are you sure you want to delete this teacher?')) {
            const teacher = this.teachers.find(t => t.id == teacherId);
            this.teachers = this.teachers.filter(t => t.id != teacherId);
            localStorage.setItem('teachers', JSON.stringify(this.teachers));
            this.addActivity(`Deleted teacher: ${teacher.name}`);
            this.loadTeachers();
            this.loadDashboardData();
        }
    }

    filterTeachers() {
        this.loadTeachers();
    }

    // Fee Management
    showFeeTab(tabName) {
        // Hide all fee tab contents
        document.querySelectorAll('.fee-tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Remove active class from all fee tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab content
        document.getElementById(tabName + 'Tab').classList.add('active');
        document.querySelector(`[onclick="showFeeTab('${tabName}')"]`).classList.add('active');

        // Load tab-specific data
        switch(tabName) {
            case 'collect':
                this.loadFeeCollection();
                break;
            case 'records':
                this.loadFeeRecords();
                break;
            case 'structure':
                this.loadFeeStructures();
                break;
            case 'reports':
                this.loadFeeReports();
                break;
            case 'extra':
                this.loadExtraExpenses();
                break;
        }
    }

    loadFeeCollection() {
        // Placeholder for fee collection logic
        const collectTab = document.getElementById('collectFeeTab');
        if (collectTab) {
            collectTab.innerHTML = '<p>Fee collection feature coming soon!</p>';
        }
    }

    loadFeeRecords() {
        // Placeholder for fee records logic
        const recordsTab = document.getElementById('feeRecordsTab');
        if (recordsTab) {
            recordsTab.innerHTML = '<p>Fee records feature coming soon!</p>';
        }
    }

    loadFeeStructures() {
        // Placeholder for fee structures logic
        const structuresTab = document.getElementById('feeStructureTab');
        if (structuresTab) {
            structuresTab.innerHTML = '<p>Fee structure feature coming soon!</p>';
        }
    }

    loadFeeReports() {
        // Placeholder for fee reports logic
        const reportsTab = document.getElementById('feeReportsTab');
        if (reportsTab) {
            reportsTab.innerHTML = '<p>Fee reports feature coming soon!</p>';
        }
    }

    loadExtraExpenses() {
        const extraExpensesList = document.getElementById('extraExpensesList');
        if (this.extraExpenses.length === 0) {
            extraExpensesList.innerHTML = '<p>No extra expenses added yet.</p>';
            return;
        }
        extraExpensesList.innerHTML = this.extraExpenses.map(expense => `
            <tr>
                <td>${this.formatDate(expense.date)}</td>
                <td>${expense.description}</td>
                <td>₹${expense.amount}</td>
                <td>${expense.category}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteExtraExpense(${expense.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `).join('');
    }

    showAddExtraExpenseForm() {
        document.getElementById('extraExpenseModal').style.display = 'block';
    }

    handleExtraExpenseSubmit(e) {
        e.preventDefault();
        const date = document.getElementById('expenseDate').value;
        const description = document.getElementById('expenseDescription').value;
        const amount = parseFloat(document.getElementById('expenseAmount').value);
        const category = document.getElementById('expenseCategory').value;
        if (!date || !description || !amount || !category) {
            alert('Please fill in all required fields');
            return;
        }
        const expenseData = {
            id: Date.now(),
            date: date,
            description: description,
            amount: amount,
            category: category
        };
        this.extraExpenses.push(expenseData);
        localStorage.setItem('extraExpenses', JSON.stringify(this.extraExpenses));
        document.getElementById('extraExpenseModal').style.display = 'none';
        this.loadExtraExpenses();
        this.addActivity(`Added extra expense: ${description}`);
        // Reset form
        document.getElementById('expenseDate').value = '';
        document.getElementById('expenseDescription').value = '';
        document.getElementById('expenseAmount').value = '';
        document.getElementById('expenseCategory').value = '';
    }

    deleteExtraExpense(id) {
        this.extraExpenses = this.extraExpenses.filter(e => e.id != id);
        localStorage.setItem('extraExpenses', JSON.stringify(this.extraExpenses));
        this.loadExtraExpenses();
        this.addActivity('Deleted extra expense');
    }

    exportExtraExpenses() {
        const csvContent = "data:text/csv;charset=utf-8," + this.extraExpenses.map(e => `${e.date},${e.description},${e.amount},${e.category}`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "extra_expenses.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Attendance Management
    loadAttendance() {
        const attendanceClass = document.getElementById('attendanceClass');
        const attendanceDate = document.getElementById('attendanceDate');
        
        // Populate class dropdown
        const classes = [...new Set(this.students.map(s => s.class))];
        attendanceClass.innerHTML = '<option value="">Select Class</option>' + 
            classes.map(cls => `<option value="${cls}">${cls}</option>`).join('');

        const selectedClass = document.getElementById('attendanceClass').value;
        const selectedDate = document.getElementById('attendanceDate').value;
        
        if (!selectedClass || !selectedDate) {
            document.getElementById('attendanceSheet').innerHTML = '<p>Select a class and date to view attendance</p>';
            return;
        }

        const classStudents = this.students.filter(s => s.class === selectedClass);
        const dayAttendance = this.attendance[selectedDate] || {};

        document.getElementById('attendanceSheet').innerHTML = `
            <div class="attendance-card">
                <h4>Attendance for ${selectedClass} - ${this.formatDate(selectedDate)}</h4>
                ${classStudents.map(student => `
                    <div class="attendance-item">
                        <span>${student.name} (${student.rollNo})</span>
                        <div>
                            <label>
                                <input type="radio" name="attendance_${student.id}" value="present" 
                                    ${dayAttendance[student.id] === 'present' ? 'checked' : ''} 
                                    onchange="schoolSystem.markAttendance(${student.id}, '${selectedDate}', 'present')">
                                Present
                            </label>
                            <label>
                                <input type="radio" name="attendance_${student.id}" value="absent" 
                                    ${dayAttendance[student.id] === 'absent' ? 'checked' : ''} 
                                    onchange="schoolSystem.markAttendance(${student.id}, '${selectedDate}', 'absent')">
                                Absent
                            </label>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    markAttendance(studentId, date, status) {
        if (!this.attendance[date]) {
            this.attendance[date] = {};
        }
        this.attendance[date][studentId] = status;
        localStorage.setItem('attendance', JSON.stringify(this.attendance));
        this.loadDashboardData();
    }

    // Schedule Management
    loadSchedule() {
        const scheduleClass = document.getElementById('scheduleClass');
        
        // Populate class dropdown
        const classes = [...new Set(this.students.map(s => s.class))];
        scheduleClass.innerHTML = '<option value="">Select Class</option>' + 
            classes.map(cls => `<option value="${cls}">${cls}</option>`).join('');
    }

    // Exam Management
    showCreateExamForm() {
        alert('Exam scheduling will be implemented next');
    }

    loadExams() {
        this.loadExamTabs('exams');
    }

    showExamTab(tabName) {
        // Hide all exam tab contents
        document.querySelectorAll('.exam-tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Remove active class from all exam tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab content
        document.getElementById(tabName + 'Tab').classList.add('active');
        document.querySelector(`[onclick="showExamTab('${tabName}')"]`).classList.add('active');

        // Load tab-specific data
        this.loadExamTabs(tabName);
    }

    loadExamTabs(tabName) {
        switch(tabName) {
            case 'papers':
                this.loadPapers();
                break;
            case 'exams':
                this.loadExamSchedules();
                break;
            case 'results':
                this.loadExamResults();
                break;
        }
    }

    loadPapers() {
        const papersList = document.getElementById('papersList');
        const subjectFilter = document.getElementById('subjectFilter').value;

        let filteredPapers = this.questionPapers;

        if (subjectFilter) {
            filteredPapers = filteredPapers.filter(p => p.subject === subjectFilter);
        }

        if (filteredPapers.length === 0) {
            papersList.innerHTML = '<p>No question papers created yet. Create your first paper!</p>';
            return;
        }

        papersList.innerHTML = filteredPapers.map(paper => `
            <div class="paper-card">
                <div class="paper-header">
                    <div class="paper-info">
                        <h4>${paper.title}</h4>
                        <div class="paper-meta">
                            <span><i class="fas fa-book"></i> ${paper.subject}</span>
                            <span><i class="fas fa-graduation-cap"></i> Class ${paper.class}</span>
                            <span><i class="fas fa-clock"></i> ${paper.duration} min</span>
                            <span><i class="fas fa-star"></i> ${paper.totalMarks} marks</span>
                        </div>
                    </div>
                    <div class="paper-date">
                        Created: ${this.formatDate(paper.createdDate)}
                    </div>
                </div>
                <div class="paper-preview">
                    ${paper.content.length > 200 ? paper.content.substring(0, 200) + '...' : paper.content}
                </div>
                <div class="paper-actions">
                    <button class="btn btn-primary btn-sm" onclick="schoolSystem.editPaper(${paper.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-success btn-sm" onclick="schoolSystem.generatePDFFromPaper(${paper.id})">
                        <i class="fas fa-file-pdf"></i> Generate PDF
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="schoolSystem.printPaper(${paper.id})">
                        <i class="fas fa-print"></i> Print
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="schoolSystem.deletePaper(${paper.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    savePaper() {
        const title = document.getElementById('paperTitle').value;
        const subject = document.getElementById('paperSubject').value;
        const classValue = document.getElementById('paperClass').value;
        const duration = document.getElementById('paperDuration').value;
        const totalMarks = document.getElementById('paperTotalMarks').value;
        const instructions = document.getElementById('paperInstructions').value;
        const content = document.getElementById('paperEditor').innerHTML;

        if (!title || !subject || !classValue) {
            alert('Please fill in the basic paper information first');
            return;
        }

        const paperData = {
            id: Date.now(),
            title,
            subject,
            class: classValue,
            duration: duration || '120',
            totalMarks: totalMarks || '100',
            instructions,
            content,
            createdDate: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };

        this.questionPapers.push(paperData);
        localStorage.setItem('questionPapers', JSON.stringify(this.questionPapers));

        this.addActivity(`Created question paper: ${title}`);
        document.getElementById('paperCreatorModal').style.display = 'none';
        this.loadPapers();

        alert('Question paper saved successfully!');
    }

    editPaper(paperId) {
        const paper = this.questionPapers.find(p => p.id == paperId);
        if (!paper) return;

        document.getElementById('paperModalTitle').textContent = 'Edit Question Paper';
        document.getElementById('paperTitle').value = paper.title;
        document.getElementById('paperSubject').value = paper.subject;
        document.getElementById('paperClass').value = paper.class;
        document.getElementById('paperDuration').value = paper.duration;
        document.getElementById('paperTotalMarks').value = paper.totalMarks;
        document.getElementById('paperInstructions').value = paper.instructions;
        document.getElementById('paperEditor').innerHTML = paper.content;

        // Store current paper ID for update
        document.getElementById('paperEditor').setAttribute('data-paper-id', paperId);
        document.getElementById('paperCreatorModal').style.display = 'block';
    }

    deletePaper(paperId) {
        if (confirm('Are you sure you want to delete this question paper?')) {
            const paper = this.questionPapers.find(p => p.id == paperId);
            this.questionPapers = this.questionPapers.filter(p => p.id != paperId);
            localStorage.setItem('questionPapers', JSON.stringify(this.questionPapers));

            this.addActivity(`Deleted question paper: ${paper.title}`);
            this.loadPapers();

            alert('Question paper deleted successfully!');
        }
    }

    generatePDFFromPaper(paperId) {
        const paper = this.questionPapers.find(p => p.id == paperId);
        if (!paper) return;

        this.generatePDFFromPaperData(paper);
    }

    generatePDFFromPaperData(paper) {
        // Create PDF content
        const pdfContent = `
            <html>
            <head>
                <title>${paper.title}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
                    .paper-title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
                    .paper-meta { font-size: 14px; color: #666; margin-bottom: 20px; }
                    .instructions { background: #f9f9f9; padding: 15px; border-left: 4px solid #667eea; margin-bottom: 30px; }
                    .content { line-height: 1.6; }
                    .question { margin-bottom: 20px; }
                    .question-number { font-weight: bold; color: #667eea; }
                    table { border-collapse: collapse; width: 100%; margin: 15px 0; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    @media print { body { margin: 20px; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="paper-title">${paper.title}</div>
                    <div class="paper-meta">
                        Subject: ${paper.subject} | Class: ${paper.class} | Duration: ${paper.duration} minutes | Total Marks: ${paper.totalMarks}
                    </div>
                </div>
                ${paper.instructions ? `<div class="instructions"><strong>Instructions:</strong><br>${paper.instructions}</div>` : ''}
                <div class="content">${paper.content}</div>
            </body>
            </html>
        `;

        // Open in new window for PDF generation
        const printWindow = window.open('', '_blank');
        printWindow.document.write(pdfContent);
        printWindow.document.close();

        // Wait for content to load then print
        printWindow.onload = function() {
            printWindow.print();
        };

        this.addActivity(`Generated PDF for paper: ${paper.title}`);
    }

    printPaper(paperId) {
        const paper = this.questionPapers.find(p => p.id == paperId);
        if (!paper) return;

        this.printPaperData(paper);
    }

    printPaperData(paper) {
        // Create print-friendly content
        const printContent = `
            <html>
            <head>
                <title>${paper.title} - Print</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
                    .paper-title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
                    .paper-meta { font-size: 14px; color: #666; margin-bottom: 20px; }
                    .instructions { background: #f9f9f9; padding: 15px; border-left: 4px solid #667eea; margin-bottom: 30px; }
                    .content { line-height: 1.6; }
                    .question { margin-bottom: 20px; }
                    .question-number { font-weight: bold; color: #667eea; }
                    table { border-collapse: collapse; width: 100%; margin: 15px 0; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    @media print { body { margin: 20px; } .no-print { display: none; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="paper-title">${paper.title}</div>
                    <div class="paper-meta">
                        Subject: ${paper.subject} | Class: ${paper.class} | Duration: ${paper.duration} minutes | Total Marks: ${paper.totalMarks}
                    </div>
                </div>
                ${paper.instructions ? `<div class="instructions"><strong>Instructions:</strong><br>${paper.instructions}</div>` : ''}
                <div class="content">${paper.content}</div>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();

        printWindow.onload = function() {
            printWindow.print();
        };

        this.addActivity(`Printed paper: ${paper.title}`);
    }

    loadExamSchedules() {
        const examsList = document.getElementById('examsList');
        examsList.innerHTML = '<p>Exam scheduling feature coming soon!</p>';
    }

    loadExamResults() {
        const resultsList = document.getElementById('resultsList');
        resultsList.innerHTML = '<p>Exam results feature coming soon!</p>';
    }

    // Settings Management
    getDefaultSettings() {
        return {
            schoolInfo: {
                name: '',
                code: '',
                address: '',
                phone: '',
                email: '',
                website: ''
            },
            preferences: {
                theme: 'light',
                language: 'en',
                timezone: 'Asia/Kolkata',
                dateFormat: 'DD/MM/YYYY',
                autoBackup: false,
                notifications: true
            },
            security: {
                sessionTimeout: false
            }
        };
    }

    loadSettings() {
        // Load school information
        document.getElementById('schoolName').value = this.settings.schoolInfo.name || '';
        document.getElementById('schoolCode').value = this.settings.schoolInfo.code || '';
        document.getElementById('schoolAddress').value = this.settings.schoolInfo.address || '';
        document.getElementById('schoolPhone').value = this.settings.schoolInfo.phone || '';
        document.getElementById('schoolEmail').value = this.settings.schoolInfo.email || '';
        document.getElementById('schoolWebsite').value = this.settings.schoolInfo.website || '';

        // Load system preferences
        document.getElementById('theme').value = this.settings.preferences.theme;
        document.getElementById('language').value = this.settings.preferences.language;
        document.getElementById('timezone').value = this.settings.preferences.timezone;
        document.getElementById('dateFormat').value = this.settings.preferences.dateFormat;
        document.getElementById('autoBackup').checked = this.settings.preferences.autoBackup;
        document.getElementById('notifications').checked = this.settings.preferences.notifications;

        // Load security settings
        document.getElementById('sessionTimeout').checked = this.settings.security.sessionTimeout;

        // Update data counts
        this.updateDataCounts();
        this.updateSystemInfo();
    }

    saveSchoolInfo(e) {
        e.preventDefault();
        
        this.settings.schoolInfo = {
            name: document.getElementById('schoolName').value,
            code: document.getElementById('schoolCode').value,
            address: document.getElementById('schoolAddress').value,
            phone: document.getElementById('schoolPhone').value,
            email: document.getElementById('schoolEmail').value,
            website: document.getElementById('schoolWebsite').value
        };

        localStorage.setItem('settings', JSON.stringify(this.settings));
        this.addActivity('Updated school information');
        alert('School information saved successfully!');
    }

    saveSystemPreferences(e) {
        e.preventDefault();
        
        this.settings.preferences = {
            theme: document.getElementById('theme').value,
            language: document.getElementById('language').value,
            timezone: document.getElementById('timezone').value,
            dateFormat: document.getElementById('dateFormat').value,
            autoBackup: document.getElementById('autoBackup').checked,
            notifications: document.getElementById('notifications').checked
        };

        localStorage.setItem('settings', JSON.stringify(this.settings));
        this.addActivity('Updated system preferences');
        alert('System preferences saved successfully!');
    }

    saveSecuritySettings(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Basic password validation
        if (newPassword && newPassword.length < 6) {
            alert('New password must be at least 6 characters long');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            alert('New password and confirmation do not match');
            return;
        }
        
        // Update security settings
        this.settings.security = {
            sessionTimeout: document.getElementById('sessionTimeout').checked
        };
        
        localStorage.setItem('settings', JSON.stringify(this.settings));
        this.addActivity('Updated security settings');
        
        // Reset form
        document.getElementById('securityForm').reset();
        alert('Security settings saved successfully!');
    }

    // ID Card Generation
    generateIDCard() {
        const selectedId = document.getElementById('studentSelect').value;
        if (!selectedId) {
            alert('Please select a student first.');
            return;
        }
        const student = this.students.find(s => s.id == selectedId);
        if (!student) {
            alert('Selected student not found.');
            return;
        }
        const photoInput = document.getElementById('idCardPhoto');
        const file = photoInput.files[0];
        const placeholderSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iODAiIGZpbGw9IiNjY2MiLz48dGV4dCB4PSI1MCIgeT0iNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QaG90byBOb3QgQXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';
        let photoSrc = placeholderSrc;

        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                photoSrc = e.target.result;
                schoolSystem.openPrintWindow(photoSrc, student);
            };
            reader.readAsDataURL(file);
        } else {
            schoolSystem.openPrintWindow(photoSrc, student);
        }
    }

    openPrintWindow(src, stu) {
        const idCardContent = `
            <html>
            <head>
                <title>Student ID Card - ${stu.name}</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 20px; background: white; }
                    .id-card { width: 350px; height: 220px; border: 2px solid #333; padding: 20px; margin: 0 auto; background: #f8f9fa; border-radius: 10px; display: flex; flex-direction: column; justify-content: space-between; }
                    .photo-section { width: 100px; height: 80px; margin: 0 auto 10px; border: 1px solid #ddd; border-radius: 5px; overflow: hidden; }
                    .photo-section img { width: 100%; height: 100%; object-fit: cover; }
                    .school-name { font-size: 14px; color: #666; margin-bottom: 5px; }
                    .student-name { font-size: 18px; font-weight: bold; margin: 5px 0; }
                    .student-details { font-size: 12px; margin: 2px 0; }
                    .roll-no { font-size: 14px; color: #2193b0; font-weight: bold; }
                    .validity { font-size: 10px; color: #666; margin-top: 5px; }
                </style>
            </head>
            <body>
                <div class="id-card">
                    <div class="photo-section">
                        <img src="${src}" alt="Student Photo">
                    </div>
                    <div class="school-name">School Management System</div>
                    <div class="student-name">${stu.name}</div>
                    <div class="student-details">Class: ${stu.class}</div>
                    <div class="roll-no">Roll No: ${stu.rollNo}</div>
                    <div class="student-details">DOB: ${new Date(stu.dateOfBirth).toLocaleDateString()}</div>
                    <div class="student-details">Parent: ${stu.parentName}</div>
                    <div class="validity">Valid until end of academic year</div>
                </div>
                <script>
                    window.onload = function() { window.print(); window.close(); }
                </script>
            </body>
            </html>
        `;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(idCardContent);
        printWindow.document.close();
    }

    // Utility Methods
    populateClassFilters() {
        const classes = [...new Set(this.students.map(s => s
