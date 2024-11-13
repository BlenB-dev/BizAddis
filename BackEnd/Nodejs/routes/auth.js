const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { Pool } = require("pg");
const path = require("path");
const router = express.Router();
const dotenv = require("dotenv");
const multer = require("multer");
const fs = require("fs");

dotenv.config();

const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});
db.connect((err) => {
  if (err) console.error("Database connection error:", err);
  else console.log("Connected to PostgreSQL database.");
});
// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Mock user data (in production, you'd use a database)
const users = [
  { username: "user", passwordHash: bcrypt.hashSync("pass", 8) },
  { username: "user2", passwordHash: bcrypt.hashSync("pass", 8) },
];

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { username: user.username, userID: user.userID, userType: user.userType },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Routes
router.post("/login", async (req, res) => {
  const { userNameEmail, userPassword } = req.body;
  try {
    const getUserQuery =
      "SELECT userid, username, password, usertype FROM users WHERE email = $1 OR username = $2";
    const { rows } = await db.query(getUserQuery, [
      userNameEmail,
      userNameEmail,
    ]);

    if (rows.length === 0)
      return res.status(401).json({ message: "Wrong Username Or Password" });

    const user = rows[0];
    const isPasswordValid = bcrypt.compareSync(userPassword, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Wrong Username Or Password" });

    const token = generateToken(user);
    res.json({ message: user.usertype, token });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Database error" });
  }
});

router.get("/trial", (req, res) => {
  console.log("Successful Trail");
  res.json("Auth route works");
});

// Signup route
router.post("/signup", async (req, res) => {
  const { username, email, password, userType } = req.body;
  try {
    const checkUserQuery =
      "SELECT COUNT(*) FROM users WHERE username = $1 OR email = $2";
    const { rows } = await db.query(checkUserQuery, [username, email]);

    if (parseInt(rows[0].count) !== 0)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const insertUserQuery = `
      INSERT INTO applicants (username, email, password, verification_token, usertype)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await db.query(insertUserQuery, [
      username,
      email,
      hashedPassword,
      verificationToken,
      userType,
    ]);

    const confirmationUrl = `http://localhost:${process.env.PORT}/api/auth/confirm/${verificationToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Confirmation",
      html: `<h3>Hello ${username}</h3><p>Please confirm your email: <a href="${confirmationUrl}">Confirm Email</a></p>`,
    };
    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({
        message: "Signup successful! Please check your email to confirm.",
      });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Error during signup" });
  }
});

// Email confirmation route
router.get("/confirm/:token", async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;

    const getUserQuery =
      "SELECT * FROM applicants WHERE email = $1 AND verification_token = $2";
    const { rows } = await db.query(getUserQuery, [email, token]);

    if (rows.length === 0)
      return res.status(400).json({ message: "Expired or invalid token" });

    const applicant = rows[0];
    const insertUserQuery = `
      INSERT INTO users (username, email, password, usertype)
      VALUES ($1, $2, $3, $4)
    `;
    await db.query(insertUserQuery, [
      applicant.username,
      email,
      applicant.password,
      applicant.usertype,
    ]);

    const deleteApplicantQuery = "DELETE FROM applicants WHERE email = $1";
    await db.query(deleteApplicantQuery, [email]);

    res.json({ message: "Email confirmed and user registered" });
  } catch (error) {
    console.error("Confirmation error:", error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

// Ensure the uploads directory exists, and if not, create it
const pitchDeckUploadsDirectory = path.join(
  __dirname,
  "../../Storage/StartupStorage/PitchDeck"
);
if (!fs.existsSync(pitchDeckUploadsDirectory)) {
  fs.mkdirSync(pitchDeckUploadsDirectory, { recursive: true });
}

// Set up multer storage
const pitchDeckStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pitchDeckUploadsDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with extension
  },
});

const uploadPitchDeck = multer({ storage: pitchDeckStorage });

