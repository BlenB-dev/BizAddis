// import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

import Homepage from "./Pages/Homepage/Homepage";
import Footer from "./Pages/Components/Footer";
import Navbar from "./Pages/Homepage/Components/NavBar";

import StartupForm from "./Pages/Startups/ProfileCreate";
import StartupEditForm from "./Pages/Startups/ProfileEdit";
import StartupHome from "./Pages/Startups/Home";
import SearchServiceProviders from "./Pages/Startups/SearchServiceProviders";
import DetailOfServiceProvider from "./Pages/Startups/DetailOfServiceProvider";
import SPDetail from "./Pages/Startups/SPDetail";
import InvestorDetails from "./Pages/Startups/InvestorDetails";
import ConnectedInvestors from "./Pages/Startups/Connections/ConnectedInvestors";
import AcceptedInvestors from "./Pages/Startups/Connections/AcceptedInvestors";
import DeclinedInvestors from "./Pages/Startups/Connections/DeclinedInvestors";
import RecommendedServiceProviders from "./Pages/Startups/RecommendedServiceProviders";

import StartupsNavbar from "./Pages/Startups/Components/StartupsNavbar";

import ServiceProviderForm from "./Pages/ServiceProviders/ProfileCreate";
import ServiceProviderEditProfile from "./Pages/ServiceProviders/ProfileEdit";
import ServiceProvider from "./Pages/ServiceProviders/ServiceProviders";

import ServiceProviderNavbar from "./Pages/ServiceProviders/Components/ServiceProviderNavbar";

import InvestorForm from "./Pages/Investors/ProfileCreate";
import InvestorProfileEdit from "./Pages/Investors/ProfileEdit";
import SearchStartups from "./Pages/Investors/SearchStartups";
import StartupDetails from "./Pages/Investors/StartupDetails";
import InvestorPage from "./Pages/Investors/Home";
import AcceptedStartups from "./Pages/Investors/Connection/AcceptedStartups";
import ConnectedStartups from "./Pages/Investors/Connection/ConnectedStartups";
import IgnoredStartups from "./Pages/Investors/Connection/IgnoredStartups";
import DeclinedStartups from "./Pages/Investors/Connection/DeclinedStartups";
import RecommendedStartups from "./Pages/Investors/Connection/RecommendedStartups";

import InvestorsNavbar from "./Pages/Investors/Components/InvestorsNavbar";

import AdminInvestorDetails from "./Pages/Administrator/InvestorDetails";
import AdminServiceProviderDetails from "./Pages/Administrator/ServiceProviderDetails";
import AdminStartupDetails from "./Pages/Administrator/StartupDetail";
import AdminInvestorList from "./Pages/Administrator/InvestorList";
import AdminServiceProviderList from "./Pages/Administrator/ServiceProviderList";
import AdminStartupList from "./Pages/Administrator/StartupList";

import AdminNavbar from "./Pages/Administrator/Components/AdminNavbar";

