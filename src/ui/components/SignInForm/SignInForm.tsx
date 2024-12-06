// src/SignInForm/SignInForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { login } from '../../api/auth'; // Імпортуємо функцію login

interface SignInFormProps {
  onSubmit: (data: any) => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ onSubmit }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const [error, setError] = useState('');

  const handleSignIn = async (data: any) => {
    try {
      const token = await login(data.signInName, data.signInPassword);
      onSubmit(token); // Передаємо токен для подальшого використання
      reset(); // Скидаємо форму після відправки
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleSignIn)}>
      <h1 className='authorization__title'>Sign In</h1>
      <input
        type="text"
        placeholder="Name"
        {...register("signInName", { required: true })}
      />
      {errors.signInName && <p className='error-text'>Name is required</p>}

      <input
        type="password"
        placeholder="Password"
        {...register("signInPassword", { required: true })}
      />
      {errors.signInPassword && <p className='error-text'>Password is required</p>}

      <button type="submit">Sign In</button>
      {error && <p className='error-text'>{error}</p>}
    </form>
  );
};

export default SignInForm;
