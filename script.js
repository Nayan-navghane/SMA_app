class SchoolManagementSystem {
    constructor() {
        if (!localStorage.getItem('loggedIn') || localStorage.getItem('loggedIn') !== 'true') {
            window.location.href = 'login.html';
            return;
        }

        try {
            this.students = JSON.parse(localStorage.getItem('students')) || [];
        } catch (e) {
            this.students = [];
        }
        try {
            this.teachers = JSON.parse(localStorage.getItem('teachers')) || [];
        } catch (e) {
            this.teachers = [];
        }
        try {
            this.salaries = JSON.parse(localStorage.getItem('salaries')) || [];
        } catch (e) {
            this.salaries = [];
        }
        try {
            this.admissions = JSON.parse(localStorage.getItem('admissions')) || [];
        } catch (e) {
            this.admissions = [];
        }
        try {
            this.staff = JSON.parse(localStorage.getItem('staff')) || [];
        } catch (e) {
            this.staff = [];
        }
        try {
            this.settings = JSON.parse(localStorage.getItem('settings')) || this.getDefaultSettings();
        } catch (e) {
            this.settings = this.getDefaultSettings();
        }
        try {
            this.activities = JSON.parse(localStorage.getItem('activities')) || [];
        } catch (e) {
            this.activities = [];
        }
        try {
            this.attendance = JSON.parse(localStorage.getItem('attendance')) || {};
        } catch (e) {
            this.attendance = {};
        }
        try {
            this.exams = JSON.parse(localStorage.getItem('exams')) || [];
        } catch (e) {
            this.exams = [];
        }
        try {
            this.schedules = JSON.parse(localStorage.getItem('schedules')) || {};
        } catch (e) {
            this.schedules = {};
        }
        try {
            this.feeRecords = JSON.parse(localStorage.getItem('feeRecords')) || [];
        } catch (e) {
            this.feeRecords = [];
        }
        try {
            this.feeStructures = JSON.parse(localStorage.getItem('feeStructures')) || [];
        } catch (e) {
            this.feeStructures = [];
        }
        try {
            this.extraExpenses = JSON.parse(localStorage.getItem('extraExpenses')) || [];
        } catch (e) {
            this.extraExpenses = [];
        }
        try {
            this.questionPapers = JSON.parse(localStorage.getItem('questionPapers')) || [];
        } catch (e) {
            this.questionPapers = [];
        }
        // Migrate legacy papers to use content
        this.questionPapers.forEach(paper => {
            if (paper.questions && !paper.content) {
                paper.content = paper.questions.map(q => `<p>${q.trim()}</p>`).join('');
                delete paper.questions;
            }
        });
        localStorage.setItem('questionPapers', JSON.stringify(this.questionPapers));
        try {
            this.examSchedules = JSON.parse(localStorage.getItem('examSchedules')) || [];
        } catch (e) {
            this.examSchedules = [];
        }
        try {
            this.examResults = JSON.parse(localStorage.getItem('examResults')) || [];
        } catch (e) {
            this.examResults = [];
        }
        try {
            this.recycleBin = JSON.parse(localStorage.getItem('recycleBin')) || [];
        } catch (e) {
            this.recycleBin = [];
        }
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
        // Populate class filters for students, admissions, papers, reports, schedule, attendance
        const classes = ['KG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', ...new Set(this.students.map(s => s.class))].filter(cls => cls).sort();
        const classSelectors = document.querySelectorAll('select[id*="Class"], select[id$="ClassFilter"], select#applyingClass, select#paperClass, select#reportClass, select#scheduleClass, select#attendanceClass');
        classSelectors.forEach(selector => {
            if (selector.id === 'applyingClass' || selector.id === 'paperClass' || selector.id === 'reportClass' || selector.id === 'scheduleClass' || selector.id === 'attendanceClass') {
                selector.innerHTML = '<option value="">Select Class</option>' + classes.map(cls => `<option value="${cls}">${cls}</option>`).join('');
            } else {
                selector.innerHTML = '<option value="">All Classes</option>' + classes.map(cls => `<option value="${cls}">${cls}</option>`).join('');
            }
        });

        // Populate subject filters for teachers, papers, schedule, attendance
        const subjects = [...new Set(this.teachers.map(t => t.subject))].sort();
        const subjectSelectors = document.querySelectorAll('select[id$="Subject"], select#subject, select#paperSubject, select#scheduleSubject, select#attendanceSubject');
        subjectSelectors.forEach(selector => {
            if (selector.id === 'subject' || selector.id === 'paperSubject' || selector.id === 'scheduleSubject' || selector.id === 'attendanceSubject') {
                selector.innerHTML = '<option value="">Select Subject</option>' + subjects.map(sub => `<option value="${sub}">${sub}</option>`).join('');
            } else {
                selector.innerHTML = '<option value="">All Subjects</option>' + subjects.map(sub => `<option value="${sub}">${sub}</option>`).join('');
            }
        });

        // Populate teacher select for schedule
        const teacherSelect = document.getElementById('scheduleTeacher');
        if (teacherSelect) {
            teacherSelect.innerHTML = '<option value="">Select Teacher</option>' + this.teachers.map(t => `<option value="${t.id}">${t.name} (${t.subject})</option>`).join('');
        }

        // Populate student select for reports
        const studentSelect = document.getElementById('reportStudent');
        if (studentSelect) {
            studentSelect.innerHTML = '<option value="">Select Student</option>' + this.students.map(s => `<option value="${s.id}">${s.rollNo} - ${s.name} (${s.class})</option>`).join('');
        }

        // Populate department filters for staff
        const departments = ['Administration', 'Teaching', 'Support', 'Maintenance', ...new Set(this.staff.map(s => s.department))].sort();
        const departmentSelectors = document.querySelectorAll('select[id*="Department"], select#staffDepartment');
        departmentSelectors.forEach(selector => {
            if (selector.id === 'staffDepartment') {
                selector.innerHTML = '<option value="">Select Department</option>' + departments.map(dept => `<option value="${dept}">${dept}</option>`).join('');
            } else {
                selector.innerHTML = '<option value="">All Departments</option>' + departments.map(dept => `<option value="${dept}">${dept}</option>`).join('');
            }
        });

        // Populate status filters
        const statusSelectors = document.querySelectorAll('select[id*="Status"], select#documents');
        statusSelectors.forEach(selector => {
            if (selector.id === 'documents') {
                selector.innerHTML = '<option value="complete">Complete</option><option value="pending">Pending</option><option value="incomplete">Incomplete</option>';
            } else {
                selector.innerHTML = '<option value="">All Status</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option>';
            }
        });

        // Populate paper type filter
        const paperTypeFilter = document.getElementById('paperTypeFilter');
        if (paperTypeFilter) {
            paperTypeFilter.innerHTML = '<option value="">All Types</option><option value="exam">Exam</option><option value="assignment">Assignment</option>';
        }

        // Populate report period filter
        const reportPeriodFilter = document.getElementById('reportPeriodFilter');
        if (reportPeriodFilter) {
            reportPeriodFilter.innerHTML = '<option value="">All Periods</option><option value="term1">Term 1</option><option value="term2">Term 2</option><option value="annual">Annual</option>';
        }
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                if (section) {
                    this.showSection(section);
                }
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
                this.loadFeeRecords();
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

    showAddStudentForm() {
        document.getElementById('addStudentFormContainer').style.display = 'block';
        this.currentEditingStudent = null;
        document.querySelector('#studentForm button[type="submit"]').textContent = 'Add Student';
    }

    hideAddStudentForm() {
        document.getElementById('addStudentFormContainer').style.display = 'none';
        this.clearForm('studentForm');
    }

    async addStudent() {
        const photoFile = document.getElementById('photo').files[0];
        let photoBase64 = null;
        if (photoFile) {
            photoBase64 = await this.readFileAsBase64(photoFile);
        }

        const student = {
            id: Date.now(),
            rollNo: document.getElementById('rollNo').value,
            name: document.getElementById('studentName').value,
            class: document.getElementById('studentClass').value,
            section: document.getElementById('section').value || '',
            dob: document.getElementById('dob').value,
            photo: photoBase64,
            parentName: document.getElementById('parentName').value,
            parentContact: document.getElementById('parentContact').value,
            address: document.getElementById('address').value,
            aadhar: document.getElementById('aadhar').value,
            bloodGroup: document.getElementById('bloodGroup').value,
            emergencyContact: document.getElementById('emergencyContact').value
        };
        this.students.push(student);
        localStorage.setItem('students', JSON.stringify(this.students));
        this.loadStudents();
        this.loadDashboardData();
        this.hideAddStudentForm();
        this.addActivity(`New student ${student.name} added`);
        alert('Student added successfully!');
    }

    readFileAsBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    async updateStudent(id) {
        const photoFile = document.getElementById('photo').files[0];
        let photoBase64 = null;
        if (photoFile) {
            photoBase64 = await this.readFileAsBase64(photoFile);
        }

        const student = this.students.find(s => s.id === id);
        if (student) {
            student.rollNo = document.getElementById('rollNo').value;
            student.name = document.getElementById('studentName').value;
            student.class = document.getElementById('studentClass').value;
            student.section = document.getElementById('section').value || '';
            student.dob = document.getElementById('dob').value;
            if (photoBase64) student.photo = photoBase64;
            student.parentName = document.getElementById('parentName').value;
            student.parentContact = document.getElementById('parentContact').value;
            student.address = document.getElementById('address').value;
            student.aadhar = document.getElementById('aadhar').value;
            student.bloodGroup = document.getElementById('bloodGroup').value;
            student.emergencyContact = document.getElementById('emergencyContact').value;
            localStorage.setItem('students', JSON.stringify(this.students));
            this.loadStudents();
            this.loadDashboardData();
            this.hideAddStudentForm();
            this.currentEditingStudent = null;
            document.querySelector('#studentForm button[type="submit"]').textContent = 'Add Student';
            this.addActivity(`Student ${student.name} updated`);
            alert('Student updated successfully!');
        }
    }

    editStudent(id) {
        const student = this.students.find(s => s.id === id);
        if (student) {
            document.getElementById('rollNo').value = student.rollNo;
            document.getElementById('studentName').value = student.name;
            document.getElementById('studentClass').value = student.class;
            document.getElementById('section').value = student.section || '';
            document.getElementById('dob').value = student.dob || '';
            document.getElementById('parentName').value = student.parentName;
            document.getElementById('parentContact').value = student.parentContact || student.contact || '';
            document.getElementById('address').value = student.address || '';
            document.getElementById('aadhar').value = student.aadhar || '';
            document.getElementById('bloodGroup').value = student.bloodGroup || '';
            document.getElementById('emergencyContact').value = student.emergencyContact || '';
            // For photo, show preview if exists
            if (student.photo) {
                const img = document.createElement('img');
                img.src = student.photo;
                img.style.width = '100px';
                img.style.height = '100px';
                img.style.display = 'block';
                img.style.marginTop = '5px';
                const photoInput = document.getElementById('photo');
                photoInput.parentNode.appendChild(img);
            }
            document.querySelector('#studentForm button[type="submit"]').textContent = 'Update Student';
            this.currentEditingStudent = id;
            this.showAddStudentForm();
        }
    }

    deleteStudent(id) {
        if (confirm('Are you sure you want to delete this student?')) {
            this.students = this.students.filter(s => s.id !== id);
            localStorage.setItem('students', JSON.stringify(this.students));
            this.loadStudents();
            this.loadDashboardData();
            this.addActivity(`Student deleted`);
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
                        <th>Section</th>
                        <th>DOB</th>
                        <th>Blood Group</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredStudents.map(student => `
                        <tr>
                            <td>${student.rollNo}</td>
                            <td>${student.name}</td>
                            <td>${student.class}</td>
                            <td>${student.section}</td>
                            <td>${student.dob}</td>
                            <td>${student.bloodGroup}</td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="schoolSystem.editStudent(${student.id})">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteStudent(${student.id})">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                                <button class="btn btn-sm btn-success" onclick="schoolSystem.generateIDCard(${student.id})">
                                    <i class="fas fa-id-card"></i> ID Card
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    generateIDCard(id) {
        const student = this.students.find(s => s.id === id);
        if (!student) {
            alert('Student not found!');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ size: [252, 396] }); // ID card size

        // School info from settings
        const schoolName = this.settings.schoolInfo.name || 'School Management System';
        doc.setFontSize(16).text(schoolName, 20, 20);

        // Student photo if available
        if (student.photo) {
            doc.addImage(student.photo, 'JPEG', 150, 20, 80, 100);
        } else {
            doc.rect(150, 20, 80, 100).stroke();
            doc.text('Photo', 170, 60);
        }

        doc.setFontSize(12).text(`Name: ${student.name}`, 20, 140);
        doc.text(`Class: ${student.class} - ${student.section}`, 20, 155);
        doc.text(`Roll No: ${student.rollNo}`, 20, 170);
        doc.text(`DOB: ${student.dob}`, 20, 185);
        doc.text(`Blood Group: ${student.bloodGroup}`, 20, 200);
        doc.text(`Emergency Contact: ${student.emergencyContact}`, 20, 215);
        doc.text(`Parent: ${student.parentName}`, 20, 230);
        doc.text(`Contact: ${student.parentContact}`, 20, 245);

        // ID
        doc.text(`Student ID: ${student.id}`, 20, 280);

        doc.save(`id-card-${student.rollNo}.pdf`);
    }

    showAddTeacherForm() {
        document.getElementById('addTeacherFormContainer').style.display = 'block';
        this.currentEditingTeacher = null;
        document.querySelector('#teacherForm button[type="submit"]').textContent = 'Add Teacher';
    }

    hideAddTeacherForm() {
        document.getElementById('addTeacherFormContainer').style.display = 'none';
        this.clearForm('teacherForm');
    }

    async addTeacher() {
        const photoFile = document.getElementById('teacherPhoto').files[0];
        let photoBase64 = null;
        if (photoFile) {
            photoBase64 = await this.readFileAsBase64(photoFile);
        }

        const teacher = {
            id: Date.now(),
            name: document.getElementById('teacherName').value,
            subject: document.getElementById('subject').value,
            photo: photoBase64,
            contact: document.getElementById('teacherContact').value,
            joiningDate: document.getElementById('joiningDate').value,
            salary: parseFloat(document.getElementById('salary').value),
            experience: document.getElementById('experience').value,
            qualification: document.getElementById('qualification').value
        };
        this.teachers.push(teacher);
        localStorage.setItem('teachers', JSON.stringify(this.teachers));
        this.loadTeachers();
        this.loadDashboardData();
        this.hideAddTeacherForm();
        this.addActivity(`New teacher ${teacher.name} added`);
        alert('Teacher added successfully!');
    }

    async updateTeacher(id) {
        const photoFile = document.getElementById('teacherPhoto').files[0];
        let photoBase64 = null;
        if (photoFile) {
            photoBase64 = await this.readFileAsBase64(photoFile);
        }

        const teacher = this.teachers.find(t => t.id === id);
        if (teacher) {
            teacher.name = document.getElementById('teacherName').value;
            teacher.subject = document.getElementById('subject').value;
            if (photoBase64) teacher.photo = photoBase64;
            teacher.contact = document.getElementById('teacherContact').value;
            teacher.joiningDate = document.getElementById('joiningDate').value;
            teacher.salary = parseFloat(document.getElementById('salary').value);
            teacher.experience = document.getElementById('experience').value;
            teacher.qualification = document.getElementById('qualification').value;
            localStorage.setItem('teachers', JSON.stringify(this.teachers));
            this.loadTeachers();
            this.loadDashboardData();
            this.hideAddTeacherForm();
            this.currentEditingTeacher = null;
            document.querySelector('#teacherForm button[type="submit"]').textContent = 'Add Teacher';
            this.addActivity(`Teacher ${teacher.name} updated`);
            alert('Teacher updated successfully!');
        }
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
            this.currentEditingTeacher = id;
            this.showAddTeacherForm();
        }
    }

    deleteTeacher(id) {
        if (confirm('Are you sure you want to delete this teacher?')) {
            this.teachers = this.teachers.filter(t => t.id !== id);
            localStorage.setItem('teachers', JSON.stringify(this.teachers));
            this.loadTeachers();
            this.loadDashboardData();
            this.addActivity(`Teacher deleted`);
        }
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
                        <th>Joining Date</th>
                        <th>Salary</th>
                        <th>Contact</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredTeachers.map(teacher => `
                        <tr>
                            <td>${teacher.name}</td>
                            <td>${teacher.subject}</td>
                            <td>${teacher.joiningDate}</td>
                            <td>$${teacher.salary}</td>
                            <td>${teacher.contact}</td>
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

    showAddStaffForm() {
        document.getElementById('addStaffFormContainer').style.display = 'block';
        this.currentEditingStaff = null;
        document.querySelector('#staffForm button[type="submit"]').textContent = 'Add Staff';
    }

    hideAddStaffForm() {
        document.getElementById('addStaffFormContainer').style.display = 'none';
        this.clearForm('staffForm');
    }

    addStaff() {
        const staff = {
            id: Date.now(),
            name: document.getElementById('staffName').value,
            department: document.getElementById('staffDepartment').value,
            role: document.getElementById('staffRole').value,
            contact: document.getElementById('staffContact').value,
            salary: parseFloat(document.getElementById('staffSalary').value),
            joinDate: document.getElementById('staffJoinDate').value
        };
        this.staff.push(staff);
        localStorage.setItem('staff', JSON.stringify(this.staff));
        this.loadStaff();
        this.hideAddStaffForm();
        this.addActivity(`New staff ${staff.name} added to ${staff.department}`);
        alert('Staff added successfully!');
    }

    updateStaff(id) {
        const staff = this.staff.find(s => s.id === id);
        if (staff) {
            staff.name = document.getElementById('staffName').value;
            staff.department = document.getElementById('staffDepartment').value;
            staff.role = document.getElementById('staffRole').value;
            staff.contact = document.getElementById('staffContact').value;
            staff.salary = parseFloat(document.getElementById('staffSalary').value);
            staff.joinDate = document.getElementById('staffJoinDate').value;
            localStorage.setItem('staff', JSON.stringify(this.staff));
            this.loadStaff();
            this.hideAddStaffForm();
            this.currentEditingStaff = null;
            document.querySelector('#staffForm button[type="submit"]').textContent = 'Add Staff';
            this.addActivity(`Staff ${staff.name} updated`);
            alert('Staff updated successfully!');
        }
    }

    editStaff(id) {
        const staff = this.staff.find(s => s.id === id);
        if (staff) {
            document.getElementById('staffName').value = staff.name;
            document.getElementById('staffDepartment').value = staff.department;
            document.getElementById('staffRole').value = staff.role;
            document.getElementById('staffContact').value = staff.contact;
            document.getElementById('staffSalary').value = staff.salary;
            document.getElementById('staffJoinDate').value = staff.joinDate;
            document.querySelector('#staffForm button[type="submit"]').textContent = 'Update Staff';
            this.currentEditingStaff = id;
            this.showAddStaffForm();
        }
    }

    deleteStaff(id) {
        if (confirm('Delete this staff member?')) {
            this.staff = this.staff.filter(s => s.id !== id);
            localStorage.setItem('staff', JSON.stringify(this.staff));
            this.loadStaff();
            this.addActivity('Staff member deleted');
        }
    }

    loadStaff() {
        const staffList = document.getElementById('staffList');
        if (!staffList) return;
        const departmentFilter = document.getElementById('departmentFilter');
        const roleFilter = document.getElementById('staffRoleFilter');
        const searchTerm = document.getElementById('staffSearch');
        let filteredStaff = this.staff;

        if (departmentFilter && departmentFilter.value) {
            filteredStaff = filteredStaff.filter(s => s.department === departmentFilter.value);
        }

        if (roleFilter && roleFilter.value) {
            filteredStaff = filteredStaff.filter(s => s.role === roleFilter.value);
        }

        if (searchTerm && searchTerm.value) {
            const term = searchTerm.value.toLowerCase();
            filteredStaff = filteredStaff.filter(s => 
                s.name.toLowerCase().includes(term) || 
                s.role.toLowerCase().includes(term)
            );
        }

        if (filteredStaff.length === 0) {
            staffList.innerHTML = '<p>No staff records. Add your first staff member!</p>';
            return;
        }

        staffList.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Role</th>
                        <th>Contact</th>
                        <th>Salary</th>
                        <th>Join Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredStaff.map(staff => `
                        <tr>
                            <td>${staff.name}</td>
                            <td>${staff.department}</td>
                            <td>${staff.role}</td>
                            <td>${staff.contact}</td>
                            <td>$${staff.salary}</td>
                            <td>${staff.joinDate}</td>
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

    showAddAdmissionForm() {
        document.getElementById('addAdmissionFormContainer').style.display = 'block';
        this.currentEditingAdmission = null;
        document.querySelector('#admissionForm button[type="submit"]').textContent = 'Submit Application';
    }

    hideAddAdmissionForm() {
        document.getElementById('addAdmissionFormContainer').style.display = 'none';
        this.clearForm('admissionForm');
    }

    addAdmission() {
        const admission = {
            id: Date.now(),
            applicationId: document.getElementById('applicationId').value,
            name: document.getElementById('applicantName').value,
            dob: document.getElementById('dob').value,
            applyingClass: document.getElementById('applyingClass').value,
            parentName: document.getElementById('parentNameAdmission').value,
            parentContact: document.getElementById('parentContact').value,
            address: document.getElementById('address').value,
            previousSchool: document.getElementById('previousSchool').value || '',
            documents: document.getElementById('documents').value,
            status: 'pending',
            appliedDate: new Date().toISOString().split('T')[0]
        };
        this.admissions.push(admission);
        localStorage.setItem('admissions', JSON.stringify(this.admissions));
        this.loadAdmissions();
        this.loadDashboardData();
        this.hideAddAdmissionForm();
        this.addActivity(`New admission application submitted for ${admission.name}`);
        alert('Admission application submitted successfully!');
    }

    updateAdmission(id) {
        const admission = this.admissions.find(a => a.id === id);
        if (admission) {
            admission.applicationId = document.getElementById('applicationId').value;
            admission.name = document.getElementById('applicantName').value;
            admission.dob = document.getElementById('dob').value;
            admission.applyingClass = document.getElementById('applyingClass').value;
            admission.parentName = document.getElementById('parentNameAdmission').value;
            admission.parentContact = document.getElementById('parentContact').value;
            admission.address = document.getElementById('address').value;
            admission.previousSchool = document.getElementById('previousSchool').value || '';
            admission.documents = document.getElementById('documents').value;
            localStorage.setItem('admissions', JSON.stringify(this.admissions));
            this.loadAdmissions();
            this.hideAddAdmissionForm();
            this.currentEditingAdmission = null;
            document.querySelector('#admissionForm button[type="submit"]').textContent = 'Submit Application';
            alert('Admission updated successfully!');
        }
    }

    editAdmission(id) {
        const admission = this.admissions.find(a => a.id === id);
        if (admission) {
            document.getElementById('applicationId').value = admission.applicationId;
            document.getElementById('applicantName').value = admission.name;
            document.getElementById('dob').value = admission.dob;
            document.getElementById('applyingClass').value = admission.applyingClass;
            document.getElementById('parentNameAdmission').value = admission.parentName;
            document.getElementById('parentContact').value = admission.parentContact;
            document.getElementById('address').value = admission.address;
            document.getElementById('previousSchool').value = admission.previousSchool;
            document.getElementById('documents').value = admission.documents;
            document.querySelector('#admissionForm button[type="submit"]').textContent = 'Update Application';
            this.currentEditingAdmission = id;
            this.showAddAdmissionForm();
        }
    }

    approveAdmission(id) {
        if (confirm('Approve this admission application? The student will be added to the student list.')) {
            const admission = this.admissions.find(a => a.id === id);
            if (admission) {
                // Optionally add to students
                const student = {
                    id: Date.now() + 1,
                    rollNo: admission.applicationId,
                    name: admission.name,
                    class: admission.applyingClass,
                    parentName: admission.parentName,
                    contact: admission.parentContact
                };
                this.students.push(student);
                localStorage.setItem('students', JSON.stringify(this.students));
                admission.status = 'approved';
                localStorage.setItem('admissions', JSON.stringify(this.admissions));
                this.loadAdmissions();
                this.loadStudents();
                this.loadDashboardData();
                this.addActivity(`Admission approved and student ${admission.name} added`);
                alert('Admission approved and student added!');
            }
        }
    }

    rejectAdmission(id) {
        if (confirm('Reject this admission?')) {
            const admission = this.admissions.find(a => a.id === id);
            if (admission) {
                admission.status = 'rejected';
                localStorage.setItem('admissions', JSON.stringify(this.admissions));
                this.loadAdmissions();
                this.loadDashboardData();
                this.addActivity(`Admission rejected for ${admission.name}`);
                alert('Admission rejected!');
            }
        }
    }

    deleteAdmission(id) {
        if (confirm('Delete this admission application?')) {
            this.admissions = this.admissions.filter(a => a.id !== id);
            localStorage.setItem('admissions', JSON.stringify(this.admissions));
            this.loadAdmissions();
            this.loadDashboardData();
        }
    }

    loadAdmissions() {
        const admissionsList = document.getElementById('admissionsList');
        if (!admissionsList) return;
        const statusFilter = document.getElementById('admissionStatus');
        const classFilter = document.getElementById('admissionClassFilter');
        const searchTerm = document.getElementById('admissionSearch');
        let filteredAdmissions = this.admissions;

        if (statusFilter && statusFilter.value) {
            filteredAdmissions = filteredAdmissions.filter(a => a.status === statusFilter.value);
        }

        if (classFilter && classFilter.value) {
            filteredAdmissions = filteredAdmissions.filter(a => a.applyingClass === classFilter.value);
        }

        if (searchTerm && searchTerm.value) {
            const term = searchTerm.value.toLowerCase();
            filteredAdmissions = filteredAdmissions.filter(a => 
                a.name.toLowerCase().includes(term) || 
                a.applicationId.toLowerCase().includes(term)
            );
        }

        if (filteredAdmissions.length === 0) {
            admissionsList.innerHTML = '<p>No admissions found. Submit your first application!</p>';
            return;
        }

        admissionsList.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Application ID</th>
                        <th>Name</th>
                        <th>Class</th>
                        <th>Status</th>
                        <th>Applied Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredAdmissions.map(admission => `
                        <tr>
                            <td>${admission.applicationId}</td>
                            <td>${admission.name}</td>
                            <td>${admission.applyingClass}</td>
                            <td><span class="status-badge status-${admission.status}">${admission.status.charAt(0).toUpperCase() + admission.status.slice(1)}</span></td>
                            <td>${admission.appliedDate}</td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="schoolSystem.editAdmission(${admission.id})">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                ${admission.status === 'pending' ? `
                                    <button class="btn btn-sm btn-success" onclick="schoolSystem.approveAdmission(${admission.id})">
                                        <i class="fas fa-check"></i> Approve
                                    </button>
                                    <button class="btn btn-sm btn-warning" onclick="schoolSystem.rejectAdmission(${admission.id})">
                                        <i class="fas fa-times"></i> Reject
                                    </button>
                                ` : ''}
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

    showMarkAttendanceForm() {
        document.getElementById('markAttendanceFormContainer').style.display = 'block';
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('attendanceDate').value = today;
        this.currentEditingAttendance = null;
        document.querySelector('#attendanceForm button[type="submit"]').textContent = 'Save Attendance';
    }

    hideMarkAttendanceForm() {
        document.getElementById('markAttendanceFormContainer').style.display = 'none';
        this.clearForm('attendanceForm');
        document.getElementById('studentsAttendanceList').innerHTML = '<p>Select class to load students</p>';
    }

    loadStudentsForAttendance() {
        const className = document.getElementById('attendanceClass').value;
        if (!className) {
            document.getElementById('studentsAttendanceList').innerHTML = '<p>Select class to load students</p>';
            return;
        }
        const classStudents = this.students.filter(s => s.class === className);
        if (classStudents.length === 0) {
            document.getElementById('studentsAttendanceList').innerHTML = '<p>No students in this class</p>';
            return;
        }
        let html = '<h4>Students Attendance</h4><div class="attendance-students">';
        classStudents.forEach(student => {
            html += `
                <label class="attendance-item">
                    <input type="checkbox" name="student_${student.id}" value="${student.id}" checked>
                    ${student.rollNo} - ${student.name}
                </label>
            `;
        });
        html += '</div>';
        document.getElementById('studentsAttendanceList').innerHTML = html;
    }

    saveAttendance() {
        const date = document.getElementById('attendanceDate').value;
        const className = document.getElementById('attendanceClass').value;
        const subject = document.getElementById('attendanceSubject').value;
        const checkboxes = document.querySelectorAll('input[name^="student_"]');
        const attendanceRecord = {
            id: Date.now(),
            date: date,
            class: className,
            subject: subject,
            presentStudents: Array.from(checkboxes)
                .filter(cb => cb.checked)
                .map(cb => parseInt(cb.value)),
            totalStudents: checkboxes.length,
            attendancePercentage: (Array.from(checkboxes).filter(cb => cb.checked).length / checkboxes.length * 100).toFixed(1),
            recordedDate: new Date().toISOString().split('T')[0]
        };
        if (!this.attendance[date]) {
            this.attendance[date] = [];
        }
        this.attendance[date].push(attendanceRecord);
        localStorage.setItem('attendance', JSON.stringify(this.attendance));
        this.loadAttendance();
        this.hideMarkAttendanceForm();
        this.addActivity(`Attendance marked for ${className} on ${date}`);
        alert('Attendance saved successfully!');
    }

    loadAttendance() {
        const attendanceList = document.getElementById('attendanceList');
        if (!attendanceList) return;
        const dateFilter = document.getElementById('attendanceDateFilter');
        const classFilter = document.getElementById('attendanceClassFilter');
        let filteredAttendance = [];
        Object.keys(this.attendance).forEach(date => {
            this.attendance[date].forEach(record => {
                filteredAttendance.push({ ...record, date });
            });
        });

        if (dateFilter && dateFilter.value) {
            filteredAttendance = filteredAttendance.filter(a => a.date === dateFilter.value);
        }

        if (classFilter && classFilter.value) {
            filteredAttendance = filteredAttendance.filter(a => a.class === classFilter.value);
        }

        if (filteredAttendance.length === 0) {
            attendanceList.innerHTML = '<p>No attendance records. Mark your first attendance!</p>';
            return;
        }

        attendanceList.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Class</th>
                        <th>Subject</th>
                        <th>Present</th>
                        <th>Total</th>
                        <th>Percentage</th>
                        <th>Recorded</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredAttendance.map(record => `
                        <tr>
                            <td>${record.date}</td>
                            <td>${record.class}</td>
                            <td>${record.subject}</td>
                            <td>${record.presentStudents.length}</td>
                            <td>${record.totalStudents}</td>
                            <td>${record.attendancePercentage}%</td>
                            <td>${record.recordedDate}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    showAddScheduleForm() {
        document.getElementById('addScheduleFormContainer').style.display = 'block';
        this.currentEditingSchedule = null;
        document.querySelector('#scheduleForm button[type="submit"]').textContent = 'Add Schedule';
    }

    hideAddScheduleForm() {
        document.getElementById('addScheduleFormContainer').style.display = 'none';
        this.clearForm('scheduleForm');
    }

    addSchedule() {
        const schedule = {
            id: Date.now(),
            class: document.getElementById('scheduleClass').value,
            day: document.getElementById('scheduleDay').value,
            period: document.getElementById('schedulePeriod').value,
            subject: document.getElementById('scheduleSubject').value,
            teacherId: parseInt(document.getElementById('scheduleTeacher').value),
            teacher: this.teachers.find(t => t.id === parseInt(document.getElementById('scheduleTeacher').value))?.name || '',
            time: document.getElementById('scheduleTime').value,
            createdDate: new Date().toISOString().split('T')[0]
        };
        this.schedules.push(schedule);
        localStorage.setItem('schedules', JSON.stringify(this.schedules));
        this.loadSchedule();
        this.hideAddScheduleForm();
        this.addActivity(`New schedule added for ${schedule.class} on ${schedule.day}`);
        alert('Schedule added successfully!');
    }

    updateSchedule(id) {
        const schedule = this.schedules.find(s => s.id === id);
        if (schedule) {
            schedule.class = document.getElementById('scheduleClass').value;
            schedule.day = document.getElementById('scheduleDay').value;
            schedule.period = document.getElementById('schedulePeriod').value;
            schedule.subject = document.getElementById('scheduleSubject').value;
            schedule.teacherId = parseInt(document.getElementById('scheduleTeacher').value);
            schedule.teacher = this.teachers.find(t => t.id === parseInt(document.getElementById('scheduleTeacher').value))?.name || '';
            schedule.time = document.getElementById('scheduleTime').value;
            localStorage.setItem('schedules', JSON.stringify(this.schedules));
            this.loadSchedule();
            this.hideAddScheduleForm();
            this.currentEditingSchedule = null;
            document.querySelector('#scheduleForm button[type="submit"]').textContent = 'Add Schedule';
            this.addActivity('Schedule updated');
            alert('Schedule updated successfully!');
        }
    }

    editSchedule(id) {
        const schedule = this.schedules.find(s => s.id === id);
        if (schedule) {
            document.getElementById('scheduleClass').value = schedule.class;
            document.getElementById('scheduleDay').value = schedule.day;
            document.getElementById('schedulePeriod').value = schedule.period;
            document.getElementById('scheduleSubject').value = schedule.subject;
            document.getElementById('scheduleTeacher').value = schedule.teacherId;
            document.getElementById('scheduleTime').value = schedule.time;
            document.querySelector('#scheduleForm button[type="submit"]').textContent = 'Update Schedule';
            this.currentEditingSchedule = id;
            this.showAddScheduleForm();
        }
    }

    deleteSchedule(id) {
        if (confirm('Delete this schedule entry?')) {
            this.schedules = this.schedules.filter(s => s.id !== id);
            localStorage.setItem('schedules', JSON.stringify(this.schedules));
            this.loadSchedule();
            this.addActivity('Schedule entry deleted');
        }
    }

    loadSchedule() {
        const scheduleList = document.getElementById('scheduleList');
        if (!scheduleList) return;
        const classFilter = document.getElementById('scheduleClassFilter');
        const dayFilter = document.getElementById('scheduleDayFilter');
        let filteredSchedules = this.schedules;

        if (classFilter && classFilter.value) {
            filteredSchedules = filteredSchedules.filter(s => s.class === classFilter.value);
        }

        if (dayFilter && dayFilter.value) {
            filteredSchedules = filteredSchedules.filter(s => s.day === dayFilter.value);
        }

        if (filteredSchedules.length === 0) {
            scheduleList.innerHTML = '<p>No schedule entries. Add your first schedule!</p>';
            return;
        }

        // Group by day for better display
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        let html = '<div class="schedule-grid">';
        days.forEach(day => {
            const daySchedules = filteredSchedules.filter(s => s.day === day);
            if (daySchedules.length > 0) {
                html += `<h3>${day.charAt(0).toUpperCase() + day.slice(1)}</h3>`;
                html += '<table class="data-table"><thead><tr><th>Class</th><th>Period</th><th>Subject</th><th>Teacher</th><th>Time</th><th>Actions</th></tr></thead><tbody>';
                daySchedules.forEach(schedule => {
                    html += `
                        <tr>
                            <td>${schedule.class}</td>
                            <td>${schedule.period}</td>
                            <td>${schedule.subject}</td>
                            <td>${schedule.teacher}</td>
                            <td>${schedule.time}</td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="schoolSystem.editSchedule(${schedule.id})">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteSchedule(${schedule.id})">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    `;
                });
                html += '</tbody></table>';
            }
        });
        html += '</div>';
        scheduleList.innerHTML = html;
    }

    showAddPaperForm() {
        document.getElementById('addPaperFormContainer').style.display = 'block';
        this.currentEditingPaper = null;
        document.querySelector('#paperForm button[type="submit"]').textContent = 'Create Paper';
        this.questions = [];
        this.renderQuestions();
    }

    hideAddPaperForm() {
        document.getElementById('addPaperFormContainer').style.display = 'none';
        this.clearForm('paperForm');
        this.questions = [];
        document.getElementById('questionsContainer').innerHTML = '';
    }

    renderQuestions() {
        const container = document.getElementById('questionsContainer');
        if (!container) return;
        if (this.questions.length === 0) {
            container.innerHTML = '<p class="no-data">No questions. Add your first question!</p>';
            return;
        }
        const html = this.questions.map((q, index) => `
            <div class="question-item" style="border: 1px solid #ddd; margin-bottom: 15px; padding: 10px;">
                <h4>Question ${index + 1}</h4>
                <textarea class="question-text" data-index="${index}" placeholder="Enter question text here..." rows="3">${q.text || ''}</textarea>
                <button type="button" class="btn btn-sm btn-danger" onclick="schoolSystem.removeQuestion(${index})">Remove</button>
            </div>
        `).join('');
        container.innerHTML = html;
    }

    addQuestion() {
        this.questions.push({ text: '' });
        this.renderQuestions();
    }

    removeQuestion(index) {
        this.questions.splice(index, 1);
        this.renderQuestions();
    }

    addPaper() {
        const questionTexts = this.questions.map(q => q.text).filter(text => text.trim());
        if (questionTexts.length === 0) {
            alert('Please add at least one question.');
            return;
        }
        const paper = {
            id: Date.now(),
            title: document.getElementById('paperTitle').value,
            class: document.getElementById('paperClass').value,
            subject: document.getElementById('paperSubject').value,
            questions: questionTexts,
            duration: parseInt(document.getElementById('paperDuration').value),
            totalMarks: parseInt(document.getElementById('paperTotalMarks').value),
            createdDate: new Date().toISOString().split('T')[0]
        };
        this.questionPapers.push(paper);
        localStorage.setItem('questionPapers', JSON.stringify(this.questionPapers));
        this.loadExams();
        this.hideAddPaperForm();
        this.addActivity(`New paper "${paper.title}" created for ${paper.class} ${paper.subject}`);
        alert('Paper created successfully!');
    }

    updatePaper(id) {
        const paper = this.questionPapers.find(p => p.id === id);
        if (paper) {
            const questionTexts = this.questions.map(q => q.text).filter(text => text.trim());
            if (questionTexts.length === 0) {
                alert('Please add at least one question.');
                return;
            }
            paper.title = document.getElementById('paperTitle').value;
            paper.class = document.getElementById('paperClass').value;
            paper.subject = document.getElementById('paperSubject').value;
            paper.questions = questionTexts;
            paper.duration = parseInt(document.getElementById('paperDuration').value);
            paper.totalMarks = parseInt(document.getElementById('paperTotalMarks').value);
            localStorage.setItem('questionPapers', JSON.stringify(this.questionPapers));
            this.loadExams();
            this.hideAddPaperForm();
            this.currentEditingPaper = null;
            document.querySelector('#paperForm button[type="submit"]').textContent = 'Create Paper';
            this.addActivity(`Paper "${paper.title}" updated`);
            alert('Paper updated successfully!');
        }
    }

    editPaper(id) {
        const paper = this.questionPapers.find(p => p.id === id);
        if (paper) {
            document.getElementById('paperTitle').value = paper.title;
            document.getElementById('paperClass').value = paper.class;
            document.getElementById('paperSubject').value = paper.subject;
            document.getElementById('paperDuration').value = paper.duration;
            document.getElementById('paperTotalMarks').value = paper.totalMarks;
            document.querySelector('#paperForm button[type="submit"]').textContent = 'Update Paper';
            this.currentEditingPaper = id;
            this.questions = paper.questions || [];
            this.renderQuestions();
            this.showAddPaperForm();
        }
    }

    deletePaper(id) {
        if (confirm('Delete this paper?')) {
            this.questionPapers = this.questionPapers.filter(p => p.id !== id);
            localStorage.setItem('questionPapers', JSON.stringify(this.questionPapers));
            this.loadExams();
            this.addActivity('Paper deleted');
        }
    }

    loadExams() {
        const examsList = document.getElementById('examsList');
        if (!examsList) return;
        const classFilter = document.getElementById('paperClassFilter');
        const subjectFilter = document.getElementById('paperSubjectFilter');
        const typeFilter = document.getElementById('paperTypeFilter');
        const searchTerm = document.getElementById('paperSearch');
        let filteredPapers = this.questionPapers;

        if (classFilter && classFilter.value) {
            filteredPapers = filteredPapers.filter(p => p.class === classFilter.value);
        }

        if (subjectFilter && subjectFilter.value) {
            filteredPapers = filteredPapers.filter(p => p.subject === subjectFilter.value);
        }

        // Type filter removed as per user request

        if (searchTerm && searchTerm.value) {
            const term = searchTerm.value.toLowerCase();
            filteredPapers = filteredPapers.filter(p => 
                p.title.toLowerCase().includes(term) || 
                p.subject.toLowerCase().includes(term)
            );
        }

        if (filteredPapers.length === 0) {
            examsList.innerHTML = '<p>No papers created yet. Create your first paper!</p>';
            return;
        }

        examsList.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Class</th>
                        <th>Subject</th>
                        <th>Type</th>
                        <th>Content</th>
                        <th>Duration</th>
                        <th>Total Marks</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredPapers.map(paper => `
                        <tr>
                            <td>${paper.title}</td>
                            <td>${paper.class}</td>
                            <td>${paper.subject}</td>
                            <td><span class="type-badge">${paper.type}</span></td>
                            <td>Rich Text</td>
                            <td>${paper.duration} min</td>
                            <td>${paper.totalMarks}</td>
                            <td>${paper.createdDate}</td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="schoolSystem.editPaper(${paper.id})">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button class="btn btn-sm btn-success" onclick="schoolSystem.viewPaper(${paper.id})">
                                    <i class="fas fa-eye"></i> View
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="schoolSystem.deletePaper(${paper.id})">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    viewPaper(id) {
        const paper = this.questionPapers.find(p => p.id === id);
        if (paper) {
            let content = '';
            if (paper.questions && paper.questions.length > 0) {
                content = '<ol>' + paper.questions.map(q => `<li>${q}</li>`).join('') + '</ol>';
            } else if (paper.content) {
                content = paper.content;
            } else {
                content = 'No content';
            }
            const newWindow = window.open('', '_blank', 'width=800,height=600');
            newWindow.document.write(`
                <html>
                    <head>
                        <title>${paper.title}</title>
                        <style>
                            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
                            h1, h2, h3 { color: #333; }
                            .header { margin-bottom: 20px; }
                            .info { display: flex; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; }
                            .info div { margin: 5px; }
                            ol { padding-left: 20px; }
                            li { margin-bottom: 10px; }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <h1>${paper.title}</h1>
                            <div class="info">
                                <div><strong>Class:</strong> ${paper.class}</div>
                                <div><strong>Subject:</strong> ${paper.subject}</div>
                                <div><strong>Duration:</strong> ${paper.duration} min</div>
                                <div><strong>Total Marks:</strong> ${paper.totalMarks}</div>
                            </div>
                        </div>
                        <div class="content">${content}</div>
                    </body>
                </html>
            `);
            newWindow.document.close();
        }
    }

    // Stub for loadFees
    showAddFeeRecordForm() {
        document.getElementById('addFeeRecordFormContainer').style.display = 'block';
        this.populateStudentSelect('feeStudent');
    }

    hideAddFeeRecordForm() {
        document.getElementById('addFeeRecordFormContainer').style.display = 'none';
        this.clearForm('feeRecordForm');
    }

    addFeeRecord() {
        const studentId = document.getElementById('feeStudent').value;
        if (!studentId) {
            alert('Please select a student.');
            return;
        }
        const feeRecord = {
            id: Date.now(),
            studentId: parseInt(studentId),
            totalFees: parseFloat(document.getElementById('feeTotal').value),
            paidFees: parseFloat(document.getElementById('feePaid').value),
            pendingFees: parseFloat(document.getElementById('feeTotal').value) - parseFloat(document.getElementById('feePaid').value),
            dueDate: document.getElementById('feeDueDate').value,
            paymentDate: new Date().toISOString().split('T')[0],
            status: document.getElementById('feeStatus').value
        };
        this.feeRecords.push(feeRecord);
        localStorage.setItem('feeRecords', JSON.stringify(this.feeRecords));
        this.loadFeeRecords();
        this.hideAddFeeRecordForm();
        alert('Fee record added successfully!');
    }

    updateFeeRecord(id) {
        const feeRecord = this.feeRecords.find(f => f.id === id);
        if (feeRecord) {
            feeRecord.totalFees = parseFloat(document.getElementById('feeTotal').value);
            feeRecord.paidFees = parseFloat(document.getElementById('feePaid').value);
            feeRecord.pendingFees = feeRecord.totalFees - feeRecord.paidFees;
            feeRecord.dueDate = document.getElementById('feeDueDate').value;
            feeRecord.status = document.getElementById('feeStatus').value;
            localStorage.setItem('feeRecords', JSON.stringify(this.feeRecords));
            this.loadFeeRecords();
            alert('Fee record updated successfully!');
        }
    }

    deleteFeeRecord(id) {
        if (confirm('Are you sure you want to delete this fee record?')) {
            this.feeRecords = this.feeRecords.filter(f => f.id !== id);
            localStorage.setItem('feeRecords', JSON.stringify(this.feeRecords));
            this.loadFeeRecords();
        }
    }

    populateStudentSelect(selectId) {
        const select = document.getElementById(selectId);
        if (!select) return;
        const students = this.students.map(s => `
            <option value="${s.id}">${s.rollNo} - ${s.name} (${s.class})</option>
        `).join('');
        select.innerHTML = '<option value="">Select Student</option>' + students;
    }

    loadFeeRecords() {
        const feesList = document.getElementById('feesList');
        if (!feesList) return;
        let filteredRecords = this.feeRecords;
        const searchTerm = document.getElementById('feeSearch').value.toLowerCase();
        const statusFilter = document.getElementById('feeStatusFilter').value;

        if (searchTerm) {
            filteredRecords = filteredRecords.filter(f => 
                this.students.find(s => s.id === f.studentId && (s.name.toLowerCase().includes(searchTerm) || s.rollNo.toLowerCase().includes(searchTerm) || s.class.toLowerCase().includes(searchTerm)))
            );
        }

        if (statusFilter) {
            filteredRecords = filteredRecords.filter(f => f.status === statusFilter);
        }

        if (filteredRecords.length === 0) {
            feesList.innerHTML = '<p>No fee records found.</p>';
            return;
        }

        const html = filteredRecords.map(record => {
            const student = this.students.find(s => s.id === record.studentId);
            return `
                <tr>
                    <td>${student ? student.name : 'Unknown'}</td>
                    <td>${student ? student.rollNo : 'N/A'}</td>
                    <td>${student ? student.class : 'N/A'}</td>
                    <td>$${record.totalFees}</td>
                    <td>$${record.paidFees}</td>
                    <td>$${record.pendingFees}</td>
                    <td>${record.paymentDate}</td>
                    <td><span class="status-badge status-${record.status}">${record.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="schoolSystem.editFeeRecord(${record.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteFeeRecord(${record.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        feesList.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Roll No</th>
                        <th>Class</th>
                        <th>Total Fees</th>
                        <th>Paid Fees</th>
                        <th>Pending Fees</th>
                        <th>Payment Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${html}
                </tbody>
            </table>
        `;
    }

    editFeeRecord(id) {
        const feeRecord = this.feeRecords.find(f => f.id === id);
        if (feeRecord) {
            document.getElementById('feeStudent').value = feeRecord.studentId;
            document.getElementById('feeTotal').value = feeRecord.totalFees;
            document.getElementById('feePaid').value = feeRecord.paidFees;
            document.getElementById('feeDueDate').value = feeRecord.dueDate;
            document.getElementById('feeStatus').value = feeRecord.status;
            document.querySelector('#feeRecordForm button[type="submit"]').textContent = 'Update Fee Record';
            this.currentEditingFeeRecord = id;
            this.showAddFeeRecordForm();
        }
    }

    downloadFeesReport() {
        // Simple implementation - in real app, use a library like SheetJS
        const filteredRecords = this.feeRecords;
        const csvContent = [
            ['Student Name', 'Roll No', 'Class', 'Total Fees', 'Paid Fees', 'Pending Fees', 'Due Date', 'Status'],
            ...filteredRecords.map(record => {
                const student = this.students.find(s => s.id === record.studentId);
                return [
                    student ? student.name : 'Unknown',
                    student ? student.rollNo : 'N/A',
                    student ? student.class : 'N/A',
                    record.totalFees,
                    record.paidFees,
                    record.pendingFees,
                    record.dueDate,
                    record.status
                ];
            })
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'fees_report.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    }

    // Stub for loadSalaries
    loadSalaries() {
        const salaryList = document.getElementById('salaryList');
        if (!salaryList) return;
        salaryList.innerHTML = '<p>No salary data available.</p>';
    }

    showGenerateReportForm() {
        document.getElementById('generateReportFormContainer').style.display = 'block';
        this.currentEditingReport = null;
        document.querySelector('#reportForm button[type="submit"]').textContent = 'Generate Report Card';
    }

    hideGenerateReportForm() {
        document.getElementById('generateReportFormContainer').style.display = 'none';
        this.clearForm('reportForm');
    }

    generateReportCard() {
        const studentId = parseInt(document.getElementById('reportStudent').value);
        const student = this.students.find(s => s.id === studentId);
        if (!student) {
            alert('Student not found!');
            return;
        }
        const report = {
            id: Date.now(),
            studentId: studentId,
            studentName: student.name,
            rollNo: student.rollNo,
            class: student.class,
            period: document.getElementById('reportPeriod').value,
            year: document.getElementById('reportYear').value,
            generatedDate: new Date().toISOString().split('T')[0],
            grades: this.generateGrades(student.class, document.getElementById('reportPeriod').value), // Basic grades
            overallGpa: this.calculateGPA(this.generateGrades(student.class, document.getElementById('reportPeriod').value)),
            comments: 'Good performance overall. Keep up the good work!'
        };
        this.examResults.push(report); // Using examResults for reports
        localStorage.setItem('examResults', JSON.stringify(this.examResults));
        this.loadReports();
        this.hideGenerateReportForm();
        this.addActivity(`Report card generated for ${student.name} (${report.period})`);
        alert('Report card generated successfully!');
        // Optionally open in new window or download
        this.viewReport(report.id);
    }

    generateGrades(className, period) {
        // Basic mock grades based on class and period
        const subjects = ['Math', 'Science', 'English', 'Social Studies', 'Language'];
        return subjects.map(subject => ({
            subject: subject,
            marks: Math.floor(Math.random() * 40) + 60, // 60-100
            grade: this.getGrade(Math.floor(Math.random() * 40) + 60)
        }));
    }

    getGrade(marks) {
        if (marks >= 90) return 'A+';
        if (marks >= 80) return 'A';
        if (marks >= 70) return 'B';
        if (marks >= 60) return 'C';
        return 'D';
    }

    calculateGPA(grades) {
        const totalPoints = grades.reduce((sum, g) => sum + this.gradeToPoint(g.grade), 0);
        return (totalPoints / grades.length).toFixed(2);
    }

    gradeToPoint(grade) {
        const points = { 'A+': 10, 'A': 9, 'B': 8, 'C': 7, 'D': 6 };
        return points[grade] || 0;
    }

    viewReport(id) {
        const report = this.examResults.find(r => r.id === id);
        if (report) {
            let reportHtml = `
                <h2>Report Card</h2>
                <p><strong>Student:</strong> ${report.studentName} (${report.rollNo})</p>
                <p><strong>Class:</strong> ${report.class}</p>
                <p><strong>Period:</strong> ${report.period} ${report.year}</p>
                <p><strong>Generated:</strong> ${report.generatedDate}</p>
                <h3>Grades:</h3>
                <table>
                    <tr><th>Subject</th><th>Marks</th><th>Grade</th></tr>
                    ${report.grades.map(g => `<tr><td>${g.subject}</td><td>${g.marks}</td><td>${g.grade}</td></tr>`).join('')}
                </table>
                <p><strong>GPA:</strong> ${report.overallGpa}</p>
                <p><strong>Comments:</strong> ${report.comments}</p>
            `;
            const newWindow = window.open('', '_blank');
            newWindow.document.write(`
                <html><head><title>Report Card</title><style>body{font-family:Arial; margin:20px;} table{border-collapse:collapse; width:100%;} th,td{border:1px solid #ddd; padding:8px; text-align:left;} th{background-color:#f2f2f2;}</style></head><body>${reportHtml}</body></html>
            `);
            newWindow.document.close();
        }
    }

    deleteReport(id) {
        if (confirm('Delete this report card?')) {
            this.examResults = this.examResults.filter(r => r.id !== id);
            localStorage.setItem('examResults', JSON.stringify(this.examResults));
            this.loadReports();
            this.addActivity('Report card deleted');
        }
    }

    loadReports() {
        const reportsList = document.getElementById('reportsList');
        if (!reportsList) return;
        const classFilter = document.getElementById('reportClassFilter');
        const periodFilter = document.getElementById('reportPeriodFilter');
        const searchTerm = document.getElementById('reportSearch');
        let filteredReports = this.examResults;

        if (classFilter && classFilter.value) {
            filteredReports = filteredReports.filter(r => r.class === classFilter.value);
        }

        if (periodFilter && periodFilter.value) {
            filteredReports = filteredReports.filter(r => r.period === periodFilter.value);
        }

        if (searchTerm && searchTerm.value) {
            const term = searchTerm.value.toLowerCase();
            filteredReports = filteredReports.filter(r => 
                r.studentName.toLowerCase().includes(term) || 
                r.rollNo.toLowerCase().includes(term)
            );
        }

        if (filteredReports.length === 0) {
            reportsList.innerHTML = '<p>No report cards generated yet. Generate your first report!</p>';
            return;
        }

        reportsList.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Class</th>
                        <th>Period</th>
                        <th>Year</th>
                        <th>GPA</th>
                        <th>Generated</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredReports.map(report => `
                        <tr>
                            <td>${report.rollNo} - ${report.studentName}</td>
                            <td>${report.class}</td>
                            <td>${report.period}</td>
                            <td>${report.year}</td>
                            <td>${report.overallGpa}</td>
                            <td>${report.generatedDate}</td>
                            <td>
                                <button class="btn btn-sm btn-success" onclick="schoolSystem.viewReport(${report.id})">
                                    <i class="fas fa-eye"></i> View
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteReport(${report.id})">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // Stub for loadSettings
    loadSettings() {
        const schoolName = document.getElementById('schoolName');
        if (schoolName) schoolName.value = this.settings.schoolInfo.name;
        // Load other settings...
    }

// Modal functions
function openModal(modalId) {
  document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = 'none';
  }
}

// Quick Actions Button Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  // Add Student Button
  const addStudentBtn = document.querySelector('.quick-actions button:nth-child(1)'); // Adjust selector based on screenshot
  if (addStudentBtn) {
    addStudentBtn.addEventListener('click', () => openModal('studentModal'));
  }

  // New Admission Button
  const newAdmissionBtn = document.querySelector('.quick-actions button:nth-child(2)');
  if (newAdmissionBtn) {
    newAdmissionBtn.addEventListener('click', () => openModal('admissionModal'));
  }

  // Mark Attendance Button
  const markAttendanceBtn = document.querySelector('.quick-actions button:nth-child(3)');
  if (markAttendanceBtn) {
    markAttendanceBtn.addEventListener('click', () => openModal('attendanceModal'));
  }
});

// File to base64 utility
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// Load students for attendance modal
function loadStudentsForAttendance() {
  const className = document.getElementById('attendanceClass').value;
  if (!className) return;
  // Fetch students for the class from API or localStorage
  // For now, use localStorage example
  const classStudents = this.students.filter(s => s.class === className);
  const container = document.getElementById('studentsAttendanceList');
  if (container) {
    container.innerHTML = classStudents.map(student => `
      <label class="attendance-item">
        <input type="checkbox" name="student_${student.id}" value="${student.id}" checked>
        ${student.name}
      </label>
    `).join('');
  }
}

// Enhanced form handler with validation and API calls
async function handleFormSubmit(e) {
  e.preventDefault();
  const formId = e.target.id;

  if (formId === 'studentForm') {
    const formData = {
      name: document.getElementById('studentName').value,
      photo: document.getElementById('photo').files[0] ? await fileToBase64(document.getElementById('photo').files[0]) : null,
      dob: document.getElementById('dob').value,
      class: document.getElementById('studentClass').value,
      section: document.getElementById('section').value,
      parentName: document.getElementById('parentName').value,
      parentContact: document.getElementById('parentContact').value,
      address: document.getElementById('address').value,
      aadhar: document.getElementById('aadhar').value,
      bloodGroup: document.getElementById('bloodGroup').value,
      emergencyContact: document.getElementById('emergencyContact').value
    };

    // Validation
    if (!formData.name || !formData.dob || !formData.class || !formData.parentName || !formData.parentContact || !formData.address) {
      alert('Please fill all required fields!');
      return;
    }

    try {
      // Save to backend API
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert('Student added successfully!');
        closeModal('studentModal');
        // Update UI
        loadStudents();
        loadDashboardData();
      } else {
        throw new Error('Failed to add student');
      }
    } catch (error) {
      alert('Error adding student: ' + error.message);
    }
  } else if (formId === 'admissionForm') {
    const formData = {
      name: document.getElementById('applicantName').value,
      dob: document.getElementById('admissionDob').value,
      applyingClass: document.getElementById('applyingClass').value,
      parentName: document.getElementById('parentNameAdmission').value,
      parentContact: document.getElementById('parentContactAdmission').value,
      address: document.getElementById('addressAdmission').value
    };

    if (!formData.name || !formData.dob || !formData.applyingClass || !formData.parentName || !formData.parentContact || !formData.address) {
      alert('Please fill all required fields!');
      return;
    }

    try {
      const response = await fetch('/api/admissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert('Admission submitted successfully!');
        closeModal('admissionModal');
        loadAdmissions();
        loadDashboardData();
      } else {
        throw new Error('Failed to submit admission');
      }
    } catch (error) {
      alert('Error submitting admission: ' + error.message);
    }
  } else if (formId === 'attendanceForm') {
    const date = document.getElementById('attendanceDate').value;
    const className = document.getElementById('attendanceClass').value;
    if (!date || !className) {
      alert('Please select date and class!');
      return;
    }

    const attendanceData = {
      date,
      class: className,
      students: Array.from(document.querySelectorAll('input[name^="student_"]:checked')).map(cb => ({
        studentId: cb.value,
        status: 'present'
      }))
    };

    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendanceData)
      });
      if (response.ok) {
        alert('Attendance marked successfully!');
        closeModal('attendanceModal');
        loadAttendance();
        loadDashboardData();
      } else {
        throw new Error('Failed to mark attendance');
      }
    } catch (error) {
      alert('Error marking attendance: ' + error.message);
    }
  }
}

