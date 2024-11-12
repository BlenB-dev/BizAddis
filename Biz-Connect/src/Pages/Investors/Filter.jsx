// import React from "react";

function Filter() {
  return (
    <div className="relative flex space-x-8 ">
      <div className="w-[300px]  p-4 mt-[-20px] bg-white border rounded-lg">
        <div className="mb-4">
          <h4 className="font-semibold mb-2">
            What is your typical investment range?
          </h4>
          <div className="space-y-2">
            {[
              "Min 100,000",
              "100,000 to 1,000,000",
              "Greater than 1 Million",
            ].map((label) => (
              <label className="flex items-center" key={label}>
                <input type="checkbox" className="mr-2" />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Job Type */}
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Select a Stage</h4>
          <div className="space-y-2">
            {["Seed Stage", "Early Stage", "Growth Stage"].map((label) => (
              <label className="flex items-center" key={label}>
                <input type="checkbox" className="mr-2" />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Number of Proposals */}
        <div className="mb-4">
          <h4 className="font-semibold mb-2">
            {" "}
            What is your preferred investment approach?
          </h4>
          <div className="space-y-2">
            {["Hands On", "Hand Off"].map((label) => (
              <label className="flex items-center" key={label}>
                <input type="checkbox" className="mr-2" />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Client Location */}
        <div className="mb-4">
          <h4 className="font-semibold mb-2"> What is your risk tolerance?</h4>
          <div className="space-y-3 mb-6 dark:text-black">
            {["Low", "Medium", "High"].map((label) => (
              <label className="flex items-center" key={label}>
                <input type="checkbox" className="mr-2" />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Project Length */}
        <div className="mb-4">
          <h4 className="font-semibold mb-2">
            {" "}
            Are you interested in co-investment opportunities with other
            investors?
          </h4>
          <div className="space-y-2">
            {["Yes", "No"].map((label) => (
              <label className="flex items-center" key={label}>
                <input type="checkbox" className="mr-2" />
                {label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Filter;
