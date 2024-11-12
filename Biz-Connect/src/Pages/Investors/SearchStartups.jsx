import { FaRegLightbulb } from "react-icons/fa";
import Footer from "../Components/Footer";
// import FilterForStartups from "./Components/FilterForStartups";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
// import { Filter } from "@mui/icons-material";
import { Container, Typography, Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem  } from '@mui/material';

import axios from 'axios';

const ServiceProviderCard = ({
    ServiceProviderID, ServiceProviderName,ServiceDescription, TypeOfService, SpecificSectors, SubCity  
}) => {
    return (
      <Link
        // to='/ServiceProviderDetail/'
        to={`/ServiceProviderDetail/?ServiceID=${ServiceProviderID}`}
        // to={{
        //   pathname: "/ServiceProviderDetail",
        //   state: { serviceID: ServiceProviderID }
        // }}
        className="block transition-transform hover:scale-105"
      >
        <div className="absloute border w-[900px]  ml-[100px] rounded-lg p-10 bg-white shadow-lg mb-6">
          <div className="flex justify-between items-center p-3">
            <div>
              <div>
                <h3 className="text-3xl font-semibold ml-[-15px] ">{ServiceProviderName}</h3>
                <p className="text-dark mediumText mb-3">
                  <span className="p-3 -ml-3 font-bold ">Location:-</span>
                  {SubCity}
                </p>
              </div>
              <div className="flex space-x-4 absolute ml-[690px] mt-[80px]">
                <a
                  href="/SPDetail/?ServiceID=${ServiceProviderID}"
                  className="text-red-500  whitespace-nowrap border border-red-500 px-3 py-1 rounded-full hover:bg-red-500 hover:text-white transition"
                >
                  View Details
                </a>
              </div>
              <p className="text-dark mediumText -mt-4 mb-3">
                <span className="p-3 -ml-3 font-bold">Servicedescription:</span>
                <div className="">
                  {ServiceDescription.split(".").map((sentence, index) => (
                    <span key={index}>
                      {sentence.trim() && <>{sentence.trim()}.</>}
                      <br />
                    </span>
                  ))}
                </div>
              </p>
            </div>
          </div>
  
          <div className="flex justify-between items-center mt-4 ">
            <div className="flex space-x-2 ml-3">
              {TypeOfService.map((services, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-black px-3 py-1 rounded-full text-sm"
                >
                  {services}
                </span>
              ))}
              {SpecificSectors.map((sectors, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-black px-3 py-1 rounded-full text-sm"
                >
                  {sectors}
                </span>
              ))}

            </div>
          </div>
        </div>
      </Link>
    );
  };


