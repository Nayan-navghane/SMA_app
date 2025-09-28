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

    init() {
        this.setupEventListeners();
        this.loadDashboardData();
        this.populateClassFilters();
        this.setCurrentDate();
        this.showSection('dashboard');
    }

    setCurrentDate() {
        const today = new Date().toISOString().split('T')[0];
        const dateInputs = [
            '#attendanceDate',
            '#paymentDate'
        ];
        dateInputs.forEach(selector => {
            const element = document.querySelector(selector);
            if (element && !element.value) {
                element.value = today;
            }
        });
    }

    populateClassFilters() {
        const classes = [...new Set(this.students.map(s => s.class))].sort();
        const selectors = [
            '#classFilter', 
            '#admissionClass', 
            '#editClass', 
            '#attendanceClass', 
            '#scheduleClass', 
            '#resultsClassFilter', 
            '#feeRecordsClassFilter',
            '#paperClass'
        ];
        selectors.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.innerHTML = '<option value="">Select Class</option>' + 
                    classes.map(cls => `<option value="${cls}">${cls}</option>`).join('');
            }
        });
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
        const admissionForm = document.getElementById('admissionForm');
        if (admissionForm) admissionForm.addEventListener('submit', (e) => this.handleAdmission(e));
        const studentForm = document.getElementById('studentForm');
        if (studentForm) studentForm.addEventListener('submit', (e) => this.handleStudentSubmit(e));
        const teacherForm = document.getElementById('teacherForm');
        if (teacherForm) teacherForm.addEventListener('submit', (e) => this.handleTeacherSubmit(e));
        const schoolInfoForm = document.getElementById('schoolInfoForm');
        if (schoolInfoForm) schoolInfoForm.addEventListener('submit', (e) => this.saveSchoolInfo(e));
        const systemPrefsForm = document.getElementById('systemPrefsForm');
        if (systemPrefsForm) systemPrefsForm.addEventListener('submit', (e) => this.saveSystemPreferences(e));
        const securityForm = document.getElementById('securityForm');
        if (securityForm) securityForm.addEventListener('submit', (e) => this.saveSecuritySettings(e));
        const extraExpenseForm = document.getElementById('extraExpenseForm');
        if (extraExpenseForm) extraExpenseForm.addEventListener('submit', (e) => this.handleExtraExpenseSubmit(e));

        // Theme toggle
        const themeSelect = document.getElementById('theme');
        if (themeSelect) themeSelect.addEventListener('change', (e) => {
            const theme = e.target.value;
            this.settings.preferences.theme = theme;
            localStorage.setItem('settings', JSON.stringify(this.settings));
            this.applyTheme(theme);
        });

        // Search and filters
        const studentSearch = document.getElementById('studentSearch');
        if (studentSearch) studentSearch.addEventListener('input', () => this.filterStudents());
        const teacherSearch = document.getElementById('teacherSearch');
        if (teacherSearch) teacherSearch.addEventListener('input', () => this.filterTeachers());
        const staffSearch = document.getElementById('staffSearch');
        if (staffSearch) staffSearch.addEventListener('input', () => this.filterStaff());
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Show selected section
        const sectionElement = document.getElementById(sectionName);
        if (sectionElement) {
            sectionElement.classList.add('active');
        }
        
        // Add active class to nav link
        const navLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (navLink) {
            navLink.classList.add('active');
        }

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
            case 'salary':
                this.loadSalaries();
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
        const totalStudentsEl = document.getElementById('totalStudents');
        if (totalStudentsEl) totalStudentsEl.textContent = this.students.length;
        const totalTeachersEl = document.getElementById('totalTeachers');
        if (totalTeachersEl) totalTeachersEl.textContent = this.teachers.length;
        const pendingAdmissionsEl = document.getElementById('pendingAdmissions');
        if (pendingAdmissionsEl) pendingAdmissionsEl.textContent = this.admissions.filter(a => a.status === 'pending').length;
        
        // Update today's attendance
        const today = new Date().toISOString().split('T')[0];
        const todayAttendance = this.attendance[today] || {};
        const presentCountEl = document.getElementById('todayAttendance');
        if (presentCountEl) presentCountEl.textContent = Object.values(todayAttendance).filter(status => status === 'present').length;

        // Load recent activities
        this.loadRecentActivities();
    }

    loadRecentActivities() {
        const recentList = document.getElementById('recentList');
        if (!recentList) return;
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
    loadStudents() {
        const studentsList = document.getElementById('studentsList');
        if (!studentsList) return;
        const classFilter = document.getElementById('classFilter');
        const searchTerm = document.getElementById('studentSearch');
        let filteredStudents = this.students;

        if (classFilter && classFilter.value) {
            filteredStudents = filteredStudents.filter(s => s.class === classFilter.value);
        }

        if (searchTerm && searchTerm.value) {
            const term = searchTerm.value.toLowerCase();
            filteredStudents = filteredStudents.filter(s => 
                s.name.toLowerCase().includes(term) || 
                s.rollNo.toLowerCase().includes(term)
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

    showAddStudentForm() {
        const modalTitle = document.getElementById('modalTitle');
        if (modalTitle) modalTitle.textContent = 'Add Student';
        const studentId = document.getElementById('studentId');
        if (studentId) studentId.value = '';
        const studentForm = document.getElementById('studentForm');
        if (studentForm) studentForm.reset();
        const studentModal = document.getElementById('studentModal');
        if (studentModal) studentModal.style.display = 'block';
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
    loadTeachers() {
        const teachersList = document.getElementById('teachersList');
        if (!teachersList) return;
        const subjectFilter = document.getElementById('subjectFilter');
        const searchTerm = document.getElementById('teacherSearch');
        let filteredTeachers = this.teachers;

        if (subjectFilter && subjectFilter.value) {
            filteredTeachers = filteredTeachers.filter(t => t.subject === subjectFilter.value);
        }

        if (searchTerm && searchTerm.value) {
            const term = searchTerm.value.toLowerCase();
            filteredTeachers = filteredTeachers.filter(t =>
                t.name.toLowerCase().includes(term) ||
                t.subject.toLowerCase().includes(term)
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

    showAddTeacherForm() {
        const teacherModalTitle = document.getElementById('teacherModalTitle');
        if (teacherModalTitle) teacherModalTitle.textContent = 'Add Teacher';
        const teacherId = document.getElementById('teacherId');
        if (teacherId) teacherId.value = '';
        const teacherForm = document.getElementById('teacherForm');
        if (teacherForm) teacherForm.reset();
        const teacherModal = document.getElementById('teacherModal');
        if (teacherModal) teacherModal.style.display = 'block';
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

        localStorage.setItem('teachers', JSON.stringify(this.teachers));
        document.getElementById('teacherModal').style.display = 'none';
        this.loadTeachers();
        this.loadDashboardData();
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

    // Settings Management
    loadSettings() {
        const schoolName = document.getElementById('schoolName');
        if (schoolName) schoolName.value = this.settings.schoolInfo.name || '';
        const schoolCode = document.getElementById('schoolCode');
        if (schoolCode) schoolCode.value = this.settings.schoolInfo.code || '';
        const schoolAddress = document.getElementById('schoolAddress');
        if (schoolAddress) schoolAddress.value = this.settings.schoolInfo.address || '';
        const schoolPhone = document.getElementById('schoolPhone');
        if (schoolPhone) schoolPhone.value = this.settings.schoolInfo.phone || '';
        const schoolEmail = document.getElementById('schoolEmail');
        if (schoolEmail) schoolEmail.value = this.settings.schoolInfo.email || '';
        const schoolWebsite = document.getElementById('schoolWebsite');
        if (schoolWebsite) schoolWebsite.value = this.settings.schoolInfo.website || '';

        const theme = document.getElementById('theme');
        if (theme) theme.value = this.settings.preferences.theme;
        const language = document.getElementById('language');
        if (language) language.value = this.settings.preferences.language;
        const timezone = document.getElementById('timezone');
        if (timezone) timezone.value = this.settings.preferences.timezone;
        const dateFormat = document.getElementById('dateFormat');
        if (dateFormat) dateFormat.value = this.settings.preferences.dateFormat;
        const autoBackup = document.getElementById('autoBackup');
        if (autoBackup) autoBackup.checked = this.settings.preferences.autoBackup;
        const notifications = document.getElementById('notifications');
        if (notifications) notifications.checked = this.settings.preferences.notifications;

        const sessionTimeout = document.getElementById('sessionTimeout');
        if (sessionTimeout) sessionTimeout.checked = this.settings.security.sessionTimeout;
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

    // Fee Management
    showFeeTab(tabName) {
        // Hide all fee tab contents
        document.querySelectorAll('.fee-tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Remove active class from all fee tab buttons
        document.querySelectorAll('.fee-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab content
        const tabElement = document.getElementById(tabName + 'Tab');
        if (tabElement) {
            tabElement.classList.add('active');
        }
        
        // Add active class to tab button
        const tabBtn = document.querySelector(`[onclick="showFeeTab('${tabName}')"]`);
        if (tabBtn) {
            tabBtn.classList.add('active');
        }

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
        const collectTab = document.getElementById('collectFeeTab');
        if (collectTab) {
            collectTab.innerHTML = '<p>Fee collection feature coming soon!</p>';
        }
    }

    loadFeeRecords() {
        const recordsTab = document.getElementById('feeRecordsTab');
        if (recordsTab) {
            recordsTab.innerHTML = '<p>Fee records feature coming soon!</p>';
        }
    }

    loadFeeStructures() {
        const structuresTab = document.getElementById('feeStructureTab');
        if (structuresTab) {
            structuresTab.innerHTML = '<p>Fee structure feature coming soon!</p>';
        }
    }

    loadFeeReports() {
        const reportsTab = document.getElementById('feeReportsTab');
        if (reportsTab) {
            reportsTab.innerHTML = '<p>Fee reports feature coming soon!</p>';
        }
    }

    loadExtraExpenses() {
        const extraExpensesList = document.getElementById('extraExpensesList');
        if (!extraExpensesList) return;
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
        const modal = document.getElementById('extraExpenseModal');
        if (modal) modal.style.display = 'block';
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
        if (attendanceClass) {
            const classes = [...new Set(this.students.map(s => s.class))];
            attendanceClass.innerHTML = '<option value="">All Classes</option>' + 
                classes.map(cls => `<option value="${cls}">${cls}</option>`).join('');
        }

        const selectedClass = attendanceClass ? attendanceClass.value : '';
        const selectedDate = attendanceDate ? attendanceDate.value : '';
        
        if (!selectedClass || !selectedDate) {
            const attendanceSheet = document.getElementById('attendanceSheet');
            if (attendanceSheet) attendanceSheet.innerHTML = '<p>Select a class and date to view attendance</p>';
            return;
        }

        const classStudents = this.students.filter(s => s.class === selectedClass);
        const dayAttendance = this.attendance[selectedDate] || {};

        const attendanceSheet = document.getElementById('attendanceSheet');
        if (attendanceSheet) {
            attendanceSheet.innerHTML = `
                <div class="attendance-card">
                    <h4>Attendance for ${selectedClass} - ${this.formatDate(selectedDate)}</h4>
                    ${classStudents.map(student => `
                        <div class="attendance-item">
                            <span>${student.name} (${student.rollNo})</span>
                            <div>
                                <label>
                                    <input type="radio" name="attendance_${student.id}" value="present" 
                                        ${dayAttendance[student.id] === 'present' ? 'checked' : ''} 
                                        onchange="schoolSystem.markAttendance('${selectedDate}', 'present', ${student.id})">
                                    Present
                                </label>
                                <label>
                                    <input type="radio" name="attendance_${student.id}" value="absent" 
                                        ${dayAttendance[student.id] === 'absent' ? 'checked' : ''} 
                                        onchange="schoolSystem.markAttendance('${selectedDate}', 'absent', ${student.id})">
                                    Absent
                                </label>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    markAttendance(date, status, studentId) {
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
        if (scheduleClass) {
            const classes = [...new Set(this.students.map(s => s.class))];
            scheduleClass.innerHTML = '<option value="">Select Class</option>' + 
                classes.map(cls => `<option value="${cls}">${cls}</option>`).join('');
        }
    }

    // Exam Management
    loadExams() {
        const examsList = document.getElementById('examsList');
        if (examsList) {
            examsList.innerHTML = '<p>Exam management feature coming soon!</p>';
        }
    }

    // Staff Management
    loadStaff() {
        const staffList = document.getElementById('staffList');
        if (staffList) {
            staffList.innerHTML = '<p>Staff management feature coming soon!</p>';
        }
    }

    // Salary Management
    loadSalaries() {
        const salariesList = document.getElementById('salariesList');
        if (!salariesList) return;

        // Populate teacher select
        const teacherSelect = document.getElementById('teacherSelect');
        if (teacherSelect) {
            teacherSelect.innerHTML = '<option value="">Select Teacher</option>' + 
                this.teachers.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
        }

        const searchTerm = document.getElementById('salarySearch');
        let filteredSalaries = this.salaries;

        if (searchTerm && searchTerm.value) {
            const term = searchTerm.value.toLowerCase();
            filteredSalaries = filteredSalaries.filter(s => 
                s.teacherName.toLowerCase().includes(term) || 
                s.designation.toLowerCase().includes(term)
            );
        }

        if (filteredSalaries.length === 0) {
            salariesList.innerHTML = '<p>No salary records found. Add your first salary record!</p>';
            return;
        }

        salariesList.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Teacher Name</th>
                        <th>Designation</th>
                        <th>Basic Salary</th>
                        <th>Allowances</th>
                        <th>Deductions</th>
                        <th>Net Salary</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredSalaries.map(salary => `
                        <tr>
                            <td>${salary.teacherName}</td>
                            <td>${salary.designation}</td>
                            <td>₹${salary.basicSalary}</td>
                            <td>₹${salary.allowances}</td>
                            <td>₹${salary.deductions}</td>
                            <td>₹${salary.netSalary}</td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="schoolSystem.editSalary(${salary.id})">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteSalary(${salary.id})">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // Salary Management
    loadSalaries() {
        const salariesList = document.getElementById('salariesList');
        if (!salariesList) return;

        // Populate teacher select
        const teacherSelect = document.getElementById('teacherSelect');
        if (teacherSelect) {
            teacherSelect.innerHTML = '<option value="">Select Teacher</option>' + 
                this.teachers.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
        }

        const searchTerm = document.getElementById('salarySearch');
        let filteredSalaries = this.salaries;

        if (searchTerm && searchTerm.value) {
            const term = searchTerm.value.toLowerCase();
            filteredSalaries = filteredSalaries.filter(s => 
                s.teacherName.toLowerCase().includes(term) || 
                s.designation.toLowerCase().includes(term)
            );
        }

        if (filteredSalaries.length === 0) {
            salariesList.innerHTML = '<p>No salary records found. Add your first salary record!</p>';
            return;
        }

        salariesList.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Teacher Name</th>
                        <th>Designation</th>
                        <th>Basic Salary</th>
                        <th>Allowances</th>
                        <th>Deductions</th>
                        <th>Net Salary</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredSalaries.map(salary => `
                        <tr>
                            <td>${salary.teacherName}</td>
                            <td>${salary.designation}</td>
                            <td>₹${salary.basicSalary}</td>
                            <td>₹${salary.allowances}</td>
                            <td>₹${salary.deductions}</td>
                            <td>₹${salary.netSalary}</td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="schoolSystem.editSalary(${salary.id})">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="school

    // Utility Methods
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }
}

// Initialize the system when page loads
const schoolSystem = new SchoolManagementSystem();

// Global functions for HTML onclick handlers
function showSection(sectionName) {
    schoolSystem.showSection(sectionName);
}

function logout() {
    localStorage.removeItem('loggedIn');
    window.location.href = 'login.html';
}

function showAddStudentForm() {
    schoolSystem.showAddStudentForm();
}

function showAddTeacherForm() {
    schoolSystem.showAddTeacherForm();
}

function generateIDCard() {
    const selectedId = document.getElementById('studentSelect').value;
    if (!selectedId) {
        alert('Please select a student first.');
        return;
    }
    const student = schoolSystem.students.find(s => s.id == selectedId);
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

function openPrintWindow(src, stu) {
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

// Global functions for HTML onclick handlers
function showFeeTab(tabName) {
    schoolSystem.showFeeTab(tabName);
}

function showAddExtraExpenseForm() {
    schoolSystem.showAddExtraExpenseForm();
}

function exportExtraExpenses() {
    schoolSystem.exportExtraExpenses();
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function showPaperCreator() {
    document.getElementById('paperCreatorModal').style.display = 'block';
}

function showExamTab(tabName) {
    // Hide all exam tab contents
    document.querySelectorAll('.exam-tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all exam tab buttons
    document.querySelectorAll('.exam-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab content
    const tabElement = document.getElementById(tabName + 'Tab');
    if (tabElement) {
        tabElement.classList.add('active');
    }
    
    // Add active class to tab button
    const tabBtn = document.querySelector(`[onclick="showExamTab('${tabName}')"]`);
    if (tabBtn) {
        tabBtn.classList.add('active');
    }

    // Load tab-specific data
    switch(tabName) {
        case 'papers':
            schoolSystem.loadPapers();
            break;
        case 'exams':
            schoolSystem.loadExamSchedules();
            break;
        case 'results':
            schoolSystem.loadExamResults();
            break;
    }
}

function showCreateExamForm() {
    // Placeholder for exam creation form
    alert('Exam creation form coming soon!');
}

function loadPapers() {
    const papersList = document.getElementById('papersList');
    if (papersList) {
        papersList.innerHTML = '<p>No question papers created yet. Create your first paper!</p>';
    }
}

function loadExamSchedules() {
    const examsList = document.getElementById('examsList');
    if (examsList) {
        examsList.innerHTML = '<p>No exams scheduled yet</p>';
    }
}

function loadExamResults() {
    const resultsList = document.getElementById('resultsList');
    if (resultsList) {
        resultsList.innerHTML = '<p>Select class and subject to view results</p>';
    }
}

function generateReportCards() {
    alert('Report cards generation coming soon!');
}

function formatText(command, value = null) {
    const editor = document.getElementById('paperEditor');
    if (editor) {
        document.execCommand(command, false, value);
        editor.focus();
    }
}

function addQuestion() {
    const editor = document.getElementById('paperEditor');
    if (editor) {
        const questionTemplate = `
            <div class="question-template">
                <div class="question-number">Q. [Number]</div>
                <div class="question-text">[Question text here]</div>
                <ul class="options-list">
                    <li><span class="option-letter">A.</span> [Option A]</li>
                    <li><span class="option-letter">B.</span> [Option B]</li>
                    <li><span class="option-letter">C.</span> [Option C]</li>
                    <li><span class="option-letter">D.</span> [Option D]</li>
                </ul>
                <div class="correct-answer">Correct Answer: [A/B/C/D]</div>
            </div>
        `;
        editor.insertAdjacentHTML('beforeend', questionTemplate);
        editor.focus();
    }
}

function insertTable() {
    const editor = document.getElementById('paperEditor');
    if (editor) {
        const tableTemplate = `
            <table border="1" style="border-collapse: collapse; width: 100%;">
                <thead>
                    <tr>
                        <th style="padding: 8px; text-align: left;">Header 1</th>
                        <th style="padding: 8px; text-align: left;">Header 2</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 8px;">Row 1, Cell 1</td>
                        <td style="padding: 8px;">Row 1, Cell 2</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Row 2, Cell 1</td>
                        <td style="padding: 8px;">Row 2, Cell 2</td>
                    </tr>
                </tbody>
            </table>
        `;
        editor.insertAdjacentHTML('beforeend', tableTemplate);
        editor.focus();
    }
}

function previewPaper() {
    const editor = document.getElementById('paperEditor');
    if (editor) {
        const previewWindow = window.open('', '_blank');
        const previewContent = `
            <html>
            <head>
                <title>Paper Preview</title>
                <style>
                    body { font-family: 'Times New Roman', serif; margin: 40px; line-height: 1.6; font-size: 14px; }
                    .question-template { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
                    .question-number { font-weight: bold; font-size: 16px; margin-bottom: 10px; }
                    .options-list { margin: 10px 0; padding-left: 20px; }
                    .correct-answer { color: green; font-weight: bold; margin-top: 10px; }
                </style>
            </head>
            <body>
                ${editor.innerHTML}
            </body>
            </html>
        `;
        previewWindow.document.write(previewContent);
        previewWindow.document.close();
    }
}

function savePaper() {
    const paperData = {
        id: Date.now(),
        title: document.getElementById('paperTitle').value,
        subject: document.getElementById('paperSubject').value,
        class: document.getElementById('paperClass').value,
        duration: document.getElementById('paperDuration').value,
        totalMarks: document.getElementById('paperTotalMarks').value,
        instructions: document.getElementById('paperInstructions').value,
        content: document.getElementById('paperEditor').innerHTML,
        createdAt: new Date().toISOString()
    };

    if (!paperData.title || !paperData.subject || !paperData.class) {
        alert('Please fill in all required fields');
        return;
    }

    schoolSystem.questionPapers.push(paperData);
    localStorage.setItem('questionPapers', JSON.stringify(schoolSystem.questionPapers));
    alert('Paper saved successfully!');
    closeModal('paperCreatorModal');
    schoolSystem.loadPapers();
}

function generatePDF() {
    alert('PDF generation coming soon! Paper content will be saved.');
    savePaper();
}

function printPaper() {
    const editor = document.getElementById('paperEditor');
    if (editor) {
        const printWindow = window.open('', '_blank');
        const printContent = `
            <html>
            <head>
                <title>Print Paper</title>
                <style>
                    body { font-family: 'Times New Roman', serif; margin: 40px; line-height: 1.6; font-size: 14px; }
                    @media print { body { margin: 0; } }
                </style>
            </head>
            <body>
                <h1>${document.getElementById('paperTitle').value}</h1>
                <p><strong>Subject:</strong> ${document.getElementById('paperSubject').value}</p>
                <p><strong>Class:</strong> ${document.getElementById('paperClass').value}</p>
                <p><strong>Duration:</strong> ${document.getElementById('paperDuration').value} minutes</p>
                <p><strong>Total Marks:</strong> ${document.getElementById('paperTotalMarks').value}</p>
                ${document.getElementById('paperInstructions').value ? `<p><strong>Instructions:</strong> ${document.getElementById('paperInstructions').value}</p>` : ''}
                <hr>
                ${editor.innerHTML}
            </body>
            </html>
        `;
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.onload = () => {
            printWindow.print();
            printWindow.close();
        };
    }
}
