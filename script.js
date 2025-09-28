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
        this.salaries = JSON.parse(localStorage.getItem('salaries')) || [];
        
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

        // Salary form
        const salaryForm = document.getElementById('salaryForm');
        if (salaryForm) salaryForm.addEventListener('submit', (e) => this.handleSalarySubmit(e));

        // Excel upload
        const excelUpload = document.getElementById('excelUpload');
        if (excelUpload) excelUpload.addEventListener('change', (e) => this.uploadSalaryExcel(e));

        // Theme toggle
        const themeSelect = document.getElementById('theme');
        if (themeSelect) themeSelect.addEventListener('change', (e) => {
            const theme = e.target.value;
            this.settings.preferences.theme = theme;
            localStorage.setItem('settings', JSON.stringify(this.settings));
            this.applyTheme(theme);