// Route to handle file and form data submission
router.post(
  "/createStartupProfile",
  uploadPitchDeck.single("file"),
  async (req, res) => {
    // console.log(req.body.token);
    const {
      token,
      startupName,
      founders,
      foundersBio,
      businessDescription,
      industrySector,
      businessModel,
      stageOfDevelopment,
      subCity,
      fundingRequirement,
      currentFundingStatus,
      useOfFunds,
      revenueModel,
      currentRevenue,
      marketSize,
      competitiveAdvantage,
      customerBase,
      financialProjections,
      teamSize,
      keyTeamMembers,
      advisors,
      legalStructure,
      existingPartnerships,
      socialImpactGoals,
      startupEmail,
      phone1,
      phone2,
    } = req.body;

    const filePath = req.file ? req.file.path : null;

    const newForm = {
      token: token,
      startupName: startupName,
      founders: founders,
      foundersBio: foundersBio,
      businessDescription: businessDescription,
      industrySector: industrySector,
      businessModel: businessModel,
      stageOfDevelopment: stageOfDevelopment,
      subCity: subCity,
      fundingRequirement: fundingRequirement,
      currentFundingStatus: currentFundingStatus,
      useOfFunds: useOfFunds,
      revenueModel: revenueModel,
      currentRevenue: currentRevenue,
      marketSize: marketSize,
      competitiveAdvantage: competitiveAdvantage,
      customerBase: customerBase,
      financialProjections: financialProjections,
      teamSize: teamSize,
      keyTeamMembers: keyTeamMembers,
      advisors: advisors,
      legalStructure: legalStructure,
      existingPartnerships: existingPartnerships,
      socialImpactGoals: socialImpactGoals,
      pitchDeckURL: filePath,
      startupEmail: startupEmail,
      phone1: phone1,
      phone2: phone2,
      pitchDeckURL: filePath,
    };

    try {
      //Verify JWT token
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          console.log("Invalid or expired token");
          return res.status(400).json({ message: "Invalid or expired token" });
        }
        const email = decoded.email;
        console.log("Email: " + email);
        console.log("Token: " + token);

        // Get User Values From Applicants Table
        const queryGetNewUserData =
          "SELECT * FROM Applicants WHERE verification_token = ? ORDER BY id ASC LIMIT 1;";
        db.query(queryGetNewUserData, [token], (err, result) => {
          if (err) {
            console.log(
              "Database Error Create Startup Profile 1\n" + JSON.stringify(err)
            );
            return res.status(500).json({ message: "Database Error" });
          }
          if (result.length == 0) {
            console.log("Empty Return form Applicants Table");
            return res
              .status(400)
              .json({ message: "Expired or invalid token" });
          } else {
            const username = result[0].username;
            const password = result[0].password;
            const userType = result[0].userType;
            const userEmail = result[0].email;

            console.log(
              "Username: " +
                username +
                "\nPassword: " +
                password +
                "UserType: " +
                userType
            );

            // Add User to the Users table
            const queryRegisterUsers =
              "INSERT INTO Users (username, email, password, userType) VALUES (?, ?, ?, ?)";
            db.query(
              queryRegisterUsers,
              [username, userEmail, password, userType],
              (err, result) => {
                if (err) {
                  console.log(
                    "Database Error Create Startup Profile 2\n" +
                      JSON.stringify(err)
                  );
                  return res.status(500).json({ message: "Database Error" });
                }

                // Remove the user from the Applicants
                const queryDeleteApplicant =
                  "DELETE FROM Applicants WHERE email = ?";
                db.query(queryDeleteApplicant, [userEmail], (err, result) => {
                  if (err) {
                    console.log(
                      "Database Error Create Startup Profile 3\n" +
                        JSON.stringify(err)
                    );
                    return res.status(500).json({ message: "Database Error" });
                  }

                  const getNewUserID =
                    "Select UserID FROM users WHERE email = ?";
                  db.query(getNewUserID, [userEmail], (err, result) => {
                    if (err) {
                      console.log(
                        "Database Error Create Startup Profile 4\n" +
                          JSON.stringify(err)
                      );
                      return res
                        .status(500)
                        .json({ message: "Database Error" });
                    }

                    const userID = result[0].UserID;

                    const addToStartups =
                      "INSERT INTO `startups` ( `UserID`, `StartupName`, `FounderName`, `FounderBio`, `BusinessDescription`, `IndustrySector`, `BusinessModel`, `StageOfDevelopment`, `SubCity`, `FundingRequirement`, `CurrentFundingStatus`, `UseOfFunds`, `RevenueModel`, `CurrentRevenue`, `MarketSizeAndPotential`, `CompetitiveAdvantage`, `CustomerBase`, `FinancialProjection`, `TeamSize`, `LegalStructure`, `SocialImactGoals`, `KeyTeamMembers`, `Advisors`, `Partners`, `PickDeckURL`, `StartupEmail`, `Phone1`, `Phone2`, `SignupDate`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP());";
                    db.query(
                      addToStartups,
                      [
                        userID,
                        startupName,
                        founders,
                        foundersBio,
                        businessDescription,
                        industrySector,
                        businessModel,
                        stageOfDevelopment,
                        subCity,
                        fundingRequirement,
                        currentFundingStatus,
                        useOfFunds,
                        revenueModel,
                        currentRevenue,
                        marketSize,
                        competitiveAdvantage,
                        customerBase,
                        financialProjections,
                        teamSize,
                        legalStructure,
                        socialImpactGoals,
                        keyTeamMembers,
                        advisors,
                        existingPartnerships,
                        filePath,
                        startupEmail,
                        phone1,
                        phone2,
                      ],
                      (err, result) => {
                        if (err) {
                          console.log(
                            "Database Error Create Startup Profile 5\n" +
                              JSON.stringify(err)
                          );
                          return res
                            .status(500)
                            .json({ message: "Database Error" });
                        }
                        res.json({
                          message: "Registered Successfully",
                          form: newForm,
                        });
                      }
                    );
                  });
                });
              }
            );
          }
        });
      });
    } catch (error) {
      console.log("Caught Error: " + error);
      res.status(500).json({ message: "Error saving form data", error });
    }
  }
);

