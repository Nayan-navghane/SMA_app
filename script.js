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
        // Similar to student form but for teachers
        alert('Teacher management will be implemented next');
    }

    loadTeachers() {
        const teachersList = document.getElementById('teachersList');
        teachersList.innerHTML = '<p>Teacher management coming soon!</p>';
    }

    filterTeachers() {
        // Filter implementation
    }

    // Admission Management
    handleAdmission(e) {
        e.preventDefault();

        const admissionData = {
            id: Date.now(),
            studentName: document.getElementById('studentName').value,
            class: document.getElementById('admissionClass').value,
            parentName: document.getElementById('parentName').value,
            contactNumber: document.getElementById('contactNumber').value,
            email: document.getElementById('email').value,
            dateOfBirth: document.getElementById('dateOfBirth').value,
            address: document.getElementById('address').value,
            previousSchool: document.getElementById('previousSchool').value,
            applicationDate: new Date().toISOString(),
            status: 'pending'
        };

        this.admissions.push(admissionData);
        localStorage.setItem('admissions', JSON.stringify(this.admissions));
        
        this.addActivity(`New admission application: ${admissionData.studentName} for class ${admissionData.class}`);
        
        document.getElementById('admissionForm').reset();
        this.loadDashboardData();
        
        alert('Admission application submitted successfully!');
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
        alert('Exam creation will be implemented next');
    }

    loadExams() {
        const examsList = document.getElementById('examsList');
        examsList.innerHTML = '<p>Exam management coming soon!</p>';
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

// Initialize the system when page loads
let schoolSystem;
document.addEventListener('DOMContentLoaded', () => {
    schoolSystem = new SchoolManagementSystem();
    
    // Set current date for attendance
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('attendanceDate').value = today;
});
