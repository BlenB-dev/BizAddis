import {useEffect} from 'react'
import Section1 from "./Components/Section1";
import Section2 from "./Components/Section2";
import Section3 from "./Components/Section3";
import Section4 from "./Components/Section4";

const Homepage = () => {
  useEffect(()=>{
    localStorage.removeItem('token'); 
  },[])
  return (
    <div>
    <Section1/>
    <Section2/>
    <Section3/>
    <Section4/>

    </div>
    
  );
};

export default Homepage;
