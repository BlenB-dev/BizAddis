import { useState } from 'react';
import { Container, Typography, Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem, Input, CircularProgress, Box  } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const StartupForm = () => {
  

  // Extract query parameters
   const queryParams = new URLSearchParams(location.search);
   const token = queryParams.get('token');

   const [ErrorMessage, setErrorMessage] = useState(null);
   const [ResponseMessage, setResponseMessage] = useState(null);
   const [loading, setLoading] = useState(false);
 
 

  const [fileErrorMessage, setFileErrorMessage] = useState("");
  const maxSizeInBytes = 15 * 1024 * 1024; // 5MB file size limit

  const navigate = useNavigate(); // useNavigate hook to programmatically navigate



  
  const [formValues, setFormValues] = useState({
    startupName: '',
    founders: [''],
    foundersBio: [ ''],
    businessDescription: '',
    industrySector: null,
    businessModel: null,
    stageOfDevelopment: null,
    subCity: null,
    fundingRequirement: null,
    currentFundingStatus: null,
    useOfFunds: null,
    revenueModel: null,
    currentRevenue: null,
    marketSize: null,
    competitiveAdvantage: null,
    customerBase: null,
    financialProjections: null,
    teamSize: null,
    keyTeamMembers: [''],
    advisors: [''],
    legalStructure: null,
    existingPartnerships: [''],
    socialImpactGoals: null,
    pitchDeck: null,
    startupEmail: null,
    phone1: null,
    phone2: null,
  });
  
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > maxSizeInBytes) {
        setFileErrorMessage("File size exceeds the 15 MB limit. Please select a smaller file.");
        // setSelectedFile(null); // Reset the file if it exceeds the size limit
        setFormValues({
          ...formValues,
          pitchDeck: null,
        });

      } else {
        setFileErrorMessage(""); // Clear any previous error messages
        setFormValues({
          ...formValues,
          pitchDeck: file,
        });
    
        console.log(formValues.pitchDeck);

      }
    }else{
      setFileErrorMessage(""); // Clear any previous error messages
      setFormValues({
        ...formValues,
        pitchDeck: null,
      });

    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    // if(name === 'founders') alert("Changeing Founders");
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleMultiChange = (index, e) => {
    const { name } = e.target;
    let newValues; 
    if(name === 'founders')  newValues = [...formValues.founders];  
    else if(name === 'foundersBio')  newValues = [...formValues.foundersBio];
    else if(name === 'keyTeamMembers')  newValues = [...formValues.keyTeamMembers];
    else if(name === 'advisors')  newValues = [...formValues.advisors];
    else if(name === 'existingPartnerships')  newValues = [...formValues.existingPartnerships];
    else return;  
    
    newValues[index] = e.target.value;
    setFormValues({
        ...formValues,
        [name]: newValues,
        });
  };

  // Add a new input field
  const handleMultiAdd = (e) => {

    const { name } = e.target;
    if(name === 'founders' && formValues.founders[(formValues.founders.length -1)].length > 0) {
      setFormValues({
        ...formValues,
        founders: [...formValues.founders, ''],
        foundersBio: [...formValues.foundersBio, '']
      });
    }
    else if(name === 'keyTeamMembers' && formValues.keyTeamMembers[(formValues.keyTeamMembers.length -1)].length > 0) {
      setFormValues({
        ...formValues,
        keyTeamMembers: [...formValues.keyTeamMembers, ''],
      });
    }
    else if(name === 'advisors' && formValues.advisors[(formValues.advisors.length -1)].length > 0) {
      setFormValues({
        ...formValues,
        advisors: [...formValues.advisors, ''],
      });
    }
    else if(name === 'existingPartnerships' && formValues.existingPartnerships[(formValues.existingPartnerships.length -1)].length > 0) {
      setFormValues({
        ...formValues,
        existingPartnerships: [...formValues.existingPartnerships, ''],
      });
    }

  }

  // Remove an input field
  const handleMultiRemove = (index, e) => {
    const { name } = e.target;
    if(name === 'founders') {

      const updatedFounders = [...formValues.founders];
      const updatedFoundersBio = [...formValues.foundersBio];
      updatedFounders.splice(index, 1);
      updatedFoundersBio.splice(index, 1);
      setFormValues({
        ...formValues,
        founders: updatedFounders,
        foundersBio: updatedFoundersBio
      });


    }
    else if(name === 'keyTeamMembers') {

      const updatedTeamMembers = [...formValues.keyTeamMembers];
      updatedTeamMembers.splice(index, 1);
      setFormValues({
        ...formValues,
        keyTeamMembers: updatedTeamMembers,
      });


    }
    else if(name === 'advisors') {

      const updatedAdvisors = [...formValues.advisors];
      updatedAdvisors.splice(index, 1);
      setFormValues({
        ...formValues,
        advisors: updatedAdvisors,
      });


    }
    else if(name === 'existingPartnerships') {

      const updatedPartnerships = [...formValues.existingPartnerships];
      updatedPartnerships.splice(index, 1);
      setFormValues({
        ...formValues,
        existingPartnerships: updatedPartnerships,
      });


    }
};

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);


    const formPayload = new FormData();
    formPayload.append('file', formValues.pitchDeck);
    formPayload.append('token', token);
    formPayload.append('startupName', formValues.startupName);
    formPayload.append('founders', JSON.stringify(formValues.founders));//Array
    formPayload.append('foundersBio', JSON.stringify(formValues.foundersBio));//Array
    formPayload.append('businessDescription', formValues.businessDescription);
    formPayload.append('industrySector', formValues.industrySector);
    formPayload.append('businessModel', formValues.businessModel);
    formPayload.append('stageOfDevelopment', formValues.stageOfDevelopment);
    formPayload.append('subCity', formValues.subCity);
    formPayload.append('fundingRequirement', formValues.fundingRequirement);
    formPayload.append('currentFundingStatus', formValues.currentFundingStatus);
    formPayload.append('useOfFunds', formValues.useOfFunds);
    formPayload.append('revenueModel', formValues.revenueModel);
    formPayload.append('currentRevenue', formValues.currentRevenue);
    formPayload.append('marketSize', formValues.marketSize);
    formPayload.append('competitiveAdvantage', formValues.competitiveAdvantage);
    formPayload.append('customerBase', formValues.customerBase);
    formPayload.append('financialProjections', formValues.financialProjections);
    formPayload.append('teamSize', formValues.teamSize);
    formPayload.append('keyTeamMembers', JSON.stringify(formValues.keyTeamMembers));//Array
    formPayload.append('advisors', JSON.stringify(formValues.advisors));//Array
    formPayload.append('legalStructure', formValues.legalStructure);
    formPayload.append('existingPartnerships', JSON.stringify(formValues.existingPartnerships));//Array
    formPayload.append('socialImpactGoals', formValues.socialImpactGoals);
    formPayload.append('startupEmail', formValues.startupEmail);
    formPayload.append('phone1', formValues.phone1);
    formPayload.append('phone2', formValues.phone2);
    formPayload.append('StoragePath', "StartupStorage/PitchDeck");


    try {
       const response = await axios.post("http://localhost:5000/api/auth/createStartupProfile", formPayload, {
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
        Startup Information Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>

          {/* Startup Name */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Startup Name"
              name="startupName"
              value={formValues.startupName}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Founders Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Founder Information
            </Typography>

            {/* Founder Loop */}
            {formValues.founders.length > 0 &&
              formValues.founders.map((value, index) => (
                <div key={index} style={{ marginBottom: '20px' }}>
                <TextField
                  fullWidth
                  label={`Founder Name ${index+1}`}
                  name="founders"
                  value={value}
                  onChange={(event) => handleMultiChange(index, event)}
                  required
                  style={{ marginTop: '10px' }}
                />
                <TextField
                  fullWidth
                  label={`Founder Bio ${index+1}`}
                  name="foundersBio"
                  multiline
                  rows={4}
                  value={formValues.foundersBio[index]}
                  onChange={(event) => handleMultiChange(index, event)}
                  placeholder={`Founder Bio ${index + 1}`}
                  style={{ marginTop: '10px', marginBottom: '20px' }}
                />
                  
                  {formValues.founders.length > 1 && (
                    <>
                      <Button
                      type="button"
                      name="founders"
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
              name="founders"
              onClick={(e) => {handleMultiAdd(e)}}
            >
              Add More Founders
            </Button>
          </Grid>

          {/* Business Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Business Description"
              name="businessDescription"
              multiline
              rows={4}
              value={formValues.businessDescription}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Industry Sector */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Industry Sector</InputLabel>
              <Select
                name="industrySector"
                value={formValues.industrySector}
                onChange={handleChange}
                required
              >
                <MenuItem value={1}>Technology</MenuItem>
                <MenuItem value={2}>FinTech (Financial Technology)</MenuItem>
                <MenuItem value={3}>E-Commerce & Retail</MenuItem>
                <MenuItem value={4}>Marketing & Advertising</MenuItem>
                <MenuItem value={5}>Education & EdTech</MenuItem>
                <MenuItem value={6}>Human Resources (HRTech)</MenuItem>
                <MenuItem value={7}>Entertainment & Media</MenuItem>
                <MenuItem value={8}>Transportation & Mobility</MenuItem>
                <MenuItem value={9}>Aerospace & Aviation</MenuItem>
                <MenuItem value={10}>Security & Defense</MenuItem>
                <MenuItem value={11}>Healthcare & Life Sciences</MenuItem>
                <MenuItem value={12}>Agriculture & AgTech</MenuItem>
                <MenuItem value={13}>Food & Beverage</MenuItem>
                <MenuItem value={14}>Real Estate & Construction (PropTech)</MenuItem>
                <MenuItem value={15}>Energy and Sustainability</MenuItem>
                <MenuItem value={16}>Manufacturing & Industry 4.0</MenuItem>
                <MenuItem value={17}>Legal Services (LegalTech)</MenuItem>
                <MenuItem value={18}>Fashion & Apparel</MenuItem>
                <MenuItem value={19}>Sports and Fitness</MenuItem>
                <MenuItem value={20}>Travel and Hospitality</MenuItem>
                <MenuItem value={21}>Government and Public Sector</MenuItem>
                <MenuItem value={22}>Other</MenuItem>

              </Select>
            </FormControl>
          </Grid>

          {/* Business Model */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Business Model</InputLabel>
              <Select
                name="businessModel"
                value={formValues.businessModel}
                onChange={handleChange}
                required
              >
                <MenuItem value={1}>B2B</MenuItem>
                <MenuItem value={2}>B2C</MenuItem>
                <MenuItem value={3}>Marketplace</MenuItem>
                <MenuItem value={4}>Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Stage of Development */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Stage of Development</InputLabel>
              <Select
                name="stageOfDevelopment"
                value={formValues.stageOfDevelopment}
                onChange={handleChange}
                required
              >
                <MenuItem value={1}>Idea</MenuItem>
                <MenuItem value={2}>Prototype</MenuItem>
                <MenuItem value={3}>Early Revenue</MenuItem>
                <MenuItem value={4}>Growth</MenuItem>
                <MenuItem value={5}>Expansion</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Sub-city */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Sub-City</InputLabel>
              <Select
                name="subCity"
                value={formValues.subCity}
                onChange={handleChange}
                required
              >
                <MenuItem value={1}>Arada</MenuItem>
                <MenuItem value={2}>Addis Ketema</MenuItem>
                <MenuItem value={3}>Akaki Kality</MenuItem>
                <MenuItem value={4}>Bole</MenuItem>
                <MenuItem value={5}>Gullele</MenuItem>
                <MenuItem value={6}>Kirkos</MenuItem>
                <MenuItem value={7}>Kolfe Keranio</MenuItem>
                <MenuItem value={8}>Lideta</MenuItem>
                <MenuItem value={9}>Nifas Silk-Lafto</MenuItem>
                <MenuItem value={10}>Yeka</MenuItem>
                <MenuItem value={11}>Lemi Kura</MenuItem>

              </Select>
            </FormControl>
          </Grid>

          {/* Funding Requirement */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Funding Requirement (Amount Needed)</InputLabel>
              <Select
                name="fundingRequirement"
                value={formValues.fundingRequirement}
                onChange={handleChange}
                required
              >
                <MenuItem value={1}>{"< 100,000 ETB"}</MenuItem>
                <MenuItem value={2}>{"100,000 - 500,000 ETB"}</MenuItem>
                <MenuItem value={3}>{"50,0000 - 1,000,000 ETB"}</MenuItem>
                <MenuItem value={4}>{"1,000,000 - 5,000,000"} ETB</MenuItem>
                <MenuItem value={5}>{"> 5,000,000 ETB"}</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Current Funding Status  */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Current Funding Status</InputLabel>
              <Select
                name="currentFundingStatus"
                value={formValues.currentFundingStatus}
                onChange={handleChange}
                required
              >
                <MenuItem value={1}>Bootstrapped</MenuItem>
                <MenuItem value={2}>Pre-Seed</MenuItem>
                <MenuItem value={3}>Seed</MenuItem>
                <MenuItem value={4}>Crowdfunding</MenuItem>
                <MenuItem value={5}>Grants and Competitions</MenuItem>
                <MenuItem value={6}>Debt Financing</MenuItem>
                <MenuItem value={7}>Series A</MenuItem>
                <MenuItem value={8}>Series B</MenuItem>
                <MenuItem value={9}>Series C</MenuItem>
                <MenuItem value={10}>Series D (and beyond)</MenuItem>
                <MenuItem value={11}>Mezzanine Financing / Bridge Financing</MenuItem>
                <MenuItem value={12}>Other</MenuItem>


              </Select>
            </FormControl>
          </Grid>
  
          {/* Use of Funds */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Use of Funds"
              name="useOfFunds"
              multiline
              rows={4}
              value={formValues.useOfFunds}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Revenue Model */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Revenue Model</InputLabel>
              <Select
                name="revenueModel"
                value={formValues.revenueModel}
                onChange={handleChange}
                required
              >
                <MenuItem value={1}>Subscription Revenue Model</MenuItem>
                <MenuItem value={2}>Freemium Revenue Model</MenuItem>
                <MenuItem value={3}>Pay-Per-Use (Usage-Based) Model</MenuItem>
                <MenuItem value={4}>Transaction Fees (Commission-Based Model)</MenuItem>
                <MenuItem value={5}>Marketplace Fees</MenuItem>
                <MenuItem value={6}>Affiliate Marketing Model</MenuItem>
                <MenuItem value={7}>Advertising Revenue Model</MenuItem>
                <MenuItem value={8}>Data Monetization Model</MenuItem>
                <MenuItem value={9}>Licensing Model</MenuItem>
                <MenuItem value={10}>Product Bundling Model</MenuItem>
                <MenuItem value={11}>Pay-What-You-Want Model</MenuItem>
                <MenuItem value={12}>Crowdsourcing / Crowdfunding Model</MenuItem>
                <MenuItem value={13}>Sponsorship Model</MenuItem>
                <MenuItem value={14}>Donation-Based Model</MenuItem>
                <MenuItem value={15}>White Labeling Model</MenuItem>
                <MenuItem value={16}>Franchise Model</MenuItem>
                <MenuItem value={17}>Royalties Model</MenuItem>
                <MenuItem value={18}>Razor and Blade Model</MenuItem>
                <MenuItem value={19}>Commission-Based Model</MenuItem>
                <MenuItem value={20}>Open-Source Model</MenuItem>
                <MenuItem value={21}>Performance-Based Model</MenuItem>
                <MenuItem value={22}>Other</MenuItem>

              </Select>
            </FormControl>
          </Grid>   

          {/* Current Revenue */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
              type="number"
              label="Current Revenue"
              name="currentRevenue"
              value={formValues.currentRevenue}
              onChange={handleChange}
              required
            />
            </FormControl>
          </Grid>   

          {/* Market Size and Potential */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Market Size and Potential"
              name="marketSize"
              multiline
              rows={4}
              value={formValues.marketSize}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Competitive Advantage */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Competitive Advantage</InputLabel>
              <Select
                name="competitiveAdvantage"
                value={formValues.competitiveAdvantage}
                onChange={handleChange}
                required
              >
                <MenuItem value={1}>Technology-based (innovative, unique IP)</MenuItem>
                <MenuItem value={2}>Strong local partnerships</MenuItem>
                <MenuItem value={3}>Low-cost advantage</MenuItem>
                <MenuItem value={4}>Operational efficiency</MenuItem>
                <MenuItem value={5}>Market reach or customer base</MenuItem>
                <MenuItem value={6}>General product or service quality</MenuItem>
                <MenuItem value={7}>Other</MenuItem>



              </Select>
            </FormControl>
          </Grid>   

          {/* Customer Base  */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
              type="number"
              label="Customer Base "
              name="customerBase"
              value={formValues.customerBase}
              onChange={handleChange}
              required
            />
            </FormControl>
          </Grid>   

          {/* Financial Projections  */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Financial Projections "
              name="financialProjections"
              multiline
              rows={4}
              value={formValues.financialProjections}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Legal Structure  */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Legal Structure </InputLabel>
              <Select
                name="legalStructure"
                value={formValues.legalStructure}
                onChange={handleChange}
                required
              >
                <MenuItem value="Sole Proprietorship">Sole Proprietorship</MenuItem>
                <MenuItem value="Partnership">Partnership</MenuItem>
                <MenuItem value="LLC">LLC</MenuItem>
                <MenuItem value="Other">Other</MenuItem>



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
              value={formValues.teamSize}
              onChange={handleChange}
              required
            />
            </FormControl>
          </Grid>   

          {/* Key Team Members */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Key Team Members
            </Typography>

            {/* Key Team Members Loop */}
            {formValues.keyTeamMembers.length > 0 &&
              formValues.keyTeamMembers.map((value, index) => (
                <div key={index} style={{ marginBottom: '20px' }}>
                <TextField
                  fullWidth
                  label={`Key Team Member: ${index+1}`}
                  name="keyTeamMembers"
                  value={value}
                  onChange={(event) => handleMultiChange(index, event)}
                  required
                  style={{ marginTop: '10px' }}
                />
                  
                  {formValues.keyTeamMembers.length > 1 && (
                    <>
                      <Button
                      type="button"
                      name="keyTeamMembers"
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
              name="keyTeamMembers"
              onClick={(e) => {handleMultiAdd(e)}}
            >
              Add More Key Team Members
            </Button>
          </Grid>

          {/* Advisors  */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
            Advisors
            </Typography>

            {/* Advisors Loop */}
            {formValues.advisors.length > 0 &&
              formValues.advisors.map((value, index) => (
                <div key={index} style={{ marginBottom: '20px' }}>
                <TextField
                  fullWidth
                  label={`Advisor: ${index+1}`}
                  name="advisors"
                  value={value}
                  onChange={(event) => handleMultiChange(index, event)}
                  required = {formValues.advisors.length > 1}
                  style={{ marginTop: '10px' }}
                />
                  
                  {formValues.advisors.length > 1 && (
                    <>
                      <Button
                      type="button"
                      name="advisors"
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
              name="advisors"
              onClick={(e) => {handleMultiAdd(e)}}
            >
              Add More Advisors
            </Button>
          </Grid>

          {/* Existing Partnerships   */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
            Existing Partnerships 
            </Typography>

            {/* Existing Partnerships  Loop */}
            {formValues.existingPartnerships.length > 0 &&
              formValues.existingPartnerships.map((value, index) => (
                <div key={index} style={{ marginBottom: '20px' }}>
                <TextField
                  fullWidth
                  label={`Partner : ${index+1}`}
                  name="existingPartnerships"
                  value={value}
                  onChange={(event) => handleMultiChange(index, event)}
                  required = {formValues.existingPartnerships.length > 1}
                  style={{ marginTop: '10px' }}
                />
                  
                  {formValues.existingPartnerships.length > 1 && (
                    <>
                      <Button
                      type="button"
                      name="existingPartnerships"
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
              name="existingPartnerships"
              onClick={(e) => {handleMultiAdd(e)}}
            >
              Add More Partners
            </Button>
          </Grid>

          {/* Social Impact Goals   */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Social Impact Goals  </InputLabel>
              <Select
                name="socialImpactGoals"
                value={formValues.socialImpactGoals}
                onChange={handleChange}
                required
              >
                <MenuItem value={1}>Financial Inclusion</MenuItem>
                <MenuItem value={2}>Environmental Sustainability</MenuItem>
                <MenuItem value={3}>Job Creation</MenuItem>
                <MenuItem value={4}>Education Improvement</MenuItem>
                <MenuItem value={5}>Health and Well-being</MenuItem>
                <MenuItem value={6}>Community Development</MenuItem>
                <MenuItem value={7}>Other</MenuItem>
                <MenuItem value={8}>None</MenuItem>

              </Select>
            </FormControl>
          </Grid>   

          {/* Upload Pitch Deck */}
          <Grid item xs={12} sm={6}>
            <h1>Upload Pitch Deck</h1>
            <Input
              fullWidth
              type="file"
              onChange={handleFileChange}
              inputProps={{ accept: ".pdf,.doc,.docx,.jpg,.png,.pptx" }} // Optional: restrict file types
            />
            {fileErrorMessage && (
              <Typography color="error">{fileErrorMessage}</Typography>
              )}
          </Grid>

          {/* Startup Business Email   */}
          <Grid item xs={12}>
          <TextField
              fullWidth
              label={`Startup Business Email`}
              name="startupEmail"
              value={formValues.startupEmail}
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
              name="phone1"
              value={formValues.phone1}
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
              name="phone2"
              value={formValues.phone2}
              onChange={handleChange}
            />
            </FormControl>
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

export default StartupForm;
