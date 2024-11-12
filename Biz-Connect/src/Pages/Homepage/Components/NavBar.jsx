import { useState } from "react";
import { FaBars, FaSignInAlt, FaChevronDown, FaUserPlus } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar,faBriefcase, faUserTie }  from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';

import SignUpDetails from "./SignUpModal";
import Login from "./LoginModal";
import JoinOption from "./SignUpOptions";
import WaitModal from "./WaitModal";
import ErrorMessageModal from "./ErrorMessageModal";

import logo from "../../../assets/logo.png";

import axios from 'axios';



const Navbar = () => {
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [isJoinOptionsOpen, setIsJoinOptionsOpen] = useState(false);
  const [isWaitModalOpen, setIsWaitModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState(null);
  const [currentView, setCurrentView] = useState("home");
  const navigate = useNavigate(); // useNavigate hook to programmatically navigate

  const [ErrorMessage, setErrorMessage] = useState('');


  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const toggleMobileDropdown = () => setIsMobileDropdownOpen((prev) => !prev);
  const handleSignInClick = () => {
    setIsLoginOpen(true);
  };

  const closeModal = () => {
    setIsLoginOpen(false);
  };

  const openJoinModal = () => {
    setIsJoinOptionsOpen(true);
  };
  const closeJoinModal = () => {
    setIsJoinOptionsOpen(false);
  };
  const closeErrorMessageModal = () => {
    setIsErrorModalOpen(false);
    setErrorMessage('');
  }
  
  const handleUserTypeSelect = (userType) => {
    setSelectedUserType(userType);
  };
  const handleBack = () => {
    setCurrentView(null);
    openJoinModal();
  };

  const handleContinue = () => {
    if (selectedUserType) {
      setCurrentView(selectedUserType);
      closeJoinModal();
    } else {
      alert("Please select an option first!");
    }
  };
  const gotoSignIn = () => {
    closeJoinModal();
    setIsLoginOpen(true);

  }
  const gotoSignUp = () => {
    setIsLoginOpen(false);
    setCurrentView(null);
    openJoinModal();


  }
  const handleClose = () => {
    setCurrentView(null);
  };

  const handleLogin = async (userNameEmail, userPassword) => {
    // setIsWaitModalOpen(true);
    setIsWaitModalOpen(true);


    axios.post('http://localhost:5000/api/auth/login', { userNameEmail, userPassword })
    .then((response) => {
      const token = response.data.token;
      localStorage.setItem('token', token); 
      setIsLoginOpen(false);
      setCurrentView(null);
      closeJoinModal();
      setIsWaitModalOpen(false);
  
      if(response.data.message == "Investor") navigate('/InvestorHome');
      if(response.data.message == "Service Provider") navigate('/ServiceProvider');
      if(response.data.message == "Startup") navigate('/StartupHome');
      if(response.data.message == "Administrator") navigate('/AdminStartupList');
      else console.log("No Message: "+response.data.message);  
    })
    .catch((err) => {

      setErrorMessage(err.response.data.message);
      setIsWaitModalOpen(false);
      setIsErrorModalOpen(true);
    });

  };

  const handleSignup = async (username, email, password, userType) => {
    // alert("Username: " + username + "\nEmail: " + email + "\nPassword: "+password+"\nUserType: " + userType);
    setIsWaitModalOpen(true);
    setIsLoginOpen(false);
    setCurrentView(null);
    closeJoinModal();

    axios.post('http://localhost:5000/api/auth/signup', { username, email, password, userType })
    .then((response) => {
      setIsLoginOpen(false);
      setCurrentView(null);
      closeJoinModal();
      setIsWaitModalOpen(false);
  
      if(response.data.message) {
        setErrorMessage(JSON.stringify(response.data.message))
        setIsWaitModalOpen(false);
        setIsErrorModalOpen(true);
      }
      else console.log("No Message");  
    })
    .catch((err) => {
      setErrorMessage(err.response.data.message);
      setIsWaitModalOpen(false);
      setIsErrorModalOpen(true);

      // console.log(err)
    });

  };

  const scrollToFeatures = () => {
    document.getElementById("features").scrollIntoView({ behavior: "smooth" });
  };
  // Scroll to the Third Section (Business Decisions)
  const scrollToBusinessDecisions = () => {
    document.getElementById("business-decisions").scrollIntoView({
      behavior: "smooth",
    });
  };
  // Scroll to the Fourth Section (Plan Your Project)
  const scrollToProjectBrief = () => {
    const projectSection = document.getElementById("project-brief");
    if (projectSection) {
      projectSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact-section");
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const renderSelectedUI = () => {
    switch (currentView) {
      case "Startups":
        return <SignUpDetails onClose={handleClose} onBack={handleBack} signupType="Startup" handleSignup={handleSignup}/>
      case "Investors":
        return <SignUpDetails onClose={handleClose} onBack={handleBack} signupType="Investor" handleSignup={handleSignup}/>
      case "ServiceProvider":
        return <SignUpDetails onClose={handleClose} onBack={handleBack} signupType="Service Provider" handleSignup={handleSignup}/>
      default:
        return null;        
    }
  };

  return (
    <div>
      <header className="bg-gray-900 text-white">
        <div className="flex justify-between items-center py-2 px-6">
          <div className="flex items-center flex-shrink-0">
            <img className="h-10 w-10 mr-2" src={logo} alt="Logo" />
            <a
              href="/"
              className="tracking-tight text-white text-xl font-medium hover:scale-105 dark:text-white hover:text-white-600 dark:hover:text-blue-400 flex items-center space-x-2"
            >
              Biz-Connect
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {/* <div className="relative w-64">
              <input
                type="text"
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-full focus:outline-none"
                placeholder="Search"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                🔍
              </button>
            </div> */}

            <button
              onClick={handleSignInClick}
              className="hover:underline flex items-center"
            >
              <FaSignInAlt className="mr-2" /> Sign In
            </button>
            <button
              onClick={openJoinModal}
              className="px-4 py-2 border border-white rounded-full hover:bg-white hover:text-black"
            >
              Join
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-800 focus:outline-none"
            >
              <FaBars size={24} className="text-white" />
            </button>
          </div>
        </div>

        <hr className="border-t boder-gray-700" />

        {isMenuOpen && (
          <div className="md:hidden bg-gray-800 p-4 space-y-4">
            <a
              href="/StartupsPage"
              className="block text-white hover:text-blue-600"
            >
              <i className="fas fa-lightbulb  mr-2"></i>
              Startups
            </a>

            <a
              href="/InvestorPage"
              className="block text-white hover:text-blue-600"
            >
              <i className="fas fa-user-tie mr-2"></i>
              Investors
            </a>
            <button
              onClick={openJoinModal}
              className="flex items-center block text-white hover:text-blue-600"
            >
              <FaUserPlus className="mr-2" />
              Join
            </button>

            <button
              onClick={handleSignInClick}
              className="flex items-center block text-white hover:text-blue-600"
            >
              <FaSignInAlt className="mr-2" />
              Sign In
            </button>

            <button
              onClick={toggleMobileDropdown}
              className="w-full flex items-center text-white hover:text-blue-600 "
            >
              <i className="fas fa-briefcase mr-2"></i>
              Business Services <FaChevronDown className="ml-1" />
            </button>

            {isMobileDropdownOpen && (
              <div className="bg-gray-700 p-2 rounded-md mt-2">
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="block text-white hover:text-blue-400"
                    >
                      Sales Outsourcing
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block text-white hover:text-blue-400"
                    >
                      Customer Support
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block text-white hover:text-blue-400"
                    >
                      Lead Generation
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block text-white hover:text-blue-400"
                    >
                      Lead Qualification
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
        <div className="hidden md:flex mediumText justify-center bg-white text-dark space-x-8 py-2 text-lg">
  {/* Scroll to the Features section when the Features tab is clicked */}
  <button onClick={scrollToFeatures} className="hover:underline">
    <FontAwesomeIcon icon={faStar} className="mr-2" />
    Features
</button>

<button onClick={scrollToBusinessDecisions} className="hover:underline">
    <FontAwesomeIcon icon={faBriefcase} className="mr-2" />
    Business Descriptions
</button>

<a href="#project-brief" onClick={scrollToProjectBrief} className="hover:underline">
    <FontAwesomeIcon icon={faUserTie} className="mr-2" />
    Plan Your Project
  </a>
  <a onClick={scrollToContact} className="hover:underline cursor-pointer">
    <span className="text-yellow-500">🛠</span>
    Contact Us
  </a> 
</div>


        {isJoinOptionsOpen && (
          <JoinOption
            selectedUserType={selectedUserType}
            handleUserTypeSelect={handleUserTypeSelect}
            handleContinue={handleContinue}
            closeJoinModal={closeJoinModal}
            gotoSignIn={gotoSignIn}
          />
        )}

        {isLoginOpen && (
          <Login 
            onLogIn={handleLogin}
            onClose={closeModal} 
            gotoSignUp={gotoSignUp}
          />
        )}
        {isWaitModalOpen && <WaitModal/>}

        {( ErrorMessage.length>0) && <ErrorMessageModal
            ErrorMessage = {ErrorMessage}
            closeErrorMessageModal = {closeErrorMessageModal}
        />}
      </header>

      <main>{renderSelectedUI()}</main>
    </div>
  );
};

export default Navbar;
