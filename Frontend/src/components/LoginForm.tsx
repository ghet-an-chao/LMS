import React from "react";
import Button from "./Button";

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  return (
    <form className="flex flex-col gap-4">
      <input type="email" placeholder="Email" className="border p-3 rounded-lg focus:ring-2 ring-[#B3261E] outline-none" />
      <input type="password" placeholder="Password" className="border p-3 rounded-lg focus:ring-2 ring-[#B3261E] outline-none" />

      <Button variant="primary" type="submit">Log In</Button>

      <p className="text-center text-gray-600 text-sm mt-2">
        Don't have an account?{" "}
        <span className="text-[#B3261E] font-semibold cursor-pointer hover:underline" onClick={onSwitchToRegister}>
          Register
        </span>
      </p>
    </form>
  );
};

export default LoginForm;
