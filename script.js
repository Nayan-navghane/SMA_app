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
        const todayAttendance
