const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const axios = require('axios');

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

const GetServiceProviderRecommendationsForStartups = async(StartupUserID)=>{
  try{
    let Recommended = [];
    const queryGetAllServiceProviders = 'SELECT ServiceProviderID FROM ServiceProviders ';
    const [allServiceProviders] = await db.promise().query(queryGetAllServiceProviders);

    if (allServiceProviders.length === 0) {
      console.log("No Service Providers");
      return [];
    }
    const ServiceProviders = allServiceProviders.map(item => item.ServiceProviderID);

    const query = 'SELECT StartupID FROM Startups WHERE UserID = ?';
    const [startupResult] = await db.promise().query(query, [StartupUserID]);
    if (startupResult.length === 0) {
      console.log("No Such Startup Error");
      return;
    }

    const StartupID = startupResult[0].StartupID;
    
    const queryStartupVisitHistory = 'SELECT ServiceProviderID FROM StartupVisitHistory WHERE StartupID = ?';
    const [startupVisitHistoryResult] = await db.promise().query(queryStartupVisitHistory, [StartupID]);
    if (startupVisitHistoryResult.length === 0) {
      console.log("Empty Startup History");
      for(let i=0; i<ServiceProviders.length && Recommended.length<25; i++){
        if(!Recommended.includes(ServiceProviders[i])) Recommended.push(ServiceProviders[i]);
      }
      return Recommended;
    }
    startupVisitHistory = startupVisitHistoryResult.map(item => item.ServiceProviderID);

    const querySimilarSearchStartups = `
    SELECT StartupID
    FROM StartupVisitHistory
    WHERE ServiceProviderID IN (?)
    AND StartupID != ?
    `;
    const [similarSearchStartupsResults] = await db.promise().query(querySimilarSearchStartups, [startupVisitHistory,StartupID]);
    if (similarSearchStartupsResults.length === 0) {
      console.log("No Similar Search Startups");
      for(let i=0; i<ServiceProviders.length && Recommended.length<25; i++){
        if(!Recommended.includes(ServiceProviders[i])) Recommended.push(ServiceProviders[i]);
      }
      return Recommended;
    }
    similarSearchStartups = similarSearchStartupsResults.map(item => item.StartupID);

    const querySimilarSearchServiceProvider = `
      SELECT ServiceProviderID, COUNT(*) AS occurrence_count
      FROM StartupVisitHistory
      WHERE StartupID IN (?)
      AND StartupID != ?
      GROUP BY column_name
      ORDER BY occurrence_count DESC;
      `
      
      const [similarSearchServiceProviderResults] = await db.promise().query(querySimilarSearchServiceProvider, [similarSearchStartups,StartupID]);
      if (similarSearchServiceProviderResults.length === 0) {
        console.log("No Similar Search ServiceProviders");
        for(let i=0; i<ServiceProviders.length && Recommended.length<25; i++){
          if(!Recommended.includes(ServiceProviders[i]) && !startupVisitHistory.includes(ServiceProviders[i])) Recommended.push(ServiceProviders[i]);
        }
        return Recommended;
      }
      similarSearchServiceProvider = similarSearchServiceProviderResults.map(item => item.ServiceProviderID);
      for(let i=0; i<similarSearchServiceProvider.length && Recommended.length<25; i++){
        if(!Recommended.includes(similarSearchServiceProvider[i]) && !startupVisitHistory.includes(ServiceProviders[i])) Recommended.push(similarSearchServiceProvider[i]);
      }

      for(let i=0; i<ServiceProviders.length && Recommended.length<25; i++){
        if(!Recommended.includes(ServiceProviders[i]) && !startupVisitHistory.includes(ServiceProviders[i])) Recommended.push(ServiceProviders[i]);
      }
      return Recommended;

    
  




  }catch(error){
    console.log("Error: ",error)
  }
}