const SearchStartups = () => {

    const [serviceList, setServiceList] = useState([
        {
            ServiceProviderID: 1234,
            ServiceProviderName: "Addis Legal Advisors",
            ServiceDescription: "Providing legal consulting for startups including. incorporation, compliance, and intellectual property protection.",
            TypeOfService: [
              "Legal Consulting",
              "Incorporation",
              "Compliance",
              "Intellectual Property Protection",
            ],
            SpecificSectors: ["Tech", "Healthcare", "Manufacturing"],
            SubCity: "Bole",
          },

          {
            ServiceProviderID: 5678,
            ServiceProviderName: "Blue Horizon Ventures",
            ServiceDescription: "Helping startups in the East African region to scale by providing business strategy, growth consulting, and market research services.",
            TypeOfService: [
              "Business Strategy",
              "Market Research",
              "Growth Consulting",
              "Startup Mentorship",
            ],
            SpecificSectors: ["Agriculture", "Fintech", "E-commerce"],
            SubCity: "Bole",
          }
      
    ]);
    const [FilterName, SetFilterName] = useState('');
    const [FilterService, setFilterService] = useState('');
    const [FilterSector, setFilterSector] = useState('');
    const [FilterSubCity, setFilterSubCity] = useState(null);
    const [ViewFilters , setViewFilters] = useState(true);
    const [NewFilterSetting, setNewFilterSetting] = useState([null,null,null,null])
    

      const addFormValue = (newValue) => {

        setServiceList((prevValues) => {
            const exists = prevValues.some(value => value.ServiceProviderID === newValue.ServiceProviderID);
            if (!exists) {
                return [...prevValues, newValue];
              }
          
              // If it exists, return the previous values without adding anything
              return prevValues;
    
        //   ...prevValues, // Spread the previous values to keep them
        //   newValue       // Add the new value
      });
      };
    
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      console.log("Fetching Data");
      console.log("Token: " + token);
      console.log("New Filter Settings")
      console.log(NewFilterSetting);

      const newForm = {
        token : token,
        ServiceProviderName: NewFilterSetting[0],
        TypeOfService: NewFilterSetting[1],
        SpecificSectors:NewFilterSetting[2],
        SubCity:NewFilterSetting[3]
      }
      console.log("New Form To Sent: " + JSON.stringify(newForm));
      setServiceList([]);
  

      await axios.post("http://localhost:5000/api/GetFilteredServiceProviders", newForm, {
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (response) => {
            console.log(response.data);
            if(response.data.length>0){
                console.log("Number of Retrived Service Providers "+response.data.length)
            // setServiceList([{
            //     ServiceProviderID : response.data[0].ServiceProviderID,
            //     ServiceProviderName: response.data[0].ServiceProviderName,
            //     TypeOfService: JSON.parse(response.data[0].TypeOfService),
            //     ServiceDescription: response.data[0].ServiceDescription,
            //     SpecificSectors:JSON.parse(response.data[0].SpecificSectors),
            //     SubCity : response.data[0].SubCity,   
                
            // }]);
            for(let i = 0; i< response.data.length; i++) {
                addFormValue(
                    {
                        ServiceProviderID : response.data[i].ServiceProviderID,
                        ServiceProviderName: response.data[i].ServiceProviderName,
                        ServiceDescription: response.data[i].ServiceDescription,
                        TypeOfService: JSON.parse(response.data[i].TypeOfService),
                        SpecificSectors:JSON.parse(response.data[i].SpecificSectors),
                        SubCity : response.data[i].SubCity,   
                        
                    }
                          
                  );
                // setServiceList(
                //     ...serviceList,
                //     {
                //     ServiceProviderID : response.data[0].ServiceProviderID,
                //     ServiceProviderName: response.data[0].ServiceProviderName,
                //     TypeOfService: JSON.parse(response.data[0].TypeOfService),
                //     ServiceDescription: response.data[0].ServiceDescription,
                //     SpecificSectors:JSON.parse(response.data[0].SpecificSectors),
                //     SubCity : response.data[0].SubCity,   
                    
                // });
    
                
            }
        }else console.log("Retrived Nothing")

            //setServiceList(response.data);
            console.log(JSON.stringify(serviceList));
            //console.log(response.data[0]);



      })
      .catch((err) => {
        console.log(err);                  
      })

    };

    fetchData();
  }, [NewFilterSetting]);

  const handleSubmit = (e)=>{
    e.preventDefault();
    let SettingSector = null;
    let SettingService = null;
    let SettingSubCity = null;
    let SettingName = null;

    if(FilterName == null || FilterName.length == 0) SettingName = '';
    else SettingName = FilterName;

    if(FilterSector == null || FilterSector.length == 0) SettingSector = '';
    else SettingSector = FilterSector;

    if(FilterService == null || FilterService.length == 0) SettingService = '';
    else SettingService = FilterService;

    if(FilterSubCity == null || FilterSubCity.length == 0) SettingSubCity = '';
    else SettingSubCity = FilterSubCity;
    // console.log("FilterName: " + FilterName+"\nFilterService: " + FilterService+"\nFilterSector: " + FilterSector+"\nFilterSubCity: " + FilterSubCity);

    setNewFilterSetting([SettingName, SettingService, SettingSector, SettingSubCity]);
    // console.log(NewFilterSetting);

  }

    return (
          <div className="investor-container min-h-screen ml-[2px] -mt-10  p-5 mx-auto max-w-7xl">
            <div className="text-center my-8">
              <h1 className="text-2xl font-bold">
                Yous can search any ServiceProvider
              </h1>
            </div>
      
            <div className="search-container flex flex-col md:flex-row justify-between items-start mb-6 w-full">
              <input
                type="text"
                placeholder="Search Your Service provider"
                className="p-3 border border-gray-300 rounded-lg focus:outline-none w-full"
                value={FilterName}
                onChange={(e)=>SetFilterName(e.target.value)}

              />
              <button
                className="bg-green-500 whitespace-nowrap text-white p-3 rounded-lg w-full md:w-auto mt-2 md:mt-0 md:ml-4"
                style={{ height: "auto" }}
                onClick={(e)=>{ handleSubmit(e)}}

              >
                Save Search
              </button>
            </div>
            <div className="filter-container flex flex-col md:flex-row justify-between items-start mb-6 w-full">
            <button
                className="bg-green-500 whitespace-nowrap text-white p-3 rounded-lg w-full md:w-auto mt-2 md:mt-0 md:ml-4"
                style={{ height: "auto" }}
                onClick={(e)=>{
                    e.preventDefault(); 
                    if(ViewFilters)setViewFilters(false);
                    else setViewFilters(true);
                    }}
              >
                View Filters
              </button>
              {ViewFilters && (
                <>
                <Container maxWidth="md">
                    <Typography variant="h4" align="center" gutterBottom style={{ marginTop: '30px', marginBottom: '20px' }}>
                    Additional Filters
                    </Typography>
                    <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>

                        {/* Service Provider Name */}
                        {/* <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Service Provider Name"
                            name="ServiceProviderName"
                            value={FilterName}
                            onChange={(e)=>SetFilterName(e.target.value)}
                        />
                        </Grid> */}

                        {/* Specific Sectors */}
                        <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Specific Sectors"
                            name="SpecificSectors"
                            value={FilterSector}
                            onChange={(e)=>setFilterSector(e.target.value)}
                        />
                        </Grid>

                        {/* Type Of Service */}
                        <Grid item xs={12}>
                        <TextField
                            fullWidth
                            name="Type Of Service"
                            value={FilterService}
                            onChange={(e)=>setFilterService(e.target.value)}
                        />
                        </Grid>


                        {/* Sub-city */}
                        <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Sub-City</InputLabel>
                            <Select
                            name="subCity"
                            value={FilterSubCity}
                            onChange={(e)=>setFilterSubCity(e.target.value)}
                            >
                            <MenuItem value={null}></MenuItem>
                            <MenuItem value="Arada">Arada</MenuItem>
                            <MenuItem value="Addis Ketema">Addis Ketema</MenuItem>
                            <MenuItem value="Akaki Kality">Akaki Kality</MenuItem>
                            <MenuItem value="Bole">Bole</MenuItem>
                            <MenuItem value="Gullele">Gullele</MenuItem>
                            <MenuItem value="Kirkos">Kirkos</MenuItem>
                            <MenuItem value="Kolfe Keranio">Kolfe Keranio</MenuItem>
                            <MenuItem value="Lideta">Lideta</MenuItem>
                            <MenuItem value="Nifas Silk-Lafto">Nifas Silk-Lafto</MenuItem>
                            <MenuItem value="Yeka">Yeka</MenuItem>
                            <MenuItem value="Lemi Kura">Lemi Kura</MenuItem>

                            </Select>
                        </FormControl>
                        </Grid>

                        {/* Submit Button */}
                        <Grid item xs={12}>
                        <Button type="submit" fullWidth variant="contained" color="primary" style={{ marginTop: '20px' }}>
                            Submit Filters
                        </Button>
                        </Grid>
                    </Grid>
                    </form>
                    </Container>

                </>
              )}
            </div>
            <div className="flex space-x-4">
              <a
                href="/DetailOfServiceProvider"
                className="text-red-500 border border-red-500 px-3 py-1 rounded-full flex items-center hover:bg-red-500 hover:text-white transition"
              >
                <FaRegLightbulb className="mr-2 text-black" /> Recommendations
              </a>
      
              <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-500 border border-red-500 px-3 py-1 rounded-full hover:bg-red-500 hover:text-white transition flex items-center"
              >
                Recently Searched
              </a>
            </div>
      
            <div className="relative flex space-x-8">
                <div className="p-10 ">
                    <div className="space-y-6 ml-[50px]">

                    {(serviceList.length > 0  &&  Array.isArray(serviceList))? (
                        <>
                        {serviceList.map((provider, index) => (
                        <ServiceProviderCard key={index} {...provider} />
                    ))}
                    </>

                    ):(
                        <h1>There Are No Service Providers That Match The Given Filters</h1>

                    )}
                    
                    </div>
                </div>
                {/* <div className="relative flex space-x-8">
                    <div className="w-[300px] ml-[-900px] p-4 mt-[44px] ">
                    <FilterForStartups />
                    </div>
                </div> */}
                </div>

            <div className="w-full mt-8">
              <hr className="border-gray-300" />
            </div>
            <Footer />
          </div>
        );
      };
      
      
  
  export default SearchStartups;
  