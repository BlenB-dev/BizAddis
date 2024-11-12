import { useState } from "react";
import Footer from "../Components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaPlus } from "react-icons/fa";
import {
  faGavel,
  faUsers,
  faDollarSign,
  faCertificate,
  faBoxOpen,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

const SPDetail = () => {
  const [comments, setComments] = useState([]); // State to hold comments
  const [newComment, setNewComment] = useState(""); // State to hold new comment input
  const [userRatings, setUserRatings] = useState({}); // State to hold ratings for each service provider
  const [showNewPosts, setShowNewPosts] = useState(false); // State to control visibility of new posts

  // Sample service provider data
  const serviceProviders = [
    {
      Name: "Addis Legal Advisors",
      TypeOfService: "Legal",
      Location: "Addis Ababa, Ethiopia",
      TypeOfServices: [
        "Legal Consulting",
        "Incorporation",
        "Compliance",
        "Intellectual Property Protection",
      ],
      Servicedescription:
        "Providing legal consulting for startups including incorporation, compliance, and intellectual property protection.",
      ExperienceInIndustryInYears: 15,
      SpecificSectors: ["Tech", "Healthcare", "Manufacturing"],
      KeyClientsAndReferences: ["EthioTech Innovations", "Addis HealthTech"],
      PricingStructure: "Hourly",
      AvailablePackages: [
        "Startup Legal Package",
        "Intellectual Property Package",
      ],
      TeamSize: 10,
      CertificationsAndAccreditations: ["Ethiopian Lawyers' Association"],
      ContactInformation: "0911 223344",
      Rating: 4.3, // Average rating
      NewPosts: [
        {
          title: "Launch of New Service",
          description:
            "Excited to announce the launch of our new consulting service, tailored for startups.",
        },
        {
          title: "Client Success Story",
          description:
            "Learn how we helped a tech startup secure funding and navigate legal challenges.",
        },
      ],
    },
    // Add more service providers as needed
  ];

  const handleCommentSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh
    if (newComment.trim()) {
      setComments([...comments, newComment]); // Add new comment to state
      setNewComment(""); // Clear input field
    }
  };

  const handleRatingChange = (index, rating) => {
    setUserRatings((prevRatings) => ({
      ...prevRatings,
      [index]: rating, // Set rating for the specific service provider
    }));

    // Save the rating to the database (placeholder function)
    saveRatingToDatabase(index, rating);
  };

  const saveRatingToDatabase = (providerIndex, rating) => {
    // Implement the logic to save the rating to your database
    console.log(
      `Saved rating of ${rating} stars for provider ${providerIndex}`
    );
    // Here you might use an API call to send the rating to your server
  };

  // Function to toggle the display of new posts
  const toggleNewPosts = () => {
    setShowNewPosts((prev) => !prev);
  };

  return (
    <div className="mx-auto mt-[-70px] p-12 rounded-lg sm:w-full sm:ml-0 sm:h-auto">
      {serviceProviders.map((ServiceProviders, index) => (
        <div key={index} className="mb-12">
          <div className="flex flex-col items-start mb-6">
            <div className="flex items-center mb-4">
              <div className="bg-gray-200 rounded-full w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center text-2xl sm:text-4xl font-bold text-gray-600">
                {ServiceProviders.Name.charAt(0)}
              </div>
              <div className="ml-4">
                <h1 className="text-2xl mt-[65px] sm:text-4xl font-bold">
                  {ServiceProviders.Name}
                </h1>
                <p className="text-gray-600 text-sm sm:text-lg">
                  {ServiceProviders.TeamSize} employees •{" "}
                  {ServiceProviders.Location}
                </p>
                <p className="text-gray-800 text-lg sm:text-1xl">
                  <span className="text-gray-600 text-sm sm:text-lg">
                    Contact Info:{" "}
                  </span>
                  {ServiceProviders.ContactInformation}
                </p>
                <div className="flex items-center">
                  <span className="text-yellow-500 text-lg mr-2">
                    {Array.from({
                      length: Math.floor(ServiceProviders.Rating),
                    }).map((_, i) => (
                      <FontAwesomeIcon key={i} icon={faStar} />
                    ))}
                  </span>
                  <span className="text-gray-600 text-lg">
                    {ServiceProviders.Rating}
                  </span>
                </div>
              </div>
            </div>
            <a
              href="#"
              className="text-red-500 border ml-[860px] mt-[10px] py-3 absolute whitespace-nowrap border-red-500 px-3 py-1 rounded-full hover:bg-red-500 hover:text-white transition flex items-center"
            >
              <FaPlus className="mr-2" />
              Follow
            </a>
            {/* Visit Site Button */}
            <a
              href="#"
              className="bg-purple-600 whitespace-nowrap text-white absolute ml-[990px] mt-[10px] mediumText p-3 sm:p-4 rounded-lg text-sm hover:bg-purple-700 transition"
            >
              VISIT SITE
            </a>
          </div>

          <h2 className="text-2xl sm:text-3xl font-semibold mt-8 mb-6">
            Service Insights
          </h2>

          {/* Stacked Service Insights */}
          <div className="flex flex-col gap-6">
            {/* Pricing Structure with Icon */}
            <div className="block transition-transform hover:scale-105 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faDollarSign}
                  className="text-blue-500 text-3xl mr-3"
                />
                <h3 className="font-semibold text-xl sm:text-2xl">
                  Pricing Structure
                </h3>
              </div>
              <p className="text-gray-800 text-lg sm:text-2xl">
                {ServiceProviders.PricingStructure}
              </p>
            </div>

            {/* Available Packages with Icon */}
            <div className="block transition-transform hover:scale-105 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faBoxOpen}
                  className="text-green-500 text-3xl mr-3"
                />
                <h3 className="font-semibold text-xl sm:text-2xl">
                  Available Packages
                </h3>
              </div>
              <div className="flex flex-wrap mt-4">
                {ServiceProviders.AvailablePackages.map((pkg, index) => (
                  <span
                    key={index}
                    className="bg-blue-200 text-blue-800 px-3 py-1 sm:px-4 sm:py-2 rounded-full mr-2 mb-2 text-sm sm:text-lg"
                  >
                    {pkg}
                  </span>
                ))}
              </div>
            </div>

            {/* Specific Sectors with Icon */}
            <div className="block transition-transform hover:scale-105 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-red-500">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faGavel}
                  className="text-red-500 text-3xl mr-3"
                />
                <h3 className="font-semibold text-xl sm:text-2xl">
                  Specific Sectors
                </h3>
              </div>
              <div className="flex flex-wrap mt-4">
                {ServiceProviders.SpecificSectors.map((sector, index) => (
                  <span
                    key={index}
                    className="bg-blue-200 text-blue-800 px-3 py-1 sm:px-4 sm:py-2 rounded-full mr-2 mb-2 text-sm sm:text-lg"
                  >
                    {sector}
                  </span>
                ))}
              </div>
            </div>

            {/* Team Size with Icon */}
            <div className="block transition-transform hover:scale-105 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-yellow-500">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faUsers}
                  className="text-yellow-500 text-3xl mr-3"
                />
                <h3 className="font-semibold text-xl sm:text-2xl">Team Size</h3>
              </div>
              <p className="text-gray-800 text-lg sm:text-2xl">
                {ServiceProviders.TeamSize} Members
              </p>
            </div>

            {/* Certifications with Icon */}
            <div className="block transition-transform hover:scale-105 bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faCertificate}
                  className="text-purple-500 text-3xl mr-3"
                />
                <h3 className="font-semibold text-xl sm:text-2xl">
                  Certifications
                </h3>
              </div>
              <div className="flex flex-wrap mt-4">
                {ServiceProviders.CertificationsAndAccreditations.map(
                  (cert, index) => (
                    <span
                      key={index}
                      className="bg-blue-200 text-blue-800 px-3 py-1 sm:px-4 sm:py-2 rounded-full mr-2 mb-2 text-sm sm:text-lg"
                    >
                      {cert}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* New Posts Section */}
          <div className="mt-10">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
              New Posts
            </h2>
            <button
              onClick={toggleNewPosts}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg mb-4"
            >
              {showNewPosts ? "Hide Posts" : "Show Posts"}
            </button>
            {showNewPosts && (
              <div className="flex flex-col gap-4">
                {ServiceProviders.NewPosts.map((post, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition"
                  >
                    <h3 className="font-bold text-xl">{post.title}</h3>
                    <p className="text-gray-600">{post.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rating Section */}
          <div className="mt-10">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
              Rate this Service Provider
            </h2>
            <div className="flex gap-2 items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <label key={star} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name={`rating-${index}`}
                    value={star}
                    className="hidden"
                    onChange={() => handleRatingChange(index, star)}
                    checked={userRatings[index] === star} // Set checked state based on user ratings
                  />
                  <span
                    className={`text-yellow-500 text-2xl ${
                      userRatings[index] >= star
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                  >
                    <FontAwesomeIcon icon={faStar} />
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-10">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
              Comments
            </h2>
            <form onSubmit={handleCommentSubmit} className="mb-4">
              <textarea
                className="border-2 border-gray-300 rounded-lg p-2 w-full"
                rows="4"
                placeholder="Leave a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-2"
              >
                Submit
              </button>
            </form>
            <div className="flex flex-col gap-2">
              {comments.map((comment, index) => (
                <div
                  key={index}
                  className="bg-gray-200 p-3 rounded-lg shadow-sm"
                >
                  {comment}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      <Footer />
    </div>
  );
};

export default SPDetail;