const GetStartupRecommendationForInvestors = async (InvestorUserID) => {
  try {
    const query = 'SELECT InvestorID FROM Investors WHERE UserID = ?';
    const [investorResult] = await db.promise().query(query, [InvestorUserID]);

    if (investorResult.length === 0) {
      console.log("No Such Investor Error");
      return;
    }

    const InvestorID = investorResult[0].InvestorID;
    console.log("InvestorID: " + InvestorID);

    const preferencesQuery = "SELECT InvestorPreference FROM Investors WHERE InvestorID = ?";
    const [preferencesResult] = await db.promise().query(preferencesQuery, [InvestorID]);

    if (preferencesResult.length === 0) {
      console.log("No Investor Preferences");
      return;
    }

    const InvestorPreferences = preferencesResult[0].InvestorPreference;

    const startupsQuery = `
      SELECT StartupID, StageOfDevelopment, IndustrySector, FundingRequirement, CurrentFundingStatus, BusinessModel, 
      RevenueModel, SubCity, CompetitiveAdvantage, SocialImactGoals
      FROM Startups
      WHERE StartupID NOT IN (
        SELECT StartupID
        FROM investorstartupconnection
        WHERE InvestorID = ?
      );
    `;
    const [startupsResult] = await db.promise().query(startupsQuery, [InvestorID]);

    if (startupsResult.length === 0) {
      console.log("No Such Startups");
      return;
    }

    const UnConnectedStartups = startupsResult;

    const connectionStatsQuery = `
      SELECT 
        COUNT(CASE WHEN ConnectType = 'Connect' AND ConnectReply = 'Accept' THEN 1 END) AS AcceptCount,
        COUNT(CASE WHEN ConnectType = 'Connect' AND ConnectReply = 'Decline' THEN 1 END) AS DeclineCount,
        COUNT(CASE WHEN ConnectType = 'Connect' AND ConnectReply = 'Unanswered' THEN 1 END) AS UnansweredCount,
        COUNT(CASE WHEN ConnectType = 'Ignore' THEN 1 END) AS IgnoreCount
      FROM investorstartupconnection
      WHERE InvestorID = ?;
    `;
    const [connectionStatsResult] = await db.promise().query(connectionStatsQuery, [InvestorID]);

    const AcceptCount = connectionStatsResult[0].AcceptCount;
    const DeclineCount = connectionStatsResult[0].DeclineCount;
    const UnansweredCount = connectionStatsResult[0].UnansweredCount;
    const IgnoreCount = connectionStatsResult[0].IgnoreCount;
    const TotalConnected = AcceptCount + DeclineCount + UnansweredCount;

    const similarities = UnConnectedStartups.map(startup => {
      const startupFeatures = [parseInt(startup.StageOfDevelopment), parseInt(startup.IndustrySector), parseInt(startup.FundingRequirement), parseInt(startup.CurrentFundingStatus), parseInt(startup.BusinessModel), parseInt(startup.RevenueModel), parseInt(startup.SubCity), parseInt(startup.CompetitiveAdvantage), parseInt(startup.SocialImactGoals) ]
      const similarityScore = cosineSimilarity(startupFeatures, JSON.parse(InvestorPreferences));
      // console.log("StartupID: " + startup.StartupID+" Similarity Score: " +similarityScore )
      return { startup, similarityScore };
  });
        
    similarities.sort((a, b) => b.similarityScore - a.similarityScore);    
    similarityScoredIDs = similarities.map(item => item.startup.StartupID);


    // top25SimilarStartups.map(item => { console.log(item.startup.StartupID, item.similarityScore)})


    if (TotalConnected === 0 || IgnoreCount === 0) {
      const top25SimilarStartups = similarities.slice(0, 25);
      const top25StartupIDs = top25SimilarStartups.map(item => item.startup.StartupID);
      return (top25StartupIDs);
  

    } else {
        console.log("Going To Use K-Means");

        const connectedStartupsQuery = `
        SELECT StartupID, StageOfDevelopment, IndustrySector, FundingRequirement, CurrentFundingStatus, BusinessModel, 
        RevenueModel, SubCity, CompetitiveAdvantage, SocialImactGoals
        FROM Startups
        WHERE StartupID IN (
          SELECT StartupID
          FROM investorstartupconnection
          WHERE ConnectType = 'Connect' AND ConnectReply = 'Unanswered'
          AND InvestorID = ?
        );
      `;
      const [connectedStartupsResult] = await db.promise().query(connectedStartupsQuery, [InvestorID]);
  
      if (connectedStartupsResult.length === 0) {
        console.log("No Connected Startups");
      }
  
      const connectedStartups = connectedStartupsResult;
      console.log("connectedStartups: ",connectedStartups.length);
  

      const acceptedStartupsQuery = `
      SELECT StartupID, StageOfDevelopment, IndustrySector, FundingRequirement, CurrentFundingStatus, BusinessModel, 
      RevenueModel, SubCity, CompetitiveAdvantage, SocialImactGoals
      FROM Startups
      WHERE StartupID IN (
        SELECT StartupID
        FROM investorstartupconnection
        WHERE ConnectType = 'Connect' AND ConnectReply = 'Accept'
        AND InvestorID = ?
      );
    `;
    const [acceptedStartupsResult] = await db.promise().query(acceptedStartupsQuery, [InvestorID]);

    if (acceptedStartupsResult.length === 0) {
      console.log("No Accepted Startups");
    }

    const accpetedStartups = acceptedStartupsResult;
    console.log("Accepted Startups: ", accpetedStartups.length);

    const declinedStartupsQuery = `
    SELECT StartupID, StageOfDevelopment, IndustrySector, FundingRequirement, CurrentFundingStatus, BusinessModel, 
    RevenueModel, SubCity, CompetitiveAdvantage, SocialImactGoals
    FROM Startups
    WHERE StartupID IN (
      SELECT StartupID
      FROM investorstartupconnection
      WHERE ConnectType = 'Connect' AND ConnectReply = 'Decline'
      AND InvestorID = ?
    );
  `;
  const [declinedStartupsResult] = await db.promise().query(declinedStartupsQuery, [InvestorID]);

  if (acceptedStartupsResult.length === 0) {
    console.log("No Declined Startups");
  }

  const declinedStartups = declinedStartupsResult;
  console.log("DeclinedStartups: ",declinedStartups.length);


  const ignoredStartupsQuery = `
  SELECT StartupID, StageOfDevelopment, IndustrySector, FundingRequirement, CurrentFundingStatus, BusinessModel, 
  RevenueModel, SubCity, CompetitiveAdvantage, SocialImactGoals
  FROM Startups
  WHERE StartupID IN (
    SELECT StartupID
    FROM investorstartupconnection
    WHERE ConnectType = 'Ignore'
    AND InvestorID = ?
  );
`;
const [ignoredStartupsResult] = await db.promise().query(ignoredStartupsQuery, [InvestorID]);

if (ignoredStartupsResult.length === 0) {
  console.log("No Ignored Startups");
}

const ignoredStartups = ignoredStartupsResult;
console.log("Ignored Startups: ",ignoredStartups.length);

const listConnected = [connectedStartups.length,accpetedStartups.length,declinedStartups.length,ignoredStartups.length]

const LeastConnected = Math.min(...listConnected.filter(num => num !== 0));
const KMeans = (LeastConnected<25) ? LeastConnected : 25;

const combinedArrays = [accpetedStartups,connectedStartups, declinedStartups, ignoredStartups];
const InterActedStartups = combinedArrays.flat().map(item => [parseInt(item.StageOfDevelopment), parseInt(item.IndustrySector), parseInt(item.FundingRequirement), parseInt(item.CurrentFundingStatus), parseInt(item.BusinessModel), parseInt(item.RevenueModel), parseInt(item.SubCity), parseInt(item.CompetitiveAdvantage), parseInt(item.SocialImactGoals)] );
const startupsWithSource = combinedArrays.flatMap((array, index) => [
    array.map(item => ({
        id: item.StartupID,
        source: index // Track which array the item came from
    }))]
);
const InterActedStartupsSource = startupsWithSource.flat().map(item => parseInt(item.source) );
const UninterActedStartups = UnConnectedStartups.flat().map(item => ({
  id: item.StartupID,
  coords: [
    parseInt(item.StageOfDevelopment),
    parseInt(item.IndustrySector),
    parseInt(item.FundingRequirement),
    parseInt(item.CurrentFundingStatus),
    parseInt(item.BusinessModel),
    parseInt(item.RevenueModel),
    parseInt(item.SubCity),
    parseInt(item.CompetitiveAdvantage),
    parseInt(item.SocialImactGoals)
  ]
}));

const dataToSend = {
  "X": InterActedStartups,
  "Y": InterActedStartupsSource,
  "new_points": UninterActedStartups,
  "k": KMeans,
      
}


const response = await axios.post('http://localhost:8080/api/classify', dataToSend);
//console.log(response.data.length, UninterActedStartups.length);

const ClassifedStartups = response.data.flat().map(item => [item.id, item.predicted_cluster] );
ClassifedStartups.sort((a, b) => a[1] - b[1] ); 
//console.log(ClassifedStartups);

let Recommendation = []
for (let i = 0; i < ClassifedStartups.length; i++){
  if(ClassifedStartups[i][1] != 3) Recommendation.push(ClassifedStartups[i][0])
//    else{console.log( ClassifedStartups[i])}
} 
console.log(Recommendation.length);
if(Recommendation.length<25){
  for(let i = 0; Recommendation.length <25 && i<similarityScoredIDs.length; i++){
    if(!Recommendation.includes(similarityScoredIDs[i])) Recommendation.push(similarityScoredIDs[i])

  }
}

return (Recommendation);





    }

  } catch (err) {
    console.log("Error: " + JSON.stringify(err));
    return [];
  }
};


