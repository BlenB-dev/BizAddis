const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');

const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const path = require('path');

dotenv.config();

const app  = express();
app.use(cors());
app.use(express.json());

const fs = require("fs");
const bcrypt = require('bcryptjs');





const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

fs.readFile('./Temp/InvestorProfile.json', 'utf-8', (err, data) => {
  if (err) {console.log("Error: ", err); return}
  const jsonData = JSON.parse(data);
  //console.log(jsonData[0]);
  // console.log(Object.keys(jsonData[0].IndustrySector));  
  // saveToDatabase(jsonData);  // Function to save data to database
  // checkUsers();
  console.log(jsonData.length);
  // saveInvestorToDatabase(jsonData);
  // checkSeviceFilter();
});

async function checkSeviceFilter(){
  
    const ServiceProviderName = '';
    const TypeOfService = "";
    const SpecificSectors = ''; 
    const SubCity = "";

  console.log("Step 2");
    const query = `
    SELECT ServiceProviderID, ServiceProviderName,ServiceDescription, TypeOfService, SpecificSectors, SubCity FROM serviceproviders
    WHERE 1=1
        AND (? IS NULL OR ServiceProviderName LIKE ?)
        AND (? IS NULL OR  TypeOfService LIKE ?)
        AND (? IS NULL OR SpecificSectors LIKE ?)
        AND (? IS NULL OR SubCity = ?)
  `;
  
  
  const params = [
    ServiceProviderName, `%${ServiceProviderName || ''}%`,
    TypeOfService, `%${TypeOfService || ''}%`,
    SpecificSectors, `%${SpecificSectors || ''}%`,
    SubCity, SubCity
  ];
  
  db.query(query, params, (error, results) => {
    if (error) {console.log("Error: " + error); return}
    console.log(results);
    console.log("Filter Return: "+results.length);
  });
  



}

async function saveInvestorToDatabase(data) {
  const hashedPassword = await bcrypt.hash("password", 10);
  const isActive = true;
  const UserType = "Investor"
  let count = 1;

  data.forEach( (investor) => {
    console.log("Count: "+count);
    count++;
    

    const queryRegisterUsers = 'INSERT INTO Users (username, email, password, userType, is_active) VALUES (?, ?, ?, ?, ?)';
    db.query(queryRegisterUsers, [
      investor.UserName, 
      investor.UserEmail, 
      hashedPassword, 
      UserType,
      isActive
    ], (err, result) => {
      if (err) console.log(err);

      const getNewUserID = 'Select UserID FROM users WHERE email = ?';
      db.query(getNewUserID, [investor.UserEmail], (err, result) => {
        if (err){console.log('Database Error Create INVESTOR Profile 4\n' + JSON.stringify(err));}

        const userID = result[0].UserID;
        const query = `INSERT INTO investors (UserID, InvestorName, InvestorBio, InvestorPortfolios, MinimumInvestmentAmount, MaximumInvestmentAmount, InvestmentTimeline, InvestmentApproach, RiskTolerance, FollowOnInvestmentCapacity, CoInvestmentOpportunities, MentorshipCapabilities, NetworkConnections, PriorStartupExperience, EducationalBackground, ProfessionalExperience, CommunityInvolvement, SignupDate, Phone1, Phone2, BusinessEmail, InvestorPreference) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,CURRENT_TIMESTAMP() ,  ?, ?, ?, ?)`;

  

        db.query(query, [
            userID,
            investor.InvestorName,
            investor.InvestorBio,
            JSON.stringify(investor.InvestorPortfolios),
            investor.MinimumInvestmentAmount,
            investor.MaximumInvestmentAmount,
            investor.InvestmentTimeline,
            investor.InvestmentApproach,
            investor.RiskTolerance,
            investor.FollowOnInvestmentCapacity,
            investor.CoInvestmentOpportunities,
            investor.MentorshipCapabilities,
            investor.NetworkConnections,
            investor.PriorStartupExperience,
            investor.EducationalBackground,
            investor.ProfessionalExperience,
            investor.CommunityInvolvement,
            investor.Phone1,
            investor.Phone2,
            investor.BusinessEmail,
            JSON.stringify(investor.InvestorPreferance)

        ], (err, results) => {
            if (err) {console.log("Error: " + error); return}
            console.log('Data inserted into MySQL successfully');
        });


      });


   

  });
});

}





// Authenticate middleware
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(403).send({ message: 'Token missing' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).send({ message: 'Invalid token' });
      }
  
      req.user = decoded; // Attach user information to the request object
      next();
    });
  };

