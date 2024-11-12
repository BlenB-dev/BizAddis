import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";
import "../../assets/ResponsiveStyle.css"; // Ensure the path is correct

const Footer = () => {
  return (
    <footer id="contact-section" className="py-10 mt-13 px-4 text-dark">
      <div className="container mx-auto">
        <div className="container mx-auto  -mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          {/* About Us Section */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">About Us</h3>
            <p className="text-black">
              This Website tries to help startups with there ongoing or
              finsished project to find best ServiceProvider. On the other side
              Angle Investors can find any startups to push there project even
              higher so that both can beneficiary.
            </p>
          </div>

          {/* Our Core Values */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Our Core Values</h3>
            <ul className="text-black space-y-2">
              <li>🤝 To Connect Startups with Investors.</li>
              <li>🌍 To Find Service Providers for Startups.</li>
              <li>💼 To allow Service Providers to post their own services.</li>
            </ul>
          </div>

          {/* Get In Touch Section */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Get In Touch</h3>
            <ul className="text-black space-y-2">
              <li>📍 Addisu Gebeya, Jambo building</li>
              <li>📧 beteblen4@gmail.com</li>
              <li>📞 +251 934 42 54 62</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex justify-between items-center mt-8">
        <p className="text-lg text-black">
          &copy;2024 Biz-Connect. All rights reserved.
        </p>

        <div className="flex space-x-4">
          <a href="#" className="hover:text-gray-300">
            <FaFacebookF />
          </a>
          <a href="#" className="hover:text-gray-300">
            <FaTwitter />
          </a>
          <a href="#" className="hover:text-gray-300">
            <FaInstagram />
          </a>
          <a href="#" className="hover:text-gray-300">
            <FaYoutube />
          </a>
          <a href="#" className="hover:text-gray-300">
            <FaLinkedinIn />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;