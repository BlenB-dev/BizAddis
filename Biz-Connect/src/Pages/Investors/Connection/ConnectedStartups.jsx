import {useState, useEffect} from "react";
import { FaPlus, FaRegLightbulb } from "react-icons/fa";
import { Link } from "react-router-dom";
import Footer from "../../Components/Footer";
import axios from 'axios';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { ContactsOutlined } from "@mui/icons-material";


const StartupCard = ({
  StartupID,
  startupName,
  businessDescription,
  industrySector,
  stageOfDevelopment,
  subCity,
  fundingRequirement,
  financialProjections,
}) => {
  const StoredStageOfDevelopment = ["Idea", "Prototype", "Early Revenue", "Growth", "Expansion"];

  const StoredIndustrySector = [
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
  
  const StoredFundingRequirement = [
      "< 100,000 ETB",
      "100,000 - 500,000 ETB",
      "500,000 - 1,000,000 ETB",
      "1,000,000 - 5,000,000 ETB",
      "> 5,000,000 ETB"
  ];
  
  
  const StoredSubCity = [
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
  
  


  return (
    <Link
      to={`/StartupDetails?StartupID=${StartupID}`}
      className="block transition-transform hover:scale-105"
    >
      <div className="absloute border w-[1300px]  ml-[-200px] rounded-lg p-10 bg-white shadow-lg mb-6">
        <div className="flex justify-between items-center ">
          <div>
            <h3 className="text-3xl font-semibold ml-[-15px] ">
              {startupName}
            </h3>
          </div>
        </div>
        <div className="mt-8 text-1xl ">
          <p className="text-dark mb-3 mediumText">
            <span className="font-bold mediumText">Business Description: </span>
            {businessDescription}
          </p>
          <p className="text-dark mb-3 mediumText">
            {" "}
            <span className="font-bold mediumText px-1 -ml-1">
              Industry Sector:
            </span>
            {StoredIndustrySector[industrySector-1]}
          </p>

          <p className="text-dark mb-3 mediumText">
            <span className="font-bold mediumText px-1 -ml-1">
              Stage Of Development:
            </span>
            {StoredStageOfDevelopment[stageOfDevelopment-1]}
            {/* {stageOfDevelopment} */}
          </p>

          <p className="text-dark mb-3 mediumText">
            {" "}
            <span className="font-bold mediumText px-1 -ml-1">
              Funding Requirement:
            </span>
            {StoredFundingRequirement[fundingRequirement-1]}
          </p>
          <p className="text-dark mb-3 mediumText">
            <span className="font-bold mediumText px-1 -ml-1">
              Financial Projections:
            </span>
            {financialProjections}
          </p>
          <p className="text-dark mb-3 mediumText">
            <span className="font-bold mediumText px-1 -ml-1">SubCity:</span>
            {StoredSubCity[subCity-1]}
          </p>


        </div>
      </div>
    </Link>
  );
};

const ConnectedStartups = () => {




  const [startups, setStartup] = useState([{
    StartupID : "Loading Startup ID",
    startupName: 'Loading Startup Name',
    founders: ['Loading Founders'],
    foundersBio: [ 'Loading Founders Bio'],
    businessDescription: 'Loading Business Description',
    industrySector: 1,
    businessModel: 1,
    stageOfDevelopment: 1,
    subCity: 1,
    fundingRequirement: 1,
  }]);


  const addFormValue = (newValue) => {

    setStartup((prevValues) => {
        const exists = prevValues.some(value => value.StartupID === newValue.StartupID);
        if (!exists) {
            return [...prevValues, newValue];
          }
      
          // If it exists, return the previous values without adding anything
          return prevValues;

    //   ...prevValues, // Spread the previous values to keep them
    //   newValue       // Add the new value
  });
  };

  useEffect(() => {
    const fetchData = async () => {
        setStartup([]);

        const token = localStorage.getItem('token');
  
      await axios.get("http://localhost:5000/api/GetConnectedStartups" ,{
        headers: {
          Authorization: `Bearer ${token}` // Attach the token in headers
        }
      }).then(async (response) => {
            if(response.data.length>0){
            for(let i = 0; i< response.data.length; i++) {
                addFormValue(
                    {
                      StartupID : response.data[i].StartupID,
                      startupName: response.data[i].StartupName,
                      businessDescription: response.data[i].BusinessDescription,
                      industrySector: response.data[i].IndustrySector,
                      subCity : response.data[i].SubCity,
                      financialProjections : response.data[i].FinancialProjection,
                      fundingRequirement : response.data[i].FundingRequirement,
                      stageOfDevelopment : response.data[i].StageOfDevelopment,
                  
                    }

                  );

                
            }
        }else console.log("Retrived Nothing")




      })
      .catch((err) => {
        console.log(err);                  
      })

    };

    fetchData();
  }, []);




  return (
    <div className="investor-container min-h-screen mt-[-84px] p-5 mx-auto max-w-7xl">
      <div className="text-center my-8">
        <h1 className="text-2xl font-bold">List of Startups You Have Connected To But Have Not Answered</h1>
      </div>


      <div className="relative flex space-x-8">
        <div className="w-[750px] p-10 ">
          <div className="space-y-6 ml-[150px]">
          {startups.length>0 ? (
            <div>
            {startups.map((start, index) => (
              <StartupCard key={index} {...start} />
            ))}
            </div>
        ):(
            <div className="text-center my-8">
        <h1 className="text-2xl font-bold">There are No Startups You Have Connected To But Have Not Answered Yet</h1>
      </div>

        )}
          </div>
        </div>
      </div>
      <div className="w-full mt-8">
        <hr className="border-gray-300" />
      </div>
      <Footer />
    </div>





  );
};

export default ConnectedStartups;
