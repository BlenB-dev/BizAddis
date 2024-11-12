import { useState, useRef, useEffect } from "react";
import ThemeToggle from "../../Components/ThemeToggle";
import { navItemsForStartups } from "../../../constants";

const StartupsAccount = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const toggleRef = useRef(null);

  const toggleDropdown = () => {
    setOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      !toggleRef.current.contains(event.target)
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" style={{ zIndex: 50 }}>
      <div
        ref={toggleRef}
        onClick={toggleDropdown}
        className={`cursor-pointer ${
          open ? "border-b-2 border-indigo-700" : ""
        }`}
      >
        <div className="hidden lg:flex justify-center items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 dark:border-white border-gray-900">
            <img
              src="https://images.unsplash.com/photo-1610397095767-84a5b4736cbd?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80"
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        {open && (
          <div
            ref={dropdownRef}
            className="absolute right-0 bg-opacity-90 w-50 px-5 py-3 dark:bg-gray-800 bg-white rounded-lg shadow border dark:border-transparent mt-2 mr-[-55px]"
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="space-y-3 text-dark ">

            {navItemsForStartups.map((item, index) => (
                <li
                  key={index}
                  className="text-lg hover:scale-105 font-medium text-black dark:text-white hover:text-white-600 dark:hover:text-blue-400 flex items-center space-x-2"
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
          </div>
        )}
      </div>
    </div>
  );
};

export default StartupsAccount;
