import React, { useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';



console.log(backendUrl);


const Login = () => {
  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const loginUser = async (email, password) => {
    const response = await axios.post('http://localhost:8080/api/auth/login', { email, password });
    return response.data;
  };

  const signupUser = async (name, email, password) => {
    const response = await axios.post('http://localhost:8080/api/auth/signup', { name, email, password });
    return response.data;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (state === 'Sign Up') {
        await signupUser(name, email, password);
        toast.success('Signup successful! Please log in.');
        setState('Log In');
      } else {
        const data = await loginUser(email, password);
        localStorage.setItem('token', data.token);
        localStorage.setItem('name', data.name);
        localStorage.setItem('balance', data.balance);
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.message || 'Error occurred');
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-400 to-purple-200'>
      <img onClick={() => navigate('/')} src={assets.cLogo} className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' alt="" />
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </h2>
        <p className='text-center text-sm mb-3'>
          {state === 'Sign Up' ? 'Create Your Account' : 'Login to Your Account'}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === 'Sign Up' && (
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.person_icon} alt='' />
              <input onChange={(e) => setName(e.target.value)} value={name} className='bg-transparent outline-none text-white' type='text' placeholder='Enter Your Name' required />
            </div>
          )}

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt='' />
            <input onChange={(e) => setEmail(e.target.value)} value={email} className='bg-transparent outline-none text-white' type='email' placeholder='Enter Your Email' required />
          </div>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt='' />
            <input onChange={(e) => setPassword(e.target.value)} value={password} className='bg-transparent outline-none text-white' type='password' placeholder='Enter Your Password' required />
          </div>

          {state === 'Log In' && (
            <p onClick={() => navigate('/reset-password')} className='text-sm text-indigo-600 cursor-pointer hover:text-indigo-500'>Forgot Password?</p>
          )}

          <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'>{state}</button>
        </form>

        {state === 'Sign Up' ? (
          <p className='text-gray-400 text-center text-xs mt-4'>
            Already Have an Account?{' '}
            <span className='text-blue-400 underline cursor-pointer' onClick={() => setState('Log In')}>Login here</span>
          </p>
        ) : (
          <p className='text-gray-400 text-center text-xs mt-4'>
            Don't Have an Account?{' '}
            <span className='text-blue-400 underline cursor-pointer' onClick={() => setState('Sign Up')}>Register here</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
