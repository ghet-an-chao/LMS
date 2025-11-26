import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faFacebook, faInstagram, faTwitter,faLinkedin} from "@fortawesome/free-brands-svg-icons";
import { faCopyright } from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  return (
    <footer className="w-full h-[30px] flex flex-col md:flex-row justify-between items-center px-[20px] bg-[#000000] text-[#FCFCFD] text-sm border-t border-gray-800">
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon={faCopyright} />
        <span>Copyright 2025 BK eLearning</span>
      </div>

      <div className="flex gap-4">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-400 transition-colors"
        >
          <FontAwesomeIcon icon={faFacebook} size="lg" />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-pink-400 transition-colors"
        >
          <FontAwesomeIcon icon={faInstagram} size="lg" />
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-sky-400 transition-colors"
        >
          <FontAwesomeIcon icon={faTwitter} size="lg" />
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-500 transition-colors"
        >
          <FontAwesomeIcon icon={faLinkedin} size="lg" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;