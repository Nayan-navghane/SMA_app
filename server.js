const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const PDFDocument = require('pdfkit');
const session = require('express-session');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Adjust if frontend served differently
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'sma-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Serve static files from SMA_app
app.use(express.static(path.join(__dirname, 'SMA_app')));

// Database setup
const db = new sqlite3.Database('sma.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        initializeDatabase();
    }
});

function initializeDatabase() {
    // Create tables for all modules
    db.serialize(() => {
        // Students table with all required fields
        db.run(`CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT UNIQUE,
            name TEXT NOT NULL,
            photo_path TEXT,
            dob DATE,
            class TEXT,
            section TEXT,
            roll_no TEXT,
            parent_name TEXT,
            parent_contact TEXT,
            address TEXT,
            aadhar TEXT,
            blood_group TEXT,
            emergency_contact TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Teachers table
        db.run(`CREATE TABLE IF NOT EXISTS teachers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            subject TEXT,
            photo_path TEXT,
            contact TEXT,
            joining_date DATE,
            salary REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Fees table
        db.run(`CREATE TABLE IF NOT EXISTS fee_structures (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            class TEXT,
            amount REAL,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS fee_payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER,
            installment_amount REAL,
            payment_date DATE,
            mode TEXT,
            status TEXT DEFAULT 'pending',
            FOREIGN KEY (student_id) REFERENCES students (id),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Attendance table
        db.run(`CREATE TABLE IF NOT EXISTS attendance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER,
            date DATE,
            status TEXT, -- present/absent
            class TEXT,
            FOREIGN KEY (student_id) REFERENCES students (id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS teacher_attendance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            teacher_id INTEGER,
            date DATE,
            status TEXT,
            FOREIGN KEY (teacher_id) REFERENCES teachers (id)
        )`);

        // Exams table
        db.run(`CREATE TABLE IF NOT EXISTS exams (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            class TEXT,
            subject TEXT,
            date DATE,
            paper_path TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS exam_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER,
            exam_id INTEGER,
            marks INTEGER,
            total_marks INTEGER,
            grade TEXT,
            FOREIGN KEY (student_id) REFERENCES students (id),
            FOREIGN KEY (exam_id) REFERENCES exams (id)
        )`);

        // Staff table (includes non-teaching)
        db.run(`CREATE TABLE IF NOT EXISTS staff (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            role TEXT,
            department TEXT,
            contact TEXT,
            salary REAL,
            join_date DATE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Schedules table
        db.run(`CREATE TABLE IF NOT EXISTS schedules (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            class TEXT,
            day TEXT,
            period INTEGER,
            subject TEXT,
            teacher_id INTEGER,
            time TEXT,
            FOREIGN KEY (teacher_id) REFERENCES teachers (id),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Settings table
        db.run(`CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY 1,
            school_logo TEXT,
            theme TEXT DEFAULT 'light',
            notifications_enabled BOOLEAN DEFAULT 1,
            admin_roles TEXT
        )`);

        // Insert default settings if not exists
        db.run(`INSERT OR IGNORE INTO settings (id, school_logo, theme, notifications_enabled, admin_roles) 
                VALUES (1, NULL, 'light', 1, 'admin,superadmin')`);
    });
}

// File upload setup for photos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Ensure uploads directory exists
const fs = require('fs');
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Basic route for root - serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'SMA_app', 'index.html'));
});

// API Routes - Students
app.get('/api/students', (req, res) => {
    db.all('SELECT * FROM students ORDER BY class, roll_no', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/students', upload.single('photo'), (req, res) => {
    const { name, dob, class: studentClass, section, roll_no, parent_name, parent_contact, address, aadhar, blood_group, emergency_contact } = req.body;
    const photo_path = req.file ? req.file.path : null;
    const student_id = `STU${Date.now()}`;
    const stmt = db.prepare('INSERT INTO students (student_id, name, photo_path, dob, class, section, roll_no, parent_name, parent_contact, address, aadhar, blood_group, emergency_contact) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    stmt.run(student_id, name, photo_path, dob, studentClass, section, roll_no, parent_name, parent_contact, address, aadhar, blood_group, emergency_contact, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, student_id });
    });
    stmt.finalize();
});

app.put('/api/students/:id', upload.single('photo'), (req, res) => {
    const id = req.params.id;
    const { name, dob, class: studentClass, section, roll_no, parent_name, parent_contact, address, aadhar, blood_group, emergency_contact } = req.body;
    const photo_path = req.file ? req.file.path : null;
    let sql = 'UPDATE students SET name = ?, dob = ?, class = ?, section = ?, roll_no = ?, parent_name = ?, parent_contact = ?, address = ?, aadhar = ?, blood_group = ?, emergency_contact = ?, updated_at = CURRENT_TIMESTAMP';
    let params = [name, dob, studentClass, section, roll_no, parent_name, parent_contact, address, aadhar, blood_group, emergency_contact];
    if (photo_path) {
        sql += ', photo_path = ?';
        params.push(photo_path);
    }
    sql += ' WHERE id = ?';
    params.push(id);
    db.run(sql, params, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Student not found' });
            return;
        }
        res.json({ message: 'Student updated successfully' });
    });
});

app.delete('/api/students/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM students WHERE id = ?', id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Student not found' });
            return;
        }
        res.json({ message: 'Student deleted successfully' });
    });
});

// Search students by class
app.get('/api/students/class/:class', (req, res) => {
    const { class: studentClass } = req.params;
    db.all('SELECT * FROM students WHERE class = ? ORDER BY roll_no', [studentClass], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Similar routes for other modules (Teachers, Fees, etc.) - to be expanded
app.get('/api/teachers', (req, res) => {
    db.all('SELECT * FROM teachers', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/teachers', upload.single('photo'), (req, res) => {
    const { name, subject, contact, joining_date, salary } = req.body;
    const photo_path = req.file ? req.file.path : null;
    const stmt = db.prepare('INSERT INTO teachers (name, subject, photo_path, contact, joining_date, salary) VALUES (?, ?, ?, ?, ?, ?)');
    stmt.run(name, subject, photo_path, contact, joining_date, salary, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
    stmt.finalize();
});

// Fee structure
app.get('/api/fee-structures', (req, res) => {
    db.all('SELECT * FROM fee_structures', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/fee-structures', (req, res) => {
    const { class: feeClass, amount, description } = req.body;
    const stmt = db.prepare('INSERT INTO fee_structures (class, amount, description) VALUES (?, ?, ?)');
    stmt.run(feeClass, amount, description, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
    stmt.finalize();
});

// Fee payments
app.post('/api/fee-payments', (req, res) => {
    const { student_id, installment_amount, payment_date, mode, status } = req.body;
    const stmt = db.prepare('INSERT INTO fee_payments (student_id, installment_amount, payment_date, mode, status) VALUES (?, ?, ?, ?, ?)');
    stmt.run(student_id, installment_amount, payment_date, mode, status, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
    stmt.finalize();
});

// Track fees for student
app.get('/api/fees/student/:studentId', (req, res) => {
    const studentId = req.params.studentId;
    db.all(`
        SELECT fs.*, fp.* FROM fee_structures fs 
        LEFT JOIN fee_payments fp ON fs.id = fp.fee_structure_id 
        WHERE fs.class = (SELECT class FROM students WHERE id = ?)
    `, [studentId], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        // Logic to calculate paid/pending/overdue
        const totalFees = rows.reduce((sum, row) => sum + (row.amount || 0), 0);
        const paid = rows.reduce((sum, row) => sum + (row.installment_amount || 0), 0);
        const pending = totalFees - paid;
        res.json({ totalFees, paid, pending, records: rows });
    });
});

// Generate PDF receipt (example for fee receipt)
app.get('/api/generate-receipt/:paymentId', (req, res) => {
    const paymentId = req.params.paymentId;
    db.get('SELECT * FROM fee_payments fp JOIN students s ON fp.student_id = s.id WHERE fp.id = ?', [paymentId], (err, payment) => {
        if (err || !payment) {
            res.status(500).json({ error: 'Payment not found' });
            return;
        }

        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=fee_receipt_${paymentId}.pdf`);
        doc.pipe(res);

        doc.fontSize(20).text('Fee Receipt', 100, 100);
        doc.text(`Student: ${payment.name}`, 100, 150);
        doc.text(`Amount: $${payment.installment_amount}`, 100, 170);
        doc.text(`Date: ${payment.payment_date}`, 100, 190);
        doc.text(`Mode: ${payment.mode}`, 100, 210);

        doc.end();
    });
});

// ID Card generation (example)
app.get('/api/generate-idcard/:studentId', (req, res) => {
    const studentId = req.params.studentId;
    db.get('SELECT * FROM students WHERE id = ?', [studentId], (err, student) => {
        if (err || !student) {
            res.status(500).json({ error: 'Student not found' });
            return;
        }

        const doc = new PDFDocument({ size: [252, 396] }); // ID card size approx 3.5x2 inches at 72dpi
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=idcard_${student.student_id}.pdf`);
        doc.pipe(res);

        // School logo placeholder
        doc.fontSize(12).text('School Logo', 20, 20);

        // Student photo placeholder
        doc.rect(150, 20, 80, 100).stroke();
        doc.text('Photo', 170, 60);

        doc.fontSize(14).text(student.name, 20, 140);
        doc.text(`Class: ${student.class} - ${student.section}`, 20, 160);
        doc.text(`Roll No: ${student.roll_no}`, 20, 180);
        doc.text(`DOB: ${student.dob}`, 20, 200);
        doc.text(`Blood Group: ${student.blood_group}`, 20, 220);
        doc.text(`Emergency: ${student.emergency_contact}`, 20, 240);

        // QR code or barcode placeholder
        doc.text('ID: ' + student.student_id, 20, 300);

        doc.end();
    });
});

// Attendance routes
app.post('/api/attendance', (req, res) => {
    const { student_id, date, status, class: studentClass } = req.body;
    const stmt = db.prepare('INSERT INTO attendance (student_id, date, status, class) VALUES (?, ?, ?, ?)');
    stmt.run(student_id, date, status, studentClass, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
    stmt.finalize();
});

app.get('/api/attendance/:date/:class', (req, res) => {
    const { date, class: studentClass } = req.params;
    db.all('SELECT s.name, s.roll_no, a.status FROM attendance a JOIN students s ON a.student_id = s.id WHERE a.date = ? AND a.class = ?', [date, studentClass], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Teacher attendance similar...

// Exams routes
app.post('/api/exams', (req, res) => {
    const { class: examClass, subject, date, paper_path } = req.body;
    const stmt = db.prepare('INSERT INTO exams (class, subject, date, paper_path) VALUES (?, ?, ?, ?)');
    stmt.run(examClass, subject, date, paper_path, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
    stmt.finalize();
});

app.post('/api/exam-results', (req, res) => {
    const { student_id, exam_id, marks, total_marks, grade } = req.body;
    const stmt = db.prepare('INSERT INTO exam_results (student_id, exam_id, marks, total_marks, grade) VALUES (?, ?, ?, ?, ?)');
    stmt.run(student_id, exam_id, marks, total_marks, grade, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
    stmt.finalize();
});

// Staff routes similar to teachers...

// Settings
app.get('/api/settings', (req, res) => {
    db.get('SELECT * FROM settings WHERE id = 1', (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(row || {});
    });
});

app.put('/api/settings', (req, res) => {
    const { school_logo, theme, notifications_enabled, admin_roles } = req.body;
    db.run('UPDATE settings SET school_logo = ?, theme = ?, notifications_enabled = ?, admin_roles = ? WHERE id = 1', 
           [school_logo, theme, notifications_enabled, admin_roles], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Settings updated' });
    });
});

// Login stub (for now, simple session)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin') {
        req.session.loggedIn = true;
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
});

app.get('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Close database on app exit
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Database connection closed.');
        process.exit(0);
    });
});