const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, value, index) => sum + value * vecB[index], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, value) => sum + value ** 2, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, value) => sum + value ** 2, 0));
  return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
};



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
        if(data.length>0){
          
          const query2 = `
                INSERT INTO StartupVisitHistory (StartupID, ServiceProviderID, VisitDate)
                VALUES (
                    (SELECT StartupID FROM Startups WHERE UserID = ?),
                    ?,
                    NOW()
                );
            `;
            db.query(query2,[userID, ServiceProviderID],(err, data)=>{
              if(err) console.log("Error Logging Vist"+err);
              else console.log("UserID: " + userID+" visited ServiceID: "+ ServiceProviderID);


            });


        }
        else console.log("Retrived Data Length : " + data.length);
        return res.json(data);
    })


});




app.post('/api/GetInvestorProfileByID', authenticateJWT, (req, res) => {
  console.log("/api/GetInvestorProfileByID")
  const userID = req.user.userID;
  const UserType = req.user.userType;
  const {InvestorID} = req.body;
  console.log("Investor ID: " + InvestorID)
    const sql = `select * from investors where InvestorID = ?`;
    db.query(sql,[InvestorID],(err, data)=>{
      // console.log("Step 3");
        if(err) console.log("Unkown ERROr 2"+err);
        if(data.length>0){console.log("UserID: " + userID+" visited InvestorID: "+ InvestorID)}
        else console.log("Retrived Data Length : " + data.length);
        return res.json(data);
    })


});




