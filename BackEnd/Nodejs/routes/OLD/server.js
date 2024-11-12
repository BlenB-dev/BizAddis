const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');

const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

dotenv.config();

const app  = express();
app.use(cors());
app.use(express.json());

const fs = require("fs");
const bcrypt = require('bcryptjs');


// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',    
//     password:'',
//     database: 'biz-connect'
// })

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

fs.readFile('./Temp/InvestorProfile.json', 'utf-8', (err, data) => {
  if (err) {console.log("Error: " + error); return}
  const jsonData = JSON.parse(data);
  //console.log(jsonData[0]);
  // console.log(Object.keys(jsonData[0].IndustrySector));  
  // saveToDatabase(jsonData);  // Function to save data to database
  // checkUsers();
  console.log(jsonData.length);
  // saveInvestorToDatabase(jsonData);
});

function checkUsersStartup(){
  const Start = "Startup"
  const queryRegisterUsers = 'Select UserID From Users Where UserType = ?';
  db.query(queryRegisterUsers, [
    Start
  ], (err, result) => {
    if (err) console.log(err);

    const queryRegisterUsers = 'Select UserID, username From Users Where UserType = ?';
    db.query(queryRegisterUsers, [
      Start
    ], (err, result) => {
      if (err) console.log(err);
      result.forEach( (startup) => {
        console.log(startup);
        const queryRegisterUsers = 'Select * From startups Where UserID = ?';
        db.query(queryRegisterUsers, [
          startup.UserID
        ], (err, result) => {
          if(err) console.log(err);
          else{
            if(result.length<1)console.log("Unused User: "+startup.username);

          }
    
        });

      });    
  
      
    });
  


  });

}

