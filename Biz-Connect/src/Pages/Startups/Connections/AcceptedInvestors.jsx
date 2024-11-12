import {useState, useEffect} from "react";
// import { FaPlus, FaRegLightbulb } from "react-icons/fa";
import { Link } from "react-router-dom";
import Footer from "../../Components/Footer";
import axios from 'axios';
// import { FaChevronDown, FaChevronUp } from "react-icons/fa";
// import { ContactsOutlined } from "@mui/icons-material";


const InvestorCard = ({
    InvestorID,
    InvestorName,
    InvestorBio,
    BusinessEmail,
    Phone1,
    Phone2,

}) => {

  return (
    <Link
      to={`/InvestorDetails?InvestorID=${InvestorID}`}
      className="block transition-transform hover:scale-105"
    >
      <div className="absloute border w-[1300px]  ml-[-200px] rounded-lg p-10 bg-white shadow-lg mb-6">
        <div className="flex justify-between items-center ">
          <div>
            <h3 className="text-3xl font-semibold ml-[-15px] ">
              {InvestorName}
            </h3>
          </div>
        </div>
        <div className="mt-8 text-1xl ">
          <p className="text-dark mb-3 mediumText">
            <span className="font-bold mediumText">Investor Bio: </span>
            {InvestorBio}
          </p>
          <p className="text-dark mb-3 mediumText">
            <span className="font-bold mediumText">Business Email: </span>
            {BusinessEmail}
          </p>
          <p className="text-dark mb-3 mediumText">
            <span className="font-bold mediumText">Phone 1: </span>
            {Phone1}
          </p>
          {Phone2 &&
          <p className="text-dark mb-3 mediumText">
            <span className="font-bold mediumText">Phone 2: </span>
            {Phone2}
          </p>
          }
        </div>
      </div>
    </Link>
  );
};

const AcceptedInvestors = () => {




  const [investors, setInvestors] = useState([{
    InvestorID : 'Loading Investor ID',
    InvestorName: 'Loading Investor Name',
    InvestorBio: 'Loading Investor Bio',
    BusinessEmail: 'Loading Business Email',
    Phone1: 'Loading Phone 1',
    Phone2: 'Loading Phone 2'

}]);

  const addFormValue = (newValue) => {

    setInvestors((prevValues) => {
        const exists = prevValues.some(value => value.InvestorID === newValue.InvestorID);
        if (!exists) {
            return [...prevValues, newValue];
          }
      
          // If it exists, return the previous values without adding anything
          return prevValues;

  });
  };

  useEffect(() => {
    const fetchData = async () => {
        setInvestors([]);

        const token = localStorage.getItem('token');
  
      await axios.get("http://localhost:5000/api/GetAcceptedInvestors" ,{
        headers: {
          Authorization: `Bearer ${token}` // Attach the token in headers
        }
      }).then(async (response) => {
            if(response.data.length>0){
            for(let i = 0; i< response.data.length; i++) {
                addFormValue(
                    {
                    InvestorID : response.data[i].InvestorID,
                    InvestorName: response.data[i].InvestorName,
                    InvestorBio: response.data[i].InvestorBio,
                    BusinessEmail: response.data[i].BusinessEmail,
                    Phone1: response.data[i].Phone1,
                    Phone2: response.data[i].Phone2,
                
                  }

                  );

            }
            console.log(response.data[0]);
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
        <h1 className="text-2xl font-bold">Investors Who You Have Accepted </h1>
      </div>


      <div className="relative flex space-x-8">
        <div className="w-[750px] p-10 ">
          <div className="space-y-6 ml-[150px]">
          {investors.length>0 ? (
            <div>
            {investors.map((start, index) => (
              <InvestorCard key={index} {...start} />
            ))}
            </div>
        ):(
            <div className="text-center my-8">
        <h1 className="text-2xl font-bold">There are No Investors You Have Accepted</h1>
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

export default AcceptedInvestors;