app.get('/api/profile', authenticateJWT, (req, res) => {
    //console.log(`Accessing Profile of ${req.user}`)
    res.send({ message: 'Profile accessed', user: req.user });
});

// Node.js/Express example for returning a file
app.post('/api/getProfilePic',authenticateJWT, (req, res) => {
  //console.log("Request Body of Profile Pic Request: \n"+JSON.stringify(req.user));
  const userID = req.user.userID;
  const sql = `select PickDeckURL from startups where UserID = ${userID}`;
  db.query(sql,(err, data)=>{
      if(err) console.log("Unkown ERROr 2"+err);

      const filePath = data[0].PickDeckURL; // Assuming the file path is stored in the database
      // const fullPath = path.join(__dirname, filePath); // Construct the full path to the file
      // console.log("FullPath: "+fullPath)
      // Send the file to the client
      res.sendFile(filePath, (err) => {
        if (err) {
          return res.status(500).send('Error downloading file');
        }
      });


  })

});

app.post('/api/GetFilteredServiceProviders', (req, res)=>{
  console.log("Getting Filtered Service Providers");
  console.log(JSON.stringify(req.body));
  const {token, ServiceProviderName, TypeOfService, SpecificSectors, SubCity} = req.body;
  console.log("Name:"+ ServiceProviderName+"\nType Of Service"+ TypeOfService+"\nSpecific Sectors:"+ SpecificSectors+"\nSub City:"+ SubCity+"\nToken: "+token);

  console.log("Step 2");
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {console.log("Invalid or expired token"); return res.status(403).json({ message: 'Invalid or expired token' }); }
    console.log("Decoded: " + JSON.stringify(decoded));
    const userID = decoded.userID;
    console.log("UserID: "+userID);


    const query = `
    SELECT ServiceProviderID, ServiceProviderName,ServiceDescription, TypeOfService, SpecificSectors, SubCity FROM serviceproviders
    WHERE 1=1
        AND ((? IS NULL OR ? = '') OR ServiceProviderName LIKE ?)
        AND ((? IS NULL OR ? = '') OR  TypeOfService LIKE ?)
        AND ((? IS NULL OR ? = '') OR SpecificSectors LIKE ?)
        AND ((? IS NULL OR ? = '') OR SubCity = ?)
  `;
  
  
  const params = [
    ServiceProviderName, ServiceProviderName, `%${ServiceProviderName || ''}%`,
    TypeOfService, TypeOfService, `%${TypeOfService || ''}%`,
    SpecificSectors, SpecificSectors, `%${SpecificSectors || ''}%`,
    SubCity, SubCity, SubCity
  ];
  
  db.query(query, params, (error, results) => {
    if (error) {console.log("Error: " + error); return}
    // console.log(results);
    console.log("Filter Return: "+results.length);
    return res.json(results);
  });
  
  });

});

app.post('/api/GetServiceProviderByID', (req, res)=>{
  console.log("Getting Service Providers By ID");
  console.log(JSON.stringify(req.body));
  const {token, ServiceProviderID} = req.body;
  console.log("ID:"+ ServiceProviderID+"\nToken: "+token);

  console.log("Step 2");
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {console.log("Invalid or expired token"); return res.status(403).json({ message: 'Invalid or expired token' }); }
    // console.log("Decoded: " + JSON.stringify(decoded));
    // const userID = decoded.userID;
    // console.log("UserID: "+userID);


    const query = `
    SELECT * FROM serviceproviders WHERE ServiceProviderID = ? `;
  
  db.query(query, [ServiceProviderID], (error, results) => {
    if (error) {console.log("Error: " + error); return}
    // console.log(results);
    console.log("Service Provider Details Return : "+results.length);
    return res.json(results);
  });
  
  });

});


app.post('/api/getServiceLogoPic',authenticateJWT, (req, res) => {
  const userID = req.user.userID;
  const sql = `select LogoURL from serviceproviders where UserID = ${userID}`;
  db.query(sql,(err, data)=>{
      if(err) console.log("Unkown ERROr 2"+err);
      const filePath = data[0].LogoURL; 
      res.sendFile(filePath, (err) => {
        if (err) {
          return res.status(500).send('Error downloading file');
        }
      });

    })

});

