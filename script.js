// Complete Working School Management System JavaScript
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
            timestamp: new Date().toISOString()
        };

        this.admissions.push(admissionData);
        localStorage.setItem('admissions', JSON.stringify(this.admissions));
        this.addActivity(`New admission application: ${admissionData.studentName}`);
        document.getElementById('admissionForm').reset();
        this.loadAdmissions();
        this.loadDashboardData();
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
            examsList.innerHTML = '<p>No exams scheduled yet</p>';
        }
    }

    // Fee Management
    loadFees() {
        const feeRecordsList = document.getElementById('feeRecordsList');
        if (!feeRecordsList) return;
        const classFilter = document.getElementById('feeRecordsClassFilter');
        const monthFilter = document.getElementById('feeRecordsMonthFilter');
        const searchTerm = document.getElementById('feeRecordsSearch');
        let filteredFees = this.feeRecords;

        if (classFilter && classFilter.value) {
            filteredFees = filteredFees.filter(f => f.class === classFilter.value);
        }

        if (monthFilter && monthFilter.value) {
            filteredFees = filteredFees.filter(f => f.month === monthFilter.value);
        }

        if (searchTerm && searchTerm.value) {
            const term = searchTerm.value.toLowerCase();
            filteredFees = filteredFees.filter(f => 
                f.studentName.toLowerCase().includes(term) || 
                f.feeType.toLowerCase().includes(term)
            );
        }

        if (filteredFees.length === 0) {
            feeRecordsList.innerHTML = '<p>No fee records found.</p>';
            return;
        }

        feeRecordsList.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Class</th>
                        <th>Fee Type</th>
                        <th>Amount</th>
                        <th>Month</th>
                        <th>Payment Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredFees.map(fee => `
                        <tr>
                            <td>${fee.studentName}</td>
                            <td>${fee.class}</td>
                            <td>${fee.feeType}</td>
                            <td>₹${fee.amount}</td>
                            <td>${fee.month}</td>
                            <td>${this.formatDate(fee.paymentDate)}</td>
                            <td>${fee.status || 'Paid'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // Reports Management
    loadReports() {
        const reportsContainer = document.getElementById('reportsContainer');
        if (!reportsContainer) return;
        reportsContainer.innerHTML = '<p>Select a report type to generate</p>';
    }

    // Staff Management
    loadStaff() {
        const staffList = document.getElementById('staffList');
        if (!staffList) return;
        const departmentFilter = document.getElementById('departmentFilter');
        const searchTerm = document.getElementById('staffSearch');
        let filteredStaff = this.staff;

        if (departmentFilter && departmentFilter.value) {
            filteredStaff = filteredStaff.filter(s => s.department === departmentFilter.value);
        }

        if (searchTerm && searchTerm.value) {
            const term = searchTerm.value.toLowerCase();
            filteredStaff = filteredStaff.filter(s => 
                s.name.toLowerCase().includes(term) || 
                s.department.toLowerCase().includes(term)
            );
        }

        if (filteredStaff.length === 0) {
            staffList.innerHTML = '<p>No staff members found. Add your first staff member!</p>';
            return;
        }

        staffList.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Position</th>
                        <th>Contact</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredStaff.map(staff => `
                        <tr>
                            <td>${staff.name}</td>
                            <td>${staff.department}</td>
                            <td>${staff.position}</td>
                            <td>${staff.contact}</td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="schoolSystem.editStaff(${staff.id})">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteStaff(${staff.id})">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
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

    // Theme Management
    applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }

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

function showAddSalaryForm() {
    schoolSystem.showAddSalaryForm();
}

function closeSalaryForm() {
    schoolSystem.closeSalaryForm();
}

function calculateNetSalary() {
    schoolSystem.calculateNetSalary();
}

function editStudent(studentId) {
    schoolSystem.editStudent(studentId);
}

function deleteStudent(studentId) {
    schoolSystem.deleteStudent(studentId);
}

function editTeacher(teacherId) {
    schoolSystem.editTeacher(teacherId);
}

function deleteTeacher(teacherId) {
    schoolSystem.deleteTeacher(teacherId);
}

function editSalary(salaryId) {
    schoolSystem.editSalary(salaryId);
}

function deleteSalary(salaryId) {
    schoolSystem.deleteSalary(salaryId);
}

function markAttendance(date, status, studentId) {
    schoolSystem.markAttendance(date, status, studentId);
}

function filterStudents() {
    schoolSystem.filterStudents();
}

function filterTeachers() {
    schoolSystem.filterTeachers();
}

function filterSalaries() {
    school
