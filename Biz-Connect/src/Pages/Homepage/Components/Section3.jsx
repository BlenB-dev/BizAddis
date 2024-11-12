
const Section3 = () => {
  const features = [
    {
      title: "Search your service providers",
      description:
        "Explore Service providers on our paltform we provide you different Services based on your search or filters on top of that we provide you smart recommendation system based on perviously searched history,",
    },
    {
      title: "Find your Startups",
      description:
        "Angle Investor have the chance to find any startups to invest on them.Plus Investors have other option that recommend other realted startups.",
    },
    {
      title: " Chance for Startups",
      description:
        "The big beneficiary part of this webiste is the Startups which have the option to find Service providers and also can be invested by Angel Investory So don't miss your chance go find your Service provider and Angle Investors.",
    },
  ];
  return (
    <section id="business-decisions" className="py-10 bg-green-100 mt-10">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Your one-stop-shop for better business decisions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Section3;
