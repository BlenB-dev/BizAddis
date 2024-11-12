import { useState, useEffect } from 'react';
import { Container, Typography, Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem, Input, CircularProgress, Box  } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const InvestorProfileEdit = () => {
  const navigate = useNavigate(); // useNavigate hook to programmatically navigate

  const [UserData, setUserData] = useState(null);

  const [ErrorMessage, setErrorMessage] = useState(null);
  const [ResponseMessage, setResponseMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firstPage, setFirstPage] = useState(true);

  const [previewUrl, setPreviewUrl] = useState(null);  // Store the preview image URL

  const [investors, setInvestors] = useState({
    InvestorName: "",
    InvestorBio: "",
    InvestorPortfolios: [""],

    MinimumInvestmentAmount: 0,
    MaximumInvestmentAmount: 5000000,
    InvestmentTimeline: "",
    InvestmentApproach: "",

    RiskTolerance: "Medium",
    FollowOnInvestmentCapacity: "Yes",
    CoInvestmentOpportunities: "Yes",
    MentorshipCapabilities: "Yes",

    NetworkConnections: "",
    PriorStartupExperience: "Yes",
    EducationalBackground: "",
    ProfessionalExperience: "",
    
    CommunityInvolvement: "",
    Phone1: "",
    Phone2: "",
    BusinessEmail: "",
    Logo: null,


  });

  const [investorPreferance, setInvestorPreferance] = useState({
    StageOfDevelopment: 1,
    IndustrySector: 1,
    FundingRequirement: 1,
    CurrentFundingStatus: 1,
    BusinessModel: 1,
    RevenueModel: 1,
    SubCity: 1,
    CompetitiveAdvantage: 1,
    SocialImpactGoals: 1,

  });

  // Extract query parameters
  const maxSizeInBytes = 5 * 1024 * 1024; // 5MB file size limit


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > maxSizeInBytes) {
        setErrorMessage("The File Size is Too Big");
        setLoading(true);

        setInvestors({
          ...investors,
          Logo: null,
        });

      } else {
        setErrorMessage(null);
        setPreviewUrl(URL.createObjectURL(file));
        setInvestors({
          ...investors,
          Logo: file,
        });
      

      }
    }else{
      setErrorMessage(null);
      setInvestors({
        ...investors,
        Logo: null,
      });

    }
  };



  const handlePreferanceChange = (e) => {
    const { name, value } = e.target;
    setInvestorPreferance({
      ...investorPreferance,
      [name]: value,
    });
  };


  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvestors({
      ...investors,
      [name]: value,
    });
  };


  // Handle form submission
  const NextPage = async (e) => {
    
    e.preventDefault();
    setFirstPage(false);

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');


    let val = "Token: "+token+"\n";
    Object.entries(investors).forEach(entry => {
      const [key, value] = entry;
      val += key +": "+JSON.stringify(value) + "\n"

    });

    console.log(val);
    let Preferances = [
      investorPreferance.StageOfDevelopment,
      investorPreferance.IndustrySector, 
      investorPreferance.FundingRequirement,
      investorPreferance.CurrentFundingStatus, 
      investorPreferance.BusinessModel, 
      investorPreferance.RevenueModel, 
      investorPreferance.SubCity, 
      investorPreferance.CompetitiveAdvantage, 
      investorPreferance.SocialImpactGoals
    ]

    let pref = "Investor Preferances \n";
    Object.entries(investorPreferance).forEach(entry => {
      const [key, value] = entry;
      pref += key +": "+JSON.stringify(value) + "\n"

    });
console.log(pref);
    setLoading(true);


    const formPayload = new FormData();
    formPayload.append('file', investors.Logo);
    formPayload.append('token', token);
    formPayload.append('InvestorName', investors.InvestorName);
    formPayload.append('InvestorBio', investors.InvestorBio);
    formPayload.append('InvestorPortfolios', JSON.stringify(investors.InvestorPortfolios));//Array

    formPayload.append('MinimumInvestmentAmount', investors.MinimumInvestmentAmount);
    formPayload.append('MaximumInvestmentAmount', investors.MaximumInvestmentAmount);
    formPayload.append('InvestmentTimeline', investors.InvestmentTimeline);
    formPayload.append('InvestmentApproach', investors.InvestmentApproach);

    formPayload.append('RiskTolerance', investors.RiskTolerance);
    formPayload.append('FollowOnInvestmentCapacity', investors.FollowOnInvestmentCapacity);
    formPayload.append('CoInvestmentOpportunities', investors.CoInvestmentOpportunities);
    formPayload.append('MentorshipCapabilities', investors.MentorshipCapabilities);

    formPayload.append('NetworkConnections', investors.NetworkConnections);
    formPayload.append('PriorStartupExperience', investors.PriorStartupExperience);
    formPayload.append('EducationalBackground', investors.EducationalBackground);
    formPayload.append('ProfessionalExperience', investors.ProfessionalExperience);

    formPayload.append('CommunityInvolvement', investors.CommunityInvolvement);
    formPayload.append('Phone1', investors.Phone1);
    formPayload.append('Phone2', investors.Phone2);
    formPayload.append('BusinessEmail', investors.BusinessEmail);

    formPayload.append('InvestorPreferences', JSON.stringify(Preferances));//Array






    try {
       const response = await axios.post("http://localhost:5000/api/auth/updateInvestorProfile", formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Successful Registration: \n"+ JSON.stringify(response.data.form));
      setResponseMessage("You Have Successfully Updated Your Profile")
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


  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');

      axios.get('http://localhost:5000/api/GetInvestorsProfile' ,{
          headers: {
            Authorization: `Bearer ${token}` // Attach the token in headers
            }
        }).then(async (response) => {
            setUserData(response.data[0]);
            // Initialize();

            console.log(response.data[0]);
            const FilePath = response.data[0].LogoURL;
            console.log("FilePath: " + FilePath);

            if(FilePath != undefined && FilePath.length > 5) {
              
              const formPayload = new FormData();
              formPayload.append('filepath', FilePath);       

              axios.post('/api/getInvestorLogoPic',formPayload, { 
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",},
                responseType: 'blob' 
              }).then((response) => {
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const fileUrl = URL.createObjectURL(blob);
                setPreviewUrl(fileUrl);
                console.log(blob);
                console.log(fileUrl);

            })

          }
        setLoading(false);

      })
      .catch((err) => {
        console.log("Error : \n" + err)
        // Check if the error is from the server response
        if (err.response && err.response.data) {
          // Display the error message sent by the backend
          setErrorMessage(err.response.data.message);
        } else {
          // Handle other errors (like network issues)
          setErrorMessage('Something went wrong. Please try again later. '+err);
        }
    
    
        // console.log(err);                  
        // setLoading(false);
      })

    };

    fetchData();

  }, []);



  useEffect(() => {
    if (UserData) {
        console.log(UserData);


      // Parsing or directly assigning values from UserData to investor-related fields
      let OldInvestorName = UserData.InvestorName;
      let OldInvestorBio = UserData.InvestorBio;
      let OldInvestorPortfolios = JSON.parse(UserData.InvestorPortfolios);
      let OldMinimumInvestmentAmount = UserData.MinimumInvestmentAmount;
      let OldMaximumInvestmentAmount = UserData.MaximumInvestmentAmount;
      let OldInvestmentTimeline = UserData.InvestmentTimeline;
      let OldInvestmentApproach = UserData.InvestmentApproach;
      let OldRiskTolerance = UserData.RiskTolerance;
      let OldFollowOnInvestmentCapacity = UserData.FollowOnInvestmentCapacity;
      let OldCoInvestmentOpportunities = UserData.CoInvestmentOpportunities;
      let OldMentorshipCapabilities = UserData.MentorshipCapabilities;
      let OldNetworkConnections = UserData.NetworkConnections;
      let OldPriorStartupExperience = UserData.PriorStartupExperience;
      let OldEducationalBackground = UserData.EducationalBackground;
      let OldProfessionalExperience = UserData.ProfessionalExperience;
      let OldCommunityInvolvement = UserData.CommunityInvolvement;
      let OldPhone1 = UserData.Phone1;
      let OldPhone2 = UserData.Phone2;
      let OldBusinessEmail = UserData.BusinessEmail;
  
      // Setting values for the investors state
      setInvestors({
        InvestorName: OldInvestorName,
        InvestorBio: OldInvestorBio,
        InvestorPortfolios: OldInvestorPortfolios,
        MinimumInvestmentAmount: OldMinimumInvestmentAmount,
        MaximumInvestmentAmount: OldMaximumInvestmentAmount,
        InvestmentTimeline: OldInvestmentTimeline,
        InvestmentApproach: OldInvestmentApproach,
        RiskTolerance: OldRiskTolerance,
        FollowOnInvestmentCapacity: OldFollowOnInvestmentCapacity,
        CoInvestmentOpportunities: OldCoInvestmentOpportunities,
        MentorshipCapabilities: OldMentorshipCapabilities,
        NetworkConnections: OldNetworkConnections,
        PriorStartupExperience: OldPriorStartupExperience,
        EducationalBackground: OldEducationalBackground,
        ProfessionalExperience: OldProfessionalExperience,
        CommunityInvolvement: OldCommunityInvolvement,
        Phone1: OldPhone1,
        Phone2: OldPhone2,
        BusinessEmail: OldBusinessEmail,
        Logo: null,

      });
  
      // Parsing or directly assigning values for investor preferences
      let OldStageOfDevelopment = JSON.parse(UserData.InvestorPreference)[0];
      let OldIndustrySector = JSON.parse(UserData.InvestorPreference)[1];
      let OldFundingRequirement = JSON.parse(UserData.InvestorPreference)[2];
      let OldCurrentFundingStatus = JSON.parse(UserData.InvestorPreference)[3];
      let OldBusinessModel = JSON.parse(UserData.InvestorPreference)[4];
      let OldRevenueModel = JSON.parse(UserData.InvestorPreference)[5];
      let OldSubCity = JSON.parse(UserData.InvestorPreference)[6];
      let OldCompetitiveAdvantage = JSON.parse(UserData.InvestorPreference)[7];
      let OldSocialImpactGoals = JSON.parse(UserData.InvestorPreference)[8];
  
      // Setting values for the investorPreferance state
      setInvestorPreferance({
        StageOfDevelopment: OldStageOfDevelopment,
        IndustrySector: OldIndustrySector,
        FundingRequirement: OldFundingRequirement,
        CurrentFundingStatus: OldCurrentFundingStatus,
        BusinessModel: OldBusinessModel,
        RevenueModel: OldRevenueModel,
        SubCity: OldSubCity,
        CompetitiveAdvantage: OldCompetitiveAdvantage,
        SocialImpactGoals: OldSocialImpactGoals
      });
    }
  }, [UserData]);
  


 
 
  return (
    <>

    {!loading ? (
      <div>
      {firstPage ? (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom style={{ marginTop: '30px', marginBottom: '20px' }}>
        Edit Investor Profile
      </Typography>
      <form onSubmit={NextPage}>
        <Grid container spacing={3}>

          {/* Investor Name */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Investor Name"
              name="InvestorName"
              value={investors.InvestorName}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Investor Bio */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Investor Bio"
              name="InvestorBio"
              multiline
              rows={4}
              value={investors.InvestorBio}
              onChange={handleChange}
              required
              style={{ marginTop: '10px', marginBottom: '20px' }}
            />
          </Grid>

          {/* Investor Portfolios */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Investor Portfolios (Separate by Comma)"
              name="InvestorPortfolios"
              multiline
              rows={4}
              value={investors.InvestorPortfolios && investors.InvestorPortfolios.join(', ')}
              onChange={(e) =>
                setInvestors({
                  ...investors,
                  InvestorPortfolios: e.target.value.split(',').map((sector) => sector.trim()),
                })
              }
              style={{ marginTop: '10px', marginBottom: '20px' }}
            />
          </Grid>

          {/* Minimum Investment  */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
              type="number"
              label="Minimum Investment Amount "
              name="MinimumInvestmentAmount"
              value={investors.MinimumInvestmentAmount}
              onChange={(e) =>{
                if(parseInt(e.target.value) <= parseInt(investors.MaximumInvestmentAmount)){
                setInvestors({
                  ...investors,
                  MinimumInvestmentAmount: e.target.value,
                });}
              }
              }
              required
            />
            </FormControl>
          </Grid>            

          {/* Maximum Investment  */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
              type="number"
              label="Maximum Investment Amount "
              name="MaximumInvestmentAmount"
              value={investors.MaximumInvestmentAmount}
              onChange={(e) =>{
                if(parseInt(e.target.value) >= parseInt(investors.MinimumInvestmentAmount)){
                setInvestors({
                  ...investors,
                  MaximumInvestmentAmount: e.target.value,
                });}
              }
              }
              required
            />
            </FormControl>
          </Grid>            

          {/* Investment Timeline */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Investment Timeline"
              name="InvestmentTimeline"
              value={investors.InvestmentTimeline}
              onChange={handleChange}
              required
              style={{ marginTop: '10px', marginBottom: '20px' }}
            />
          </Grid>

          {/* Investment Approach */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Investment Approach"
              name="InvestmentApproach"
              multiline
              rows={4}
              value={investors.InvestmentApproach}
              onChange={handleChange}
              required
              style={{ marginTop: '10px', marginBottom: '20px' }}
            />
          </Grid>

          {/* Risk Tolerance */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Risk Tolerance</InputLabel>
              <Select
                name="RiskTolerance"
                value={investors.RiskTolerance}
                onChange={handleChange}
                required
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>

              </Select>
            </FormControl>
          </Grid>

          {/* Follow On Investment Capacity */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Follow On Investment Capacity</InputLabel>
              <Select
                name="FollowOnInvestmentCapacity"
                value={investors.FollowOnInvestmentCapacity}
                onChange={handleChange}
                required
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>

              </Select>
            </FormControl>
          </Grid>

          {/* CoInvestment Opportunities */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>CoInvestment Opportunities</InputLabel>
              <Select
                name="CoInvestmentOpportunities"
                value={investors.CoInvestmentOpportunities}
                onChange={handleChange}
                required
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>

              </Select>
            </FormControl>
          </Grid>


          {/* Mentorship Capabilities */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Mentorship Capabilities</InputLabel>
              <Select
                name="Mentorship Capabilities"
                value={investors.MentorshipCapabilities}
                onChange={handleChange}
                required
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>

              </Select>
            </FormControl>
          </Grid>

          {/* Prior Startup Experience */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Prior Startup Experience</InputLabel>
              <Select
                name="Prior Startup Experience"
                value={investors.PriorStartupExperience}
                onChange={handleChange}
                required
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>

              </Select>
            </FormControl>
          </Grid>

          {/* Network Connections */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Network Connections"
              name="NetworkConnections"
              multiline
              rows={4}
              value={investors.NetworkConnections}
              onChange={handleChange}
              style={{ marginTop: '10px', marginBottom: '20px' }}
            />
          </Grid>

          {/* Educational Background */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Educational Background"
              name="EducationalBackground"
              multiline
              rows={4}
              value={investors.EducationalBackground}
              onChange={handleChange}
              required
              style={{ marginTop: '10px', marginBottom: '20px' }}
            />
          </Grid>

          {/* Professional Experience */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Professional Experience"
              name="ProfessionalExperience"
              multiline
              rows={4}
              value={investors.ProfessionalExperience}
              onChange={handleChange}
              required
              style={{ marginTop: '10px', marginBottom: '20px' }}
            />
          </Grid>

          {/* Community Involvement */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Community Involvement"
              name="CommunityInvolvement"
              multiline
              rows={4}
              value={investors.CommunityInvolvement}
              onChange={handleChange}
              style={{ marginTop: '10px', marginBottom: '20px' }}
            />
          </Grid>


          {/* Business Email   */}
          <Grid item xs={12}>
          <TextField
              fullWidth
              label={`Business Email`}
              name="BusinessEmail"
              value={investors.BusinessEmail}
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
              value={investors.Phone1}
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
              value={investors.Phone2}
              onChange={handleChange}
            />
            </FormControl>
          </Grid>

          {/* Upload Logo */}
          <Grid item xs={12} sm={6}>
            <h1>Upload Logo (Optional)</h1>
            <Input
              fullWidth
              type="file"
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
            <Button type="submit" fullWidth variant="contained" color="secondary" style={{ marginTop: '20px' }}>
              Next
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  ):(
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom style={{ marginTop: '30px', marginBottom: '20px' }}>
        Investor Preferances
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Stage of Development */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Stage of Development</InputLabel>
              <Select
                name="StageOfDevelopment"
                value={investorPreferance.StageOfDevelopment}
                onChange={handlePreferanceChange}
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
          {/* Industry Sector */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Industry Sector</InputLabel>
              <Select
                name="IndustrySector"
                value={investorPreferance.IndustrySector}
                onChange={handlePreferanceChange}                
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

          {/* Funding Requirement */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Funding Requirement (Amount Needed)</InputLabel>
              <Select
                name="FundingRequirement"
                value={investorPreferance.FundingRequirement}
                onChange={handlePreferanceChange}
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
                name="CurrentFundingStatus"
                value={investorPreferance.CurrentFundingStatus}
                onChange={handlePreferanceChange}
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

          {/* Business Model */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Business Model</InputLabel>
              <Select
                name="BusinessModel"
                value={investorPreferance.BusinessModel}
                onChange={handlePreferanceChange}
                required
              >
                <MenuItem value={1}>B2B</MenuItem>
                <MenuItem value={2}>B2C</MenuItem>
                <MenuItem value={3}>Marketplace</MenuItem>
                <MenuItem value={4}>Other</MenuItem>

              </Select>
            </FormControl>
          </Grid>

          {/* Revenue Model */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Revenue Model</InputLabel>
              <Select
                name="RevenueModel"
                value={investorPreferance.RevenueModel}
                onChange={handlePreferanceChange}
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

          {/* Sub-city */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Sub-City</InputLabel>
              <Select
                name="SubCity"
                value={investorPreferance.SubCity}
                onChange={handlePreferanceChange}
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

          {/* Competitive Advantage */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Competitive Advantage</InputLabel>
              <Select
                name="CompetitiveAdvantage"
                value={investorPreferance.CompetitiveAdvantage}
                onChange={handlePreferanceChange}
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

          {/* Social Impact Goals   */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Social Impact Goals  </InputLabel>
              <Select
                name="SocialImpactGoals"
                value={investorPreferance.SocialImpactGoals}
                onChange={handlePreferanceChange}
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

          {/* Back Button */}
          <Grid item xs={12}>
            <Button 
              type="button" 
              fullWidth 
              variant="contained" 
              color="secondary" 
              onClick={(e)=>{e.preventDefault(); setFirstPage(true)}}
              style={{ marginTop: '20px' }}>
              Back
            </Button>
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


  )}
    </div>
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
          Loading
        </Typography>


      </Box>
      
    </Container>

  )}
</div>


  )}
    </>

    
  );
};

export default InvestorProfileEdit;
