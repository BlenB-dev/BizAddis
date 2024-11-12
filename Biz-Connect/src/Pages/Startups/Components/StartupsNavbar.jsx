import { useState } from "react";
import { FaBars } from "react-icons/fa";

import logo from "../../../assets/logo.png";

import NotificationIcon from "../../Components/NotificationIcon";
import ThemeToggle from "../../Components/ThemeToggle";

import { navItemsForStartups } from "../../../constants";
// import { navItemsForInvestorPage } from "../../../constants";
import StartupsAccount from "./StartupsAccount";

const StartupsNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <div>
      <header className="bg-gray-900 text-white">
        <div className="flex justify-between items-center py-2 px-6">
          <div className="flex items-center flex-shrink-0">
            <img className="h-10 w-10 mr-2" src={logo} alt="Logo" />
            <a
              href="/StartupHome"
              className="tracking-tight text-white text-xl font-medium hover:scale-105 dark:text-white hover:text-white-600 dark:hover:text-blue-400 flex items-center space-x-2"
            >
              Biz-Connect
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="absolute ml-[-110px] mt-[2px] flex items-center space-x-10 pr-32 lg:pr-40 py-2">
              <NotificationIcon />
              <StartupsAccount />
            </div>

            <ul className="hidden lg:flex ml-0 space-x-12">
              {navItemsForStartups
                .filter((item) => item.label !== "Home") // Exclude the "Home" label
                .map((item, index) => (
                  <li key={index} className="flex items-center hover:scale-105">
                    <a
                      href={item.href}
                      className="text-xl font-medium text-gray-800 hover:text-white-600 dark:hover:text-blue-400 flex items-center"
                    >
                      {item.label === "Logout" ? (
                        <div
                          className="text-white"
                          style={{
                            transform: "translateX(-10px)",
                            display: "flex",
                            alignItems: "center",
                            marginTop: 10,
                          }}
                        >
                          <div
                            className="ml-1 text-red-600"
                            style={{ transform: "translateX(-8px)" }}
                          >
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              ></path>
                            </svg>
                          </div>
                          <span>{item.label}</span>
                        </div>
                      ) : null}
                    </a>
                  </li>
                ))}
            </ul>
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
            <ul role="navigation" className="space-y-4">
              {navItemsForStartups.map((item, index) => (
                <li
                  key={index}
                  className="text-lg hover:scale-105 font-medium text-white dark:text-white hover:text-white-600 dark:hover:text-blue-400 flex items-center space-x-2"
                >
                  <a href={item.href} className="flex items-center">
                    {item.label === "Your Profile" ? (
                      <div className="mr-2">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          ></path>
                        </svg>
                      </div>
                    ) : item.label === "Logout" ? (
                      <div className="mr-2">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          ></path>
                        </svg>
                      </div>
                    ) : (
                      <i className={`${item.icon} mr-2 dark:text-white`}></i>
                    )}
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
            {/* <div className="flex items-center mt-4">
              <label className="block mediumText font-medium text-white dark:text-white">
                Theme:
              </label>
              <div className="ml-2 transform transition-colors duration-200 border-r-4 border-transparent hover:border-indigo-700">
                <ThemeToggle />
              </div>
            </div> */}
          </div>
        )}
      </header>
    </div>
  );
};

export default StartupsNavbar;
