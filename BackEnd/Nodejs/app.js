// app.js
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// const app = express();
// app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Nodemailer transport for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// User signup endpoint
app.post('/signup', async (req, res) => {
    const { username, email, password, userType } = req.body;

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a JWT token for email verification
        const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Check if user already exists
        const queryUserList = 'Select COUNT(*) FROM Users WHERE username = \'?\' OR email = \'?\';';
        db.query(queryUserList, [username, email, hashedPassword, verificationToken], (err, result) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            if (res != 0) return res.status(400).json({ message: 'That Username or Email is already in use.' });
            
            // Insert User into Applicants table
            const queryAddApplicants = 'INSERT INTO Applicants (username, email, password, verification_token, userType) VALUES (?, ?, ?, ?, ?)';
            db.query(queryAddApplicants, [username, email, hashedPassword, verificationToken, userType], (err, result) => {
                if (err) return res.status(500).json({ message: 'Database error' });

                const verificationLink = `${process.env.BASE_URL}/verify/${verificationToken}`;
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'Email Verification',
                    html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`
                };

                // Send verification email
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) return res.status(500).json({ message: 'Error sending email' });
                    res.status(200).json({ message: 'Signup successful! Please verify your email.' });
                });
    


            });


        });
    } catch (error) {
        res.status(500).json({ message: 'Error during signup' });
    }
});

// Email verification endpoint
app.get('/verify/:token', (req, res) => {
    const { token } = req.params;

    // Verify JWT token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(400).json({ message: 'Invalid or expired token' });

        const email = decoded.email;

        // Get User Values From Applicants Table
        const queryGetNewUserData = 'SELECT TOP 1 * FROM Applicants WHERE email = \'?\';';
        db.query(queryGetNewUserData, [email], (err, result) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            console.log(result);
            const username = result[0].username;
            const password = result[0].password;
            const userType = result[0].userType;

            // Add User to the Users table
            const queryRegisterUsers = 'INSERT INTO Users (username, email, password, userType) VALUES (?, ?, ?, ?)';
            db.query(queryRegisterUsers, [username, email, password, userType], (err, result) => {
                if (err) return res.status(500).json({ message: 'Database error' });
    
                // Remove the user from the Applicants
                const queryDeleteNewUser = 'DELETE FROM Applicants WHERE email = \'?\'';
                db.query(queryDeleteNewUser, [email], (err, result) => {
                    if (err) return res.status(500).json({ message: 'Database error' });
        
                    res.status(200).json({ message: 'Email verified successfully' });
                    console.log("Email verified successfully");
                });
        
            });

        });

    });
});

// Start the server
// app.listen(3000, () => {
//     console.log('Server is running on port 3000');
// });

module.exports = router;
