import { useState } from 'react';
import { Container, Typography, Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem, Input, CircularProgress, Box  } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const ServiceProviderProfileCreate = () => {
  const navigate = useNavigate(); // useNavigate hook to programmatically navigate

  const [ErrorMessage, setErrorMessage] = useState(null);
  const [ResponseMessage, setResponseMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [previewUrl, setPreviewUrl] = useState(null);  // Store the preview image URL

  const [serviceProviders, setServiceProviders] = useState({
    ServiceProviderName: 'TechHub Solutions',
    TypeOfService: ['IT Consulting'],
    ServiceDescription: 'We provide IT solutions for businesses in Addis Ababa.',
    SubCity: 'Bole',
    ExperienceInIndustry: '10 years',
    SpecificSectors: ['Technology', 'E-commerce'],
    PricingStructure: 'Project-based pricing',
    TeamSize: 15,
    PackageName: ['Starter', 'Pro', 'Enterprise'],
    PackageDetails: ['Basic support', 'Advanced support and strategy', 'Full digital transformation'],
    AccrediationName: ['ISO 27001'],
    AccrediationDetails: ['Certified for information security management systems'],
    ReferancesName: ['ABC Corp', 'XYZ Ltd'],
    ReferancesDetails: ['Provided full IT infrastructure setup for ABC Corp', 'Managed cloud solutions for XYZ Ltd'],
    // SignupDate: '2023-09-15 09:30:00',
    Phone1: '0912345678',
    Phone2: '0922334455',
    BusinessEmail: 'Innovate124@TechHub.com',
    BusinessLocation: 'Addis Ababa, Bole Avenue',
    image: null,
  });

  // Extract query parameters
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');




  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Preview the image
      setPreviewUrl(URL.createObjectURL(file));
      setServiceProviders({
        ...serviceProviders,
        image: file,
      });
  
    }
  };

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setServiceProviders({
      ...serviceProviders,
      [name]: value,
    });
  };

  const handleMultiChange = (index, e) => {
    const { name } = e.target;
    let newValues; 
    if(name === 'PackageName')  newValues = [...serviceProviders.PackageName];  
    else if(name === 'PackageDetails')  newValues = [...serviceProviders.PackageDetails];
    else if(name === 'AccrediationName')  newValues = [...serviceProviders.AccrediationName];
    else if(name === 'AccrediationDetails')  newValues = [...serviceProviders.AccrediationDetails];
    else if(name === 'ReferancesName')  newValues = [...serviceProviders.ReferancesName];
    else if(name === 'ReferancesDetails')  newValues = [...serviceProviders.ReferancesDetails];
    else return;  
    
    newValues[index] = e.target.value;
    setServiceProviders({
        ...serviceProviders,
        [name]: newValues,
        });
  };

  // Add a new input field
  const handleMultiAdd = (e) => {

    const { name } = e.target;
    if(name === 'PackageName' && serviceProviders.PackageName[(serviceProviders.PackageName.length -1)].length > 0) {
      setServiceProviders({
        ...serviceProviders,
        PackageName: [...serviceProviders.PackageName, ''],
        PackageDetails: [...serviceProviders.PackageDetails, '']
      });
    }
    else if(name === 'AccrediationName' && serviceProviders.AccrediationName[(serviceProviders.AccrediationName.length -1)].length > 0) {
      setServiceProviders({
        ...serviceProviders,
        AccrediationName: [...serviceProviders.AccrediationName, ''],
        AccrediationDetails: [...serviceProviders.AccrediationDetails, '']
      });
    }
    else if(name === 'ReferancesName' && serviceProviders.ReferancesName[(serviceProviders.ReferancesName.length -1)].length > 0) {
      setServiceProviders({
        ...serviceProviders,
        ReferancesName: [...serviceProviders.ReferancesName, ''],
        ReferancesDetails: [...serviceProviders.ReferancesDetails, '']
      });
    }

  }

  // Remove an input field
  const handleMultiRemove = (index, e) => {
    const { name } = e.target;
    if(name === 'PackageName') {

      const updatedPackageName = [...serviceProviders.PackageName];
      const updatedPackageDetails = [...serviceProviders.PackageDetails];
      updatedPackageName.splice(index, 1);
      updatedPackageDetails.splice(index, 1);
      setServiceProviders({
        ...serviceProviders,
        PackageName: updatedPackageName,
        PackageDetails: updatedPackageDetails
      });


    }
    else if(name === 'AccrediationName') {

      const updatedAccrediationName = [...serviceProviders.AccrediationName];
      const updatedAccrediationDetails = [...serviceProviders.AccrediationDetails];
      updatedAccrediationName.splice(index, 1);
      updatedAccrediationDetails.splice(index, 1);
      setServiceProviders({
        ...serviceProviders,
        AccrediationName: updatedAccrediationName,
        AccrediationDetails: updatedAccrediationDetails
      });


    }
    else if(name === 'ReferancesName') {

      const updatedReferancesName = [...serviceProviders.ReferancesName];
      const updatedReferancesDetails = [...serviceProviders.ReferancesDetails];
      updatedReferancesName.splice(index, 1);
      updatedReferancesDetails.splice(index, 1);
      setServiceProviders({
        ...serviceProviders,
        ReferancesName: updatedReferancesName,
        ReferancesDetails: updatedReferancesDetails
      });

    }


    
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    let val = "Token: "+token+"\n";
    Object.entries(serviceProviders).forEach(entry => {
      const [key, value] = entry;
      val += key +": "+JSON.stringify(value) + "\n"

    });
    console.log(val);
    setLoading(true);


    const formPayload = new FormData();
    formPayload.append('file', serviceProviders.image);
    formPayload.append('token', token);
    formPayload.append('ServiceProviderName', serviceProviders.ServiceProviderName);
    formPayload.append('TypeOfService', JSON.stringify(serviceProviders.TypeOfService));//Array
    formPayload.append('ServiceDescription', serviceProviders.ServiceDescription);
    formPayload.append('SubCity', serviceProviders.SubCity);
    formPayload.append('ExperienceInIndustry', serviceProviders.ExperienceInIndustry);
    formPayload.append('SpecificSectors', JSON.stringify(serviceProviders.SpecificSectors));
    formPayload.append('PricingStructure', serviceProviders.PricingStructure);
    formPayload.append('TeamSize', serviceProviders.TeamSize);
    formPayload.append('PackageName', JSON.stringify(serviceProviders.PackageName));//Array
    formPayload.append('PackageDetails', JSON.stringify(serviceProviders.PackageDetails));//Array
    formPayload.append('AccrediationName', JSON.stringify(serviceProviders.AccrediationName));//Array
    formPayload.append('AccrediationDetails', JSON.stringify(serviceProviders.AccrediationDetails));//Array
    formPayload.append('ReferancesName', JSON.stringify(serviceProviders.ReferancesName));//Array
    formPayload.append('ReferancesDetails', JSON.stringify(serviceProviders.ReferancesDetails));//Array
    formPayload.append('Phone1', serviceProviders.Phone1);
    formPayload.append('Phone2', serviceProviders.Phone2);
    formPayload.append('BusinessEmail', serviceProviders.BusinessEmail);
    formPayload.append('BusinessLocation', serviceProviders.BusinessLocation);
    


    try {
       const response = await axios.post("http://localhost:5000/api/auth/createServiceProviderProfile", formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Successful Registration: \n"+ JSON.stringify(response.data.form));
      setResponseMessage("You Have Successfully Registered")
    } catch (err) {
      console.log("Error : \n" + err)
      // Check if the error is from the server response
      if (err.response && err.response.data) {
        // Display the error message sent by the backend
        setErrorMessage(err.response.data.message);
      } else {
        // Handle other errors (like network issues)
        setErrorMessage('Something went wrong. Please try again later. '+err);
      }

    }

  };


 
 
  return (
    <>
  {token ? (
    <>

    {!loading ? (

    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom style={{ marginTop: '30px', marginBottom: '20px' }}>
        Service Provider Profile Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>

          {/* Service Provider Name */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Service Provider Name"
              name="ServiceProviderName"
              value={serviceProviders.ServiceProviderName}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Types of Service */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Types of Service (Separate by Comma)"
              name="TypeOfService"
              multiline
              rows={4}
              value={serviceProviders.TypeOfService.join(', ')}
              onChange={(e) =>
                setServiceProviders({
                  ...serviceProviders,
                  TypeOfService: e.target.value.split(',').map((sector) => sector.trim()),
                })
              }
              required
              style={{ marginTop: '10px', marginBottom: '20px' }}
            />
          </Grid>

          {/* Service Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Service Description"
              name="ServiceDescription"
              multiline
              rows={4}
              value={serviceProviders.ServiceDescription}
              onChange={handleChange}
              required
              style={{ marginTop: '10px', marginBottom: '20px' }}
            />
          </Grid>

          {/* Sub-city */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Sub-City</InputLabel>
              <Select
                name="subCity"
                value={serviceProviders.subCity}
                onChange={handleChange}
              >
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

          {/* Team Size  */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
              type="number"
              label="Team Size "
              name="teamSize"
              value={serviceProviders.teamSize}
              onChange={handleChange}
              required
            />
            </FormControl>
          </Grid>            

          {/* Experience In Industry */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Experience In Industry"
              name="ExperienceInIndustry"
              multiline
              rows={4}
              value={serviceProviders.ExperienceInIndustry}
              onChange={handleChange}
              required
              style={{ marginTop: '10px', marginBottom: '20px' }}
            />
          </Grid>

          {/* Specific Sectors */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Specific Industry Sectors (Separated by a comma)"
              name="SpecificSectors"
              multiline
              rows={4}
              value={serviceProviders.SpecificSectors.join(', ')}
              onChange={(e) =>
                setServiceProviders({
                  ...serviceProviders,
                  SpecificSectors: e.target.value.split(',').map((sector) => sector.trim()),
                })
              }
              required
              style={{ marginTop: '10px', marginBottom: '20px' }}
            />
          </Grid>

          {/* Pricing Structure */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Pricing Structure"
              name="PricingStructure"
              multiline
              rows={4}
              value={serviceProviders.PricingStructure}
              onChange={handleChange}
              required
              style={{ marginTop: '10px', marginBottom: '20px' }}
            />
          </Grid>

          {/* Package Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Packages
            </Typography>

            {/* Package Loop */}
            {serviceProviders.PackageName.length > 0 &&
              serviceProviders.PackageName.map((value, index) => (
                <div key={index} style={{ marginBottom: '20px' }}>
                <TextField
                  fullWidth
                  label={`Package Name ${index+1}`}
                  name="PackageName"
                  value={value}
                  onChange={(event) => handleMultiChange(index, event)}
                  required
                  style={{ marginTop: '10px' }}
                />
                <TextField
                  fullWidth
                  label={`Package Details ${index+1}`}
                  name="PackageDetails"
                  multiline
                  rows={4}
                  value={serviceProviders.PackageDetails[index]}
                  onChange={(event) => handleMultiChange(index, event)}
                  placeholder={`Package Details ${index + 1}`}
                  style={{ marginTop: '10px', marginBottom: '20px' }}
                />
                  
                  {serviceProviders.PackageName.length > 1 && (
                    <>
                      <Button
                      type="button"
                      name="PackageName"
                      variant="outlined"
                      color="secondary"
                      onClick={(e) => handleMultiRemove(index, e)}
                      style={{ marginTop: '10px' }}
                    >
                      Remove
                    </Button>
                  </>
                  )}
                </div>
              ))}

            <Button
              type="button"
              variant="outlined"
              color="primary"
              name="PackageName"
              onClick={(e) => {handleMultiAdd(e)}}
            >
              Add More Packages
            </Button>
          </Grid>

          {/* Accrediation Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
            Accrediations
            </Typography>

            {/* Accrediation Loop */}
            {serviceProviders.AccrediationName.length > 0 &&
              serviceProviders.AccrediationName.map((value, index) => (
                <div key={index} style={{ marginBottom: '20px' }}>
                <TextField
                  fullWidth
                  label={`Accrediation Name ${index+1}`}
                  name="AccrediationName"
                  value={value}
                  onChange={(event) => handleMultiChange(index, event)}
                  required
                  style={{ marginTop: '10px' }}
                />
                <TextField
                  fullWidth
                  label={`Accrediation Details ${index+1}`}
                  name="AccrediationDetails"
                  multiline
                  rows={4}
                  value={serviceProviders.AccrediationDetails[index]}
                  onChange={(event) => handleMultiChange(index, event)}
                  placeholder={`Accrediation Details ${index + 1}`}
                  style={{ marginTop: '10px', marginBottom: '20px' }}
                />
                  
                  {serviceProviders.AccrediationName.length > 1 && (
                    <>
                      <Button
                      type="button"
                      name="AccrediationName"
                      variant="outlined"
                      color="secondary"
                      onClick={(e) => handleMultiRemove(index, e)}
                      style={{ marginTop: '10px' }}
                    >
                      Remove
                    </Button>
                  </>
                  )}
                </div>
              ))}

            <Button
              type="button"
              variant="outlined"
              color="primary"
              name="AccrediationName"
              onClick={(e) => {handleMultiAdd(e)}}
            >
              Add More Accrediations
            </Button>
          </Grid>

          {/* Referances Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
            Referances
            </Typography>

            {/* Referances Loop */}
            {serviceProviders.ReferancesName.length > 0 &&
              serviceProviders.ReferancesName.map((value, index) => (
                <div key={index} style={{ marginBottom: '20px' }}>
                <TextField
                  fullWidth
                  label={`Referances Name ${index+1}`}
                  name="ReferancesName"
                  value={value}
                  onChange={(event) => handleMultiChange(index, event)}
                  required
                  style={{ marginTop: '10px' }}
                />
                <TextField
                  fullWidth
                  label={`Referances Details ${index+1}`}
                  name="ReferancesDetails"
                  multiline
                  rows={4}
                  value={serviceProviders.ReferancesDetails[index]}
                  onChange={(event) => handleMultiChange(index, event)}
                  placeholder={`Referances Details ${index + 1}`}
                  style={{ marginTop: '10px', marginBottom: '20px' }}
                />
                  
                  {serviceProviders.ReferancesName.length > 1 && (
                    <>
                      <Button
                      type="button"
                      name="ReferancesName"
                      variant="outlined"
                      color="secondary"
                      onClick={(e) => handleMultiRemove(index, e)}
                      style={{ marginTop: '10px' }}
                    >
                      Remove
                    </Button>
                  </>
                  )}
                </div>
              ))}

            <Button
              type="button"
              variant="outlined"
              color="primary"
              name="ReferancesName"
              onClick={(e) => {handleMultiAdd(e)}}
            >
              Add More Referances
            </Button>
          </Grid>

          {/* Business Location */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="BusinessLocation"
              value={serviceProviders.BusinessLocation}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Service Provider Business Email   */}
          <Grid item xs={12}>
          <TextField
              fullWidth
              label={`Business Email`}
              name="BusinessEmail"
              value={serviceProviders.BusinessEmail}
              type="email"
              onChange={handleChange}
              required
              style={{ marginTop: '10px' }}
            />

          </Grid>

          {/* Phone 1  */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
              type="tel"
              label="Phone 1 "
              name="Phone1"
              value={serviceProviders.Phone1}
              onChange={handleChange}
              required
            />
            </FormControl>
          </Grid>   

          {/* Phone 2  */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField 
              type = "tel"
              label="Phone 2 "
              name="Phone2"
              value={serviceProviders.Phone2}
              onChange={handleChange}
            />
            </FormControl>
          </Grid>

          {/* Upload Profile Picture */}
          <Grid item xs={12} sm={6}>
            <h1>Upload Profile Picture</h1>
            <Input
              fullWidth
              type="file"
              // accept="image/*" 
              onChange={handleFileChange}
              inputProps={{ accept: "image/*" }} // Optional: restrict file types
            />
            
          </Grid>
          <Grid item xs={12} sm={6}>

            {previewUrl && (
              <div>
                <h3>Image Preview:</h3>
                <img src={previewUrl} alt="Selected" style={{ width: '200px', height: 'auto' }} />
              </div>
            )}
        </Grid>
        {/* Submit Button */}
          <Grid item xs={12}>
            <Button type="submit" fullWidth variant="contained" color="primary" style={{ marginTop: '20px' }}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  ): (


<div>
  {ErrorMessage || ResponseMessage ? (
    <div>
      {ErrorMessage ? (
        <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '100px' }}>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <Typography variant="h6" style={{ marginTop: '20px' }}>
          {ErrorMessage}
        </Typography>
        <Button
          variant="outlined"
          onClick={(e) =>{e.preventDefault(); setLoading(false); setErrorMessage(null);}}
          style={{ marginTop: '10px' }}
        >
          Back
        </Button>

        
      </Box>
      
    </Container>



      ):(
        <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '100px' }}>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <Typography variant="h6" style={{ marginTop: '20px' }}>
          {ResponseMessage}
        </Typography>
        <Button
          variant="outlined"
          onClick={(e) =>{e.preventDefault(); setLoading(false); 
          navigate('/');
          }}
          style={{ marginTop: '10px' }}
        >
          Close
        </Button>

        
      </Box>
      
    </Container>

      )}

    </div>
  ):(
    <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '100px' }}>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <CircularProgress size={60} />
        <Typography variant="h6" style={{ marginTop: '20px' }}>
          Waiting For Response
        </Typography>
        <Button
          variant="outlined"
          onClick={(e) =>{e.preventDefault(); setLoading(false) }}
          style={{ marginTop: '10px' }}
        >
          Back
        </Button>


      </Box>
      
    </Container>

  )}
</div>


  )}
    </>

  ):(
    <>
    <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '100px' }}>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
         {/* <CircularProgress size={60} />  */}
        <Typography variant="h1" style={{ marginTop: '20px' }}>
         Error! Please Reattempt to Signup
          {/* <br/><br/> */}
        </Typography>
      </Box>
    </Container>
    </>
  )}
    </>
    
  );
};

export default ServiceProviderProfileCreate;