// Route to handle file and form data submission
router.post(
  "/editStartupProfile",
  uploadPitchDeck.single("file"),
  async (req, res) => {
    // console.log(req.body.token);
    const {
      token,
      startupName,
      founders,
      foundersBio,
      businessDescription,
      industrySector,
      businessModel,
      stageOfDevelopment,
      subCity,
      fundingRequirement,
      currentFundingStatus,
      useOfFunds,
      revenueModel,
      currentRevenue,
      marketSize,
      competitiveAdvantage,
      customerBase,
      financialProjections,
      teamSize,
      keyTeamMembers,
      advisors,
      legalStructure,
      existingPartnerships,
      socialImpactGoals,
      startupEmail,
      phone1,
      phone2,
    } = req.body;

    const filePath = req.file ? req.file.path : null;
    console.log(filePath);

    const newForm = {
      token: token,
      startupName: startupName,
      founders: founders,
      foundersBio: foundersBio,
      businessDescription: businessDescription,
      industrySector: industrySector,
      businessModel: businessModel,
      stageOfDevelopment: stageOfDevelopment,
      subCity: subCity,
      fundingRequirement: fundingRequirement,
      currentFundingStatus: currentFundingStatus,
      useOfFunds: useOfFunds,
      revenueModel: revenueModel,
      currentRevenue: currentRevenue,
      marketSize: marketSize,
      competitiveAdvantage: competitiveAdvantage,
      customerBase: customerBase,
      financialProjections: financialProjections,
      teamSize: teamSize,
      keyTeamMembers: keyTeamMembers,
      advisors: advisors,
      legalStructure: legalStructure,
      existingPartnerships: existingPartnerships,
      socialImpactGoals: socialImpactGoals,
      pitchDeckURL: filePath,
      startupEmail: startupEmail,
      phone1: phone1,
      phone2: phone2,
      pitchDeckURL: filePath,
    };

    try {
      //Verify JWT token
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          console.log("Invalid or expired token");
          return res.status(400).json({ message: "Invalid or expired token" });
        }
        console.log("Decoded: " + JSON.stringify(decoded));
        const userID = decoded.userID;
        console.log("UserID: " + userID);

        const updateStartup = `
  UPDATE startups 
  SET 
    StartupName = ?, 
    FounderName = ?, 
    FounderBio = ?, 
    BusinessDescription = ?, 
    IndustrySector = ?, 
    BusinessModel = ?, 
    StageOfDevelopment = ?, 
    SubCity = ?, 
    FundingRequirement = ?, 
    CurrentFundingStatus = ?, 
    UseOfFunds = ?, 
    RevenueModel = ?, 
    CurrentRevenue = ?, 
    MarketSizeAndPotential = ?, 
    CompetitiveAdvantage = ?, 
    CustomerBase = ?, 
    FinancialProjection = ?, 
    TeamSize = ?, 
    LegalStructure = ?, 
    SocialImactGoals = ?, 
    KeyTeamMembers = ?, 
    Advisors = ?, 
    Partners = ?, 
    PickDeckURL = ?, 
    StartupEmail = ?, 
    Phone1 = ?, 
    Phone2 = ?, 
    SignupDate = CURRENT_TIMESTAMP()
  WHERE UserID = ?;
`;

        // Executing the update query with dynamic values
        db.query(
          updateStartup,
          [
            startupName,
            founders,
            foundersBio,
            businessDescription,
            industrySector,
            businessModel,
            stageOfDevelopment,
            subCity,
            fundingRequirement,
            currentFundingStatus,
            useOfFunds,
            revenueModel,
            currentRevenue,
            marketSize,
            competitiveAdvantage,
            customerBase,
            financialProjections,
            teamSize,
            legalStructure,
            socialImpactGoals,
            keyTeamMembers,
            advisors,
            existingPartnerships,
            filePath,
            startupEmail,
            phone1,
            phone2,
            userID, // userID as the condition for which startup to update
          ],
          (err, result) => {
            if (err) {
              console.log(
                "Database Error Edit Startup Profile 1\n" + JSON.stringify(err)
              );
              return res.status(500).json({ message: "Database Error" });
            }
            res.json({ message: "Updated Successfully", form: newForm });

            // if (err) {
            //   console.error('Error updating startup:', err);
            //   return;
            // }
            // console.log('Startup updated successfully');
          }
        );
      });
    } catch (error) {
      console.log("Caught Error: " + error);
      res.status(500).json({ message: "Error saving form data", error });
    }
  }
);