app.post('/api/GetStartupProfileByID', authenticateJWT, (req, res) => {
  console.log("/api/GetStartupProfileByID")
  const userID = req.user.userID;
  const UserType = req.user.userType;
  const {StartupID} = req.body;
  console.log("Startup ID: " + StartupID)
    const sql = `select * from startups where StartupID = ?`;
    db.query(sql,[StartupID],(err, data)=>{
      // console.log("Step 3");
        if(err) console.log("Unkown ERROr 2"+err);
        if(data.length>0){
          
          const query2 = `
                  INSERT INTO InvestorVisitHistory (InvestorID, StartupID, VisitDate)
                  VALUES (
                      (SELECT InvestorID FROM Investors WHERE UserID = ?),
                      ?,
                      NOW()
                  );
              `;
              db.query(query2,[userID, StartupID],(err, data)=>{
                if(err) console.log("Error Logging Vist"+err);
                else console.log("UserID: " + userID+" visited StartupID: "+ StartupID);


              });


        }
        else console.log("Retrived Data Length : " + data.length);
        return res.json(data);
    })


});


app.post('/api/GetFilteredStartupProfiles', authenticateJWT, (req, res) => {
  console.log("/api/GetFilteredStartupProfiles")
  const userID = req.user.userID;
  const UserType = req.user.userType;
  const {StartupName, InSoD, InIS, InFR, InSC} = req.body;
  let ParseInSoD = (InSoD === undefined || InSoD === null) ? ' ' : JSON.parse(InSoD);
  let ParseInIS = (InIS === undefined || InIS === null) ? ' ' : JSON.parse(InIS);
  let ParseInFR = (InFR === undefined || InFR === null) ? ' ' : JSON.parse(InFR);
  let ParseInSC = (InSC === undefined || InSC === null) ? ' ' : JSON.parse(InSC);
    // console.log("Startup ID: " + StartupID)
    ParseInSoD = (ParseInSoD.length<1 ) ? ' ' : (ParseInSoD);
    ParseInIS = (ParseInIS.length<1 ) ? ' ' : (ParseInIS);
    ParseInFR = (ParseInFR.length<1 ) ? ' ' : (ParseInFR);
    ParseInSC = (ParseInSC.length<1 ) ? ' ' : (ParseInSC);
      // ParseInIS = 14;
      console.log("Startup: "+StartupName);
    console.log({
      ParseInSoD,
      ParseInIS,
      ParseInSC,
      ParseInFR,
  });
  

  const query = `
  SELECT s.* FROM startups s
  WHERE 1=1
      AND ((? IS NULL OR ? = '') OR s.StartupName LIKE ?)
      AND (s.StageOfDevelopment IN (?))
      AND (s.IndustrySector IN (?))
      AND (s.FundingRequirement IN (?))
      AND (s.SubCity IN (?) )
      AND NOT EXISTS (
        SELECT 1
        FROM InvestorStartupConnection isc
        WHERE isc.StartupID = s.StartupID 
        AND isc.InvestorID = (
            SELECT InvestorID
            FROM Investors
            WHERE UserID = ? 
        )
      );

`;

const parm = [StartupName, StartupName, `%${StartupName || ''}%`, ParseInSoD, ParseInIS, ParseInFR, ParseInSC, userID]

// const sql = `select * from startups`;
    db.query(query,parm,(err, data)=>{
        if(err) console.log("Unkown ERROr 2"+err);
        // if(data.length>0){console.log("UserID: " + userID+" visited StartupID: "+ StartupID)}
        // else 
        console.log("Retrived Data Length : " + data.length);
        return res.json(data);
    })


});


app.get('/api/GetDeclinedStartups', authenticateJWT, (req, res) => {
  console.log("/api/GetDeclinedStartups")
  const userID = req.user.userID;
  const UserType = req.user.userType;


const sql = `select * from startups`;
const query = `
SELECT s.*
FROM Startups s
JOIN InvestorStartupConnection isc ON s.StartupID = isc.StartupID
JOIN Investors i ON isc.InvestorID = i.InvestorID
JOIN Users u ON i.UserID = u.UserID
WHERE u.UserID = ?
AND isc.ConnectType = 'Connect'
AND isc.ConnectReply = 'Decline';
`;

    db.query(query,[userID],(err, data)=>{
        if(err) console.log("Unkown ERROr 2"+err);
        // if(data.length>0){console.log("UserID: " + userID+" visited StartupID: "+ StartupID)}
        // else 
        console.log("Retrived Data Length : " + data.length);
        return res.json(data);
    })


});


