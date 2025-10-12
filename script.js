class SchoolManagementSystem {
    constructor() {
        this.students = JSON.parse(localStorage.getItem('students')) || [];
        this.teachers = JSON.parse(localStorage.getItem('teachers')) || [];
        this.staff = JSON.parse(localStorage.getItem('staff')) || [];
        this.admissions = JSON.parse(localStorage.getItem('admissions')) || [];
        this.attendance = JSON.parse(localStorage.getItem('attendance')) || {};
        this.schedules = JSON.parse(localStorage.getItem('schedules')) || [];
        this.questionPapers = JSON.parse(localStorage.getItem('questionPapers')) || [];
        this.examResults = JSON.parse(localStorage.getItem('examResults')) || [];
        this.feeRecords = JSON.parse(localStorage.getItem('feeRecords')) || [];
        this.studentResults = JSON.parse(localStorage.getItem('studentResults')) || [];
        this.examTimeTable = JSON.parse(localStorage.getItem('examTimeTable')) || [];
        this.timeTableInfo = JSON.parse(localStorage.getItem('timeTableInfo')) || {
            title: '',
            session: '',
            instructions: ''
        };
        this.schoolInfo = JSON.parse(localStorage.getItem('schoolInfo')) || {
            name: '',
            logo: '',
            address: '',
            academicYear: ''
        };
        this.settings = JSON.parse(localStorage.getItem('settings')) || {
            schoolInfo: {
                name: 'School Management System'
            },
            preferences: {
                theme: 'light'
            }
        };
        this.activities = JSON.parse(localStorage.getItem('activities')) || [];
        this.questions = [];
        this.currentEditingStudent = null;
        this.salaries = JSON.parse(localStorage.getItem('salaries')) || [];
        this.employees = JSON.parse(localStorage.getItem('employees')) || [];

        this.init();
    }

    init() {
        console.log('School Management System initializing...');
        this.setupEventListeners();
        this.loadDashboardData();
        this.showSection('dashboard');

        // Add direct event listeners to all dashboard buttons
        this.setupDashboardButtons();
        console.log('Dashboard buttons setup completed');
    }

    setupDashboardButtons() {
        // New Admission button
        const newAdmissionBtn = document.querySelector('button[onclick="schoolSystem.showAddAdmissionForm()"]');
        if (newAdmissionBtn) {
            newAdmissionBtn.addEventListener('click', (e) => {
                console.log('New Admission button clicked');
                e.preventDefault();
                this.showAddAdmissionForm();
            });
            console.log('New Admission button event listener added');
        } else {
            console.error('New Admission button not found');
        }

        // Add Student button
        const addStudentBtn = document.querySelector('button[onclick="schoolSystem.showAddStudentForm()"]');
        if (addStudentBtn) {
            addStudentBtn.addEventListener('click', (e) => {
                console.log('Add Student button clicked');
                e.preventDefault();
                this.showAddStudentForm();
            });
            console.log('Add Student button event listener added');
        } else {
            console.error('Add Student button not found');
        }

        // Mark Attendance button
        const markAttendanceBtn = document.querySelector('button[onclick="schoolSystem.showSection(\'attendance\')"]');
        if (markAttendanceBtn) {
            markAttendanceBtn.addEventListener('click', (e) => {
                console.log('Mark Attendance button clicked');
                e.preventDefault();
                this.showSection('attendance');
            });
            console.log('Mark Attendance button event listener added');
        } else {
            console.error('Mark Attendance button not found');
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

        // Form submits
        const studentForm = document.getElementById('studentForm');
        if (studentForm) {
            studentForm.addEventListener('submit', (e) => this.handleStudentForm(e));
        }

        const teacherForm = document.getElementById('teacherForm');
        if (teacherForm) {
            teacherForm.addEventListener('submit', (e) => this.handleTeacherForm(e));
        }

        const admissionForm = document.getElementById('admissionForm');
        if (admissionForm) {
            admissionForm.addEventListener('submit', (e) => this.handleAdmissionForm(e));
        }

        const studentAttendanceForm = document.getElementById('studentAttendanceForm');
        if (studentAttendanceForm) {
            studentAttendanceForm.addEventListener('submit', (e) => this.handleStudentAttendanceForm(e));
        }

        const teacherAttendanceForm = document.getElementById('teacherAttendanceForm');
        if (teacherAttendanceForm) {
            teacherAttendanceForm.addEventListener('submit', (e) => this.handleTeacherAttendanceForm(e));
        }

        const paperForm = document.getElementById('paperForm');
        if (paperForm) {
            paperForm.addEventListener('submit', (e) => this.handlePaperForm(e));
        }

        const feeRecordForm = document.getElementById('feeRecordForm');
        if (feeRecordForm) {
            feeRecordForm.addEventListener('submit', (e) => this.handleFeeRecordForm(e));
        }

        const staffForm = document.getElementById('staffForm');
        if (staffForm) {
            staffForm.addEventListener('submit', (e) => this.handleStaffForm(e));
        }

        const scheduleForm = document.getElementById('scheduleForm');
        if (scheduleForm) {
            scheduleForm.addEventListener('submit', (e) => this.handleScheduleForm(e));
        }

        const resultForm = document.getElementById('resultForm');
        if (resultForm) {
            resultForm.addEventListener('submit', (e) => this.handleResultForm(e));
        }

        // Salary form event listeners
        const addSalaryForm = document.getElementById('addSalaryForm');
        if (addSalaryForm) {
            addSalaryForm.addEventListener('submit', (e) => this.handleAddSalaryForm(e));
        }

        const paySalaryForm = document.getElementById('paySalaryForm');
        if (paySalaryForm) {
            paySalaryForm.addEventListener('submit', (e) => this.handlePaySalaryForm(e));
        }

        const salarySheetForm = document.getElementById('salarySheetForm');
        if (salarySheetForm) {
            salarySheetForm.addEventListener('submit', (e) => this.handleSalarySheetForm(e));
        }

        const salaryReportForm = document.getElementById('salaryReportForm');
        if (salaryReportForm) {
            salaryReportForm.addEventListener('submit', (e) => this.handleSalaryReportForm(e));
        }

        // Schedule form dropdown listeners
        const scheduleClassSelect = document.getElementById('scheduleClass');
        if (scheduleClassSelect) {
            scheduleClassSelect.addEventListener('change', () => this.loadSubjectsForSchedule());
        }

        // Result form dropdown listeners
        const resultClassSelect = document.getElementById('resultClass');
        if (resultClassSelect) {
            resultClassSelect.addEventListener('change', () => this.loadSubjectsForResult());
        }

        // School logo upload listener
        const schoolLogoInput = document.getElementById('schoolLogo');
        if (schoolLogoInput) {
            schoolLogoInput.addEventListener('change', (e) => this.previewSchoolLogo(e));
        }

        // Theme toggle
        const themeSelect = document.getElementById('theme');
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                this.settings.preferences.theme = e.target.value;
                localStorage.setItem('settings', JSON.stringify(this.settings));
                document.body.classList = e.target.value;
            });
        }
    }

    showSection(sectionName) {
        document.querySelectorAll('.section').forEach(section => section.style.display = 'none');
        document.getElementById(sectionName).style.display = 'block';

        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        const navLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (navLink) {
            navLink.classList.add('active');
        }

        this.loadSectionData(sectionName);
    }

    loadSectionData(sectionName) {
        if (sectionName === 'dashboard') {
            this.loadDashboardData();
        } else if (sectionName === 'students') {
            this.loadStudents();
        } else if (sectionName === 'teachers') {
            this.loadTeachers();
        } else if (sectionName === 'staff') {
            this.loadStaff();
        } else if (sectionName === 'schedule') {
            this.loadSchedules();
        } else if (sectionName === 'results') {
            this.loadResults();
        } else if (sectionName === 'timetable') {
            this.loadTimeTable();
        } else if (sectionName === 'admissions') {
            this.loadAdmissions();
        } else if (sectionName === 'exams') {
            this.loadExamPapers();
        } else if (sectionName === 'fees') {
            this.loadFeeRecords();
        } // Add for other sections
    }

    loadDashboardData() {
        document.getElementById('totalStudents').textContent = this.students.length;
        document.getElementById('totalTeachers').textContent = this.teachers.length;
        const pendingAdmissions = this.admissions.filter(a => a.status === 'pending').length;
        document.getElementById('pendingAdmissions').textContent = pendingAdmissions;
    }

    loadStudents() {
        const studentsTableBody = document.getElementById('studentsTableBody');
        if (studentsTableBody) {
            if (this.students.length === 0) {
                studentsTableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="no-data">No students found</td>
                    </tr>
                `;
            } else {
                studentsTableBody.innerHTML = this.students.map(s => `
                    <tr>
                        <td>${s.roll_no || s.rollNo}</td>
                        <td>${s.name}</td>
                        <td>${s.class}</td>
                        <td>${s.section || ''}</td>
                        <td>${s.parent_contact || s.parentContact || ''}</td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="schoolSystem.editStudent(${s.id})">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteStudent(${s.id})">Delete</button>
                        </td>
                    </tr>
                `).join('');
            }
        }
    }

    loadTeachers() {
        const teachersTableBody = document.getElementById('teachersTableBody');
        if (teachersTableBody) {
            if (this.teachers.length === 0) {
                teachersTableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="no-data">No teachers found</td>
                    </tr>
                `;
            } else {
                teachersTableBody.innerHTML = this.teachers.map(t => `
                    <tr>
                        <td>${t.name}</td>
                        <td>${t.subject}</td>
                        <td>${t.contact}</td>
                        <td>${t.joining_date}</td>
                        <td>₹${t.salary}</td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="schoolSystem.editTeacher(${t.id})">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteTeacher(${t.id})">Delete</button>
                        </td>
                    </tr>
                `).join('');
            }
        }
    }

    loadAdmissions() {
        const admissionsTableBody = document.getElementById('admissionsTableBody');
        if (admissionsTableBody) {
            if (this.admissions.length === 0) {
                admissionsTableBody.innerHTML = `
                    <tr>
                        <td colspan="7" class="no-data">No admissions found</td>
                    </tr>
                `;
            } else {
                admissionsTableBody.innerHTML = this.admissions.map(a => `
                    <tr>
                        <td>${a.application_id}</td>
                        <td>${a.applicant_name}</td>
                        <td>${a.applying_class}</td>
                        <td>${a.parent_name}</td>
                        <td>${a.parent_contact}</td>
                        <td>
                            <span class="status-badge status-${a.documents_status}">${a.documents_status}</span>
                        </td>
                        <td>
                            <button class="btn btn-sm btn-success" onclick="schoolSystem.approveAdmission('${a.id}')">Approve</button>
                            <button class="btn btn-sm btn-danger" onclick="schoolSystem.rejectAdmission('${a.id}')">Reject</button>
                            <button class="btn btn-sm btn-primary" onclick="schoolSystem.editAdmission('${a.id}')">Edit</button>
                            <button class="btn btn-sm btn-secondary" onclick="schoolSystem.deleteAdmission('${a.id}')">Delete</button>
                        </td>
                    </tr>
                `).join('');
            }
        }
    }

    handleStudentForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const student = {
            id: Date.now(),
            roll_no: formData.get('roll_no'),
            name: formData.get('name'),
            class: formData.get('class'),
            section: formData.get('section'),
            dob: formData.get('dob'),
            parent_name: formData.get('parent_name'),
            parent_contact: formData.get('parent_contact'),
            address: formData.get('address'),
            aadhar: formData.get('aadhar'),
            blood_group: formData.get('blood_group'),
            emergency_contact: formData.get('emergency_contact')
        };
        this.students.push(student);
        localStorage.setItem('students', JSON.stringify(this.students));
        e.target.reset();
        this.loadStudents();
        alert('Student added!');
    }

    handleTeacherForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const teacher = {
            id: Date.now(),
            name: formData.get('name'),
            subject: formData.get('subject'),
            contact: formData.get('contact'),
            joining_date: formData.get('joining_date'),
            salary: formData.get('salary')
        };
        this.teachers.push(teacher);
        localStorage.setItem('teachers', JSON.stringify(this.teachers));
        e.target.reset();
        this.loadTeachers();
        alert('Teacher added!');

        // Update dashboard
        this.loadDashboardData();
    }

    handleAdmissionForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        // Get selected subjects
        const selectedSubjects = Array.from(document.querySelectorAll('input[name="subjects[]"]:checked')).map(cb => cb.value);

        const admission = {
            id: Date.now().toString(),
            // Student Information
            first_name: formData.get('first_name'),
            last_name: formData.get('last_name'),
            full_name: formData.get('first_name') + ' ' + formData.get('last_name'),
            dob: formData.get('dob'),
            gender: formData.get('gender'),
            nationality: formData.get('nationality'),
            religion: formData.get('religion'),

            // Residential Address
            residential_address: formData.get('residential_address'),
            city: formData.get('city'),
            state: formData.get('state'),
            zip_code: formData.get('zip_code'),

            // Academic Information
            applying_class: formData.get('applying_class'),
            academic_year: formData.get('academic_year'),
            previous_school: formData.get('previous_school'),
            previous_grade: formData.get('previous_grade'),

            // Subjects Interested In
            subjects_interested: selectedSubjects,

            // Parent/Guardian Information
            father_name: formData.get('father_name'),
            mother_name: formData.get('mother_name'),
            father_phone: formData.get('father_phone'),
            mother_phone: formData.get('mother_phone'),
            father_email: formData.get('father_email'),
            mother_email: formData.get('mother_email'),
            father_occupation: formData.get('father_occupation'),
            mother_occupation: formData.get('mother_occupation'),
            emergency_contact: formData.get('emergency_contact'),
            emergency_relationship: formData.get('emergency_relationship'),

            // Medical Information
            blood_group: formData.get('blood_group'),
            allergies: formData.get('allergies'),
            medical_conditions: formData.get('medical_conditions'),
            current_medications: formData.get('current_medications'),
            family_doctor: formData.get('family_doctor'),
            doctor_phone: formData.get('doctor_phone'),
            doctor_address: formData.get('doctor_address'),

            // Additional Information
            special_needs: formData.get('special_needs'),
            extracurricular_interests: formData.get('extracurricular_interests'),
            achievements: formData.get('achievements'),
            additional_info: formData.get('additional_info'),
            referral_source: formData.get('referral_source'),

            // Terms and Conditions
            terms_accepted: formData.get('terms_accepted') === 'on',
            updates_subscribed: formData.get('updates_subscribed') === 'on',

            // System fields
            application_id: 'ADM' + Date.now(),
            documents_status: 'pending',
            status: 'pending',
            submission_date: new Date().toISOString()
        };

        this.admissions.push(admission);
        localStorage.setItem('admissions', JSON.stringify(this.admissions));
        e.target.reset();
        this.loadAdmissions();
        alert('Admission application submitted successfully! Application ID: ' + admission.application_id);

        // Update dashboard
        this.loadDashboardData();
    }

    editStudent(id) {
        // Implement edit logic
        alert('Edit student ' + id);
    }

    deleteStudent(id) {
        this.students = this.students.filter(s => s.id !== id);
        localStorage.setItem('students', JSON.stringify(this.students));
        this.loadStudents();
    }

    editTeacher(id) {
        // Implement edit logic
        alert('Edit teacher ' + id);
    }

    deleteTeacher(id) {
        this.teachers = this.teachers.filter(t => t.id !== id);
        localStorage.setItem('teachers', JSON.stringify(this.teachers));
        this.loadTeachers();
    }

    handleStaffForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const staff = {
            id: Date.now(),
            name: formData.get('staffName'),
            department: formData.get('staffDepartment'),
            role: formData.get('staffRole'),
            contact: formData.get('staffContact'),
            salary: formData.get('staffSalary'),
            join_date: formData.get('staffJoinDate'),
            address: formData.get('staffAddress'),
            email: formData.get('staffEmail'),
            qualification: formData.get('staffQualification'),
            experience: formData.get('staffExperience'),
            emergency_contact: formData.get('staffEmergencyContact'),
            blood_group: formData.get('staffBloodGroup'),
            aadhar: formData.get('staffAadhar')
        };

        this.staff.push(staff);
        localStorage.setItem('staff', JSON.stringify(this.staff));
        e.target.reset();
        this.loadStaff();
        alert('Staff member added successfully!');
    }

    loadStaff() {
        const staffList = document.getElementById('staffList');
        if (staffList) {
            if (this.staff.length === 0) {
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
                            <tr>
                                <td colspan="7" class="no-data">No staff members found</td>
                            </tr>
                        </tbody>
                    </table>
                `;
            } else {
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
                            ${this.staff.map(s => `
                                <tr>
                                    <td>${s.name}</td>
                                    <td>${s.department}</td>
                                    <td>${s.role}</td>
                                    <td>${s.contact}</td>
                                    <td>₹${s.salary}</td>
                                    <td>${new Date(s.join_date).toLocaleDateString()}</td>
                                    <td>
                                        <button class="btn btn-sm btn-primary" onclick="schoolSystem.editStaff('${s.id}')">Edit</button>
                                        <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteStaff('${s.id}')">Delete</button>
                                        <button class="btn btn-sm btn-info" onclick="schoolSystem.viewStaffDetails('${s.id}')">View</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            }
        }
    }

    loadSchedules() {
        const scheduleList = document.getElementById('scheduleList');
        if (scheduleList) {
            if (this.schedules.length === 0) {
                scheduleList.innerHTML = `
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Class</th>
                                <th>Day</th>
                                <th>Period</th>
                                <th>Subject</th>
                                <th>Teacher</th>
                                <th>Time</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="7" class="no-data">No schedules found</td>
                            </tr>
                        </tbody>
                    </table>
                `;
            } else {
                scheduleList.innerHTML = `
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Class</th>
                                <th>Day</th>
                                <th>Period</th>
                                <th>Subject</th>
                                <th>Teacher</th>
                                <th>Time</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.schedules.map(s => `
                                <tr>
                                    <td>${s.class}</td>
                                    <td>${s.day}</td>
                                    <td>${s.period}</td>
                                    <td>${s.subject}</td>
                                    <td>${s.teacher_name}</td>
                                    <td>${s.time}</td>
                                    <td>
                                        <button class="btn btn-sm btn-primary" onclick="schoolSystem.editSchedule('${s.id}')">Edit</button>
                                        <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteSchedule('${s.id}')">Delete</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            }
        }
    }

    loadTeachersForSchedule() {
        const teacherSelect = document.getElementById('scheduleTeacher');
        if (!teacherSelect) return;

        // Clear existing options except the first one
        while (teacherSelect.children.length > 1) {
            teacherSelect.removeChild(teacherSelect.lastChild);
        }

        // Add all teachers to the dropdown
        this.teachers.forEach(teacher => {
            const option = document.createElement('option');
            option.value = teacher.id;
            option.textContent = `${teacher.name} (${teacher.subject})`;
            teacherSelect.appendChild(option);
        });
    }

    loadSubjectsForSchedule() {
        const classSelect = document.getElementById('scheduleClass');
        const subjectSelect = document.getElementById('scheduleSubject');
        if (!classSelect || !subjectSelect) return;

        // Clear existing options except the first one
        while (subjectSelect.children.length > 1) {
            subjectSelect.removeChild(subjectSelect.lastChild);
        }

        const classValue = classSelect.value;
        if (classValue) {
            // Add relevant subjects based on class
            const subjects = this.getSubjectsForClass(classValue);
            subjects.forEach(subject => {
                const option = document.createElement('option');
                option.value = subject;
                option.textContent = subject;
                subjectSelect.appendChild(option);
            });
        }
    }

    handleScheduleForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const schedule = {
            id: Date.now(),
            class: formData.get('scheduleClass'),
            day: formData.get('scheduleDay'),
            period: formData.get('schedulePeriod'),
            subject: formData.get('scheduleSubject'),
            teacher_id: formData.get('scheduleTeacher'),
            time: formData.get('scheduleTime'),
            created_date: new Date().toISOString()
        };

        // Get teacher name for display
        const teacher = this.teachers.find(t => t.id == schedule.teacher_id);
        if (teacher) {
            schedule.teacher_name = teacher.name;
        }

        this.schedules.push(schedule);
        localStorage.setItem('schedules', JSON.stringify(this.schedules));
        e.target.reset();
        this.loadSchedules();
        alert('Schedule added successfully!');
    }

    editSchedule(id) {
        // Implement edit logic
        alert('Edit schedule ' + id);
    }

    deleteSchedule(id) {
        this.schedules = this.schedules.filter(s => s.id !== id);
        localStorage.setItem('schedules', JSON.stringify(this.schedules));
        this.loadSchedules();
    }

    editStaff(id) {
        // Implement edit logic
        alert('Edit staff ' + id);
    }

    deleteStaff(id) {
        this.staff = this.staff.filter(s => s.id !== id);
        localStorage.setItem('staff', JSON.stringify(this.staff));
        this.loadStaff();
    }

    viewStaffDetails(id) {
        const staffMember = this.staff.find(s => s.id == id);
        if (staffMember) {
            const details = `
                <div class="staff-details-modal">
                    <h3>Staff Details</h3>
                    <div class="details-grid">
                        <div class="detail-item">
                            <strong>Name:</strong> ${staffMember.name}
                        </div>
                        <div class="detail-item">
                            <strong>Department:</strong> ${staffMember.department}
                        </div>
                        <div class="detail-item">
                            <strong>Role:</strong> ${staffMember.role}
                        </div>
                        <div class="detail-item">
                            <strong>Contact:</strong> ${staffMember.contact}
                        </div>
                        <div class="detail-item">
                            <strong>Email:</strong> ${staffMember.email || 'N/A'}
                        </div>
                        <div class="detail-item">
                            <strong>Salary:</strong> ₹${staffMember.salary}
                        </div>
                        <div class="detail-item">
                            <strong>Join Date:</strong> ${new Date(staffMember.join_date).toLocaleDateString()}
                        </div>
                        <div class="detail-item">
                            <strong>Address:</strong> ${staffMember.address || 'N/A'}
                        </div>
                        <div class="detail-item">
                            <strong>Qualification:</strong> ${staffMember.qualification || 'N/A'}
                        </div>
                        <div class="detail-item">
                            <strong>Experience:</strong> ${staffMember.experience || 0} years
                        </div>
                        <div class="detail-item">
                            <strong>Blood Group:</strong> ${staffMember.blood_group || 'N/A'}
                        </div>
                        <div class="detail-item">
                            <strong>Aadhar:</strong> ${staffMember.aadhar || 'N/A'}
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-secondary" onclick="schoolSystem.closeStaffModal()">Close</button>
                    </div>
                </div>
            `;

            // Create modal if it doesn't exist
            let modal = document.getElementById('staffModal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'staffModal';
                modal.className = 'modal';
                modal.style.display = 'block';
                document.body.appendChild(modal);
            }

            modal.innerHTML = details;

            // Add modal styles
            if (!document.getElementById('staffModalStyles')) {
                const styles = document.createElement('style');
                styles.id = 'staffModalStyles';
                styles.textContent = `
                    .staff-details-modal {
                        background: white;
                        padding: 20px;
                        border-radius: 8px;
                        max-width: 600px;
                        margin: 20px auto;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    }
                    .details-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 15px;
                        margin: 20px 0;
                    }
                    .detail-item {
                        padding: 8px;
                        border-bottom: 1px solid #eee;
                    }
                    .modal-actions {
                        text-align: center;
                        margin-top: 20px;
                    }
                `;
                document.head.appendChild(styles);
            }
        }
    }

    closeStaffModal() {
        const modal = document.getElementById('staffModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Photo preview functionality for staff form
    setupPhotoPreview() {
        const photoInput = document.getElementById('staffPhoto');
        const previewImg = document.getElementById('previewImg');

        if (photoInput && previewImg) {
            photoInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        previewImg.src = e.target.result;
                        previewImg.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                } else {
                    previewImg.src = '';
                    previewImg.style.display = 'none';
                }
            });
        }
    }

    showAddStudentForm() {
        document.getElementById('addStudentFormContainer').style.display = 'block';
        // Reset form when opening
        const form = document.getElementById('studentForm');
        if (form) form.reset();
    }

    hideAddStudentForm() {
        document.getElementById('addStudentFormContainer').style.display = 'none';
    }

    showAddTeacherForm() {
        document.getElementById('addTeacherFormContainer').style.display = 'block';
    }

    hideAddTeacherForm() {
        document.getElementById('addTeacherFormContainer').style.display = 'none';
    }

    showAddStaffForm() {
        document.getElementById('addStaffFormContainer').style.display = 'block';
    }

    hideAddStaffForm() {
        document.getElementById('addStaffFormContainer').style.display = 'none';
    }

    showAddScheduleForm() {
        document.getElementById('addScheduleFormContainer').style.display = 'block';
        this.loadTeachersForSchedule();
        this.loadSubjectsForSchedule();
    }

    hideAddScheduleForm() {
        document.getElementById('addScheduleFormContainer').style.display = 'none';
    }

    showAddTimeTableForm() {
        document.getElementById('addTimeTableFormContainer').style.display = 'block';
    }

    hideAddTimeTableForm() {
        document.getElementById('addTimeTableFormContainer').style.display = 'none';
    }

    loadSubjectsForTimeTable() {
        const classSelect = document.getElementById('ttClass');
        const subjectsSelection = document.getElementById('subjectsSelection');
        if (!subjectsSelection) return;

        const classValue = classSelect.value;
        if (!classValue) {
            subjectsSelection.innerHTML = '<p class="no-data">Select a class to load subjects</p>';
            return;
        }

        // Get subjects for the selected class
        const subjects = this.getSubjectsForClass(classValue);

        let html = '<div class="subjects-checkbox-grid">';
        subjects.forEach(subject => {
            html += `
                <div class="subject-checkbox-item">
                    <label class="checkbox-label">
                        <input type="checkbox" name="tt_subject" value="${subject}" checked>
                        <span class="checkmark"></span>
                        ${subject}
                    </label>
                </div>
            `;
        });
        html += '</div>';

        subjectsSelection.innerHTML = html;
    }

    handleTimeTableForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const classValue = formData.get('tt_class');
        const examDate = formData.get('tt_exam_date');
        const startTime = formData.get('tt_start_time');
        const endTime = formData.get('tt_end_time');

        // Get selected subjects
        const selectedSubjects = Array.from(document.querySelectorAll('input[name="tt_subject"]:checked')).map(cb => cb.value);

        if (selectedSubjects.length === 0) {
            alert('Please select at least one subject');
            return;
        }

        // Create time table entries for each selected subject
        const timeTableEntries = selectedSubjects.map((subject, index) => {
            const examDateTime = new Date(examDate);
            examDateTime.setDate(examDateTime.getDate() + index); // Spread exams across multiple days

            return {
                id: Date.now() + index,
                class: classValue,
                subject: subject,
                exam_date: examDateTime.toISOString().split('T')[0],
                start_time: startTime,
                end_time: endTime,
                duration: this.calculateDuration(startTime, endTime),
                created_date: new Date().toISOString()
            };
        });

        // Add entries to time table
        this.examTimeTable.push(...timeTableEntries);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        e.target.reset();
        this.loadTimeTable();
        alert('Time table entries created successfully!');
    }

    calculateDuration(startTime, endTime) {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        const diffMinutes = (end - start) / (1000 * 60);
        return diffMinutes;
    }

    saveTimeTableInfo() {
        const title = document.getElementById('timetableTitle').value;
        const session = document.getElementById('examSession').value;
        const instructions = document.getElementById('instructions').value;

        this.timeTableInfo = {
            title: title,
            session: session,
            instructions: instructions
        };

        localStorage.setItem('timeTableInfo', JSON.stringify(this.timeTableInfo));
        alert('Time table information saved successfully!');
    }

    generateTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        const previewWindow = window.open('', '_blank', 'width=1000,height=800');
        const schoolInfo = this.schoolInfo;
        const timeTableInfo = this.timeTableInfo;

        // Group entries by date
        const groupedByDate = {};
        this.examTimeTable.forEach(entry => {
            if (!groupedByDate[entry.exam_date]) {
                groupedByDate[entry.exam_date] = [];
            }
            groupedByDate[entry.exam_date].push(entry);
        });

        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Exam Time Table</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 1000px;
                        margin: 0 auto;
                        padding: 20px;
                        background: white;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 3px solid #333;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .school-logo {
                        max-height: 80px;
                        margin-bottom: 10px;
                    }
                    .school-name {
                        font-size: 28px;
                        font-weight: bold;
                        color: #2c3e50;
                        margin: 10px 0;
                    }
                    .timetable-title {
                        font-size: 24px;
                        color: #e74c3c;
                        margin: 15px 0;
                        text-decoration: underline;
                    }
                    .exam-info {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin: 20px 0;
                        padding: 15px;
                        background: #f8f9fa;
                        border-radius: 5px;
                    }
                    .info-item {
                        text-align: center;
                    }
                    .info-label {
                        font-weight: bold;
                        color: #495057;
                    }
                    .info-value {
                        font-size: 18px;
                        color: #2c3e50;
                        margin-top: 5px;
                    }
                    .timetable-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    .timetable-table th, .timetable-table td {
                        border: 1px solid #ddd;
                        padding: 15px;
                        text-align: center;
                    }
                    .timetable-table th {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        font-weight: bold;
                    }
                    .timetable-table tr:nth-child(even) {
                        background: #f8f9fa;
                    }
                    .timetable-table tr:hover {
                        background: #e3f2fd;
                    }
                    .date-header {
                        background: #e9ecef !important;
                        font-weight: bold;
                        font-size: 16px;
                        color: #2c3e50;
                    }
                    .subject-name {
                        text-align: left;
                        font-weight: bold;
                        color: #2c3e50;
                    }
                    .instructions {
                        margin: 30px 0;
                        padding: 20px;
                        background: #fff3cd;
                        border: 1px solid #ffeaa7;
                        border-radius: 5px;
                    }
                    .instructions h4 {
                        color: #856404;
                        margin-top: 0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 2px solid #ddd;
                        color: #666;
                        font-size: 12px;
                    }
                    @media print {
                        body { margin: 0; padding: 15px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${schoolInfo.logo || ''}" alt="School Logo" class="school-logo" style="${schoolInfo.logo ? '' : 'display: none;'}">
                    <div class="school-name">${schoolInfo.name || 'School Management System'}</div>
                    <div class="school-address">${schoolInfo.address || ''}</div>
                    <div class="academic-year">Academic Year: ${schoolInfo.academicYear || ''}</div>
                </div>

                <div class="timetable-title">${timeTableInfo.title || 'EXAM TIME TABLE'}</div>

                <div class="exam-info">
                    <div class="info-item">
                        <div class="info-label">Exam Session</div>
                        <div class="info-value">${timeTableInfo.session || 'Not Specified'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Total Subjects</div>
                        <div class="info-value">${this.examTimeTable.length}</div>
                    </div>
                </div>

                <table class="timetable-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr ${index === 0 ? `class="date-header"` : ''}>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td class="subject-name">${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} minutes</td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>

                ${timeTableInfo.instructions ? `
                    <div class="instructions">
                        <h4>Important Instructions:</h4>
                        <p>${timeTableInfo.instructions.replace(/\n/g, '<br>')}</p>
                    </div>
                ` : ''}

                <div class="footer">
                    <p><strong>Generated by School Management System</strong></p>
                    <p>This time table is subject to change. Students are advised to check for updates regularly.</p>
                    <p>Generated on: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}</p>
                </div>

                <div class="no-print" style="text-align: center; margin-top: 30px;">
                    <button onclick="window.print()" style="margin-right: 10px; padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Time Table</button>
                    <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
                </div>
            </body>
            </html>
        `);
    }

    previewTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        this.generateTimeTable();
    }

    printTimeTable() {
        this.generateTimeTable();
        setTimeout(() => {
            window.print();
        }, 1000);
    }

    loadTimeTable() {
        const timetableTable = document.getElementById('timetableTable');
        const timetableInfo = document.getElementById('timetableInfo');

        if (this.examTimeTable.length === 0) {
            timetableTable.innerHTML = `
                <div class="no-timetable">
                    <p>No exam time table created yet.</p>
                    <p>Create your first time table to get started!</p>
                </div>
            `;
            timetableInfo.textContent = 'No time table created yet. Create your first time table!';
        } else {
            // Group entries by date for better display
            const groupedByDate = {};
            this.examTimeTable.forEach(entry => {
                if (!groupedByDate[entry.exam_date]) {
                    groupedByDate[entry.exam_date] = [];
                }
                groupedByDate[entry.exam_date].push(entry);
            });

            let html = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td>${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} min</td>
                                    <td>
                                        <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteTimeTableEntry('${entry.id}')">Remove</button>
                                    </td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>
            `;

            timetableTable.innerHTML = html;
            timetableInfo.textContent = `Time table with ${this.examTimeTable.length} exam(s) created successfully!`;
        }
    }

    deleteTimeTableEntry(id) {
        this.examTimeTable = this.examTimeTable.filter(entry => entry.id !== id);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        this.loadTimeTable();
    }

    loadSubjectsForTimeTable() {
        const classSelect = document.getElementById('ttClass');
        const subjectsSelection = document.getElementById('subjectsSelection');
        if (!subjectsSelection) return;

        const classValue = classSelect.value;
        if (!classValue) {
            subjectsSelection.innerHTML = '<p class="no-data">Select a class to load subjects</p>';
            return;
        }

        // Get subjects for the selected class
        const subjects = this.getSubjectsForClass(classValue);

        let html = '<div class="subjects-checkbox-grid">';
        subjects.forEach(subject => {
            html += `
                <div class="subject-checkbox-item">
                    <label class="checkbox-label">
                        <input type="checkbox" name="tt_subject" value="${subject}" checked>
                        <span class="checkmark"></span>
                        ${subject}
                    </label>
                </div>
            `;
        });
        html += '</div>';

        subjectsSelection.innerHTML = html;
    }

    handleTimeTableForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const classValue = formData.get('tt_class');
        const examDate = formData.get('tt_exam_date');
        const startTime = formData.get('tt_start_time');
        const endTime = formData.get('tt_end_time');

        // Get selected subjects
        const selectedSubjects = Array.from(document.querySelectorAll('input[name="tt_subject"]:checked')).map(cb => cb.value);

        if (selectedSubjects.length === 0) {
            alert('Please select at least one subject');
            return;
        }

        // Create time table entries for each selected subject
        const timeTableEntries = selectedSubjects.map((subject, index) => {
            const examDateTime = new Date(examDate);
            examDateTime.setDate(examDateTime.getDate() + index); // Spread exams across multiple days

            return {
                id: Date.now() + index,
                class: classValue,
                subject: subject,
                exam_date: examDateTime.toISOString().split('T')[0],
                start_time: startTime,
                end_time: endTime,
                duration: this.calculateDuration(startTime, endTime),
                created_date: new Date().toISOString()
            };
        });

        // Add entries to time table
        this.examTimeTable.push(...timeTableEntries);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        e.target.reset();
        this.loadTimeTable();
        alert('Time table entries created successfully!');
    }

    calculateDuration(startTime, endTime) {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        const diffMinutes = (end - start) / (1000 * 60);
        return diffMinutes;
    }

    saveTimeTableInfo() {
        const title = document.getElementById('timetableTitle').value;
        const session = document.getElementById('examSession').value;
        const instructions = document.getElementById('instructions').value;

        this.timeTableInfo = {
            title: title,
            session: session,
            instructions: instructions
        };

        localStorage.setItem('timeTableInfo', JSON.stringify(this.timeTableInfo));
        alert('Time table information saved successfully!');
    }

    generateTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        const previewWindow = window.open('', '_blank', 'width=1000,height=800');
        const schoolInfo = this.schoolInfo;
        const timeTableInfo = this.timeTableInfo;

        // Group entries by date
        const groupedByDate = {};
        this.examTimeTable.forEach(entry => {
            if (!groupedByDate[entry.exam_date]) {
                groupedByDate[entry.exam_date] = [];
            }
            groupedByDate[entry.exam_date].push(entry);
        });

        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Exam Time Table</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 1000px;
                        margin: 0 auto;
                        padding: 20px;
                        background: white;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 3px solid #333;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .school-logo {
                        max-height: 80px;
                        margin-bottom: 10px;
                    }
                    .school-name {
                        font-size: 28px;
                        font-weight: bold;
                        color: #2c3e50;
                        margin: 10px 0;
                    }
                    .timetable-title {
                        font-size: 24px;
                        color: #e74c3c;
                        margin: 15px 0;
                        text-decoration: underline;
                    }
                    .exam-info {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin: 20px 0;
                        padding: 15px;
                        background: #f8f9fa;
                        border-radius: 5px;
                    }
                    .info-item {
                        text-align: center;
                    }
                    .info-label {
                        font-weight: bold;
                        color: #495057;
                    }
                    .info-value {
                        font-size: 18px;
                        color: #2c3e50;
                        margin-top: 5px;
                    }
                    .timetable-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    .timetable-table th, .timetable-table td {
                        border: 1px solid #ddd;
                        padding: 15px;
                        text-align: center;
                    }
                    .timetable-table th {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        font-weight: bold;
                    }
                    .timetable-table tr:nth-child(even) {
                        background: #f8f9fa;
                    }
                    .timetable-table tr:hover {
                        background: #e3f2fd;
                    }
                    .date-header {
                        background: #e9ecef !important;
                        font-weight: bold;
                        font-size: 16px;
                        color: #2c3e50;
                    }
                    .subject-name {
                        text-align: left;
                        font-weight: bold;
                        color: #2c3e50;
                    }
                    .instructions {
                        margin: 30px 0;
                        padding: 20px;
                        background: #fff3cd;
                        border: 1px solid #ffeaa7;
                        border-radius: 5px;
                    }
                    .instructions h4 {
                        color: #856404;
                        margin-top: 0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 2px solid #ddd;
                        color: #666;
                        font-size: 12px;
                    }
                    @media print {
                        body { margin: 0; padding: 15px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${schoolInfo.logo || ''}" alt="School Logo" class="school-logo" style="${schoolInfo.logo ? '' : 'display: none;'}">
                    <div class="school-name">${schoolInfo.name || 'School Management System'}</div>
                    <div class="school-address">${schoolInfo.address || ''}</div>
                    <div class="academic-year">Academic Year: ${schoolInfo.academicYear || ''}</div>
                </div>

                <div class="timetable-title">${timeTableInfo.title || 'EXAM TIME TABLE'}</div>

                <div class="exam-info">
                    <div class="info-item">
                        <div class="info-label">Exam Session</div>
                        <div class="info-value">${timeTableInfo.session || 'Not Specified'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Total Subjects</div>
                        <div class="info-value">${this.examTimeTable.length}</div>
                    </div>
                </div>

                <table class="timetable-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr ${index === 0 ? `class="date-header"` : ''}>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td class="subject-name">${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} minutes</td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>

                ${timeTableInfo.instructions ? `
                    <div class="instructions">
                        <h4>Important Instructions:</h4>
                        <p>${timeTableInfo.instructions.replace(/\n/g, '<br>')}</p>
                    </div>
                ` : ''}

                <div class="footer">
                    <p><strong>Generated by School Management System</strong></p>
                    <p>This time table is subject to change. Students are advised to check for updates regularly.</p>
                    <p>Generated on: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}</p>
                </div>

                <div class="no-print" style="text-align: center; margin-top: 30px;">
                    <button onclick="window.print()" style="margin-right: 10px; padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Time Table</button>
                    <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
                </div>
            </body>
            </html>
        `);
    }

    previewTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        this.generateTimeTable();
    }

    printTimeTable() {
        this.generateTimeTable();
        setTimeout(() => {
            window.print();
        }, 1000);
    }

    loadTimeTable() {
        const timetableTable = document.getElementById('timetableTable');
        const timetableInfo = document.getElementById('timetableInfo');

        if (this.examTimeTable.length === 0) {
            timetableTable.innerHTML = `
                <div class="no-timetable">
                    <p>No exam time table created yet.</p>
                    <p>Create your first time table to get started!</p>
                </div>
            `;
            timetableInfo.textContent = 'No time table created yet. Create your first time table!';
        } else {
            // Group entries by date for better display
            const groupedByDate = {};
            this.examTimeTable.forEach(entry => {
                if (!groupedByDate[entry.exam_date]) {
                    groupedByDate[entry.exam_date] = [];
                }
                groupedByDate[entry.exam_date].push(entry);
            });

            let html = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td>${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} min</td>
                                    <td>
                                        <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteTimeTableEntry('${entry.id}')">Remove</button>
                                    </td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>
            `;

            timetableTable.innerHTML = html;
            timetableInfo.textContent = `Time table with ${this.examTimeTable.length} exam(s) created successfully!`;
        }
    }

    deleteTimeTableEntry(id) {
        this.examTimeTable = this.examTimeTable.filter(entry => entry.id !== id);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        this.loadTimeTable();
    }

    loadSubjectsForTimeTable() {
        const classSelect = document.getElementById('ttClass');
        const subjectsSelection = document.getElementById('subjectsSelection');
        if (!subjectsSelection) return;

        const classValue = classSelect.value;
        if (!classValue) {
            subjectsSelection.innerHTML = '<p class="no-data">Select a class to load subjects</p>';
            return;
        }

        // Get subjects for the selected class
        const subjects = this.getSubjectsForClass(classValue);

        let html = '<div class="subjects-checkbox-grid">';
        subjects.forEach(subject => {
            html += `
                <div class="subject-checkbox-item">
                    <label class="checkbox-label">
                        <input type="checkbox" name="tt_subject" value="${subject}" checked>
                        <span class="checkmark"></span>
                        ${subject}
                    </label>
                </div>
            `;
        });
        html += '</div>';

        subjectsSelection.innerHTML = html;
    }

    handleTimeTableForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const classValue = formData.get('tt_class');
        const examDate = formData.get('tt_exam_date');
        const startTime = formData.get('tt_start_time');
        const endTime = formData.get('tt_end_time');

        // Get selected subjects
        const selectedSubjects = Array.from(document.querySelectorAll('input[name="tt_subject"]:checked')).map(cb => cb.value);

        if (selectedSubjects.length === 0) {
            alert('Please select at least one subject');
            return;
        }

        // Create time table entries for each selected subject
        const timeTableEntries = selectedSubjects.map((subject, index) => {
            const examDateTime = new Date(examDate);
            examDateTime.setDate(examDateTime.getDate() + index); // Spread exams across multiple days

            return {
                id: Date.now() + index,
                class: classValue,
                subject: subject,
                exam_date: examDateTime.toISOString().split('T')[0],
                start_time: startTime,
                end_time: endTime,
                duration: this.calculateDuration(startTime, endTime),
                created_date: new Date().toISOString()
            };
        });

        // Add entries to time table
        this.examTimeTable.push(...timeTableEntries);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        e.target.reset();
        this.loadTimeTable();
        alert('Time table entries created successfully!');
    }

    calculateDuration(startTime, endTime) {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        const diffMinutes = (end - start) / (1000 * 60);
        return diffMinutes;
    }

    saveTimeTableInfo() {
        const title = document.getElementById('timetableTitle').value;
        const session = document.getElementById('examSession').value;
        const instructions = document.getElementById('instructions').value;

        this.timeTableInfo = {
            title: title,
            session: session,
            instructions: instructions
        };

        localStorage.setItem('timeTableInfo', JSON.stringify(this.timeTableInfo));
        alert('Time table information saved successfully!');
    }

    generateTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        const previewWindow = window.open('', '_blank', 'width=1000,height=800');
        const schoolInfo = this.schoolInfo;
        const timeTableInfo = this.timeTableInfo;

        // Group entries by date
        const groupedByDate = {};
        this.examTimeTable.forEach(entry => {
            if (!groupedByDate[entry.exam_date]) {
                groupedByDate[entry.exam_date] = [];
            }
            groupedByDate[entry.exam_date].push(entry);
        });

        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Exam Time Table</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 1000px;
                        margin: 0 auto;
                        padding: 20px;
                        background: white;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 3px solid #333;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .school-logo {
                        max-height: 80px;
                        margin-bottom: 10px;
                    }
                    .school-name {
                        font-size: 28px;
                        font-weight: bold;
                        color: #2c3e50;
                        margin: 10px 0;
                    }
                    .timetable-title {
                        font-size: 24px;
                        color: #e74c3c;
                        margin: 15px 0;
                        text-decoration: underline;
                    }
                    .exam-info {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin: 20px 0;
                        padding: 15px;
                        background: #f8f9fa;
                        border-radius: 5px;
                    }
                    .info-item {
                        text-align: center;
                    }
                    .info-label {
                        font-weight: bold;
                        color: #495057;
                    }
                    .info-value {
                        font-size: 18px;
                        color: #2c3e50;
                        margin-top: 5px;
                    }
                    .timetable-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    .timetable-table th, .timetable-table td {
                        border: 1px solid #ddd;
                        padding: 15px;
                        text-align: center;
                    }
                    .timetable-table th {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        font-weight: bold;
                    }
                    .timetable-table tr:nth-child(even) {
                        background: #f8f9fa;
                    }
                    .timetable-table tr:hover {
                        background: #e3f2fd;
                    }
                    .date-header {
                        background: #e9ecef !important;
                        font-weight: bold;
                        font-size: 16px;
                        color: #2c3e50;
                    }
                    .subject-name {
                        text-align: left;
                        font-weight: bold;
                        color: #2c3e50;
                    }
                    .instructions {
                        margin: 30px 0;
                        padding: 20px;
                        background: #fff3cd;
                        border: 1px solid #ffeaa7;
                        border-radius: 5px;
                    }
                    .instructions h4 {
                        color: #856404;
                        margin-top: 0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 2px solid #ddd;
                        color: #666;
                        font-size: 12px;
                    }
                    @media print {
                        body { margin: 0; padding: 15px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${schoolInfo.logo || ''}" alt="School Logo" class="school-logo" style="${schoolInfo.logo ? '' : 'display: none;'}">
                    <div class="school-name">${schoolInfo.name || 'School Management System'}</div>
                    <div class="school-address">${schoolInfo.address || ''}</div>
                    <div class="academic-year">Academic Year: ${schoolInfo.academicYear || ''}</div>
                </div>

                <div class="timetable-title">${timeTableInfo.title || 'EXAM TIME TABLE'}</div>

                <div class="exam-info">
                    <div class="info-item">
                        <div class="info-label">Exam Session</div>
                        <div class="info-value">${timeTableInfo.session || 'Not Specified'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Total Subjects</div>
                        <div class="info-value">${this.examTimeTable.length}</div>
                    </div>
                </div>

                <table class="timetable-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr ${index === 0 ? `class="date-header"` : ''}>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td class="subject-name">${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} minutes</td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>

                ${timeTableInfo.instructions ? `
                    <div class="instructions">
                        <h4>Important Instructions:</h4>
                        <p>${timeTableInfo.instructions.replace(/\n/g, '<br>')}</p>
                    </div>
                ` : ''}

                <div class="footer">
                    <p><strong>Generated by School Management System</strong></p>
                    <p>This time table is subject to change. Students are advised to check for updates regularly.</p>
                    <p>Generated on: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}</p>
                </div>

                <div class="no-print" style="text-align: center; margin-top: 30px;">
                    <button onclick="window.print()" style="margin-right: 10px; padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Time Table</button>
                    <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
                </div>
            </body>
            </html>
        `);
    }

    previewTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        this.generateTimeTable();
    }

    printTimeTable() {
        this.generateTimeTable();
        setTimeout(() => {
            window.print();
        }, 1000);
    }

    loadTimeTable() {
        const timetableTable = document.getElementById('timetableTable');
        const timetableInfo = document.getElementById('timetableInfo');

        if (this.examTimeTable.length === 0) {
            timetableTable.innerHTML = `
                <div class="no-timetable">
                    <p>No exam time table created yet.</p>
                    <p>Create your first time table to get started!</p>
                </div>
            `;
            timetableInfo.textContent = 'No time table created yet. Create your first time table!';
        } else {
            // Group entries by date for better display
            const groupedByDate = {};
            this.examTimeTable.forEach(entry => {
                if (!groupedByDate[entry.exam_date]) {
                    groupedByDate[entry.exam_date] = [];
                }
                groupedByDate[entry.exam_date].push(entry);
            });

            let html = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td>${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} min</td>
                                    <td>
                                        <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteTimeTableEntry('${entry.id}')">Remove</button>
                                    </td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>
            `;

            timetableTable.innerHTML = html;
            timetableInfo.textContent = `Time table with ${this.examTimeTable.length} exam(s) created successfully!`;
        }
    }

    deleteTimeTableEntry(id) {
        this.examTimeTable = this.examTimeTable.filter(entry => entry.id !== id);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        this.loadTimeTable();
    }

    loadSubjectsForTimeTable() {
        const classSelect = document.getElementById('ttClass');
        const subjectsSelection = document.getElementById('subjectsSelection');
        if (!subjectsSelection) return;

        const classValue = classSelect.value;
        if (!classValue) {
            subjectsSelection.innerHTML = '<p class="no-data">Select a class to load subjects</p>';
            return;
        }

        // Get subjects for the selected class
        const subjects = this.getSubjectsForClass(classValue);

        let html = '<div class="subjects-checkbox-grid">';
        subjects.forEach(subject => {
            html += `
                <div class="subject-checkbox-item">
                    <label class="checkbox-label">
                        <input type="checkbox" name="tt_subject" value="${subject}" checked>
                        <span class="checkmark"></span>
                        ${subject}
                    </label>
                </div>
            `;
        });
        html += '</div>';

        subjectsSelection.innerHTML = html;
    }

    handleTimeTableForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const classValue = formData.get('tt_class');
        const examDate = formData.get('tt_exam_date');
        const startTime = formData.get('tt_start_time');
        const endTime = formData.get('tt_end_time');

        // Get selected subjects
        const selectedSubjects = Array.from(document.querySelectorAll('input[name="tt_subject"]:checked')).map(cb => cb.value);

        if (selectedSubjects.length === 0) {
            alert('Please select at least one subject');
            return;
        }

        // Create time table entries for each selected subject
        const timeTableEntries = selectedSubjects.map((subject, index) => {
            const examDateTime = new Date(examDate);
            examDateTime.setDate(examDateTime.getDate() + index); // Spread exams across multiple days

            return {
                id: Date.now() + index,
                class: classValue,
                subject: subject,
                exam_date: examDateTime.toISOString().split('T')[0],
                start_time: startTime,
                end_time: endTime,
                duration: this.calculateDuration(startTime, endTime),
                created_date: new Date().toISOString()
            };
        });

        // Add entries to time table
        this.examTimeTable.push(...timeTableEntries);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        e.target.reset();
        this.loadTimeTable();
        alert('Time table entries created successfully!');
    }

    calculateDuration(startTime, endTime) {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        const diffMinutes = (end - start) / (1000 * 60);
        return diffMinutes;
    }

    saveTimeTableInfo() {
        const title = document.getElementById('timetableTitle').value;
        const session = document.getElementById('examSession').value;
        const instructions = document.getElementById('instructions').value;

        this.timeTableInfo = {
            title: title,
            session: session,
            instructions: instructions
        };

        localStorage.setItem('timeTableInfo', JSON.stringify(this.timeTableInfo));
        alert('Time table information saved successfully!');
    }

    generateTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        const previewWindow = window.open('', '_blank', 'width=1000,height=800');
        const schoolInfo = this.schoolInfo;
        const timeTableInfo = this.timeTableInfo;

        // Group entries by date
        const groupedByDate = {};
        this.examTimeTable.forEach(entry => {
            if (!groupedByDate[entry.exam_date]) {
                groupedByDate[entry.exam_date] = [];
            }
            groupedByDate[entry.exam_date].push(entry);
        });

        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Exam Time Table</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 1000px;
                        margin: 0 auto;
                        padding: 20px;
                        background: white;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 3px solid #333;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .school-logo {
                        max-height: 80px;
                        margin-bottom: 10px;
                    }
                    .school-name {
                        font-size: 28px;
                        font-weight: bold;
                        color: #2c3e50;
                        margin: 10px 0;
                    }
                    .timetable-title {
                        font-size: 24px;
                        color: #e74c3c;
                        margin: 15px 0;
                        text-decoration: underline;
                    }
                    .exam-info {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin: 20px 0;
                        padding: 15px;
                        background: #f8f9fa;
                        border-radius: 5px;
                    }
                    .info-item {
                        text-align: center;
                    }
                    .info-label {
                        font-weight: bold;
                        color: #495057;
                    }
                    .info-value {
                        font-size: 18px;
                        color: #2c3e50;
                        margin-top: 5px;
                    }
                    .timetable-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    .timetable-table th, .timetable-table td {
                        border: 1px solid #ddd;
                        padding: 15px;
                        text-align: center;
                    }
                    .timetable-table th {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        font-weight: bold;
                    }
                    .timetable-table tr:nth-child(even) {
                        background: #f8f9fa;
                    }
                    .timetable-table tr:hover {
                        background: #e3f2fd;
                    }
                    .date-header {
                        background: #e9ecef !important;
                        font-weight: bold;
                        font-size: 16px;
                        color: #2c3e50;
                    }
                    .subject-name {
                        text-align: left;
                        font-weight: bold;
                        color: #2c3e50;
                    }
                    .instructions {
                        margin: 30px 0;
                        padding: 20px;
                        background: #fff3cd;
                        border: 1px solid #ffeaa7;
                        border-radius: 5px;
                    }
                    .instructions h4 {
                        color: #856404;
                        margin-top: 0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 2px solid #ddd;
                        color: #666;
                        font-size: 12px;
                    }
                    @media print {
                        body { margin: 0; padding: 15px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${schoolInfo.logo || ''}" alt="School Logo" class="school-logo" style="${schoolInfo.logo ? '' : 'display: none;'}">
                    <div class="school-name">${schoolInfo.name || 'School Management System'}</div>
                    <div class="school-address">${schoolInfo.address || ''}</div>
                    <div class="academic-year">Academic Year: ${schoolInfo.academicYear || ''}</div>
                </div>

                <div class="timetable-title">${timeTableInfo.title || 'EXAM TIME TABLE'}</div>

                <div class="exam-info">
                    <div class="info-item">
                        <div class="info-label">Exam Session</div>
                        <div class="info-value">${timeTableInfo.session || 'Not Specified'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Total Subjects</div>
                        <div class="info-value">${this.examTimeTable.length}</div>
                    </div>
                </div>

                <table class="timetable-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr ${index === 0 ? `class="date-header"` : ''}>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td class="subject-name">${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} minutes</td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>

                ${timeTableInfo.instructions ? `
                    <div class="instructions">
                        <h4>Important Instructions:</h4>
                        <p>${timeTableInfo.instructions.replace(/\n/g, '<br>')}</p>
                    </div>
                ` : ''}

                <div class="footer">
                    <p><strong>Generated by School Management System</strong></p>
                    <p>This time table is subject to change. Students are advised to check for updates regularly.</p>
                    <p>Generated on: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}</p>
                </div>

                <div class="no-print" style="text-align: center; margin-top: 30px;">
                    <button onclick="window.print()" style="margin-right: 10px; padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Time Table</button>
                    <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
                </div>
            </body>
            </html>
        `);
    }

    previewTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        this.generateTimeTable();
    }

    printTimeTable() {
        this.generateTimeTable();
        setTimeout(() => {
            window.print();
        }, 1000);
    }

    loadTimeTable() {
        const timetableTable = document.getElementById('timetableTable');
        const timetableInfo = document.getElementById('timetableInfo');

        if (this.examTimeTable.length === 0) {
            timetableTable.innerHTML = `
                <div class="no-timetable">
                    <p>No exam time table created yet.</p>
                    <p>Create your first time table to get started!</p>
                </div>
            `;
            timetableInfo.textContent = 'No time table created yet. Create your first time table!';
        } else {
            // Group entries by date for better display
            const groupedByDate = {};
            this.examTimeTable.forEach(entry => {
                if (!groupedByDate[entry.exam_date]) {
                    groupedByDate[entry.exam_date] = [];
                }
                groupedByDate[entry.exam_date].push(entry);
            });

            let html = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td>${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} min</td>
                                    <td>
                                        <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteTimeTableEntry('${entry.id}')">Remove</button>
                                    </td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>
            `;

            timetableTable.innerHTML = html;
            timetableInfo.textContent = `Time table with ${this.examTimeTable.length} exam(s) created successfully!`;
        }
    }

    deleteTimeTableEntry(id) {
        this.examTimeTable = this.examTimeTable.filter(entry => entry.id !== id);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        this.loadTimeTable();
    }

    loadSubjectsForTimeTable() {
        const classSelect = document.getElementById('ttClass');
        const subjectsSelection = document.getElementById('subjectsSelection');
        if (!subjectsSelection) return;

        const classValue = classSelect.value;
        if (!classValue) {
            subjectsSelection.innerHTML = '<p class="no-data">Select a class to load subjects</p>';
            return;
        }

        // Get subjects for the selected class
        const subjects = this.getSubjectsForClass(classValue);

        let html = '<div class="subjects-checkbox-grid">';
        subjects.forEach(subject => {
            html += `
                <div class="subject-checkbox-item">
                    <label class="checkbox-label">
                        <input type="checkbox" name="tt_subject" value="${subject}" checked>
                        <span class="checkmark"></span>
                        ${subject}
                    </label>
                </div>
            `;
        });
        html += '</div>';

        subjectsSelection.innerHTML = html;
    }

    handleTimeTableForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const classValue = formData.get('tt_class');
        const examDate = formData.get('tt_exam_date');
        const startTime = formData.get('tt_start_time');
        const endTime = formData.get('tt_end_time');

        // Get selected subjects
        const selectedSubjects = Array.from(document.querySelectorAll('input[name="tt_subject"]:checked')).map(cb => cb.value);

        if (selectedSubjects.length === 0) {
            alert('Please select at least one subject');
            return;
        }

        // Create time table entries for each selected subject
        const timeTableEntries = selectedSubjects.map((subject, index) => {
            const examDateTime = new Date(examDate);
            examDateTime.setDate(examDateTime.getDate() + index); // Spread exams across multiple days

            return {
                id: Date.now() + index,
                class: classValue,
                subject: subject,
                exam_date: examDateTime.toISOString().split('T')[0],
                start_time: startTime,
                end_time: endTime,
                duration: this.calculateDuration(startTime, endTime),
                created_date: new Date().toISOString()
            };
        });

        // Add entries to time table
        this.examTimeTable.push(...timeTableEntries);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        e.target.reset();
        this.loadTimeTable();
        alert('Time table entries created successfully!');
    }

    calculateDuration(startTime, endTime) {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        const diffMinutes = (end - start) / (1000 * 60);
        return diffMinutes;
    }

    saveTimeTableInfo() {
        const title = document.getElementById('timetableTitle').value;
        const session = document.getElementById('examSession').value;
        const instructions = document.getElementById('instructions').value;

        this.timeTableInfo = {
            title: title,
            session: session,
            instructions: instructions
        };

        localStorage.setItem('timeTableInfo', JSON.stringify(this.timeTableInfo));
        alert('Time table information saved successfully!');
    }

    generateTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        const previewWindow = window.open('', '_blank', 'width=1000,height=800');
        const schoolInfo = this.schoolInfo;
        const timeTableInfo = this.timeTableInfo;

        // Group entries by date
        const groupedByDate = {};
        this.examTimeTable.forEach(entry => {
            if (!groupedByDate[entry.exam_date]) {
                groupedByDate[entry.exam_date] = [];
            }
            groupedByDate[entry.exam_date].push(entry);
        });

        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Exam Time Table</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 1000px;
                        margin: 0 auto;
                        padding: 20px;
                        background: white;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 3px solid #333;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .school-logo {
                        max-height: 80px;
                        margin-bottom: 10px;
                    }
                    .school-name {
                        font-size: 28px;
                        font-weight: bold;
                        color: #2c3e50;
                        margin: 10px 0;
                    }
                    .timetable-title {
                        font-size: 24px;
                        color: #e74c3c;
                        margin: 15px 0;
                        text-decoration: underline;
                    }
                    .exam-info {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin: 20px 0;
                        padding: 15px;
                        background: #f8f9fa;
                        border-radius: 5px;
                    }
                    .info-item {
                        text-align: center;
                    }
                    .info-label {
                        font-weight: bold;
                        color: #495057;
                    }
                    .info-value {
                        font-size: 18px;
                        color: #2c3e50;
                        margin-top: 5px;
                    }
                    .timetable-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    .timetable-table th, .timetable-table td {
                        border: 1px solid #ddd;
                        padding: 15px;
                        text-align: center;
                    }
                    .timetable-table th {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        font-weight: bold;
                    }
                    .timetable-table tr:nth-child(even) {
                        background: #f8f9fa;
                    }
                    .timetable-table tr:hover {
                        background: #e3f2fd;
                    }
                    .date-header {
                        background: #e9ecef !important;
                        font-weight: bold;
                        font-size: 16px;
                        color: #2c3e50;
                    }
                    .subject-name {
                        text-align: left;
                        font-weight: bold;
                        color: #2c3e50;
                    }
                    .instructions {
                        margin: 30px 0;
                        padding: 20px;
                        background: #fff3cd;
                        border: 1px solid #ffeaa7;
                        border-radius: 5px;
                    }
                    .instructions h4 {
                        color: #856404;
                        margin-top: 0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 2px solid #ddd;
                        color: #666;
                        font-size: 12px;
                    }
                    @media print {
                        body { margin: 0; padding: 15px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${schoolInfo.logo || ''}" alt="School Logo" class="school-logo" style="${schoolInfo.logo ? '' : 'display: none;'}">
                    <div class="school-name">${schoolInfo.name || 'School Management System'}</div>
                    <div class="school-address">${schoolInfo.address || ''}</div>
                    <div class="academic-year">Academic Year: ${schoolInfo.academicYear || ''}</div>
                </div>

                <div class="timetable-title">${timeTableInfo.title || 'EXAM TIME TABLE'}</div>

                <div class="exam-info">
                    <div class="info-item">
                        <div class="info-label">Exam Session</div>
                        <div class="info-value">${timeTableInfo.session || 'Not Specified'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Total Subjects</div>
                        <div class="info-value">${this.examTimeTable.length}</div>
                    </div>
                </div>

                <table class="timetable-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr ${index === 0 ? `class="date-header"` : ''}>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td class="subject-name">${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} minutes</td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>

                ${timeTableInfo.instructions ? `
                    <div class="instructions">
                        <h4>Important Instructions:</h4>
                        <p>${timeTableInfo.instructions.replace(/\n/g, '<br>')}</p>
                    </div>
                ` : ''}

                <div class="footer">
                    <p><strong>Generated by School Management System</strong></p>
                    <p>This time table is subject to change. Students are advised to check for updates regularly.</p>
                    <p>Generated on: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}</p>
                </div>

                <div class="no-print" style="text-align: center; margin-top: 30px;">
                    <button onclick="window.print()" style="margin-right: 10px; padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Time Table</button>
                    <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
                </div>
            </body>
            </html>
        `);
    }

    previewTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        this.generateTimeTable();
    }

    printTimeTable() {
        this.generateTimeTable();
        setTimeout(() => {
            window.print();
        }, 1000);
    }

    loadTimeTable() {
        const timetableTable = document.getElementById('timetableTable');
        const timetableInfo = document.getElementById('timetableInfo');

        if (this.examTimeTable.length === 0) {
            timetableTable.innerHTML = `
                <div class="no-timetable">
                    <p>No exam time table created yet.</p>
                    <p>Create your first time table to get started!</p>
                </div>
            `;
            timetableInfo.textContent = 'No time table created yet. Create your first time table!';
        } else {
            // Group entries by date for better display
            const groupedByDate = {};
            this.examTimeTable.forEach(entry => {
                if (!groupedByDate[entry.exam_date]) {
                    groupedByDate[entry.exam_date] = [];
                }
                groupedByDate[entry.exam_date].push(entry);
            });

            let html = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td>${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} min</td>
                                    <td>
                                        <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteTimeTableEntry('${entry.id}')">Remove</button>
                                    </td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>
            `;

            timetableTable.innerHTML = html;
            timetableInfo.textContent = `Time table with ${this.examTimeTable.length} exam(s) created successfully!`;
        }
    }

    deleteTimeTableEntry(id) {
        this.examTimeTable = this.examTimeTable.filter(entry => entry.id !== id);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        this.loadTimeTable();
    }

    loadSubjectsForTimeTable() {
        const classSelect = document.getElementById('ttClass');
        const subjectsSelection = document.getElementById('subjectsSelection');
        if (!subjectsSelection) return;

        const classValue = classSelect.value;
        if (!classValue) {
            subjectsSelection.innerHTML = '<p class="no-data">Select a class to load subjects</p>';
            return;
        }

        // Get subjects for the selected class
        const subjects = this.getSubjectsForClass(classValue);

        let html = '<div class="subjects-checkbox-grid">';
        subjects.forEach(subject => {
            html += `
                <div class="subject-checkbox-item">
                    <label class="checkbox-label">
                        <input type="checkbox" name="tt_subject" value="${subject}" checked>
                        <span class="checkmark"></span>
                        ${subject}
                    </label>
                </div>
            `;
        });
        html += '</div>';

        subjectsSelection.innerHTML = html;
    }

    handleTimeTableForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const classValue = formData.get('tt_class');
        const examDate = formData.get('tt_exam_date');
        const startTime = formData.get('tt_start_time');
        const endTime = formData.get('tt_end_time');

        // Get selected subjects
        const selectedSubjects = Array.from(document.querySelectorAll('input[name="tt_subject"]:checked')).map(cb => cb.value);

        if (selectedSubjects.length === 0) {
            alert('Please select at least one subject');
            return;
        }

        // Create time table entries for each selected subject
        const timeTableEntries = selectedSubjects.map((subject, index) => {
            const examDateTime = new Date(examDate);
            examDateTime.setDate(examDateTime.getDate() + index); // Spread exams across multiple days

            return {
                id: Date.now() + index,
                class: classValue,
                subject: subject,
                exam_date: examDateTime.toISOString().split('T')[0],
                start_time: startTime,
                end_time: endTime,
                duration: this.calculateDuration(startTime, endTime),
                created_date: new Date().toISOString()
            };
        });

        // Add entries to time table
        this.examTimeTable.push(...timeTableEntries);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        e.target.reset();
        this.loadTimeTable();
        alert('Time table entries created successfully!');
    }

    calculateDuration(startTime, endTime) {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        const diffMinutes = (end - start) / (1000 * 60);
        return diffMinutes;
    }

    saveTimeTableInfo() {
        const title = document.getElementById('timetableTitle').value;
        const session = document.getElementById('examSession').value;
        const instructions = document.getElementById('instructions').value;

        this.timeTableInfo = {
            title: title,
            session: session,
            instructions: instructions
        };

        localStorage.setItem('timeTableInfo', JSON.stringify(this.timeTableInfo));
        alert('Time table information saved successfully!');
    }

    generateTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        const previewWindow = window.open('', '_blank', 'width=1000,height=800');
        const schoolInfo = this.schoolInfo;
        const timeTableInfo = this.timeTableInfo;

        // Group entries by date
        const groupedByDate = {};
        this.examTimeTable.forEach(entry => {
            if (!groupedByDate[entry.exam_date]) {
                groupedByDate[entry.exam_date] = [];
            }
            groupedByDate[entry.exam_date].push(entry);
        });

        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Exam Time Table</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 1000px;
                        margin: 0 auto;
                        padding: 20px;
                        background: white;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 3px solid #333;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .school-logo {
                        max-height: 80px;
                        margin-bottom: 10px;
                    }
                    .school-name {
                        font-size: 28px;
                        font-weight: bold;
                        color: #2c3e50;
                        margin: 10px 0;
                    }
                    .timetable-title {
                        font-size: 24px;
                        color: #e74c3c;
                        margin: 15px 0;
                        text-decoration: underline;
                    }
                    .exam-info {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin: 20px 0;
                        padding: 15px;
                        background: #f8f9fa;
                        border-radius: 5px;
                    }
                    .info-item {
                        text-align: center;
                    }
                    .info-label {
                        font-weight: bold;
                        color: #495057;
                    }
                    .info-value {
                        font-size: 18px;
                        color: #2c3e50;
                        margin-top: 5px;
                    }
                    .timetable-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    .timetable-table th, .timetable-table td {
                        border: 1px solid #ddd;
                        padding: 15px;
                        text-align: center;
                    }
                    .timetable-table th {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        font-weight: bold;
                    }
                    .timetable-table tr:nth-child(even) {
                        background: #f8f9fa;
                    }
                    .timetable-table tr:hover {
                        background: #e3f2fd;
                    }
                    .date-header {
                        background: #e9ecef !important;
                        font-weight: bold;
                        font-size: 16px;
                        color: #2c3e50;
                    }
                    .subject-name {
                        text-align: left;
                        font-weight: bold;
                        color: #2c3e50;
                    }
                    .instructions {
                        margin: 30px 0;
                        padding: 20px;
                        background: #fff3cd;
                        border: 1px solid #ffeaa7;
                        border-radius: 5px;
                    }
                    .instructions h4 {
                        color: #856404;
                        margin-top: 0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 2px solid #ddd;
                        color: #666;
                        font-size: 12px;
                    }
                    @media print {
                        body { margin: 0; padding: 15px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${schoolInfo.logo || ''}" alt="School Logo" class="school-logo" style="${schoolInfo.logo ? '' : 'display: none;'}">
                    <div class="school-name">${schoolInfo.name || 'School Management System'}</div>
                    <div class="school-address">${schoolInfo.address || ''}</div>
                    <div class="academic-year">Academic Year: ${schoolInfo.academicYear || ''}</div>
                </div>

                <div class="timetable-title">${timeTableInfo.title || 'EXAM TIME TABLE'}</div>

                <div class="exam-info">
                    <div class="info-item">
                        <div class="info-label">Exam Session</div>
                        <div class="info-value">${timeTableInfo.session || 'Not Specified'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Total Subjects</div>
                        <div class="info-value">${this.examTimeTable.length}</div>
                    </div>
                </div>

                <table class="timetable-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr ${index === 0 ? `class="date-header"` : ''}>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td class="subject-name">${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} minutes</td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>

                ${timeTableInfo.instructions ? `
                    <div class="instructions">
                        <h4>Important Instructions:</h4>
                        <p>${timeTableInfo.instructions.replace(/\n/g, '<br>')}</p>
                    </div>
                ` : ''}

                <div class="footer">
                    <p><strong>Generated by School Management System</strong></p>
                    <p>This time table is subject to change. Students are advised to check for updates regularly.</p>
                    <p>Generated on: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}</p>
                </div>

                <div class="no-print" style="text-align: center; margin-top: 30px;">
                    <button onclick="window.print()" style="margin-right: 10px; padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Time Table</button>
                    <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
                </div>
            </body>
            </html>
        `);
    }

    previewTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        this.generateTimeTable();
    }

    printTimeTable() {
        this.generateTimeTable();
        setTimeout(() => {
            window.print();
        }, 1000);
    }

    loadTimeTable() {
        const timetableTable = document.getElementById('timetableTable');
        const timetableInfo = document.getElementById('timetableInfo');

        if (this.examTimeTable.length === 0) {
            timetableTable.innerHTML = `
                <div class="no-timetable">
                    <p>No exam time table created yet.</p>
                    <p>Create your first time table to get started!</p>
                </div>
            `;
            timetableInfo.textContent = 'No time table created yet. Create your first time table!';
        } else {
            // Group entries by date for better display
            const groupedByDate = {};
            this.examTimeTable.forEach(entry => {
                if (!groupedByDate[entry.exam_date]) {
                    groupedByDate[entry.exam_date] = [];
                }
                groupedByDate[entry.exam_date].push(entry);
            });

            let html = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td>${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} min</td>
                                    <td>
                                        <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteTimeTableEntry('${entry.id}')">Remove</button>
                                    </td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>
            `;

            timetableTable.innerHTML = html;
            timetableInfo.textContent = `Time table with ${this.examTimeTable.length} exam(s) created successfully!`;
        }
    }

    deleteTimeTableEntry(id) {
        this.examTimeTable = this.examTimeTable.filter(entry => entry.id !== id);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        this.loadTimeTable();
    }

    loadSubjectsForTimeTable() {
        const classSelect = document.getElementById('ttClass');
        const subjectsSelection = document.getElementById('subjectsSelection');
        if (!subjectsSelection) return;

        const classValue = classSelect.value;
        if (!classValue) {
            subjectsSelection.innerHTML = '<p class="no-data">Select a class to load subjects</p>';
            return;
        }

        // Get subjects for the selected class
        const subjects = this.getSubjectsForClass(classValue);

        let html = '<div class="subjects-checkbox-grid">';
        subjects.forEach(subject => {
            html += `
                <div class="subject-checkbox-item">
                    <label class="checkbox-label">
                        <input type="checkbox" name="tt_subject" value="${subject}" checked>
                        <span class="checkmark"></span>
                        ${subject}
                    </label>
                </div>
            `;
        });
        html += '</div>';

        subjectsSelection.innerHTML = html;
    }

    handleTimeTableForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const classValue = formData.get('tt_class');
        const examDate = formData.get('tt_exam_date');
        const startTime = formData.get('tt_start_time');
        const endTime = formData.get('tt_end_time');

        // Get selected subjects
        const selectedSubjects = Array.from(document.querySelectorAll('input[name="tt_subject"]:checked')).map(cb => cb.value);

        if (selectedSubjects.length === 0) {
            alert('Please select at least one subject');
            return;
        }

        // Create time table entries for each selected subject
        const timeTableEntries = selectedSubjects.map((subject, index) => {
            const examDateTime = new Date(examDate);
            examDateTime.setDate(examDateTime.getDate() + index); // Spread exams across multiple days

            return {
                id: Date.now() + index,
                class: classValue,
                subject: subject,
                exam_date: examDateTime.toISOString().split('T')[0],
                start_time: startTime,
                end_time: endTime,
                duration: this.calculateDuration(startTime, endTime),
                created_date: new Date().toISOString()
            };
        });

        // Add entries to time table
        this.examTimeTable.push(...timeTableEntries);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        e.target.reset();
        this.loadTimeTable();
        alert('Time table entries created successfully!');
    }

    calculateDuration(startTime, endTime) {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        const diffMinutes = (end - start) / (1000 * 60);
        return diffMinutes;
    }

    saveTimeTableInfo() {
        const title = document.getElementById('timetableTitle').value;
        const session = document.getElementById('examSession').value;
        const instructions = document.getElementById('instructions').value;

        this.timeTableInfo = {
            title: title,
            session: session,
            instructions: instructions
        };

        localStorage.setItem('timeTableInfo', JSON.stringify(this.timeTableInfo));
        alert('Time table information saved successfully!');
    }

    generateTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        const previewWindow = window.open('', '_blank', 'width=1000,height=800');
        const schoolInfo = this.schoolInfo;
        const timeTableInfo = this.timeTableInfo;

        // Group entries by date
        const groupedByDate = {};
        this.examTimeTable.forEach(entry => {
            if (!groupedByDate[entry.exam_date]) {
                groupedByDate[entry.exam_date] = [];
            }
            groupedByDate[entry.exam_date].push(entry);
        });

        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Exam Time Table</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 1000px;
                        margin: 0 auto;
                        padding: 20px;
                        background: white;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 3px solid #333;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .school-logo {
                        max-height: 80px;
                        margin-bottom: 10px;
                    }
                    .school-name {
                        font-size: 28px;
                        font-weight: bold;
                        color: #2c3e50;
                        margin: 10px 0;
                    }
                    .timetable-title {
                        font-size: 24px;
                        color: #e74c3c;
                        margin: 15px 0;
                        text-decoration: underline;
                    }
                    .exam-info {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin: 20px 0;
                        padding: 15px;
                        background: #f8f9fa;
                        border-radius: 5px;
                    }
                    .info-item {
                        text-align: center;
                    }
                    .info-label {
                        font-weight: bold;
                        color: #495057;
                    }
                    .info-value {
                        font-size: 18px;
                        color: #2c3e50;
                        margin-top: 5px;
                    }
                    .timetable-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    .timetable-table th, .timetable-table td {
                        border: 1px solid #ddd;
                        padding: 15px;
                        text-align: center;
                    }
                    .timetable-table th {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        font-weight: bold;
                    }
                    .timetable-table tr:nth-child(even) {
                        background: #f8f9fa;
                    }
                    .timetable-table tr:hover {
                        background: #e3f2fd;
                    }
                    .date-header {
                        background: #e9ecef !important;
                        font-weight: bold;
                        font-size: 16px;
                        color: #2c3e50;
                    }
                    .subject-name {
                        text-align: left;
                        font-weight: bold;
                        color: #2c3e50;
                    }
                    .instructions {
                        margin: 30px 0;
                        padding: 20px;
                        background: #fff3cd;
                        border: 1px solid #ffeaa7;
                        border-radius: 5px;
                    }
                    .instructions h4 {
                        color: #856404;
                        margin-top: 0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 2px solid #ddd;
                        color: #666;
                        font-size: 12px;
                    }
                    @media print {
                        body { margin: 0; padding: 15px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${schoolInfo.logo || ''}" alt="School Logo" class="school-logo" style="${schoolInfo.logo ? '' : 'display: none;'}">
                    <div class="school-name">${schoolInfo.name || 'School Management System'}</div>
                    <div class="school-address">${schoolInfo.address || ''}</div>
                    <div class="academic-year">Academic Year: ${schoolInfo.academicYear || ''}</div>
                </div>

                <div class="timetable-title">${timeTableInfo.title || 'EXAM TIME TABLE'}</div>

                <div class="exam-info">
                    <div class="info-item">
                        <div class="info-label">Exam Session</div>
                        <div class="info-value">${timeTableInfo.session || 'Not Specified'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Total Subjects</div>
                        <div class="info-value">${this.examTimeTable.length}</div>
                    </div>
                </div>

                <table class="timetable-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr ${index === 0 ? `class="date-header"` : ''}>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td class="subject-name">${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} minutes</td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>

                ${timeTableInfo.instructions ? `
                    <div class="instructions">
                        <h4>Important Instructions:</h4>
                        <p>${timeTableInfo.instructions.replace(/\n/g, '<br>')}</p>
                    </div>
                ` : ''}

                <div class="footer">
                    <p><strong>Generated by School Management System</strong></p>
                    <p>This time table is subject to change. Students are advised to check for updates regularly.</p>
                    <p>Generated on: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}</p>
                </div>

                <div class="no-print" style="text-align: center; margin-top: 30px;">
                    <button onclick="window.print()" style="margin-right: 10px; padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Time Table</button>
                    <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
                </div>
            </body>
            </html>
        `);
    }

    previewTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        this.generateTimeTable();
    }

    printTimeTable() {
        this.generateTimeTable();
        setTimeout(() => {
            window.print();
        }, 1000);
    }

    loadTimeTable() {
        const timetableTable = document.getElementById('timetableTable');
        const timetableInfo = document.getElementById('timetableInfo');

        if (this.examTimeTable.length === 0) {
            timetableTable.innerHTML = `
                <div class="no-timetable">
                    <p>No exam time table created yet.</p>
                    <p>Create your first time table to get started!</p>
                </div>
            `;
            timetableInfo.textContent = 'No time table created yet. Create your first time table!';
        } else {
            // Group entries by date for better display
            const groupedByDate = {};
            this.examTimeTable.forEach(entry => {
                if (!groupedByDate[entry.exam_date]) {
                    groupedByDate[entry.exam_date] = [];
                }
                groupedByDate[entry.exam_date].push(entry);
            });

            let html = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td>${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} min</td>
                                    <td>
                                        <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteTimeTableEntry('${entry.id}')">Remove</button>
                                    </td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>
            `;

            timetableTable.innerHTML = html;
            timetableInfo.textContent = `Time table with ${this.examTimeTable.length} exam(s) created successfully!`;
        }
    }

    deleteTimeTableEntry(id) {
        this.examTimeTable = this.examTimeTable.filter(entry => entry.id !== id);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        this.loadTimeTable();
    }

    loadSubjectsForTimeTable() {
        const classSelect = document.getElementById('ttClass');
        const subjectsSelection = document.getElementById('subjectsSelection');
        if (!subjectsSelection) return;

        const classValue = classSelect.value;
        if (!classValue) {
            subjectsSelection.innerHTML = '<p class="no-data">Select a class to load subjects</p>';
            return;
        }

        // Get subjects for the selected class
        const subjects = this.getSubjectsForClass(classValue);

        let html = '<div class="subjects-checkbox-grid">';
        subjects.forEach(subject => {
            html += `
                <div class="subject-checkbox-item">
                    <label class="checkbox-label">
                        <input type="checkbox" name="tt_subject" value="${subject}" checked>
                        <span class="checkmark"></span>
                        ${subject}
                    </label>
                </div>
            `;
        });
        html += '</div>';

        subjectsSelection.innerHTML = html;
    }

    handleTimeTableForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const classValue = formData.get('tt_class');
        const examDate = formData.get('tt_exam_date');
        const startTime = formData.get('tt_start_time');
        const endTime = formData.get('tt_end_time');

        // Get selected subjects
        const selectedSubjects = Array.from(document.querySelectorAll('input[name="tt_subject"]:checked')).map(cb => cb.value);

        if (selectedSubjects.length === 0) {
            alert('Please select at least one subject');
            return;
        }

        // Create time table entries for each selected subject
        const timeTableEntries = selectedSubjects.map((subject, index) => {
            const examDateTime = new Date(examDate);
            examDateTime.setDate(examDateTime.getDate() + index); // Spread exams across multiple days

            return {
                id: Date.now() + index,
                class: classValue,
                subject: subject,
                exam_date: examDateTime.toISOString().split('T')[0],
                start_time: startTime,
                end_time: endTime,
                duration: this.calculateDuration(startTime, endTime),
                created_date: new Date().toISOString()
            };
        });

        // Add entries to time table
        this.examTimeTable.push(...timeTableEntries);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        e.target.reset();
        this.loadTimeTable();
        alert('Time table entries created successfully!');
    }

    calculateDuration(startTime, endTime) {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        const diffMinutes = (end - start) / (1000 * 60);
        return diffMinutes;
    }

    saveTimeTableInfo() {
        const title = document.getElementById('timetableTitle').value;
        const session = document.getElementById('examSession').value;
        const instructions = document.getElementById('instructions').value;

        this.timeTableInfo = {
            title: title,
            session: session,
            instructions: instructions
        };

        localStorage.setItem('timeTableInfo', JSON.stringify(this.timeTableInfo));
        alert('Time table information saved successfully!');
    }

    generateTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        const previewWindow = window.open('', '_blank', 'width=1000,height=800');
        const schoolInfo = this.schoolInfo;
        const timeTableInfo = this.timeTableInfo;

        // Group entries by date
        const groupedByDate = {};
        this.examTimeTable.forEach(entry => {
            if (!groupedByDate[entry.exam_date]) {
                groupedByDate[entry.exam_date] = [];
            }
            groupedByDate[entry.exam_date].push(entry);
        });

        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Exam Time Table</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 1000px;
                        margin: 0 auto;
                        padding: 20px;
                        background: white;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 3px solid #333;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .school-logo {
                        max-height: 80px;
                        margin-bottom: 10px;
                    }
                    .school-name {
                        font-size: 28px;
                        font-weight: bold;
                        color: #2c3e50;
                        margin: 10px 0;
                    }
                    .timetable-title {
                        font-size: 24px;
                        color: #e74c3c;
                        margin: 15px 0;
                        text-decoration: underline;
                    }
                    .exam-info {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin: 20px 0;
                        padding: 15px;
                        background: #f8f9fa;
                        border-radius: 5px;
                    }
                    .info-item {
                        text-align: center;
                    }
                    .info-label {
                        font-weight: bold;
                        color: #495057;
                    }
                    .info-value {
                        font-size: 18px;
                        color: #2c3e50;
                        margin-top: 5px;
                    }
                    .timetable-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    .timetable-table th, .timetable-table td {
                        border: 1px solid #ddd;
                        padding: 15px;
                        text-align: center;
                    }
                    .timetable-table th {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        font-weight: bold;
                    }
                    .timetable-table tr:nth-child(even) {
                        background: #f8f9fa;
                    }
                    .timetable-table tr:hover {
                        background: #e3f2fd;
                    }
                    .date-header {
                        background: #e9ecef !important;
                        font-weight: bold;
                        font-size: 16px;
                        color: #2c3e50;
                    }
                    .subject-name {
                        text-align: left;
                        font-weight: bold;
                        color: #2c3e50;
                    }
                    .instructions {
                        margin: 30px 0;
                        padding: 20px;
                        background: #fff3cd;
                        border: 1px solid #ffeaa7;
                        border-radius: 5px;
                    }
                    .instructions h4 {
                        color: #856404;
                        margin-top: 0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 2px solid #ddd;
                        color: #666;
                        font-size: 12px;
                    }
                    @media print {
                        body { margin: 0; padding: 15px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${schoolInfo.logo || ''}" alt="School Logo" class="school-logo" style="${schoolInfo.logo ? '' : 'display: none;'}">
                    <div class="school-name">${schoolInfo.name || 'School Management System'}</div>
                    <div class="school-address">${schoolInfo.address || ''}</div>
                    <div class="academic-year">Academic Year: ${schoolInfo.academicYear || ''}</div>
                </div>

                <div class="timetable-title">${timeTableInfo.title || 'EXAM TIME TABLE'}</div>

                <div class="exam-info">
                    <div class="info-item">
                        <div class="info-label">Exam Session</div>
                        <div class="info-value">${timeTableInfo.session || 'Not Specified'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Total Subjects</div>
                        <div class="info-value">${this.examTimeTable.length}</div>
                    </div>
                </div>

                <table class="timetable-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr ${index === 0 ? `class="date-header"` : ''}>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td class="subject-name">${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} minutes</td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>

                ${timeTableInfo.instructions ? `
                    <div class="instructions">
                        <h4>Important Instructions:</h4>
                        <p>${timeTableInfo.instructions.replace(/\n/g, '<br>')}</p>
                    </div>
                ` : ''}

                <div class="footer">
                    <p><strong>Generated by School Management System</strong></p>
                    <p>This time table is subject to change. Students are advised to check for updates regularly.</p>
                    <p>Generated on: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}</p>
                </div>

                <div class="no-print" style="text-align: center; margin-top: 30px;">
                    <button onclick="window.print()" style="margin-right: 10px; padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Time Table</button>
                    <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
                </div>
            </body>
            </html>
        `);
    }

    previewTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        this.generateTimeTable();
    }

    printTimeTable() {
        this.generateTimeTable();
        setTimeout(() => {
            window.print();
        }, 1000);
    }

    loadTimeTable() {
        const timetableTable = document.getElementById('timetableTable');
        const timetableInfo = document.getElementById('timetableInfo');

        if (this.examTimeTable.length === 0) {
            timetableTable.innerHTML = `
                <div class="no-timetable">
                    <p>No exam time table created yet.</p>
                    <p>Create your first time table to get started!</p>
                </div>
            `;
            timetableInfo.textContent = 'No time table created yet. Create your first time table!';
        } else {
            // Group entries by date for better display
            const groupedByDate = {};
            this.examTimeTable.forEach(entry => {
                if (!groupedByDate[entry.exam_date]) {
                    groupedByDate[entry.exam_date] = [];
                }
                groupedByDate[entry.exam_date].push(entry);
            });

            let html = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td>${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} min</td>
                                    <td>
                                        <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteTimeTableEntry('${entry.id}')">Remove</button>
                                    </td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>
            `;

            timetableTable.innerHTML = html;
            timetableInfo.textContent = `Time table with ${this.examTimeTable.length} exam(s) created successfully!`;
        }
    }

    deleteTimeTableEntry(id) {
        this.examTimeTable = this.examTimeTable.filter(entry => entry.id !== id);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        this.loadTimeTable();
    }

    loadSubjectsForTimeTable() {
        const classSelect = document.getElementById('ttClass');
        const subjectsSelection = document.getElementById('subjectsSelection');
        if (!subjectsSelection) return;

        const classValue = classSelect.value;
        if (!classValue) {
            subjectsSelection.innerHTML = '<p class="no-data">Select a class to load subjects</p>';
            return;
        }

        // Get subjects for the selected class
        const subjects = this.getSubjectsForClass(classValue);

        let html = '<div class="subjects-checkbox-grid">';
        subjects.forEach(subject => {
            html += `
                <div class="subject-checkbox-item">
                    <label class="checkbox-label">
                        <input type="checkbox" name="tt_subject" value="${subject}" checked>
                        <span class="checkmark"></span>
                        ${subject}
                    </label>
                </div>
            `;
        });
        html += '</div>';

        subjectsSelection.innerHTML = html;
    }

    handleTimeTableForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const classValue = formData.get('tt_class');
        const examDate = formData.get('tt_exam_date');
        const startTime = formData.get('tt_start_time');
        const endTime = formData.get('tt_end_time');

        // Get selected subjects
        const selectedSubjects = Array.from(document.querySelectorAll('input[name="tt_subject"]:checked')).map(cb => cb.value);

        if (selectedSubjects.length === 0) {
            alert('Please select at least one subject');
            return;
        }

        // Create time table entries for each selected subject
        const timeTableEntries = selectedSubjects.map((subject, index) => {
            const examDateTime = new Date(examDate);
            examDateTime.setDate(examDateTime.getDate() + index); // Spread exams across multiple days

            return {
                id: Date.now() + index,
                class: classValue,
                subject: subject,
                exam_date: examDateTime.toISOString().split('T')[0],
                start_time: startTime,
                end_time: endTime,
                duration: this.calculateDuration(startTime, endTime),
                created_date: new Date().toISOString()
            };
        });

        // Add entries to time table
        this.examTimeTable.push(...timeTableEntries);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        e.target.reset();
        this.loadTimeTable();
        alert('Time table entries created successfully!');
    }

    calculateDuration(startTime, endTime) {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        const diffMinutes = (end - start) / (1000 * 60);
        return diffMinutes;
    }

    saveTimeTableInfo() {
        const title = document.getElementById('timetableTitle').value;
        const session = document.getElementById('examSession').value;
        const instructions = document.getElementById('instructions').value;

        this.timeTableInfo = {
            title: title,
            session: session,
            instructions: instructions
        };

        localStorage.setItem('timeTableInfo', JSON.stringify(this.timeTableInfo));
        alert('Time table information saved successfully!');
    }

    generateTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        const previewWindow = window.open('', '_blank', 'width=1000,height=800');
        const schoolInfo = this.schoolInfo;
        const timeTableInfo = this.timeTableInfo;

        // Group entries by date
        const groupedByDate = {};
        this.examTimeTable.forEach(entry => {
            if (!groupedByDate[entry.exam_date]) {
                groupedByDate[entry.exam_date] = [];
            }
            groupedByDate[entry.exam_date].push(entry);
        });

        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Exam Time Table</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 1000px;
                        margin: 0 auto;
                        padding: 20px;
                        background: white;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 3px solid #333;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .school-logo {
                        max-height: 80px;
                        margin-bottom: 10px;
                    }
                    .school-name {
                        font-size: 28px;
                        font-weight: bold;
                        color: #2c3e50;
                        margin: 10px 0;
                    }
                    .timetable-title {
                        font-size: 24px;
                        color: #e74c3c;
                        margin: 15px 0;
                        text-decoration: underline;
                    }
                    .exam-info {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin: 20px 0;
                        padding: 15px;
                        background: #f8f9fa;
                        border-radius: 5px;
                    }
                    .info-item {
                        text-align: center;
                    }
                    .info-label {
                        font-weight: bold;
                        color: #495057;
                    }
                    .info-value {
                        font-size: 18px;
                        color: #2c3e50;
                        margin-top: 5px;
                    }
                    .timetable-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    .timetable-table th, .timetable-table td {
                        border: 1px solid #ddd;
                        padding: 15px;
                        text-align: center;
                    }
                    .timetable-table th {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        font-weight: bold;
                    }
                    .timetable-table tr:nth-child(even) {
                        background: #f8f9fa;
                    }
                    .timetable-table tr:hover {
                        background: #e3f2fd;
                    }
                    .date-header {
                        background: #e9ecef !important;
                        font-weight: bold;
                        font-size: 16px;
                        color: #2c3e50;
                    }
                    .subject-name {
                        text-align: left;
                        font-weight: bold;
                        color: #2c3e50;
                    }
                    .instructions {
                        margin: 30px 0;
                        padding: 20px;
                        background: #fff3cd;
                        border: 1px solid #ffeaa7;
                        border-radius: 5px;
                    }
                    .instructions h4 {
                        color: #856404;
                        margin-top: 0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 2px solid #ddd;
                        color: #666;
                        font-size: 12px;
                    }
                    @media print {
                        body { margin: 0; padding: 15px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${schoolInfo.logo || ''}" alt="School Logo" class="school-logo" style="${schoolInfo.logo ? '' : 'display: none;'}">
                    <div class="school-name">${schoolInfo.name || 'School Management System'}</div>
                    <div class="school-address">${schoolInfo.address || ''}</div>
                    <div class="academic-year">Academic Year: ${schoolInfo.academicYear || ''}</div>
                </div>

                <div class="timetable-title">${timeTableInfo.title || 'EXAM TIME TABLE'}</div>

                <div class="exam-info">
                    <div class="info-item">
                        <div class="info-label">Exam Session</div>
                        <div class="info-value">${timeTableInfo.session || 'Not Specified'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Total Subjects</div>
                        <div class="info-value">${this.examTimeTable.length}</div>
                    </div>
                </div>

                <table class="timetable-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr ${index === 0 ? `class="date-header"` : ''}>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td class="subject-name">${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} minutes</td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>

                ${timeTableInfo.instructions ? `
                    <div class="instructions">
                        <h4>Important Instructions:</h4>
                        <p>${timeTableInfo.instructions.replace(/\n/g, '<br>')}</p>
                    </div>
                ` : ''}

                <div class="footer">
                    <p><strong>Generated by School Management System</strong></p>
                    <p>This time table is subject to change. Students are advised to check for updates regularly.</p>
                    <p>Generated on: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}</p>
                </div>

                <div class="no-print" style="text-align: center; margin-top: 30px;">
                    <button onclick="window.print()" style="margin-right: 10px; padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Time Table</button>
                    <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
                </div>
            </body>
            </html>
        `);
    }

    previewTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        this.generateTimeTable();
    }

    printTimeTable() {
        this.generateTimeTable();
        setTimeout(() => {
            window.print();
        }, 1000);
    }

    loadTimeTable() {
        const timetableTable = document.getElementById('timetableTable');
        const timetableInfo = document.getElementById('timetableInfo');

        if (this.examTimeTable.length === 0) {
            timetableTable.innerHTML = `
                <div class="no-timetable">
                    <p>No exam time table created yet.</p>
                    <p>Create your first time table to get started!</p>
                </div>
            `;
            timetableInfo.textContent = 'No time table created yet. Create your first time table!';
        } else {
            // Group entries by date for better display
            const groupedByDate = {};
            this.examTimeTable.forEach(entry => {
                if (!groupedByDate[entry.exam_date]) {
                    groupedByDate[entry.exam_date] = [];
                }
                groupedByDate[entry.exam_date].push(entry);
            });

            let html = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td>${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} min</td>
                                    <td>
                                        <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteTimeTableEntry('${entry.id}')">Remove</button>
                                    </td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>
            `;

            timetableTable.innerHTML = html;
            timetableInfo.textContent = `Time table with ${this.examTimeTable.length} exam(s) created successfully!`;
        }
    }

    deleteTimeTableEntry(id) {
        this.examTimeTable = this.examTimeTable.filter(entry => entry.id !== id);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        this.loadTimeTable();
    }

    loadSubjectsForTimeTable() {
        const classSelect = document.getElementById('ttClass');
        const subjectsSelection = document.getElementById('subjectsSelection');
        if (!subjectsSelection) return;

        const classValue = classSelect.value;
        if (!classValue) {
            subjectsSelection.innerHTML = '<p class="no-data">Select a class to load subjects</p>';
            return;
        }

        // Get subjects for the selected class
        const subjects = this.getSubjectsForClass(classValue);

        let html = '<div class="subjects-checkbox-grid">';
        subjects.forEach(subject => {
            html += `
                <div class="subject-checkbox-item">
                    <label class="checkbox-label">
                        <input type="checkbox" name="tt_subject" value="${subject}" checked>
                        <span class="checkmark"></span>
                        ${subject}
                    </label>
                </div>
            `;
        });
        html += '</div>';

        subjectsSelection.innerHTML = html;
    }

    handleTimeTableForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const classValue = formData.get('tt_class');
        const examDate = formData.get('tt_exam_date');
        const startTime = formData.get('tt_start_time');
        const endTime = formData.get('tt_end_time');

        // Get selected subjects
        const selectedSubjects = Array.from(document.querySelectorAll('input[name="tt_subject"]:checked')).map(cb => cb.value);

        if (selectedSubjects.length === 0) {
            alert('Please select at least one subject');
            return;
        }

        // Create time table entries for each selected subject
        const timeTableEntries = selectedSubjects.map((subject, index) => {
            const examDateTime = new Date(examDate);
            examDateTime.setDate(examDateTime.getDate() + index); // Spread exams across multiple days

            return {
                id: Date.now() + index,
                class: classValue,
                subject: subject,
                exam_date: examDateTime.toISOString().split('T')[0],
                start_time: startTime,
                end_time: endTime,
                duration: this.calculateDuration(startTime, endTime),
                created_date: new Date().toISOString()
            };
        });

        // Add entries to time table
        this.examTimeTable.push(...timeTableEntries);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        e.target.reset();
        this.loadTimeTable();
        alert('Time table entries created successfully!');
    }

    calculateDuration(startTime, endTime) {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        const diffMinutes = (end - start) / (1000 * 60);
        return diffMinutes;
    }

    saveTimeTableInfo() {
        const title = document.getElementById('timetableTitle').value;
        const session = document.getElementById('examSession').value;
        const instructions = document.getElementById('instructions').value;

        this.timeTableInfo = {
            title: title,
            session: session,
            instructions: instructions
        };

        localStorage.setItem('timeTableInfo', JSON.stringify(this.timeTableInfo));
        alert('Time table information saved successfully!');
    }

    generateTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        const previewWindow = window.open('', '_blank', 'width=1000,height=800');
        const schoolInfo = this.schoolInfo;
        const timeTableInfo = this.timeTableInfo;

        // Group entries by date
        const groupedByDate = {};
        this.examTimeTable.forEach(entry => {
            if (!groupedByDate[entry.exam_date]) {
                groupedByDate[entry.exam_date] = [];
            }
            groupedByDate[entry.exam_date].push(entry);
        });

        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Exam Time Table</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 1000px;
                        margin: 0 auto;
                        padding: 20px;
                        background: white;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 3px solid #333;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .school-logo {
                        max-height: 80px;
                        margin-bottom: 10px;
                    }
                    .school-name {
                        font-size: 28px;
                        font-weight: bold;
                        color: #2c3e50;
                        margin: 10px 0;
                    }
                    .timetable-title {
                        font-size: 24px;
                        color: #e74c3c;
                        margin: 15px 0;
                        text-decoration: underline;
                    }
                    .exam-info {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin: 20px 0;
                        padding: 15px;
                        background: #f8f9fa;
                        border-radius: 5px;
                    }
                    .info-item {
                        text-align: center;
                    }
                    .info-label {
                        font-weight: bold;
                        color: #495057;
                    }
                    .info-value {
                        font-size: 18px;
                        color: #2c3e50;
                        margin-top: 5px;
                    }
                    .timetable-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    .timetable-table th, .timetable-table td {
                        border: 1px solid #ddd;
                        padding: 15px;
                        text-align: center;
                    }
                    .timetable-table th {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        font-weight: bold;
                    }
                    .timetable-table tr:nth-child(even) {
                        background: #f8f9fa;
                    }
                    .timetable-table tr:hover {
                        background: #e3f2fd;
                    }
                    .date-header {
                        background: #e9ecef !important;
                        font-weight: bold;
                        font-size: 16px;
                        color: #2c3e50;
                    }
                    .subject-name {
                        text-align: left;
                        font-weight: bold;
                        color: #2c3e50;
                    }
                    .instructions {
                        margin: 30px 0;
                        padding: 20px;
                        background: #fff3cd;
                        border: 1px solid #ffeaa7;
                        border-radius: 5px;
                    }
                    .instructions h4 {
                        color: #856404;
                        margin-top: 0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 2px solid #ddd;
                        color: #666;
                        font-size: 12px;
                    }
                    @media print {
                        body { margin: 0; padding: 15px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${schoolInfo.logo || ''}" alt="School Logo" class="school-logo" style="${schoolInfo.logo ? '' : 'display: none;'}">
                    <div class="school-name">${schoolInfo.name || 'School Management System'}</div>
                    <div class="school-address">${schoolInfo.address || ''}</div>
                    <div class="academic-year">Academic Year: ${schoolInfo.academicYear || ''}</div>
                </div>

                <div class="timetable-title">${timeTableInfo.title || 'EXAM TIME TABLE'}</div>

                <div class="exam-info">
                    <div class="info-item">
                        <div class="info-label">Exam Session</div>
                        <div class="info-value">${timeTableInfo.session || 'Not Specified'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Total Subjects</div>
                        <div class="info-value">${this.examTimeTable.length}</div>
                    </div>
                </div>

                <table class="timetable-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr ${index === 0 ? `class="date-header"` : ''}>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td class="subject-name">${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} minutes</td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>

                ${timeTableInfo.instructions ? `
                    <div class="instructions">
                        <h4>Important Instructions:</h4>
                        <p>${timeTableInfo.instructions.replace(/\n/g, '<br>')}</p>
                    </div>
                ` : ''}

                <div class="footer">
                    <p><strong>Generated by School Management System</strong></p>
                    <p>This time table is subject to change. Students are advised to check for updates regularly.</p>
                    <p>Generated on: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}</p>
                </div>

                <div class="no-print" style="text-align: center; margin-top: 30px;">
                    <button onclick="window.print()" style="margin-right: 10px; padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Time Table</button>
                    <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
                </div>
            </body>
            </html>
        `);
    }

    previewTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        this.generateTimeTable();
    }

    printTimeTable() {
        this.generateTimeTable();
        setTimeout(() => {
            window.print();
        }, 1000);
    }

    loadTimeTable() {
        const timetableTable = document.getElementById('timetableTable');
        const timetableInfo = document.getElementById('timetableInfo');

        if (this.examTimeTable.length === 0) {
            timetableTable.innerHTML = `
                <div class="no-timetable">
                    <p>No exam time table created yet.</p>
                    <p>Create your first time table to get started!</p>
                </div>
            `;
            timetableInfo.textContent = 'No time table created yet. Create your first time table!';
        } else {
            // Group entries by date for better display
            const groupedByDate = {};
            this.examTimeTable.forEach(entry => {
                if (!groupedByDate[entry.exam_date]) {
                    groupedByDate[entry.exam_date] = [];
                }
                groupedByDate[entry.exam_date].push(entry);
            });

            let html = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td>${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} min</td>
                                    <td>
                                        <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteTimeTableEntry('${entry.id}')">Remove</button>
                                    </td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>
            `;

            timetableTable.innerHTML = html;
            timetableInfo.textContent = `Time table with ${this.examTimeTable.length} exam(s) created successfully!`;
        }
    }

    deleteTimeTableEntry(id) {
        this.examTimeTable = this.examTimeTable.filter(entry => entry.id !== id);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        this.loadTimeTable();
    }

    loadSubjectsForTimeTable() {
        const classSelect = document.getElementById('ttClass');
        const subjectsSelection = document.getElementById('subjectsSelection');
        if (!subjectsSelection) return;

        const classValue = classSelect.value;
        if (!classValue) {
            subjectsSelection.innerHTML = '<p class="no-data">Select a class to load subjects</p>';
            return;
        }

        // Get subjects for the selected class
        const subjects = this.getSubjectsForClass(classValue);

        let html = '<div class="subjects-checkbox-grid">';
        subjects.forEach(subject => {
            html += `
                <div class="subject-checkbox-item">
                    <label class="checkbox-label">
                        <input type="checkbox" name="tt_subject" value="${subject}" checked>
                        <span class="checkmark"></span>
                        ${subject}
                    </label>
                </div>
            `;
        });
        html += '</div>';

        subjectsSelection.innerHTML = html;
    }

    handleTimeTableForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const classValue = formData.get('tt_class');
        const examDate = formData.get('tt_exam_date');
        const startTime = formData.get('tt_start_time');
        const endTime = formData.get('tt_end_time');

        // Get selected subjects
        const selectedSubjects = Array.from(document.querySelectorAll('input[name="tt_subject"]:checked')).map(cb => cb.value);

        if (selectedSubjects.length === 0) {
            alert('Please select at least one subject');
            return;
        }

        // Create time table entries for each selected subject
        const timeTableEntries = selectedSubjects.map((subject, index) => {
            const examDateTime = new Date(examDate);
            examDateTime.setDate(examDateTime.getDate() + index); // Spread exams across multiple days

            return {
                id: Date.now() + index,
                class: classValue,
                subject: subject,
                exam_date: examDateTime.toISOString().split('T')[0],
                start_time: startTime,
                end_time: endTime,
                duration: this.calculateDuration(startTime, endTime),
                created_date: new Date().toISOString()
            };
        });

        // Add entries to time table
        this.examTimeTable.push(...timeTableEntries);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        e.target.reset();
        this.loadTimeTable();
        alert('Time table entries created successfully!');
    }

    calculateDuration(startTime, endTime) {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        const diffMinutes = (end - start) / (1000 * 60);
        return diffMinutes;
    }

    saveTimeTableInfo() {
        const title = document.getElementById('timetableTitle').value;
        const session = document.getElementById('examSession').value;
        const instructions = document.getElementById('instructions').value;

        this.timeTableInfo = {
            title: title,
            session: session,
            instructions: instructions
        };

        localStorage.setItem('timeTableInfo', JSON.stringify(this.timeTableInfo));
        alert('Time table information saved successfully!');
    }

    generateTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        const previewWindow = window.open('', '_blank', 'width=1000,height=800');
        const schoolInfo = this.schoolInfo;
        const timeTableInfo = this.timeTableInfo;

        // Group entries by date
        const groupedByDate = {};
        this.examTimeTable.forEach(entry => {
            if (!groupedByDate[entry.exam_date]) {
                groupedByDate[entry.exam_date] = [];
            }
            groupedByDate[entry.exam_date].push(entry);
        });

        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Exam Time Table</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 1000px;
                        margin: 0 auto;
                        padding: 20px;
                        background: white;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 3px solid #333;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .school-logo {
                        max-height: 80px;
                        margin-bottom: 10px;
                    }
                    .school-name {
                        font-size: 28px;
                        font-weight: bold;
                        color: #2c3e50;
                        margin: 10px 0;
                    }
                    .timetable-title {
                        font-size: 24px;
                        color: #e74c3c;
                        margin: 15px 0;
                        text-decoration: underline;
                    }
                    .exam-info {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin: 20px 0;
                        padding: 15px;
                        background: #f8f9fa;
                        border-radius: 5px;
                    }
                    .info-item {
                        text-align: center;
                    }
                    .info-label {
                        font-weight: bold;
                        color: #495057;
                    }
                    .info-value {
                        font-size: 18px;
                        color: #2c3e50;
                        margin-top: 5px;
                    }
                    .timetable-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    .timetable-table th, .timetable-table td {
                        border: 1px solid #ddd;
                        padding: 15px;
                        text-align: center;
                    }
                    .timetable-table th {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        font-weight: bold;
                    }
                    .timetable-table tr:nth-child(even) {
                        background: #f8f9fa;
                    }
                    .timetable-table tr:hover {
                        background: #e3f2fd;
                    }
                    .date-header {
                        background: #e9ecef !important;
                        font-weight: bold;
                        font-size: 16px;
                        color: #2c3e50;
                    }
                    .subject-name {
                        text-align: left;
                        font-weight: bold;
                        color: #2c3e50;
                    }
                    .instructions {
                        margin: 30px 0;
                        padding: 20px;
                        background: #fff3cd;
                        border: 1px solid #ffeaa7;
                        border-radius: 5px;
                    }
                    .instructions h4 {
                        color: #856404;
                        margin-top: 0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 2px solid #ddd;
                        color: #666;
                        font-size: 12px;
                    }
                    @media print {
                        body { margin: 0; padding: 15px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${schoolInfo.logo || ''}" alt="School Logo" class="school-logo" style="${schoolInfo.logo ? '' : 'display: none;'}">
                    <div class="school-name">${schoolInfo.name || 'School Management System'}</div>
                    <div class="school-address">${schoolInfo.address || ''}</div>
                    <div class="academic-year">Academic Year: ${schoolInfo.academicYear || ''}</div>
                </div>

                <div class="timetable-title">${timeTableInfo.title || 'EXAM TIME TABLE'}</div>

                <div class="exam-info">
                    <div class="info-item">
                        <div class="info-label">Exam Session</div>
                        <div class="info-value">${timeTableInfo.session || 'Not Specified'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Total Subjects</div>
                        <div class="info-value">${this.examTimeTable.length}</div>
                    </div>
                </div>

                <table class="timetable-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr ${index === 0 ? `class="date-header"` : ''}>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td class="subject-name">${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} minutes</td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>

                ${timeTableInfo.instructions ? `
                    <div class="instructions">
                        <h4>Important Instructions:</h4>
                        <p>${timeTableInfo.instructions.replace(/\n/g, '<br>')}</p>
                    </div>
                ` : ''}

                <div class="footer">
                    <p><strong>Generated by School Management System</strong></p>
                    <p>This time table is subject to change. Students are advised to check for updates regularly.</p>
                    <p>Generated on: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}</p>
                </div>

                <div class="no-print" style="text-align: center; margin-top: 30px;">
                    <button onclick="window.print()" style="margin-right: 10px; padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Time Table</button>
                    <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
                </div>
            </body>
            </html>
        `);
    }

    previewTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        this.generateTimeTable();
    }

    printTimeTable() {
        this.generateTimeTable();
        setTimeout(() => {
            window.print();
        }, 1000);
    }

    loadTimeTable() {
        const timetableTable = document.getElementById('timetableTable');
        const timetableInfo = document.getElementById('timetableInfo');

        if (this.examTimeTable.length === 0) {
            timetableTable.innerHTML = `
                <div class="no-timetable">
                    <p>No exam time table created yet.</p>
                    <p>Create your first time table to get started!</p>
                </div>
            `;
            timetableInfo.textContent = 'No time table created yet. Create your first time table!';
        } else {
            // Group entries by date for better display
            const groupedByDate = {};
            this.examTimeTable.forEach(entry => {
                if (!groupedByDate[entry.exam_date]) {
                    groupedByDate[entry.exam_date] = [];
                }
                groupedByDate[entry.exam_date].push(entry);
            });

            let html = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td>${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} min</td>
                                    <td>
                                        <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteTimeTableEntry('${entry.id}')">Remove</button>
                                    </td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>
            `;

            timetableTable.innerHTML = html;
            timetableInfo.textContent = `Time table with ${this.examTimeTable.length} exam(s) created successfully!`;
        }
    }

    deleteTimeTableEntry(id) {
        this.examTimeTable = this.examTimeTable.filter(entry => entry.id !== id);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        this.loadTimeTable();
    }

    loadSubjectsForTimeTable() {
        const classSelect = document.getElementById('ttClass');
        const subjectsSelection = document.getElementById('subjectsSelection');
        if (!subjectsSelection) return;

        const classValue = classSelect.value;
        if (!classValue) {
            subjectsSelection.innerHTML = '<p class="no-data">Select a class to load subjects</p>';
            return;
        }

        // Get subjects for the selected class
        const subjects = this.getSubjectsForClass(classValue);

        let html = '<div class="subjects-checkbox-grid">';
        subjects.forEach(subject => {
            html += `
                <div class="subject-checkbox-item">
                    <label class="checkbox-label">
                        <input type="checkbox" name="tt_subject" value="${subject}" checked>
                        <span class="checkmark"></span>
                        ${subject}
                    </label>
                </div>
            `;
        });
        html += '</div>';

        subjectsSelection.innerHTML = html;
    }

    handleTimeTableForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const classValue = formData.get('tt_class');
        const examDate = formData.get('tt_exam_date');
        const startTime = formData.get('tt_start_time');
        const endTime = formData.get('tt_end_time');

        // Get selected subjects
        const selectedSubjects = Array.from(document.querySelectorAll('input[name="tt_subject"]:checked')).map(cb => cb.value);

        if (selectedSubjects.length === 0) {
            alert('Please select at least one subject');
            return;
        }

        // Create time table entries for each selected subject
        const timeTableEntries = selectedSubjects.map((subject, index) => {
            const examDateTime = new Date(examDate);
            examDateTime.setDate(examDateTime.getDate() + index); // Spread exams across multiple days

            return {
                id: Date.now() + index,
                class: classValue,
                subject: subject,
                exam_date: examDateTime.toISOString().split('T')[0],
                start_time: startTime,
                end_time: endTime,
                duration: this.calculateDuration(startTime, endTime),
                created_date: new Date().toISOString()
            };
        });

        // Add entries to time table
        this.examTimeTable.push(...timeTableEntries);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        e.target.reset();
        this.loadTimeTable();
        alert('Time table entries created successfully!');
    }

    calculateDuration(startTime, endTime) {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        const diffMinutes = (end - start) / (1000 * 60);
        return diffMinutes;
    }

    saveTimeTableInfo() {
        const title = document.getElementById('timetableTitle').value;
        const session = document.getElementById('examSession').value;
        const instructions = document.getElementById('instructions').value;

        this.timeTableInfo = {
            title: title,
            session: session,
            instructions: instructions
        };

        localStorage.setItem('timeTableInfo', JSON.stringify(this.timeTableInfo));
        alert('Time table information saved successfully!');
    }

    generateTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        const previewWindow = window.open('', '_blank', 'width=1000,height=800');
        const schoolInfo = this.schoolInfo;
        const timeTableInfo = this.timeTableInfo;

        // Group entries by date
        const groupedByDate = {};
        this.examTimeTable.forEach(entry => {
            if (!groupedByDate[entry.exam_date]) {
                groupedByDate[entry.exam_date] = [];
            }
            groupedByDate[entry.exam_date].push(entry);
        });

        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Exam Time Table</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 1000px;
                        margin: 0 auto;
                        padding: 20px;
                        background: white;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 3px solid #333;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .school-logo {
                        max-height: 80px;
                        margin-bottom: 10px;
                    }
                    .school-name {
                        font-size: 28px;
                        font-weight: bold;
                        color: #2c3e50;
                        margin: 10px 0;
                    }
                    .timetable-title {
                        font-size: 24px;
                        color: #e74c3c;
                        margin: 15px 0;
                        text-decoration: underline;
                    }
                    .exam-info {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin: 20px 0;
                        padding: 15px;
                        background: #f8f9fa;
                        border-radius: 5px;
                    }
                    .info-item {
                        text-align: center;
                    }
                    .info-label {
                        font-weight: bold;
                        color: #495057;
                    }
                    .info-value {
                        font-size: 18px;
                        color: #2c3e50;
                        margin-top: 5px;
                    }
                    .timetable-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    .timetable-table th, .timetable-table td {
                        border: 1px solid #ddd;
                        padding: 15px;
                        text-align: center;
                    }
                    .timetable-table th {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        font-weight: bold;
                    }
                    .timetable-table tr:nth-child(even) {
                        background: #f8f9fa;
                    }
                    .timetable-table tr:hover {
                        background: #e3f2fd;
                    }
                    .date-header {
                        background: #e9ecef !important;
                        font-weight: bold;
                        font-size: 16px;
                        color: #2c3e50;
                    }
                    .subject-name {
                        text-align: left;
                        font-weight: bold;
                        color: #2c3e50;
                    }
                    .instructions {
                        margin: 30px 0;
                        padding: 20px;
                        background: #fff3cd;
                        border: 1px solid #ffeaa7;
                        border-radius: 5px;
                    }
                    .instructions h4 {
                        color: #856404;
                        margin-top: 0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 2px solid #ddd;
                        color: #666;
                        font-size: 12px;
                    }
                    @media print {
                        body { margin: 0; padding: 15px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${schoolInfo.logo || ''}" alt="School Logo" class="school-logo" style="${schoolInfo.logo ? '' : 'display: none;'}">
                    <div class="school-name">${schoolInfo.name || 'School Management System'}</div>
                    <div class="school-address">${schoolInfo.address || ''}</div>
                    <div class="academic-year">Academic Year: ${schoolInfo.academicYear || ''}</div>
                </div>

                <div class="timetable-title">${timeTableInfo.title || 'EXAM TIME TABLE'}</div>

                <div class="exam-info">
                    <div class="info-item">
                        <div class="info-label">Exam Session</div>
                        <div class="info-value">${timeTableInfo.session || 'Not Specified'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Total Subjects</div>
                        <div class="info-value">${this.examTimeTable.length}</div>
                    </div>
                </div>

                <table class="timetable-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr ${index === 0 ? `class="date-header"` : ''}>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td class="subject-name">${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} minutes</td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>

                ${timeTableInfo.instructions ? `
                    <div class="instructions">
                        <h4>Important Instructions:</h4>
                        <p>${timeTableInfo.instructions.replace(/\n/g, '<br>')}</p>
                    </div>
                ` : ''}

                <div class="footer">
                    <p><strong>Generated by School Management System</strong></p>
                    <p>This time table is subject to change. Students are advised to check for updates regularly.</p>
                    <p>Generated on: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}</p>
                </div>

                <div class="no-print" style="text-align: center; margin-top: 30px;">
                    <button onclick="window.print()" style="margin-right: 10px; padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Time Table</button>
                    <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
                </div>
            </body>
            </html>
        `);
    }

    previewTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        this.generateTimeTable();
    }

    printTimeTable() {
        this.generateTimeTable();
        setTimeout(() => {
            window.print();
        }, 1000);
    }

    loadTimeTable() {
        const timetableTable = document.getElementById('timetableTable');
        const timetableInfo = document.getElementById('timetableInfo');

        if (this.examTimeTable.length === 0) {
            timetableTable.innerHTML = `
                <div class="no-timetable">
                    <p>No exam time table created yet.</p>
                    <p>Create your first time table to get started!</p>
                </div>
            `;
            timetableInfo.textContent = 'No time table created yet. Create your first time table!';
        } else {
            // Group entries by date for better display
            const groupedByDate = {};
            this.examTimeTable.forEach(entry => {
                if (!groupedByDate[entry.exam_date]) {
                    groupedByDate[entry.exam_date] = [];
                }
                groupedByDate[entry.exam_date].push(entry);
            });

            let html = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td>${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} min</td>
                                    <td>
                                        <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteTimeTableEntry('${entry.id}')">Remove</button>
                                    </td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>
            `;

            timetableTable.innerHTML = html;
            timetableInfo.textContent = `Time table with ${this.examTimeTable.length} exam(s) created successfully!`;
        }
    }

    deleteTimeTableEntry(id) {
        this.examTimeTable = this.examTimeTable.filter(entry => entry.id !== id);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        this.loadTimeTable();
    }

    loadSubjectsForTimeTable() {
        const classSelect = document.getElementById('ttClass');
        const subjectsSelection = document.getElementById('subjectsSelection');
        if (!subjectsSelection) return;

        const classValue = classSelect.value;
        if (!classValue) {
            subjectsSelection.innerHTML = '<p class="no-data">Select a class to load subjects</p>';
            return;
        }

        // Get subjects for the selected class
        const subjects = this.getSubjectsForClass(classValue);

        let html = '<div class="subjects-checkbox-grid">';
        subjects.forEach(subject => {
            html += `
                <div class="subject-checkbox-item">
                    <label class="checkbox-label">
                        <input type="checkbox" name="tt_subject" value="${subject}" checked>
                        <span class="checkmark"></span>
                        ${subject}
                    </label>
                </div>
            `;
        });
        html += '</div>';

        subjectsSelection.innerHTML = html;
    }

    handleTimeTableForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const classValue = formData.get('tt_class');
        const examDate = formData.get('tt_exam_date');
        const startTime = formData.get('tt_start_time');
        const endTime = formData.get('tt_end_time');

        // Get selected subjects
        const selectedSubjects = Array.from(document.querySelectorAll('input[name="tt_subject"]:checked')).map(cb => cb.value);

        if (selectedSubjects.length === 0) {
            alert('Please select at least one subject');
            return;
        }

        // Create time table entries for each selected subject
        const timeTableEntries = selectedSubjects.map((subject, index) => {
            const examDateTime = new Date(examDate);
            examDateTime.setDate(examDateTime.getDate() + index); // Spread exams across multiple days

            return {
                id: Date.now() + index,
                class: classValue,
                subject: subject,
                exam_date: examDateTime.toISOString().split('T')[0],
                start_time: startTime,
                end_time: endTime,
                duration: this.calculateDuration(startTime, endTime),
                created_date: new Date().toISOString()
            };
        });

        // Add entries to time table
        this.examTimeTable.push(...timeTableEntries);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        e.target.reset();
        this.loadTimeTable();
        alert('Time table entries created successfully!');
    }

    calculateDuration(startTime, endTime) {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        const diffMinutes = (end - start) / (1000 * 60);
        return diffMinutes;
    }

    saveTimeTableInfo() {
        const title = document.getElementById('timetableTitle').value;
        const session = document.getElementById('examSession').value;
        const instructions = document.getElementById('instructions').value;

        this.timeTableInfo = {
            title: title,
            session: session,
            instructions: instructions
        };

        localStorage.setItem('timeTableInfo', JSON.stringify(this.timeTableInfo));
        alert('Time table information saved successfully!');
    }

    generateTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        const previewWindow = window.open('', '_blank', 'width=1000,height=800');
        const schoolInfo = this.schoolInfo;
        const timeTableInfo = this.timeTableInfo;

        // Group entries by date
        const groupedByDate = {};
        this.examTimeTable.forEach(entry => {
            if (!groupedByDate[entry.exam_date]) {
                groupedByDate[entry.exam_date] = [];
            }
            groupedByDate[entry.exam_date].push(entry);
        });

        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Exam Time Table</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 1000px;
                        margin: 0 auto;
                        padding: 20px;
                        background: white;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 3px solid #333;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .school-logo {
                        max-height: 80px;
                        margin-bottom: 10px;
                    }
                    .school-name {
                        font-size: 28px;
                        font-weight: bold;
                        color: #2c3e50;
                        margin: 10px 0;
                    }
                    .timetable-title {
                        font-size: 24px;
                        color: #e74c3c;
                        margin: 15px 0;
                        text-decoration: underline;
                    }
                    .exam-info {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin: 20px 0;
                        padding: 15px;
                        background: #f8f9fa;
                        border-radius: 5px;
                    }
                    .info-item {
                        text-align: center;
                    }
                    .info-label {
                        font-weight: bold;
                        color: #495057;
                    }
                    .info-value {
                        font-size: 18px;
                        color: #2c3e50;
                        margin-top: 5px;
                    }
                    .timetable-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    .timetable-table th, .timetable-table td {
                        border: 1px solid #ddd;
                        padding: 15px;
                        text-align: center;
                    }
                    .timetable-table th {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        font-weight: bold;
                    }
                    .timetable-table tr:nth-child(even) {
                        background: #f8f9fa;
                    }
                    .timetable-table tr:hover {
                        background: #e3f2fd;
                    }
                    .date-header {
                        background: #e9ecef !important;
                        font-weight: bold;
                        font-size: 16px;
                        color: #2c3e50;
                    }
                    .subject-name {
                        text-align: left;
                        font-weight: bold;
                        color: #2c3e50;
                    }
                    .instructions {
                        margin: 30px 0;
                        padding: 20px;
                        background: #fff3cd;
                        border: 1px solid #ffeaa7;
                        border-radius: 5px;
                    }
                    .instructions h4 {
                        color: #856404;
                        margin-top: 0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 2px solid #ddd;
                        color: #666;
                        font-size: 12px;
                    }
                    @media print {
                        body { margin: 0; padding: 15px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${schoolInfo.logo || ''}" alt="School Logo" class="school-logo" style="${schoolInfo.logo ? '' : 'display: none;'}">
                    <div class="school-name">${schoolInfo.name || 'School Management System'}</div>
                    <div class="school-address">${schoolInfo.address || ''}</div>
                    <div class="academic-year">Academic Year: ${schoolInfo.academicYear || ''}</div>
                </div>

                <div class="timetable-title">${timeTableInfo.title || 'EXAM TIME TABLE'}</div>

                <div class="exam-info">
                    <div class="info-item">
                        <div class="info-label">Exam Session</div>
                        <div class="info-value">${timeTableInfo.session || 'Not Specified'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Total Subjects</div>
                        <div class="info-value">${this.examTimeTable.length}</div>
                    </div>
                </div>

                <table class="timetable-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr ${index === 0 ? `class="date-header"` : ''}>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td class="subject-name">${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} minutes</td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>

                ${timeTableInfo.instructions ? `
                    <div class="instructions">
                        <h4>Important Instructions:</h4>
                        <p>${timeTableInfo.instructions.replace(/\n/g, '<br>')}</p>
                    </div>
                ` : ''}

                <div class="footer">
                    <p><strong>Generated by School Management System</strong></p>
                    <p>This time table is subject to change. Students are advised to check for updates regularly.</p>
                    <p>Generated on: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}</p>
                </div>

                <div class="no-print" style="text-align: center; margin-top: 30px;">
                    <button onclick="window.print()" style="margin-right: 10px; padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Time Table</button>
                    <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
                </div>
            </body>
            </html>
        `);
    }

    previewTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        this.generateTimeTable();
    }

    printTimeTable() {
        this.generateTimeTable();
        setTimeout(() => {
            window.print();
        }, 1000);
    }

    loadTimeTable() {
        const timetableTable = document.getElementById('timetableTable');
        const timetableInfo = document.getElementById('timetableInfo');

        if (this.examTimeTable.length === 0) {
            timetableTable.innerHTML = `
                <div class="no-timetable">
                    <p>No exam time table created yet.</p>
                    <p>Create your first time table to get started!</p>
                </div>
            `;
            timetableInfo.textContent = 'No time table created yet. Create your first time table!';
        } else {
            // Group entries by date for better display
            const groupedByDate = {};
            this.examTimeTable.forEach(entry => {
                if (!groupedByDate[entry.exam_date]) {
                    groupedByDate[entry.exam_date] = [];
                }
                groupedByDate[entry.exam_date].push(entry);
            });

            let html = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td>${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} min</td>
                                    <td>
                                        <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteTimeTableEntry('${entry.id}')">Remove</button>
                                    </td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>
            `;

            timetableTable.innerHTML = html;
            timetableInfo.textContent = `Time table with ${this.examTimeTable.length} exam(s) created successfully!`;
        }
    }

    deleteTimeTableEntry(id) {
        this.examTimeTable = this.examTimeTable.filter(entry => entry.id !== id);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        this.loadTimeTable();
    }

    loadSubjectsForTimeTable() {
        const classSelect = document.getElementById('ttClass');
        const subjectsSelection = document.getElementById('subjectsSelection');
        if (!subjectsSelection) return;

        const classValue = classSelect.value;
        if (!classValue) {
            subjectsSelection.innerHTML = '<p class="no-data">Select a class to load subjects</p>';
            return;
        }

        // Get subjects for the selected class
        const subjects = this.getSubjectsForClass(classValue);

        let html = '<div class="subjects-checkbox-grid">';
        subjects.forEach(subject => {
            html += `
                <div class="subject-checkbox-item">
                    <label class="checkbox-label">
                        <input type="checkbox" name="tt_subject" value="${subject}" checked>
                        <span class="checkmark"></span>
                        ${subject}
                    </label>
                </div>
            `;
        });
        html += '</div>';

        subjectsSelection.innerHTML = html;
    }

    handleTimeTableForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const classValue = formData.get('tt_class');
        const examDate = formData.get('tt_exam_date');
        const startTime = formData.get('tt_start_time');
        const endTime = formData.get('tt_end_time');

        // Get selected subjects
        const selectedSubjects = Array.from(document.querySelectorAll('input[name="tt_subject"]:checked')).map(cb => cb.value);

        if (selectedSubjects.length === 0) {
            alert('Please select at least one subject');
            return;
        }

        // Create time table entries for each selected subject
        const timeTableEntries = selectedSubjects.map((subject, index) => {
            const examDateTime = new Date(examDate);
            examDateTime.setDate(examDateTime.getDate() + index); // Spread exams across multiple days

            return {
                id: Date.now() + index,
                class: classValue,
                subject: subject,
                exam_date: examDateTime.toISOString().split('T')[0],
                start_time: startTime,
                end_time: endTime,
                duration: this.calculateDuration(startTime, endTime),
                created_date: new Date().toISOString()
            };
        });

        // Add entries to time table
        this.examTimeTable.push(...timeTableEntries);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        e.target.reset();
        this.loadTimeTable();
        alert('Time table entries created successfully!');
    }

    calculateDuration(startTime, endTime) {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        const diffMinutes = (end - start) / (1000 * 60);
        return diffMinutes;
    }

    saveTimeTableInfo() {
        const title = document.getElementById('timetableTitle').value;
        const session = document.getElementById('examSession').value;
        const instructions = document.getElementById('instructions').value;

        this.timeTableInfo = {
            title: title,
            session: session,
            instructions: instructions
        };

        localStorage.setItem('timeTableInfo', JSON.stringify(this.timeTableInfo));
        alert('Time table information saved successfully!');
    }

    generateTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        const previewWindow = window.open('', '_blank', 'width=1000,height=800');
        const schoolInfo = this.schoolInfo;
        const timeTableInfo = this.timeTableInfo;

        // Group entries by date
        const groupedByDate = {};
        this.examTimeTable.forEach(entry => {
            if (!groupedByDate[entry.exam_date]) {
                groupedByDate[entry.exam_date] = [];
            }
            groupedByDate[entry.exam_date].push(entry);
        });

        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Exam Time Table</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 1000px;
                        margin: 0 auto;
                        padding: 20px;
                        background: white;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 3px solid #333;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .school-logo {
                        max-height: 80px;
                        margin-bottom: 10px;
                    }
                    .school-name {
                        font-size: 28px;
                        font-weight: bold;
                        color: #2c3e50;
                        margin: 10px 0;
                    }
                    .timetable-title {
                        font-size: 24px;
                        color: #e74c3c;
                        margin: 15px 0;
                        text-decoration: underline;
                    }
                    .exam-info {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin: 20px 0;
                        padding: 15px;
                        background: #f8f9fa;
                        border-radius: 5px;
                    }
                    .info-item {
                        text-align: center;
                    }
                    .info-label {
                        font-weight: bold;
                        color: #495057;
                    }
                    .info-value {
                        font-size: 18px;
                        color: #2c3e50;
                        margin-top: 5px;
                    }
                    .timetable-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    .timetable-table th, .timetable-table td {
                        border: 1px solid #ddd;
                        padding: 15px;
                        text-align: center;
                    }
                    .timetable-table th {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        font-weight: bold;
                    }
                    .timetable-table tr:nth-child(even) {
                        background: #f8f9fa;
                    }
                    .timetable-table tr:hover {
                        background: #e3f2fd;
                    }
                    .date-header {
                        background: #e9ecef !important;
                        font-weight: bold;
                        font-size: 16px;
                        color: #2c3e50;
                    }
                    .subject-name {
                        text-align: left;
                        font-weight: bold;
                        color: #2c3e50;
                    }
                    .instructions {
                        margin: 30px 0;
                        padding: 20px;
                        background: #fff3cd;
                        border: 1px solid #ffeaa7;
                        border-radius: 5px;
                    }
                    .instructions h4 {
                        color: #856404;
                        margin-top: 0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 2px solid #ddd;
                        color: #666;
                        font-size: 12px;
                    }
                    @media print {
                        body { margin: 0; padding: 15px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${schoolInfo.logo || ''}" alt="School Logo" class="school-logo" style="${schoolInfo.logo ? '' : 'display: none;'}">
                    <div class="school-name">${schoolInfo.name || 'School Management System'}</div>
                    <div class="school-address">${schoolInfo.address || ''}</div>
                    <div class="academic-year">Academic Year: ${schoolInfo.academicYear || ''}</div>
                </div>

                <div class="timetable-title">${timeTableInfo.title || 'EXAM TIME TABLE'}</div>

                <div class="exam-info">
                    <div class="info-item">
                        <div class="info-label">Exam Session</div>
                        <div class="info-value">${timeTableInfo.session || 'Not Specified'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Total Subjects</div>
                        <div class="info-value">${this.examTimeTable.length}</div>
                    </div>
                </div>

                <table class="timetable-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr ${index === 0 ? `class="date-header"` : ''}>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td class="subject-name">${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} minutes</td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>

                ${timeTableInfo.instructions ? `
                    <div class="instructions">
                        <h4>Important Instructions:</h4>
                        <p>${timeTableInfo.instructions.replace(/\n/g, '<br>')}</p>
                    </div>
                ` : ''}

                <div class="footer">
                    <p><strong>Generated by School Management System</strong></p>
                    <p>This time table is subject to change. Students are advised to check for updates regularly.</p>
                    <p>Generated on: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}</p>
                </div>

                <div class="no-print" style="text-align: center; margin-top: 30px;">
                    <button onclick="window.print()" style="margin-right: 10px; padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Time Table</button>
                    <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
                </div>
            </body>
            </html>
        `);
    }

    previewTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        this.generateTimeTable();
    }

    printTimeTable() {
        this.generateTimeTable();
        setTimeout(() => {
            window.print();
        }, 1000);
    }

    loadTimeTable() {
        const timetableTable = document.getElementById('timetableTable');
        const timetableInfo = document.getElementById('timetableInfo');

        if (this.examTimeTable.length === 0) {
            timetableTable.innerHTML = `
                <div class="no-timetable">
                    <p>No exam time table created yet.</p>
                    <p>Create your first time table to get started!</p>
                </div>
            `;
            timetableInfo.textContent = 'No time table created yet. Create your first time table!';
        } else {
            // Group entries by date for better display
            const groupedByDate = {};
            this.examTimeTable.forEach(entry => {
                if (!groupedByDate[entry.exam_date]) {
                    groupedByDate[entry.exam_date] = [];
                }
                groupedByDate[entry.exam_date].push(entry);
            });

            let html = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td>${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} min</td>
                                    <td>
                                        <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteTimeTableEntry('${entry.id}')">Remove</button>
                                    </td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>
            `;

            timetableTable.innerHTML = html;
            timetableInfo.textContent = `Time table with ${this.examTimeTable.length} exam(s) created successfully!`;
        }
    }

    deleteTimeTableEntry(id) {
        this.examTimeTable = this.examTimeTable.filter(entry => entry.id !== id);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        this.loadTimeTable();
    }

    loadSubjectsForTimeTable() {
        const classSelect = document.getElementById('ttClass');
        const subjectsSelection = document.getElementById('subjectsSelection');
        if (!subjectsSelection) return;

        const classValue = classSelect.value;
        if (!classValue) {
            subjectsSelection.innerHTML = '<p class="no-data">Select a class to load subjects</p>';
            return;
        }

        // Get subjects for the selected class
        const subjects = this.getSubjectsForClass(classValue);

        let html = '<div class="subjects-checkbox-grid">';
        subjects.forEach(subject => {
            html += `
                <div class="subject-checkbox-item">
                    <label class="checkbox-label">
                        <input type="checkbox" name="tt_subject" value="${subject}" checked>
                        <span class="checkmark"></span>
                        ${subject}
                    </label>
                </div>
            `;
        });
        html += '</div>';

        subjectsSelection.innerHTML = html;
    }

    handleTimeTableForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const classValue = formData.get('tt_class');
        const examDate = formData.get('tt_exam_date');
        const startTime = formData.get('tt_start_time');
        const endTime = formData.get('tt_end_time');

        // Get selected subjects
        const selectedSubjects = Array.from(document.querySelectorAll('input[name="tt_subject"]:checked')).map(cb => cb.value);

        if (selectedSubjects.length === 0) {
            alert('Please select at least one subject');
            return;
        }

        // Create time table entries for each selected subject
        const timeTableEntries = selectedSubjects.map((subject, index) => {
            const examDateTime = new Date(examDate);
            examDateTime.setDate(examDateTime.getDate() + index); // Spread exams across multiple days

            return {
                id: Date.now() + index,
                class: classValue,
                subject: subject,
                exam_date: examDateTime.toISOString().split('T')[0],
                start_time: startTime,
                end_time: endTime,
                duration: this.calculateDuration(startTime, endTime),
                created_date: new Date().toISOString()
            };
        });

        // Add entries to time table
        this.examTimeTable.push(...timeTableEntries);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        e.target.reset();
        this.loadTimeTable();
        alert('Time table entries created successfully!');
    }

    calculateDuration(startTime, endTime) {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        const diffMinutes = (end - start) / (1000 * 60);
        return diffMinutes;
    }

    saveTimeTableInfo() {
        const title = document.getElementById('timetableTitle').value;
        const session = document.getElementById('examSession').value;
        const instructions = document.getElementById('instructions').value;

        this.timeTableInfo = {
            title: title,
            session: session,
            instructions: instructions
        };

        localStorage.setItem('timeTableInfo', JSON.stringify(this.timeTableInfo));
        alert('Time table information saved successfully!');
    }

    generateTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        const previewWindow = window.open('', '_blank', 'width=1000,height=800');
        const schoolInfo = this.schoolInfo;
        const timeTableInfo = this.timeTableInfo;

        // Group entries by date
        const groupedByDate = {};
        this.examTimeTable.forEach(entry => {
            if (!groupedByDate[entry.exam_date]) {
                groupedByDate[entry.exam_date] = [];
            }
            groupedByDate[entry.exam_date].push(entry);
        });

        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Exam Time Table</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 1000px;
                        margin: 0 auto;
                        padding: 20px;
                        background: white;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 3px solid #333;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .school-logo {
                        max-height: 80px;
                        margin-bottom: 10px;
                    }
                    .school-name {
                        font-size: 28px;
                        font-weight: bold;
                        color: #2c3e50;
                        margin: 10px 0;
                    }
                    .timetable-title {
                        font-size: 24px;
                        color: #e74c3c;
                        margin: 15px 0;
                        text-decoration: underline;
                    }
                    .exam-info {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin: 20px 0;
                        padding: 15px;
                        background: #f8f9fa;
                        border-radius: 5px;
                    }
                    .info-item {
                        text-align: center;
                    }
                    .info-label {
                        font-weight: bold;
                        color: #495057;
                    }
                    .info-value {
                        font-size: 18px;
                        color: #2c3e50;
                        margin-top: 5px;
                    }
                    .timetable-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    .timetable-table th, .timetable-table td {
                        border: 1px solid #ddd;
                        padding: 15px;
                        text-align: center;
                    }
                    .timetable-table th {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        font-weight: bold;
                    }
                    .timetable-table tr:nth-child(even) {
                        background: #f8f9fa;
                    }
                    .timetable-table tr:hover {
                        background: #e3f2fd;
                    }
                    .date-header {
                        background: #e9ecef !important;
                        font-weight: bold;
                        font-size: 16px;
                        color: #2c3e50;
                    }
                    .subject-name {
                        text-align: left;
                        font-weight: bold;
                        color: #2c3e50;
                    }
                    .instructions {
                        margin: 30px 0;
                        padding: 20px;
                        background: #fff3cd;
                        border: 1px solid #ffeaa7;
                        border-radius: 5px;
                    }
                    .instructions h4 {
                        color: #856404;
                        margin-top: 0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 2px solid #ddd;
                        color: #666;
                        font-size: 12px;
                    }
                    @media print {
                        body { margin: 0; padding: 15px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${schoolInfo.logo || ''}" alt="School Logo" class="school-logo" style="${schoolInfo.logo ? '' : 'display: none;'}">
                    <div class="school-name">${schoolInfo.name || 'School Management System'}</div>
                    <div class="school-address">${schoolInfo.address || ''}</div>
                    <div class="academic-year">Academic Year: ${schoolInfo.academicYear || ''}</div>
                </div>

                <div class="timetable-title">${timeTableInfo.title || 'EXAM TIME TABLE'}</div>

                <div class="exam-info">
                    <div class="info-item">
                        <div class="info-label">Exam Session</div>
                        <div class="info-value">${timeTableInfo.session || 'Not Specified'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Total Subjects</div>
                        <div class="info-value">${this.examTimeTable.length}</div>
                    </div>
                </div>

                <table class="timetable-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr ${index === 0 ? `class="date-header"` : ''}>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td class="subject-name">${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} minutes</td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>

                ${timeTableInfo.instructions ? `
                    <div class="instructions">
                        <h4>Important Instructions:</h4>
                        <p>${timeTableInfo.instructions.replace(/\n/g, '<br>')}</p>
                    </div>
                ` : ''}

                <div class="footer">
                    <p><strong>Generated by School Management System</strong></p>
                    <p>This time table is subject to change. Students are advised to check for updates regularly.</p>
                    <p>Generated on: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}</p>
                </div>

                <div class="no-print" style="text-align: center; margin-top: 30px;">
                    <button onclick="window.print()" style="margin-right: 10px; padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Time Table</button>
                    <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
                </div>
            </body>
            </html>
        `);
    }

    previewTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        this.generateTimeTable();
    }

    printTimeTable() {
        this.generateTimeTable();
        setTimeout(() => {
            window.print();
        }, 1000);
    }

    loadTimeTable() {
        const timetableTable = document.getElementById('timetableTable');
        const timetableInfo = document.getElementById('timetableInfo');

        if (this.examTimeTable.length === 0) {
            timetableTable.innerHTML = `
                <div class="no-timetable">
                    <p>No exam time table created yet.</p>
                    <p>Create your first time table to get started!</p>
                </div>
            `;
            timetableInfo.textContent = 'No time table created yet. Create your first time table!';
        } else {
            // Group entries by date for better display
            const groupedByDate = {};
            this.examTimeTable.forEach(entry => {
                if (!groupedByDate[entry.exam_date]) {
                    groupedByDate[entry.exam_date] = [];
                }
                groupedByDate[entry.exam_date].push(entry);
            });

            let html = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td>${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} min</td>
                                    <td>
                                        <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteTimeTableEntry('${entry.id}')">Remove</button>
                                    </td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>
            `;

            timetableTable.innerHTML = html;
            timetableInfo.textContent = `Time table with ${this.examTimeTable.length} exam(s) created successfully!`;
        }
    }

    deleteTimeTableEntry(id) {
        this.examTimeTable = this.examTimeTable.filter(entry => entry.id !== id);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        this.loadTimeTable();
    }

    loadSubjectsForTimeTable() {
        const classSelect = document.getElementById('ttClass');
        const subjectsSelection = document.getElementById('subjectsSelection');
        if (!subjectsSelection) return;

        const classValue = classSelect.value;
        if (!classValue) {
            subjectsSelection.innerHTML = '<p class="no-data">Select a class to load subjects</p>';
            return;
        }

        // Get subjects for the selected class
        const subjects = this.getSubjectsForClass(classValue);

        let html = '<div class="subjects-checkbox-grid">';
        subjects.forEach(subject => {
            html += `
                <div class="subject-checkbox-item">
                    <label class="checkbox-label">
                        <input type="checkbox" name="tt_subject" value="${subject}" checked>
                        <span class="checkmark"></span>
                        ${subject}
                    </label>
                </div>
            `;
        });
        html += '</div>';

        subjectsSelection.innerHTML = html;
    }

    handleTimeTableForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const classValue = formData.get('tt_class');
        const examDate = formData.get('tt_exam_date');
        const startTime = formData.get('tt_start_time');
        const endTime = formData.get('tt_end_time');

        // Get selected subjects
        const selectedSubjects = Array.from(document.querySelectorAll('input[name="tt_subject"]:checked')).map(cb => cb.value);

        if (selectedSubjects.length === 0) {
            alert('Please select at least one subject');
            return;
        }

        // Create time table entries for each selected subject
        const timeTableEntries = selectedSubjects.map((subject, index) => {
            const examDateTime = new Date(examDate);
            examDateTime.setDate(examDateTime.getDate() + index); // Spread exams across multiple days

            return {
                id: Date.now() + index,
                class: classValue,
                subject: subject,
                exam_date: examDateTime.toISOString().split('T')[0],
                start_time: startTime,
                end_time: endTime,
                duration: this.calculateDuration(startTime, endTime),
                created_date: new Date().toISOString()
            };
        });

        // Add entries to time table
        this.examTimeTable.push(...timeTableEntries);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        e.target.reset();
        this.loadTimeTable();
        alert('Time table entries created successfully!');
    }

    calculateDuration(startTime, endTime) {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        const diffMinutes = (end - start) / (1000 * 60);
        return diffMinutes;
    }

    saveTimeTableInfo() {
        const title = document.getElementById('timetableTitle').value;
        const session = document.getElementById('examSession').value;
        const instructions = document.getElementById('instructions').value;

        this.timeTableInfo = {
            title: title,
            session: session,
            instructions: instructions
        };

        localStorage.setItem('timeTableInfo', JSON.stringify(this.timeTableInfo));
        alert('Time table information saved successfully!');
    }

    generateTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        const previewWindow = window.open('', '_blank', 'width=1000,height=800');
        const schoolInfo = this.schoolInfo;
        const timeTableInfo = this.timeTableInfo;

        // Group entries by date
        const groupedByDate = {};
        this.examTimeTable.forEach(entry => {
            if (!groupedByDate[entry.exam_date]) {
                groupedByDate[entry.exam_date] = [];
            }
            groupedByDate[entry.exam_date].push(entry);
        });

        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Exam Time Table</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 1000px;
                        margin: 0 auto;
                        padding: 20px;
                        background: white;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 3px solid #333;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .school-logo {
                        max-height: 80px;
                        margin-bottom: 10px;
                    }
                    .school-name {
                        font-size: 28px;
                        font-weight: bold;
                        color: #2c3e50;
                        margin: 10px 0;
                    }
                    .timetable-title {
                        font-size: 24px;
                        color: #e74c3c;
                        margin: 15px 0;
                        text-decoration: underline;
                    }
                    .exam-info {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin: 20px 0;
                        padding: 15px;
                        background: #f8f9fa;
                        border-radius: 5px;
                    }
                    .info-item {
                        text-align: center;
                    }
                    .info-label {
                        font-weight: bold;
                        color: #495057;
                    }
                    .info-value {
                        font-size: 18px;
                        color: #2c3e50;
                        margin-top: 5px;
                    }
                    .timetable-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    .timetable-table th, .timetable-table td {
                        border: 1px solid #ddd;
                        padding: 15px;
                        text-align: center;
                    }
                    .timetable-table th {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        font-weight: bold;
                    }
                    .timetable-table tr:nth-child(even) {
                        background: #f8f9fa;
                    }
                    .timetable-table tr:hover {
                        background: #e3f2fd;
                    }
                    .date-header {
                        background: #e9ecef !important;
                        font-weight: bold;
                        font-size: 16px;
                        color: #2c3e50;
                    }
                    .subject-name {
                        text-align: left;
                        font-weight: bold;
                        color: #2c3e50;
                    }
                    .instructions {
                        margin: 30px 0;
                        padding: 20px;
                        background: #fff3cd;
                        border: 1px solid #ffeaa7;
                        border-radius: 5px;
                    }
                    .instructions h4 {
                        color: #856404;
                        margin-top: 0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 2px solid #ddd;
                        color: #666;
                        font-size: 12px;
                    }
                    @media print {
                        body { margin: 0; padding: 15px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${schoolInfo.logo || ''}" alt="School Logo" class="school-logo" style="${schoolInfo.logo ? '' : 'display: none;'}">
                    <div class="school-name">${schoolInfo.name || 'School Management System'}</div>
                    <div class="school-address">${schoolInfo.address || ''}</div>
                    <div class="academic-year">Academic Year: ${schoolInfo.academicYear || ''}</div>
                </div>

                <div class="timetable-title">${timeTableInfo.title || 'EXAM TIME TABLE'}</div>

                <div class="exam-info">
                    <div class="info-item">
                        <div class="info-label">Exam Session</div>
                        <div class="info-value">${timeTableInfo.session || 'Not Specified'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Total Subjects</div>
                        <div class="info-value">${this.examTimeTable.length}</div>
                    </div>
                </div>

                <table class="timetable-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr ${index === 0 ? `class="date-header"` : ''}>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td class="subject-name">${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} minutes</td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>

                ${timeTableInfo.instructions ? `
                    <div class="instructions">
                        <h4>Important Instructions:</h4>
                        <p>${timeTableInfo.instructions.replace(/\n/g, '<br>')}</p>
                    </div>
                ` : ''}

                <div class="footer">
                    <p><strong>Generated by School Management System</strong></p>
                    <p>This time table is subject to change. Students are advised to check for updates regularly.</p>
                    <p>Generated on: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}</p>
                </div>

                <div class="no-print" style="text-align: center; margin-top: 30px;">
                    <button onclick="window.print()" style="margin-right: 10px; padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Time Table</button>
                    <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
                </div>
            </body>
            </html>
        `);
    }

    previewTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        this.generateTimeTable();
    }

    printTimeTable() {
        this.generateTimeTable();
        setTimeout(() => {
            window.print();
        }, 1000);
    }

    loadTimeTable() {
        const timetableTable = document.getElementById('timetableTable');
        const timetableInfo = document.getElementById('timetableInfo');

        if (this.examTimeTable.length === 0) {
            timetableTable.innerHTML = `
                <div class="no-timetable">
                    <p>No exam time table created yet.</p>
                    <p>Create your first time table to get started!</p>
                </div>
            `;
            timetableInfo.textContent = 'No time table created yet. Create your first time table!';
        } else {
            // Group entries by date for better display
            const groupedByDate = {};
            this.examTimeTable.forEach(entry => {
                if (!groupedByDate[entry.exam_date]) {
                    groupedByDate[entry.exam_date] = [];
                }
                groupedByDate[entry.exam_date].push(entry);
            });

            let html = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td>${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} min</td>
                                    <td>
                                        <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteTimeTableEntry('${entry.id}')">Remove</button>
                                    </td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>
            `;

            timetableTable.innerHTML = html;
            timetableInfo.textContent = `Time table with ${this.examTimeTable.length} exam(s) created successfully!`;
        }
    }

    deleteTimeTableEntry(id) {
        this.examTimeTable = this.examTimeTable.filter(entry => entry.id !== id);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        this.loadTimeTable();
    }

    loadSubjectsForTimeTable() {
        const classSelect = document.getElementById('ttClass');
        const subjectsSelection = document.getElementById('subjectsSelection');
        if (!subjectsSelection) return;

        const classValue = classSelect.value;
        if (!classValue) {
            subjectsSelection.innerHTML = '<p class="no-data">Select a class to load subjects</p>';
            return;
        }

        // Get subjects for the selected class
        const subjects = this.getSubjectsForClass(classValue);

        let html = '<div class="subjects-checkbox-grid">';
        subjects.forEach(subject => {
            html += `
                <div class="subject-checkbox-item">
                    <label class="checkbox-label">
                        <input type="checkbox" name="tt_subject" value="${subject}" checked>
                        <span class="checkmark"></span>
                        ${subject}
                    </label>
                </div>
            `;
        });
        html += '</div>';

        subjectsSelection.innerHTML = html;
    }

    handleTimeTableForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const classValue = formData.get('tt_class');
        const examDate = formData.get('tt_exam_date');
        const startTime = formData.get('tt_start_time');
        const endTime = formData.get('tt_end_time');

        // Get selected subjects
        const selectedSubjects = Array.from(document.querySelectorAll('input[name="tt_subject"]:checked')).map(cb => cb.value);

        if (selectedSubjects.length === 0) {
            alert('Please select at least one subject');
            return;
        }

        // Create time table entries for each selected subject
        const timeTableEntries = selectedSubjects.map((subject, index) => {
            const examDateTime = new Date(examDate);
            examDateTime.setDate(examDateTime.getDate() + index); // Spread exams across multiple days

            return {
                id: Date.now() + index,
                class: classValue,
                subject: subject,
                exam_date: examDateTime.toISOString().split('T')[0],
                start_time: startTime,
                end_time: endTime,
                duration: this.calculateDuration(startTime, endTime),
                created_date: new Date().toISOString()
            };
        });

        // Add entries to time table
        this.examTimeTable.push(...timeTableEntries);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        e.target.reset();
        this.loadTimeTable();
        alert('Time table entries created successfully!');
    }

    calculateDuration(startTime, endTime) {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        const diffMinutes = (end - start) / (1000 * 60);
        return diffMinutes;
    }

    saveTimeTableInfo() {
        const title = document.getElementById('timetableTitle').value;
        const session = document.getElementById('examSession').value;
        const instructions = document.getElementById('instructions').value;

        this.timeTableInfo = {
            title: title,
            session: session,
            instructions: instructions
        };

        localStorage.setItem('timeTableInfo', JSON.stringify(this.timeTableInfo));
        alert('Time table information saved successfully!');
    }

    generateTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        const previewWindow = window.open('', '_blank', 'width=1000,height=800');
        const schoolInfo = this.schoolInfo;
        const timeTableInfo = this.timeTableInfo;

        // Group entries by date
        const groupedByDate = {};
        this.examTimeTable.forEach(entry => {
            if (!groupedByDate[entry.exam_date]) {
                groupedByDate[entry.exam_date] = [];
            }
            groupedByDate[entry.exam_date].push(entry);
        });

        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Exam Time Table</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 1000px;
                        margin: 0 auto;
                        padding: 20px;
                        background: white;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 3px solid #333;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .school-logo {
                        max-height: 80px;
                        margin-bottom: 10px;
                    }
                    .school-name {
                        font-size: 28px;
                        font-weight: bold;
                        color: #2c3e50;
                        margin: 10px 0;
                    }
                    .timetable-title {
                        font-size: 24px;
                        color: #e74c3c;
                        margin: 15px 0;
                        text-decoration: underline;
                    }
                    .exam-info {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin: 20px 0;
                        padding: 15px;
                        background: #f8f9fa;
                        border-radius: 5px;
                    }
                    .info-item {
                        text-align: center;
                    }
                    .info-label {
                        font-weight: bold;
                        color: #495057;
                    }
                    .info-value {
                        font-size: 18px;
                        color: #2c3e50;
                        margin-top: 5px;
                    }
                    .timetable-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    .timetable-table th, .timetable-table td {
                        border: 1px solid #ddd;
                        padding: 15px;
                        text-align: center;
                    }
                    .timetable-table th {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        font-weight: bold;
                    }
                    .timetable-table tr:nth-child(even) {
                        background: #f8f9fa;
                    }
                    .timetable-table tr:hover {
                        background: #e3f2fd;
                    }
                    .date-header {
                        background: #e9ecef !important;
                        font-weight: bold;
                        font-size: 16px;
                        color: #2c3e50;
                    }
                    .subject-name {
                        text-align: left;
                        font-weight: bold;
                        color: #2c3e50;
                    }
                    .instructions {
                        margin: 30px 0;
                        padding: 20px;
                        background: #fff3cd;
                        border: 1px solid #ffeaa7;
                        border-radius: 5px;
                    }
                    .instructions h4 {
                        color: #856404;
                        margin-top: 0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 2px solid #ddd;
                        color: #666;
                        font-size: 12px;
                    }
                    @media print {
                        body { margin: 0; padding: 15px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${schoolInfo.logo || ''}" alt="School Logo" class="school-logo" style="${schoolInfo.logo ? '' : 'display: none;'}">
                    <div class="school-name">${schoolInfo.name || 'School Management System'}</div>
                    <div class="school-address">${schoolInfo.address || ''}</div>
                    <div class="academic-year">Academic Year: ${schoolInfo.academicYear || ''}</div>
                </div>

                <div class="timetable-title">${timeTableInfo.title || 'EXAM TIME TABLE'}</div>

                <div class="exam-info">
                    <div class="info-item">
                        <div class="info-label">Exam Session</div>
                        <div class="info-value">${timeTableInfo.session || 'Not Specified'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Total Subjects</div>
                        <div class="info-value">${this.examTimeTable.length}</div>
                    </div>
                </div>

                <table class="timetable-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr ${index === 0 ? `class="date-header"` : ''}>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td class="subject-name">${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} minutes</td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>

                ${timeTableInfo.instructions ? `
                    <div class="instructions">
                        <h4>Important Instructions:</h4>
                        <p>${timeTableInfo.instructions.replace(/\n/g, '<br>')}</p>
                    </div>
                ` : ''}

                <div class="footer">
                    <p><strong>Generated by School Management System</strong></p>
                    <p>This time table is subject to change. Students are advised to check for updates regularly.</p>
                    <p>Generated on: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}</p>
                </div>

                <div class="no-print" style="text-align: center; margin-top: 30px;">
                    <button onclick="window.print()" style="margin-right: 10px; padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Time Table</button>
                    <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
                </div>
            </body>
            </html>
        `);
    }

    previewTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        this.generateTimeTable();
    }

    printTimeTable() {
        this.generateTimeTable();
        setTimeout(() => {
            window.print();
        }, 1000);
    }

    loadTimeTable() {
        const timetableTable = document.getElementById('timetableTable');
        const timetableInfo = document.getElementById('timetableInfo');

        if (this.examTimeTable.length === 0) {
            timetableTable.innerHTML = `
                <div class="no-timetable">
                    <p>No exam time table created yet.</p>
                    <p>Create your first time table to get started!</p>
                </div>
            `;
            timetableInfo.textContent = 'No time table created yet. Create your first time table!';
        } else {
            // Group entries by date for better display
            const groupedByDate = {};
            this.examTimeTable.forEach(entry => {
                if (!groupedByDate[entry.exam_date]) {
                    groupedByDate[entry.exam_date] = [];
                }
                groupedByDate[entry.exam_date].push(entry);
            });

            let html = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td>${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} min</td>
                                    <td>
                                        <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteTimeTableEntry('${entry.id}')">Remove</button>
                                    </td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>
            `;

            timetableTable.innerHTML = html;
            timetableInfo.textContent = `Time table with ${this.examTimeTable.length} exam(s) created successfully!`;
        }
    }

    deleteTimeTableEntry(id) {
        this.examTimeTable = this.examTimeTable.filter(entry => entry.id !== id);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        this.loadTimeTable();
    }

    loadSubjectsForTimeTable() {
        const classSelect = document.getElementById('ttClass');
        const subjectsSelection = document.getElementById('subjectsSelection');
        if (!subjectsSelection) return;

        const classValue = classSelect.value;
        if (!classValue) {
            subjectsSelection.innerHTML = '<p class="no-data">Select a class to load subjects</p>';
            return;
        }

        // Get subjects for the selected class
        const subjects = this.getSubjectsForClass(classValue);

        let html = '<div class="subjects-checkbox-grid">';
        subjects.forEach(subject => {
            html += `
                <div class="subject-checkbox-item">
                    <label class="checkbox-label">
                        <input type="checkbox" name="tt_subject" value="${subject}" checked>
                        <span class="checkmark"></span>
                        ${subject}
                    </label>
                </div>
            `;
        });
        html += '</div>';

        subjectsSelection.innerHTML = html;
    }

    handleTimeTableForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const classValue = formData.get('tt_class');
        const examDate = formData.get('tt_exam_date');
        const startTime = formData.get('tt_start_time');
        const endTime = formData.get('tt_end_time');

        // Get selected subjects
        const selectedSubjects = Array.from(document.querySelectorAll('input[name="tt_subject"]:checked')).map(cb => cb.value);

        if (selectedSubjects.length === 0) {
            alert('Please select at least one subject');
            return;
        }

        // Create time table entries for each selected subject
        const timeTableEntries = selectedSubjects.map((subject, index) => {
            const examDateTime = new Date(examDate);
            examDateTime.setDate(examDateTime.getDate() + index); // Spread exams across multiple days

            return {
                id: Date.now() + index,
                class: classValue,
                subject: subject,
                exam_date: examDateTime.toISOString().split('T')[0],
                start_time: startTime,
                end_time: endTime,
                duration: this.calculateDuration(startTime, endTime),
                created_date: new Date().toISOString()
            };
        });

        // Add entries to time table
        this.examTimeTable.push(...timeTableEntries);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        e.target.reset();
        this.loadTimeTable();
        alert('Time table entries created successfully!');
    }

    calculateDuration(startTime, endTime) {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        const diffMinutes = (end - start) / (1000 * 60);
        return diffMinutes;
    }

    saveTimeTableInfo() {
        const title = document.getElementById('timetableTitle').value;
        const session = document.getElementById('examSession').value;
        const instructions = document.getElementById('instructions').value;

        this.timeTableInfo = {
            title: title,
            session: session,
            instructions: instructions
        };

        localStorage.setItem('timeTableInfo', JSON.stringify(this.timeTableInfo));
        alert('Time table information saved successfully!');
    }

    generateTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        const previewWindow = window.open('', '_blank', 'width=1000,height=800');
        const schoolInfo = this.schoolInfo;
        const timeTableInfo = this.timeTableInfo;

        // Group entries by date
        const groupedByDate = {};
        this.examTimeTable.forEach(entry => {
            if (!groupedByDate[entry.exam_date]) {
                groupedByDate[entry.exam_date] = [];
            }
            groupedByDate[entry.exam_date].push(entry);
        });

        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Exam Time Table</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 1000px;
                        margin: 0 auto;
                        padding: 20px;
                        background: white;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 3px solid #333;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .school-logo {
                        max-height: 80px;
                        margin-bottom: 10px;
                    }
                    .school-name {
                        font-size: 28px;
                        font-weight: bold;
                        color: #2c3e50;
                        margin: 10px 0;
                    }
                    .timetable-title {
                        font-size: 24px;
                        color: #e74c3c;
                        margin: 15px 0;
                        text-decoration: underline;
                    }
                    .exam-info {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin: 20px 0;
                        padding: 15px;
                        background: #f8f9fa;
                        border-radius: 5px;
                    }
                    .info-item {
                        text-align: center;
                    }
                    .info-label {
                        font-weight: bold;
                        color: #495057;
                    }
                    .info-value {
                        font-size: 18px;
                        color: #2c3e50;
                        margin-top: 5px;
                    }
                    .timetable-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    .timetable-table th, .timetable-table td {
                        border: 1px solid #ddd;
                        padding: 15px;
                        text-align: center;
                    }
                    .timetable-table th {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        font-weight: bold;
                    }
                    .timetable-table tr:nth-child(even) {
                        background: #f8f9fa;
                    }
                    .timetable-table tr:hover {
                        background: #e3f2fd;
                    }
                    .date-header {
                        background: #e9ecef !important;
                        font-weight: bold;
                        font-size: 16px;
                        color: #2c3e50;
                    }
                    .subject-name {
                        text-align: left;
                        font-weight: bold;
                        color: #2c3e50;
                    }
                    .instructions {
                        margin: 30px 0;
                        padding: 20px;
                        background: #fff3cd;
                        border: 1px solid #ffeaa7;
                        border-radius: 5px;
                    }
                    .instructions h4 {
                        color: #856404;
                        margin-top: 0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 2px solid #ddd;
                        color: #666;
                        font-size: 12px;
                    }
                    @media print {
                        body { margin: 0; padding: 15px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${schoolInfo.logo || ''}" alt="School Logo" class="school-logo" style="${schoolInfo.logo ? '' : 'display: none;'}">
                    <div class="school-name">${schoolInfo.name || 'School Management System'}</div>
                    <div class="school-address">${schoolInfo.address || ''}</div>
                    <div class="academic-year">Academic Year: ${schoolInfo.academicYear || ''}</div>
                </div>

                <div class="timetable-title">${timeTableInfo.title || 'EXAM TIME TABLE'}</div>

                <div class="exam-info">
                    <div class="info-item">
                        <div class="info-label">Exam Session</div>
                        <div class="info-value">${timeTableInfo.session || 'Not Specified'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Total Subjects</div>
                        <div class="info-value">${this.examTimeTable.length}</div>
                    </div>
                </div>

                <table class="timetable-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr ${index === 0 ? `class="date-header"` : ''}>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td class="subject-name">${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} minutes</td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>

                ${timeTableInfo.instructions ? `
                    <div class="instructions">
                        <h4>Important Instructions:</h4>
                        <p>${timeTableInfo.instructions.replace(/\n/g, '<br>')}</p>
                    </div>
                ` : ''}

                <div class="footer">
                    <p><strong>Generated by School Management System</strong></p>
                    <p>This time table is subject to change. Students are advised to check for updates regularly.</p>
                    <p>Generated on: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}</p>
                </div>

                <div class="no-print" style="text-align: center; margin-top: 30px;">
                    <button onclick="window.print()" style="margin-right: 10px; padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Time Table</button>
                    <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
                </div>
            </body>
            </html>
        `);
    }

    previewTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        this.generateTimeTable();
    }

    printTimeTable() {
        this.generateTimeTable();
        setTimeout(() => {
            window.print();
        }, 1000);
    }

    loadTimeTable() {
        const timetableTable = document.getElementById('timetableTable');
        const timetableInfo = document.getElementById('timetableInfo');

        if (this.examTimeTable.length === 0) {
            timetableTable.innerHTML = `
                <div class="no-timetable">
                    <p>No exam time table created yet.</p>
                    <p>Create your first time table to get started!</p>
                </div>
            `;
            timetableInfo.textContent = 'No time table created yet. Create your first time table!';
        } else {
            // Group entries by date for better display
            const groupedByDate = {};
            this.examTimeTable.forEach(entry => {
                if (!groupedByDate[entry.exam_date]) {
                    groupedByDate[entry.exam_date] = [];
                }
                groupedByDate[entry.exam_date].push(entry);
            });

            let html = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td>${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} min</td>
                                    <td>
                                        <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteTimeTableEntry('${entry.id}')">Remove</button>
                                    </td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>
            `;

            timetableTable.innerHTML = html;
            timetableInfo.textContent = `Time table with ${this.examTimeTable.length} exam(s) created successfully!`;
        }
    }

    deleteTimeTableEntry(id) {
        this.examTimeTable = this.examTimeTable.filter(entry => entry.id !== id);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        this.loadTimeTable();
    }

    loadSubjectsForTimeTable() {
        const classSelect = document.getElementById('ttClass');
        const subjectsSelection = document.getElementById('subjectsSelection');
        if (!subjectsSelection) return;

        const classValue = classSelect.value;
        if (!classValue) {
            subjectsSelection.innerHTML = '<p class="no-data">Select a class to load subjects</p>';
            return;
        }

        // Get subjects for the selected class
        const subjects = this.getSubjectsForClass(classValue);

        let html = '<div class="subjects-checkbox-grid">';
        subjects.forEach(subject => {
            html += `
                <div class="subject-checkbox-item">
                    <label class="checkbox-label">
                        <input type="checkbox" name="tt_subject" value="${subject}" checked>
                        <span class="checkmark"></span>
                        ${subject}
                    </label>
                </div>
            `;
        });
        html += '</div>';

        subjectsSelection.innerHTML = html;
    }

    handleTimeTableForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const classValue = formData.get('tt_class');
        const examDate = formData.get('tt_exam_date');
        const startTime = formData.get('tt_start_time');
        const endTime = formData.get('tt_end_time');

        // Get selected subjects
        const selectedSubjects = Array.from(document.querySelectorAll('input[name="tt_subject"]:checked')).map(cb => cb.value);

        if (selectedSubjects.length === 0) {
            alert('Please select at least one subject');
            return;
        }

        // Create time table entries for each selected subject
        const timeTableEntries = selectedSubjects.map((subject, index) => {
            const examDateTime = new Date(examDate);
            examDateTime.setDate(examDateTime.getDate() + index); // Spread exams across multiple days

            return {
                id: Date.now() + index,
                class: classValue,
                subject: subject,
                exam_date: examDateTime.toISOString().split('T')[0],
                start_time: startTime,
                end_time: endTime,
                duration: this.calculateDuration(startTime, endTime),
                created_date: new Date().toISOString()
            };
        });

        // Add entries to time table
        this.examTimeTable.push(...timeTableEntries);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        e.target.reset();
        this.loadTimeTable();
        alert('Time table entries created successfully!');
    }

    calculateDuration(startTime, endTime) {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        const diffMinutes = (end - start) / (1000 * 60);
        return diffMinutes;
    }

    saveTimeTableInfo() {
        const title = document.getElementById('timetableTitle').value;
        const session = document.getElementById('examSession').value;
        const instructions = document.getElementById('instructions').value;

        this.timeTableInfo = {
            title: title,
            session: session,
            instructions: instructions
        };

        localStorage.setItem('timeTableInfo', JSON.stringify(this.timeTableInfo));
        alert('Time table information saved successfully!');
    }

    generateTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        const previewWindow = window.open('', '_blank', 'width=1000,height=800');
        const schoolInfo = this.schoolInfo;
        const timeTableInfo = this.timeTableInfo;

        // Group entries by date
        const groupedByDate = {};
        this.examTimeTable.forEach(entry => {
            if (!groupedByDate[entry.exam_date]) {
                groupedByDate[entry.exam_date] = [];
            }
            groupedByDate[entry.exam_date].push(entry);
        });

        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Exam Time Table</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 1000px;
                        margin: 0 auto;
                        padding: 20px;
                        background: white;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 3px solid #333;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .school-logo {
                        max-height: 80px;
                        margin-bottom: 10px;
                    }
                    .school-name {
                        font-size: 28px;
                        font-weight: bold;
                        color: #2c3e50;
                        margin: 10px 0;
                    }
                    .timetable-title {
                        font-size: 24px;
                        color: #e74c3c;
                        margin: 15px 0;
                        text-decoration: underline;
                    }
                    .exam-info {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin: 20px 0;
                        padding: 15px;
                        background: #f8f9fa;
                        border-radius: 5px;
                    }
                    .info-item {
                        text-align: center;
                    }
                    .info-label {
                        font-weight: bold;
                        color: #495057;
                    }
                    .info-value {
                        font-size: 18px;
                        color: #2c3e50;
                        margin-top: 5px;
                    }
                    .timetable-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    .timetable-table th, .timetable-table td {
                        border: 1px solid #ddd;
                        padding: 15px;
                        text-align: center;
                    }
                    .timetable-table th {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        font-weight: bold;
                    }
                    .timetable-table tr:nth-child(even) {
                        background: #f8f9fa;
                    }
                    .timetable-table tr:hover {
                        background: #e3f2fd;
                    }
                    .date-header {
                        background: #e9ecef !important;
                        font-weight: bold;
                        font-size: 16px;
                        color: #2c3e50;
                    }
                    .subject-name {
                        text-align: left;
                        font-weight: bold;
                        color: #2c3e50;
                    }
                    .instructions {
                        margin: 30px 0;
                        padding: 20px;
                        background: #fff3cd;
                        border: 1px solid #ffeaa7;
                        border-radius: 5px;
                    }
                    .instructions h4 {
                        color: #856404;
                        margin-top: 0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 2px solid #ddd;
                        color: #666;
                        font-size: 12px;
                    }
                    @media print {
                        body { margin: 0; padding: 15px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${schoolInfo.logo || ''}" alt="School Logo" class="school-logo" style="${schoolInfo.logo ? '' : 'display: none;'}">
                    <div class="school-name">${schoolInfo.name || 'School Management System'}</div>
                    <div class="school-address">${schoolInfo.address || ''}</div>
                    <div class="academic-year">Academic Year: ${schoolInfo.academicYear || ''}</div>
                </div>

                <div class="timetable-title">${timeTableInfo.title || 'EXAM TIME TABLE'}</div>

                <div class="exam-info">
                    <div class="info-item">
                        <div class="info-label">Exam Session</div>
                        <div class="info-value">${timeTableInfo.session || 'Not Specified'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Total Subjects</div>
                        <div class="info-value">${this.examTimeTable.length}</div>
                    </div>
                </div>

                <table class="timetable-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr ${index === 0 ? `class="date-header"` : ''}>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td class="subject-name">${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} minutes</td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>

                ${timeTableInfo.instructions ? `
                    <div class="instructions">
                        <h4>Important Instructions:</h4>
                        <p>${timeTableInfo.instructions.replace(/\n/g, '<br>')}</p>
                    </div>
                ` : ''}

                <div class="footer">
                    <p><strong>Generated by School Management System</strong></p>
                    <p>This time table is subject to change. Students are advised to check for updates regularly.</p>
                    <p>Generated on: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}</p>
                </div>

                <div class="no-print" style="text-align: center; margin-top: 30px;">
                    <button onclick="window.print()" style="margin-right: 10px; padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Time Table</button>
                    <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
                </div>
            </body>
            </html>
        `);
    }

    previewTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        this.generateTimeTable();
    }

    printTimeTable() {
        this.generateTimeTable();
        setTimeout(() => {
            window.print();
        }, 1000);
    }

    loadTimeTable() {
        const timetableTable = document.getElementById('timetableTable');
        const timetableInfo = document.getElementById('timetableInfo');

        if (this.examTimeTable.length === 0) {
            timetableTable.innerHTML = `
                <div class="no-timetable">
                    <p>No exam time table created yet.</p>
                    <p>Create your first time table to get started!</p>
                </div>
            `;
            timetableInfo.textContent = 'No time table created yet. Create your first time table!';
        } else {
            // Group entries by date for better display
            const groupedByDate = {};
            this.examTimeTable.forEach(entry => {
                if (!groupedByDate[entry.exam_date]) {
                    groupedByDate[entry.exam_date] = [];
                }
                groupedByDate[entry.exam_date].push(entry);
            });

            let html = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td>${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} min</td>
                                    <td>
                                        <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteTimeTableEntry('${entry.id}')">Remove</button>
                                    </td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>
            `;

            timetableTable.innerHTML = html;
            timetableInfo.textContent = `Time table with ${this.examTimeTable.length} exam(s) created successfully!`;
        }
    }

    deleteTimeTableEntry(id) {
        this.examTimeTable = this.examTimeTable.filter(entry => entry.id !== id);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        this.loadTimeTable();
    }

    loadSubjectsForTimeTable() {
        const classSelect = document.getElementById('ttClass');
        const subjectsSelection = document.getElementById('subjectsSelection');
        if (!subjectsSelection) return;

        const classValue = classSelect.value;
        if (!classValue) {
            subjectsSelection.innerHTML = '<p class="no-data">Select a class to load subjects</p>';
            return;
        }

        // Get subjects for the selected class
        const subjects = this.getSubjectsForClass(classValue);

        let html = '<div class="subjects-checkbox-grid">';
        subjects.forEach(subject => {
            html += `
                <div class="subject-checkbox-item">
                    <label class="checkbox-label">
                        <input type="checkbox" name="tt_subject" value="${subject}" checked>
                        <span class="checkmark"></span>
                        ${subject}
                    </label>
                </div>
            `;
        });
        html += '</div>';

        subjectsSelection.innerHTML = html;
    }

    handleTimeTableForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const classValue = formData.get('tt_class');
        const examDate = formData.get('tt_exam_date');
        const startTime = formData.get('tt_start_time');
        const endTime = formData.get('tt_end_time');

        // Get selected subjects
        const selectedSubjects = Array.from(document.querySelectorAll('input[name="tt_subject"]:checked')).map(cb => cb.value);

        if (selectedSubjects.length === 0) {
            alert('Please select at least one subject');
            return;
        }

        // Create time table entries for each selected subject
        const timeTableEntries = selectedSubjects.map((subject, index) => {
            const examDateTime = new Date(examDate);
            examDateTime.setDate(examDateTime.getDate() + index); // Spread exams across multiple days

            return {
                id: Date.now() + index,
                class: classValue,
                subject: subject,
                exam_date: examDateTime.toISOString().split('T')[0],
                start_time: startTime,
                end_time: endTime,
                duration: this.calculateDuration(startTime, endTime),
                created_date: new Date().toISOString()
            };
        });

        // Add entries to time table
        this.examTimeTable.push(...timeTableEntries);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        e.target.reset();
        this.loadTimeTable();
        alert('Time table entries created successfully!');
    }

    calculateDuration(startTime, endTime) {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        const diffMinutes = (end - start) / (1000 * 60);
        return diffMinutes;
    }

    saveTimeTableInfo() {
        const title = document.getElementById('timetableTitle').value;
        const session = document.getElementById('examSession').value;
        const instructions = document.getElementById('instructions').value;

        this.timeTableInfo = {
            title: title,
            session: session,
            instructions: instructions
        };

        localStorage.setItem('timeTableInfo', JSON.stringify(this.timeTableInfo));
        alert('Time table information saved successfully!');
    }

    generateTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        const previewWindow = window.open('', '_blank', 'width=1000,height=800');
        const schoolInfo = this.schoolInfo;
        const timeTableInfo = this.timeTableInfo;

        // Group entries by date
        const groupedByDate = {};
        this.examTimeTable.forEach(entry => {
            if (!groupedByDate[entry.exam_date]) {
                groupedByDate[entry.exam_date] = [];
            }
            groupedByDate[entry.exam_date].push(entry);
        });

        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Exam Time Table</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 1000px;
                        margin: 0 auto;
                        padding: 20px;
                        background: white;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 3px solid #333;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .school-logo {
                        max-height: 80px;
                        margin-bottom: 10px;
                    }
                    .school-name {
                        font-size: 28px;
                        font-weight: bold;
                        color: #2c3e50;
                        margin: 10px 0;
                    }
                    .timetable-title {
                        font-size: 24px;
                        color: #e74c3c;
                        margin: 15px 0;
                        text-decoration: underline;
                    }
                    .exam-info {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin: 20px 0;
                        padding: 15px;
                        background: #f8f9fa;
                        border-radius: 5px;
                    }
                    .info-item {
                        text-align: center;
                    }
                    .info-label {
                        font-weight: bold;
                        color: #495057;
                    }
                    .info-value {
                        font-size: 18px;
                        color: #2c3e50;
                        margin-top: 5px;
                    }
                    .timetable-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    .timetable-table th, .timetable-table td {
                        border: 1px solid #ddd;
                        padding: 15px;
                        text-align: center;
                    }
                    .timetable-table th {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        font-weight: bold;
                    }
                    .timetable-table tr:nth-child(even) {
                        background: #f8f9fa;
                    }
                    .timetable-table tr:hover {
                        background: #e3f2fd;
                    }
                    .date-header {
                        background: #e9ecef !important;
                        font-weight: bold;
                        font-size: 16px;
                        color: #2c3e50;
                    }
                    .subject-name {
                        text-align: left;
                        font-weight: bold;
                        color: #2c3e50;
                    }
                    .instructions {
                        margin: 30px 0;
                        padding: 20px;
                        background: #fff3cd;
                        border: 1px solid #ffeaa7;
                        border-radius: 5px;
                    }
                    .instructions h4 {
                        color: #856404;
                        margin-top: 0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 2px solid #ddd;
                        color: #666;
                        font-size: 12px;
                    }
                    @media print {
                        body { margin: 0; padding: 15px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${schoolInfo.logo || ''}" alt="School Logo" class="school-logo" style="${schoolInfo.logo ? '' : 'display: none;'}">
                    <div class="school-name">${schoolInfo.name || 'School Management System'}</div>
                    <div class="school-address">${schoolInfo.address || ''}</div>
                    <div class="academic-year">Academic Year: ${schoolInfo.academicYear || ''}</div>
                </div>

                <div class="timetable-title">${timeTableInfo.title || 'EXAM TIME TABLE'}</div>

                <div class="exam-info">
                    <div class="info-item">
                        <div class="info-label">Exam Session</div>
                        <div class="info-value">${timeTableInfo.session || 'Not Specified'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Total Subjects</div>
                        <div class="info-value">${this.examTimeTable.length}</div>
                    </div>
                </div>

                <table class="timetable-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr ${index === 0 ? `class="date-header"` : ''}>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td class="subject-name">${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} minutes</td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>

                ${timeTableInfo.instructions ? `
                    <div class="instructions">
                        <h4>Important Instructions:</h4>
                        <p>${timeTableInfo.instructions.replace(/\n/g, '<br>')}</p>
                    </div>
                ` : ''}

                <div class="footer">
                    <p><strong>Generated by School Management System</strong></p>
                    <p>This time table is subject to change. Students are advised to check for updates regularly.</p>
                    <p>Generated on: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}</p>
                </div>

                <div class="no-print" style="text-align: center; margin-top: 30px;">
                    <button onclick="window.print()" style="margin-right: 10px; padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Time Table</button>
                    <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
                </div>
            </body>
            </html>
        `);
    }

    previewTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        this.generateTimeTable();
    }

    printTimeTable() {
        this.generateTimeTable();
        setTimeout(() => {
            window.print();
        }, 1000);
    }

    loadTimeTable() {
        const timetableTable = document.getElementById('timetableTable');
        const timetableInfo = document.getElementById('timetableInfo');

        if (this.examTimeTable.length === 0) {
            timetableTable.innerHTML = `
                <div class="no-timetable">
                    <p>No exam time table created yet.</p>
                    <p>Create your first time table to get started!</p>
                </div>
            `;
            timetableInfo.textContent = 'No time table created yet. Create your first time table!';
        } else {
            // Group entries by date for better display
            const groupedByDate = {};
            this.examTimeTable.forEach(entry => {
                if (!groupedByDate[entry.exam_date]) {
                    groupedByDate[entry.exam_date] = [];
                }
                groupedByDate[entry.exam_date].push(entry);
            });

            let html = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td>${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} min</td>
                                    <td>
                                        <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteTimeTableEntry('${entry.id}')">Remove</button>
                                    </td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>
            `;

            timetableTable.innerHTML = html;
            timetableInfo.textContent = `Time table with ${this.examTimeTable.length} exam(s) created successfully!`;
        }
    }

    deleteTimeTableEntry(id) {
        this.examTimeTable = this.examTimeTable.filter(entry => entry.id !== id);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        this.loadTimeTable();
    }

    loadSubjectsForTimeTable() {
        const classSelect = document.getElementById('ttClass');
        const subjectsSelection = document.getElementById('subjectsSelection');
        if (!subjectsSelection) return;

        const classValue = classSelect.value;
        if (!classValue) {
            subjectsSelection.innerHTML = '<p class="no-data">Select a class to load subjects</p>';
            return;
        }

        // Get subjects for the selected class
        const subjects = this.getSubjectsForClass(classValue);

        let html = '<div class="subjects-checkbox-grid">';
        subjects.forEach(subject => {
            html += `
                <div class="subject-checkbox-item">
                    <label class="checkbox-label">
                        <input type="checkbox" name="tt_subject" value="${subject}" checked>
                        <span class="checkmark"></span>
                        ${subject}
                    </label>
                </div>
            `;
        });
        html += '</div>';

        subjectsSelection.innerHTML = html;
    }

    handleTimeTableForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const classValue = formData.get('tt_class');
        const examDate = formData.get('tt_exam_date');
        const startTime = formData.get('tt_start_time');
        const endTime = formData.get('tt_end_time');

        // Get selected subjects
        const selectedSubjects = Array.from(document.querySelectorAll('input[name="tt_subject"]:checked')).map(cb => cb.value);

        if (selectedSubjects.length === 0) {
            alert('Please select at least one subject');
            return;
        }

        // Create time table entries for each selected subject
        const timeTableEntries = selectedSubjects.map((subject, index) => {
            const examDateTime = new Date(examDate);
            examDateTime.setDate(examDateTime.getDate() + index); // Spread exams across multiple days

            return {
                id: Date.now() + index,
                class: classValue,
                subject: subject,
                exam_date: examDateTime.toISOString().split('T')[0],
                start_time: startTime,
                end_time: endTime,
                duration: this.calculateDuration(startTime, endTime),
                created_date: new Date().toISOString()
            };
        });

        // Add entries to time table
        this.examTimeTable.push(...timeTableEntries);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        e.target.reset();
        this.loadTimeTable();
        alert('Time table entries created successfully!');
    }

    calculateDuration(startTime, endTime) {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        const diffMinutes = (end - start) / (1000 * 60);
        return diffMinutes;
    }

    saveTimeTableInfo() {
        const title = document.getElementById('timetableTitle').value;
        const session = document.getElementById('examSession').value;
        const instructions = document.getElementById('instructions').value;

        this.timeTableInfo = {
            title: title,
            session: session,
            instructions: instructions
        };

        localStorage.setItem('timeTableInfo', JSON.stringify(this.timeTableInfo));
        alert('Time table information saved successfully!');
    }

    generateTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        const previewWindow = window.open('', '_blank', 'width=1000,height=800');
        const schoolInfo = this.schoolInfo;
        const timeTableInfo = this.timeTableInfo;

        // Group entries by date
        const groupedByDate = {};
        this.examTimeTable.forEach(entry => {
            if (!groupedByDate[entry.exam_date]) {
                groupedByDate[entry.exam_date] = [];
            }
            groupedByDate[entry.exam_date].push(entry);
        });

        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Exam Time Table</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 1000px;
                        margin: 0 auto;
                        padding: 20px;
                        background: white;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 3px solid #333;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .school-logo {
                        max-height: 80px;
                        margin-bottom: 10px;
                    }
                    .school-name {
                        font-size: 28px;
                        font-weight: bold;
                        color: #2c3e50;
                        margin: 10px 0;
                    }
                    .timetable-title {
                        font-size: 24px;
                        color: #e74c3c;
                        margin: 15px 0;
                        text-decoration: underline;
                    }
                    .exam-info {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin: 20px 0;
                        padding: 15px;
                        background: #f8f9fa;
                        border-radius: 5px;
                    }
                    .info-item {
                        text-align: center;
                    }
                    .info-label {
                        font-weight: bold;
                        color: #495057;
                    }
                    .info-value {
                        font-size: 18px;
                        color: #2c3e50;
                        margin-top: 5px;
                    }
                    .timetable-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    .timetable-table th, .timetable-table td {
                        border: 1px solid #ddd;
                        padding: 15px;
                        text-align: center;
                    }
                    .timetable-table th {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        font-weight: bold;
                    }
                    .timetable-table tr:nth-child(even) {
                        background: #f8f9fa;
                    }
                    .timetable-table tr:hover {
                        background: #e3f2fd;
                    }
                    .date-header {
                        background: #e9ecef !important;
                        font-weight: bold;
                        font-size: 16px;
                        color: #2c3e50;
                    }
                    .subject-name {
                        text-align: left;
                        font-weight: bold;
                        color: #2c3e50;
                    }
                    .instructions {
                        margin: 30px 0;
                        padding: 20px;
                        background: #fff3cd;
                        border: 1px solid #ffeaa7;
                        border-radius: 5px;
                    }
                    .instructions h4 {
                        color: #856404;
                        margin-top: 0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 2px solid #ddd;
                        color: #666;
                        font-size: 12px;
                    }
                    @media print {
                        body { margin: 0; padding: 15px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${schoolInfo.logo || ''}" alt="School Logo" class="school-logo" style="${schoolInfo.logo ? '' : 'display: none;'}">
                    <div class="school-name">${schoolInfo.name || 'School Management System'}</div>
                    <div class="school-address">${schoolInfo.address || ''}</div>
                    <div class="academic-year">Academic Year: ${schoolInfo.academicYear || ''}</div>
                </div>

                <div class="timetable-title">${timeTableInfo.title || 'EXAM TIME TABLE'}</div>

                <div class="exam-info">
                    <div class="info-item">
                        <div class="info-label">Exam Session</div>
                        <div class="info-value">${timeTableInfo.session || 'Not Specified'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Total Subjects</div>
                        <div class="info-value">${this.examTimeTable.length}</div>
                    </div>
                </div>

                <table class="timetable-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr ${index === 0 ? `class="date-header"` : ''}>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td class="subject-name">${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} minutes</td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>

                ${timeTableInfo.instructions ? `
                    <div class="instructions">
                        <h4>Important Instructions:</h4>
                        <p>${timeTableInfo.instructions.replace(/\n/g, '<br>')}</p>
                    </div>
                ` : ''}

                <div class="footer">
                    <p><strong>Generated by School Management System</strong></p>
                    <p>This time table is subject to change. Students are advised to check for updates regularly.</p>
                    <p>Generated on: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}</p>
                </div>

                <div class="no-print" style="text-align: center; margin-top: 30px;">
                    <button onclick="window.print()" style="margin-right: 10px; padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Time Table</button>
                    <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
                </div>
            </body>
            </html>
        `);
    }

    previewTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        this.generateTimeTable();
    }

    printTimeTable() {
        this.generateTimeTable();
        setTimeout(() => {
            window.print();
        }, 1000);
    }

    loadTimeTable() {
        const timetableTable = document.getElementById('timetableTable');
        const timetableInfo = document.getElementById('timetableInfo');

        if (this.examTimeTable.length === 0) {
            timetableTable.innerHTML = `
                <div class="no-timetable">
                    <p>No exam time table created yet.</p>
                    <p>Create your first time table to get started!</p>
                </div>
            `;
            timetableInfo.textContent = 'No time table created yet. Create your first time table!';
        } else {
            // Group entries by date for better display
            const groupedByDate = {};
            this.examTimeTable.forEach(entry => {
                if (!groupedByDate[entry.exam_date]) {
                    groupedByDate[entry.exam_date] = [];
                }
                groupedByDate[entry.exam_date].push(entry);
            });

            let html = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td>${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} min</td>
                                    <td>
                                        <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteTimeTableEntry('${entry.id}')">Remove</button>
                                    </td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>
            `;

            timetableTable.innerHTML = html;
            timetableInfo.textContent = `Time table with ${this.examTimeTable.length} exam(s) created successfully!`;
        }
    }

    deleteTimeTableEntry(id) {
        this.examTimeTable = this.examTimeTable.filter(entry => entry.id !== id);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        this.loadTimeTable();
    }

    loadSubjectsForTimeTable() {
        const classSelect = document.getElementById('ttClass');
        const subjectsSelection = document.getElementById('subjectsSelection');
        if (!subjectsSelection) return;

        const classValue = classSelect.value;
        if (!classValue) {
            subjectsSelection.innerHTML = '<p class="no-data">Select a class to load subjects</p>';
            return;
        }

        // Get subjects for the selected class
        const subjects = this.getSubjectsForClass(classValue);

        let html = '<div class="subjects-checkbox-grid">';
        subjects.forEach(subject => {
            html += `
                <div class="subject-checkbox-item">
                    <label class="checkbox-label">
                        <input type="checkbox" name="tt_subject" value="${subject}" checked>
                        <span class="checkmark"></span>
                        ${subject}
                    </label>
                </div>
            `;
        });
        html += '</div>';

        subjectsSelection.innerHTML = html;
    }

    handleTimeTableForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const classValue = formData.get('tt_class');
        const examDate = formData.get('tt_exam_date');
        const startTime = formData.get('tt_start_time');
        const endTime = formData.get('tt_end_time');

        // Get selected subjects
        const selectedSubjects = Array.from(document.querySelectorAll('input[name="tt_subject"]:checked')).map(cb => cb.value);

        if (selectedSubjects.length === 0) {
            alert('Please select at least one subject');
            return;
        }

        // Create time table entries for each selected subject
        const timeTableEntries = selectedSubjects.map((subject, index) => {
            const examDateTime = new Date(examDate);
            examDateTime.setDate(examDateTime.getDate() + index); // Spread exams across multiple days

            return {
                id: Date.now() + index,
                class: classValue,
                subject: subject,
                exam_date: examDateTime.toISOString().split('T')[0],
                start_time: startTime,
                end_time: endTime,
                duration: this.calculateDuration(startTime, endTime),
                created_date: new Date().toISOString()
            };
        });

        // Add entries to time table
        this.examTimeTable.push(...timeTableEntries);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        e.target.reset();
        this.loadTimeTable();
        alert('Time table entries created successfully!');
    }

    calculateDuration(startTime, endTime) {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        const diffMinutes = (end - start) / (1000 * 60);
        return diffMinutes;
    }

    saveTimeTableInfo() {
        const title = document.getElementById('timetableTitle').value;
        const session = document.getElementById('examSession').value;
        const instructions = document.getElementById('instructions').value;

        this.timeTableInfo = {
            title: title,
            session: session,
            instructions: instructions
        };

        localStorage.setItem('timeTableInfo', JSON.stringify(this.timeTableInfo));
        alert('Time table information saved successfully!');
    }

    generateTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        const previewWindow = window.open('', '_blank', 'width=1000,height=800');
        const schoolInfo = this.schoolInfo;
        const timeTableInfo = this.timeTableInfo;

        // Group entries by date
        const groupedByDate = {};
        this.examTimeTable.forEach(entry => {
            if (!groupedByDate[entry.exam_date]) {
                groupedByDate[entry.exam_date] = [];
            }
            groupedByDate[entry.exam_date].push(entry);
        });

        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Exam Time Table</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 1000px;
                        margin: 0 auto;
                        padding: 20px;
                        background: white;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 3px solid #333;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .school-logo {
                        max-height: 80px;
                        margin-bottom: 10px;
                    }
                    .school-name {
                        font-size: 28px;
                        font-weight: bold;
                        color: #2c3e50;
                        margin: 10px 0;
                    }
                    .timetable-title {
                        font-size: 24px;
                        color: #e74c3c;
                        margin: 15px 0;
                        text-decoration: underline;
                    }
                    .exam-info {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin: 20px 0;
                        padding: 15px;
                        background: #f8f9fa;
                        border-radius: 5px;
                    }
                    .info-item {
                        text-align: center;
                    }
                    .info-label {
                        font-weight: bold;
                        color: #495057;
                    }
                    .info-value {
                        font-size: 18px;
                        color: #2c3e50;
                        margin-top: 5px;
                    }
                    .timetable-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    .timetable-table th, .timetable-table td {
                        border: 1px solid #ddd;
                        padding: 15px;
                        text-align: center;
                    }
                    .timetable-table th {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        font-weight: bold;
                    }
                    .timetable-table tr:nth-child(even) {
                        background: #f8f9fa;
                    }
                    .timetable-table tr:hover {
                        background: #e3f2fd;
                    }
                    .date-header {
                        background: #e9ecef !important;
                        font-weight: bold;
                        font-size: 16px;
                        color: #2c3e50;
                    }
                    .subject-name {
                        text-align: left;
                        font-weight: bold;
                        color: #2c3e50;
                    }
                    .instructions {
                        margin: 30px 0;
                        padding: 20px;
                        background: #fff3cd;
                        border: 1px solid #ffeaa7;
                        border-radius: 5px;
                    }
                    .instructions h4 {
                        color: #856404;
                        margin-top: 0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 2px solid #ddd;
                        color: #666;
                        font-size: 12px;
                    }
                    @media print {
                        body { margin: 0; padding: 15px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${schoolInfo.logo || ''}" alt="School Logo" class="school-logo" style="${schoolInfo.logo ? '' : 'display: none;'}">
                    <div class="school-name">${schoolInfo.name || 'School Management System'}</div>
                    <div class="school-address">${schoolInfo.address || ''}</div>
                    <div class="academic-year">Academic Year: ${schoolInfo.academicYear || ''}</div>
                </div>

                <div class="timetable-title">${timeTableInfo.title || 'EXAM TIME TABLE'}</div>

                <div class="exam-info">
                    <div class="info-item">
                        <div class="info-label">Exam Session</div>
                        <div class="info-value">${timeTableInfo.session || 'Not Specified'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Total Subjects</div>
                        <div class="info-value">${this.examTimeTable.length}</div>
                    </div>
                </div>

                <table class="timetable-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr ${index === 0 ? `class="date-header"` : ''}>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td class="subject-name">${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} minutes</td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>

                ${timeTableInfo.instructions ? `
                    <div class="instructions">
                        <h4>Important Instructions:</h4>
                        <p>${timeTableInfo.instructions.replace(/\n/g, '<br>')}</p>
                    </div>
                ` : ''}

                <div class="footer">
                    <p><strong>Generated by School Management System</strong></p>
                    <p>This time table is subject to change. Students are advised to check for updates regularly.</p>
                    <p>Generated on: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}</p>
                </div>

                <div class="no-print" style="text-align: center; margin-top: 30px;">
                    <button onclick="window.print()" style="margin-right: 10px; padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Time Table</button>
                    <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
                </div>
            </body>
            </html>
        `);
    }

    previewTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        this.generateTimeTable();
    }

    printTimeTable() {
        this.generateTimeTable();
        setTimeout(() => {
            window.print();
        }, 1000);
    }

    loadTimeTable() {
        const timetableTable = document.getElementById('timetableTable');
        const timetableInfo = document.getElementById('timetableInfo');

        if (this.examTimeTable.length === 0) {
            timetableTable.innerHTML = `
                <div class="no-timetable">
                    <p>No exam time table created yet.</p>
                    <p>Create your first time table to get started!</p>
                </div>
            `;
            timetableInfo.textContent = 'No time table created yet. Create your first time table!';
        } else {
            // Group entries by date for better display
            const groupedByDate = {};
            this.examTimeTable.forEach(entry => {
                if (!groupedByDate[entry.exam_date]) {
                    groupedByDate[entry.exam_date] = [];
                }
                groupedByDate[entry.exam_date].push(entry);
            });

            let html = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td>${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} min</td>
                                    <td>
                                        <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteTimeTableEntry('${entry.id}')">Remove</button>
                                    </td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>
            `;

            timetableTable.innerHTML = html;
            timetableInfo.textContent = `Time table with ${this.examTimeTable.length} exam(s) created successfully!`;
        }
    }

    deleteTimeTableEntry(id) {
        this.examTimeTable = this.examTimeTable.filter(entry => entry.id !== id);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        this.loadTimeTable();
    }

    loadSubjectsForTimeTable() {
        const classSelect = document.getElementById('ttClass');
        const subjectsSelection = document.getElementById('subjectsSelection');
        if (!subjectsSelection) return;

        const classValue = classSelect.value;
        if (!classValue) {
            subjectsSelection.innerHTML = '<p class="no-data">Select a class to load subjects</p>';
            return;
        }

        // Get subjects for the selected class
        const subjects = this.getSubjectsForClass(classValue);

        let html = '<div class="subjects-checkbox-grid">';
        subjects.forEach(subject => {
            html += `
                <div class="subject-checkbox-item">
                    <label class="checkbox-label">
                        <input type="checkbox" name="tt_subject" value="${subject}" checked>
                        <span class="checkmark"></span>
                        ${subject}
                    </label>
                </div>
            `;
        });
        html += '</div>';

        subjectsSelection.innerHTML = html;
    }

    handleTimeTableForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const classValue = formData.get('tt_class');
        const examDate = formData.get('tt_exam_date');
        const startTime = formData.get('tt_start_time');
        const endTime = formData.get('tt_end_time');

        // Get selected subjects
        const selectedSubjects = Array.from(document.querySelectorAll('input[name="tt_subject"]:checked')).map(cb => cb.value);

        if (selectedSubjects.length === 0) {
            alert('Please select at least one subject');
            return;
        }

        // Create time table entries for each selected subject
        const timeTableEntries = selectedSubjects.map((subject, index) => {
            const examDateTime = new Date(examDate);
            examDateTime.setDate(examDateTime.getDate() + index); // Spread exams across multiple days

            return {
                id: Date.now() + index,
                class: classValue,
                subject: subject,
                exam_date: examDateTime.toISOString().split('T')[0],
                start_time: startTime,
                end_time: endTime,
                duration: this.calculateDuration(startTime, endTime),
                created_date: new Date().toISOString()
            };
        });

        // Add entries to time table
        this.examTimeTable.push(...timeTableEntries);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        e.target.reset();
        this.loadTimeTable();
        alert('Time table entries created successfully!');
    }

    calculateDuration(startTime, endTime) {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        const diffMinutes = (end - start) / (1000 * 60);
        return diffMinutes;
    }

    saveTimeTableInfo() {
        const title = document.getElementById('timetableTitle').value;
        const session = document.getElementById('examSession').value;
        const instructions = document.getElementById('instructions').value;

        this.timeTableInfo = {
            title: title,
            session: session,
            instructions: instructions
        };

        localStorage.setItem('timeTableInfo', JSON.stringify(this.timeTableInfo));
        alert('Time table information saved successfully!');
    }

    generateTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        const previewWindow = window.open('', '_blank', 'width=1000,height=800');
        const schoolInfo = this.schoolInfo;
        const timeTableInfo = this.timeTableInfo;

        // Group entries by date
        const groupedByDate = {};
        this.examTimeTable.forEach(entry => {
            if (!groupedByDate[entry.exam_date]) {
                groupedByDate[entry.exam_date] = [];
            }
            groupedByDate[entry.exam_date].push(entry);
        });

        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Exam Time Table</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 1000px;
                        margin: 0 auto;
                        padding: 20px;
                        background: white;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 3px solid #333;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .school-logo {
                        max-height: 80px;
                        margin-bottom: 10px;
                    }
                    .school-name {
                        font-size: 28px;
                        font-weight: bold;
                        color: #2c3e50;
                        margin: 10px 0;
                    }
                    .timetable-title {
                        font-size: 24px;
                        color: #e74c3c;
                        margin: 15px 0;
                        text-decoration: underline;
                    }
                    .exam-info {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin: 20px 0;
                        padding: 15px;
                        background: #f8f9fa;
                        border-radius: 5px;
                    }
                    .info-item {
                        text-align: center;
                    }
                    .info-label {
                        font-weight: bold;
                        color: #495057;
                    }
                    .info-value {
                        font-size: 18px;
                        color: #2c3e50;
                        margin-top: 5px;
                    }
                    .timetable-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    .timetable-table th, .timetable-table td {
                        border: 1px solid #ddd;
                        padding: 15px;
                        text-align: center;
                    }
                    .timetable-table th {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        font-weight: bold;
                    }
                    .timetable-table tr:nth-child(even) {
                        background: #f8f9fa;
                    }
                    .timetable-table tr:hover {
                        background: #e3f2fd;
                    }
                    .date-header {
                        background: #e9ecef !important;
                        font-weight: bold;
                        font-size: 16px;
                        color: #2c3e50;
                    }
                    .subject-name {
                        text-align: left;
                        font-weight: bold;
                        color: #2c3e50;
                    }
                    .instructions {
                        margin: 30px 0;
                        padding: 20px;
                        background: #fff3cd;
                        border: 1px solid #ffeaa7;
                        border-radius: 5px;
                    }
                    .instructions h4 {
                        color: #856404;
                        margin-top: 0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 2px solid #ddd;
                        color: #666;
                        font-size: 12px;
                    }
                    @media print {
                        body { margin: 0; padding: 15px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${schoolInfo.logo || ''}" alt="School Logo" class="school-logo" style="${schoolInfo.logo ? '' : 'display: none;'}">
                    <div class="school-name">${schoolInfo.name || 'School Management System'}</div>
                    <div class="school-address">${schoolInfo.address || ''}</div>
                    <div class="academic-year">Academic Year: ${schoolInfo.academicYear || ''}</div>
                </div>

                <div class="timetable-title">${timeTableInfo.title || 'EXAM TIME TABLE'}</div>

                <div class="exam-info">
                    <div class="info-item">
                        <div class="info-label">Exam Session</div>
                        <div class="info-value">${timeTableInfo.session || 'Not Specified'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Total Subjects</div>
                        <div class="info-value">${this.examTimeTable.length}</div>
                    </div>
                </div>

                <table class="timetable-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr ${index === 0 ? `class="date-header"` : ''}>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td class="subject-name">${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} minutes</td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>

                ${timeTableInfo.instructions ? `
                    <div class="instructions">
                        <h4>Important Instructions:</h4>
                        <p>${timeTableInfo.instructions.replace(/\n/g, '<br>')}</p>
                    </div>
                ` : ''}

                <div class="footer">
                    <p><strong>Generated by School Management System</strong></p>
                    <p>This time table is subject to change. Students are advised to check for updates regularly.</p>
                    <p>Generated on: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}</p>
                </div>

                <div class="no-print" style="text-align: center; margin-top: 30px;">
                    <button onclick="window.print()" style="margin-right: 10px; padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Time Table</button>
                    <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
                </div>
            </body>
            </html>
        `);
    }

    previewTimeTable() {
        if (this.examTimeTable.length === 0) {
            alert('No time table entries found. Please create some entries first.');
            return;
        }

        this.generateTimeTable();
    }

    printTimeTable() {
        this.generateTimeTable();
        setTimeout(() => {
            window.print();
        }, 1000);
    }

    loadTimeTable() {
        const timetableTable = document.getElementById('timetableTable');
        const timetableInfo = document.getElementById('timetableInfo');

        if (this.examTimeTable.length === 0) {
            timetableTable.innerHTML = `
                <div class="no-timetable">
                    <p>No exam time table created yet.</p>
                    <p>Create your first time table to get started!</p>
                </div>
            `;
            timetableInfo.textContent = 'No time table created yet. Create your first time table!';
        } else {
            // Group entries by date for better display
            const groupedByDate = {};
            this.examTimeTable.forEach(entry => {
                if (!groupedByDate[entry.exam_date]) {
                    groupedByDate[entry.exam_date] = [];
                }
                groupedByDate[entry.exam_date].push(entry);
            });

            let html = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(groupedByDate).sort().map(date => {
                            const dateObj = new Date(date);
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                            const entries = groupedByDate[date];

                            return entries.map((entry, index) => `
                                <tr>
                                    ${index === 0 ? `<td rowspan="${entries.length}">${new Date(date).toLocaleDateString()}</td>` : ''}
                                    ${index === 0 ? `<td rowspan="${entries.length}">${dayName}</td>` : ''}
                                    <td>${entry.subject}</td>
                                    <td>${entry.start_time}</td>
                                    <td>${entry.end_time}</td>
                                    <td>${entry.duration} min</td>
                                    <td>
                                        <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteTimeTableEntry('${entry.id}')">Remove</button>
                                    </td>
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>
            `;

            timetableTable.innerHTML = html;
            timetableInfo.textContent = `Time table with ${this.examTimeTable.length} exam(s) created successfully!`;
        }
    }

    deleteTimeTableEntry(id) {
        this.examTimeTable = this.examTimeTable.filter(entry => entry.id !== id);
        localStorage.setItem('examTimeTable', JSON.stringify(this.examTimeTable));
        this.loadTimeTable();
    }

    showAddResultForm() {
        document.getElementById('addResultFormContainer').style.display = 'block';
        this.loadStudentsForResult();
    }

    hideAddResultForm() {
        document.getElementById('addResultFormContainer').style.display = 'none';
        document.getElementById('gradeCalculation').style.display = 'none';
    }

    loadStudentsForResult() {
        const studentSelect = document.getElementById('resultStudent');
        if (!studentSelect) return;

        // Clear existing options except the first one
        while (studentSelect.children.length > 1) {
            studentSelect.removeChild(studentSelect.lastChild);
        }

        // Add all students to the dropdown
        this.students.forEach(student => {
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = `${student.name} (${student.class} - Roll: ${student.roll_no || student.rollNo})`;
            studentSelect.appendChild(option);
        });
    }

    loadSubjectsForResult() {
        const classValue = document.getElementById('resultClass').value;
        const subjectsContainer = document.getElementById('subjectsContainer');
        if (!subjectsContainer) return;

        if (!classValue) {
            subjectsContainer.innerHTML = '<p class="no-data">Select a class to load subjects</p>';
            return;
        }

        // Get subjects for the selected class
        const subjects = this.getSubjectsForClass(classValue);

        let html = '<div class="subjects-grid">';
        subjects.forEach((subject, index) => {
            html += `
                <div class="subject-marks-entry">
                    <div class="subject-info">
                        <label>${subject}</label>
                        <input type="hidden" name="subject_${index}" value="${subject}">
                    </div>
                    <div class="marks-inputs">
                        <div class="marks-field">
                            <label>Marks Obtained</label>
                            <input type="number" name="marks_${index}" min="0" max="100" step="0.5"
                                   placeholder="0-100" oninput="schoolSystem.calculateGrade()">
                        </div>
                        <div class="marks-field">
                            <label>Out of</label>
                            <input type="number" name="max_marks_${index}" value="100" min="1"
                                   oninput="schoolSystem.calculateGrade()">
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';

        subjectsContainer.innerHTML = html;
    }

    handleResultForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const studentId = formData.get('result_student');
        const student = this.students.find(s => s.id == studentId);

        if (!student) {
            alert('Please select a valid student');
            return;
        }

        // Collect all subject marks
        const subjects = [];
        const subjectsContainer = document.getElementById('subjectsContainer');
        const subjectEntries = subjectsContainer.querySelectorAll('.subject-marks-entry');

        subjectEntries.forEach((entry, index) => {
            const subjectName = formData.get(`subject_${index}`);
            const marks = parseFloat(formData.get(`marks_${index}`) || 0);
            const maxMarks = parseFloat(formData.get(`max_marks_${index}`) || 100);
            const percentage = (marks / maxMarks) * 100;

            subjects.push({
                name: subjectName,
                marks: marks,
                maxMarks: maxMarks,
                percentage: percentage
            });
        });

        // Calculate overall result
        const totalMarks = subjects.reduce((sum, subj) => sum + subj.marks, 0);
        const totalMaxMarks = subjects.reduce((sum, subj) => sum + subj.maxMarks, 0);
        const overallPercentage = (totalMarks / totalMaxMarks) * 100;

        const result = {
            id: Date.now(),
            student_id: studentId,
            student_name: student.name,
            student_roll: student.roll_no || student.rollNo,
            class: student.class,
            section: student.section,
            exam_type: formData.get('exam_type'),
            exam_date: formData.get('exam_date'),
            subjects: subjects,
            total_marks: totalMarks,
            total_max_marks: totalMaxMarks,
            overall_percentage: overallPercentage,
            grade: this.calculateGrade(overallPercentage),
            result_date: new Date().toISOString()
        };

        this.studentResults.push(result);
        localStorage.setItem('studentResults', JSON.stringify(this.studentResults));
        e.target.reset();
        this.loadResults();
        document.getElementById('gradeCalculation').style.display = 'none';
        alert('Student result created successfully!');
    }

    calculateGrade(percentage = null) {
        if (percentage === null) {
            // Calculate from form inputs
            const subjectsContainer = document.getElementById('subjectsContainer');
            if (!subjectsContainer) return;

            const marksInputs = subjectsContainer.querySelectorAll('input[name*="marks_"]');
            const maxMarksInputs = subjectsContainer.querySelectorAll('input[name*="max_marks_"]');

            let totalMarks = 0;
            let totalMaxMarks = 0;

            marksInputs.forEach((input, index) => {
                const marks = parseFloat(input.value) || 0;
                const maxMarks = parseFloat(maxMarksInputs[index]?.value) || 100;
                totalMarks += marks;
                totalMaxMarks += maxMarks;
            });

            if (totalMaxMarks === 0) return;

            percentage = (totalMarks / totalMaxMarks) * 100;
        }

        let grade = 'F';
        if (percentage >= 90) grade = 'A+';
        else if (percentage >= 80) grade = 'A';
        else if (percentage >= 70) grade = 'B+';
        else if (percentage >= 60) grade = 'B';
        else if (percentage >= 50) grade = 'C+';
        else if (percentage >= 40) grade = 'C';
        else if (percentage >= 33) grade = 'D';

        // Update the result summary
        const resultSummary = document.getElementById('resultSummary');
        if (resultSummary) {
            resultSummary.innerHTML = `
                <div class="summary-grid">
                    <div class="summary-item">
                        <strong>Total Marks:</strong> ${totalMarks.toFixed(2)}
                    </div>
                    <div class="summary-item">
                        <strong>Maximum Marks:</strong> ${totalMaxMarks}
                    </div>
                    <div class="summary-item">
                        <strong>Percentage:</strong> ${percentage.toFixed(2)}%
                    </div>
                    <div class="summary-item">
                        <strong>Grade:</strong> ${grade}
                    </div>
                </div>
            `;
            document.getElementById('gradeCalculation').style.display = 'block';
        }

        return grade;
    }

    saveSchoolInfo() {
        const schoolName = document.getElementById('schoolName').value;
        const schoolAddress = document.getElementById('schoolAddress').value;
        const academicYear = document.getElementById('academicYear').value;

        this.schoolInfo = {
            name: schoolName,
            address: schoolAddress,
            academicYear: academicYear,
            logo: this.schoolInfo.logo // Keep existing logo
        };

        localStorage.setItem('schoolInfo', JSON.stringify(this.schoolInfo));
        alert('School information saved successfully!');
    }

    previewSchoolLogo(event) {
        const file = event.target.files[0];
        const logoImg = document.getElementById('logoImg');

        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                logoImg.src = e.target.result;
                logoImg.style.display = 'block';

                // Save logo to school info
                schoolSystem.schoolInfo.logo = e.target.result;
                localStorage.setItem('schoolInfo', JSON.stringify(schoolSystem.schoolInfo));
            };
            reader.readAsDataURL(file);
        }
    }

    previewResult() {
        const schoolInfo = this.schoolInfo;
        if (!schoolInfo.name) {
            alert('Please set up school information first');
            return;
        }

        // Get the latest result for preview
        const latestResult = this.studentResults[this.studentResults.length - 1];
        if (!latestResult) {
            alert('Please create a result first');
            return;
        }

        // Create result preview window
        const previewWindow = window.open('', '_blank', 'width=900,height=700');
        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Student Result - ${latestResult.student_name}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                        background: white;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 3px solid #333;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .school-logo {
                        max-height: 80px;
                        margin-bottom: 10px;
                    }
                    .school-name {
                        font-size: 28px;
                        font-weight: bold;
                        color: #2c3e50;
                        margin: 10px 0;
                    }
                    .school-address {
                        font-size: 14px;
                        color: #666;
                    }
                    .academic-year {
                        font-size: 16px;
                        color: #3498db;
                        margin-top: 5px;
                    }
                    .result-title {
                        text-align: center;
                        font-size: 24px;
                        color: #e74c3c;
                        margin: 20px 0;
                        text-decoration: underline;
                    }
                    .student-info {
                        display: table;
                        width: 100%;
                        margin: 20px 0;
                        border-collapse: collapse;
                    }
                    .student-info td {
                        padding: 8px;
                        border: 1px solid #ddd;
                    }
                    .student-info .label {
                        background: #f8f9fa;
                        font-weight: bold;
                        width: 30%;
                    }
                    .marks-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    .marks-table th, .marks-table td {
                        border: 1px solid #ddd;
                        padding: 12px;
                        text-align: center;
                    }
                    .marks-table th {
                        background: #f8f9fa;
                        font-weight: bold;
                    }
                    .marks-table .subject {
                        text-align: left;
                        font-weight: bold;
                    }
                    .summary-section {
                        margin: 30px 0;
                        padding: 20px;
                        background: #f8f9fa;
                        border-radius: 8px;
                    }
                    .summary-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                    }
                    .summary-item {
                        text-align: center;
                        padding: 15px;
                        background: white;
                        border-radius: 5px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    .summary-item .value {
                        font-size: 24px;
                        font-weight: bold;
                        color: #2c3e50;
                    }
                    .summary-item .label {
                        font-size: 14px;
                        color: #666;
                        margin-top: 5px;
                    }
                    .grade {
                        font-size: 32px;
                        font-weight: bold;
                        color: #27ae60;
                        text-align: center;
                        margin: 20px 0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 1px solid #ddd;
                        color: #666;
                    }
                    @media print {
                        body { margin: 0; padding: 15px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${schoolInfo.logo || ''}" alt="School Logo" class="school-logo" style="${schoolInfo.logo ? '' : 'display: none;'}">
                    <div class="school-name">${schoolInfo.name}</div>
                    <div class="school-address">${schoolInfo.address}</div>
                    <div class="academic-year">Academic Year: ${schoolInfo.academicYear}</div>
                </div>

                <div class="result-title">ACADEMIC PERFORMANCE REPORT</div>

                <table class="student-info">
                    <tr>
                        <td class="label">Student Name:</td>
                        <td>${latestResult.student_name}</td>
                        <td class="label">Roll No:</td>
                        <td>${latestResult.student_roll}</td>
                    </tr>
                    <tr>
                        <td class="label">Class:</td>
                        <td>${latestResult.class} - ${latestResult.section || 'N/A'}</td>
                        <td class="label">Exam Type:</td>
                        <td>${latestResult.exam_type}</td>
                    </tr>
                    <tr>
                        <td class="label">Exam Date:</td>
                        <td>${new Date(latestResult.exam_date).toLocaleDateString()}</td>
                        <td class="label">Result Date:</td>
                        <td>${new Date(latestResult.result_date).toLocaleDateString()}</td>
                    </tr>
                </table>

                <table class="marks-table">
                    <thead>
                        <tr>
                            <th class="subject">Subject</th>
                            <th>Marks Obtained</th>
                            <th>Maximum Marks</th>
                            <th>Percentage</th>
                            <th>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${latestResult.subjects.map(subject => `
                            <tr>
                                <td class="subject">${subject.name}</td>
                                <td>${subject.marks}</td>
                                <td>${subject.maxMarks}</td>
                                <td>${subject.percentage.toFixed(2)}%</td>
                                <td>${this.getGradeLetter(subject.percentage)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="summary-section">
                    <h3 style="text-align: center; margin-bottom: 20px; color: #2c3e50;">Final Result</h3>
                    <div class="summary-grid">
                        <div class="summary-item">
                            <div class="value">${latestResult.total_marks.toFixed(2)}</div>
                            <div class="label">Total Marks</div>
                        </div>
                        <div class="summary-item">
                            <div class="value">${latestResult.total_max_marks}</div>
                            <div class="label">Maximum Marks</div>
                        </div>
                        <div class="summary-item">
                            <div class="value">${latestResult.overall_percentage.toFixed(2)}%</div>
                            <div class="label">Overall Percentage</div>
                        </div>
                        <div class="summary-item">
                            <div class="value">${latestResult.grade}</div>
                            <div class="label">Final Grade</div>
                        </div>
                    </div>
                    <div class="grade">${this.getGradeDescription(latestResult.grade)}</div>
                </div>

                <div class="footer">
                    <p>This is a computer-generated report and does not require signature.</p>
                    <p>Generated on: ${new Date().toLocaleDateString()}</p>
                </div>

                <div class="no-print" style="text-align: center; margin-top: 30px;">
                    <button onclick="window.print()" style="margin-right: 10px; padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Result</button>
                    <button onclick="window.close()" style="padding: 10px 20px; background: #95a5a6; color: white; border: none; border-radius: 5px; cursor: pointer;">Close Preview</button>
                </div>
            </body>
            </html>
        `);
    }

    getGradeLetter(percentage) {
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B+';
        if (percentage >= 60) return 'B';
        if (percentage >= 50) return 'C+';
        if (percentage >= 40) return 'C';
        if (percentage >= 33) return 'D';
        return 'F';
    }

    getGradeDescription(grade) {
        const descriptions = {
            'A+': 'OUTSTANDING',
            'A': 'EXCELLENT',
            'B+': 'VERY GOOD',
            'B': 'GOOD',
            'C+': 'SATISFACTORY',
            'C': 'NEEDS IMPROVEMENT',
            'D': 'PASS',
            'F': 'FAIL'
        };
        return descriptions[grade] || 'NOT GRADED';
    }

    generateAllResults() {
        if (this.studentResults.length === 0) {
            alert('No results found to generate report');
            return;
        }

        const previewWindow = window.open('', '_blank', 'width=1000,height=800');
        const schoolInfo = this.schoolInfo;

        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>All Students Results Report</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 20px;
                        background: white;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 3px solid #333;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .school-logo {
                        max-height: 80px;
                        margin-bottom: 10px;
                    }
                    .school-name {
                        font-size: 28px;
                        font-weight: bold;
                        color: #2c3e50;
                        margin: 10px 0;
                    }
                    .results-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    .results-table th, .results-table td {
                        border: 1px solid #ddd;
                        padding: 12px;
                        text-align: center;
                    }
                    .results-table th {
                        background: #f8f9fa;
                        font-weight: bold;
                    }
                    .student-name {
                        text-align: left;
                        font-weight: bold;
                    }
                    .grade {
                        font-weight: bold;
                        padding: 5px 10px;
                        border-radius: 3px;
                    }
                    .grade-A+ { background: #d4edda; color: #155724; }
                    .grade-A { background: #cce7ff; color: #004085; }
                    .grade-B+ { background: #e2e3e5; color: #383d41; }
                    .grade-B { background: #fff3cd; color: #856404; }
                    .grade-C+ { background: #fce4d6; color: #721c24; }
                    .grade-C { background: #f8d7da; color: #721c24; }
                    .grade-D { background: #d1ecf1; color: #0c5460; }
                    .grade-F { background: #f5c6cb; color: #721c24; }
                    @media print {
                        body { margin: 0; padding: 15px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${schoolInfo.logo || ''}" alt="School Logo" class="school-logo" style="${schoolInfo.logo ? '' : 'display: none;'}">
                    <div class="school-name">${schoolInfo.name || 'School Management System'}</div>
                    <div class="school-address">${schoolInfo.address || ''}</div>
                    <div class="academic-year">Academic Year: ${schoolInfo.academicYear || ''}</div>
                    <h2>All Students Results Report</h2>
                    <p>Generated on: ${new Date().toLocaleDateString()}</p>
                </div>

                <table class="results-table">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Roll No</th>
                            <th>Class</th>
                            <th>Exam Type</th>
                            <th>Total Marks</th>
                            <th>Percentage</th>
                            <th>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.studentResults.map(result => `
                            <tr>
                                <td class="student-name">${result.student_name}</td>
                                <td>${result.student_roll}</td>
                                <td>${result.class}</td>
                                <td>${result.exam_type}</td>
                                <td>${result.total_marks.toFixed(2)}</td>
                                <td>${result.overall_percentage.toFixed(2)}%</td>
                                <td><span class="grade grade-${result.grade}">${result.grade}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="no-print" style="text-align: center; margin-top: 30px;">
                    <button onclick="window.print()" style="margin-right: 10px; padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Report</button>
                    <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
                </div>
            </body>
            </html>
        `);
    }

    loadResults() {
        const resultsList = document.getElementById('resultsList');
        if (resultsList) {
            if (this.studentResults.length === 0) {
                resultsList.innerHTML = `
                    <div class="results-display">
                        <p>No results created yet. Create your first result!</p>
                    </div>
                `;
            } else {
                resultsList.innerHTML = `
                    <div class="results-display">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Roll No</th>
                                    <th>Class</th>
                                    <th>Exam Type</th>
                                    <th>Percentage</th>
                                    <th>Grade</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.studentResults.map(r => `
                                    <tr>
                                        <td>${r.student_name}</td>
                                        <td>${r.student_roll}</td>
                                        <td>${r.class}</td>
                                        <td>${r.exam_type}</td>
                                        <td>${r.overall_percentage.toFixed(2)}%</td>
                                        <td>
                                            <span class="status-badge status-${r.grade.toLowerCase()}">${r.grade}</span>
                                        </td>
                                        <td>
                                            <button class="btn btn-sm btn-success" onclick="schoolSystem.previewResult('${r.id}')">View</button>
                                            <button class="btn btn-sm btn-primary" onclick="schoolSystem.editResult('${r.id}')">Edit</button>
                                            <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteResult('${r.id}')">Delete</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            }
        }
    }

    editResult(id) {
        // Implement edit logic
        alert('Edit result ' + id);
    }

    deleteResult(id) {
        this.studentResults = this.studentResults.filter(r => r.id !== id);
        localStorage.setItem('studentResults', JSON.stringify(this.studentResults));
        this.loadResults();
    }

    showAddAdmissionForm() {
        console.log('showAddAdmissionForm called');
        const container = document.getElementById('addAdmissionFormContainer');
        if (container) {
            container.style.display = 'block';
            console.log('Admission form container shown');
            // Reset form when opening
            const form = document.getElementById('admissionForm');
            if (form) {
                form.reset();
                console.log('Admission form reset');
            }
        } else {
            console.error('Admission form container not found');
        }
    }

    hideAddAdmissionForm() {
        document.getElementById('addAdmissionFormContainer').style.display = 'none';
    }

    approveAdmission(id) {
        const admission = this.admissions.find(a => a.id === id);
        if (admission) {
            admission.status = 'approved';
            localStorage.setItem('admissions', JSON.stringify(this.admissions));
            this.loadAdmissions();
            this.loadDashboardData();
            alert('Admission approved successfully!');
        }
    }

    rejectAdmission(id) {
        const admission = this.admissions.find(a => a.id === id);
        if (admission) {
            admission.status = 'rejected';
            localStorage.setItem('admissions', JSON.stringify(this.admissions));
            this.loadAdmissions();
            this.loadDashboardData();
            alert('Admission rejected!');
        }
    }

    editAdmission(id) {
        // Implement edit logic
        alert('Edit admission ' + id);
    }

    deleteAdmission(id) {
        this.admissions = this.admissions.filter(a => a.id !== id);
        localStorage.setItem('admissions', JSON.stringify(this.admissions));
        this.loadAdmissions();
        this.loadDashboardData();
    }

    showStudentAttendanceForm() {
        document.getElementById('studentAttendanceFormContainer').style.display = 'block';
        document.getElementById('attendanceDate').valueAsDate = new Date();
    }

    hideStudentAttendanceForm() {
        document.getElementById('studentAttendanceFormContainer').style.display = 'none';
    }

    showTeacherAttendanceForm() {
        document.getElementById('teacherAttendanceFormContainer').style.display = 'block';
        document.getElementById('teacherAttendanceDate').valueAsDate = new Date();
        this.loadTeachersForAttendance();
    }

    hideTeacherAttendanceForm() {
        document.getElementById('teacherAttendanceFormContainer').style.display = 'none';
    }

    viewAttendanceReport() {
        document.getElementById('attendanceReportContainer').style.display = 'block';
        document.getElementById('reportStartDate').valueAsDate = new Date();
        document.getElementById('reportEndDate').valueAsDate = new Date();
    }

    loadStudentsForAttendance() {
        const classValue = document.getElementById('attendanceClass').value;
        const sectionValue = document.getElementById('attendanceSection').value;

        if (!classValue) {
            document.getElementById('studentsAttendanceList').innerHTML = '<p class="no-data">Please select a class first</p>';
            return;
        }

        const filteredStudents = this.students.filter(s => s.class === classValue && (!sectionValue || s.section === sectionValue));

        if (filteredStudents.length === 0) {
            document.getElementById('studentsAttendanceList').innerHTML = '<p class="no-data">No students found for selected class/section</p>';
            return;
        }

        const date = document.getElementById('attendanceDate').value;
        const dateKey = date || new Date().toISOString().split('T')[0];

        document.getElementById('studentsAttendanceList').innerHTML = filteredStudents.map(s => {
            const attendanceKey = `${s.id}_${dateKey}`;
            const existingAttendance = this.attendance[attendanceKey];

            return `
                <div class="attendance-item">
                    <div class="attendance-info">
                        <strong>${s.name}</strong> (Roll: ${s.roll_no || s.rollNo})
                    </div>
                    <div class="attendance-options">
                        <label>
                            <input type="radio" name="attendance_${s.id}" value="present" ${existingAttendance === 'present' ? 'checked' : ''}>
                            Present
                        </label>
                        <label>
                            <input type="radio" name="attendance_${s.id}" value="absent" ${existingAttendance === 'absent' ? 'checked' : ''}>
                            Absent
                        </label>
                        <label>
                            <input type="radio" name="attendance_${s.id}" value="late" ${existingAttendance === 'late' ? 'checked' : ''}>
                            Late
                        </label>
                    </div>
                </div>
            `;
        }).join('');
    }

    loadTeachersForAttendance() {
        const subjectFilter = document.getElementById('teacherAttendanceSubject').value;

        const filteredTeachers = subjectFilter
            ? this.teachers.filter(t => t.subject === subjectFilter)
            : this.teachers;

        if (filteredTeachers.length === 0) {
            document.getElementById('teachersAttendanceList').innerHTML = '<p class="no-data">No teachers found</p>';
            return;
        }

        const date = document.getElementById('teacherAttendanceDate').value;
        const dateKey = date || new Date().toISOString().split('T')[0];

        document.getElementById('teachersAttendanceList').innerHTML = filteredTeachers.map(t => {
            const attendanceKey = `teacher_${t.id}_${dateKey}`;
            const existingAttendance = this.attendance[attendanceKey];

            return `
                <div class="attendance-item">
                    <div class="attendance-info">
                        <strong>${t.name}</strong> (${t.subject})
                    </div>
                    <div class="attendance-options">
                        <label>
                            <input type="radio" name="attendance_teacher_${t.id}" value="present" ${existingAttendance === 'present' ? 'checked' : ''}>
                            Present
                        </label>
                        <label>
                            <input type="radio" name="attendance_teacher_${t.id}" value="absent" ${existingAttendance === 'absent' ? 'checked' : ''}>
                            Absent
                        </label>
                    </div>
                </div>
            `;
        }).join('');
    }

    handleStudentAttendanceForm(e) {
        e.preventDefault();
        const date = document.getElementById('attendanceDate').value;
        const classValue = document.getElementById('attendanceClass').value;
        const sectionValue = document.getElementById('attendanceSection').value;

        if (!date || !classValue) {
            alert('Please select date and class');
            return;
        }

        const filteredStudents = this.students.filter(s => s.class === classValue && (!sectionValue || s.section === sectionValue));

        filteredStudents.forEach(student => {
            const attendanceValue = document.querySelector(`input[name="attendance_${student.id}"]:checked`)?.value;
            if (attendanceValue) {
                const attendanceKey = `${student.id}_${date}`;
                this.attendance[attendanceKey] = attendanceValue;
            }
        });

        localStorage.setItem('attendance', JSON.stringify(this.attendance));
        alert('Student attendance saved successfully!');
        this.updateAttendanceSummary();
    }

    handleTeacherAttendanceForm(e) {
        e.preventDefault();
        const date = document.getElementById('teacherAttendanceDate').value;

        if (!date) {
            alert('Please select date');
            return;
        }

        this.teachers.forEach(teacher => {
            const attendanceValue = document.querySelector(`input[name="attendance_teacher_${teacher.id}"]:checked`)?.value;
            if (attendanceValue) {
                const attendanceKey = `teacher_${teacher.id}_${date}`;
                this.attendance[attendanceKey] = attendanceValue;
            }
        });

        localStorage.setItem('attendance', JSON.stringify(this.attendance));
        alert('Teacher attendance saved successfully!');
        this.updateAttendanceSummary();
    }

    updateAttendanceSummary() {
        const today = new Date().toISOString().split('T')[0];

        // Count today's student attendance
        const todayStudentsPresent = Object.keys(this.attendance).filter(key =>
            key.endsWith(`_${today}`) && !key.startsWith('teacher_') && this.attendance[key] === 'present'
        ).length;

        const todayStudentsAbsent = Object.keys(this.attendance).filter(key =>
            key.endsWith(`_${today}`) && !key.startsWith('teacher_') && this.attendance[key] === 'absent'
        ).length;

        // Count today's teacher attendance
        const todayTeachersPresent = Object.keys(this.attendance).filter(key =>
            key.includes(`_${today}`) && key.startsWith('teacher_') && this.attendance[key] === 'present'
        ).length;

        const todayTeachersAbsent = Object.keys(this.attendance).filter(key =>
            key.includes(`_${today}`) && key.startsWith('teacher_') && this.attendance[key] === 'absent'
        ).length;

        const totalStudents = this.students.length;
        const totalTeachers = this.teachers.length;

        document.getElementById('todayStudentAttendance').innerHTML = `
            Present: ${todayStudentsPresent} | Absent: ${todayStudentsAbsent} | Total: ${totalStudents}
        `;

        document.getElementById('todayTeacherAttendance').innerHTML = `
            Present: ${todayTeachersPresent} | Absent: ${todayTeachersAbsent} | Total: ${totalTeachers}
        `;
    }

    generateAttendanceReport() {
        const reportType = document.getElementById('reportType').value;
        const startDate = document.getElementById('reportStartDate').value;
        const endDate = document.getElementById('reportEndDate').value;
        const classFilter = document.getElementById('reportClassFilter').value;

        if (!startDate || !endDate) {
            alert('Please select start and end dates');
            return;
        }

        let reportData = [];

        if (reportType === 'student') {
            // Generate student attendance report
            const filteredStudents = classFilter
                ? this.students.filter(s => s.class === classFilter)
                : this.students;

            reportData = filteredStudents.map(student => {
                const studentAttendance = {};
                let totalPresent = 0;
                let totalAbsent = 0;

                // Check each date in range
                const start = new Date(startDate);
                const end = new Date(endDate);

                for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
                    const dateStr = date.toISOString().split('T')[0];
                    const attendanceKey = `${student.id}_${dateStr}`;
                    const status = this.attendance[attendanceKey] || 'Not Marked';

                    if (status === 'present') totalPresent++;
                    else if (status === 'absent') totalAbsent++;

                    studentAttendance[dateStr] = status;
                }

                return {
                    name: student.name,
                    class: student.class,
                    attendance: studentAttendance,
                    summary: { present: totalPresent, absent: totalAbsent }
                };
            });
        } else {
            // Generate teacher attendance report
            const filteredTeachers = this.teachers;

            reportData = filteredTeachers.map(teacher => {
                const teacherAttendance = {};
                let totalPresent = 0;
                let totalAbsent = 0;

                const start = new Date(startDate);
                const end = new Date(endDate);

                for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
                    const dateStr = date.toISOString().split('T')[0];
                    const attendanceKey = `teacher_${teacher.id}_${dateStr}`;
                    const status = this.attendance[attendanceKey] || 'Not Marked';

                    if (status === 'present') totalPresent++;
                    else if (status === 'absent') totalAbsent++;

                    teacherAttendance[dateStr] = status;
                }

                return {
                    name: teacher.name,
                    subject: teacher.subject,
                    attendance: teacherAttendance,
                    summary: { present: totalPresent, absent: totalAbsent }
                };
            });
        }

        this.displayAttendanceReport(reportData, reportType, startDate, endDate);
    }

    displayAttendanceReport(data, type, startDate, endDate) {
        if (data.length === 0) {
            document.getElementById('attendanceReportList').innerHTML = '<p class="no-data">No data found for selected criteria</p>';
            return;
        }

        let html = `
            <h4>${type === 'student' ? 'Student' : 'Teacher'} Attendance Report</h4>
            <p><strong>Period:</strong> ${startDate} to ${endDate}</p>
            <div class="report-table-container">
        `;

        if (type === 'student') {
            html += `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Class</th>
                            <th>Present Days</th>
                            <th>Absent Days</th>
                            <th>Attendance %</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            data.forEach(item => {
                const totalDays = item.summary.present + item.summary.absent;
                const percentage = totalDays > 0 ? ((item.summary.present / totalDays) * 100).toFixed(1) : 0;

                html += `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.class}</td>
                        <td>${item.summary.present}</td>
                        <td>${item.summary.absent}</td>
                        <td>${percentage}%</td>
                    </tr>
                `;
            });
        } else {
            html += `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Subject</th>
                            <th>Present Days</th>
                            <th>Absent Days</th>
                            <th>Attendance %</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            data.forEach(item => {
                const totalDays = item.summary.present + item.summary.absent;
                const percentage = totalDays > 0 ? ((item.summary.present / totalDays) * 100).toFixed(1) : 0;

                html += `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.subject}</td>
                        <td>${item.summary.present}</td>
                        <td>${item.summary.absent}</td>
                        <td>${percentage}%</td>
                    </tr>
                `;
            });
        }

        html += `
                    </tbody>
                </table>
            </div>
        `;

        document.getElementById('attendanceReportList').innerHTML = html;
    }

    showAddPaperForm() {
        document.getElementById('addPaperFormContainer').style.display = 'block';
    }

    hideAddPaperForm() {
        document.getElementById('addPaperFormContainer').style.display = 'none';
    }

    loadSubjectsForPaper() {
        const classValue = document.getElementById('paperClass').value;
        const subjectSelect = document.getElementById('paperSubject');

        // Clear existing options except the first one
        while (subjectSelect.children.length > 1) {
            subjectSelect.removeChild(subjectSelect.lastChild);
        }

        if (classValue) {
            // Add relevant subjects based on class
            const subjects = this.getSubjectsForClass(classValue);
            subjects.forEach(subject => {
                const option = document.createElement('option');
                option.value = subject;
                option.textContent = subject;
                subjectSelect.appendChild(option);
            });
        }
    }

    getSubjectsForClass(classValue) {
        // Define subjects based on class levels
        const classSubjects = {
            'Nursery': ['English', 'Mathematics', 'Art', 'Music', 'Physical Education'],
            'LKG': ['English', 'Mathematics', 'Art', 'Music', 'Physical Education'],
            'UKG': ['English', 'Mathematics', 'Art', 'Music', 'Physical Education'],
            '1': ['English', 'Mathematics', 'Hindi', 'Environmental Science', 'Art', 'Music', 'Physical Education'],
            '2': ['English', 'Mathematics', 'Hindi', 'Environmental Science', 'Art', 'Music', 'Physical Education'],
            '3': ['English', 'Mathematics', 'Hindi', 'Environmental Science', 'Art', 'Music', 'Physical Education'],
            '4': ['English', 'Mathematics', 'Hindi', 'Environmental Science', 'Art', 'Music', 'Physical Education'],
            '5': ['English', 'Mathematics', 'Hindi', 'Environmental Science', 'Art', 'Music', 'Physical Education'],
            '6': ['English', 'Mathematics', 'Hindi', 'Science', 'Social Science', 'Computer Science', 'Art', 'Music', 'Physical Education'],
            '7': ['English', 'Mathematics', 'Hindi', 'Science', 'Social Science', 'Computer Science', 'Art', 'Music', 'Physical Education'],
            '8': ['English', 'Mathematics', 'Hindi', 'Science', 'Social Science', 'Computer Science', 'Art', 'Music', 'Physical Education'],
            '9': ['English', 'Mathematics', 'Hindi', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Computer Science', 'Physical Education'],
            '10': ['English', 'Mathematics', 'Hindi', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Computer Science', 'Physical Education'],
            '11': ['English', 'Mathematics', 'Hindi', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Economics', 'Physical Education'],
            '12': ['English', 'Mathematics', 'Hindi', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Economics', 'Physical Education']
        };

        return classSubjects[classValue] || [];
    }

    handlePaperForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const paper = {
            id: Date.now(),
            paper_title: formData.get('paper_title'),
            paper_class: formData.get('paper_class'),
            paper_subject: formData.get('paper_subject'),
            paper_type: formData.get('paper_type'),
            paper_duration: formData.get('paper_duration'),
            paper_total_marks: formData.get('paper_total_marks'),
            paper_content: formData.get('paper_content'),
            watermark_text: formData.get('watermark_text'),
            instructions: formData.get('instructions'),
            created_date: new Date().toISOString()
        };

        this.questionPapers.push(paper);
        localStorage.setItem('questionPapers', JSON.stringify(this.questionPapers));
        e.target.reset();
        this.loadExamPapers();
        alert('Exam paper created successfully!');

        // Update dashboard
        this.loadDashboardData();
    }

    loadExamPapers() {
        const examsList = document.getElementById('examsList');
        if (examsList) {
            if (this.questionPapers.length === 0) {
                examsList.innerHTML = '<p>No papers created yet. Create your first paper!</p>';
            } else {
                examsList.innerHTML = `
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Class</th>
                                <th>Subject</th>
                                <th>Type</th>
                                <th>Duration</th>
                                <th>Marks</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.questionPapers.map(p => `
                                <tr>
                                    <td>${p.paper_title}</td>
                                    <td>${p.paper_class}</td>
                                    <td>${p.paper_subject}</td>
                                    <td>${p.paper_type}</td>
                                    <td>${p.paper_duration} min</td>
                                    <td>${p.paper_total_marks}</td>
                                    <td>
                                        <button class="btn btn-sm btn-success" onclick="schoolSystem.previewPaper('${p.id}')">Preview</button>
                                        <button class="btn btn-sm btn-primary" onclick="schoolSystem.printPaper('${p.id}')">Print</button>
                                        <button class="btn btn-sm btn-secondary" onclick="schoolSystem.downloadPaper('${p.id}')">Download</button>
                                        <button class="btn btn-sm btn-danger" onclick="schoolSystem.deletePaper('${p.id}')">Delete</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            }
        }
    }

    formatText(command) {
        const contentArea = document.getElementById('paperContent');
        contentArea.focus();

        if (command === 'bold') {
            this.insertAtCursor(contentArea, '**', '**');
        } else if (command === 'italic') {
            this.insertAtCursor(contentArea, '*', '*');
        } else if (command === 'underline') {
            this.insertAtCursor(contentArea, '_', '_');
        }
    }

    insertAtCursor(textarea, beforeText, afterText) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        const textToInsert = beforeText + selectedText + afterText;

        textarea.value = textarea.value.substring(0, start) + textToInsert + textarea.value.substring(end);
        textarea.focus();

        // Set cursor position after inserted text
        const newStart = start + beforeText.length;
        const newEnd = newStart + selectedText.length;
        textarea.setSelectionRange(newStart, newEnd);
    }

    addFormula() {
        const contentArea = document.getElementById('paperContent');
        const formula = prompt('Enter LaTeX formula (e.g., \\frac{a}{b}, \\sqrt{x}, x^{2}):');
        if (formula) {
            this.insertAtCursor(contentArea, '$' + formula + '$', '');
        }
    }

    addTable() {
        const contentArea = document.getElementById('paperContent');
        const rows = prompt('Number of rows:', '3');
        const cols = prompt('Number of columns:', '3');

        if (rows && cols) {
            let table = '\n|';
            for (let c = 0; c < parseInt(cols); c++) {
                table += ' Header |';
            }
            table += '\n|';
            for (let c = 0; c < parseInt(cols); c++) {
                table += '--------|';
            }
            table += '\n';

            for (let r = 0; r < parseInt(rows) - 1; r++) {
                table += '|';
                for (let c = 0; c < parseInt(cols); c++) {
                    table += '        |';
                }
                table += '\n';
            }
            table += '\n';

            this.insertAtCursor(contentArea, table, '');
        }
    }

    addWatermark() {
        const watermarkText = prompt('Enter watermark text:');
        if (watermarkText) {
            document.getElementById('watermarkText').value = watermarkText;
        }
    }

    addQuickQuestion() {
        const questionType = prompt('Question type (1. MCQ, 2. Short Answer, 3. Long Answer):');
        const contentArea = document.getElementById('paperContent');

        let questionTemplate = '';

        switch(questionType) {
            case '1':
                questionTemplate = '\n**Question:** [Multiple Choice Question]\n\nA) Option 1\nB) Option 2\nC) Option 3\nD) Option 4\n\n**Answer:** [Correct Option]\n\n---\n';
                break;
            case '2':
                questionTemplate = '\n**Question:** [Short Answer Question]\n\n**Answer:** [Answer here]\n\n---\n';
                break;
            case '3':
                questionTemplate = '\n**Question:** [Long Answer Question]\n\n**Answer:**\n\n[Answer space]\n\n---\n';
                break;
            default:
                questionTemplate = '\n**Question:** [Your question here]\n\n**Answer:** [Answer here]\n\n---\n';
        }

        this.insertAtCursor(contentArea, questionTemplate, '');
    }

    previewPaper(paperId = null) {
        const paperContent = document.getElementById('paperContent').value;
        const paperTitle = document.getElementById('paperTitle').value;
        const watermarkText = document.getElementById('watermarkText').value;

        if (!paperContent.trim()) {
            alert('Please enter paper content first');
            return;
        }

        // Create preview window
        const previewWindow = window.open('', '_blank', 'width=800,height=600');
        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${paperTitle || 'Exam Paper Preview'}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                        line-height: 1.6;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 2px solid #333;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .watermark {
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%) rotate(-45deg);
                        font-size: 48px;
                        color: rgba(0,0,0,0.1);
                        z-index: -1;
                        pointer-events: none;
                    }
                    .content {
                        white-space: pre-wrap;
                        font-size: 14px;
                    }
                    .bold { font-weight: bold; }
                    .italic { font-style: italic; }
                    .underline { text-decoration: underline; }
                    @media print {
                        body { margin: 0; padding: 15px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="watermark">${watermarkText || ''}</div>
                <div class="header">
                    <h1>${paperTitle || 'Exam Paper'}</h1>
                    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
                <div class="content">${this.formatContentForPreview(paperContent)}</div>
                <div class="no-print" style="margin-top: 30px; text-align: center;">
                    <button onclick="window.print()">Print Paper</button>
                    <button onclick="window.close()">Close Preview</button>
                </div>
            </body>
            </html>
        `);
    }

    formatContentForPreview(content) {
        return content
            .replace(/\*\*(.*?)\*\*/g, '<span class="bold">$1</span>')
            .replace(/\*(.*?)\*/g, '<span class="italic">$1</span>')
            .replace(/_(.*?)_/g, '<span class="underline">$1</span>')
            .replace(/\$([^$]+)\$/g, '<span style="font-family: serif; font-style: italic;">$1</span>');
    }

    printPaper(paperId) {
        this.previewPaper(paperId);
        setTimeout(() => {
            window.print();
        }, 1000);
    }

    downloadPaper(paperId) {
        const paperContent = document.getElementById('paperContent').value;
        const paperTitle = document.getElementById('paperTitle').value || 'exam_paper';

        if (!paperContent.trim()) {
            alert('Please enter paper content first');
            return;
        }

        const blob = new Blob([`
EXAM PAPER: ${paperTitle}
Generated on: ${new Date().toLocaleDateString()}

${'-'.repeat(50)}

${paperContent}

${'-'.repeat(50)}
End of Paper
        `], { type: 'text/plain' });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${paperTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    deletePaper(id) {
        this.questionPapers = this.questionPapers.filter(p => p.id !== id);
        localStorage.setItem('questionPapers', JSON.stringify(this.questionPapers));
        this.loadExamPapers();
    }

    showAddFeeRecordForm() {
        document.getElementById('addFeeRecordFormContainer').style.display = 'block';
        this.loadStudentsForFee();
        // Set default dates
        const today = new Date();
        const currentMonth = today.toISOString().slice(0, 7); // YYYY-MM format
        document.getElementById('paymentDate').valueAsDate = today;
        document.getElementById('feeMonth').value = today.toLocaleDateString('en-US', { month: 'long' });
        document.getElementById('feeYear').value = today.getFullYear().toString();
    }

    hideAddFeeRecordForm() {
        document.getElementById('addFeeRecordFormContainer').style.display = 'none';
        document.getElementById('studentFeeHistory').style.display = 'none';
    }

    loadStudentsForFee() {
        const studentSelect = document.getElementById('feeStudent');

        // Clear existing options except the first one
        while (studentSelect.children.length > 1) {
            studentSelect.removeChild(studentSelect.lastChild);
        }

        // Add all students to the dropdown
        this.students.forEach(student => {
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = `${student.name} (${student.class} - Roll: ${student.roll_no || student.rollNo})`;
            studentSelect.appendChild(option);
        });
    }

    loadStudentFeeHistory() {
        const studentId = document.getElementById('feeStudent').value;

        if (!studentId) {
            document.getElementById('studentFeeHistory').style.display = 'none';
            return;
        }

        const student = this.students.find(s => s.id == studentId);
        if (!student) {
            document.getElementById('studentFeeHistory').style.display = 'none';
            return;
        }

        // Get student's fee history
        const studentFees = this.feeRecords.filter(f => f.student_id == studentId);

        if (studentFees.length === 0) {
            document.getElementById('feeHistoryList').innerHTML = '<p>No fee history found for this student</p>';
        } else {
            document.getElementById('feeHistoryList').innerHTML = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Month/Year</th>
                            <th>Amount</th>
                            <th>Paid</th>
                            <th>Balance</th>
                            <th>Payment Date</th>
                            <th>Method</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${studentFees.map(f => `
                            <tr>
                                <td>${f.month} ${f.year}</td>
                                <td>₹${f.amount}</td>
                                <td>₹${f.paid}</td>
                                <td>₹${f.amount - f.paid}</td>
                                <td>${new Date(f.payment_date).toLocaleDateString()}</td>
                                <td>${f.payment_method}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }

        document.getElementById('studentFeeHistory').style.display = 'block';
    }

    handleFeeRecordForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const studentId = formData.get('fee_student');
        const student = this.students.find(s => s.id == studentId);

        if (!student) {
            alert('Please select a valid student');
            return;
        }

        const feeRecord = {
            id: Date.now(),
            student_id: studentId,
            student_name: student.name,
            student_class: student.class,
            month: formData.get('fee_month'),
            year: formData.get('fee_year'),
            amount: parseFloat(formData.get('fee_amount')),
            paid: parseFloat(formData.get('fee_paid')),
            payment_date: formData.get('payment_date'),
            payment_method: formData.get('payment_method'),
            late_fee: parseFloat(formData.get('late_fee') || 0),
            discount: parseFloat(formData.get('discount') || 0),
            notes: formData.get('fee_notes'),
            status: parseFloat(formData.get('fee_paid')) >= parseFloat(formData.get('fee_amount')) ? 'paid' : 'pending'
        };

        this.feeRecords.push(feeRecord);
        localStorage.setItem('feeRecords', JSON.stringify(this.feeRecords));
        e.target.reset();
        this.loadFeeRecords();
        document.getElementById('studentFeeHistory').style.display = 'none';
        alert('Fee record added successfully!');
    }

    loadFeeRecords() {
        const feesList = document.getElementById('feesList');
        if (feesList) {
            if (this.feeRecords.length === 0) {
                feesList.innerHTML = `
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Class</th>
                                <th>Month/Year</th>
                                <th>Amount</th>
                                <th>Paid</th>
                                <th>Balance</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="8" class="no-data">No fee records found</td>
                            </tr>
                        </tbody>
                    </table>
                `;
            } else {
                feesList.innerHTML = `
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Class</th>
                                <th>Month/Year</th>
                                <th>Amount</th>
                                <th>Paid</th>
                                <th>Balance</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.feeRecords.map(f => `
                                <tr>
                                    <td>${f.student_name}</td>
                                    <td>${f.student_class}</td>
                                    <td>${f.month} ${f.year}</td>
                                    <td>₹${f.amount}</td>
                                    <td>₹${f.paid}</td>
                                    <td>₹${f.amount - f.paid}</td>
                                    <td>
                                        <span class="status-badge status-${f.status}">${f.status}</span>
                                    </td>
                                    <td>
                                        <button class="btn btn-sm btn-primary" onclick="schoolSystem.editFeeRecord('${f.id}')">Edit</button>
                                        <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteFeeRecord('${f.id}')">Delete</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            }
        }
    }

    editFeeRecord(id) {
        // Implement edit logic
        alert('Edit fee record ' + id);
    }

    deleteFeeRecord(id) {
        this.feeRecords = this.feeRecords.filter(f => f.id !== id);
        localStorage.setItem('feeRecords', JSON.stringify(this.feeRecords));
        this.loadFeeRecords();
    }

    downloadFeesReport() {
        if (this.feeRecords.length === 0) {
            alert('No fee records found to generate report');
            return;
        }

        let reportContent = 'FEE MANAGEMENT REPORT\n';
        reportContent += 'Generated on: ' + new Date().toLocaleDateString() + '\n\n';
        reportContent += '-'.repeat(80) + '\n\n';

        // Summary
        const totalAmount = this.feeRecords.reduce((sum, f) => sum + f.amount, 0);
        const totalPaid = this.feeRecords.reduce((sum, f) => sum + f.paid, 0);
        const totalPending = totalAmount - totalPaid;

        reportContent += `SUMMARY:\n`;
        reportContent += `Total Fee Amount: ₹${totalAmount}\n`;
        reportContent += `Total Paid: ₹${totalPaid}\n`;
        reportContent += `Total Pending: ₹${totalPending}\n\n`;

        // Detailed records
        reportContent += 'DETAILED RECORDS:\n';
        reportContent += '-'.repeat(80) + '\n';
        reportContent += 'Student Name'.padEnd(20) + 'Class'.padEnd(10) + 'Month'.padEnd(12) + 'Amount'.padEnd(10) + 'Paid'.padEnd(10) + 'Balance'.padEnd(10) + 'Status\n';
        reportContent += '-'.repeat(80) + '\n';

        this.feeRecords.forEach(fee => {
            reportContent += `${fee.student_name.padEnd(20).substring(0, 20)}${fee.student_class.padEnd(10).substring(0, 10)}${fee.month.substring(0, 3).padEnd(12)}${fee.amount.toString().padEnd(10)}${fee.paid.toString().padEnd(10)}${(fee.amount - fee.paid).toString().padEnd(10)}${fee.status}\n`;
        });

        // Download the report
        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fee_report_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    applyTheme(theme) {
        document.body.classList = theme;
    }

    // Enhanced Salary Management Methods
    showAddSalaryForm() {
        document.getElementById('addSalaryFormContainer').style.display = 'block';
        this.loadEmployeesForSalary();
        this.setDefaultSalaryDates();
        this.setupSalaryFormValidation();
    }

    hideAddSalaryForm() {
        document.getElementById('addSalaryFormContainer').style.display = 'none';
        this.clearSalaryFormValidation();
    }

    showPaySalaryForm() {
        document.getElementById('paySalaryFormContainer').style.display = 'block';
        this.loadEmployeesForPayment();
        this.setupPaymentFormValidation();
    }

    hidePaySalaryForm() {
        document.getElementById('paySalaryFormContainer').style.display = 'none';
        this.clearPaymentFormValidation();
    }

    showSalarySheetForm() {
        document.getElementById('salarySheetFormContainer').style.display = 'block';
        this.setDefaultSalarySheetDates();
        this.setupSheetFormValidation();
    }

    hideSalarySheetForm() {
        document.getElementById('salarySheetFormContainer').style.display = 'none';
        this.clearSheetFormValidation();
    }

    showSalaryReportForm() {
        document.getElementById('salaryReportFormContainer').style.display = 'block';
        this.loadEmployeesForReport();
        this.setDefaultReportDates();
        this.setupReportFormValidation();
    }

    hideSalaryReportForm() {
        document.getElementById('salaryReportFormContainer').style.display = 'none';
        this.clearReportFormValidation();
    }

    loadEmployeesForSalary() {
        const employeeSelect = document.getElementById('salaryEmployee');
        if (!employeeSelect) return;

        // Clear existing options except the first one
        while (employeeSelect.children.length > 1) {
            employeeSelect.removeChild(employeeSelect.lastChild);
        }

        // Add all employees (teachers and staff) to the dropdown
        [...this.teachers, ...this.staff].forEach(employee => {
            const option = document.createElement('option');
            option.value = employee.id;
            option.textContent = `${employee.name} (${employee.department || employee.subject || 'Employee'})`;
            employeeSelect.appendChild(option);
        });
    }

    loadEmployeesForPayment() {
        const employeeSelect = document.getElementById('payEmployee');
        if (!employeeSelect) return;

        // Clear existing options except the first one
        while (employeeSelect.children.length > 1) {
            employeeSelect.removeChild(employeeSelect.lastChild);
        }

        // Add all employees (teachers and staff) to the dropdown
        [...this.teachers, ...this.staff].forEach(employee => {
            const option = document.createElement('option');
            option.value = employee.id;
            option.textContent = `${employee.name} (${employee.department || employee.subject || 'Employee'})`;
            employeeSelect.appendChild(option);
        });
    }

    loadEmployeesForReport() {
        const employeeSelect = document.getElementById('reportEmployee');
        if (!employeeSelect) return;

        // Clear existing options except the first one
        while (employeeSelect.children.length > 1) {
            employeeSelect.removeChild(employeeSelect.lastChild);
        }

        // Add all employees (teachers and staff) to the dropdown
        [...this.teachers, ...this.staff].forEach(employee => {
            const option = document.createElement('option');
            option.value = employee.id;
            option.textContent = `${employee.name} (${employee.department || employee.subject || 'Employee'})`;
            employeeSelect.appendChild(option);
        });
    }

    loadEmployeeSalaryInfo() {
        const employeeId = document.getElementById('salaryEmployee').value;
        if (!employeeId) return;

        const employee = [...this.teachers, ...this.staff].find(emp => emp.id == employeeId);
        if (!employee) return;

        // Auto-fill base salary if available
        const baseSalaryInput = document.getElementById('baseSalary');
        if (baseSalaryInput && employee.salary) {
            baseSalaryInput.value = employee.salary;
            this.calculateTotalSalary();
        }
    }

    loadPendingSalaries() {
        const employeeId = document.getElementById('payEmployee').value;
        if (!employeeId) {
            document.getElementById('pendingSalariesList').innerHTML = '<p>Select an employee to view pending salaries</p>';
            return;
        }

        const employee = [...this.teachers, ...this.staff].find(emp => emp.id == employeeId);
        if (!employee) return;

        // Get pending salaries for this employee
        const pendingSalaries = this.salaries.filter(salary =>
            salary.employee_id == employeeId &&
            salary.status !== 'paid'
        );

        if (pendingSalaries.length === 0) {
            document.getElementById('pendingSalariesList').innerHTML = '<p>No pending salaries for this employee</p>';
        } else {
            let html = '<h4>Pending Salaries</h4>';
            html += '<div class="pending-salaries-grid">';

            pendingSalaries.forEach(salary => {
                html += `
                    <div class="salary-item">
                        <div class="salary-info">
                            <strong>${salary.month} ${salary.year}</strong><br>
                            Base: ₹${salary.base_salary}<br>
                            Allowance: ₹${salary.allowance || 0}<br>
                            Deductions: ₹${salary.deductions || 0}<br>
                            <strong>Total: ₹${salary.total_salary}</strong>
                        </div>
                        <div class="salary-actions">
                            <label>
                                <input type="checkbox" name="pending_salary_${salary.id}" value="${salary.id}">
                                Pay Now
                            </label>
                        </div>
                    </div>
                `;
            });

            html += '</div>';
            document.getElementById('pendingSalariesList').innerHTML = html;
        }
    }

    setDefaultSalaryDates() {
        const today = new Date();
        const salaryMonthSelect = document.getElementById('salaryMonth');
        const salaryYearSelect = document.getElementById('salaryYear');
        const paymentDateInput = document.getElementById('paymentDate');

        if (salaryMonthSelect) {
            salaryMonthSelect.value = today.toLocaleDateString('en-US', { month: 'long' });
        }
        if (salaryYearSelect) {
            salaryYearSelect.value = today.getFullYear().toString();
        }
        if (paymentDateInput) {
            paymentDateInput.valueAsDate = today;
        }
    }

    setDefaultSalarySheetDates() {
        const today = new Date();
        const sheetMonthSelect = document.getElementById('sheetMonth');
        const sheetYearSelect = document.getElementById('sheetYear');

        if (sheetMonthSelect) {
            sheetMonthSelect.value = today.toLocaleDateString('en-US', { month: 'long' });
        }
        if (sheetYearSelect) {
            sheetYearSelect.value = today.getFullYear().toString();
        }
    }

    setDefaultReportDates() {
        const today = new Date();
        const reportMonthSelect = document.getElementById('reportMonth');
        const reportYearSelect = document.getElementById('reportYear');

        if (reportMonthSelect) {
            reportMonthSelect.value = today.toLocaleDateString('en-US', { month: 'long' });
        }
        if (reportYearSelect) {
            reportYearSelect.value = today.getFullYear().toString();
        }
    }

    calculateTotalSalary() {
        const baseSalary = parseFloat(document.getElementById('baseSalary').value) || 0;
        const allowance = parseFloat(document.getElementById('allowance').value) || 0;
        const deductions = parseFloat(document.getElementById('deductions').value) || 0;
        const overtime = parseFloat(document.getElementById('overtime').value) || 0;
        const bonus = parseFloat(document.getElementById('bonus').value) || 0;
        const taxDeduction = parseFloat(document.getElementById('taxDeduction').value) || 0;

        const totalSalary = baseSalary + allowance + overtime + bonus - deductions - taxDeduction;

        document.getElementById('totalSalary').textContent = totalSalary.toFixed(2);
    }

    handleAddSalaryForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const employeeId = formData.get('salary_employee');
        const employee = [...this.teachers, ...this.staff].find(emp => emp.id == employeeId);

        if (!employee) {
            alert('Please select a valid employee');
            return;
        }

        const baseSalary = parseFloat(formData.get('base_salary')) || 0;
        const allowance = parseFloat(formData.get('allowance')) || 0;
        const deductions = parseFloat(formData.get('deductions')) || 0;
        const overtime = parseFloat(formData.get('overtime')) || 0;
        const bonus = parseFloat(formData.get('bonus')) || 0;
        const taxDeduction = parseFloat(formData.get('tax_deduction')) || 0;

        const totalSalary = baseSalary + allowance + overtime + bonus - deductions - taxDeduction;

        const salaryRecord = {
            id: Date.now(),
            employee_id: employeeId,
            employee_name: employee.name,
            employee_department: employee.department || employee.subject || 'General',
            month: formData.get('salary_month'),
            year: formData.get('salary_year'),
            base_salary: baseSalary,
            allowance: allowance,
            deductions: deductions,
            overtime: overtime,
            bonus: bonus,
            tax_deduction: taxDeduction,
            total_salary: totalSalary,
            payment_date: formData.get('payment_date'),
            notes: formData.get('salary_notes'),
            status: 'pending',
            created_date: new Date().toISOString()
        };

        this.salaries.push(salaryRecord);
        localStorage.setItem('salaries', JSON.stringify(this.salaries));
        e.target.reset();
        this.loadSalaries();
        alert('Salary record added successfully!');
    }

    handlePaySalaryForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const employeeId = formData.get('pay_employee');
        const paymentMethod = formData.get('payment_method');
        const transactionId = formData.get('transaction_id');

        if (!employeeId || !paymentMethod) {
            alert('Please select employee and payment method');
            return;
        }

        // Get selected pending salaries
        const selectedSalaries = [];
        const checkboxes = document.querySelectorAll('input[name^="pending_salary_"]:checked');

        checkboxes.forEach(checkbox => {
            const salaryId = checkbox.value;
            const salary = this.salaries.find(s => s.id == salaryId);
            if (salary) {
                selectedSalaries.push(salary);
            }
        });

        if (selectedSalaries.length === 0) {
            alert('Please select at least one salary to pay');
            return;
        }

        // Update salary status to paid
        selectedSalaries.forEach(salary => {
            salary.status = 'paid';
            salary.payment_method = paymentMethod;
            salary.transaction_id = transactionId;
            salary.paid_date = new Date().toISOString();
        });

        localStorage.setItem('salaries', JSON.stringify(this.salaries));
        e.target.reset();
        this.loadSalaries();
        alert(`Successfully processed payment for ${selectedSalaries.length} salary record(s)!`);
    }

    handleSalarySheetForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const month = formData.get('sheet_month');
        const year = formData.get('sheet_year');
        const department = formData.get('sheet_department');
        const includeProcessed = formData.get('include_processed') === 'on';
        const includePending = formData.get('include_pending') === 'on';

        if (!month || !year) {
            alert('Please select month and year');
            return;
        }

        // Filter salaries based on criteria
        let filteredSalaries = this.salaries.filter(salary =>
            salary.month === month && salary.year === year
        );

        if (department) {
            filteredSalaries = filteredSalaries.filter(salary =>
                salary.employee_department === department
            );
        }

        if (!includeProcessed) {
            filteredSalaries = filteredSalaries.filter(salary => salary.status !== 'paid');
        }

        if (!includePending) {
            filteredSalaries = filteredSalaries.filter(salary => salary.status !== 'pending');
        }

        if (filteredSalaries.length === 0) {
            alert('No salary records found for selected criteria');
            return;
        }

        this.displaySalarySheet(filteredSalaries, month, year);
    }

    handleSalaryReportForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const reportType = formData.get('report_type');
        const month = formData.get('report_month');
        const year = formData.get('report_year');
        const employeeId = formData.get('report_employee');
        const department = formData.get('report_department');

        if (!reportType || !year) {
            alert('Please select report type and year');
            return;
        }

        let filteredSalaries = this.salaries;

        if (month) {
            filteredSalaries = filteredSalaries.filter(salary => salary.month === month);
        }

        filteredSalaries = filteredSalaries.filter(salary => salary.year === year);

        if (employeeId) {
            filteredSalaries = filteredSalaries.filter(salary => salary.employee_id == employeeId);
        }

        if (department) {
            filteredSalaries = filteredSalaries.filter(salary => salary.employee_department === department);
        }

        if (filteredSalaries.length === 0) {
            alert('No salary records found for selected criteria');
            return;
        }

        this.generateSalaryReport(filteredSalaries, reportType, month, year);
    }

    displaySalarySheet(salaries, month, year) {
        const previewWindow = window.open('', '_blank', 'width=1000,height=800');
        const schoolInfo = this.schoolInfo;

        let html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Salary Sheet - ${month} ${year}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { text-align: center; border-bottom: 3px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
                    .school-logo { max-height: 80px; margin-bottom: 10px; }
                    .salary-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    .salary-table th, .salary-table td { border: 1px solid #ddd; padding: 12px; text-align: center; }
                    .salary-table th { background: #f8f9fa; font-weight: bold; }
                    .employee-name { text-align: left; font-weight: bold; }
                    .total-row { background: #e9ecef; font-weight: bold; }
                    .summary { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 5px; }
                    @media print { body { margin: 0; } .no-print { display: none; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${schoolInfo.logo || ''}" alt="School Logo" class="school-logo" style="${schoolInfo.logo ? '' : 'display: none;'}">
                    <h1>${schoolInfo.name || 'School Management System'}</h1>
                    <h2>Salary Sheet - ${month} ${year}</h2>
                    <p>Generated on: ${new Date().toLocaleDateString()}</p>
                </div>

                <div class="summary">
                    <strong>Summary:</strong> Total Employees: ${salaries.length} |
                    Total Amount: ₹${salaries.reduce((sum, s) => sum + s.total_salary, 0).toFixed(2)} |
                    Pending: ${salaries.filter(s => s.status !== 'paid').length} |
                    Paid: ${salaries.filter(s => s.status === 'paid').length}
                </div>

                <table class="salary-table">
                    <thead>
                        <tr>
                            <th>Employee Name</th>
                            <th>Department</th>
                            <th>Base Salary</th>
                            <th>Allowance</th>
                            <th>Overtime</th>
                            <th>Bonus</th>
                            <th>Deductions</th>
                            <th>Tax</th>
                            <th>Total</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        salaries.forEach(salary => {
            html += `
                <tr>
                    <td class="employee-name">${salary.employee_name}</td>
                    <td>${salary.employee_department}</td>
                    <td>₹${salary.base_salary.toFixed(2)}</td>
                    <td>₹${(salary.allowance || 0).toFixed(2)}</td>
                    <td>₹${(salary.overtime || 0).toFixed(2)}</td>
                    <td>₹${(salary.bonus || 0).toFixed(2)}</td>
                    <td>₹${(salary.deductions || 0).toFixed(2)}</td>
                    <td>₹${(salary.tax_deduction || 0).toFixed(2)}</td>
                    <td>₹${salary.total_salary.toFixed(2)}</td>
                    <td>${salary.status}</td>
                </tr>
            `;
        });

        const totalAmount = salaries.reduce((sum, s) => sum + s.total_salary, 0);
        html += `
                        <tr class="total-row">
                            <td colspan="8">TOTAL AMOUNT</td>
                            <td>₹${totalAmount.toFixed(2)}</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>

                <div class="no-print" style="text-align: center; margin-top: 30px;">
                    <button onclick="window.print()">Print Salary Sheet</button>
                    <button onclick="window.close()">Close Preview</button>
                </div>
            </body>
            </html>
        `;

        previewWindow.document.write(html);
    }

    generateSalaryReport(salaries, reportType, month, year) {
        const previewWindow = window.open('', '_blank', 'width=1000,height=800');
        const schoolInfo = this.schoolInfo;

        let html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Salary Report - ${reportType} ${month ? month + ' ' : ''}${year}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { text-align: center; border-bottom: 3px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
                    .school-logo { max-height: 80px; margin-bottom: 10px; }
                    .report-info { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 5px; }
                    .salary-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    .salary-table th, .salary-table td { border: 1px solid #ddd; padding: 12px; text-align: center; }
                    .salary-table th { background: #f8f9fa; font-weight: bold; }
                    .employee-name { text-align: left; font-weight: bold; }
                    .summary { margin: 20px 0; padding: 15px; background: #e9ecef; border-radius: 5px; }
                    @media print { body { margin: 0; } .no-print { display: none; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${schoolInfo.logo || ''}" alt="School Logo" class="school-logo" style="${schoolInfo.logo ? '' : 'display: none;'}">
                    <h1>${schoolInfo.name || 'School Management System'}</h1>
                    <h2>Salary Report - ${reportType}</h2>
                    <p>Period: ${month ? month + ' ' : ''}${year}</p>
                    <p>Generated on: ${new Date().toLocaleDateString()}</p>
                </div>

                <div class="report-info">
                    <strong>Report Details:</strong> Total Records: ${salaries.length} |
                    Total Amount: ₹${salaries.reduce((sum, s) => sum + s.total_salary, 0).toFixed(2)}
                </div>
        `;

        if (reportType === 'monthly' || reportType === 'yearly') {
            // Group by employee
            const employeeGroups = {};
            salaries.forEach(salary => {
                if (!employeeGroups[salary.employee_id]) {
                    employeeGroups[salary.employee_id] = {
                        employee: salary,
                        salaries: []
                    };
                }
                employeeGroups[salary.employee_id].salaries.push(salary);
            });

            html += '<table class="salary-table"><thead><tr><th>Employee</th><th>Department</th><th>Months</th><th>Total Amount</th></tr></thead><tbody>';

            Object.values(employeeGroups).forEach(group => {
                const totalAmount = group.salaries.reduce((sum, s) => sum + s.total_salary, 0);
                const months = group.salaries.map(s => s.month).join(', ');
                html += `
                    <tr>
                        <td class="employee-name">${group.employee.employee_name}</td>
                        <td>${group.employee.employee_department}</td>
                        <td>${months}</td>
                        <td>₹${totalAmount.toFixed(2)}</td>
                    </tr>
                `;
            });

            html += '</tbody></table>';
        } else if (reportType === 'employee') {
            const employee = salaries[0];
            html += `
                <div class="summary">
                    <h3>Employee Details</h3>
                    <p><strong>Name:</strong> ${employee.employee_name}</p>
                    <p><strong>Department:</strong> ${employee.employee_department}</p>
                    <p><strong>Period:</strong> ${month ? month + ' ' : ''}${year}</p>
                </div>

                <table class="salary-table">
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Base Salary</th>
                            <th>Allowance</th>
                            <th>Overtime</th>
                            <th>Bonus</th>
                            <th>Deductions</th>
                            <th>Tax</th>
                            <th>Total</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            salaries.forEach(salary => {
                html += `
                    <tr>
                        <td>${salary.month}</td>
                        <td>₹${salary.base_salary.toFixed(2)}</td>
                        <td>₹${(salary.allowance || 0).toFixed(2)}</td>
                        <td>₹${(salary.overtime || 0).toFixed(2)}</td>
                        <td>₹${(salary.bonus || 0).toFixed(2)}</td>
                        <td>₹${(salary.deductions || 0).toFixed(2)}</td>
                        <td>₹${(salary.tax_deduction || 0).toFixed(2)}</td>
                        <td>₹${salary.total_salary.toFixed(2)}</td>
                        <td>${salary.status}</td>
                    </tr>
                `;
            });

            html += '</tbody></table>';
        }

        html += `
                <div class="no-print" style="text-align: center; margin-top: 30px;">
                    <button onclick="window.print()">Print Report</button>
                    <button onclick="window.close()">Close Preview</button>
                </div>
            </body>
            </html>
        `;

        previewWindow.document.write(html);
    }

    generateSalarySheet() {
        const month = document.getElementById('sheetMonth').value;
        const year = document.getElementById('sheetYear').value;
        const department = document.getElementById('sheetDepartment').value;

        if (!month || !year) {
            alert('Please select month and year');
            return;
        }

        // Filter salaries
        let salaries = this.salaries.filter(salary =>
            salary.month === month && salary.year === year
        );

        if (department) {
            salaries = salaries.filter(salary => salary.employee_department === department);
        }

        if (salaries.length === 0) {
            alert('No salary records found for selected criteria');
            return;
        }

        this.displaySalarySheet(salaries, month, year);
    }

    downloadSalarySheet() {
        this.generateSalarySheet();
        setTimeout(() => {
            window.print();
        }, 1000);
    }

    generateSalaryReport() {
        const reportType = document.getElementById('reportType').value;
        const month = document.getElementById('reportMonth').value;
        const year = document.getElementById('reportYear').value;
        const employeeId = document.getElementById('reportEmployee').value;
        const department = document.getElementById('reportDepartment').value;

        if (!reportType || !year) {
            alert('Please select report type and year');
            return;
        }

        let salaries = this.salaries;

        if (month) {
            salaries = salaries.filter(salary => salary.month === month);
        }

        salaries = salaries.filter(salary => salary.year === year);

        if (employeeId) {
            salaries = salaries.filter(salary => salary.employee_id == employeeId);
        }

        if (department) {
            salaries = salaries.filter(salary => salary.employee_department === department);
        }

        if (salaries.length === 0) {
            alert('No salary records found for selected criteria');
            return;
        }

        this.generateSalaryReport(salaries, reportType, month, year);
    }

    downloadSalaryReport() {
        this.generateSalaryReport();
        setTimeout(() => {
            window.print();
        }, 1000);
    }

    loadSalaries() {
        const salaryList = document.getElementById('salaryList');
        if (!salaryList) return;

        // Update summary cards
        const totalEmployees = new Set([...this.teachers, ...this.staff].map(emp => emp.id)).size;
        const pendingSalaries = this.salaries.filter(s => s.status !== 'paid').length;
        const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long' });
        const currentYear = new Date().getFullYear().toString();
        const monthlyPayroll = this.salaries
            .filter(s => s.month === currentMonth && s.year === currentYear)
            .reduce((sum, s) => sum + s.total_salary, 0);

        document.getElementById('totalEmployeesCount').textContent = totalEmployees;
        document.getElementById('pendingSalariesCount').textContent = pendingSalaries;
        document.getElementById('monthlyPayroll').textContent = '₹' + monthlyPayroll.toFixed(2);

        // Update recent salaries table
        const recentSalaries = this.salaries.slice(-10).reverse(); // Last 10 records

        if (recentSalaries.length === 0) {
            salaryList.innerHTML = `
                <div class="salary-summary-cards">
                    <div class="summary-card">
                        <h4>Total Employees</h4>
                        <p id="totalEmployeesCount">${totalEmployees}</p>
                    </div>
                    <div class="summary-card">
                        <h4>Pending Salaries</h4>
                        <p id="pendingSalariesCount">${pendingSalaries}</p>
                    </div>
                    <div class="summary-card">
                        <h4>This Month's Payroll</h4>
                        <p id="monthlyPayroll">₹${monthlyPayroll.toFixed(2)}</p>
                    </div>
                </div>
                <div class="recent-salaries">
                    <h3>Recent Salary Records</h3>
                    <div id="recentSalariesTable">
                        <p>No salary records found. Add your first salary record!</p>
                    </div>
                </div>
            `;
        } else {
            salaryList.innerHTML = `
                <div class="salary-summary-cards">
                    <div class="summary-card">
                        <h4>Total Employees</h4>
                        <p id="totalEmployeesCount">${totalEmployees}</p>
                    </div>
                    <div class="summary-card">
                        <h4>Pending Salaries</h4>
                        <p id="pendingSalariesCount">${pendingSalaries}</p>
                    </div>
                    <div class="summary-card">
                        <h4>This Month's Payroll</h4>
                        <p id="monthlyPayroll">₹${monthlyPayroll.toFixed(2)}</p>
                    </div>
                </div>
                <div class="recent-salaries">
                    <h3>Recent Salary Records</h3>
                    <div id="recentSalariesTable">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Employee</th>
                                    <th>Department</th>
                                    <th>Month/Year</th>
                                    <th>Total Salary</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${recentSalaries.map(salary => `
                                    <tr>
                                        <td>${salary.employee_name}</td>
                                        <td>${salary.employee_department}</td>
                                        <td>${salary.month} ${salary.year}</td>
                                        <td>₹${salary.total_salary.toFixed(2)}</td>
                                        <td>
                                            <span class="status-badge status-${salary.status}">${salary.status}</span>
                                        </td>
                                        <td>
                                            <button class="btn btn-sm btn-primary" onclick="schoolSystem.editSalary('${salary.id}')">Edit</button>
                                            <button class="btn btn-sm btn-danger" onclick="schoolSystem.deleteSalary('${salary.id}')">Delete</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }
    }

    editSalary(id) {
        // Implement edit logic
        alert('Edit salary record ' + id);
    }

    deleteSalary(id) {
        this.salaries = this.salaries.filter(s => s.id !== id);
        localStorage.setItem('salaries', JSON.stringify(this.salaries));
        this.loadSalaries();
    }

    // Form Validation Methods
    setupSalaryFormValidation() {
        const form = document.getElementById('addSalaryForm');
        if (!form) return;

        // Add real-time validation
        const requiredFields = ['salaryEmployee', 'salaryMonth', 'salaryYear', 'baseSalary', 'paymentDate'];
        const numericFields = ['baseSalary', 'allowance', 'deductions', 'overtime', 'bonus', 'taxDeduction'];

        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('blur', () => this.validateSalaryField(fieldId));
                field.addEventListener('input', () => this.clearFieldError(fieldId));
            }
        });

        numericFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', () => {
                    this.validateNumericField(fieldId);
                    if (fieldId === 'baseSalary' || fieldId === 'allowance' || fieldId === 'deductions' ||
                        fieldId === 'overtime' || fieldId === 'bonus' || fieldId === 'taxDeduction') {
                        this.calculateTotalSalary();
                    }
                });
            }
        });

        // Add form submit validation
        form.addEventListener('submit', (e) => {
            if (!this.validateSalaryForm()) {
                e.preventDefault();
            }
        });
    }

    clearSalaryFormValidation() {
        const errorElements = document.querySelectorAll('.salary-error');
        errorElements.forEach(el => el.remove());
        const invalidFields = document.querySelectorAll('.invalid-field');
        invalidFields.forEach(el => el.classList.remove('invalid-field'));
    }

    validateSalaryField(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return true;

        let isValid = true;
        let errorMessage = '';

        switch(fieldId) {
            case 'salaryEmployee':
                if (!field.value) {
                    isValid = false;
                    errorMessage = 'Please select an employee';
                }
                break;
            case 'salaryMonth':
                if (!field.value) {
                    isValid = false;
                    errorMessage = 'Please select a month';
                }
                break;
            case 'salaryYear':
                if (!field.value) {
                    isValid = false;
                    errorMessage = 'Please select a year';
                }
                break;
            case 'baseSalary':
                const baseSalary = parseFloat(field.value);
                if (!field.value || isNaN(baseSalary) || baseSalary < 0) {
                    isValid = false;
                    errorMessage = 'Please enter a valid base salary (₹0 or more)';
                }
                break;
            case 'paymentDate':
                if (!field.value) {
                    isValid = false;
                    errorMessage = 'Please select a payment date';
                } else {
                    const selectedDate = new Date(field.value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (selectedDate < today) {
                        isValid = false;
                        errorMessage = 'Payment date cannot be in the past';
                    }
                }
                break;
        }

        this.displayFieldError(fieldId, errorMessage);
        return isValid;
    }

    validateNumericField(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return true;

        const value = parseFloat(field.value);
        let isValid = true;
        let errorMessage = '';

        if (field.value && (isNaN(value) || value < 0)) {
            isValid = false;
            errorMessage = 'Please enter a valid amount (₹0 or more)';
        }

        this.displayFieldError(fieldId, errorMessage);
        return isValid;
    }

    displayFieldError(fieldId, errorMessage) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        // Remove existing error
        const existingError = field.parentNode.querySelector('.salary-error');
        if (existingError) {
            existingError.remove();
        }

        field.classList.remove('invalid-field');

        if (errorMessage) {
            field.classList.add('invalid-field');
            const errorElement = document.createElement('div');
            errorElement.className = 'salary-error';
            errorElement.style.color = '#dc3545';
            errorElement.style.fontSize = '12px';
            errorElement.style.marginTop = '5px';
            errorElement.textContent = errorMessage;
            field.parentNode.appendChild(errorElement);
        }
    }

    clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        const errorElement = field.parentNode.querySelector('.salary-error');
        if (errorElement) {
            errorElement.remove();
        }
        field.classList.remove('invalid-field');
    }

    validateSalaryForm() {
        const requiredFields = ['salaryEmployee', 'salaryMonth', 'salaryYear', 'baseSalary', 'paymentDate'];
        let isFormValid = true;

        requiredFields.forEach(fieldId => {
            if (!this.validateSalaryField(fieldId)) {
                isFormValid = false;
            }
        });

        // Validate numeric fields
        const numericFields = ['allowance', 'deductions', 'overtime', 'bonus', 'taxDeduction'];
        numericFields.forEach(fieldId => {
            if (!this.validateNumericField(fieldId)) {
                isFormValid = false;
            }
        });

        return isFormValid;
    }

    setupPaymentFormValidation() {
        const form = document.getElementById('paySalaryForm');
        if (!form) return;

        const requiredFields = ['payEmployee', 'paymentMethod'];

        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('blur', () => this.validatePaymentField(fieldId));
                field.addEventListener('change', () => this.clearFieldError(fieldId));
            }
        });

        form.addEventListener('submit', (e) => {
            if (!this.validatePaymentForm()) {
                e.preventDefault();
            }
        });
    }

    clearPaymentFormValidation() {
        const errorElements = document.querySelectorAll('.payment-error');
        errorElements.forEach(el => el.remove());
        const invalidFields = document.querySelectorAll('.invalid-field');
        invalidFields.forEach(el => el.classList.remove('invalid-field'));
    }

    validatePaymentField(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return true;

        let isValid = true;
        let errorMessage = '';

        switch(fieldId) {
            case 'payEmployee':
                if (!field.value) {
                    isValid = false;
                    errorMessage = 'Please select an employee';
                }
                break;
            case 'paymentMethod':
                if (!field.value) {
                    isValid = false;
                    errorMessage = 'Please select a payment method';
                }
                break;
        }

        this.displayFieldError(fieldId, errorMessage);
        return isValid;
    }

    validatePaymentForm() {
        const requiredFields = ['payEmployee', 'paymentMethod'];
        let isFormValid = true;

        requiredFields.forEach(fieldId => {
            if (!this.validatePaymentField(fieldId)) {
                isFormValid = false;
            }
        });

        // Check if at least one salary is selected
        const checkboxes = document.querySelectorAll('input[name^="pending_salary_"]:checked');
        if (checkboxes.length === 0) {
            alert('Please select at least one salary to pay');
            isFormValid = false;
        }

        return isFormValid;
    }

    setupSheetFormValidation() {
        const form = document.getElementById('salarySheetForm');
        if (!form) return;

        const requiredFields = ['sheetMonth', 'sheetYear'];

        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('blur', () => this.validateSheetField(fieldId));
                field.addEventListener('change', () => this.clearFieldError(fieldId));
            }
        });

        form.addEventListener('submit', (e) => {
            if (!this.validateSheetForm()) {
                e.preventDefault();
            }
        });
    }

    clearSheetFormValidation() {
        const errorElements = document.querySelectorAll('.sheet-error');
        errorElements.forEach(el => el.remove());
        const invalidFields = document.querySelectorAll('.invalid-field');
        invalidFields.forEach(el => el.classList.remove('invalid-field'));
    }

    validateSheetField(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return true;

        let isValid = true;
        let errorMessage = '';

        if (!field.value) {
            isValid = false;
            errorMessage = `Please select a ${fieldId === 'sheetMonth' ? 'month' : 'year'}`;
        }

        this.displayFieldError(fieldId, errorMessage);
        return isValid;
    }

    validateSheetForm() {
        const requiredFields = ['sheetMonth', 'sheetYear'];
        let isFormValid = true;

        requiredFields.forEach(fieldId => {
            if (!this.validateSheetField(fieldId)) {
                isFormValid = false;
            }
        });

        return isFormValid;
    }

    setupReportFormValidation() {
        const form = document.getElementById('salaryReportForm');
        if (!form) return;

        const requiredFields = ['reportType', 'reportYear'];

        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('blur', () => this.validateReportField(fieldId));
                field.addEventListener('change', () => this.clearFieldError(fieldId));
            }
        });

        form.addEventListener('submit', (e) => {
            if (!this.validateReportForm()) {
                e.preventDefault();
            }
        });
    }

    clearReportFormValidation() {
        const errorElements = document.querySelectorAll('.report-error');
        errorElements.forEach(el => el.remove());
        const invalidFields = document.querySelectorAll('.invalid-field');
        invalidFields.forEach(el => el.classList.remove('invalid-field'));
    }

    validateReportField(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return true;

        let isValid = true;
        let errorMessage = '';

        if (!field.value) {
            isValid = false;
            errorMessage = `Please select a ${fieldId === 'reportType' ? 'report type' : 'year'}`;
        }

        this.displayFieldError(fieldId, errorMessage);
        return isValid;
    }

    validateReportForm() {
        const requiredFields = ['reportType', 'reportYear'];
        let isFormValid = true;

        requiredFields.forEach(fieldId => {
            if (!this.validateReportField(fieldId)) {
                isFormValid = false;
            }
        });

        return isFormValid;
    }
}

const schoolSystem = new SchoolManagementSystem();
