CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    userType VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    is_logged_in BOOLEAN DEFAULT FALSE
) AUTO_INCREMENT = 1000000;

CREATE TABLE Administrators (
    AdminID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL UNIQUE,
    AdminName VARCHAR(255) NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE ON UPDATE CASCADE
)AUTO_INCREMENT = 1000000;

CREATE TABLE Messages (
    MessageID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    MessageContent VARCHAR(255) NOT NULL,
    MessageReadStatus BOOLEAN DEFAULT FALSE,
    MessageDate DATETIME NOT NULL
)AUTO_INCREMENT = 1000000;

CREATE TABLE Startups (
    StartupID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL UNIQUE,
    StartupName VARCHAR(255) NOT NULL UNIQUE,
    FounderName JSON,
    FounderBio JSON,
    BusinessDescription TEXT,
    IndustrySector VARCHAR(255),
    BusinessModel VARCHAR(255),
    StageOfDevelopment VARCHAR(255),
    SubCity VARCHAR(255),
    FundingRequirement VARCHAR(255),
    CurrentFundingStatus VARCHAR(255),
    UseOfFunds TEXT,
    RevenueModel VARCHAR(255),
    CurrentRevenue VARCHAR(255),
    MarketSizeAndPotential TEXT,
    CompetitiveAdvantage VARCHAR(255),
    CustomerBase INT,
    FinancialProjection TEXT,
    TeamSize INT,
    LegalStructure VARCHAR(255),
    SocialImactGoals VARCHAR(255),
    KeyTeamMembers JSON,
    Advisors JSON,
    Partners JSON,
    PickDeckURL VARCHAR(255),
    StartupEmail VARCHAR(255),
    Phone1 VARCHAR(255),
    Phone2 VARCHAR(255),
    SignupDate DATETIME,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE ON UPDATE CASCADE
)AUTO_INCREMENT = 1000000;

-- CREATE TABLE ServiceProviders (
    
--     ServiceProviderID INT AUTO_INCREMENT PRIMARY KEY,
--     UserID INT NOT NULL UNIQUE,
--     ServiceProviderName VARCHAR(255) NOT NULL UNIQUE,
--     TypeOfService VARCHAR(255),
--     ServiceDescription TEXT,
--     SubCity VARCHAR(255),
--     ExperienceInIndustry VARCHAR(255),
--     SpecificSectors VARCHAR(255),
--     PricingStructure TEXT,
--     TeamSize INT,
--     SignupDate DATETIME,
--     Phone1 VARCHAR(255),
--     Phone2 VARCHAR(255),
--     BusinessLocation VARCHAR(255),
--     FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE ON UPDATE CASCADE
-- )AUTO_INCREMENT = 1000000;

CREATE TABLE ServiceProviders (
    ServiceProviderID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL UNIQUE,
    ServiceProviderName VARCHAR(255) NOT NULL UNIQUE,
    TypeOfService VARCHAR(255),
    ServiceDescription TEXT,
    SubCity VARCHAR(255),
    ExperienceInIndustry VARCHAR(255),
    SpecificSectors VARCHAR(255),
    PricingStructure TEXT,
    TeamSize INT,
    PackageName JSON
    PackageDetails JSON
    AccrediationName JSON,
    AccrediationDetails JSON,
    ReferancesName JSON,
    ReferancesDetails JSON,
    SignupDate DATETIME,
    Phone1 VARCHAR(255),
    Phone2 VARCHAR(255),
    BusinessLocation VARCHAR(255),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE ON UPDATE CASCADE
)AUTO_INCREMENT = 1000000;


CREATE TABLE Investors (
    InvestorID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL UNIQUE,
    InvestorName VARCHAR(255) NOT NULL UNIQUE,
    InvestorBio TEXT,
    InvestorPortfolios JSON,
    MinimumInvestmentAmount INT,
    MaximumInvestmentAmount INT,
    InvestmentTimeline TEXT,
    InvestmentApproch VARCHAR(255),
    RiskTolernace VARCHAR(255),
    FollowOnInvestmentCapacity VARCHAR(255),
    CoInvestmentOpportunities VARCHAR(255),
    MentorshipCapabilities VARCHAR(255),
    NetworkConnections TEXT,
    PriorStartupExperience TEXT,
    EducationalBackground TEXT,
    ProfessionalExperience TEXT,
    CommunityInvolvement TEXT,
    SignupDate DATETIME,
    Phone1 VARCHAR(255),
    Phone2 VARCHAR(255),
    BusinessEmail VARCHAR(255),
    InvestorPreference JSON,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE ON UPDATE CASCADE
)AUTO_INCREMENT = 1000000;

