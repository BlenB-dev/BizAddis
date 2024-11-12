import { BotMessageSquare } from "lucide-react";
import { BatteryCharging } from "lucide-react";
import { Fingerprint } from "lucide-react";
import { ShieldHalf } from "lucide-react";
import { PlugZap } from "lucide-react";
import { GlobeLock } from "lucide-react";

import user1 from "../assets/profile-pictures/user1.jpg";
import user2 from "../assets/profile-pictures/user2.jpg";
import user3 from "../assets/profile-pictures/user3.jpg";

export const navItems = [
  { label: "Home", to: "/", icon: "fas fa-home" },
  // { label: "JoinOption", to: "/JoinOption", icon: "fa-solid fa-lightbulb" },
  // { label: "FilterBar", to: "/FilterBar", icon: "fa-solid fa-lightbulb" },
  // // { label: "Contact", to: "#contact", icon: "fa-solid fa-list-check" },
  // // { label: "Features", to: "#features", icon: "fa-solid fa-star" },
  { label: "InvestorPage", to: "/InvestorPage", icon: "fa-solid fa-chart-line" },
  { label: "InvestorHome", to: "/InvestorHome", icon: "fa-solid fa-chart-line" },
  { label: "InvestorsBio", to: "/InvestorsBio", icon: "fa-solid fa-lightbulb" },
  { label: "MessageInDetail", to: "/MessageInDetail", icon: "fa-solid fa-lightbulb" },
  { label: "DetailOfInvestors", to: "/DetailOfInvestors", icon: "fa-solid fa-lightbulb" },
  { label: "ProfileSettingsPageForInvestors", to: "/ProfileSettingsPageForInvestors", icon: "fa-solid fa-lightbulb" },
  { label: "FilterForAngleInvestors", to: "/FilterForAngleInvestors", icon: "fa-solid fa-lightbulb" },
  { label: "NewStartupForm", to: "/NewStartupForm", icon: "fa-solid fa-lightbulb" },
  { label: "NewServiceProviderForm", to: "/NewServiceProviderForm", icon: "fa-solid fa-briefcase" },
  { label: "Investor Form", to: "/NewInvestorForm", icon: "fa-solid fa-chart-line" },

  // { label: "ServiceProvider", to: "/ServiceProviders", icon: "fa-solid fa-briefcase" },
  // { label: "ServiceProviderBio", to: "/ServiceProviderBio", icon: "fa-solid fa-lightbulb" },
  // { label: "ProfileSettingsPageForServiceProvider", to: "/ProfileSettingsPageForServiceProvider", icon: "fa-solid fa-lightbulb" },
  // { label: "DetailOfServiceProvider", to: "/DetailOfServiceProvider", icon: "fa-solid fa-lightbulb" },

  // { label: "StartUps", to: "/Startups", icon: "fa-solid fa-lightbulb" },
  // { label: "FilterForStartups", to: "/FilterForStartups", icon: "fa-solid fa-lightbulb" },
  // { label: "StartupsPage", to: "/StartupsPage", icon: "fa-solid fa-lightbulb" },
  // { label: "StartupsBio", to: "/StartupsBio", icon: "fa-solid fa-lightbulb" },
  // { label: "ProfileSettingsPageForStartups", to: "/ProfileSettingsPageForStartups", icon: "fa-solid fa-lightbulb" },
  // { label: "DetailOfStartups", to: "/DetailOfStartups", icon: "fa-solid fa-lightbulb" },








];

