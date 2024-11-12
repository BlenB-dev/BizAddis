import video1 from "../../../assets/video1.mp4";
import video3 from "../../../assets/video3.mp4";
const Section1 = () => {
  return (
    <header  className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold mb-4">
          <span className="text-xl sm:text-4xl lg:text-5xl bg-gradient-to-r from-orange-500 to-red-800 text-transparent bg-clip-text font-bold text-center">
            Biz-Connect
          </span><br/>
          <span> Find your Startups And Serviceprovider.</span>
        </h1>
        <p className="text-lg mb-6">
          Angle Investors search any Startups with there own insterset.
        </p>
        {/* <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search Startups"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="In Ethiopia"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-red-500 text-white px-4 py-2 rounded-md">
            Get Started
          </button>
        </div>
 */}
        <div className="flex flex-col md:flex-row mt-8 sm:mt-10 justify-center items-center space-y-6 md:space-y-0 md:space-x-6">
          <video
            autoPlay
            loop
            muted
            className="rounded-lg w-full md:w-1/2 border border-orange-700 shadow-md shadow-orange-400"
          >
            <source src={video1} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <video
            autoPlay
            loop
            muted
            className="rounded-lg w-full md:w-1/2 border border-orange-700 shadow-md shadow-orange-400"
          >
            <source src={video3} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </header>
  );
};

export default Section1;
