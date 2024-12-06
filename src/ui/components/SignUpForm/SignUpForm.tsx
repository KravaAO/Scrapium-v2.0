// src/SignUpForm/SignUpForm.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { register } from "../../api/auth"; // Імпортуємо функцію для реєстрації

interface SignUpFormProps {
  onSubmit: (data: any) => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmit }) => {
  const {
    register: formRegister,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const [errorMessage, setErrorMessage] = useState("");

  const handleSignUp = async (data: any) => {
    console.log("Запит для реєстрації:", data);
    try {
      await register(data.signUpName, data.signUpPassword);
      reset();
      onSubmit(data);
    } catch (error) {
      setErrorMessage("Error during registration. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleSignUp)}>
      <h1 className='authorization__title'>Create Account</h1>

      <input
        type="text"
        placeholder="Name"
        {...formRegister("signUpName", { required: true })}
      />
      {errors.signUpName && <p className="error-text">Name is required</p>}

      <input
        type="password"
        placeholder="Password"
        {...formRegister("signUpPassword", { required: true })}
      />
      {errors.signUpPassword && <p className="error-text">Password is required</p>}

      <button type="submit">Sign Up</button>
      {errorMessage && <p className="error-text">{errorMessage}</p>} {/* Виведення помилки */}
    </form>
  );
};

export default SignUpForm;
