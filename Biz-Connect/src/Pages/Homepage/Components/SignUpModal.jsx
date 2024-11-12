import {useState} from "react";
import { IoArrowBack } from "react-icons/io5";


const SignUpDetails = ({ onClose, onBack, signupType, handleSignup }) => {
  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userPassword, setUserPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [PasswordError, setPasswordError] = useState("");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if(userPassword.trim() == confirmPassword.trim()){
      setPasswordError("");
      handleSignup(userName,userEmail,userPassword,signupType);
    }else{
      setPasswordError("Check your password")
      }
  };



  
  // const handleSignup = async (username, email, password, userType) => {
  //   console.log("Username: " + username + "\nEmail: " + email + "\nPassword: "+password+"\nUserType: " + userType);

  //   // axios.post('http://localhost:5000/api/auth/signup', { username, email, password, userType })
  //   // .then((response) => {
  //   //   const token = response.data.token;
  //   //   localStorage.setItem('token', token); // Save token to localStorage
  //   //   // localStorage.setItem('User', userNameEmail); // Save token to localStorage
  //   //   setIsLoginOpen(false);
  //   //   setCurrentView(null);
  //   //   closeJoinModal();
  
  //   //   if(response.data.message) alert(response.data.message);
  //   //   else console.log("No Message");  
  //   // })
  //   // .catch((err) => {alert(err.response.data.message)});

  // };





  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg relative">
      <button
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        onClick={onClose}
      >
        X
      </button>
      <button
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        onClick={onBack}
      >
        <IoArrowBack size={24} />
        <span>Back</span>
      </button>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Join as {signupType}
      </h2>
      {/* <div className="flex flex-col space-y-4">
        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100">
          Continue with Google
        </button>
        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100">
          Continue with LinkedIn
        </button>
      </div> 
      <div className="my-6 text-center text-gray-500">Or</div> */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="User Name"
          className="block w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500"
          onChange = {(e)=>{setUserName(e.target.value)}}
          required
        />
        <input
          type="email"
          placeholder="Work email"
          className="block w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500"
          onChange = {(e)=>{setUserEmail(e.target.value)}}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="block w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500"
          onChange = {(e)=>{setUserPassword(e.target.value)}}
          minLength={8}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="block w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500"
          onChange = {(e)=>{setConfirmPassword(e.target.value)}}
          minLength={8}
          required
        />
        <p>{PasswordError}</p>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
          // onClick={(e)=>{handleSubmit(e)}}
        >
          Create Account
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-500 text-center">
        By continuing, you agree to our{" "}
        <a href="#" className="text-blue-500 hover:underline">
          Terms of Use
        </a>{" "}
        and{" "}
        <a href="#" className="text-blue-500 hover:underline">
          Privacy Policy
        </a>
        .
      </p>
    </div>
    </div>
  );
};


export default SignUpDetails;