app.get('/api/GetAcceptedStartups', authenticateJWT, (req, res) => {
  console.log("/api/GetAcceptedStartups")
  const userID = req.user.userID;
  const UserType = req.user.userType;


const sql = `select * from startups`;
const query = `
SELECT s.*
FROM Startups s
JOIN InvestorStartupConnection isc ON s.StartupID = isc.StartupID
JOIN Investors i ON isc.InvestorID = i.InvestorID
JOIN Users u ON i.UserID = u.UserID
WHERE u.UserID = ?
AND isc.ConnectType = 'Connect'
AND isc.ConnectReply = 'Accept';
`;

    db.query(query,[userID],(err, data)=>{
        if(err) console.log("Unkown ERROr 2"+err);
        // if(data.length>0){console.log("UserID: " + userID+" visited StartupID: "+ StartupID)}
        // else 
        console.log("Retrived Data Length : " + data.length);
        return res.json(data);
    })


});


app.get('/api/GetIgnoredStartups', authenticateJWT, (req, res) => {
  console.log("/api/GetIgnoredStartups")
  const userID = req.user.userID;
  const UserType = req.user.userType;


const sql = `select * from startups`;
const query = `
SELECT s.*
FROM Startups s
JOIN InvestorStartupConnection isc ON s.StartupID = isc.StartupID
JOIN Investors i ON isc.InvestorID = i.InvestorID
JOIN Users u ON i.UserID = u.UserID
WHERE u.UserID = ?
AND isc.ConnectType = 'Ignore';
`;

    db.query(query,[userID],(err, data)=>{
        if(err) console.log("Unkown ERROr 2"+err);
        // if(data.length>0){console.log("UserID: " + userID+" visited StartupID: "+ StartupID)}
        // else 
        console.log("Retrived Data Length : " + data.length);
        return res.json(data);
    })


});


app.get('/api/GetConnectedStartups', authenticateJWT, (req, res) => {
  console.log("/api/GetConnectedStartups")
  const userID = req.user.userID;
  const UserType = req.user.userType;

  const query = `
  SELECT s.*
  FROM Startups s
  JOIN InvestorStartupConnection isc ON s.StartupID = isc.StartupID
  JOIN Investors i ON isc.InvestorID = i.InvestorID
  JOIN Users u ON i.UserID = u.UserID
  WHERE u.UserID = ?
  AND isc.ConnectType = 'Connect'
  AND isc.ConnectReply = 'Unanswered';
  `;
  
      db.query(query,[userID],(err, data)=>{
        if(err) console.log("Unkown ERROr 2"+err);
        // if(data.length>0){console.log("UserID: " + userID+" visited StartupID: "+ StartupID)}
        // else 
        console.log("Retrived Data Length : " + data.length);
        return res.json(data);
    })


});


app.get('/api/GetRecommendedStartups', authenticateJWT, async (req, res) => {
  console.log("/api/GetRecommendedStartups")
  const userID = req.user.userID;
  const UserType = req.user.userType;
  try{
    const RecommendedStartups = await GetStartupRecommendationForInvestors(userID);
    console.log("Amount of Recommended Startups: " + RecommendedStartups.length);

  const query = `
  SELECT *
  FROM Startups
  WHERE StartupID IN (?)
  `;
  
      db.query(query,[RecommendedStartups],(err, data)=>{
        if(err) console.log("Unkown ERROr 2"+err);
        // if(data.length>0){console.log("UserID: " + userID+" visited StartupID: "+ StartupID)}
        // else 
        console.log("Retrived Data Length : " + data.length);
        return res.json(data);
    })
  }catch(err){
    console.log("Error: " + err);
  }

});


app.get('/api/GetRecommendedServiceProviders', authenticateJWT, async (req, res) => {
  console.log("/api/GetRecommendedServiceProviders")
  const userID = req.user.userID;
  const UserType = req.user.userType;
  try{
    const RecommendedServiceProviders = await GetServiceProviderRecommendationsForStartups(userID);
    console.log("Amount of Recommended Service: " + RecommendedServiceProviders.length);

  const query = `
  SELECT *
  FROM ServiceProviders
  WHERE ServiceProviderID IN (?)
  `;
  
      db.query(query,[RecommendedServiceProviders],(err, data)=>{
        if(err) console.log("Unkown ERROr 2"+err);
        console.log("Retrived Data Length : " + data.length);
        return res.json(data);
    })
  }catch(err){
    console.log("Error: " + err);
  }

});




