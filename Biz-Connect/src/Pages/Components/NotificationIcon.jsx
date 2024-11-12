import { useState, useEffect, useRef } from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NotificationItem from "../../constants/index";

function NotificationIcon() {
  // const [notificationCount, setNotificationCount] = useState(5);
  const notificationCount = 5
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const bellRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const notifications = [
    {
      id: 1,
      type: "message",
      text: "You have a new message from John Doe.",
      time: "2 mins ago",
      status: "unread",
    },
    {
      id: 2,
      type: "alert",
      text: "Your account password was changed.",
      time: "1 hour ago",
      status: "read",
    },
  ];

  const handleNotificationClick = (notification) => {
    navigate("/MessageInDetail", { state: { notification } });
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !bellRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative hidden lg:flex items-center">
      <div ref={bellRef} onClick={toggleDropdown}>
        <FaBell className="text-3xl hover:scale-105 text-gray-800 text-white cursor-pointer" />
        {notificationCount > 0 && (
          <span className="absolute bottom-2 right-0 inline-flex items-center justify-center w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full -translate-x-1/2 -translate-y-1/2">
            {notificationCount}
          </span>
        )}
      </div>

      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute text-dark mt-[370px] ml-[-180px] bg-opacity-90 w-60 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg mt-1"
          style={{ zIndex: 50 }}
        >
          <div className="p-4">
            <h4 className="text-lg font-semibold">Notifications</h4>
            <ul className="mt-2">
              {notifications.length === 0 ? (
                <li className="text-gray-500">No new messages</li>
              ) : (
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    type={notification.type}
                    text={notification.text}
                    time={notification.time}
                    status={notification.status}
                    onClick={() => handleNotificationClick(notification)}
                  />
                ))
              )}
              <button
                onClick={() => navigate("/MessageInDetail")}
                className="flex items-center text-sm font-semibold transform transition-colors duration-200 border-r-4 border-transparent hover:border-indigo-700 w-full text-left mt-2"
              >
                See all Notification Messages
              </button>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationIcon;
