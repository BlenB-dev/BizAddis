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

const AdminInvestorDetails = () => {

  const [UserData, setUserData] = useState(null);
  const navigate = useNavigate(); // useNavigate hook to programmatically navigate

  const [investors, setInvestors] = useState({
    InvestorName: "Loading Investor Name",
    InvestorBio: "Loading Investor Bio",
    InvestorPortfolios: ["Loading Investor Portfolios"],

    MinimumInvestmentAmount: 0,
    MaximumInvestmentAmount: 0,
    InvestmentTimeline: "Loading Investment Timeline",
    InvestmentApproach: "Loading Investment Approach",

    RiskTolerance: "Loading Risk Tolerance",
    FollowOnInvestmentCapacity: "Loading FollowOn Investment Capacity",
    CoInvestmentOpportunities: "Loading CoInvestment Opportunities",
    MentorshipCapabilities: "Loading Mentorship Capabilities",

    NetworkConnections: "Loading Network Connections",
    PriorStartupExperience: "Loading Prior Startup Experience",
    EducationalBackground: "Loading Educational Background",
    ProfessionalExperience: "Loading Professional Experience",
    
    CommunityInvolvement: "Loading Community Involvement",
    Phone1: "Loading Phone 1",
    Phone2: "Loading Phone 2",
    BusinessEmail: "Loading BusinessEmail",
    Logo: null,


  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams(location.search);
      const service = queryParams.get('InvestorID');
    

      const newForm = {
        token : token,
        InvestorID: service
      }
      console.log("New Form To Sent: " + JSON.stringify(newForm));
      //setServiceList([]);
  

      await axios.post("http://localhost:5000/api/GetInvestorProfileByID", newForm, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).then(async (response) => {
            console.log(response.data[0]);
            if(response.data.length>0){
                console.log("Number of Retrived Investors "+response.data.length)
                console.log(response.data);
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
    if (UserData) {
        console.log(UserData);


      // Parsing or directly assigning values from UserData to investor-related fields
      let OldInvestorName = UserData.InvestorName;
      let OldInvestorBio = UserData.InvestorBio;
      let OldInvestorPortfolios = JSON.parse(UserData.InvestorPortfolios);
      let OldMinimumInvestmentAmount = UserData.MinimumInvestmentAmount;
      let OldMaximumInvestmentAmount = UserData.MaximumInvestmentAmount;
      let OldInvestmentTimeline = UserData.InvestmentTimeline;
      let OldInvestmentApproach = UserData.InvestmentApproach;
      let OldRiskTolerance = UserData.RiskTolerance;
      let OldFollowOnInvestmentCapacity = UserData.FollowOnInvestmentCapacity;
      let OldCoInvestmentOpportunities = UserData.CoInvestmentOpportunities;
      let OldMentorshipCapabilities = UserData.MentorshipCapabilities;
      let OldNetworkConnections = UserData.NetworkConnections;
      let OldPriorStartupExperience = UserData.PriorStartupExperience;
      let OldEducationalBackground = UserData.EducationalBackground;
      let OldProfessionalExperience = UserData.ProfessionalExperience;
      let OldCommunityInvolvement = UserData.CommunityInvolvement;
      let OldPhone1 = UserData.Phone1;
      let OldPhone2 = UserData.Phone2;
      let OldBusinessEmail = UserData.BusinessEmail;
  
      // Setting values for the investors state
      setInvestors({
        InvestorName: OldInvestorName,
        InvestorBio: OldInvestorBio,
        InvestorPortfolios: OldInvestorPortfolios,
        MinimumInvestmentAmount: OldMinimumInvestmentAmount,
        MaximumInvestmentAmount: OldMaximumInvestmentAmount,
        InvestmentTimeline: OldInvestmentTimeline,
        InvestmentApproach: OldInvestmentApproach,
        RiskTolerance: OldRiskTolerance,
        FollowOnInvestmentCapacity: OldFollowOnInvestmentCapacity,
        CoInvestmentOpportunities: OldCoInvestmentOpportunities,
        MentorshipCapabilities: OldMentorshipCapabilities,
        NetworkConnections: OldNetworkConnections,
        PriorStartupExperience: OldPriorStartupExperience,
        EducationalBackground: OldEducationalBackground,
        ProfessionalExperience: OldProfessionalExperience,
        CommunityInvolvement: OldCommunityInvolvement,
        Phone1: OldPhone1,
        Phone2: OldPhone2,
        BusinessEmail: OldBusinessEmail,
        Logo: null,

      });
  
    }
  }, [UserData]);

  const  DeleteInvestor =  () => {
    
    const token = localStorage.getItem('token');
    const queryParams = new URLSearchParams(location.search);
    const service = queryParams.get('InvestorID');
  

    const newForm = {
      token : token,
      InvestorID: service
    }

    console.log(newForm);

    axios.post("http://localhost:5000/api/AdminDeleteInvestor", newForm, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((response) => {
      console.log("Response")
      console.log(response.data.message);
      navigate('/AdminInvestorList');
      
    })
    .catch((err) => {
      console.log(err);                  
    })


  }


  return (
    <div className="mx-auto mt-[-70px] p-12 rounded-lg sm:w-full sm:ml-0 sm:h-auto">
      {/* {serviceProviders.map((ServiceProviders, index) => ( */}
        <div className="mb-12">
          <div className="flex flex-col items-start mb-6">
            <div className="flex items-center mb-4">
              <div className="bg-gray-200 rounded-full w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center text-2xl sm:text-4xl font-bold text-gray-600">
                {investors.InvestorName.charAt(0)}
              </div>
              <div className="ml-4">
                <h1 className="text-2xl mt-[65px] sm:text-4xl font-bold">
                  {investors.InvestorName}
                </h1>
                <p className="text-gray-600 text-sm sm:text-lg">
                  Minimum Investment Amount: {investors.MinimumInvestmentAmount} •{" "}
                  Maximum Investment Amount: {investors.MaximumInvestmentAmount}
                </p>
              </div>
            </div>
            <div >
              <button 
                className="bg-white-500 text-red-500 px-4 py-2 mx-5 rounded border border-red-500 hover:bg-red-500 hover:text-white"
                onClick={(e)=>{e.preventDefault(); DeleteInvestor();}}
                >
                Delete
                </button>
            </div>


          </div>

          <h2 className="text-2xl sm:text-3xl font-semibold mt-8 mb-6">
            Investor Details
          </h2>

          {/* Stacked Service Insights */}
          <div className="flex flex-col gap-6">

            {/* Investor Bio with Icon */}
            <div className="block transition-transform hover:scale-105 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faFileAlt}
                  className="text-blue-500 text-3xl mr-3"
                />
                <h3 className="font-semibold text-xl sm:text-2xl">
                Investor Bio
                </h3>
              </div>
              <p className="text-gray-800 text-lg sm:text-2xl">
                {investors.InvestorBio}
              </p>
            </div>


            {/* Investor Portfolio with Icon */}
            {investors.InvestorPortfolios.length>0 &&
            <>
            <div className="block transition-transform hover:scale-105 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faBoxOpen}
                  className="text-green-500 text-3xl mr-3"
                />
                <h3 className="font-semibold text-xl sm:text-2xl">
                  Investor Portfolio
                </h3>
              </div>
              <div className=" mt-4">
                {investors.InvestorPortfolios.map((pkg, index) => (
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

            {/* Network Connections with Icon */}
            <div className="block transition-transform hover:scale-105 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faFileAlt}
                  className="text-blue-500 text-3xl mr-3"
                />
                <h3 className="font-semibold text-xl sm:text-2xl">
                Network Connections
                </h3>
              </div>
              <p className="text-gray-800 text-lg sm:text-2xl">
                {investors.NetworkConnections}
              </p>
            </div>
            {/* Educational Background with Icon */}
            <div className="block transition-transform hover:scale-105 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faFileAlt}
                  className="text-blue-500 text-3xl mr-3"
                />
                <h3 className="font-semibold text-xl sm:text-2xl">
                Educational Background
                </h3>
              </div>
              <p className="text-gray-800 text-lg sm:text-2xl">
                {investors.EducationalBackground}
              </p>
            </div>
            {/* Professional Experience with Icon */}
            <div className="block transition-transform hover:scale-105 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faFileAlt}
                  className="text-blue-500 text-3xl mr-3"
                />
                <h3 className="font-semibold text-xl sm:text-2xl">
                Professional Experience
                </h3>
              </div>
              <p className="text-gray-800 text-lg sm:text-2xl">
                {investors.ProfessionalExperience}
              </p>
            </div>
            {/* Community Involvement with Icon */}
            <div className="block transition-transform hover:scale-105 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faFileAlt}
                  className="text-blue-500 text-3xl mr-3"
                />
                <h3 className="font-semibold text-xl sm:text-2xl">
                Community Involvement
                </h3>
              </div>
              <p className="text-gray-800 text-lg sm:text-2xl">
                {investors.CommunityInvolvement}
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
              Risk Tolerance: {investors.RiskTolerance}
              </p><br/>
              <p className="text-gray-800 text-lg sm:text-2xl">
              FollowOn Investment Capacity: {investors.FollowOnInvestmentCapacity}
              </p><br/>
              <p className="text-gray-800 text-lg sm:text-2xl">
              CoInvestment Opportunities: {investors.CoInvestmentOpportunities}
              </p><br/>
              <p className="text-gray-800 text-lg sm:text-2xl">
              Mentorship Capabilities: {investors.MentorshipCapabilities}
              </p><br/>
            </div>

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
                Phone 1: {investors.Phone1}
              </p>
              {(investors.Phone2 != null && investors.Phone2.length != 0) &&
              <p className="text-gray-800 text-lg sm:text-2xl">
                Phone 2: {investors.Phone2}
              </p>
            }
              <p className="text-gray-800 text-lg sm:text-2xl">
                Email: {investors.BusinessEmail}
              </p>
            </div>

          


          
          </div>

        </div>
      <Footer />
    </div>
  );
};

export default AdminInvestorDetails;