app.get('/api/GetAcceptedInvestors', authenticateJWT, (req, res) => {
  console.log("/api/GetAcceptedInvestors")
  const userID = req.user.userID;
  const UserType = req.user.userType;

  const query = `
  SELECT i.*
  FROM Investors i
  JOIN InvestorStartupConnection isc ON i.InvestorID = isc.InvestorID
  JOIN Startups s ON isc.StartupID = s.StartupID
  JOIN Users u ON s.UserID = u.UserID
  WHERE s.UserID = ?
  AND isc.ConnectType = 'Connect'
  AND isc.ConnectReply = 'Accept';
`;






    db.query(query,[userID],(err, data)=>{
        if(err) console.log("Unkown ERROr 2"+err);
        // if(data.length>0){console.log("UserID: " + userID+" visited StartupID: "+ StartupID)}
        // else 
        console.log("Retrived Data Length : " + data.length);
        return res.json(data);
    })


});


app.get('/api/GetConnectedInvestors', authenticateJWT, (req, res) => {
  console.log("/api/GetConnectedInvestors")
  const userID = req.user.userID;
  const UserType = req.user.userType;


  const query = `
  SELECT i.*
  FROM Investors i
  JOIN InvestorStartupConnection isc ON i.InvestorID = isc.InvestorID
  JOIN Startups s ON isc.StartupID = s.StartupID
  JOIN Users u ON s.UserID = u.UserID
  WHERE s.UserID = ?
  AND isc.ConnectType = 'Connect'
  AND isc.ConnectReply = 'Unanswered';
`;

    db.query(query,[userID],(err, data)=>{
        if(err) console.log("Unkown ERROr 2"+err);
        // if(data.length>0){console.log("UserID: " + userID+" visited StartupID: "+ StartupID)}
        // else 
        console.log("Retrived Data Length : " + data.length);
        return res.json(data);
    })


});


app.get('/api/GetDeclinedInvestors', authenticateJWT, (req, res) => {
  console.log("/api/GetDeclinedInvestors")
  const userID = req.user.userID;
  const UserType = req.user.userType;


  const query = `
  SELECT i.*
  FROM Investors i
  JOIN InvestorStartupConnection isc ON i.InvestorID = isc.InvestorID
  JOIN Startups s ON isc.StartupID = s.StartupID
  JOIN Users u ON s.UserID = u.UserID
  WHERE s.UserID = ?
  AND isc.ConnectType = 'Connect'
  AND isc.ConnectReply = 'Decline';
`;
    db.query(query,[userID],(err, data)=>{
        if(err) console.log("Unkown ERROr 2"+err);
        // if(data.length>0){console.log("UserID: " + userID+" visited StartupID: "+ StartupID)}
        // else 
        console.log("Retrived Data Length : " + data.length);
        return res.json(data);
    })

});


app.post('/api/GetConnectionStatusForInvestorByStartupID', authenticateJWT, (req, res) => {
  console.log("/api/GetConnectionStatusForInvestorByStartupID")
  const userID = req.user.userID;
  const UserType = req.user.userType;
  const {StartupID} = req.body;
  // console.log("StartupID : " + StartupID+"\n UserType : " + UserType);
  if(UserType != "Investor"){return res.status(403).json("Invalid User Type")}
  const query = `
    SELECT isc.*
    FROM InvestorStartupConnection isc
    JOIN Investors i ON isc.InvestorID = i.InvestorID
    JOIN Users u ON i.UserID = u.UserID
    WHERE u.UserID = ? AND isc.StartupID = ?;
  `;

  // Execute the query with the provided UserID and StartupID
  db.query(query, [userID, StartupID], (error, results) => {
    if (error) {
       console.log("Unkown ERROR 2"+err); // Handle error
       return res.status(500);
    }else{
      // console.log("Retrived Amount"+results.length);
      return res.json(results); // Return results if no error

    }
  });

});


app.post('/api/InvestorConnectToStartup', authenticateJWT, (req, res) => {
  console.log("/api/InvestorConnectToStartup")
  const userID = req.user.userID;
  const UserType = req.user.userType;
  const {StartupID} = req.body;
  // console.log("StartupID : " + StartupID+"\n UserType : " + UserType);
  if(UserType != "Investor"){return res.status(403).json("Invalid User Type")}
// Values to check and insert
const connectType = 'Connect'; // Example connect type
const connectReply = 'Unanswered'; // Example connect reply

// SQL Query
const query = `
  INSERT INTO InvestorStartupConnection (InvestorID, StartupID, ConnectType, ConnectReply, ConnectionReplyDate)
  SELECT i.InvestorID, ? AS StartupID, ? AS ConnectType, ? AS ConnectReply, NOW() AS ConnectionReplyDate
  FROM Investors i
  JOIN Users u ON i.UserID = u.UserID
  WHERE u.UserID = ?
  AND NOT EXISTS (
    SELECT 1
    FROM InvestorStartupConnection isc
    WHERE isc.InvestorID = i.InvestorID AND isc.StartupID = ?
  );
`;

// Execute the query
db.query(query, [StartupID, connectType, connectReply, userID, StartupID], (error, results) => {
  if (error) {
    console.error('Error executing query:', error);
    return res.status(500);
  } else if (results.affectedRows > 0) {
    console.log('Insert successful:', results);
    return res.status(200).json({message : "Successful Insert"});
  } else {
    console.log('Record already exists. No insert made.');
    return res.status(200).json({message : "Record already exists. No insert made"});
  }
});


});