// Ensure the uploads directory exists, and if not, create it
const logoUploadsDirectory = path.join(
  __dirname,
  "../../Storage/ServiceProviderStorage/Logo"
);
if (!fs.existsSync(logoUploadsDirectory)) {
  fs.mkdirSync(logoUploadsDirectory, { recursive: true });
}

// Set up multer storage
const logoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, logoUploadsDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with extension
  },
});

const uploadLogo = multer({ storage: logoStorage });

router.post(
  "/createServiceProviderProfile",
  uploadLogo.single("file"),
  async (req, res) => {
    // console.log(req.body.token);
    const {
      token,
      ServiceProviderName,
      TypeOfService,
      ServiceDescription,
      SubCity,
      ExperienceInIndustry,
      SpecificSectors,
      PricingStructure,
      TeamSize,
      PackageName,
      PackageDetails,
      AccrediationName,
      AccrediationDetails,
      ReferancesName,
      ReferancesDetails,
      Phone1,
      Phone2,
      BusinessEmail,
      BusinessLocation,
    } = req.body;

    const filePath = req.file ? req.file.path : null;
    const newForm = {
      token: token,
      ServiceProviderName: ServiceProviderName,
      TypeOfService: TypeOfService,
      ServiceDescription: ServiceDescription,
      SubCity: SubCity,
      ExperienceInIndustry: ExperienceInIndustry,
      SpecificSectors: SpecificSectors,
      PricingStructure: PricingStructure,
      TeamSize: TeamSize,
      PackageName: PackageName,
      PackageDetails: PackageDetails,
      AccrediationName: AccrediationName,
      AccrediationDetails: AccrediationDetails,
      ReferancesName: ReferancesName,
      ReferancesDetails: ReferancesDetails,
      Phone1: Phone1,
      Phone2: Phone2,
      BusinessEmail: BusinessEmail,
      BusinessLocation: BusinessLocation,
      Logo: filePath,
    };
    //console.log(newForm);

    try {
      //Verify JWT token
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          console.log("Invalid or expired token");
          return res.status(400).json({ message: "Invalid or expired token" });
        }
        const email = decoded.email;
        console.log("Email: " + email);
        console.log("Token: " + token);

        //Check if the Service Provider Name or Email Already Exists
        const checkExistingNameEmail =
          "SELECT * FROM serviceproviders WHERE ServiceProviderName = ? OR Email = ? ;";
        db.query(
          checkExistingNameEmail,
          [ServiceProviderName, BusinessEmail],
          (err, result) => {
            if (err) {
              console.log(
                "Database Error Service Provider Signup 1\n" +
                  JSON.stringify(err)
              );
              return res.status(500).json({ message: "Database Error" });
            }
            if (result.length != 0) {
              console.log("Already Used Email or Name");
              return res
                .status(400)
                .json({
                  success: false,
                  message: "That Name or Email is already taken.",
                });
            }

            // Get User Values From Applicants Table
            const queryGetNewUserData =
              "SELECT * FROM Applicants WHERE verification_token = ? ORDER BY id ASC LIMIT 1;";
            db.query(queryGetNewUserData, [token], (err, result) => {
              if (err) {
                console.log(
                  "Database Error Service Provider Signup 2\n" +
                    JSON.stringify(err)
                );
                return res.status(500).json({ message: "Database Error" });
              }
              if (result.length == 0) {
                console.log("Empty Return form Applicants Table");
                return res
                  .status(400)
                  .json({
                    message:
                      "Your Application Was Not Found. Please Signup Again.",
                  });
              } else {
                const username = result[0].username;
                const password = result[0].password;
                const userType = result[0].userType;
                const userEmail = result[0].email;

                // Add User to the Users table
                const queryRegisterUsers =
                  "INSERT INTO Users (username, email, password, userType) VALUES (?, ?, ?, ?)";
                db.query(
                  queryRegisterUsers,
                  [username, userEmail, password, userType],
                  (err, result) => {
                    if (err) {
                      console.log(
                        "Database Error Service Provider Signup 3\n" +
                          JSON.stringify(err)
                      );
                      return res
                        .status(500)
                        .json({ message: "Database Error" });
                    }

                    // Remove the user from the Applicants
                    const queryDeleteApplicant =
                      "DELETE FROM Applicants WHERE email = ?";
                    db.query(
                      queryDeleteApplicant,
                      [userEmail],
                      (err, result) => {
                        if (err) {
                          console.log(
                            "Database Error Service Provider Signup 4\n" +
                              JSON.stringify(err)
                          );
                          return res
                            .status(500)
                            .json({ message: "Database Error" });
                        }

                        const getNewUserID =
                          "Select UserID FROM users WHERE email = ?";
                        db.query(getNewUserID, [userEmail], (err, result) => {
                          if (err) {
                            console.log(
                              "Database Error Service Provider Signup 5\n" +
                                JSON.stringify(err)
                            );
                            return res
                              .status(500)
                              .json({ message: "Database Error" });
                          }
                          const userID = result[0].UserID;

                          const addToServiceProviders =
                            "INSERT INTO `serviceproviders` ( `UserID`, `ServiceProviderName`, `TypeOfService`, `ServiceDescription`,  `SubCity`,  `ExperienceInIndustry`, `SpecificSectors`, `PricingStructure`, `TeamSize`, `PackageName`, `PackageDetails`, `AccrediationName`, `AccrediationDetails`,  `ReferancesName`, `ReferancesDetails`, `SignupDate`, `Phone1`, `Phone2`, `BusinessLocation`, `Email`, `LogoURL`) Values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), ?, ?, ? ,? ,?);";
                          db.query(
                            addToServiceProviders,
                            [
                              userID,
                              ServiceProviderName,
                              TypeOfService,
                              ServiceDescription,
                              SubCity,
                              ExperienceInIndustry,
                              SpecificSectors,
                              PricingStructure,
                              TeamSize,
                              PackageName,
                              PackageDetails,
                              AccrediationName,
                              AccrediationDetails,
                              ReferancesName,
                              ReferancesDetails,
                              Phone1,
                              Phone2,
                              BusinessLocation,
                              BusinessEmail,
                              filePath,
                            ],
                            (err, result) => {
                              if (err) {
                                console.log(
                                  "Database Error Service Provider Signup 6\n" +
                                    JSON.stringify(err)
                                );
                                return res
                                  .status(500)
                                  .json({ message: "Database Error 6" });
                              }
                              res
                                .status(200)
                                .json({
                                  message: "Registered Successfully",
                                  form: newForm,
                                });
                            }
                          );
                        });
                      }
                    );
                  }
                );
              }
            });
          }
        );
      });
    } catch (error) {
      console.log("Caught Error \n" + JSON.stringify(error));
      res.status(500).json({ message: "Error saving form data" });
    }
  }
);