// Load functions with API calls
async function loadStudents() {
  try {
    const response = await fetch('/api/students');
    const students = await response.json();
    // Update table (assume #studentsTable exists)
    const tbody = document.querySelector('#studentsTable tbody') || document.querySelector('#studentsList tbody');
    if (tbody) {
      tbody.innerHTML = students.map(student => `
        <tr>
          <td>${student.rollNo || student.id}</td>
          <td>${student.name}</td>
          <td>${student.class}</td>
          <td>${student.section || ''}</td>
          <td>${student.dob}</td>
          <td>${student.bloodGroup || ''}</td>
          <td>
            <button onclick="schoolSystem.editStudent(${student.id})">Edit</button>
            <button onclick="schoolSystem.deleteStudent(${student.id})">Delete</button>
            <button onclick="schoolSystem.generateIDCard(${student.id})">ID Card</button>
          </td>
        </tr>
      `).join('');
    }
  } catch (error) {
    console.error('Error loading students:', error);
  }
}

async function loadAdmissions() {
  try {
    const response = await fetch('/api/admissions');
    const admissions = await response.json();
    const tbody = document.querySelector('#admissionsTable tbody') || document.querySelector('#admissionsList tbody');
    if (tbody) {
      tbody.innerHTML = admissions.map(admission => `
        <tr>
          <td>${admission.applicationId}</td>
          <td>${admission.name}</td>
          <td>${admission.applyingClass}</td>
          <td>${admission.status}</td>
          <td>${admission.appliedDate}</td>
          <td>
            <button onclick="schoolSystem.editAdmission(${admission.id})">Edit</button>
            <button onclick="schoolSystem.deleteAdmission(${admission.id})">Delete</button>
          </td>
        </tr>
      `).join('');
    }
  } catch (error) {
    console.error('Error loading admissions:', error);
  }
}

