import React, { useState } from "react";
import logo from "@/assets/image/logo.png";
import Popup from "./Popup";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Button from "./Button";

const Header = () => {
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);

  return (
    <>
      <header className="w-full bg-white shadow-sm py-3 px-8 flex items-center justify-between z-40">
        <div className="flex items-center gap-3 cursor-pointer">
          <img src={logo} alt="logo" className="w-17 h-17 object-contain" />
        </div>

        <div className="flex items-center gap-4">
          <Button variant="secondary" onClick={() => setOpenLogin(true)}>
            Log In
          </Button>
          <Button variant="primary" onClick={() => setOpenRegister(true)}>
            Register
          </Button>
        </div>
      </header>

      {openLogin && (
        <Popup title="Welcome Back" onClose={() => setOpenLogin(false)}>
          <LoginForm
            onSwitchToRegister={() => {
              setOpenLogin(false);
              setOpenRegister(true);
            }}
          />
        </Popup>
      )}

      {openRegister && (
        <Popup title="Create New Account" onClose={() => setOpenRegister(false)}>
          <RegisterForm
            onSwitchToLogin={() => {
              setOpenRegister(false);
              setOpenLogin(true);
            }}
          />
        </Popup>
      )}
    </>
  );
};

export default Header;