app.post('/api/InvestorIgnoreStartup', authenticateJWT, (req, res) => {
  console.log("/api/InvestorIgnoreStartup")
  const userID = req.user.userID;
  const UserType = req.user.userType;
  const {StartupID} = req.body;
  // console.log("StartupID : " + StartupID+"\n UserType : " + UserType);
  if(UserType != "Investor"){return res.status(403).json("Invalid User Type")}
// Values to check and insert
const connectType = 'Ignore'; // Example connect type
const connectReply = ''; // Example connect reply

// SQL Query
const query = `
  INSERT INTO InvestorStartupConnection (InvestorID, StartupID, ConnectType, ConnectReply, ConnectionReplyDate)
  SELECT i.InvestorID, ? AS StartupID, ? AS ConnectType, ? AS ConnectReply, NOW() AS ConnectionReplyDate
  FROM Investors i
  JOIN Users u ON i.UserID = u.UserID
  WHERE u.UserID = ?
  AND NOT EXISTS (
    SELECT 1
    FROM InvestorStartupConnection isc
    WHERE isc.InvestorID = i.InvestorID AND isc.StartupID = ?
  );
`;

// Execute the query
db.query(query, [StartupID, connectType, connectReply, userID, StartupID], (error, results) => {
  if (error) {
    console.error('Error executing query:', error);
    return res.status(500).json("Error adding to database");
  } else if (results.affectedRows > 0) {
    console.log('Insert successful:', results);
    return res.status(200).json({message : "Successful Insert"});
  } else {
    console.log('Record already exists. No insert made.');
    return res.status(200).json({message : "Record already exists. No insert made"});
  }
});


});

app.post('/api/GetConnectionStatusForStartupByInvestorID', authenticateJWT, (req, res) => {
  console.log("/api/GetConnectionStatusForStartupByInvestorID")
  const userID = req.user.userID;
  const UserType = req.user.userType;
  const {InvestorID} = req.body;
  // console.log("StartupID : " + StartupID+"\n UserType : " + UserType);
  if(UserType != "Startup"){return res.status(403).json("Invalid User Type")}
  const query = `
    SELECT isc.*
    FROM InvestorStartupConnection isc
    JOIN Startups s on isc.StartupID = s.StartupID
    JOIN Users u ON s.UserID = u.UserID
    WHERE u.UserID = ? AND isc.InvestorID = ?;
  `;

  // Execute the query with the provided UserID and StartupID
  db.query(query, [userID, InvestorID], (error, results) => {
    if (error) {
       console.log("Unkown ERROR 2"+err); // Handle error
       return res.status(500);
    }else{
      // console.log("Retrived Amount"+results.length);
      return res.json(results); // Return results if no error

    }
  });

});

app.post('/api/StartupDeclineInvestorConnection', authenticateJWT, (req, res) => {
  console.log("/api/StartupDeclineInvestorConnection")
  const userID = req.user.userID;
  const UserType = req.user.userType;
  const {InvestorID} = req.body;
  // console.log("StartupID : " + StartupID+"\n UserType : " + UserType);
  if(UserType != "Startup"){return res.status(403).json("Invalid User Type")}
// Values to check and insert
const connectType = 'Connect'; // Example connect type
const connectReply = 'Decline'; // Example connect reply

// SQL Query
const query = `
UPDATE InvestorStartupConnection isc
SET isc.ConnectType = ?,
 isc.ConnectReply = ?
WHERE isc.InvestorID = ?
AND isc.StartupID = (
    SELECT s.StartupID
    FROM Startups s
    JOIN Users u ON u.UserID = s.UserID
    WHERE s.UserID = ?  
);
`;

// Execute the query
db.query(query, [connectType, connectReply, InvestorID, userID], (error, results) => {
  if (error) {
    console.error('Error executing query:', error);
    return res.status(500).json("Error adding to database");
  } else if (results.affectedRows > 0) {
    console.log('Insert successful:', results);
    return res.status(200).json({message : "Successful Insert"});
  } else {
    console.log('Record already exists. No insert made.');
    return res.status(200).json({message : "Record already exists. No insert made"});
  }
});


});


