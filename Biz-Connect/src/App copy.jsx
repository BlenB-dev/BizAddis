import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import FirstSection from "./components/FirstSection";
import Navbar from "./components/Navbar";
import OldNavbar from "./components/OldNavbar";

import ThiredSection from "./components/ThiredSection";
import Login from "./components/Pages/login";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Footer from "./components/Footer";
import InvestorPage from "./components/Pages/InvestorPage";
import MessageInDetail from "./components/Pages/MessageInDetail";
import InvestorsNavbar from "./components/InvestorsNavbar";
import ServiceProviders from "./components/Pages/ServiceProviders";
import InvestorsBio from "./components/Pages/InvestorsBio";
import StartupsPage from "./components/Pages/StartupsPage";
import StartupsNavbar from "./components/StartupsNavbar";
import "./components/Pages/style.css";
import "./components/Pages/DetailOfServiceProvider";
import DetailOfServiceProvider from "./components/Pages/DetailOfServiceProvider";
import DetailOfStartups from "./components/Pages/DetailOfStartups";
import SecondSection from "./components/SecondSection";
import FourthSection from "./components/FourthSection";
import DetailOfInvestors from "./components/Pages/DetailOfInvestors";
import JoinOption from "./components/Pages/JoinOption";
import FilterBar from "./components/Pages/FilterBar";

import FilterForAngleInvestors from "./components/Pages/FilterForAngleInvestors";
import FilterForStartups from "./components/Pages/FilterForStartups";
import StartupsBio from "./components/Pages/StartupsBio";
import ServiceProviderNavbar from "./components/ServiceProviderNavbar";
import ServiceProviderBio from "./components/Pages/ServiceProviderBio";
import ProfileSettingsPageForServiceProvider from "./components/Pages/ProfileSettingsPageForServiceProvider";
import ProfileSettingsPageForStartups from "./components/Pages/ProfileSettingsPageForStartups";
import ProfileSettingsPageForInvestors from "./components/Pages/ProfileSettingsPageForInvestors";
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

// import InvestorHome from "./Pages/Investors/Home";
import StartupForm from "./Pages/Startups/ProfileCreate"
import ServiceProviderForm from "./Pages/ServiceProviders/ProfileCreate"
import InvestorForm from "./Pages/Investors/ProfileCreate"

