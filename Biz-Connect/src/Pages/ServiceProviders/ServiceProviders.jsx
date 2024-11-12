import  { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa"; // Importing edit and delete icons
import Footer from "../Components/Footer";

const ServiceProvider = () => {
  const [serviceProviders, setServiceProviders] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    services: "",
    hourlyRate: "",
    description: "",
    contact: "",
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("addService");
  const [editingIndex, setEditingIndex] = useState(null); // State to track the index of the service provider being edited

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      // Update existing service provider
      const updatedProviders = serviceProviders.map((provider, index) =>
        index === editingIndex
          ? { ...formData, services: formData.services.split(",") }
          : provider
      );
      setServiceProviders(updatedProviders);
      setEditingIndex(null); // Reset editing index after saving
    } else {
      // Add new service provider
      setServiceProviders([
        ...serviceProviders,
        { ...formData, services: formData.services.split(",") },
      ]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      services: "",
      hourlyRate: "",
      description: "",
      contact: "",
    });
    setIsFormVisible(false);
  };

  const handleEdit = (index) => {
    setFormData({
      name: serviceProviders[index].name,
      location: serviceProviders[index].location,
      services: serviceProviders[index].services.join(", "), // Join array for input
      hourlyRate: serviceProviders[index].hourlyRate,
      description: serviceProviders[index].description,
      contact: serviceProviders[index].contact,
    });
    setEditingIndex(index); // Set the index of the service provider being edited
    setIsFormVisible(true); // Show the form for editing
  };

  const handleDelete = (index) => {
    setServiceProviders(serviceProviders.filter((_, i) => i !== index)); // Remove service provider by index
  };

  return (
    <div className="flex flex-col min-h-screen container mx-auto p-5">
      {/* Navigation Bar */}
      <nav className="flex justify-between mb-5 border-b border-gray-300 pb-3">
        <div className="flex space-x-4">
          <button
            className={`text-blue-600 ${
              activeTab === "addService"
                ? "font-bold border-b-2 border-blue-600"
                : ""
            }`}
            onClick={() => setActiveTab("addService")}
          >
            Add Service Post
          </button>
          <button
            className={`text-blue-600 ${
              activeTab === "postedHistory"
                ? "font-bold border-b-2 border-blue-600"
                : ""
            }`}
            onClick={() => setActiveTab("postedHistory")}
          >
            Posted History
          </button>
        </div>
      </nav>

      {/* Conditional Rendering Based on Active Tab */}
      <div className="flex-grow">
        {activeTab === "addService" && (
          <div className="flex justify-between">
            <div className="w-full lg:w-1/2 p-5">
              {isFormVisible && (
                <form
                  className="p-5 border border-gray-300 w-full rounded-lg shadow-md bg-white mb-5"
                  onSubmit={handleSubmit}
                >
                  <h2 className="text-xl font-semibold mb-3">
                    {editingIndex !== null
                      ? "Edit Your Service"
                      : "Add Your Service"}
                  </h2>
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <input
                      type="text"
                      name="location"
                      placeholder="Location"
                      value={formData.location}
                      onChange={handleChange}
                      className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <input
                      type="text"
                      name="services"
                      placeholder="Services (comma-separated)"
                      value={formData.services}
                      onChange={handleChange}
                      className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <input
                      type="text"
                      name="hourlyRate"
                      placeholder="Hourly Rate"
                      value={formData.hourlyRate}
                      onChange={handleChange}
                      className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <textarea
                      name="description"
                      placeholder="Description"
                      value={formData.description}
                      onChange={handleChange}
                      className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
                      required
                    />
                    <input
                      type="text"
                      name="contact"
                      placeholder="Contact"
                      value={formData.contact}
                      onChange={handleChange}
                      className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white p-2 rounded-lg shadow-md flex items-center justify-center transition duration-300 hover:bg-blue-500"
                  >
                    <FaPlus className="mr-2" />{" "}
                    {editingIndex !== null ? "Update Post" : "Add Post"}
                  </button>
                </form>
              )}
              <button
                onClick={() => setIsFormVisible(!isFormVisible)}
                className="bg-blue-600 text-white p-3 mb-5 rounded-lg shadow-md flex items-center transition duration-300 hover:bg-blue-500"
              >
                <FaPlus /> Add Service Post
              </button>
            </div>
            <div className="w-full lg:w-1/3 p-5">
              <h1 className="text-3xl font-bold text-center mb-5">
                Posted Services
              </h1>
              {serviceProviders.length === 0 ? (
                <p className="text-gray-500 text-center">
                  No services added yet.
                </p>
              ) : (
                serviceProviders.map((provider, index) => (
                  <div
                    key={index}
                    className="bg-white w-full border border-gray-300 p-5 rounded-lg mb-4 shadow hover:shadow-lg transition duration-200 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-bold text-lg">{provider.name}</h3>
                      <p className="text-gray-700">
                        <strong>Location:</strong> {provider.location}
                      </p>
                      <p className="text-gray-700">
                        <strong>Services:</strong>{" "}
                        {provider.services.join(", ")}
                      </p>
                      <p className="text-gray-700">
                        <strong>Hourly Rate:</strong> {provider.hourlyRate}
                      </p>
                      <p className="text-gray-700">
                        <strong>Description:</strong> {provider.description}
                      </p>
                      <p className="text-gray-700">
                        <strong>Contact:</strong> {provider.contact}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "postedHistory" && (
          <div className="p-5">
            <h1 className="text-3xl font-bold text-center mb-5">
              Posted History
            </h1>
            {serviceProviders.length === 0 ? (
              <p className="text-gray-500 text-center">
                No services added yet.
              </p>
            ) : (
              serviceProviders.map((provider, index) => (
                <div
                  key={index}
                  className="bg-white w-full border border-gray-300 p-5 rounded-lg mb-4 shadow hover:shadow-lg transition duration-200 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold text-lg">{provider.name}</h3>
                    <p className="text-gray-700">
                      <strong>Location:</strong> {provider.location}
                    </p>
                    <p className="text-gray-700">
                      <strong>Services:</strong> {provider.services.join(", ")}
                    </p>
                    <p className="text-gray-700">
                      <strong>Hourly Rate:</strong> {provider.hourlyRate}
                    </p>
                    <p className="text-gray-700">
                      <strong>Description:</strong> {provider.description}
                    </p>
                    <p className="text-gray-700">
                      <strong>Contact:</strong> {provider.contact}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="w-full mt-8 ml-[-30px]">
        <hr className="border-gray-300" />
      </div>
      <Footer />
    </div>
  );
};

export default ServiceProvider;