// Route to handle file and form data submission
router.post(
  "/updateServiceProviderProfile",
  uploadLogo.single("file"),
  async (req, res) => {
    // console.log(req.body.token);
    const {
      token,
      ServiceProviderName,
      TypeOfService,
      ServiceDescription,
      SubCity,
      ExperienceInIndustry,
      SpecificSectors,
      PricingStructure,
      TeamSize,
      PackageName,
      PackageDetails,
      AccrediationName,
      AccrediationDetails,
      ReferancesName,
      ReferancesDetails,
      Phone1,
      Phone2,
      BusinessEmail,
      BusinessLocation,
    } = req.body;

    const filePath = req.file ? req.file.path : null;
    const newForm = {
      token: token,
      ServiceProviderName: ServiceProviderName,
      TypeOfService: TypeOfService,
      ServiceDescription: ServiceDescription,
      SubCity: SubCity,
      ExperienceInIndustry: ExperienceInIndustry,
      SpecificSectors: SpecificSectors,
      PricingStructure: PricingStructure,
      TeamSize: TeamSize,
      PackageName: PackageName,
      PackageDetails: PackageDetails,
      AccrediationName: AccrediationName,
      AccrediationDetails: AccrediationDetails,
      ReferancesName: ReferancesName,
      ReferancesDetails: ReferancesDetails,
      Phone1: Phone1,
      Phone2: Phone2,
      BusinessEmail: BusinessEmail,
      BusinessLocation: BusinessLocation,
      Logo: filePath,
    };
    //console.log(newForm);

    try {
      //Verify JWT token
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          console.log("Invalid or expired token");
          return res.status(400).json({ message: "Invalid or expired token" });
        }
        const userID = decoded.userID;

        const updateServiceProviders = `
                  UPDATE serviceproviders 
                  SET 
                    ServiceProviderName = ?, 
                    TypeOfService = ?, 
                    ServiceDescription = ?, 
                    SubCity = ?, 
                    ExperienceInIndustry = ?, 
                    SpecificSectors = ?, 
                    PricingStructure = ?, 
                    TeamSize = ?, 
                    PackageName = ?, 
                    PackageDetails = ?, 
                    AccrediationName = ?, 
                    AccrediationDetails = ?, 
                    ReferancesName = ?, 
                    ReferancesDetails = ?, 
                    Phone1 = ?, 
                    Phone2 = ?, 
                    BusinessLocation = ?, 
                    Email = ?, 
                    LogoURL = ?, 
                    SignupDate = CURRENT_TIMESTAMP()
                  WHERE UserID = ?;
                `;

        // Execute the query with dynamic values
        db.query(
          updateServiceProviders,
          [
            ServiceProviderName,
            TypeOfService,
            ServiceDescription,
            SubCity,
            ExperienceInIndustry,
            SpecificSectors,
            PricingStructure,
            TeamSize,
            PackageName,
            PackageDetails,
            AccrediationName,
            AccrediationDetails,
            ReferancesName,
            ReferancesDetails,
            Phone1,
            Phone2,
            BusinessLocation,
            BusinessEmail,
            filePath, // This is the new LogoURL
            userID, // The condition for which record to update
          ],
          (err, result) => {
            if (err) {
              console.log(
                "Database Error Service Provider Update\n" + JSON.stringify(err)
              );
              return res.status(500).json({ message: "Database Error" });
            }
            res
              .status(200)
              .json({ message: "Updated Successfully", form: newForm });
          }
        );
      });
    } catch (error) {
      console.log("Caught Error \n" + JSON.stringify(error));
      res.status(500).json({ message: "Error saving form data" });
    }
  }
);

