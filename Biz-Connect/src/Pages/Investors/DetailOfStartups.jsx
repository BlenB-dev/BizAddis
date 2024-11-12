import React from "react";
import Footer from "../Footer";

const DetailOfStartups = () => {
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
      ExperienceInIndustryInYears: 15, // years
      SpecificSectors: ["Tech", "Healthcare", "Manufacturing"],
      KeyClientsAndReferences: ["EthioTech Innovations", "Addis HealthTech"],
      PricingStructure: "Hourly",
      AvailablePackages: [
        "Startup Legal Package",
        "Intellectual Property Package",
      ],
      TeamSize: 10,
      CertificationsAndAccreditations: ["Ethiopian Lawyers' Association"],
      ContactInformation: "info@addislegal.com, +251 911 223344",
    },
  ];

  return (
    <div className="w-[1600px] mx-auto ml-[-180px] mt-[-70px] h-[1300px] p-12 rounded-lg sm:w-full sm:ml-0 sm:h-auto">
      {serviceProviders.map((startupData, index) => (
        <div key={index} className="mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-gray-200 rounded-full w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center text-2xl sm:text-4xl font-bold text-gray-600">
                {startupData.Name.charAt(0)}
              </div>
              <div className="ml-4 sm:ml-6">
                <h1 className="text-2xl sm:text-4xl font-bold">
                  {startupData.Name}
                </h1>
                <p className="text-gray-600 text-sm sm:text-lg">
                  {startupData.TeamSize} employees • {startupData.Location}
                </p>
                <p className="text-gray-800 text-lg sm:text-2xl">
                  <span className="mediumText font-bold px-2 -ml-2">
                    Contact Info:
                  </span>
                  {startupData.ContactInformation}
                </p>
                <p className="text-gray-700 mt-2 sm:mt-3 text-sm sm:text-lg">
                  {startupData.Servicedescription}
                </p>
              </div>
            </div>
            <a
              href="#"
              className="bg-purple-600 whitespace-nowrap text-white ml-0 sm:ml-3 mt-4 sm:mt-0 p-3 sm:p-4 rounded-lg text-sm sm:text-lg hover:bg-purple-700 transition"
            >
              VISIT SITE
            </a>
          </div>

          <h2 className="text-2xl sm:text-3xl font-semibold mt-8 mb-6">
            Client Insights
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gray-100 p-4 sm:p-6 rounded-lg">
              <h3 className="font-semibold text-xl sm:text-2xl">
                Industry Expertise
              </h3>
              <div className="flex flex-wrap mt-4">
                {startupData.TypeOfServices.map((sector, index) => (
                  <span
                    key={index}
                    className="bg-blue-200 text-blue-800 px-3 py-1 sm:px-4 sm:py-2 rounded-full mr-2 mb-2 text-sm sm:text-lg"
                  >
                    {sector}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gray-100 p-4 sm:p-6 rounded-lg">
              <h3 className="font-semibold text-xl sm:text-2xl">
                Available Packages
              </h3>
              <div className="flex flex-wrap mt-4">
                {startupData.AvailablePackages.map((pkg, index) => (
                  <span
                    key={index}
                    className="bg-blue-200 text-blue-800 px-3 py-1 sm:px-4 sm:py-2 rounded-full mr-2 mb-2 text-sm sm:text-lg"
                  >
                    {pkg}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gray-100 p-4 sm:p-6 rounded-lg">
              <h3 className="font-semibold text-xl sm:text-2xl">
                Specific Sectors
              </h3>
              <div className="flex flex-wrap mt-4">
                {startupData.SpecificSectors.map((sector, index) => (
                  <span
                    key={index}
                    className="bg-blue-200 text-blue-800 px-3 py-1 sm:px-4 sm:py-2 rounded-full mr-2 mb-2 text-sm sm:text-lg"
                  >
                    {sector}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gray-100 p-4 sm:p-6 rounded-lg">
              <h3 className="font-semibold text-xl sm:text-2xl">Team Size</h3>
              <p className="text-lg">{startupData.TeamSize} employees</p>
            </div>

            <div className="bg-gray-100 p-4 sm:p-6 rounded-lg">
              <h3 className="font-semibold text-xl sm:text-2xl">
                Pricing Structure
              </h3>
              <p className="text-lg">{startupData.PricingStructure}</p>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="font-semibold text-2xl">Certifications</h3>
              <div className="mt-4">
                {startupData.CertificationsAndAccreditations.length > 0 ? (
                  startupData.CertificationsAndAccreditations.map(
                    (cert, index) => (
                      <p key={index} className="text-lg font-bold">
                        {cert}
                      </p>
                    )
                  )
                ) : (
                  <p className="mt-4 text-lg">
                    This provider has not added their certifications.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="w-full mt-8">
            <hr className="border-gray-300" />
          </div>
        </div>
      ))}
      <Footer />
    </div>
  );
};

export default DetailOfStartups;