export const navItemsForInvestorPage = [
  
    { label: "Home", icon: "fas fa-home", href: "/InvestorHome" },
    { label: "Profile", icon: "fas fa-user-edit", href: "/EditInvestor" },
    { label: "Connected Startups", icon: "fas fa-users", href: "/ConnectedStartups" },
    { label: "Accepted Startups", icon: "fas fa-check-circle", href: "/AcceptedStartups" },
    { label: "Declined Startups", icon: "fas fa-times-circle", href: "/DeclinedStartups" },
    { label: "Ignored Startups", icon: "fas fa-ban", href: "/IgnoredStartups" }, // The 'ban' icon represents something ignored or restricted.
    { label: "Recommended Startups", icon: "fas fa-rocket", href: "/RecommendedStartups" }, // The 'ban' icon represents something ignored or restricted.
  
    { label: "Logout", icon: "fas fa-sign-out-alt", href: "/" },
  { label: "Inbox", icon: "fas fa-inbox", href: "/MessageInDetail " },

  // { label: "Login", to:"/login", icon: "fas fa-sign-in-alt"  },
];

export const navItemsForAdmins = [
  
  { label: "List of Investors", href: "/AdminInvestorList" },
  { label: "List of Startups", href: "/AdminStartupList" },
  { label: "List of ServiceProviders", href: "/AdminServiceProviderList" },
  { label: "Logout", icon: "fas fa-sign-out-alt", href: "/" },
  { label: "Inbox", icon: "fas fa-inbox", href: "/MessageInDetail " },

];

export const navItemsForServiceProvider = [
  
  { label: "Home", icon: "fas fa-home", href: "/ServiceProvider" },
  { label: "Profile", icon: "fas fa-user-edit", href: "/EditServiceProvider" },
  { label: "Logout", icon: "fas fa-sign-out-alt", href: "/" },
  { label: "Inbox", icon: "fas fa-inbox", href: "/MessageInDetail " },

// { label: "Login", to:"/login", icon: "fas fa-sign-in-alt"  },
];

export const navItemsForStartups = [
  // { label: "Home", icon: "fas fa-home", href: "/StartupHome" },
  // { label: "Home", icon: "fas fa-home", href: "/StartupHome" },
  // { label: "Home", icon: "fas fa-home", href: "/StartupHome" },
  // {
  //   label: "Your Profile",
  //   icon: "fa-solid fa-list-check",
  //   href: "/EditStartup ",
  // },

  // { label: "Logout", icon: "fa-solid fa-star", href: "/" },
  
  { label: "Home", icon: "fas fa-home", href: "/StartupHome" },
  { label: "Profile", icon: "fas fa-user-edit", href: "/EditStartup" },
  { label: "Recommended Service Providers", icon: "fas fa-rocket", href: "/RecommendedServiceProviders" }, // The 'ban' icon represents something ignored or restricted.
  { label: "Connected Investors", icon: "fas fa-users", href: "/ConnectedInvestors" },
  { label: "Accepted Investors", icon: "fas fa-check-circle", href: "/AcceptedInvestors" },
  { label: "Declined Investors", icon: "fas fa-times-circle", href: "/DeclinedInvestors" },
  { label: "Logout", icon: "fas fa-sign-out-alt", href: "/" }, // Assuming logout needs an appropriate icon
  
  
  { label: "Inbox", icon: "fas fa-inbox", href: "/MessageInDetail " },


]
// NotificationItem.js
import React from "react";
import { FaBell, FaInfoCircle } from "react-icons/fa"; // You can use icons from react-icons

const NotificationItem = ({ type, text, time, status, onClick }) => {
  const icon =
    type === "message" ? (
      <FaInfoCircle className="text-pink-500" />
    ) : (
      <FaBell className="text-pink-500" />
    );
  const isUnread = status === "unread";

  return (
    <div
      className={`flex items-center transform transition-colors duration-200 border-r-4 border-transparent hover:border-indigo-700 w-full text-left cursor-pointer ${
        isUnread ? "font-bold" : ""
      }`}
      onClick={onClick}
    >
      <div className="mr-3">{icon}</div>
      <div className="flex-grow">
        <div>{text}</div>
        <small className="text-gray-500">{time}</small>
      </div>
    </div>
  );
};

export default NotificationItem;

