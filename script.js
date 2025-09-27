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
        
        // Settings Forms
        document.getElementById('schoolInfoForm').addEventListener('submit', (e) => this.saveSchoolInfo(e));
        document.getElementById('systemPrefsForm').addEventListener('submit', (e) => this.saveSystemPreferences(e));
        document.getElementById('securityForm').addEventListener('submit', (e) => this.saveSecuritySettings(e));

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
        const teacherName = document.getElementById('teacherName').value;
        const fatherName = document.getElementById('fatherName').value;
        const dob = document.getElementById('teacherDOB').value;
        const aadharNumber = document.getElementById('aadharNumber').value;
        const subject = document.getElementById('subjectSpecialization').value;
        const experience = document.getElementById('yearsOfExperience').value;
        const email = document.getElementById('teacherEmail').value;
        const contact = document.getElementById('teacherContact').value;
        const address = document.getElementById('teacherAddress').value;
        const qualification = document.getElementById('qualification').value;

        // Validate required fields
        if (!teacherName || !fatherName || !dob || !aadharNumber || !subject || !experience || !contact || !address) {
            alert('Please fill in all required fields marked with *');
            return;
        }

        // Validate Aadhar number (must be 12 digits)
        if (!/^\d{12}$/.test(aadharNumber)) {
            alert('Aadhar number must be exactly 12 digits');
            return;
        }

        // Validate DOB (must be valid date and not in future)
        const dobDate = new Date(dob);
        const today = new Date();
        if (dobDate >= today) {
            alert('Date of Birth must be in the past');
            return;
        }

        // Validate experience (must be between 0 and 50)
        const expNum = parseInt(experience);
        if (expNum < 0 || expNum > 50) {
            alert('Years of experience must be between 0 and 50');
            return;
        }

        const teacherData = {
            id: document.getElementById('teacherId').value || Date.now(),
            name: teacherName,
            fatherName: fatherName,
            dob: dob,
            aadharNumber: aadharNumber,
            subject: subject,
            experience: expNum,
            email: email,
            contact: contact,
            address: address,
            qualification: qualification,
            joinDate: new Date().toISOString()
        };

        // Check if editing existing teacher or adding new
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
        const teacherName = document.getElementById('teacherName').value;
        const fatherName = document.getElementById('fatherName').value;
        const dob = document.getElementById('teacherDOB').value;
        const aadharNumber = document.getElementById('aadharNumber').value;
        const subject = document.getElementById('subjectSpecialization').value;
        const experience = document.getElementById('yearsOfExperience').value;
        const email = document.getElementById('teacherEmail').value;
        const contact = document.getElementById('teacherContact').value;
        const address = document.getElementById('teacherAddress').value;
        const qualification = document.getElementById('qualification').value;

        // Validate required fields
        if (!teacherName || !fatherName || !dob || !aadharNumber || !subject || !experience || !contact || !address) {
            alert('Please fill in all required fields marked with *');
            return;
        }

        // Validate Aadhar number (must be 12 digits)
        if (!/^\d{12}$/.test(aadharNumber)) {
            alert('Aadhar number must be exactly 12 digits');
            return;
        }

        // Validate DOB (must be valid date and not in future)
        const dobDate = new Date(dob);
        const today = new Date();
        if (dobDate >= today) {
            alert('Date of Birth must be in the past');
            return;
        }

        // Validate experience (must be between 0 and 50)
        const expNum = parseInt(experience);
        if (expNum < 0 || expNum > 50) {
            alert('Years of experience must be between 0 and 50');
            return;
        }

        const teacherData = {
            id: document.getElementById('teacherId').value || Date.now(),
            name: teacherName,
            fatherName: fatherName,
            dob: dob,
            aadharNumber: aadharNumber,
            subject: subject,
            experience: expNum,
            email: email,
            contact: contact,
            address: address,
            qualification: qualification,
            joinDate: new Date().toISOString()
        };

        // Check if editing existing teacher or adding new
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

    // API Integration Methods (for future backend connection)
    async saveTeacherToBackend(teacherData) {
        try {
            const response = await fetch('/api/teachers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(teacherData)
            });

            if (!response.ok) {
                throw new Error('Failed to save teacher to backend');
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error saving teacher to backend:', error);
            throw error;
        }
    }

    async fetchTeachersFromBackend() {
        try {
            const response = await fetch('/api/teachers');

            if (!response.ok) {
                throw new Error('Failed to fetch teachers from backend');
            }

            const teachers = await response.json();
            return teachers;
        } catch (error) {
            console.error('Error fetching teachers from backend:', error);
            throw error;
        }
    }

    // Admission Management
    handleAdmission(e) {
        e.preventDefault();

        const studentName = document.getElementById('studentName').value;
        const studentClass = document.getElementById('admissionClass').value;
        const parentName = document.getElementById('parentName').value;
        const contactNumber = document.getElementById('contactNumber').value;
        const email = document.getElementById('email').value;
        const dateOfBirth = document.getElementById('dateOfBirth').value;
        const address = document.getElementById('address').value;
        const previousSchool = document.getElementById('previousSchool').value;

        // Validate required fields
        if (!studentName || !studentClass || !parentName || !contactNumber || !dateOfBirth || !address) {
            alert('Please fill in all required fields marked with *');
            return;
        }

        // Generate roll number
        const rollNumber = this.generateRollNumber(studentClass);

        // Create student record directly from admission form
        const studentData = {
            id: Date.now(),
            name: studentName,
            class: studentClass,
            rollNo: rollNumber,
            dateOfBirth: dateOfBirth,
            parentName: parentName,
            contact: contactNumber,
            email: email,
            address: address,
            previousSchool: previousSchool,
            admissionDate: new Date().toISOString(),
            admissionType: 'direct' // Mark as directly admitted
        };

        // Add to students
        this.students.push(studentData);
        localStorage.setItem('students', JSON.stringify(this.students));

        // Also save to admissions for record keeping
        const admissionData = {
            id: Date.now(),
            studentName: studentName,
            class: studentClass,
            parentName: parentName,
            contactNumber: contactNumber,
            email: email,
            dateOfBirth: dateOfBirth,
            address: address,
            previousSchool: previousSchool,
            applicationDate: new Date().toISOString(),
            status: 'approved', // Auto-approved for direct admission
            rollNumber: rollNumber,
            admissionType: 'direct'
        };

        this.admissions.push(admissionData);
        localStorage.setItem('admissions', JSON.stringify(this.admissions));

        this.addActivity(`Direct admission: ${studentName} enrolled in class ${studentClass} with Roll No: ${rollNumber}`);

        document.getElementById('admissionForm').reset();
        this.loadDashboardData();
        this.populateClassFilters(); // Refresh class filters with new student

        alert(`Student ${studentName} has been successfully enrolled!\nRoll Number: ${rollNumber}\nClass: ${studentClass}`);
    }

    showAdmissionTab(tabName) {
        // Hide all tab contents
        document.querySelectorAll('.admission-tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Remove active class from all tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab content
        document.getElementById(tabName + 'AdmissionForm').classList.add('active');
        document.querySelector(`[onclick="showAdmissionTab('${tabName}')"]`).classList.add('active');

        // Load tab-specific data
        this.loadAdmissionTabData(tabName);
    }

    loadAdmissionTabData(tabName) {
        switch(tabName) {
            case 'pending':
                this.loadPendingAdmissions();
                break;
            case 'processed':
                this.loadProcessedAdmissions();
                break;
            case 'recycle':
                this.loadRecycleBin();
                break;
        }
    }

    loadPendingAdmissions() {
        const pendingAdmissions = this.admissions.filter(a => a.status === 'pending');
        const pendingList = document.getElementById('pendingAdmissionsList');
        
        if (pendingAdmissions.length === 0) {
            pendingList.innerHTML = '<p>No pending admissions to review.</p>';
            return;
        }

        pendingList.innerHTML = pendingAdmissions.map(admission => `
            <div class="admission-card">
                <div class="admission-header">
                    <div class="admission-info">
                        <h4>${admission.studentName}</h4>
                        <div class="admission-meta">
                            <span><i class="fas fa-calendar"></i> ${this.formatDate(admission.applicationDate)}</span>
                            <span><i class="fas fa-graduation-cap"></i> Class ${admission.class}</span>
                        </div>
                    </div>
                    <div class="admission-status status-pending">Pending</div>
                </div>
                <div class="admission-details">
                    <div class="detail-item">
                        <div class="detail-label">Parent/Guardian</div>
                        <div class="detail-value">${admission.parentName}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Contact</div>
                        <div class="detail-value">${admission.contactNumber}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Email</div>
                        <div class="detail-value">${admission.email || 'Not provided'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Date of Birth</div>
                        <div class="detail-value">${this.formatDate(admission.dateOfBirth)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Address</div>
                        <div class="detail-value">${admission.address}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Previous School</div>
                        <div class="detail-value">${admission.previousSchool || 'Not specified'}</div>
                    </div>
                </div>
                <div class="admission-actions">
                    <button class="btn btn-success btn-sm" onclick="schoolSystem.acceptAdmission(${admission.id})">
                        <i class="fas fa-check"></i> Accept
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="schoolSystem.rejectAdmission(${admission.id})">
                        <i class="fas fa-times"></i> Reject
                    </button>
                </div>
            </div>
        `).join('');

        // Update admission statistics
        this.updateAdmissionStats();
    }

    loadProcessedAdmissions() {
        const processedAdmissions = this.admissions.filter(a => a.status !== 'pending');
        const processedList = document.getElementById('processedAdmissionsList');
        
        if (processedAdmissions.length === 0) {
            processedList.innerHTML = '<p>No processed admissions found.</p>';
            return;
        }

        processedList.innerHTML = processedAdmissions.map(admission => `
            <div class="admission-card ${admission.status}">
                <div class="admission-header">
                    <div class="admission-info">
                        <h4>${admission.studentName}</h4>
                        <div class="admission-meta">
                            <span><i class="fas fa-calendar"></i> ${this.formatDate(admission.applicationDate)}</span>
                            <span><i class="fas fa-graduation-cap"></i> Class ${admission.class}</span>
                        </div>
                    </div>
                    <div class="admission-status status-${admission.status}">${admission.status}</div>
                </div>
                <div class="admission-details">
                    <div class="detail-item">
                        <div class="detail-label">Parent/Guardian</div>
                        <div class="detail-value">${admission.parentName}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Contact</div>
                        <div class="detail-value">${admission.contactNumber}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Status Date</div>
                        <div class="detail-value">${this.formatDate(admission.processedDate)}</div>
                    </div>
                    ${admission.status === 'accepted' ? `
                        <div class="detail-item">
                            <div class="detail-label">Roll Number</div>
                            <div class="detail-value">${admission.rollNumber || 'Not assigned'}</div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');

        // Update admission statistics
        this.updateAdmissionStats();
    }

    acceptAdmission(admissionId) {
        const admission = this.admissions.find(a => a.id == admissionId);
        if (!admission) return;

        // Generate roll number
        const rollNumber = this.generateRollNumber(admission.class);
        
        // Create student record from admission
        const studentData = {
            id: Date.now(),
            name: admission.studentName,
            class: admission.class,
            rollNo: rollNumber,
            dateOfBirth: admission.dateOfBirth,
            parentName: admission.parentName,
            contact: admission.contactNumber,
            email: admission.email,
            address: admission.address,
            admissionDate: new Date().toISOString(),
            admissionId: admission.id
        };

        // Add to students
        this.students.push(studentData);
        localStorage.setItem('students', JSON.stringify(this.students));

        // Update admission status
        admission.status = 'accepted';
        admission.processedDate = new Date().toISOString();
        admission.rollNumber = rollNumber;
        localStorage.setItem('admissions', JSON.stringify(this.admissions));

        this.addActivity(`Accepted admission: ${admission.studentName} - Roll No: ${rollNumber}`);
        this.loadPendingAdmissions();
        this.loadDashboardData();
        this.populateClassFilters(); // Refresh class filters with new student
        
        alert(`Admission accepted! Student ${admission.studentName} has been enrolled with Roll Number ${rollNumber}`);
    }

    rejectAdmission(admissionId) {
        const admission = this.admissions.find(a => a.id == admissionId);
        if (!admission) return;

        if (confirm(`Are you sure you want to reject the admission application for ${admission.studentName}?`)) {
            // Move to recycle bin instead of just marking as rejected
            this.moveToRecycleBin(admission);

            // Remove from admissions
            this.admissions = this.admissions.filter(a => a.id != admissionId);
            localStorage.setItem('admissions', JSON.stringify(this.admissions));

            this.addActivity(`Moved to recycle bin: ${admission.studentName}`);
            this.loadPendingAdmissions();
            this.loadDashboardData();

            alert(`Admission application for ${admission.studentName} has been moved to Recycle Bin.`);
        }
    }

    moveToRecycleBin(admission) {
        const recycleItem = {
            ...admission,
            movedToRecycle: new Date().toISOString(),
            originalStatus: admission.status
        };

        this.recycleBin.push(recycleItem);
        localStorage.setItem('recycleBin', JSON.stringify(this.recycleBin));
    }

    loadRecycleBin() {
        const recycleList = document.getElementById('recycleBinList');

        if (this.recycleBin.length === 0) {
            recycleList.innerHTML = '<p>Recycle bin is empty.</p>';
            return;
        }

        recycleList.innerHTML = this.recycleBin.map(item => `
            <div class="admission-card recycled">
                <div class="recycled-info">
                    <i class="fas fa-trash"></i>
                    Moved to Recycle Bin on ${this.formatDate(item.movedToRecycle)}
                </div>
                <div class="admission-header">
                    <div class="admission-info">
                        <h4>${item.studentName}</h4>
                        <div class="admission-meta">
                            <span><i class="fas fa-calendar"></i> ${this.formatDate(item.applicationDate)}</span>
                            <span><i class="fas fa-graduation-cap"></i> Class ${item.class}</span>
                        </div>
                    </div>
                    <div class="admission-status status-rejected">Rejected</div>
                </div>
                <div class="admission-details">
                    <div class="detail-item">
                        <div class="detail-label">Parent/Guardian</div>
                        <div class="detail-value">${item.parentName}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Contact</div>
                        <div class="detail-value">${item.contactNumber}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Rejection Date</div>
                        <div class="detail-value">${this.formatDate(item.movedToRecycle)}</div>
                    </div>
                </div>
                <div class="admission-actions">
                    <button class="btn btn-success btn-sm" onclick="schoolSystem.restoreFromRecycleBin(${item.id})">
                        <i class="fas fa-undo"></i> Restore
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="schoolSystem.permanentlyDeleteFromRecycleBin(${item.id})">
                        <i class="fas fa-times"></i> Delete Forever
                    </button>
                </div>
            </div>
        `).join('');

        // Update recycle bin count
        document.getElementById('recycleCount').textContent = this.recycleBin.length;
    }

    restoreFromRecycleBin(itemId) {
        const item = this.recycleBin.find(item => item.id == itemId);
        if (!item) return;

        if (confirm(`Do you want to restore the admission application for ${item.studentName} back to pending status?`)) {
            // Restore to admissions with pending status
            const restoredAdmission = {
                ...item,
                status: 'pending',
                restoredDate: new Date().toISOString()
            };

            // Remove restoredDate and movedToRecycle properties
            delete restoredAdmission.restoredDate;
            delete restoredAdmission.movedToRecycle;

            this.admissions.push(restoredAdmission);
            localStorage.setItem('admissions', JSON.stringify(this.admissions));

            // Remove from recycle bin
            this.recycleBin = this.recycleBin.filter(item => item.id != itemId);
            localStorage.setItem('recycleBin', JSON.stringify(this.recycleBin));

            this.addActivity(`Restored from recycle bin: ${item.studentName}`);
            this.loadRecycleBin();
            this.loadDashboardData();

            alert(`Admission application for ${item.studentName} has been restored to pending status.`);
        }
    }

    restoreAllFromRecycleBin() {
        if (this.recycleBin.length === 0) {
            alert('Recycle bin is empty.');
            return;
        }

        if (confirm(`Do you want to restore all ${this.recycleBin.length} items from the recycle bin back to pending status?`)) {
            this.recycleBin.forEach(item => {
                const restoredAdmission = {
                    ...item,
                    status: 'pending',
                    restoredDate: new Date().toISOString()
                };

                delete restoredAdmission.restoredDate;
                delete restoredAdmission.movedToRecycle;

                this.admissions.push(restoredAdmission);
            });

            // Clear recycle bin
            this.recycleBin = [];
            localStorage.setItem('recycleBin', JSON.stringify(this.recycleBin));
            localStorage.setItem('admissions', JSON.stringify(this.admissions));

            this.addActivity(`Restored all items from recycle bin (${this.recycleBin.length} items)`);
            this.loadRecycleBin();
            this.loadDashboardData();

            alert(`All ${this.recycleBin.length} items have been restored to pending status.`);
        }
    }

    permanentlyDeleteFromRecycleBin(itemId) {
        const item = this.recycleBin.find(item => item.id == itemId);
        if (!item) return;

        if (confirm(`Are you sure you want to permanently delete the admission application for ${item.studentName}? This action cannot be undone.`)) {
            this.recycleBin = this.recycleBin.filter(item => item.id != itemId);
            localStorage.setItem('recycleBin', JSON.stringify(this.recycleBin));

            this.addActivity(`Permanently deleted: ${item.studentName}`);
            this.loadRecycleBin();

            alert(`Admission application for ${item.studentName} has been permanently deleted.`);
        }
    }

    emptyRecycleBin() {
        if (this.recycleBin.length === 0) {
            alert('Recycle bin is already empty.');
            return;
        }

        if (confirm(`Are you sure you want to permanently delete all ${this.recycleBin.length} items from the recycle bin? This action cannot be undone.`)) {
            this.recycleBin = [];
            localStorage.setItem('recycleBin', JSON.stringify(this.recycleBin));

            this.addActivity(`Emptied recycle bin (${this.recycleBin.length} items permanently deleted)`);
            this.loadRecycleBin();

            alert(`Recycle bin has been emptied. All ${this.recycleBin.length} items have been permanently deleted.`);
        }
    }

    generateRollNumber(studentClass) {
        // Get existing students in the same class
        const classStudents = this.students.filter(s => s.class === studentClass);
        const nextNumber = classStudents.length + 1;
        return `${studentClass}${nextNumber.toString().padStart(3, '0')}`;
    }

    filterProcessedAdmissions() {
        const filterValue = document.getElementById('processedFilter').value;
        const searchTerm = document.getElementById('processedSearch').value.toLowerCase();
        
        let filteredAdmissions = this.admissions.filter(a => a.status !== 'pending');

        if (filterValue) {
            filteredAdmissions = filteredAdmissions.filter(a => a.status === filterValue);
        }

        if (searchTerm) {
            filteredAdmissions = filteredAdmissions.filter(a => 
                a.studentName.toLowerCase().includes(searchTerm) ||
                a.parentName.toLowerCase().includes(searchTerm) ||
                a.contactNumber.includes(searchTerm)
            );
        }

        const processedList = document.getElementById('processedAdmissionsList');
        if (filteredAdmissions.length === 0) {
            processedList.innerHTML = '<p>No processed admissions match your criteria.</p>';
            return;
        }

        processedList.innerHTML = filteredAdmissions.map(admission => `
            <div class="admission-card ${admission.status}">
                <div class="admission-header">
                    <div class="admission-info">
                        <h4>${admission.studentName}</h4>
                        <div class="admission-meta">
                            <span><i class="fas fa-calendar"></i> ${this.formatDate(admission.applicationDate)}</span>
                            <span><i class="fas fa-graduation-cap"></i> Class ${admission.class}</span>
                        </div>
                    </div>
                    <div class="admission-status status-${admission.status}">${admission.status}</div>
                </div>
                <div class="admission-details">
                    <div class="detail-item">
                        <div class="detail-label">Parent/Guardian</div>
                        <div class="detail-value">${admission.parentName}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Contact</div>
                        <div class="detail-value">${admission.contactNumber}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Status Date</div>
                        <div class="detail-value">${this.formatDate(admission.processedDate)}</div>
                    </div>
                    ${admission.status === 'accepted' ? `
                        <div class="detail-item">
                            <div class="detail-label">Roll Number</div>
                            <div class="detail-value">${admission.rollNumber || 'Not assigned'}</div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    updateAdmissionStats() {
        const pendingCount = this.admissions.filter(a => a.status === 'pending').length;
        const acceptedCount = this.admissions.filter(a => a.status === 'accepted').length;
        const rejectedCount = this.admissions.filter(a => a.status === 'rejected').length;

        document.getElementById('pendingCount').textContent = pendingCount;
        document.getElementById('acceptedCount').textContent = acceptedCount;
        document.getElementById('rejectedCount').textContent = rejectedCount;
    }

    // Attendance Management
    loadAttendance() {
        const attendanceClass = document.getElementById('attendanceClass');
        const attendanceDate = document.getElementById('attendanceDate');
        
        // Populate class dropdown
        const classes = [...new Set(this.students.map(s => s.class))];
        attendanceClass.innerHTML = '<option value="">Select Class</option>' + 
            classes.map(cls => `<option value="${cls}">${cls}</option>`).join('');
    }

    loadAttendanceSheet() {
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

    showPaperCreator() {
        document.getElementById('paperModalTitle').textContent = 'Create Question Paper';
        document.getElementById('paperTitle').value = '';
        document.getElementById('paperSubject').value = '';
        document.getElementById('paperClass').value = '';
        document.getElementById('paperDuration').value = '';
        document.getElementById('paperTotalMarks').value = '';
        document.getElementById('paperInstructions').value = '';
        document.getElementById('paperEditor').innerHTML = '';
        document.getElementById('paperCreatorModal').style.display = 'block';
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
            alert('Please fill in all required fields (Title, Subject, Class)');
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

    // Rich Text Editor Functions
    formatText(command, value = null) {
        document.execCommand(command, false, value);
        document.getElementById('paperEditor').focus();
    }

    addQuestion() {
        const editor = document.getElementById('paperEditor');
        const questionNumber = editor.querySelectorAll('.question-number').length + 1;

        const questionTemplate = `
            <div class="question-template">
                <div class="question-number">Question ${questionNumber}:</div>
                <div class="question-text" contenteditable="true">Enter your question here...</div>
                <ol class="options-list">
                    <li><span class="option-letter">A)</span> <span contenteditable="true">Option A</span></li>
                    <li><span class="option-letter">B)</span> <span contenteditable="true">Option B</span></li>
                    <li><span class="option-letter">C)</span> <span contenteditable="true">Option C</span></li>
                    <li><span class="option-letter">D)</span> <span contenteditable="true">Option D</span></li>
                </ol>
                <div class="correct-answer">Correct Answer: <span contenteditable="true">A</span></div>
            </div>
        `;

        editor.innerHTML += questionTemplate;
        editor.focus();
    }

    insertTable() {
        const editor = document.getElementById('paperEditor');
        const tableHTML = `
            <table border="1" style="border-collapse: collapse; width: 100%; margin: 15px 0;">
                <thead>
                    <tr>
                        <th contenteditable="true">Column 1</th>
                        <th contenteditable="true">Column 2</th>
                        <th contenteditable="true">Column 3</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td contenteditable="true">Row 1, Col 1</td>
                        <td contenteditable="true">Row 1, Col 2</td>
                        <td contenteditable="true">Row 1, Col 3</td>
                    </tr>
                    <tr>
                        <td contenteditable="true">Row 2, Col 1</td>
                        <td contenteditable="true">Row 2, Col 2</td>
                        <td contenteditable="true">Row 2, Col 3</td>
                    </tr>
                </tbody>
            </table>
        `;

        document.execCommand('insertHTML', false, tableHTML);
        editor.focus();
    }

    previewPaper() {
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

        const previewContent = `
            <html>
            <head>
                <title>${title} - Preview</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
                    .paper-title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
                    .paper-meta { font-size: 14px; color: #666; margin-bottom: 20px; }
                    .instructions { background: #f9f9f9; padding: 15px; border-left: 4px solid #667eea; margin-bottom: 30px; }
                    .content { white-space: pre-wrap; }
                    .question { margin-bottom: 20px; }
                    .question-number { font-weight: bold; color: #667eea; }
                    table { border-collapse: collapse; width: 100%; margin: 15px 0; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="paper-title">${title}</div>
                    <div class="paper-meta">
                        Subject: ${subject} | Class: ${classValue} | Duration: ${duration || '120'} minutes | Total Marks: ${totalMarks || '100'}
                    </div>
                </div>
                ${instructions ? `<div class="instructions"><strong>Instructions:</strong><br>${instructions}</div>` : ''}
                <div class="content">${content}</div>
            </body>
            </html>
        `;

        const previewWindow = window.open('', '_blank');
        previewWindow.document.write(previewContent);
        previewWindow.document.close();
    }

    loadExamSchedules() {
        const examsList = document.getElementById('examsList');
        examsList.innerHTML = '<p>Exam scheduling feature coming soon!</p>';
    }

    loadExamResults() {
        const resultsList = document.getElementById('resultsList');
        resultsList.innerHTML = '<p>Exam results feature coming soon!</p>';
    }

    generateReportCards() {
        alert('Report card generation feature coming soon!');
    }

    filterPapers() {
        this.loadPapers();
    }

    // Report Generation
    generateStudentReport() {
        const reportContainer = document.getElementById('reportsContainer');
        const totalStudents = this.students.length;
        const classDistribution = {};
        
        this.students.forEach(student => {
            classDistribution[student.class] = (classDistribution[student.class] || 0) + 1;
        });

        reportContainer.innerHTML = `
            <div class="report-card">
                <h4>Student Report</h4>
                <div class="report-summary">
                    <div class="summary-item">
                        <div class="value">${totalStudents}</div>
                        <div class="label">Total Students</div>
                    </div>
                    ${Object.entries(classDistribution).map(([cls, count]) => `
                        <div class="summary-item">
                            <div class="value">${count}</div>
                            <div class="label">Class ${cls}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    generateAttendanceReport() {
        const reportContainer = document.getElementById('reportsContainer');
        const last7Days = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            last7Days.push(date.toISOString().split('T')[0]);
        }

        let totalPresent = 0;
        let totalStudents = 0;

        last7Days.forEach(date => {
            const dayAttendance = this.attendance[date] || {};
            Object.values(dayAttendance).forEach(status => {
                if (status === 'present') totalPresent++;
                totalStudents++;
            });
        });

        const avgAttendance = totalStudents > 0 ? ((totalPresent / totalStudents) * 100).toFixed(1) : 0;

        reportContainer.innerHTML = `
            <div class="report-card">
                <h4>Attendance Report (Last 7 Days)</h4>
                <div class="report-summary">
                    <div class="summary-item">
                        <div class="value">${totalPresent}</div>
                        <div class="label">Present</div>
                    </div>
                    <div class="summary-item">
                        <div class="value">${totalStudents - totalPresent}</div>
                        <div class="label">Absent</div>
                    </div>
                    <div class="summary-item">
                        <div class="value">${avgAttendance}%</div>
                        <div class="label">Average</div>
                    </div>
                </div>
            </div>
        `;
    }

    generatePerformanceReport() {
        const reportContainer = document.getElementById('reportsContainer');
        reportContainer.innerHTML = `
            <div class="report-card">
                <h4>Performance Report</h4>
                <p>Performance analytics will be implemented with exam results.</p>
            </div>
        `;
    }

    // Staff Management
    showAddStaffForm() {
        alert('Staff management will be implemented next');
    }

    loadStaff() {
        const staffList = document.getElementById('staffList');
        staffList.innerHTML = '<p>Staff management coming soon!</p>';
    }

    filterStaff() {
        // Filter implementation
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

    exportData() {
        const data = {
            students: this.students,
            teachers: this.teachers,
            staff: this.staff,
            admissions: this.admissions,
            attendance: this.attendance,
            exams: this.exams,
            schedules: this.schedules,
            activities: this.activities,
            settings: this.settings,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `school-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.addActivity('Exported school data');
        alert('Data exported successfully!');
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    
                    if (confirm('This will replace all existing data. Are you sure?')) {
                        this.students = data.students || [];
                        this.teachers = data.teachers || [];
                        this.staff = data.staff || [];
                        this.admissions = data.admissions || [];
                        this.attendance = data.attendance || {};
                        this.exams = data.exams || [];
                        this.schedules = data.schedules || {};
                        this.activities = data.activities || [];
                        
                        // Save to localStorage
                        localStorage.setItem('students', JSON.stringify(this.students));
                        localStorage.setItem('teachers', JSON.stringify(this.teachers));
                        localStorage.setItem('staff', JSON.stringify(this.staff));
                        localStorage.setItem('admissions', JSON.stringify(this.admissions));
                        localStorage.setItem('attendance', JSON.stringify(this.attendance));
                        localStorage.setItem('exams', JSON.stringify(this.exams));
                        localStorage.setItem('schedules', JSON.stringify(this.schedules));
                        localStorage.setItem('activities', JSON.stringify(this.activities));
                        
                        this.addActivity('Imported school data');
                        this.loadDashboardData();
                        alert('Data imported successfully!');
                    }
                } catch (error) {
                    alert('Error importing data. Please check the file format.');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    createBackup() {
        const backup = {
            data: {
                students: this.students,
                teachers: this.teachers,
                staff: this.staff,
                admissions: this.admissions,
                attendance: this.attendance,
                exams: this.exams,
                schedules: this.schedules,
                activities: this.activities
            },
            settings: this.settings,
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        };

        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `school-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.addActivity('Created system backup');
        alert('Backup created successfully!');
    }

    clearAllData() {
        if (confirm('This will delete ALL data including students, teachers, attendance, etc. This action cannot be undone. Are you sure?')) {
            if (confirm('Are you absolutely sure? This will permanently delete all school data.')) {
                this.students = [];
                this.teachers = [];
                this.staff = [];
                this.admissions = [];
                this.attendance = {};
                this.exams = [];
                this.schedules = {};
                this.activities = [];
                
                // Clear localStorage
                localStorage.removeItem('students');
                localStorage.removeItem('teachers');
                localStorage.removeItem('staff');
                localStorage.removeItem('admissions');
                localStorage.removeItem('attendance');
                localStorage.removeItem('exams');
                localStorage.removeItem('schedules');
                localStorage.removeItem('activities');
                
                this.addActivity('Cleared all system data');
                this.loadDashboardData();
                alert('All data has been cleared.');
            }
        }
    }

    generateSystemReport() {
        const report = {
            summary: {
                totalStudents: this.students.length,
                totalTeachers: this.teachers.length,
                totalStaff: this.staff.length,
                totalAdmissions: this.admissions.length,
                activitiesCount: this.activities.length
            },
            classDistribution: {},
            attendanceStats: {},
            systemInfo: {
                browser: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language,
                screenResolution: `${screen.width}x${screen.height}`,
                localStorage: this.isLocalStorageAvailable(),
                timestamp: new Date().toISOString()
            }
        };

        // Calculate class distribution
        this.students.forEach(student => {
            report.classDistribution[student.class] = (report.classDistribution[student.class] || 0) + 1;
        });

        // Calculate attendance statistics
        let totalPresent = 0;
        let totalAbsent = 0;
        Object.values(this.attendance).forEach(day => {
            Object.values(day).forEach(status => {
                if (status === 'present') totalPresent++;
                else if (status === 'absent') totalAbsent++;
            });
        });
        report.attendanceStats = { totalPresent, totalAbsent };

        // Create and download report
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `system-report-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('System report generated and downloaded!');
    }

    updateDataCounts() {
        document.getElementById('dataStudentsCount').textContent = this.students.length;
        document.getElementById('dataTeachersCount').textContent = this.teachers.length;
        document.getElementById('dataStaffCount').textContent = this.staff.length;
        document.getElementById('dataAdmissionsCount').textContent = this.admissions.length;
        document.getElementById('storageUsed').textContent = this.calculateStorageSize();
    }

    updateSystemInfo() {
        // Browser info
        const userAgent = navigator.userAgent;
        let browser = 'Unknown';
        if (userAgent.includes('Chrome')) browser = 'Chrome';
        else if (userAgent.includes('Firefox')) browser = 'Firefox';
        else if (userAgent.includes('Safari')) browser = 'Safari';
        else if (userAgent.includes('Edge')) browser = 'Edge';
        document.getElementById('browserInfo').textContent = browser;

        // OS info
        let os = 'Unknown';
        if (userAgent.includes('Windows')) os = 'Windows';
        else if (userAgent.includes('Mac')) os = 'macOS';
        else if (userAgent.includes('Linux')) os = 'Linux';
        else if (userAgent.includes('Android')) os = 'Android';
        else if (userAgent.includes('iOS')) os = 'iOS';
        document.getElementById('osInfo').textContent = os;

        // Screen resolution
        document.getElementById('screenResolution').textContent = `${screen.width}x${screen.height}`;

        // Local storage status
        document.getElementById('localStorageStatus').textContent = this.isLocalStorageAvailable() ? 'Enabled' : 'Disabled';
        document.getElementById('localStorageStatus').className = this.isLocalStorageAvailable() ? 'status-enabled' : 'status-disabled';

        // Last updated
        document.getElementById('lastUpdated').textContent = new Date().toLocaleDateString();
    }

    calculateStorageSize() {
        const total = JSON.stringify({
            students: this.students,
            teachers: this.teachers,
            staff: this.staff,
            admissions: this.admissions,
            attendance: this.attendance,
            exams: this.exams,
            schedules: this.schedules,
            activities: this.activities,
            settings: this.settings
        }).length;
        
        if (total < 1024) return `${total} B`;
        else if (total < 1024 * 1024) return `${(total / 1024).toFixed(1)} KB`;
        else return `${(total / (1024 * 1024)).toFixed(1)} MB`;
    }

    isLocalStorageAvailable() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch {
            return false;
        }
    }

    // Utility Methods
    populateClassFilters() {
        const classes = [...new Set(this.students.map(s => s.class))];
        const classFilter = document.getElementById('classFilter');
        classFilter.innerHTML = '<option value="">All Classes</option>' + 
            classes.map(cls => `<option value="${cls}">${cls}</option>`).join('');
    }

    setCurrentDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('attendanceDate').value = today;
    }

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

    resetForm(formId) {
        document.getElementById(formId).reset();
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }
}

// Global functions for HTML onclick handlers
function showSection(sectionName) {
    schoolSystem.showSection(sectionName);
}

function showAddStudentForm() {
    schoolSystem.showAddStudentForm();
}

function showAddTeacherForm() {
    schoolSystem.showAddTeacherForm();
}

function showCreateExamForm() {
    schoolSystem.showCreateExamForm();
}

function showAddStaffForm() {
    schoolSystem.showAddStaffForm();
}

function generateStudentReport() {
    schoolSystem.generateStudentReport();
}

function generateAttendanceReport() {
    schoolSystem.generateAttendanceReport();
}

function generatePerformanceReport() {
    schoolSystem.generatePerformanceReport();
}

function resetForm(formId) {
    schoolSystem.resetForm(formId);
}

function closeModal(modalId) {
    schoolSystem.closeModal(modalId);
}

function filterStudents() {
    schoolSystem.filterStudents();
}

function filterTeachers() {
    schoolSystem.filterTeachers();
}

function filterStaff() {
    schoolSystem.filterStaff();
}

// Settings global functions
function exportData() {
    schoolSystem.exportData();
}

function importData() {
    schoolSystem.importData();
}

function createBackup() {
    schoolSystem.createBackup();
}

function clearAllData() {
    schoolSystem.clearAllData();
}

function generateSystemReport() {
    schoolSystem.generateSystemReport();
}

// Admission management global functions
function showAdmissionTab(tabName) {
    schoolSystem.showAdmissionTab(tabName);
}

function filterProcessedAdmissions() {
    schoolSystem.filterProcessedAdmissions();
}

// Recycle bin global functions
function emptyRecycleBin() {
    schoolSystem.emptyRecycleBin();
}

function restoreAllFromRecycleBin() {
    schoolSystem.restoreAllFromRecycleBin();
}

// Paper creation global functions
function showPaperCreator() {
    schoolSystem.showPaperCreator();
}

function savePaper() {
    schoolSystem.savePaper();
}

function generatePDF() {
    // This will be called from within the paper creator modal
    // The actual paper ID will be determined from the editor's data attribute
    const editor = document.getElementById('paperEditor');
    const paperId = editor.getAttribute('data-paper-id');
    if (paperId) {
        schoolSystem.generatePDFFromPaper(parseInt(paperId));
    } else {
        // Generate PDF for current paper being created
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
            title, subject, class: classValue, duration, totalMarks, instructions, content
        };

        schoolSystem.generatePDFFromPaperData(paperData);
    }
}

function printPaper() {
    // Similar logic as generatePDF but for printing
    const editor = document.getElementById('paperEditor');
    const paperId = editor.getAttribute('data-paper-id');
    if (paperId) {
        schoolSystem.printPaper(parseInt(paperId));
    } else {
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
            title, subject, class: classValue, duration, totalMarks, instructions, content
        };

        schoolSystem.printPaperData(paperData);
    }
}

function formatText(command, value = null) {
    schoolSystem.formatText(command, value);
}

function addQuestion() {
    schoolSystem.addQuestion();
}

function insertTable() {
    schoolSystem.insertTable();
}

function previewPaper() {
    schoolSystem.previewPaper();
}

function showExamTab(tabName) {
    schoolSystem.showExamTab(tabName);
}

function loadPapers() {
    schoolSystem.loadPapers();
}

function filterPapers() {
    schoolSystem.filterPapers();
}

// Initialize the system when page loads
let schoolSystem;
document.addEventListener('DOMContentLoaded', () => {
    schoolSystem = new SchoolManagementSystem();
    
    // Set current date for attendance
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('attendanceDate').value = today;
});
