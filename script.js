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

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDashboardData();
        this.showSection('dashboard');
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
        } else if (sectionName === 'admissions') {
            this.loadAdmissions();
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
        const admission = {
            id: Date.now().toString(),
            application_id: formData.get('application_id'),
            applicant_name: formData.get('applicant_name'),
            dob: formData.get('dob'),
            applying_class: formData.get('applying_class'),
            parent_name: formData.get('parent_name'),
            parent_contact: formData.get('parent_contact'),
            address: formData.get('address'),
            previous_school: formData.get('previous_school'),
            documents_status: formData.get('documents_status'),
            status: 'pending',
            submission_date: new Date().toISOString()
        };
        this.admissions.push(admission);
        localStorage.setItem('admissions', JSON.stringify(this.admissions));
        e.target.reset();
        this.loadAdmissions();
        alert('Admission application submitted successfully!');

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

    showAddStudentForm() {
        document.getElementById('addStudentFormContainer').style.display = 'block';
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

    showAddAdmissionForm() {
        document.getElementById('addAdmissionFormContainer').style.display = 'block';
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

    applyTheme(theme) {
        document.body.classList = theme;
    }
}

const schoolSystem = new SchoolManagementSystem();
