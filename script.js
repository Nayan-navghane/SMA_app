class SchoolManagementSystem {
    constructor() {
        if (!localStorage.getItem('loggedIn') || localStorage.getItem('loggedIn') !== 'true') {
            window.location.href = 'login.html';
            return;
        }

        this.students = JSON.parse(localStorage.getItem('students')) || [];
        this.teachers = JSON.parse(localStorage.getItem('teachers')) || [];
        this.salaries = JSON.parse(localStorage.getItem('salaries')) || [];
        this.admissions = JSON.parse(localStorage.getItem('admissions')) || [];
        this.staff = JSON.parse(localStorage.getItem('staff')) || [];
        this.settings = JSON.parse(localStorage.getItem('settings')) || this.getDefaultSettings();
        this.activities = JSON.parse(localStorage.getItem('activities')) || [];
        this.attendance = JSON.parse(localStorage.getItem('attendance')) || {};
        this.exams = JSON.parse(localStorage.getItem('exams')) || [];
        this.schedules = JSON.parse(localStorage.getItem('schedules')) || {};
        this.feeRecords = JSON.parse(localStorage.getItem('feeRecords')) || [];
        this.feeStructures = JSON.parse(localStorage.getItem('feeStructures')) || [];
        this.extraExpenses = JSON.parse(localStorage.getItem('extraExpenses')) || [];
        this.questionPapers = JSON.parse(localStorage.getItem('questionPapers')) || [];
        this.examSchedules = JSON.parse(localStorage.getItem('examSchedules')) || [];
        this.examResults = JSON.parse(localStorage.getItem('examResults')) || [];
        this.recycleBin = JSON.parse(localStorage.getItem('recycleBin')) || [];
        this.init();
    }

    getDefaultSettings() {
        return {
            schoolInfo: {
                name: 'Government School',
                code: 'GOVT001',
                address: 'Government School Address',
                phone: '123-456-7890',
                email: 'govt.school@example.com',
                website: 'govt.school.gov'
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
        this.populateFilters();
        this.setCurrentDate();
        this.showSection('dashboard');
    }

    setCurrentDate() {
        const today = new Date().toISOString().split('T')[0];
        const dateInputs = document.querySelectorAll('input[type="date"]');
        dateInputs.forEach(input => {
            if (!input.value) {
                input.value = today;
            }
        });
    }

    populateFilters() {
        // Populate class filters
        const classes = [...new Set([...this.students, ...this.teachers].map(item => item.class || item.subject || '')).filter(cls => cls)].sort();
        const classSelectors = document.querySelectorAll('select[id$="Class"]');
        classSelectors.forEach(selector => {
            selector.innerHTML = '<option value="">All Classes</option>' + classes.map(cls => `<option value="${cls}">${cls}</option>`).join('');
        });

        // Populate subject filters
        const subjects = [...new Set(this.teachers.map(t => t.subject))].sort();
        const subjectSelectors = document.querySelectorAll('select[id$="Subject"]');
        subjectSelectors.forEach(selector => {
            selector.innerHTML = '<option value="">All Subjects</option>' + subjects.map(sub => `<option value="${sub}">${sub}</option>`).join('');
        });

        // Populate department filters
        const departments = [...new Set(this.staff.map(s => s.department))].sort();
        const departmentSelectors = document.querySelectorAll('select[id$="Department"]');
        departmentSelectors.forEach(selector => {
            selector.innerHTML = '<option value="">All Departments</option>' + departments.map(dept => `<option value="${dept}">${dept}</option>`).join('');
        });

        // Populate status filters
        const statusSelectors = document.querySelectorAll('select[id$="Status"]');
        statusSelectors.forEach(selector => {
            selector.innerHTML = '<option value="">All Status</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option>';
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
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleFormSubmit(form));
        });

        // Excel upload
        const excelUpload = document.getElementById('excelUpload');
        if (excelUpload) {
            excelUpload.addEventListener('change', (e) => this.handleExcelUpload(e));
        }

        // Theme toggle
        const themeSelect = document.getElementById('theme');
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                const theme = e.target.value;
                this.settings.preferences.theme = theme;
                localStorage.setItem('settings', JSON.stringify(this.settings));
                this.applyTheme(theme);
            });
        }
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
            case 'salary':
                this.loadSalaries();
                break;
            case 'admissions':
                this.loadAdmissions();
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
            case 'fees':
                this.loadFees();
                break;
            case 'reports':
                this.loadReports();
                break;
            case 'staff':
                this.loadStaff();
                break;
            case 'settings':
                this.loadSettings();
                break;
            case 'dashboard':
                this.loadDashboardData();
                break;
        }
    }

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
                            <td>${teacher.experience}</td>
                            <td>${teacher.contact}</td>
                            <td>${teacher.qualification}</td>
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

    // Stub for loadStaff
    loadStaff() {
        const staffList = document.getElementById('staffList');
        if (!staffList) return;
        staffList.innerHTML = '<p>No staff data available.</p>';
    }

    // Stub for loadAdmissions
    loadAdmissions() {
        const admissionsList = document.getElementById('admissionsList');
        if (!admissionsList) return;
        admissionsList.innerHTML = '<p>No admissions data available.</p>';
    }

    // Stub for loadAttendance
    loadAttendance() {
        const attendanceList = document.getElementById('attendanceList');
        if (!attendanceList) return;
        attendanceList.innerHTML = '<p>Attendance module coming soon.</p>';
    }

    // Stub for loadSchedule
    loadSchedule() {
        const scheduleList = document.getElementById('scheduleList');
        if (!scheduleList) return;
        scheduleList.innerHTML = '<p>Schedule data loading...</p>';
    }

    // Stub for loadExams
    loadExams() {
        const examsList = document.getElementById('examsList');
        if (!examsList) return;
        examsList.innerHTML = '<p>Exams data loading...</p>';
    }

    // Stub for loadFees
    loadFees() {
        const feesList = document.getElementById('feesList');
        if (!feesList) return;
        feesList.innerHTML = '<p>Fees data loading...</p>';
    }

    // Stub for loadSalaries
    loadSalaries() {
        const salaryList = document.getElementById('salaryList');
        if (!salaryList) return;
        salaryList.innerHTML = '<p>No salary data available.</p>';
    }

    // Stub for loadReports
    loadReports() {
        const reportsList = document.getElementById('reportsList');
        if (!reportsList) return;
        reportsList.innerHTML = '<p>Generate reports here.</p>';
    }

    // Stub for loadSettings
    loadSettings() {
        const schoolName = document.getElementById('schoolName');
        if (schoolName) schoolName.value = this.settings.schoolInfo.name;
        // Load other settings...
    }

    // Basic form handler
    handleFormSubmit(form) {
        const formId = form.id;
        if (formId === 'studentForm') {
            this.addStudent();
        } else if (formId === 'teacherForm') {
            this.addTeacher();
        } else if (formId === 'salaryForm') {
            this.addSalary();
        } else if (formId === 'admissionForm') {
            this.addAdmission();
        } else if (formId === 'schoolInfoForm') {
            this.saveSchoolInfo();
        } else if (formId === 'systemPrefsForm') {
            this.saveSystemPreferences();
        } else if (formId === 'securityForm') {
            this.saveSecuritySettings();
        }
    }

    // Student methods
    addStudent() {
        const student = {
            id: Date.now(),
            rollNo: document.getElementById('rollNo').value,
            name: document.getElementById('studentName').value,
            class: document.getElementById('studentClass').value,
            parentName: document.getElementById('parentName').value,
            contact: document.getElementById('contact').value
        };
        this.students.push(student);
        localStorage.setItem('students', JSON.stringify(this.students));
        this.loadStudents();
        this.loadDashboardData();
        this.clearForm('studentForm');
        alert('Student added successfully!');
    }

    editStudent(id) {
        const student = this.students.find(s => s.id === id);
        if (student) {
            // Populate form for editing
            document.getElementById('rollNo').value = student.rollNo;
            document.getElementById('studentName').value = student.name;
            document.getElementById('studentClass').value = student.class;
            document.getElementById('parentName').value = student.parentName;
            document.getElementById('contact').value = student.contact;
            // Change submit to update
            document.querySelector('#studentForm button[type="submit"]').textContent = 'Update Student';
        }
    }

    deleteStudent(id) {
        if (confirm('Are you sure?')) {
            this.students = this.students.filter(s => s.id !== id);
            localStorage.setItem('students', JSON.stringify(this.students));
            this.loadStudents();
            this.loadDashboardData();
        }
    }

    // Teacher methods
    addTeacher() {
        const teacher = {
            id: Date.now(),
            name: document.getElementById('teacherName').value,
            subject: document.getElementById('subject').value,
            experience: document.getElementById('experience').value,
            contact: document.getElementById('teacherContact').value,
            qualification: document.getElementById('qualification').value
        };
        this.teachers.push(teacher);
        localStorage.setItem('teachers', JSON.stringify(this.teachers));
        this.loadTeachers();
        this.loadDashboardData();
        this.clearForm('teacherForm');
        alert('Teacher added successfully!');
    }

    editTeacher(id) {
        const teacher = this.teachers.find(t => t.id === id);
        if (teacher) {
            document.getElementById('teacherName').value = teacher.name;
            document.getElementById('subject').value = teacher.subject;
            document.getElementById('experience').value = teacher.experience;
            document.getElementById('teacherContact').value = teacher.contact;
            document.getElementById('qualification').value = teacher.qualification;
            document.querySelector('#teacherForm button[type="submit"]').textContent = 'Update Teacher';
        }
    }

    deleteTeacher(id) {
        if (confirm('Are you sure?')) {
            this.teachers = this.teachers.filter(t => t.id !== id);
            localStorage.setItem('teachers', JSON.stringify(this.teachers));
            this.loadTeachers();
            this.loadDashboardData();
        }
    }

    // Stub for other add methods
    addSalary() {
        alert('Salary added (stub)');
    }

    addAdmission() {
        alert('Admission submitted (stub)');
    }

    // Settings methods
    saveSchoolInfo() {
        this.settings.schoolInfo.name = document.getElementById('schoolName').value;
        this.settings.schoolInfo.code = document.getElementById('schoolCode').value;
        this.settings.schoolInfo.address = document.getElementById('address').value;
        this.settings.schoolInfo.phone = document.getElementById('phone').value;
        this.settings.schoolInfo.email = document.getElementById('email').value;
        this.settings.schoolInfo.website = document.getElementById('website').value;
        localStorage.setItem('settings', JSON.stringify(this.settings));
        alert('School info saved!');
    }

    saveSystemPreferences() {
        this.settings.preferences.theme = document.getElementById('theme').value;
        this.settings.preferences.language = document.getElementById('language').value;
        this.settings.preferences.notifications = document.getElementById('notifications').checked;
        localStorage.setItem('settings', JSON.stringify(this.settings));
        this.applyTheme(this.settings.preferences.theme);
        alert('Preferences saved!');
    }

    saveSecuritySettings() {
        this.settings.security.sessionTimeout = document.getElementById('sessionTimeout').checked;
        localStorage.setItem('settings', JSON.stringify(this.settings));
        alert('Security settings saved!');
    }

    // Utility methods
    clearForm(formId) {
        document.getElementById(formId).reset();
        // Reset submit button text if needed
        if (formId === 'studentForm') {
            document.querySelector('#studentForm button[type="submit"]').textContent = 'Add Student';
        } else if (formId === 'teacherForm') {
            document.querySelector('#teacherForm button[type="submit"]').textContent = 'Add Teacher';
        }
    }

    closeModal() {
        document.getElementById('editModal').style.display = 'none';
    }

    applyTheme(theme) {
        document.body.className = theme;
        // Add more theme logic if needed
    }

    // Dashboard data
    loadDashboardData() {
        document.getElementById('totalStudents').textContent = this.students.length;
        document.getElementById('totalTeachers').textContent = this.teachers.length;
        document.getElementById('totalAdmissions').textContent = this.admissions.length;
        document.getElementById('totalFees').textContent = this.feeRecords.reduce((sum, f) => sum + (f.amount || 0), 0);
    }

    // Excel upload stub
    handleExcelUpload(e) {
        alert('Excel upload functionality requires additional libraries (e.g., SheetJS). Stub implemented.');
    }

    logout() {
        localStorage.removeItem('loggedIn');
        window.location.href = 'login.html';
    }
}

const schoolSystem = new SchoolManagementSystem();
