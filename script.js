class SchoolManagementSystem {
    constructor() {
        // Check login
        if (!localStorage.getItem('loggedIn') || localStorage.getItem('loggedIn') !== 'true') {
            window.location.href = 'login.html';
            return;
        }

        // Load data from localStorage
        this.students = JSON.parse(localStorage.getItem('students')) || [];
        this.teachers
