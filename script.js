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
        this.salaries = JSON.parse(localStorage.getItem('salaries')) || [];
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
        this.populateClassFilters();
        this.setCurrentDate();
        this.showSection('dashboard');
    }

    setCurrentDate() {
        const today = new Date().toISOString().split('T')[0];
        const dateInputs = [
            '#attendanceDate',
            '#paymentDate',
            '#dateOfBirth',
            '#expenseDate'
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
        const salaryForm = document.getElementById('salaryForm');
        if (salaryForm) salaryForm.addEventListener('submit', (e) => this.handleSalarySubmit(e));
        const schoolInfoForm = document.getElementById('schoolInfoForm');
        if (schoolInfoForm) schoolInfoForm.addEventListener('submit', (e) => this.saveSchoolInfo(e));
        const systemPrefsForm = document.getElementById('systemPrefsForm');
        if (systemPrefsForm) systemPrefsForm.addEventListener('submit', (e) => this.saveSystemPreferences(e));
        const securityForm = document.getElementById('securityForm');
        if (securityForm) securityForm.addEventListener('submit', (e) => this.saveSecuritySettings(e));
        const extraExpenseForm = document.getElementById('extraExpenseForm');
        if (extraExpenseForm) extraExpenseForm.addEventListener('submit', (e) => this.handleExtraExpenseSubmit(e));

        // Excel upload for salary
        const excelUpload = document.getElementById('excelUpload');
        if (excelUpload) excelUpload.addEventListener('change', (e) => this.uploadSalaryExcel(e));

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
        const salarySearch = document.getElementById('salarySearch');
        if (salarySearch) salarySearch.addEventListener('input', () => this.filterSalaries());
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
            case 'dashboard':
                this.loadDashboardData();
                break;
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
        }
    }

    // Dashboard Methods
    loadDashboardData() {
        const totalStudentsEl = document.getElementById('totalStudents');
        if (totalStudentsEl) totalStudentsEl.textContent = this.students.length;
        const totalTeachersEl = document.getElementById('totalTeachers');
        if (totalTeachersEl) totalTeachersEl.textContent = this.teachers.length;
        const pendingAdmissionsEl = document.getElementById('pendingAdmissions');
        if (pendingAdmissionsEl) pendingAdmissionsEl.textContent = this.admissions.filter(a => a.status === 'pending').length;
        
        const today = new Date().toISOString().split('T')[0];
        const todayAttendance = this.attendance[today] || {};
        const presentCountEl = document.getElementById('todayAttendance');
        if (presentCountEl) presentCountEl.textContent = Object.values(todayAttendance).filter(status => status === 'present').length;

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

    // Salary Management
    loadSalaries() {
        const salariesList = document.getElementById('salariesList');
        if (!salariesList) return;
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

    showAddSalaryForm() {
        const salaryFormContainer = document.getElementById('salaryFormContainer');
        if (salaryFormContainer) salaryFormContainer.style.display = 'block';

        const salaryId = document.getElementById('salaryId');
        if (salaryId) salaryId.value = '';

        const salaryForm = document.getElementById('salaryForm');
        if (salaryForm) salaryForm.reset();

        // Populate teacher select if not already populated
        const teacherSelect = document.getElementById('teacherSelect');
        if (teacherSelect) {
            teacherSelect.innerHTML = '<option value="">Select Teacher</option>' + 
                this.teachers.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
        }
    }

    editSalary(salaryId) {
        const salary = this.salaries.find(s => s.id == salaryId);
        if (!salary) return;

        const salaryFormContainer = document.getElementById('salaryFormContainer');
        if (salaryFormContainer) salaryFormContainer.style.display = 'block';

        document.getElementById('salaryId').value = salary.id;
        document.getElementById('teacherSelect').value = salary.teacherId;
        document.getElementById('designation').value = salary.designation;
        document.getElementById('basicSalary').value = salary.basicSalary;
        document.getElementById('allowances').value = salary.allowances;
        document.getElementById('deductions').value = salary.deductions;
        document.getElementById('netSalary').value = salary.netSalary;

        this.calculateNetSalary();
    }

    handleSalarySubmit(e) {
        e.preventDefault();

        const salaryData = {
            id: document.getElementById('salaryId').value || Date.now(),
            teacherId: document.getElementById('teacherSelect').value,
            teacherName: document.getElementById('teacherSelect').options[document.getElementById('teacherSelect').selectedIndex].text,
            designation: document.getElementById('designation').value,
            basicSalary: parseFloat(document.getElementById('basicSalary').value),
            allowances: parseFloat(document.getElementById('allowances').value),
            deductions: parseFloat(document.getElementById('deductions').value),
            netSalary: parseFloat(document.getElementById('netSalary').value),
            updatedAt: new Date().toISOString()
        };

        // Validate required fields
        if (!salaryData.teacherId || !salaryData.designation || !salaryData.basicSalary || !salaryData.allowances || !salaryData.deductions) {
            alert('Please fill in all required fields');
            return;
        }

        const existingIndex = this.salaries.findIndex(s => s.id == salaryData.id);
        if (existingIndex >= 0) {
            this.salaries[existingIndex] = salaryData;
            this.addActivity(`Updated salary for ${salaryData.teacherName}`);
        } else {
            this.salaries.push(salaryData);
            this.addActivity(`Added salary for ${salaryData.teacherName}`);
        }

        localStorage.setItem('salaries', JSON.stringify(this.salaries));
        document.getElementById('salaryFormContainer').style.display = 'none';
        this.loadSalaries();
    }

    deleteSalary(salaryId) {
        if (confirm('Are you sure you want to delete this salary record?')) {
            const salary = this.salaries.find(s => s.id == salaryId);
            this.salaries = this.salaries.filter(s => s.id != salaryId);
            localStorage.setItem('salaries', JSON.stringify(this.salaries));
            this.addActivity(`Deleted salary for ${salary.teacherName}`);
            this.loadSalaries();
        }
    }

    filterSalaries() {
        this.loadSalaries();
    }

    calculateNetSalary() {
        const basic = parseFloat(document.getElementById('basicSalary').value) || 0;
        const allowances = parseFloat(document.getElementById('allowances').value) || 0;
        const deductions = parseFloat(document.getElementById('deductions').value) || 0;
        const net = basic + allowances - deductions;
        document.getElementById('netSalary').value = net;
    }

    uploadSalaryExcel(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);

            jsonData.forEach(row => {
                const teacher = this.teachers.find(t => t.name === row['Teacher Name']);
                if (teacher) {
                    const salaryData = {
                        id: Date.now() + Math.random(),
                        teacherId: teacher.id,
                        teacherName: teacher.name,
                        designation: row['Designation'] || '',
                        basicSalary: parseFloat(row['Basic Salary']) || 0,
                        allowances: parseFloat(row['Allowances']) || 0,
                        deductions: parseFloat(row['Deductions']) || 0,
                        netSalary: (parseFloat(row['Basic Salary']) || 0) + (parseFloat(row['Allowances']) || 0) - (parseFloat(row['Deductions']) || 0),
                        updatedAt: new Date().toISOString()
                    };
                    this.salaries.push(salaryData);
                }
            });

            localStorage.setItem('salaries', JSON.stringify(this.salaries));
            this.addActivity(`Uploaded ${jsonData.length} salary records from Excel`);
            this.loadSalaries();
            e.target.value = ''; // Reset file input
            alert('Salary data uploaded successfully!');
        };
        reader.readAsArrayBuffer(file);
    }

    // Admissions Management
    loadAdmissions() {
        const admissionsList = document.getElementById('admissionsList');
        if (!admissionsList) return;
        const statusFilter = document.getElementById('admissionStatusFilter');
        const searchTerm = document.getElementById('admissionSearch');
        let filteredAdmissions = this.admissions;

        if (statusFilter && statusFilter.value) {
            filteredAdmissions = filteredAdmissions.filter(a => a.status === statusFilter.value);
        }

        if (searchTerm && searchTerm.value) {
            const term = searchTerm.value.toLowerCase();
            filteredAdmissions = filteredAdmissions.filter(a => 
                a.studentName.toLowerCase().includes(term) || 
                a.parentName.toLowerCase().includes(term)
            );
        }

        if (filteredAdmissions.length === 0) {
            admissionsList.innerHTML = '<p>No admissions found.</p>';
            return;
        }

        admissionsList.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Class</th>
                        <th>Parent</th>
                        <th>Contact</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredAdmissions.map(admission => `
                        <tr>
                            <td>${admission.studentName}</td>
                            <td>${admission.class}</td>
                            <td>${admission.parentName}</td>
                            <td>${admission.contact}</td>
                            <td>${admission.status}</td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="schoolSystem.editAdmission(${admission.id})">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteAdmission(${admission.id})">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    handleAdmission(e) {
        e.preventDefault();
        const admissionData = {
            id: Date.now(),
            studentName: document.getElementById('studentName').value,
            class: document.getElementById('admissionClass').value,
            parentName: document.getElementById('parentName').value,
            contact: document.getElementById('contactNumber').value,
            email: document.getElementById('email').value,
            dateOfBirth: document.getElementById('dateOfBirth').value,
            address: document.getElementById('address').value,
            previousSchool: document.getElementById('previousSchool').value,
            status: 'pending',