async function saveServiceProviderToDatabase(data) {
  const hashedPassword = await bcrypt.hash("password", 10);
  const isActive = true;
  const UserType = "Service Provider"
  let count = 1;

  data.forEach( (serviceproviders) => {
    console.log("Count: "+count);
    count++;

    const queryRegisterUsers = 'INSERT INTO Users (username, email, password, userType, is_active) VALUES (?, ?, ?, ?, ?)';
    db.query(queryRegisterUsers, [
      serviceproviders.UserName, 
      serviceproviders.UserEmail, 
      hashedPassword, 
      UserType,
      isActive
    ], (err, result) => {
      if (err) console.log(err);

      const getNewUserID = 'Select UserID FROM users WHERE email = ?';
      db.query(getNewUserID, [serviceproviders.UserEmail], (err, result) => {
        if (err){console.log('Database Error Create ServiceProvider Profile 4\n' + JSON.stringify(err));}

        const userID = result[0].UserID;

        const addToServiceProviders = 'INSERT INTO `serviceproviders` ( `UserID`, `ServiceProviderName`, `TypeOfService`, `ServiceDescription`,  `SubCity`,  `ExperienceInIndustry`, `SpecificSectors`, `PricingStructure`, `TeamSize`, `PackageName`, `PackageDetails`, `AccrediationName`, `AccrediationDetails`,  `ReferancesName`, `ReferancesDetails`, `SignupDate`, `Phone1`, `Phone2`, `BusinessLocation`, `Email`) Values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), ?, ?, ? ,?);';
        db.query(addToServiceProviders, [userID, serviceproviders.ServiceProviderName, JSON.stringify(serviceproviders.TypeOfService), serviceproviders.ServiceDescription, serviceproviders.SubCity,  serviceproviders.ExperienceInIndustry,JSON.stringify(serviceproviders.SpecificSectors), serviceproviders.PricingStructure, serviceproviders.TeamSize, JSON.stringify(serviceproviders.PackageName), JSON.stringify(serviceproviders.PackageDetails), JSON.stringify(serviceproviders.AccrediationName), JSON.stringify(serviceproviders.AccrediationDetails), JSON.stringify(serviceproviders.ReferancesName), JSON.stringify(serviceproviders.ReferancesDetails), serviceproviders.Phone1, serviceproviders.Phone2, serviceproviders.Address, serviceproviders.BusinessEmail], (err, result) => {

          if (err){console.log('Database Error Create ServiceProvider Profile 5\n' + JSON.stringify(err));}
          console.log('Data inserted into MySQL successfully');

        });

      });

  });
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
    

    // const queryRegisterUsers = 'INSERT INTO Users (username, email, password, userType, is_active) VALUES (?, ?, ?, ?, ?)';
    // db.query(queryRegisterUsers, [
    //   investor.UserName, 
    //   investor.UserEmail, 
    //   hashedPassword, 
    //   UserType,
    //   isActive
    // ], (err, result) => {
    //   if (err) console.log(err);

      const getNewUserID = 'Select UserID FROM users WHERE email = ?';
      db.query(getNewUserID, [investor.UserEmail], (err, result) => {
        if (err){console.log('Database Error Create INVESTOR Profile 4\n' + JSON.stringify(err));}

        const userID = result[0].UserID;
        const query = `INSERT INTO investors (UserID, InvestorName, InvestorBio, InvestorPortfolios, MinimumInvestmentAmount, MaximumInvestmentAmount, InvestmentTimeline, InvestmentApproach, RiskTolerance, FollowOnInvestmentCapacity, CoInvestmentOpportunities, MentorshipCapabilities, NetworkConnections, PriorStartupExperience, EducationalBackground, ProfessionalExperience, CommunityInvolvement, Phone1, Phone2, BusinessEmail, InvestorPreference) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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
            investor.SignupDate,
            investor.Phone1,
            investor.Phone2,
            investor.BusinessEmail,
            JSON.stringify(investor.InvestorPreferance)
        ], (err, results) => {
            if (err) {console.log("Error: " + error); return}
            console.log('Data inserted into MySQL successfully');
        });


      });


   

  // });
});

}


async function saveToDatabase(data) {
  const hashedPassword = await bcrypt.hash("password", 10);
  const isActive = true;
  const UserType = "Startup"
  let count = 1;

  data.forEach( (startup) => {
    console.log("Count: "+count);
    count++;
    

    const queryRegisterUsers = 'INSERT INTO Users (username, email, password, userType, is_active) VALUES (?, ?, ?, ?, ?)';
    db.query(queryRegisterUsers, [
      startup.UserName, 
      startup.UserEmail, 
      hashedPassword, 
      UserType,
      isActive
    ], (err, result) => {
      if (err) console.log(err);

      const getNewUserID = 'Select UserID FROM users WHERE email = ?';
      db.query(getNewUserID, [startup.UserEmail], (err, result) => {
        if (err){console.log('Database Error Create Startup Profile 4\n' + JSON.stringify(err));}

        const userID = result[0].UserID;

        const addToStartups = 'INSERT INTO `startups` ( `UserID`, `StartupName`, `FounderName`, `FounderBio`, `BusinessDescription`, `IndustrySector`, `BusinessModel`, `StageOfDevelopment`, `SubCity`, `FundingRequirement`, `CurrentFundingStatus`, `UseOfFunds`, `RevenueModel`, `CurrentRevenue`, `MarketSizeAndPotential`, `CompetitiveAdvantage`, `CustomerBase`, `FinancialProjection`, `TeamSize`, `LegalStructure`, `SocialImactGoals`, `KeyTeamMembers`, `Advisors`, `Partners`, `PickDeckURL`, `StartupEmail`, `Phone1`, `Phone2`, `SignupDate`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP());';
        db.query(addToStartups, [userID, startup.StartupName, JSON.stringify(startup.FounderName), JSON.stringify(startup.FounderBio), startup.BusinessDescription, Object.keys(startup.IndustrySector), startup.BusinessModel, startup.StageOfDevelopment, startup.SubCity, startup.FundingRequirement, startup.CurrentFundingStatus, startup.UseOfFunds, startup.RevenueModel, startup.CurrentRevenue, startup.MarketSizeAndPotential, startup.CompetitiveAdvantage, startup.CustomerBase, startup.FinancialProjection, startup.TeamSize, startup.LegalStructure, startup.SocialImpactGoals, JSON.stringify(startup.KeyTeamMembers), JSON.stringify(startup.Advisors), JSON.stringify(startup.Partners),"" ,startup.StartupEmail, startup.Phone1, startup.Phone2], (err, result) => {
          if (err){console.log('Database Error Create Startup Profile 5\n' + JSON.stringify(err));}
          console.log('Data inserted into MySQL successfully');

        });

      });


   

      // const query = `INSERT INTO investors (InvestorName, InvestorBio, MinimumInvestmentAmount, MaximumInvestmentAmount, InvestmentTimeline, InvestmentApproach, RiskTolerance, FollowOnInvestmentCapacity, CoInvestmentOpportunities, MentorshipCapabilities, NetworkConnections, PriorStartupExperience, EducationalBackground, ProfessionalExperience, CommunityInvolvement, SignupDate, Phone1, Phone2, BusinessEmail)
      //                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      // db.query(query, [
      //     investor.InvestorName,
      //     investor.InvestorBio,
      //     investor.MinimumInvestmentAmount,
      //     investor.MaximumInvestmentAmount,
      //     investor.InvestmentTimeline,
      //     investor.InvestmentApproach,
      //     investor.RiskTolerance,
      //     investor.FollowOnInvestmentCapacity,
      //     investor.CoInvestmentOpportunities,
      //     investor.MentorshipCapabilities,
      //     investor.NetworkConnections,
      //     investor.PriorStartupExperience,
      //     investor.EducationalBackground,
      //     investor.ProfessionalExperience,
      //     investor.CommunityInvolvement,
      //     investor.SignupDate,
      //     investor.Phone1,
      //     investor.Phone2,
      //     investor.BusinessEmail
      // ], (err, results) => {
      //     if (err) {console.log("Error: " + error); return}
      //     console.log('Data inserted into MySQL successfully');
      // });
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

app.get('/api/GetStartupProfile', authenticateJWT, (req, res) => {
  const userID = req.user.userID;
  const UserType = req.user.userType

  console.log("\n1) UserID: "+ userID+ "\n2) UserType: "+UserType+"\n")

  if(UserType == "Startup"){
    const sql = `select * from startups where UserID = ${userID}`;
    db.query(sql,(err, data)=>{
        if(err) console.log("Unkown ERROr 2"+err);
        console.log(data)
        //return res.json(data);
    })


  }
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