app.post('/api/StartupAcceptInvestorConnection', authenticateJWT, (req, res) => {
  console.log("/api/StartupAcceptInvestorConnection")
  const userID = req.user.userID;
  const UserType = req.user.userType;
  const {InvestorID} = req.body;
  if(UserType != "Startup"){return res.status(403).json("Invalid User Type")}
// Values to check and insert
const connectType = 'Connect'; // Example connect type
const connectReply = 'Accept'; // Example connect reply

// SQL Query
const query = `
UPDATE InvestorStartupConnection isc
SET isc.ConnectType = ?,
 isc.ConnectReply = ?
WHERE isc.InvestorID = ?
AND isc.StartupID = (
    SELECT s.StartupID
    FROM Startups s
    JOIN Users u ON u.UserID = s.UserID
    WHERE s.UserID = ?  
);
`;

// Execute the query
db.query(query, [connectType, connectReply, InvestorID, userID], (error, results) => {
  if (error) {
    console.error('Error executing query:', error);
    return res.status(500).json("Error adding to database");
  } else if (results.affectedRows > 0) {
    console.log('Insert successful:', results);
    return res.status(200).json({message : "Successful Insert"});
  } else {
    console.log('Record already exists. No insert made.');
    return res.status(200).json({message : "Record already exists. No insert made"});
  }
});


});


app.get('/api/AdminGetInvestors', authenticateJWT, (req, res) => {
  console.log("/api/AdminGetInvestors")
  const userID = req.user.userID;
  const UserType = req.user.userType;
  const {StartupID} = req.body;
  // console.log("StartupID : " + StartupID+"\n UserType : " + UserType);
  // if(UserType != "Administrator"){return res.status(403).json("Invalid User Type")}
  const query = `SELECT * FROM Investors;`;

  // Execute the query with the provided UserID and StartupID
  db.query(query, (error, results) => {
    if (error) {
       console.log("Unkown ERROR 2"+err); // Handle error
       return res.status(500);
    }else{
      // console.log("Retrived Amount"+results.length);
      return res.json(results); // Return results if no error

    }
  });

});


app.post('/api/AdminDeleteInvestor', authenticateJWT,async (req, res) => {
  console.log("/api/AdminDeleteInvestor")
  const userID = req.user.userID;
  const UserType = req.user.userType;
  const {InvestorID} = req.body;

  const query = 'SELECT UserID FROM Investors WHERE InvestorID = ?';
  const [InvestorUserIDResult] = await db.promise().query(query, [InvestorID]);
  if (InvestorUserIDResult.length === 0) {
    console.log("No Such Startup Error");
    return;
  }

  const InvestorUserID = InvestorUserIDResult[0].UserID;

  const queryDelete = `DELETE FROM Users WHERE UserID =?;`;

  // Execute the query with the provided UserID and StartupID
  db.query(queryDelete,[InvestorUserID], (error, results) => {
    if (error) {
       console.log("Unkown ERROR 2"+err); // Handle error
       return res.status(500);
    }else{
      return res.status(200).json(results); // Return results if no error

    }
  });



});

app.post('/api/AdminDeleteStartup', authenticateJWT,async (req, res) => {
  console.log("/api/AdminDeleteStartup")
  const userID = req.user.userID;
  const UserType = req.user.userType;
  const {StartupID} = req.body;

  const query = 'SELECT UserID FROM Startups WHERE StartupID = ?';
  const [StartupUserIDResult] = await db.promise().query(query, [StartupID]);
  if (StartupUserIDResult.length === 0) {
    console.log("No Such Startup Error");
    return;
  }

  const StartupUserID = StartupUserIDResult[0].UserID;

  const queryDelete = `DELETE FROM Users WHERE UserID =?;`;

  // Execute the query with the provided UserID and StartupID
  db.query(queryDelete,[StartupUserID], (error, results) => {
    if (error) {
       console.log("Unkown ERROR 2"+err); // Handle error
       return res.status(500);
    }else{
      return res.status(200).json(results); // Return results if no error
    }
  });
});


app.post('/api/AdminDeleteServiceProvider', authenticateJWT,async (req, res) => {
  console.log("/api/AdminDeleteServiceProvider")
  const userID = req.user.userID;
  const UserType = req.user.userType;
  const {ServiceProviderID} = req.body;

  const query = 'SELECT UserID FROM ServiceProviders WHERE ServiceProviderID = ?';
  const [ServiceProviderUserIDResult] = await db.promise().query(query, [ServiceProviderID]);
  if (ServiceProviderUserIDResult.length === 0) {
    console.log("No Such Startup Error");
    return;
  }

  const ServiceProviderUserID = ServiceProviderUserIDResult[0].UserID;

  const queryDelete = `DELETE FROM Users WHERE UserID =?;`;

  // Execute the query with the provided UserID and StartupID
  db.query(queryDelete,[ServiceProviderUserID], (error, results) => {
    if (error) {
       console.log("Unkown ERROR 2"+err); // Handle error
       return res.status(500);
    }else{
      return res.status(200).json(results); // Return results if no error
    }
  });
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