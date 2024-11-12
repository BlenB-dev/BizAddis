import {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import Footer from "../../Components/Footer";
import axios from 'axios';

const StartupCard = ({
  StartupID,
  startupName,
  startupEmail,
  phone1, 
  phone2,

}) => {

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
            <span className="font-bold mediumText">Email: </span>
            {startupEmail}
          </p>
          <p className="text-dark mb-3 mediumText">
            {" "}
            <span className="font-bold mediumText px-1 -ml-1">
              Phone 1:
            </span>
            {phone1}
          </p>
            {phone2 && 
                <p className="text-dark mb-3 mediumText">
                    <span className="font-bold mediumText px-1 -ml-1">
                    Phone 2:
                    </span>
                    {/* {StoredStageOfDevelopment[stageOD-1]} */}
                    {phone2}
                </p>
            }

        </div>
      </div>
    </Link>
  );
};

const AcceptedStartups = () => {

  const [startups, setStartup] = useState([{
    StartupID : "Loading Startup ID",
    startupName: 'Loading Startup Name',
    startupEmail: 'Loading Startup Email',
    phone1: 'Loading Phone 1',
    phone2: 'Loading Phone 2',

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
  
      await axios.get("http://localhost:5000/api/GetAcceptedStartups" ,{
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
                        startupEmail: response.data[i].StartupEmail,
                        phone1: response.data[i].Phone1,
                        phone2: response.data[i].Phone2
                    
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
        <h1 className="text-2xl font-bold">List of Startups Who Accepted Connection</h1>
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
        <h1 className="text-2xl font-bold">There are No Startups Who Have Accepted Connection</h1>
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

export default AcceptedStartups;
