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

const AdminServiceProviderDetails = () => {

  // const [userRatings, setUserRatings] = useState(3.9); // State to hold ratings for each service provider
  // const [totalRatings, setTotalRatings] = useState(null); // State to hold ratings for each service provider
  const [UserData, setUserData] = useState(null);
  const navigate = useNavigate(); // useNavigate hook to programmatically navigate


  const [serviceProvider, setServiceProviders] = useState({
    ServiceProviderName: 'Loading',
    TypeOfService: ['Loading'],
    ServiceDescription: 'Loading',
    SubCity: 'Loading',
    ExperienceInIndustry: '',
    SpecificSectors: ['Loading'],
    PricingStructure: 'Loading',
    TeamSize: 0,
    PackageName: ['Loading'],
    PackageDetails: ['Loading'],
    AccrediationName: ['Loading'],
    AccrediationDetails: [''],
    ReferancesName: ['Loading'],
    ReferancesDetails: ['Loading'],
    // SignupDate: '2023-09-15 09:30:00',
    Phone1: 'Loading',
    Phone2: 'Loading',
    BusinessEmail: 'Loading',
    BusinessLocation: 'Loading',
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams(location.search);
      const service = queryParams.get('ServiceID');
    

      const newForm = {
        token : token,
        ServiceProviderID: service
      }
      console.log("New Form To Sent: " + JSON.stringify(newForm));
      //setServiceList([]);
  

      await axios.post("http://localhost:5000/api/GetServiceProviderProfileByID", newForm, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).then(async (response) => {
            console.log(response.data[0]);
            if(response.data.length>0){
                console.log("Number of Retrived Service Providers "+response.data.length)
                console.log(response.data);
                setUserData(response.data[0]);
        }else console.log("Retrived Nothing")

            console.log(JSON.stringify(serviceProvider));



      })
      .catch((err) => {
        console.log(err);                  
      })

    };

    fetchData();
  }, []);



  useEffect(() => {
    if(UserData){
    let OldAccrediationDetails = JSON.parse(UserData.AccrediationDetails);
    let OldAccrediationName = JSON.parse(UserData.AccrediationName);
    let OldBusinessLocation = UserData.BusinessLocation;
    let OldEmail = UserData.Email;
    let OldExperienceInIndustry = UserData.ExperienceInIndustry;
    let OldPackageDetails = JSON.parse(UserData.PackageDetails);
    let OldPackageName = JSON.parse(UserData.PackageName);
    let OldPricingStructure = UserData.PricingStructure;
    let OldReferancesDetails = JSON.parse(UserData.ReferancesDetails);
    let OldReferancesName = JSON.parse(UserData.ReferancesName);
    let OldPhone1 = UserData.Phone1;
    let OldPhone2 = UserData.Phone2;
    let OldServiceDescription = UserData.ServiceDescription;
    let OldServiceProviderName = UserData.ServiceProviderName;
    let OldSpecificSectors = JSON.parse(UserData.SpecificSectors);
    let OldSubCity = UserData.SubCity;
    let OldTeamSize = UserData.TeamSize;
    let OldTypeOfService = JSON.parse(UserData.TypeOfService);


    setServiceProviders({
 
    ServiceProviderName: OldServiceProviderName,
    TypeOfService: OldTypeOfService,
    ServiceDescription: OldServiceDescription,
    ExperienceInIndustry: OldExperienceInIndustry,
    SpecificSectors: OldSpecificSectors,
    PricingStructure: OldPricingStructure,
    TeamSize: OldTeamSize,
    PackageName: OldPackageName,
    PackageDetails: OldPackageDetails,
    AccrediationName: OldAccrediationName,
    AccrediationDetails: OldAccrediationDetails,
    ReferancesName: OldReferancesName,
    ReferancesDetails: OldReferancesDetails,
    Phone1: OldPhone1,
    Phone2: OldPhone2,
    BusinessEmail: OldEmail,
    BusinessLocation: OldBusinessLocation,
    SubCity: OldSubCity,
    image: null,
    });



  }
  },[UserData]);

  const  DeleteServiceProvider =  () => {
    
    const token = localStorage.getItem('token');
    const queryParams = new URLSearchParams(location.search);
    const service = queryParams.get('ServiceID');
  

    const newForm = {
      token : token,
      ServiceProviderID: service
    }

    console.log(newForm);

    axios.post("http://localhost:5000/api/AdminDeleteServiceProvider", newForm, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((response) => {
      console.log("Response")
      console.log(response.data.message);
      navigate('/AdminServiceProviderList');

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
                {serviceProvider.ServiceProviderName.charAt(0)}
              </div>
              <div className="ml-4">
                <h1 className="text-2xl mt-[65px] sm:text-4xl font-bold">
                  {serviceProvider.ServiceProviderName}
                </h1>
                <p className="text-gray-600 text-sm sm:text-lg">
                  {serviceProvider.TeamSize} employees •{" "}
                  {serviceProvider.SubCity}
                </p>
                {/* <p className="text-gray-800 text-lg sm:text-1xl">
                  <span className="text-gray-600 text-sm sm:text-lg">
                    Contact Info:{" "}
                  </span>
                  {ServiceProviders.ContactInformation}
                </p> */}
                {/* <div className="flex items-center">
                  <span className="text-yellow-500 text-lg mr-2">
                    {Array.from({
                      length: Math.floor(totalRatings),
                    }).map((_, i) => (
                      <FontAwesomeIcon key={i} icon={faStar} />
                    ))}
                  </span>
                  <span className="text-gray-600 text-lg">
                    {totalRatings}
                  </span>
                </div> */}
              </div>
            </div>
            <div >
              <button 
                className="bg-white-500 text-red-500 px-4 py-2 mx-5 rounded border border-red-500 hover:bg-red-500 hover:text-white"
                onClick={(e)=>{e.preventDefault(); DeleteServiceProvider();}}
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
            Service Details
          </h2>

          {/* Stacked Service Insights */}
          <div className="flex flex-col gap-6">

            {/* ServiceDescription with Icon */}
            <div className="block transition-transform hover:scale-105 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faFileAlt}
                  className="text-blue-500 text-3xl mr-3"
                />
                <h3 className="font-semibold text-xl sm:text-2xl">
                Service Description
                </h3>
              </div>
              <p className="text-gray-800 text-lg sm:text-2xl">
                {serviceProvider.ServiceDescription}
              </p>
            </div>

            {/* Type of Service with Icon */}
            <div className="block transition-transform hover:scale-105 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-red-500">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faList}
                  className="text-red-500 text-3xl mr-3"
                />
                <h3 className="font-semibold text-xl sm:text-2xl">
                Type Of Service
                </h3>
              </div>
              <div className="flex flex-wrap mt-4">
                {serviceProvider.TypeOfService.map((sector, index) => (
                  <span
                    key={index}
                    className="bg-blue-200 text-blue-800 px-3 py-1 sm:px-4 sm:py-2 rounded-full mr-2 mb-2 text-sm sm:text-lg"
                  >
                    {sector}
                  </span>
                ))}
              </div>
            </div>

            {/* Specific Sectors with Icon */}
            <div className="block transition-transform hover:scale-105 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-red-500">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faIndustry}
                  className="text-red-500 text-3xl mr-3"
                />
                <h3 className="font-semibold text-xl sm:text-2xl">
                  Specific Sectors
                </h3>
              </div>
              <div className="flex flex-wrap mt-4">
                {serviceProvider.SpecificSectors.map((sector, index) => (
                  <span
                    key={index}
                    className="bg-blue-200 text-blue-800 px-3 py-1 sm:px-4 sm:py-2 rounded-full mr-2 mb-2 text-sm sm:text-lg"
                  >
                    {sector}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience In Industry with Icon */}
            <div className="block transition-transform hover:scale-105 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faBriefcase}
                  className="text-blue-500 text-3xl mr-3"
                />
                <h3 className="font-semibold text-xl sm:text-2xl">
                Experience In Industry
                </h3>
              </div>
              <p className="text-gray-800 text-lg sm:text-2xl">
                {serviceProvider.ExperienceInIndustry}
              </p>
            </div>



            {/* Pricing Structure with Icon */}
            <div className="block transition-transform hover:scale-105 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faDollarSign}
                  className="text-blue-500 text-3xl mr-3"
                />
                <h3 className="font-semibold text-xl sm:text-2xl">
                  Pricing Structure
                </h3>
              </div>
              <p className="text-gray-800 text-lg sm:text-2xl">
                {serviceProvider.PricingStructure}
              </p>
            </div>



            {/* Available Packages with Icon */}
            {serviceProvider.PackageName.length>0 &&
            <>
            <div className="block transition-transform hover:scale-105 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faBoxOpen}
                  className="text-green-500 text-3xl mr-3"
                />
                <h3 className="font-semibold text-xl sm:text-2xl">
                  Available Packages
                </h3>
              </div>
              <div className=" mt-4">
                {serviceProvider.PackageName.map((pkg, index) => (
                  <>
                  <span
                    key={index}
                    className="bg-blue-200 text-blue-800 px-3 py-1 sm:px-4 sm:py-2 rounded-full mr-2 mb-2 text-sm sm:text-lg"
                  >
                    {pkg}
                  </span>
                  <br/><br/>
                  <p>{serviceProvider.PackageDetails[index]}</p>
                  <br/>
                  </>
                ))}
              </div>
            </div>
            </>
          }

            {/* Accrediations with Icon */}
            {serviceProvider.AccrediationName.length>0 &&
            <>
            <div className="block transition-transform hover:scale-105 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faAward}
                  className="text-green-500 text-3xl mr-3"
                />
                <h3 className="font-semibold text-xl sm:text-2xl">
                Accrediation and Certifications
                </h3>
              </div>
              <div className=" mt-4">
                {serviceProvider.AccrediationName.map((pkg, index) => (
                  <>
                  <span
                    key={index}
                    className="bg-blue-200 text-blue-800 px-3 py-1 sm:px-4 sm:py-2 rounded-full mr-2 mb-2 text-sm sm:text-lg"
                  >
                    {pkg}
                  </span>
                  <br/><br/>
                  <p>{serviceProvider.AccrediationDetails[index]}</p>
                  <br/>
                  </>
                ))}
              </div>
            </div>
            </>
          }

            {/* Referances with Icon */}
            {serviceProvider.ReferancesName.length>0 &&
            <>
            <div className="block transition-transform hover:scale-105 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faUsers}
                  className="text-green-500 text-3xl mr-3"
                />
                <h3 className="font-semibold text-xl sm:text-2xl">
                Referances
                </h3>
              </div>
              <div className=" mt-4">
                {serviceProvider.ReferancesName.map((pkg, index) => (
                  <>
                  <span
                    key={index}
                    className="bg-blue-200 text-blue-800 px-3 py-1 sm:px-4 sm:py-2 rounded-full mr-2 mb-2 text-sm sm:text-lg"
                  >
                    {pkg}
                  </span>
                  <br/><br/>
                  <p>{serviceProvider.ReferancesDetails[index]}</p>
                  <br/>
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
                Phone 1: {serviceProvider.Phone1}
              </p>
              {(serviceProvider.Phone2 != null && serviceProvider.Phone2.length != 0) &&
              <p className="text-gray-800 text-lg sm:text-2xl">
                Phone 2: {serviceProvider.Phone2}
              </p>
            }
              <p className="text-gray-800 text-lg sm:text-2xl">
                Email: {serviceProvider.BusinessEmail}
              </p>
              <p className="text-gray-800 text-lg sm:text-2xl">
                Address: {serviceProvider.BusinessLocation}
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

export default AdminServiceProviderDetails;
