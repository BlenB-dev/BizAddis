import { useState, useEffect } from "react";
import Footer from "../Components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// import { FaPlus } from "react-icons/fa";
import {
  faUsers,
  faDollarSign,
  faBoxOpen,
  faFileAlt,
  faList,
  faIndustry,
  faBriefcase,
  faAward,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

const AdminStartupDetails = () => {

  const [UserData, setUserData] = useState(null);
  const navigate = useNavigate(); // useNavigate hook to programmatically navigate


  const StageOfDevelopment = ["Idea", "Prototype", "Early Revenue", "Growth", "Expansion"];

  const IndustrySector = [
      "Technology",
      "FinTech (Financial Technology)",
      "E-Commerce & Retail",
      "Marketing & Advertising",
      "Education & EdTech",
      "Human Resources (HRTech)",
      "Entertainment & Media",
      "Transportation & Mobility",
      "Aerospace & Aviation",
      "Security & Defense",
      "Healthcare & Life Sciences",
      "Agriculture & AgTech",
      "Food & Beverage",
      "Real Estate & Construction (PropTech)",
      "Energy and Sustainability",
      "Manufacturing & Industry 4.0",
      "Legal Services (LegalTech)",
      "Fashion & Apparel",
      "Sports and Fitness",
      "Travel and Hospitality",
      "Government and Public Sector",
      "Other"
  ];

  const FundingRequirement = [
      "< 100,000 ETB",
      "100,000 - 500,000 ETB",
      "500,000 - 1,000,000 ETB",
      "1,000,000 - 5,000,000 ETB",
      "> 5,000,000 ETB"
  ];

  const CurrentFundingStatus = [
      "Bootstrapped",
      "Pre-Seed",
      "Seed",
      "Crowdfunding",
      "Grants and Competitions",
      "Debt Financing",
      "Series A",
      "Series B",
      "Series C",
      "Series D (and beyond)",
      "Mezzanine Financing / Bridge Financing",
      "Other"
  ];

  const BusinessModel = ["B2B", "B2C", "Marketplace", "Other"];

  const RevenueModel = [
      "Subscription Revenue Model",
      "Freemium Revenue Model",
      "Pay-Per-Use (Usage-Based) Model",
      "Transaction Fees (Commission-Based Model)",
      "Marketplace Fees",
      "Affiliate Marketing Model",
      "Advertising Revenue Model",
      "Data Monetization Model",
      "Licensing Model",
      "Product Bundling Model",
      "Pay-What-You-Want Model",
      "Crowdsourcing / Crowdfunding Model",
      "Sponsorship Model",
      "Donation-Based Model",
      "White Labeling Model",
      "Franchise Model",
      "Royalties Model",
      "Razor and Blade Model",
      "Commission-Based Model",
      "Open-Source Model",
      "Performance-Based Model",
      "Other"
  ];

  const SubCity = [
      "Arada",
      "Addis Ketema",
      "Akaki Kality",
      "Bole",
      "Gullele",
      "Kirkos",
      "Kolfe Keranio",
      "Lideta",
      "Nifas Silk-Lafto",
      "Yeka",
      "Lemi Kura"
  ];

  const CompetitiveAdvantage = [
      "Technology-based (innovative, unique IP)",
      "Strong local partnerships",
      "Low-cost advantage",
      "Operational efficiency",
      "Market reach or customer base",
      "General product or service quality",
      "Other"
  ];

  const SocialImpactGoals = [
      "Financial Inclusion",
      "Environmental Sustainability",
      "Job Creation",
      "Education Improvement",
      "Health and Well-being",
      "Community Development",
      "Other",
      "None"
  ];

  const [startups, setStartups] = useState({
    startupName: 'Loading Startup Name',
    founders: ['Loading Founders'],
    foundersBio: [ 'Loading Founders Bio'],
    businessDescription: 'Loading Business Description',
    industrySector: 1,
    businessModel: 1,
    stageOfDevelopment: 1,
    subCity: 1,
    fundingRequirement: 1,
    currentFundingStatus: 1,
    useOfFunds: 'Loading Use Of Funds',
    revenueModel: 1,
    currentRevenue: 'Loading Current Revenue',
    marketSize: 'Loading Market Size',
    competitiveAdvantage: 1,
    customerBase: 'Loading Customer Base',
    financialProjections: 'Loading Financial Projection',
    teamSize: 'Loading Team Size',
    keyTeamMembers: ['Loading Key Team Members'],
    advisors: ['Loading Advisors'],
    legalStructure: "Loading Legal Structure",
    existingPartnerships: ['Loading Partners'],
    socialImpactGoals: 1,
    pitchDeck: null,
    startupEmail: 'Loading Startup Email',
    phone1: 'Loading Phone 1',
    phone2: 'Loading Phone 2',
  });



  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams(location.search);
      const service = queryParams.get('StartupID');
    

      const newForm = {
        token : token,
        StartupID: service
      }
      console.log("New Form To Sent: " + JSON.stringify(newForm));
      //setServiceList([]);
  

      await axios.post("http://localhost:5000/api/GetStartupProfileByID", newForm, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).then(async (response) => {
            console.log(response.data[0]);
            if(response.data.length>0){
                console.log("Number of Retrived Startups "+response.data.length)
                setUserData(response.data[0]);
        }else console.log("Retrived Nothing")




      })
      .catch((err) => {
        console.log(err);                  
      })

    };

    fetchData();
  }, []);

  useEffect(() => {
    if(UserData){
    // console.log("User Data\n"+JSON.stringify(UserData.StartupName));
    let OldStartupName = UserData.StartupName;
    let OldAdvisors = JSON.parse(UserData.Advisors);
    let OldBusinessDescription = UserData.BusinessDescription;
    let OldBusinessModel = UserData.BusinessModel;
    let OldCompetitiveAdvantage = UserData.CompetitiveAdvantage;
    let OldCurrentFundingStatus = UserData.CurrentFundingStatus;
    let OldCurrentRevenue = UserData.CurrentRevenue;
    let OldCustomerBase = UserData.CustomerBase;
    let OldFinancialProjection = UserData.FinancialProjection;
    let OldFounderBio = JSON.parse(UserData.FounderBio);
    let OldFounderName = JSON.parse(UserData.FounderName);
    let OldFundingRequirement = UserData.FundingRequirement;
    let OldIndustrySector = UserData.IndustrySector;
    let OldKeyTeamMembers = JSON.parse(UserData.KeyTeamMembers);
    let OldLegalStructure = UserData.LegalStructure;
    let OldMarketSizeAndPotential = UserData.MarketSizeAndPotential;
    let OldPartners = JSON.parse(UserData.Partners);
    let OldPhone1 = UserData.Phone1;
    let OldPhone2 = UserData.Phone2;
    let OldRevenueModel = UserData.RevenueModel;
    let OldSocialImpactGoals = UserData.SocialImactGoals;
    let OldStageOfDevelopment = UserData.StageOfDevelopment;
    let OldStartupEmail = UserData.StartupEmail;
    let OldSubCity = UserData.SubCity;
    let OldTeamSize = UserData.TeamSize;
    let OldUseOfFunds = UserData.UseOfFunds;

    setStartups({
      startupName: OldStartupName,
      founders: OldFounderName,
      foundersBio: OldFounderBio,
      businessDescription: OldBusinessDescription,
      industrySector: OldIndustrySector,
      businessModel: OldBusinessModel,
      stageOfDevelopment : OldStageOfDevelopment,
      subCity: OldSubCity,
      fundingRequirement: OldFundingRequirement,
      currentFundingStatus: OldCurrentFundingStatus,
      useOfFunds: OldUseOfFunds,
      revenueModel: OldRevenueModel,
      currentRevenue: OldCurrentRevenue,
      marketSize: OldMarketSizeAndPotential,
      competitiveAdvantage: OldCompetitiveAdvantage,
      customerBase: OldCustomerBase,
      financialProjections: OldFinancialProjection,
      teamSize: OldTeamSize,
      keyTeamMembers: OldKeyTeamMembers,
      advisors: OldAdvisors,
      legalStructure: OldLegalStructure,
      existingPartnerships: OldPartners,
      socialImpactGoals: OldSocialImpactGoals,
      pitchDeck: null,
      startupEmail: OldStartupEmail,
      phone1: OldPhone1,
      phone2: OldPhone2
    });


  }
  },[UserData]);


  const  DeleteStartup =  () => {
    
    const token = localStorage.getItem('token');
    const queryParams = new URLSearchParams(location.search);
    const service = queryParams.get('StartupID');
  

    const newForm = {
      token : token,
      StartupID: service
    }

    console.log(newForm);

    axios.post("http://localhost:5000/api/AdminDeleteStartup", newForm, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((response) => {
      console.log("Response")
      console.log(response.data.message);
      navigate('/AdminStartupList');

    })
    .catch((err) => {
      console.log(err);                  
    })


  }

  return (
    <div className="mx-auto mt-[-70px] p-12 rounded-lg sm:w-full sm:ml-0 sm:h-auto">
        <div className="mb-12">
          <div className="flex flex-col items-start mb-6">
            <div className="flex items-center mb-4">
              <div className="bg-gray-200 rounded-full w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center text-2xl sm:text-4xl font-bold text-gray-600">
                {startups.startupName.charAt(0)}
              </div>
              <div className="ml-4">
                <h1 className="text-2xl mt-[65px] sm:text-4xl font-bold">
                  {startups.startupName}
                </h1>
                <p className="text-gray-600 text-sm sm:text-lg">
                  Team Size: {startups.teamSize} •{" "}
                  Location: {SubCity[startups.subCity-1]}
                </p>
              </div>
            </div>
            <div >
              <button 
                className="bg-white-500 text-red-500 px-4 py-2 mx-5 rounded border border-red-500 hover:bg-red-500 hover:text-white"
                onClick={(e)=>{e.preventDefault(); DeleteStartup();}}
                >
                Delete
                </button>
            </div>
            {/* <a
              href="#"
              className="text-red-500 border ml-[860px] mt-[10px] py-3 absolute whitespace-nowrap border-red-500 px-3 py-1 rounded-full hover:bg-red-500 hover:text-white transition flex items-center"
            >
              <FaPlus className="mr-2" />
              Follow
            </a> */}
            {/* Visit Site Button */}
            {/* <a
              href="#"
              className="bg-purple-600 whitespace-nowrap text-white absolute ml-[990px] mt-[10px] mediumText p-3 sm:p-4 rounded-lg text-sm hover:bg-purple-700 transition"
            >
              VISIT SITE
            </a> */}
          </div>

          <h2 className="text-2xl sm:text-3xl font-semibold mt-8 mb-6">
            Startup Details
          </h2>

          {/* Stacked Startup Insights */}
          <div className="flex flex-col gap-6">



            {/* Startup Founders with Icon */}
            {startups.founders.length>0 &&
            <>
            <div className="block transition-transform hover:scale-105 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faBoxOpen}
                  className="text-green-500 text-3xl mr-3"
                />
                <h3 className="font-semibold text-xl sm:text-2xl">
                  Startup Founders
                </h3>
              </div>
              <div className=" mt-4">
                {startups.founders.map((pkg, index) => (
                  <>
                  <span
                    key={index}
                    className="bg-blue-200 text-blue-800 px-3 py-1 sm:px-4 sm:py-2 rounded-full mr-2 mb-2 text-sm sm:text-lg"
                  >
                    {pkg}
                  </span>
                  <br/><br/>
                  <p>{startups.foundersBio[index]}</p>
                  <br/>
                  </>
                ))}
              </div>
            </div>
            </>
            }


            {/* business Description with Icon */}
            <div className="block transition-transform hover:scale-105 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faFileAlt}
                  className="text-blue-500 text-3xl mr-3"
                />
                <h3 className="font-semibold text-xl sm:text-2xl">
                Business Description
                </h3>
              </div>
              <p className="text-gray-800 text-lg sm:text-2xl">
                {startups.businessDescription}
              </p>
            </div>


            {/* General Data with Icon */}
            <div className="block transition-transform hover:scale-105 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faFileAlt}
                  className="text-blue-500 text-3xl mr-3"
                />
                <h3 className="font-semibold text-xl sm:text-2xl">
                General Info
                </h3>
              </div>
              <p className="text-gray-800 text-lg sm:text-2xl">
              Stage Of Development: {StageOfDevelopment[startups.stageOfDevelopment-1]}
              </p><br/>
              <p className="text-gray-800 text-lg sm:text-2xl">
              Industry Sector: {IndustrySector[startups.industrySector-1]}
              </p><br/>
              <p className="text-gray-800 text-lg sm:text-2xl">
              Business Model: {BusinessModel[startups.businessModel]}
              </p><br/>
              <p className="text-gray-800 text-lg sm:text-2xl">
              Revenue Model: {RevenueModel[startups.revenueModel]}
              </p><br/>
              <p className="text-gray-800 text-lg sm:text-2xl">
              Competitive Advantage: {CompetitiveAdvantage[startups.competitiveAdvantage]}
              </p><br/>
              <p className="text-gray-800 text-lg sm:text-2xl">
              Social Impact Goals: {SocialImpactGoals[startups.socialImpactGoals]}
              </p><br/>
              <p className="text-gray-800 text-lg sm:text-2xl">
              Legal Structure: {startups.legalStructure}
              </p><br/>
            </div>


            {/* Current Revenue with Icon */}
            <div className="block transition-transform hover:scale-105 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faFileAlt}
                  className="text-blue-500 text-3xl mr-3"
                />
                <h3 className="font-semibold text-xl sm:text-2xl">
                Current Revenue
                </h3>
              </div>
              <p className="text-gray-800 text-lg sm:text-2xl">
                {startups.currentRevenue}
              </p>
            </div>

            {/* Funding with Icon */}
            <div className="block transition-transform hover:scale-105 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faFileAlt}
                  className="text-blue-500 text-3xl mr-3"
                />
                <h3 className="font-semibold text-xl sm:text-2xl">
                Funding
                </h3>
              </div>
              <p className="text-gray-800 text-lg sm:text-2xl">
              Funding Requirement: {FundingRequirement[startups.fundingRequirement-1]}
              </p><br/>
              <p className="text-gray-800 text-lg sm:text-2xl">
              Current Funding Status: {CurrentFundingStatus[startups.currentFundingStatus-1]}
              </p><br/>
            </div>


            {/* customer Base with Icon */}
            <div className="block transition-transform hover:scale-105 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faFileAlt}
                  className="text-blue-500 text-3xl mr-3"
                />
                <h3 className="font-semibold text-xl sm:text-2xl">
                CustomerBase
                </h3>
              </div>
              <p className="text-gray-800 text-lg sm:text-2xl">
                {startups.customerBase}
              </p>
            </div>

            {/* financial Projections with Icon */}
            <div className="block transition-transform hover:scale-105 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faFileAlt}
                  className="text-blue-500 text-3xl mr-3"
                />
                <h3 className="font-semibold text-xl sm:text-2xl">
                Financial Projections
                </h3>
              </div>
              <p className="text-gray-800 text-lg sm:text-2xl">
                {startups.financialProjections}
              </p>
            </div>

            {/* Market Size with Icon */}
            <div className="block transition-transform hover:scale-105 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faFileAlt}
                  className="text-blue-500 text-3xl mr-3"
                />
                <h3 className="font-semibold text-xl sm:text-2xl">
                Market Size
                </h3>
              </div>
              <p className="text-gray-800 text-lg sm:text-2xl">
                {startups.marketSize}
              </p>
            </div>

            {/* Use Of Funds with Icon */}
            <div className="block transition-transform hover:scale-105 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faFileAlt}
                  className="text-blue-500 text-3xl mr-3"
                />
                <h3 className="font-semibold text-xl sm:text-2xl">
                Use Of Funds
                </h3>
              </div>
              <p className="text-gray-800 text-lg sm:text-2xl">
                {startups.useOfFunds}
              </p>
            </div>


            {/* Key Team Members with Icon */}
            {startups.keyTeamMembers.length>0 &&
            <>
            <div className="block transition-transform hover:scale-105 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faBoxOpen}
                  className="text-green-500 text-3xl mr-3"
                />
                <h3 className="font-semibold text-xl sm:text-2xl">
                Key Team Members
                </h3>
              </div>
              <div className=" mt-4">
                {startups.keyTeamMembers.map((pkg, index) => (
                  <>
                  <span
                    key={index}
                    className="bg-blue-200 text-blue-800 px-3 py-1 sm:px-4 sm:py-2 rounded-full mr-2 mb-2 text-sm sm:text-lg"
                  >
                    {pkg}
                  </span>
                  <br/><br/>
                  </>
                ))}
              </div>
            </div>
            </>
            }

            {/* Advisors with Icon */}
            {startups.advisors.length>0 &&
            <>
            <div className="block transition-transform hover:scale-105 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faBoxOpen}
                  className="text-green-500 text-3xl mr-3"
                />
                <h3 className="font-semibold text-xl sm:text-2xl">
                Advisors
                </h3>
              </div>
              <div className=" mt-4">
                {startups.advisors.map((pkg, index) => (
                  <>
                  <span
                    key={index}
                    className="bg-blue-200 text-blue-800 px-3 py-1 sm:px-4 sm:py-2 rounded-full mr-2 mb-2 text-sm sm:text-lg"
                  >
                    {pkg}
                  </span>
                  <br/><br/>
                  </>
                ))}
              </div>
            </div>
            </>
            }

            {/* Existing Partnerships with Icon */}
            {startups.existingPartnerships.length>0 &&
            <>
            <div className="block transition-transform hover:scale-105 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faBoxOpen}
                  className="text-green-500 text-3xl mr-3"
                />
                <h3 className="font-semibold text-xl sm:text-2xl">
                Partners
                </h3>
              </div>
              <div className=" mt-4">
                {startups.existingPartnerships.map((pkg, index) => (
                  <>
                  <span
                    key={index}
                    className="bg-blue-200 text-blue-800 px-3 py-1 sm:px-4 sm:py-2 rounded-full mr-2 mb-2 text-sm sm:text-lg"
                  >
                    {pkg}
                  </span>
                  <br/><br/>
                  </>
                ))}
              </div>
            </div>
            </>
            }




            {/* Contacts with Icon */}
            <div className="block transition-transform hover:scale-105 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faPhone}
                  className="text-blue-500 text-3xl mr-3"
                />
                <h3 className="font-semibold text-xl sm:text-2xl">
                  Contacts
                </h3>
              </div>
              <p className="text-gray-800 text-lg sm:text-2xl">
                Phone 1: {startups.phone1}
              </p>
              {(startups.phone2 != null && startups.phone2.length != 0) &&
              <p className="text-gray-800 text-lg sm:text-2xl">
                Phone 2: {startups.phone2}
              </p>
            }
              <p className="text-gray-800 text-lg sm:text-2xl">
                Email: {startups.startupEmail}
              </p>
            </div>

          


            {/* Team Size with Icon */}
            {/* <div className="block transition-transform hover:scale-105 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-yellow-500">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faUsers}
                  className="text-yellow-500 text-3xl mr-3"
                />
                <h3 className="font-semibold text-xl sm:text-2xl">Team Size</h3>
              </div>
              <p className="text-gray-800 text-lg sm:text-2xl">
                {ServiceProviders.TeamSize} Members
              </p>
            </div> */}

            {/* Certifications with Icon */}
            {/* <div className="block transition-transform hover:scale-105 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faCertificate}
                  className="text-purple-500 text-3xl mr-3"
                />
                <h3 className="font-semibold text-xl sm:text-2xl">
                  Certifications
                </h3>
              </div>
              <div className="flex flex-wrap mt-4">
                {ServiceProviders.CertificationsAndAccreditations.map(
                  (cert, index) => (
                    <span
                      key={index}
                      className="bg-blue-200 text-blue-800 px-3 py-1 sm:px-4 sm:py-2 rounded-full mr-2 mb-2 text-sm sm:text-lg"
                    >
                      {cert}
                    </span>
                  )
                )}
              </div>
            </div> */}
          
          </div>

          {/* New Posts Section */}
          {/* <div className="mt-10">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
              New Posts
            </h2>
            <button
              onClick={toggleNewPosts}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg mb-4"
            >
              {showNewPosts ? "Hide Posts" : "Show Posts"}
            </button>
            {showNewPosts && (
              <div className="flex flex-col gap-4">
                {ServiceProviders.NewPosts.map((post, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition"
                  >
                    <h3 className="font-bold text-xl">{post.title}</h3>
                    <p className="text-gray-600">{post.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
 */}
          {/* Rating Section */}
          {/* <div className="mt-10">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
              Rate this Service Provider
            </h2>
            <div className="flex gap-2 items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <label key={star} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value={star}
                    className="hidden"
                    onChange={() => handleRatingChange(star)}
                  />
                  <span
                    className={`text-yellow-500 text-2xl text-gray-300`}
                  >
                    <FontAwesomeIcon icon={faStar} />
                  </span>
                </label>
              ))}
            </div>
          </div>
 */}
          {/* Comments Section */}
          {/* <div className="mt-10">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
              Comments
            </h2>
            <form onSubmit={handleCommentSubmit} className="mb-4">
              <textarea
                className="border-2 border-gray-300 rounded-lg p-2 w-full"
                rows="4"
                placeholder="Leave a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-2"
              >
                Submit
              </button>
            </form>
            <div className="flex flex-col gap-2">
              {comments.map((comment, index) => (
                <div
                  key={index}
                  className="bg-gray-200 p-3 rounded-lg shadow-sm"
                >
                  {comment}
                </div>
              ))}
            </div>
          </div> */}
        </div>
      {/* ))} */}
      <Footer />
    </div>
  );
};

export default AdminStartupDetails;