app.post('/api/getInvestorLogoPic',authenticateJWT, (req, res) => {
  const userID = req.user.userID;
  const sql = `select LogoURL from investors where UserID = ${userID}`;
  db.query(sql,(err, data)=>{
      if(err) console.log("Unkown ERROr 2"+err);
      const filePath = data[0].LogoURL; 
      res.sendFile(filePath, (err) => {
        if (err) {
          return res.status(500).send('Error downloading file');
        }
      });

    })

});


app.get('/api/GetStartupProfile', authenticateJWT, (req, res) => {
  const userID = req.user.userID;
  const UserType = req.user.userType

  console.log("1) UserID: "+ userID+ "\n2) UserType: "+UserType+"\n")

  if(UserType == "Startup"){
    console.log("Step 2");
    const sql = `select * from startups where UserID = ${userID}`;
    db.query(sql,(err, data)=>{
      console.log("Step 3");
        if(err) console.log("Unkown ERROr 2"+err);
        //console.log(data.PickDeckURL);
        return res.json(data);
    })


  }
  //console.log(`Accessing Profile of ${req.user}`)
  // res.send({ message: 'Profile accessed', user: req.user });
});

app.get('/api/GetServiceProviderProfile', authenticateJWT, (req, res) => {
  const userID = req.user.userID;
  const UserType = req.user.userType

  console.log("Step \n1) UserID: "+ userID+ "\n2) UserType: "+UserType+"\n")

  if(UserType == "Service Provider" || UserType == "Service Providers"){
    console.log("Step 2");
    const sql = `select * from serviceproviders where UserID = ${userID}`;
    db.query(sql,(err, data)=>{
      console.log("Step 3");
        if(err) console.log("Unkown ERROr 2"+err);
        return res.json(data);
    })


  }
});

app.get('/api/GetInvestorsProfile', authenticateJWT, (req, res) => {
  const userID = req.user.userID;
  const UserType = req.user.userType

  console.log("Step \n1) UserID: "+ userID+ "\n2) UserType: "+UserType+"\n")

  if(UserType == "Investor" || UserType == "Investors"){
    console.log("Step I 2");
    const sql = `select * from investors where UserID = ${userID}`;
    db.query(sql,(err, data)=>{
      console.log("Step I 3");
        if(err) console.log("Unkown ERROr 2"+err);
        return res.json(data);
    })


  }
});

app.post('/api/GetServiceProviderProfileByID', authenticateJWT, (req, res) => {
  console.log("/api/GetServiceProviderProfileByID")
  const userID = req.user.userID;
  const UserType = req.user.userType;
  const {ServiceProviderID} = req.body;
  console.log("Service ID: " + ServiceProviderID)
    const sql = `select * from serviceproviders where ServiceProviderID = ?`;
    db.query(sql,[ServiceProviderID],(err, data)=>{
      // console.log("Step 3");
        if(err) console.log("Unkown ERROr 2"+err);
        if(data.length>0){console.log("UserID: " + userID+" visited ServiceID: "+ ServiceProviderID)}
        else console.log("Retrived Data Length : " + data.length);
        return res.json(data);
    })


});

app.get('/api', (req,res) => {
    res.json({"users":["BackEnd 01","Backend 02","Backend 03"]})
})

app.get('/api/startups', (req,res) => {
    // const sql = "select * from startups";
    // db.query(sql,(err, data)=>{
    //     if(err) console.log(err);
    //     return res.json(data);
    // })
    //res.json({"users":["user1","user2","user3"]})
})

app.get('/api/redirect', (req, res) => {
  const userId = 1000000; // Sample data
  const token = 'sample_token'; // Maybe an auth token
  // Redirect to the frontend with URL params
  res.redirect(`http://localhost:5173/NewStartupForm?userId=${userId}&token=${token}`);
});

app.get('/api/submit-form', (req, res) => {
  // const data = {
  //   id: 123, // Some example data
  //   message: 'Form submitted successfully!'
  // };

  // // Redirect to the React frontend with data as query params
  // const queryString = `?id=${data.id}&message=${encodeURIComponent(data.message)}`;
  // res.redirect(`http://localhost:5173/NewStartupForm${queryString}`);  // Assuming React runs on port 3000
  const VToken = 123;
  const data = {
    token: VToken, // Some example data
  };

  // Redirect to the React frontend with data as query params
  const queryString = `?token=${data.token}`;
  res.redirect(`http://localhost:5173/NewStartupForm${queryString}`);  

});

// Routes
app.use('/api/auth', authRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// app.listen(5000, () => { console.log('Server started on port 5000') })