// Ensure the uploads directory exists, and if not, create it
const InvestorLogoUploadsDirectory = path.join(
  __dirname,
  "../../Storage/InvestorStorage/Logo"
);
if (!fs.existsSync(InvestorLogoUploadsDirectory)) {
  fs.mkdirSync(InvestorLogoUploadsDirectory, { recursive: true });
}

// Set up multer storage
const InvestorLogoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, InvestorLogoUploadsDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with extension
  },
});

const uploadInvestorLogo = multer({ storage: InvestorLogoStorage });

// Route to handle file and form data submission
router.post(
  "/createInvestorProfile",
  uploadInvestorLogo.single("file"),
  async (req, res) => {
    // console.log(req.body.token);
    const {
      token,
      InvestorName,
      InvestorBio,
      InvestorPortfolios,
      MinimumInvestmentAmount,
      MaximumInvestmentAmount,
      InvestmentTimeline,
      InvestmentApproach,
      RiskTolerance,
      FollowOnInvestmentCapacity,
      CoInvestmentOpportunities,
      MentorshipCapabilities,
      NetworkConnections,
      PriorStartupExperience,
      EducationalBackground,
      ProfessionalExperience,
      CommunityInvolvement,
      Phone1,
      Phone2,
      BusinessEmail,
      InvestorPreferences,
    } = req.body;

    const filePath = req.file ? req.file.path : null;

    const newForm = {
      token: token,
      InvestorName: InvestorName,
      InvestorBio: InvestorBio,
      InvestorPortfolios: InvestorPortfolios,
      MinimumInvestmentAmount: MinimumInvestmentAmount,
      MaximumInvestmentAmount: MaximumInvestmentAmount,
      InvestmentTimeline: InvestmentTimeline,
      InvestmentApproach: InvestmentApproach,
      RiskTolerance: RiskTolerance,
      FollowOnInvestmentCapacity: FollowOnInvestmentCapacity,
      CoInvestmentOpportunities: CoInvestmentOpportunities,
      MentorshipCapabilities: MentorshipCapabilities,
      NetworkConnections: NetworkConnections,
      PriorStartupExperience: PriorStartupExperience,
      EducationalBackground: EducationalBackground,
      ProfessionalExperience: ProfessionalExperience,
      CommunityInvolvement: CommunityInvolvement,
      Phone1: Phone1,
      Phone2: Phone2,
      BusinessEmail: BusinessEmail,
      InvestorPreferences: InvestorPreferences,
      Logo: filePath,
    };
    //console.log(newForm);

    try {
      //Verify JWT token
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          console.log("Invalid or expired token");
          return res.status(400).json({ message: "Invalid or expired token" });
        }
        const email = decoded.email;
        console.log("Email: " + email);
        console.log("Token: " + token);

        //Check if the Service Provider Name or Email Already Exists
        const checkExistingNameEmail =
          "SELECT * FROM investors WHERE InvestorName = ? OR BusinessEmail = ? ;";
        db.query(
          checkExistingNameEmail,
          [InvestorName, BusinessEmail],
          (err, result) => {
            if (err) {
              console.log(
                "Database Error Investor Signup 1\n" + JSON.stringify(err)
              );
              return res.status(500).json({ message: "Database Error" });
            }
            if (result.length != 0) {
              console.log("Already Used Email or Name");
              return res
                .status(400)
                .json({
                  success: false,
                  message: "That Name or Email is already taken.",
                });
            }

            // Get User Values From Applicants Table
            const queryGetNewUserData =
              "SELECT * FROM Applicants WHERE verification_token = ? ORDER BY id ASC LIMIT 1;";
            db.query(queryGetNewUserData, [token], (err, result) => {
              if (err) {
                console.log(
                  "Database Error Investor Signup 2\n" + JSON.stringify(err)
                );
                return res.status(500).json({ message: "Database Error" });
              }
              if (result.length == 0) {
                console.log("Empty Return form Applicants Table");
                return res
                  .status(400)
                  .json({
                    message:
                      "Your Application Was Not Found. Please Signup Again.",
                  });
              } else {
                const username = result[0].username;
                const password = result[0].password;
                const userType = result[0].userType;
                const userEmail = result[0].email;

                // Add User to the Users table
                const queryRegisterUsers =
                  "INSERT INTO Users (username, email, password, userType) VALUES (?, ?, ?, ?)";
                db.query(
                  queryRegisterUsers,
                  [username, userEmail, password, userType],
                  (err, result) => {
                    if (err) {
                      console.log(
                        "Database Error Investor Signup 3\n" +
                          JSON.stringify(err)
                      );
                      return res
                        .status(500)
                        .json({ message: "Database Error" });
                    }

                    // Remove the user from the Applicants
                    const queryDeleteApplicant =
                      "DELETE FROM Applicants WHERE email = ?";
                    db.query(
                      queryDeleteApplicant,
                      [userEmail],
                      (err, result) => {
                        if (err) {
                          console.log(
                            "Database Error Investor Signup 4\n" +
                              JSON.stringify(err)
                          );
                          return res
                            .status(500)
                            .json({ message: "Database Error" });
                        }

                        const getNewUserID =
                          "Select UserID FROM users WHERE email = ?";
                        db.query(getNewUserID, [userEmail], (err, result) => {
                          if (err) {
                            console.log(
                              "Database Error Investor Signup 5\n" +
                                JSON.stringify(err)
                            );
                            return res
                              .status(500)
                              .json({ message: "Database Error" });
                          }
                          const userID = result[0].UserID;

                          const addToInvestors =
                            " INSERT INTO `investors` (`UserID`, `InvestorName`, `InvestorBio`, `InvestorPortfolios`, `MinimumInvestmentAmount`,  `MaximumInvestmentAmount`, `InvestmentTimeline`, `InvestmentApproach`, `RiskTolerance`, `FollowOnInvestmentCapacity`,  `CoInvestmentOpportunities`,  `MentorshipCapabilities`, `NetworkConnections`, `PriorStartupExperience`, `EducationalBackground`,  `ProfessionalExperience`,  `CommunityInvolvement`, `SignupDate`,    `Phone1`, `Phone2`, `BusinessEmail`, `InvestorPreference`, `LogoURL`)  Values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), ?, ?, ? ,? , ?);";
                          db.query(
                            addToInvestors,
                            [
                              userID,
                              InvestorName,
                              InvestorBio,
                              InvestorPortfolios,
                              MinimumInvestmentAmount,
                              MaximumInvestmentAmount,
                              InvestmentTimeline,
                              InvestmentApproach,
                              RiskTolerance,
                              FollowOnInvestmentCapacity,
                              CoInvestmentOpportunities,
                              MentorshipCapabilities,
                              NetworkConnections,
                              PriorStartupExperience,
                              EducationalBackground,
                              ProfessionalExperience,
                              CommunityInvolvement,
                              Phone1,
                              Phone2,
                              BusinessEmail,
                              InvestorPreferences,
                              filePath,
                            ],
                            (err, result) => {
                              if (err) {
                                console.log(
                                  "Database Error Investor Signup 6\n" +
                                    JSON.stringify(err)
                                );
                                return res
                                  .status(500)
                                  .json({ message: "Database Error 6" });
                              }
                              res
                                .status(200)
                                .json({
                                  message: "Registered Successfully",
                                  form: newForm,
                                });
                            }
                          );
                        });
                      }
                    );
                  }
                );
              }
            });
          }
        );
      });
    } catch (error) {
      console.log("Caught Error \n" + JSON.stringify(error));
      res.status(500).json({ message: "Error saving form data" });
    }
  }
);