-- CREATE TABLE InvestorPreferences(
--     PrefID INT AUTO_INCREMENT PRIMARY KEY,
--     InvestorID INT,
--     DevelopmentStage JSON,
--     IndustryFocus JSON,
--     FundingRequirement JSON,
--     CurrentFundingStatus JSON,
--     BusinessModel JSON,
--     RevenueModel JSON,
--     GeographicFocus JSON,
--     CompetitiveAdvantage JSON,
--     SocialImactGoals JSON,
--     FOREIGN KEY (InvestorID) REFERENCES Investors(InvestorID) ON DELETE CASCADE ON UPDATE CASCADE
-- )AUTO_INCREMENT = 1000000;

-- CREATE TABLE InvestorPortfolios (
--     PortfolioID INT AUTO_INCREMENT PRIMARY KEY,
--     InvestorID INT,
--     AssetName VARCHAR(255) NOT NULL,
--     AssetDetails TEXT,
--     FOREIGN KEY (InvestorID) REFERENCES Investors(InvestorID) ON DELETE CASCADE ON UPDATE CASCADE
-- )AUTO_INCREMENT = 1000000;

CREATE TABLE InvestorVisitHistory (
    VisitID INT AUTO_INCREMENT PRIMARY KEY,
    InvestorID INT,
    StartupID INT,
    VisitDate DATETIME,
    FOREIGN KEY (InvestorID) REFERENCES Investors(InvestorID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (StartupID) REFERENCES Startups(StartupID) ON DELETE CASCADE ON UPDATE CASCADE
)AUTO_INCREMENT = 1000000;

CREATE TABLE InvestorStartupConnection (
    ConnectionID INT AUTO_INCREMENT PRIMARY KEY,
    InvestorID INT,
    StartupID INT,
    ConnectionReplied BOOLEAN DEFAULT FALSE,
    ConnectionStatus BOOLEAN DEFAULT FALSE,
    ConnectionInitateDate DATETIME,
    ConnectionReplyDate DATETIME,
    FOREIGN KEY (InvestorID) REFERENCES Investors(InvestorID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (StartupID) REFERENCES Startups(StartupID) ON DELETE CASCADE ON UPDATE CASCADE
)AUTO_INCREMENT = 1000000;

CREATE TABLE InvestorSearchHistory (
    SearchID INT AUTO_INCREMENT PRIMARY KEY,
    InvestorID INT,
    SearchTerm VARCHAR(255),
    Results TEXT,
    FOREIGN KEY (InvestorID) REFERENCES Investors(InvestorID) ON DELETE CASCADE ON UPDATE CASCADE
)AUTO_INCREMENT = 1000000;

CREATE TABLE InvestorStartupRecommendation (
    RecommendationID INT AUTO_INCREMENT PRIMARY KEY,
    InvestorID INT,
    Recommendations TEXT,
    FOREIGN KEY (InvestorID) REFERENCES Investors(InvestorID) ON DELETE CASCADE ON UPDATE CASCADE
)AUTO_INCREMENT = 1000000;

-- CREATE TABLE StartupPartners (
--     PartnerID INT AUTO_INCREMENT PRIMARY KEY,
--     StartupID INT,
--     PartnerName VARCHAR(255),
--     FOREIGN KEY (StartupID) REFERENCES Startups(StartupID) ON DELETE CASCADE ON UPDATE CASCADE
-- )AUTO_INCREMENT = 1000000;

-- CREATE TABLE StartupAdvisors (
--     AdvisorID INT AUTO_INCREMENT PRIMARY KEY,
--     StartupID INT,
--     AdvisorName VARCHAR(255),
--     FOREIGN KEY (StartupID) REFERENCES Startups(StartupID) ON DELETE CASCADE ON UPDATE CASCADE
-- )AUTO_INCREMENT = 1000000;

-- CREATE TABLE StartupFounders (
--     FounderID INT AUTO_INCREMENT PRIMARY KEY,
--     StartupID INT,
--     FounderName VARCHAR(255),
--     FounderBio TEXT,
--     FOREIGN KEY (StartupID) REFERENCES Startups(StartupID) ON DELETE CASCADE ON UPDATE CASCADE
-- )AUTO_INCREMENT = 1000000;

-- CREATE TABLE StartupKeyTeamMembers (
--     TeamMemberID INT AUTO_INCREMENT PRIMARY KEY,
--     StartupID INT,
--     TeamMemberName VARCHAR(255),
--     FOREIGN KEY (StartupID) REFERENCES Startups(StartupID) ON DELETE CASCADE ON UPDATE CASCADE
-- )AUTO_INCREMENT = 1000000;

CREATE TABLE StartupVisitHistory (
    VisitID INT AUTO_INCREMENT PRIMARY KEY,
    StartupID INT,
    ServiceProviderID INT,
    VisitDate DATETIME,
    FOREIGN KEY (StartupID) REFERENCES Startups(StartupID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (ServiceProviderID) REFERENCES ServiceProviders(ServiceProviderID) ON DELETE CASCADE ON UPDATE CASCADE
)AUTO_INCREMENT = 1000000;

CREATE TABLE StartupSearchHistory (
    SearchID INT AUTO_INCREMENT PRIMARY KEY,
    StartupID INT,
    SearchTerm VARCHAR(255),
    Results TEXT,
    FOREIGN KEY (StartupID) REFERENCES Startups(StartupID) ON DELETE CASCADE ON UPDATE CASCADE
)AUTO_INCREMENT = 1000000;

CREATE TABLE StartupServiceProviderRecommendation (
    RecommendationID INT AUTO_INCREMENT PRIMARY KEY,
    StartupID INT,
    Recommendations TEXT,
    FOREIGN KEY (StartupID) REFERENCES Startups(StartupID) ON DELETE CASCADE ON UPDATE CASCADE
)AUTO_INCREMENT = 1000000;

CREATE TABLE StartupServiceProviderRating (
    RatingID INT AUTO_INCREMENT PRIMARY KEY,
    StartupID INT,
    ServiceProviderID INT,
    Rating INT,
    Comment VARCHAR(255),
    RatingDate DATETIME,
    RatingAppoval BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (StartupID) REFERENCES Startups(StartupID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (ServiceProviderID) REFERENCES ServiceProviders(ServiceProviderID) ON DELETE CASCADE ON UPDATE CASCADE
)AUTO_INCREMENT = 1000000;

-- CREATE TABLE ServiceProviderPackages (
--     PackageID INT AUTO_INCREMENT PRIMARY KEY,
--     ServiceProviderID INT,
--     PackageName VARCHAR(255),
--     PackageDetails TEXT,
--     FOREIGN KEY (ServiceProviderID) REFERENCES ServiceProviders(ServiceProviderID) ON DELETE CASCADE ON UPDATE CASCADE
-- )AUTO_INCREMENT = 1000000;

CREATE TABLE ServiceProviderRatings (
    RatingID INT AUTO_INCREMENT PRIMARY KEY,
    ServiceProviderID INT UNIQUE,
    Rating VARCHAR(10),
    FOREIGN KEY (ServiceProviderID) REFERENCES ServiceProviders(ServiceProviderID) ON DELETE CASCADE ON UPDATE CASCADE
)AUTO_INCREMENT = 1000000;

-- CREATE TABLE ServiceProviderAccrediations (
--     AccrediationID INT AUTO_INCREMENT PRIMARY KEY,
--     ServiceProviderID INT,
--     AccrediationName VARCHAR(255),
--     AccrediationDetails TEXT,
--     FOREIGN KEY (ServiceProviderID) REFERENCES ServiceProviders(ServiceProviderID) ON DELETE CASCADE ON UPDATE CASCADE
-- )AUTO_INCREMENT = 1000000;


-- CREATE TABLE ServiceProviderReferances (
--     ReferancesID INT AUTO_INCREMENT PRIMARY KEY,
--     ServiceProviderID INT,
--     ReferancesName VARCHAR(255),
--     ReferancesDetails TEXT,
--     FOREIGN KEY (ServiceProviderID) REFERENCES ServiceProviders(ServiceProviderID) ON DELETE CASCADE ON UPDATE CASCADE
-- )AUTO_INCREMENT = 1000000;


CREATE TABLE ServiceProviderPosts (
    PostID INT AUTO_INCREMENT PRIMARY KEY,
    ServiceProviderID INT,
    PostTitle VARCHAR(255),
    PostBody TEXT,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ServiceProviderID) REFERENCES ServiceProviders(ServiceProviderID) ON DELETE CASCADE ON UPDATE CASCADE
)AUTO_INCREMENT = 1000000;

CREATE TABLE ServiceProviderFollows (
    FollowID INT AUTO_INCREMENT PRIMARY KEY,
    ServiceProviderID INT,
    UserID INT,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ServiceProviderID) REFERENCES ServiceProviders(ServiceProviderID) ON DELETE CASCADE ON UPDATE CASCADE
)AUTO_INCREMENT = 1000000;




CREATE TABLE Applicants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    userType VARCHAR(255) NOT NULL
)AUTO_INCREMENT = 1000000;