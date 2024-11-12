const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const mysql = require('mysql2');
// const User = require('../models/User');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Mock user data (in production, you'd use a database)
const users = [{ username: 'user', passwordHash: bcrypt.hashSync('pass', 8) }, { username: 'user2', passwordHash: bcrypt.hashSync('pass', 8) }];

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};


// Routes
router.post('/login', (req, res) => {
  const { userNameEmail, userPassword } = req.body;
  console.log(req.body);
  const user = users.find(user => user.username === userNameEmail);
  

  // if (!user) {
  //   res.send({ message: `No user with the name ${username}` });

  //   // return res.status(401).send({ message: 'No user with that name' });
  // }
  // if (!bcrypt.compareSync(password, user.passwordHash)) {
  //   res.send({ message: 'Wrong Password' });

  //   // return res.status(401).send({ message: 'Wrong Password' });
  // }
  // if (!user || !bcrypt.compareSync(userPassword, user.passwordHash)) {
  //   return res.send({ message: `Invalid credentials Username: ${userNameEmail} & Password ${userPassword}` });
  // }


  if (!user || !bcrypt.compareSync(userPassword, user.passwordHash)) {
    return res.status(401).send({ message: `Invalid credentials` });
  }

  const token = generateToken(user);
  res.send({ message:  'Login successful.', token });
});



router.get('/trial', (req, res) => {
  console.log("Successful Trail");
  res.json('Auth route works');
})

router.get('/testEmail', async (req, res) => {
  const url = `http://localhost:5173/`;
  const email =   `amanuel.dereje.nv2994@gmail.com`
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Confirmation',
    html: `<h3>Hello Amanuel </h3><p>We are testing if the Email Works href="${url}">Confirm Email</a></p>`,
  };

  await transporter.sendMail(mailOptions);
  res.status(200).json({ message: 'Signup successful! Please check your email to confirm.' });
    

  console.log("Successful Trail");
  // res.json('Auth route works');
})

// Signup route
router.post('/signup', async (req, res) => {
  const { username, email, password, userType } = req.body;
  console.log(username, email, password, userType);

  try {
    // Check if the user already exists
    // const queryUserList = 'Select COUNT(*) FROM Users WHERE username = \'?\' OR email = \'?\';';
    const queryUserList = 'Select COUNT(*) as count FROM Users WHERE username = ? OR email = ?;';
    db.query(queryUserList, [username, email], async (err, result) => {
      if (result[0].count != 0) return res.status(400).json({ message: 'User already exists' });
      // if (result[0].count != 0) return res.status(400).json({ message: JSON.stringify(result) });
      if (err) return res.status(500).json({ message: 'Database error at 1' });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a JWT token for email verification
        const verificationToken = await jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Insert User into Applicants table
            
            const queryAddApplicants = 'INSERT INTO Applicants (username, email, password, verification_token, userType) VALUES (?, ?, ?, ?, ?)';
            db.query(queryAddApplicants, [username, email, hashedPassword, verificationToken, userType], async (err, result) => {
              // if (err) return res.status(500).json({ message: 'Database error at 2' });
              if (err) return res.status(500).json({ message: JSON.stringify(err)});
                
                // Send confirmation email
                const url = `http://localhost:${process.env.PORT}/api/auth/confirm/${verificationToken}`;
                const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Email Confirmation',
                html: `<h3>Hello ${username}</h3><p>Please confirm your email by clicking on the link: <a href="${url}">Confirm Email</a></p>`,
                };
    
                await transporter.sendMail(mailOptions);

                res.status(200).json({ message: 'Signup successful! Please check your email to confirm.' });
    
    

        });


          
      

    });






  } catch (error) {
    res.status(500).json({ message: 'Error during signup' });
  }
});

// Email confirmation route
router.get('/confirm/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // Verify JWT token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {return res.status(400).json({ message: 'Invalid or expired token' }); console.log("Invalid or expired token")}
        console.log("Valid Token")
        const email = decoded.email;
        console.log("Email: "+email);
        console.log("Token: "+token);

        // Get User Values From Applicants Table
        const queryGetNewUserData = 'SELECT * FROM Applicants WHERE email = ? AND verification_token = ? ORDER BY id ASC LIMIT 1;';
        db.query(queryGetNewUserData, [email, token], (err, result) => {
            if (err){console.log(JSON.stringify(err)); return res.status(500).json({ message: 'Database error 3' });}
            if(result.length == 0){console.log(JSON.stringify(err)); return res.status(400).json({ message: "Expired or invalid token" });}
            else{
            const username = result[0].username;
            const password = result[0].password;
            const userType = result[0].userType;

            // Add User to the Users table
            const queryRegisterUsers = 'INSERT INTO Users (username, email, password, userType) VALUES (?, ?, ?, ?)';
            db.query(queryRegisterUsers, [username, email, password, userType], (err, result) => {
                if (err) return res.status(500).json({ message: 'Database error at 4' });

                // Remove the user from the Applicants
                const queryDeleteApplicant = 'DELETE FROM Applicants WHERE email = ?';
                db.query(queryDeleteApplicant, [email], (err, result) => {
                    if (err) return res.status(500).json({ message: 'Database error - 5' });
        
                    const getNewUserID = 'Select UserID FROM users WHERE email = ?';
                    db.query(getNewUserID, [email], (err, result) => {
                        if (err) return res.status(500).json({ message: 'Database error - 6' });
                        console.log(JSON.stringify(result))
                        const userID = result[0].UserID;

                        res.status(200).json({ message: 'Email verified successfully' });
                        // res.redirect(`http://localhost:5173/NewStartupForm?userID=${userID}&token=${token}`);
    
                        console.log("Email verified successfully");
                    });
                    });
        
            });
          }

        });

    });
    
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

module.exports = router;
