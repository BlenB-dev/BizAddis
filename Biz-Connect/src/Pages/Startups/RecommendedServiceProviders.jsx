import Footer from "../Components/Footer";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import axios from 'axios';

const ServiceProviderCard = ({
    ServiceProviderID, ServiceProviderName,ServiceDescription, TypeOfService, SpecificSectors, SubCity  
}) => {
    return (
      <Link
        // to='/ServiceProviderDetail/'
        to={`/ServiceProviderDetail/?ServiceID=${ServiceProviderID}`}
        // to={{
        //   pathname: "/ServiceProviderDetail",
        //   state: { serviceID: ServiceProviderID }
        // }}
        className="block transition-transform hover:scale-105"
      >
        <div className="absloute border w-[900px]  ml-[100px] rounded-lg p-10 bg-white shadow-lg mb-6">
          <div className="flex justify-between items-center p-3">
            <div>
              <div>
                <h3 className="text-3xl font-semibold ml-[-15px] ">{ServiceProviderName}</h3>
                <p className="text-dark mediumText mb-3">
                  <span className="p-3 -ml-3 font-bold ">Location:-</span>
                  {SubCity}
                </p>
              </div>
              <div className="flex space-x-4 absolute ml-[690px] mt-[80px]">
                <a
                  href="/SPDetail/?ServiceID=${ServiceProviderID}"
                  className="text-red-500  whitespace-nowrap border border-red-500 px-3 py-1 rounded-full hover:bg-red-500 hover:text-white transition"
                >
                  View Details
                </a>
              </div>
              <p className="text-dark mediumText -mt-4 mb-3">
                <span className="p-3 -ml-3 font-bold">Servicedescription:</span>
                <div className="">
                  {ServiceDescription.split(".").map((sentence, index) => (
                    <span key={index}>
                      {sentence.trim() && <>{sentence.trim()}.</>}
                      <br />
                    </span>
                  ))}
                </div>
              </p>
            </div>
          </div>
  
          <div className="flex justify-between items-center mt-4 ">
            <div className="flex space-x-2 ml-3">
              {TypeOfService.map((services, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-black px-3 py-1 rounded-full text-sm"
                >
                  {services}
                </span>
              ))}
              {SpecificSectors.map((sectors, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-black px-3 py-1 rounded-full text-sm"
                >
                  {sectors}
                </span>
              ))}

            </div>
          </div>
        </div>
      </Link>
    );
  };


const RecommendedServiceProviders = () => {

    const [serviceList, setServiceList] = useState([
        {
            ServiceProviderID: "Loading",
            ServiceProviderName: "Loading",
            ServiceDescription: "Loading",
            TypeOfService: [
              "Loading",
            ],
            SpecificSectors: ["Loading"],
            SubCity: "Loading",
          },

      
    ]);
    
      const addFormValue = (newValue) => {

        setServiceList((prevValues) => {
            const exists = prevValues.some(value => value.ServiceProviderID === newValue.ServiceProviderID);
            if (!exists) {
                return [...prevValues, newValue];
              }
          
              // If it exists, return the previous values without adding anything
              return prevValues;
    
      });
      };
    

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      console.log("Fetching Data");
      console.log("Token: " + token);
      setServiceList([]);
  

      await axios.get("http://localhost:5000/api/GetRecommendedServiceProviders", {
        headers: {
          Authorization: `Bearer ${token}` // Attach the token in headers
        }
      }).then(async (response) => {
            console.log(response.data);
            if(response.data.length>0){
                console.log("Number of Retrived Service Providers "+response.data.length)
            for(let i = 0; i< response.data.length; i++) {
                addFormValue(
                    {
                        ServiceProviderID : response.data[i].ServiceProviderID,
                        ServiceProviderName: response.data[i].ServiceProviderName,
                        ServiceDescription: response.data[i].ServiceDescription,
                        TypeOfService: JSON.parse(response.data[i].TypeOfService),
                        SpecificSectors:JSON.parse(response.data[i].SpecificSectors),
                        SubCity : response.data[i].SubCity,   
                        
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
          <div className="investor-container min-h-screen ml-[2px] -mt-10  p-5 mx-auto max-w-7xl">
            <div className="text-center my-8">
              <h1 className="text-2xl font-bold">
                List of Recommended Service Providers
              </h1>
            </div>
      
            <div className="relative flex space-x-8">
                <div className="p-10 ">
                    <div className="space-y-6 ml-[50px]">

                    {(serviceList.length > 0  &&  Array.isArray(serviceList))? (
                        <>
                        {serviceList.map((provider, index) => (
                        <ServiceProviderCard key={index} {...provider} />
                    ))}
                    </>

                    ):(
                        <h1>There Are No Recommended Service Providers</h1>

                    )}
                    
                    </div>
                </div>
                {/* <div className="relative flex space-x-8">
                    <div className="w-[300px] ml-[-900px] p-4 mt-[44px] ">
                    <FilterForStartups />
                    </div>
                </div> */}
                </div>

            <div className="w-full mt-8">
              <hr className="border-gray-300" />
            </div>
            <Footer />
          </div>
        );
      };
      
      
  
  export default RecommendedServiceProviders;
  