async function loadAttendance() {
  try {
    const response = await fetch('/api/attendance');
    const attendance = await response.json();
    const tbody = document.querySelector('#attendanceTable tbody') || document.querySelector('#attendanceList tbody');
    if (tbody) {
      tbody.innerHTML = attendance.map(record => `
        <tr>
          <td>${record.date}</td>
          <td>${record.class}</td>
          <td>${record.students ? record.students.length : 0} present</td>
          <td>
            <button onclick="viewAttendanceDetail(${record.id})">View</button>
          </td>
        </tr>
      `).join('');
    }
  } catch (error) {
    console.error('Error loading attendance:', error);
  }
}

// Dashboard data load
async function loadDashboardData() {
  try {
    // Total Students
    const studentsRes = await fetch('/api/students/count');
    const studentsData = await studentsRes.json();
    document.getElementById('totalStudents').textContent = studentsData.count;

    // Pending Admissions
    const admissionsRes = await fetch('/api/admissions/pending');
    const admissionsData = await admissionsRes.json();
    document.getElementById('pendingAdmissions').textContent = admissionsData.count;

    // Attendance Records (assume element exists)
    const attendanceRes = await fetch('/api/attendance/count');
    const attendanceData = await attendanceRes.json();
    const attendanceEl = document.getElementById('totalAttendanceRecords') || document.querySelector('.attendance-count');
    if (attendanceEl) attendanceEl.textContent = attendanceData.count;
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
}

}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadStudents();
  loadAdmissions();
  loadAttendance();
  loadDashboardData();
});

const schoolSystem = new SchoolManagementSystem();
