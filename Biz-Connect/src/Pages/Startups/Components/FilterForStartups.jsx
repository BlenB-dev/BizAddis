
function FilterForStartups() {
  return (
    <div>
      <div className="relative flex space-x-8">
        <div className="w-[300px] p-4 mt-[-20px] bg-white border rounded-lg">
          {/* Experience In The Industry */}
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Experience In The Industry</h4>
            <select className="border p-2 w-full">
              <option value="">Select Experience</option>
              <option value="<2 years">Less than 2 years</option>
              <option value="3-5 years">3-5 years</option>
              <option value="6-10 years">6-10 years</option>
              <option value="10+ years">10+ years</option>
            </select>
          </div>

          {/* Pricing Structure */}
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Pricing Structure</h4>
            <select className="border p-2 w-full">
              <option value="">Select Pricing Structure</option>
              <option value="Hourly">Hourly</option>
              <option value="Fixed Price">Fixed Price</option>
            </select>
            <div className="flex space-x-2 mt-2">
              <input
                type="number"
                placeholder="Min"
                className="border p-1 w-1/2"
              />
              <input
                type="number"
                placeholder="Max"
                className="border p-1 w-1/2"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default FilterForStartups;