export const testimonials = [
  {
    user: "John Doe",
    company: "Stellar Solutions",
    image: user1,
    text: "I am extremely satisfied with the services provided. The team was responsive, professional, and delivered results beyond my expectations.",
  },
  {
    user: "Jane Smith",
    company: "Blue Horizon Technologies",
    image: user2,
    text: "I couldn't be happier with the outcome of our project. The team's creativity and problem-solving skills were instrumental in bringing our vision to life",
  },
  {
    user: "David Johnson",
    company: "Quantum Innovations",
    image: user3,
    text: "Working with this company was a pleasure. Their attention to detail and commitment to excellence are commendable. I would highly recommend them to anyone looking for top-notch service.",
  },
];

export const features = [
  {
    icon: <BotMessageSquare />,
    text: " Smart Matchmaking:",
    description:
      "Development of an matching algorithm to connect startups with appropriate service providers and investors based on detailed criteria such as industry, funding needs, growth stage, and specific services required.",
  },
  {
    icon: <Fingerprint />,
    text: " Personalized Recommendations",
    description:
      "Machine learning to provide personalized content, such as tailored     resources, potential partners, and market insights based on user behavior and preferences.",
  },
  {
    icon: <ShieldHalf />,
    text: "Search and Filter Functions",
    description:
      "Advanced search and filtering capabilities to enable users to find relevant startups, service providers, or investors based on various criteria.",
  },
  {
    icon: <BatteryCharging />,
    text: "Enhanced Connectivity:",
    description:
      "The platform will streamline the process of finding and connecting with relevant service providers and investors. This enhanced connectivity will save startups time and resources, allowing them to focus more on their core business activities.",
  },
  {
    icon: <PlugZap />,
    text: "Improved Access to Services",
    description:
      "Startups will gain easier access to essential services such as legal advice, marketing support, and financial consulting. This access will help them build a solid foundation and navigate the complexities of growing a business.",
  },
  {
    icon: <GlobeLock />,
    text: "Strengthened Entrepreneurial Ecosystem",
    description:
      "By facilitating collaboration and communication among startups, service providers, and investors,BizConnect Addis will contribute to a more cohesive and supportive entrepreneurial ecosystem in Addis Ababa.This strengthened ecosystem will foster innovation and drive economic growth.",
  },
];

export const checklistItems = [
  {
    title: "Code merge made easy",
    description:
      "Track the performance of your VR apps and gain insights into user behavior.",
  },
  {
    title: "Review code without worry",
    description:
      "Track the performance of your VR apps and gain insights into user behavior.",
  },
  {
    title: "AI Assistance to reduce time",
    description:
      "Track the performance of your VR apps and gain insights into user behavior.",
  },
  {
    title: "Share work in minutes",
    description:
      "Track the performance of your VR apps and gain insights into user behavior.",
  },
];

export const pricingOptions = [
  {
    title: "Free",
    price: "$0",
    features: [
      "Private board sharing",
      "5 Gb Storage",
      "Web Analytics",
      "Private Mode",
    ],
  },
  {
    title: "Pro",
    price: "$10",
    features: [
      "Private board sharing",
      "10 Gb Storage",
      "Web Analytics (Advance)",
      "Private Mode",
    ],
  },
  {
    title: "Enterprise",
    price: "$200",
    features: [
      "Private board sharing",
      "Unlimited Storage",
      "High Performance Network",
      "Private Mode",
    ],
  },
];

export const resourcesLinks = [
  { href: "#", text: "Getting Started" },
  { href: "#", text: "Documentation" },
  { href: "#", text: "Tutorials" },
  { href: "#", text: "API Reference" },
  { href: "#", text: "Community Forums" },
];

export const platformLinks = [
  { href: "#", text: "Features" },
  { href: "#", text: "Supported Devices" },
  { href: "#", text: "System Requirements" },
  { href: "#", text: "Downloads" },
  { href: "#", text: "Release Notes" },
];

export const communityLinks = [
  { href: "#", text: "Events" },
  { href: "#", text: "Meetups" },
  { href: "#", text: "Conferences" },
  { href: "#", text: "Hackathons" },
  { href: "#", text: "Jobs" },
];