const Maincontent = () => {
  const [backendData, setBackendData] = useState("...Pending");
  const [userName, setUserName] = useState("Not Logged In Yet");
  // useEffect(() => {
  //   fetch("/api/auth/trial")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setBackendData(JSON.stringify(data));
  //     })
  //     .catch((err) => console.log(err));
  // },[]);
  // useEffect(() => {
  //   try {
  //     const response = axios.post('http://localhost:5000/api/auth/trial');
  //     const data = response.data.json();
  //     setBackendData(JSON.stringify(data)) // Save token to localStorage
  //     // setToken(token);
  //     // setMessage(response.data.message);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },[]);

  // useEffect(() => {
  //     axios.get('http://localhost:5000/api/auth/trial')
  //       .then((response) => response.json())
  //       .then((data) => {setBackendData(JSON.stringify(data));})
  //       .catch((err) => {console.log(err)});
  // },[]);
  const [inputData, setInputData] = useState(''); // State to hold input data
  const navigate = useNavigate(); // useNavigate hook to programmatically navigate

  const handleSubmit = () => {
    // Navigate to the second page and pass data using state
    navigate('/NewStartupForm', { state: { inputData } });
  };

  const getProfile = () => {
    console.log("Getting Profile");
    const token = localStorage.getItem('token');

    axios.get('http://localhost:5000/api/profile' ,{
      headers: {
        Authorization: `Bearer ${token}` // Attach the token in headers
      }
    })
      .then((response) => {setBackendData(JSON.stringify(response.data.user.username));})
      .catch((err) => {console.log(err)});
};


  // useEffect(() => {
  //   const savedToken = localStorage.getItem('User');
  //   if (savedToken) {
  //     setUserName(savedToken);
  //   }
  // }, []);


  const location = useLocation();
  return (
    <div className="dark:text-white min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
    <div id="BackendCheck">
      {/* Backend Data : {backendData}<br/> */}
      Profile: {backendData} <br/>
      <button 
            onClick={(e) => {
              e.preventDefault();
              getProfile();
              }
              }

            className="w-full bg-red-500 text-white py-2 rounded"
          >
            Get Profile
          </button>

      {/* UserName : {userName} */}
    </div>
      {/* <div id="BackendCheck" >
      {(typeof backendData !== 'object') ? (
        <div>
        <h2>BackEnd Not Connected</h2>
        </div>
      ) : (
        <div>
        <h2>BackEnd Connected</h2>
        { <table>
          <th>startup1</th>
      
        </table> }
        {<tbody>
          {
            backendData.map((d, i) => (
              <tr key={i}>
              <td>{d.startup1}</td>
         
              </tr>

         )) }
        </tbody> }
          
   
       
        </div>
      )
      }
    </div> */}
      {location.pathname === "/" && <Navbar />}
      {location.pathname === "/login" && <Navbar />}
      {location.pathname === "/MessageInDetail" && <InvestorsNavbar />}

      {location.pathname === "/InvestorPage" && <InvestorsNavbar />}
      {location.pathname === "/InvestorHome" && <InvestorsNavbar />}
      {location.pathname === "/InvestorsBio" && <InvestorsNavbar />}
      {location.pathname === "/DetailOfInvestors" && <StartupsNavbar />}
      {location.pathname === "/ProfileSettingsPageForInvestors" && (<InvestorsNavbar /> )}
 
      {location.pathname === "/ServiceProviders" && <ServiceProviderNavbar />}
      {location.pathname === "/DetailOfServiceProvider" && <StartupsNavbar />}
      {location.pathname === "/ServiceProviderBio" && <ServiceProviderNavbar />}
      {location.pathname === "/ProfileSettingsPageForServiceProvider" && (<ServiceProviderNavbar /> )}

      {location.pathname === "/Startups" && <StartupsNavbar />}
      {location.pathname === "/StartupsPage" && <StartupsNavbar />}
      {location.pathname === "/StartupsBio" && <StartupsNavbar />}
      {location.pathname === "/DetailOfStartups" && <StartupsNavbar />}
      {location.pathname === "/NewStartupForm" && <StartupsNavbar />}
      {location.pathname === "/NewServiceProviderForm" && <StartupsNavbar />}
      {location.pathname === "/ProfileSettingsPageForStartups" && (<StartupsNavbar /> )}

      <div className="max-w-7xl mx-auto pt-20 px-6">
        <Routes>
          {/* <Route path="/InvestorHome" element={<InvestorHome />} /> */}


          <Route path="/login" element={<Login />} />
          <Route path="/NewStartupForm" element={<StartupForm />} />
          <Route path="/NewServiceProviderForm" element={<ServiceProviderForm />} />
          <Route path="/NewInvestorForm" element={<InvestorForm />} />
          <Route path="/InvestorPage" element={<InvestorPage />} />
          <Route path="/ServiceProviders" element={<ServiceProviders />} />
          <Route path="/InvestorsBio" element={<InvestorsBio />} />
          <Route path="/MessageInDetail" element={<MessageInDetail />} />
          <Route path="/StartupsPage" element={<StartupsPage />} />
          <Route path="/JoinOption" element={<JoinOption />} />
          <Route path="/DetailOfInvestors" element={<DetailOfInvestors />} />
          <Route path="/FilterBar" element={<FilterBar />} />
          <Route path="/StartupsBio" element={<StartupsBio />} />
          <Route path="/ServiceProviderBio" element={<ServiceProviderBio />} />

          <Route
            path="/ProfileSettingsPageForServiceProvider"
            element={<ProfileSettingsPageForServiceProvider />}
          />
          <Route
            path="/ProfileSettingsPageForStartups"
            element={<ProfileSettingsPageForStartups />}
          />
          <Route
            path="/ProfileSettingsPageForInvestors"
            element={<ProfileSettingsPageForInvestors />}
          />
          <Route
            path="/FilterForAngleInvestors"
            element={<FilterForAngleInvestors />}
          />
          <Route path="/FilterForStartups" element={<FilterForStartups />} />
          <Route
            path="/DetailOfServiceProvider"
            element={<DetailOfServiceProvider />}
          ></Route>

          <Route
            path="/DetailOfStartups"
            element={<DetailOfStartups />}
          ></Route>
          <Route
            path="/"
            element={
              <>
                <FirstSection />
                <SecondSection />
                <ThiredSection />
                <FourthSection />
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Maincontent />
    </Router>
  );
};

export default App;
