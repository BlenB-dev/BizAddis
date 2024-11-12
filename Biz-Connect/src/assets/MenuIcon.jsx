import React, { useState } from "react";
import { Menu, X, User } from "lucide-react"; // Ensure lucide-react is installed
import ThemeToggle from "../components/ThemeToggle";

const MenuIcons = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Toggle function for mobile menu
  const toggleNavbar = () => {
    setMobileDrawerOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      {/* Button to toggle the mobile menu */}
      <button onClick={toggleNavbar} className="p-2 lg:hidden">
        {mobileDrawerOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Drawer with menu options */}
      {mobileDrawerOpen && (
        <div className="fixed right-0 top-0 z-20 bg-neutral-900 w-full h-full p-8 flex flex-col justify-center items-center lg:hidden">
          <ul className="space-y-6 text-white text-lg">
            <li className="flex items-center space-x-2">
              <User />
              <a href="" className="hover:underline">
                Your Profile
              </a>
            </li>

            {/* Theme Toggle Section */}
            <li className="flex items-center space-x-2">
              <ThemeToggle />
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MenuIcons;