const Maincontent = () => {
  const location = useLocation();
  return (
    <div className="dark:text-white min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {(location.pathname === "/" ||
        location.pathname === "/RegisterStartup" ||
        location.pathname === "/RegisterInvestor" ||
        location.pathname === "/RegisterServiceProvider") && <Navbar />}

      {/* location.pathname === "/Startup" ||  */}
      {(location.pathname === "/StartupHome" ||
        location.pathname === "/SearchServiceProviders" ||
        location.pathname === "/EditStartup" ||
        location.pathname === "/InvestorDetails" ||
        location.pathname.startsWith("/ServiceProviderDetail") ||
        location.pathname.startsWith("/SPDetail") ||
        location.pathname.startsWith("/ConnectedInvestors") ||
        location.pathname.startsWith("/AcceptedInvestors") ||
        location.pathname.startsWith("/DeclinedInvestors") ||
        location.pathname.startsWith("/RecommendedServiceProviders")) && (
        <StartupsNavbar />
      )}

      {(location.pathname === "/ServiceProvider" ||
        location.pathname === "/EditServiceProvider") && (
        <ServiceProviderNavbar />
      )}

      {(location.pathname === "/Investor" ||
        location.pathname === "/EditInvestor" ||
        location.pathname.startsWith("/StartupDetails") ||
        location.pathname.startsWith("/InvestorHome") ||
        location.pathname.startsWith("/AcceptedStartups") ||
        location.pathname.startsWith("/ConnectedStartups") ||
        location.pathname.startsWith("/IgnoredStartups") ||
        location.pathname.startsWith("/DeclinedStartups") ||
        location.pathname.startsWith("/RecommendedStartups")) && (
        <InvestorsNavbar />
      )}

      {(location.pathname === "/AdminInvestorList" ||
        location.pathname === "/AdminServiceProviderList" ||
        location.pathname === "/AdminStartupList" ||
        location.pathname.startsWith("/AdminInvestorDetails") ||
        location.pathname.startsWith("/AdminServiceProviderDetails") ||
        location.pathname.startsWith("/AdminStartupDetails")) && (
        <AdminNavbar />
      )}

      <div className="max-w-7xl mx-auto pt-20 px-6">
        <Routes>
          {/* <Route path="/InvestorHome" element={<InvestorHome />} /> */}

          {/* <Route path="/StartupPage" element={<Login />} />
          <Route path="/SignupStatup" element={<StartupForm />} />
          <Route path="/SignupInvestor" element={<StartupEditForm />} />
          <Route path="/SignupServiceProvider" element={<ServiceProviderEditProfile />} />
          <Route path="/EditStatup" element={<StartupForm />} />
          <Route path="/EditInvestor" element={<StartupEditForm />} />
          <Route path="/EditServiceProvider" element={<ServiceProviderEditProfile />} />
          <Route path="/InvestorProfileEdit" element={<InvestorProfileEdit />} />  */}

          {/* <Route path="/Startup" element={<StartupsPage />} />  */}
          <Route path="/StartupHome" element={<StartupHome />} />
          <Route
            path="/SearchServiceProviders"
            element={<SearchServiceProviders />}
          />
          <Route path="/RegisterStartup" element={<StartupForm />} />
          <Route path="/EditStartup" element={<StartupEditForm />} />
          <Route path="/InvestorDetails" element={<InvestorDetails />} />
          <Route
            path="/ServiceProviderDetail"
            element={<DetailOfServiceProvider />}
          />
          <Route path="/SPDetail" element={<SPDetail />} />
          <Route path="/ConnectedInvestors" element={<ConnectedInvestors />} />
          <Route path="/AcceptedInvestors" element={<AcceptedInvestors />} />
          <Route path="/DeclinedInvestors" element={<DeclinedInvestors />} />
          <Route
            path="/RecommendedServiceProviders"
            element={<RecommendedServiceProviders />}
          />

          <Route path="/ServiceProvider" element={<ServiceProvider />} />
          <Route
            path="/RegisterServiceProvider"
            element={<ServiceProviderForm />}
          />
          <Route
            path="/EditServiceProvider"
            element={<ServiceProviderEditProfile />}
          />

          <Route path="/Investor" element={<SearchStartups />} />
          <Route path="/InvestorHome" element={<InvestorPage />} />

          <Route path="/RegisterInvestor" element={<InvestorForm />} />
          <Route path="/EditInvestor" element={<InvestorProfileEdit />} />
          <Route path="/StartupDetails" element={<StartupDetails />} />

          <Route path="/AcceptedStartups" element={<AcceptedStartups />} />
          <Route path="/ConnectedStartups" element={<ConnectedStartups />} />
          <Route path="/IgnoredStartups" element={<IgnoredStartups />} />
          <Route path="/DeclinedStartups" element={<DeclinedStartups />} />
          <Route
            path="/RecommendedStartups"
            element={<RecommendedStartups />}
          />

          <Route
            path="/AdminInvestorDetails"
            element={<AdminInvestorDetails />}
          />
          <Route
            path="/AdminServiceProviderDetails"
            element={<AdminServiceProviderDetails />}
          />
          <Route
            path="/AdminStartupDetails"
            element={<AdminStartupDetails />}
          />
          <Route path="/AdminInvestorList" element={<AdminInvestorList />} />
          <Route
            path="/AdminServiceProviderList"
            element={<AdminServiceProviderList />}
          />
          <Route path="/AdminStartupList" element={<AdminStartupList />} />

          <Route
            path="/"
            element={
              <>
                {/* <Navbar/> */}
                <Homepage />
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