// Route to handle file and form data submission
router.post(
  "/updateInvestorProfile",
  uploadInvestorLogo.single("file"),
  async (req, res) => {
    // console.log(req.body.token);
    const {
      token,
      InvestorName,
      InvestorBio,
      InvestorPortfolios,
      MinimumInvestmentAmount,
      MaximumInvestmentAmount,
      InvestmentTimeline,
      InvestmentApproach,
      RiskTolerance,
      FollowOnInvestmentCapacity,
      CoInvestmentOpportunities,
      MentorshipCapabilities,
      NetworkConnections,
      PriorStartupExperience,
      EducationalBackground,
      ProfessionalExperience,
      CommunityInvolvement,
      Phone1,
      Phone2,
      BusinessEmail,
      InvestorPreferences,
    } = req.body;

    const filePath = req.file ? req.file.path : null;

    const newForm = {
      token: token,
      InvestorName: InvestorName,
      InvestorBio: InvestorBio,
      InvestorPortfolios: InvestorPortfolios,
      MinimumInvestmentAmount: MinimumInvestmentAmount,
      MaximumInvestmentAmount: MaximumInvestmentAmount,
      InvestmentTimeline: InvestmentTimeline,
      InvestmentApproach: InvestmentApproach,
      RiskTolerance: RiskTolerance,
      FollowOnInvestmentCapacity: FollowOnInvestmentCapacity,
      CoInvestmentOpportunities: CoInvestmentOpportunities,
      MentorshipCapabilities: MentorshipCapabilities,
      NetworkConnections: NetworkConnections,
      PriorStartupExperience: PriorStartupExperience,
      EducationalBackground: EducationalBackground,
      ProfessionalExperience: ProfessionalExperience,
      CommunityInvolvement: CommunityInvolvement,
      Phone1: Phone1,
      Phone2: Phone2,
      BusinessEmail: BusinessEmail,
      InvestorPreferences: InvestorPreferences,
      Logo: filePath,
    };
    //console.log(newForm);

    try {
      //Verify JWT token
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          console.log("Invalid or expired token");
          return res.status(400).json({ message: "Invalid or expired token" });
        }
        const userID = decoded.userID;

        const updateInvestors = `
      UPDATE investors 
      SET 
        InvestorName = ?, 
        InvestorBio = ?, 
        InvestorPortfolios = ?, 
        MinimumInvestmentAmount = ?, 
        MaximumInvestmentAmount = ?, 
        InvestmentTimeline = ?, 
        InvestmentApproach = ?, 
        RiskTolerance = ?, 
        FollowOnInvestmentCapacity = ?, 
        CoInvestmentOpportunities = ?, 
        MentorshipCapabilities = ?, 
        NetworkConnections = ?, 
        PriorStartupExperience = ?, 
        EducationalBackground = ?, 
        ProfessionalExperience = ?, 
        CommunityInvolvement = ?, 
        Phone1 = ?, 
        Phone2 = ?, 
        BusinessEmail = ?, 
        InvestorPreference = ?, 
        LogoURL = ?, 
        SignupDate = CURRENT_TIMESTAMP()
      WHERE UserID = ?;
    `;

        // Execute the query with dynamic values
        db.query(
          updateInvestors,
          [
            InvestorName,
            InvestorBio,
            InvestorPortfolios,
            MinimumInvestmentAmount,
            MaximumInvestmentAmount,
            InvestmentTimeline,
            InvestmentApproach,
            RiskTolerance,
            FollowOnInvestmentCapacity,
            CoInvestmentOpportunities,
            MentorshipCapabilities,
            NetworkConnections,
            PriorStartupExperience,
            EducationalBackground,
            ProfessionalExperience,
            CommunityInvolvement,
            Phone1,
            Phone2,
            BusinessEmail,
            InvestorPreferences, // Investor preferences field
            filePath, // Logo URL
            userID, // The unique identifier to match the specific investor to update
          ],
          (err, result) => {
            if (err) {
              console.log(
                "Database Error Investor Update\n" + JSON.stringify(err)
              );
              return res.status(500).json({ message: "Database Error" });
            }
            res
              .status(200)
              .json({ message: "Updated Successfully", form: newForm });
          }
        );
      });
    } catch (error) {
      console.log("Caught Error \n" + JSON.stringify(error));
      res.status(500).json({ message: "Error saving form data" });
    }
  }
);

module.exports = router;
