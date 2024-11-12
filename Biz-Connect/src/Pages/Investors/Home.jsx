import {useState, useEffect} from "react";
import { FaRegLightbulb } from "react-icons/fa";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer";
import axios from 'axios';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";


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

const InvestorPage = () => {
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
  }]);

  // Initialize the states with indexes + 1 of all items selected by default
  const [selectedStageOfDevelopment, setSelectedStageOfDevelopment] = useState(StageOfDevelopment.map((_, i) => i + 1));
  const [selectedIndustrySector, setSelectedIndustrySector] = useState(IndustrySector.map((_, i) => i + 1));
  const [selectedFundingRequirement, setSelectedFundingRequirement] = useState(FundingRequirement.map((_, i) => i + 1));
  const [selectedSubCity, setSelectedSubCity] = useState(SubCity.map((_, i) => i + 1));
  const [selectName, setSelectName] = useState('');
  const [searchCount, setSearchCount] = useState(0);

  useEffect(()=>{
    console.log("selectedStageOfDevelopment: " + JSON.stringify(selectedStageOfDevelopment));
    console.log("selectedIndustrySector: " + selectedIndustrySector);
    console.log("selectedFundingRequirement: " + selectedFundingRequirement);
    console.log("selectedSubCity: " + selectedSubCity);

  },[selectedStageOfDevelopment,selectedIndustrySector, selectedFundingRequirement, selectedSubCity])


  // States to control visibility
  const [showStageOfDevelopment, setShowStageOfDevelopment] = useState(false);
  const [showIndustrySector, setShowIndustrySector] = useState(false);
  const [showFundingRequirement, setShowFundingRequirement] = useState(false);
  const [showSubCity, setShowSubCity] = useState(false);

  // Handle checkbox change by index + 1
  const handleCheckboxChange = (event, setSelected, selected) => {
    const index = parseInt(event.target.value); // Get index from value
    if (event.target.checked) {
      setSelected([...selected, index]);
    } else {
      setSelected(selected.filter(item => item !== index));
    }
  };

  // Check all functionality (select all indexes + 1)
  const handleCheckAll = (items, setSelected) => {
    setSelected(items.map((_, i) => i + 1));
  };

  // Uncheck all functionality (clear all selections)
  const handleUncheckAll = (setSelected) => {
    setSelected([]);
  };


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
      const token = localStorage.getItem('token');
      console.log("Fetching Data");
      console.log("Token: " + token);
      console.log("New Filter Settings")
      // console.log(NewFilterSetting);

      const newForm = {
        token : token,
        StartupName: selectName,
        InSoD: JSON.stringify(selectedStageOfDevelopment),
        InIS:JSON.stringify(selectedIndustrySector),
        InFR:JSON.stringify(selectedFundingRequirement),
        InSC:JSON.stringify(selectedSubCity),
      }
      console.log("New Form To Sent: " + JSON.stringify(newForm));
      setStartup([]);
  

      await axios.post("http://localhost:5000/api/GetFilteredStartupProfiles", newForm, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).then(async (response) => {
            console.log(response.data);
            if(response.data.length>0){
                console.log("Number of Retrived Startups "+response.data.length)
            for(let i = 0; i< response.data.length; i++) {
              // let stageOfDevelopmentdata = 
              // let financialData = 
              // console.log("Financial Data: "+financialData+"\n Development City Data: "+stageOfDevelopmentdata);
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
                  // console.log(`
                  //   StartupID : ${response.data[i].StartupID},
                  //   startupName: ${response.data[i].StartupName},
                  //   businessDescription: ${response.data[i].BusinessDescription},
                  //   industrySector: ${response.data[i].IndustrySector},
                  //   stageOfDevelopment:${response.data[i].StageOfDevelopment},
                  //   subCity : ${response.data[i].SubCity},
                  //   financialProjections : ${response.data[i].FinancialProjection}, 
                  //   fundingRequirement : ${response.data[i].FundingRequirement},
                  //   `
                  // )
                  // console.log(startups[i]);

                          

                
            }
            console.log("Showing Startups");
            console.log(startups);
        }else console.log("Retrived Nothing")




      })
      .catch((err) => {
        console.log(err);                  
      })

    };

    fetchData();
  }, [selectedStageOfDevelopment,selectedIndustrySector, selectedFundingRequirement, selectedSubCity, searchCount]);



  return (
    <div className="investor-container min-h-screen mt-[-84px] p-5 mx-auto max-w-7xl">
      <div className="text-center my-8">
        <h1 className="text-2xl font-bold">Yous can search any Startups</h1>
      </div>

      <div className="search-container flex flex-col md:flex-row justify-between items-start mb-6 w-full">
        <input
          type="text"
          placeholder="Search React Native mobile developer"
          className="p-3 border border-gray-300 rounded-lg focus:outline-none w-full"
          value={selectName}
          onChange={(e)=>{
            setSelectName(e.target.value);
          }}
        />
        <button
          className="bg-green-500 whitespace-nowrap text-white p-3 rounded-lg w-full md:w-auto mt-2 md:mt-0 md:ml-4"
          style={{ height: "auto" }}
          onClick={(e)=>{
            e.preventDefault();
            let counter = searchCount ? searchCount : 0;
            counter++;
            setSearchCount(counter);
            console.log("Search Count: " + counter);
          }}

        >
          Search
        </button>
      </div>
      <div className="flex space-x-4">
        <a
          href="/RecommendedStartups"
          className="text-red-500 border border-red-500 px-3 py-1 rounded-full flex items-center hover:bg-red-500 hover:text-white transition"
        >
          <FaRegLightbulb className="mr-2 text-black" /> Recommendations
        </a>

      </div>

      <div className="relative flex space-x-8">
        <div className="w-[750px] p-10 ">
          <div className="space-y-6 ml-[150px]">
            {startups.map((start, index) => (
              <StartupCard key={index} {...start} />
            ))}
          </div>
        </div>
        <div className="relative flex space-x-8">
          <div className="w-[300px] ml-[-1150px] p-4 mt-[-20px] ">
            <div className="Filter">

              <div>
                <br/>
                <button
                    className="border-2 px-4 py-2 rounded-lg flex justify-between items-center w-full bg-white hover:bg-gray-100"
                    onClick={() => setShowStageOfDevelopment(!showStageOfDevelopment)}
                  >
                    <span>Stage of Development</span>
                    {showStageOfDevelopment ? (
                      <FaChevronUp className="ml-2" />
                    ) : (
                      <FaChevronDown className="ml-2" />
                    )}
                  </button>
                {/* <button className="border-4 height-10" onClick={() => setShowStageOfDevelopment(!showStageOfDevelopment)}>
                  {showStageOfDevelopment ? 'Hide' : 'Show'} Stage of Development
                </button><br/> */}
                {showStageOfDevelopment && (
                  <div >
                    <br/>
                    <button className="border-2 px-3 py-1 rounded-lg flex justify-between items-center w-full bg-white hover:bg-blue-100" onClick={() => handleCheckAll(StageOfDevelopment, setSelectedStageOfDevelopment)}>Check All</button><br/>
                    <button className="border-2 px-3 py-1 rounded-lg flex justify-between items-center w-full bg-white hover:bg-blue-100" onClick={() => handleUncheckAll(setSelectedStageOfDevelopment)}>Uncheck All</button><br/>
                    {StageOfDevelopment.map((stage, index) => (
                      <label key={index}>
                        <input
                          type="checkbox"
                          value={index + 1}  // Use the index + 1 as the value
                          checked={selectedStageOfDevelopment.includes(index + 1)}
                          onChange={(e) => handleCheckboxChange(e, setSelectedStageOfDevelopment, selectedStageOfDevelopment)}
                        />
                        {stage}
                        <br/>
                      </label>
                    ))}
                  </div>
                )}
                <br/>

                <button
                    className="border-2 px-4 py-2 rounded-lg flex justify-between items-center w-full bg-white hover:bg-gray-100"
                    onClick={() => setShowIndustrySector(!showIndustrySector)}
                  >
                    <span>Industry Sector</span>
                    {showIndustrySector ? (
                      <FaChevronUp className="ml-2" />
                    ) : (
                      <FaChevronDown className="ml-2" />
                    )}
                  </button>
                {showIndustrySector && (
                  <div>
                  <br/>
                    <button className="border-2 px-3 py-1 rounded-lg flex justify-between items-center w-full bg-white hover:bg-blue-100" onClick={() => handleCheckAll(IndustrySector, setSelectedIndustrySector)}>Check All</button><br/>
                    <button className="border-2 px-3 py-1 rounded-lg flex justify-between items-center w-full bg-white hover:bg-blue-100" onClick={() => handleUncheckAll(setSelectedIndustrySector)}>Uncheck All</button><br/>
                    {IndustrySector.map((sector, index) => (
                      <label key={index}>
                        <input
                          type="checkbox"
                          value={index + 1}  // Use the index + 1 as the value
                          checked={selectedIndustrySector.includes(index + 1)}
                          onChange={(e) => handleCheckboxChange(e, setSelectedIndustrySector, selectedIndustrySector)}
                        />
                        {sector}
                        <br/>
                      </label>
                    ))}
                  </div>
                )}
                <br/>
                <button
                    className="border-2 px-4 py-2 rounded-lg flex justify-between items-center w-full bg-white hover:bg-gray-100"
                    onClick={() => setShowFundingRequirement(!showFundingRequirement)}
                  >
                    <span>Funding Requirement</span>
                    {showFundingRequirement ? (
                      <FaChevronUp className="ml-2" />
                    ) : (
                      <FaChevronDown className="ml-2" />
                    )}
                  </button>

                {showFundingRequirement && (
                  <div>
                    <br/>
                    <button className="border-2 px-3 py-1 rounded-lg flex justify-between items-center w-full bg-white hover:bg-blue-100" onClick={() => handleCheckAll(FundingRequirement, setSelectedFundingRequirement)}>Check All</button><br/>
                    <button className="border-2 px-3 py-1 rounded-lg flex justify-between items-center w-full bg-white hover:bg-blue-100" onClick={() => handleUncheckAll(setSelectedFundingRequirement)}>Uncheck All</button><br/>
                    {FundingRequirement.map((funding, index) => (
                      <label key={index}>
                        <input
                          type="checkbox"
                          value={index + 1}  // Use the index + 1 as the value
                          checked={selectedFundingRequirement.includes(index + 1)}
                          onChange={(e) => handleCheckboxChange(e, setSelectedFundingRequirement, selectedFundingRequirement)}
                        />
                        {funding}
                        <br/>
                      </label>
                    ))}
                  </div>
                )}
                <br/>
                <button
                    className="border-2 px-4 py-2 rounded-lg flex justify-between items-center w-full bg-white hover:bg-gray-100"
                    onClick={() => setShowSubCity(!showSubCity)}
                  >
                    <span>SubCity</span>
                    {showSubCity ? (
                      <FaChevronUp className="ml-2" />
                    ) : (
                      <FaChevronDown className="ml-2" />
                    )}
                  </button>


                {/* <button onClick={() => setShowSubCity(!showSubCity)}>
                  {showSubCity ? 'Hide' : 'Show'} SubCity
                </button><br/> */}
                {showSubCity && (
                  <div>
                  <br/>
                    <button className="border-2 px-3 py-1 rounded-lg flex justify-between items-center w-full bg-white hover:bg-blue-100" onClick={() => handleCheckAll(SubCity, setSelectedSubCity)}>Check All</button><br/>
                    <button className="border-2 px-3 py-1 rounded-lg flex justify-between items-center w-full bg-white hover:bg-blue-100" onClick={() => handleUncheckAll(setSelectedSubCity)}>Uncheck All</button><br/>
                    {SubCity.map((subCity, index) => (
                      <label key={index}>
                        <input
                          type="checkbox"
                          value={index + 1}  // Use the index + 1 as the value
                          checked={selectedSubCity.includes(index + 1)}
                          onChange={(e) => handleCheckboxChange(e, setSelectedSubCity, selectedSubCity)}
                        />
                        {subCity}
                        <br/>
                      </label>
                    ))}
                  </div>
                )}

                {/* Display selected items by index + 1 */}
                {/* <div>
                  <h4>Selected Stage of Development Indexes:</h4>
                  <p>{selectedStageOfDevelopment.join(', ')}</p>

                  <h4>Selected Industry Sector Indexes:</h4>
                  <p>{selectedIndustrySector.join(', ')}</p>

                  <h4>Selected Funding Requirement Indexes:</h4>
                  <p>{selectedFundingRequirement.join(', ')}</p>

                  <h4>Selected SubCity Indexes:</h4>
                  <p>{selectedSubCity.join(', ')}</p>
                </div> */}
              </div>


            </div>
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

export default InvestorPage;
