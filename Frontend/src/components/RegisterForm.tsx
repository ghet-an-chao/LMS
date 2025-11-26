import React, { useState } from "react";
import Button from "./Button";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [role, setRole] = useState<"Student" | "Teacher" | null>(null);

  return (
    <form className="flex flex-col gap-4">
      <input type="text" placeholder="Username" className="border p-3 rounded-lg focus:ring-2 ring-[#B3261E] outline-none" />
      <input type="text" placeholder="First Name" className="border p-3 rounded-lg focus:ring-2 ring-[#B3261E] outline-none" />
      <input type="text" placeholder="Last Name" className="border p-3 rounded-lg focus:ring-2 ring-[#B3261E] outline-none" />
      <input type="email" placeholder="Email" className="border p-3 rounded-lg focus:ring-2 ring-[#B3261E] outline-none" />
      <input type="password" placeholder="Password" className="border p-3 rounded-lg focus:ring-2 ring-[#B3261E] outline-none" />

      <div className="flex gap-4 mt-2">
        <button type="button" onClick={() => setRole("Student")} className={`flex-1 py-3 rounded-lg font-semibold transition-all ${role === "Student" ? "bg-[#B3261E] text-white shadow-md scale-105" : "border border-[#B3261E] text-[#B3261E] hover:bg-[#B3261E] hover:text-white hover:scale-105"}`}>Student</button>
        <button type="button" onClick={() => setRole("Teacher")} className={`flex-1 py-3 rounded-lg font-semibold transition-all ${role === "Teacher" ? "bg-[#B3261E] text-white shadow-md scale-105" : "border border-[#B3261E] text-[#B3261E] hover:bg-[#B3261E] hover:text-white hover:scale-105"}`}>Teacher</button>
      </div>

      <Button variant="primary" type="submit">Register</Button>

      <p className="text-center text-gray-600 text-sm mt-2">
        Already have an account?{" "}
        <span className="text-[#B3261E] font-semibold cursor-pointer hover:underline" onClick={onSwitchToLogin}>
          Log in
        </span>
      </p>
    </form>
  );
};

export default RegisterForm;
