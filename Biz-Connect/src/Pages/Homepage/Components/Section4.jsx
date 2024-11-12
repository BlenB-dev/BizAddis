
import handshakeImage from "../../../assets/B2B.jpg";

const Section4 = () => {
  return (
    <div id="project-brief">
      <div className="py-16 px-4 flex flex-col md:flex-row items-center justify-between mx-auto max-w-full">
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl font-bold mb-4">
            Share your experience and Find your ServiceProvider or Startup
          </h2>
          <p className="text-gray-700 mb-6">
            Helps startups to find best and suitable ServiceProvider for there
            ongoing or finsished project. On the other side Angle Investors can
            find any startups to push there project even higher so that both can
            beneficiary.
          </p>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
          <img
            src={handshakeImage}
            alt="Handshake"
            className="max-w-full h-auto"
          />
        </div>
      </div>
      <div className="bg-blue-100 py-8 px-6 lg:px-12 rounded-md max-w-screen-xl mx-auto flex flex-col lg:flex-row items-center justify-between">
        <div className="lg:w-2/3 -ml-10">
          <div className="relative bg-white p-6 rounded-lg shadow-lg mb-6">
            <h3 className="text-sm font-bold text-gray-600 mb-4">
              Project Brief
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg shadow-sm">
                <span className="text-blue-600 text-sm font-semibold">📝</span>
                <p className="text-sm text-gray-700">
                  What are your <span className="font-bold">Plans?</span>
                </p>
              </div>

              <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg shadow-sm">
                <span className="text-blue-600 text-sm font-semibold">🏢</span>
                <p className="text-sm text-gray-700">
                  Tell us how much amout{" "}
                  <span className="font-bold">are you willing to invest</span>
                </p>
              </div>

              <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg shadow-sm">
                <span className="text-blue-600 text-sm font-semibold">⏳</span>
                <p className="text-sm text-gray-700">
                  Is your project ongoing or{" "}
                  <span className="font-bold">One time?</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-1/3 text-center lg:text-left">
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-bold text-blue-700">
              Biz-Connect With Best Recommendation
            </span>
          </p>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Share your project. Get connected with best-fit Angle Investors
          </h2>
        </div>
      </div>
      <div className="w-full mt-8">
        <hr className="border-gray-300" />
      </div>
    </div>
  );
};

export default Section4;
