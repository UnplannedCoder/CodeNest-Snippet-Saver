import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signupUser, clearAuthError } from '../redux/authSlice';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Signup = ({ isDarkMode }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAuthError());
    }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    dispatch(signupUser({ name, email, password }));
  };

  return (
    <div className='flex flex-col items-center justify-start w-full px-3 sm:px-4 md:px-6 pt-3 pb-10 sm:pt-6 sm:pb-12 grow overflow-y-auto'>
      <div className='flex flex-col gap-4 sm:gap-5 w-full max-w-md mx-auto my-auto'>
        
        {/* Header Title */}
        <div className='text-center space-y-1 sm:space-y-2'>
          <h1 className='text-3xl sm:text-4xl font-bold tracking-tight'>Create Account</h1>
          <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Join CodeNest to save and organize code snippets
          </p>
        </div>

        {/* Window Container - CodeNest Theme */}
        <div className={`border-2 rounded-2xl overflow-hidden w-full flex flex-col shadow-xl transition-colors duration-300 ${
          isDarkMode ? 'border-gray-800 bg-black text-white' : 'border-gray-300 bg-white text-gray-900'
        }`}>
          
          {/* Traffic Light Header */}
          <div className={`flex justify-between items-center px-4 py-3 border-b rounded-t-2xl transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-300'
          }`}>
            <div className='flex items-center gap-2'>
              <div className='w-3.5 h-3.5 rounded-full bg-red-500'></div>
              <div className='w-3.5 h-3.5 rounded-full bg-yellow-500'></div>
              <div className='w-3.5 h-3.5 rounded-full bg-green-500'></div>
            </div>
            <span className={`text-xs font-mono font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Authentication // Signup
            </span>
          </div>

          {/* Card Body / Form */}
          <form onSubmit={handleSubmit} className='p-5 sm:p-6 flex flex-col gap-3.5'>
            
            {/* Name Field */}
            <div className='flex flex-col gap-1.5'>
              <label className={`text-xs sm:text-sm font-semibold flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <User size={15} /> Full Name
              </label>
              <input
                type='text'
                placeholder='John Doe'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={`border-2 p-2.5 px-3.5 rounded-2xl w-full outline-none text-sm sm:text-base font-medium shadow-sm transition-colors duration-300 ${
                  isDarkMode
                    ? 'border-gray-800 bg-black text-gray-300 placeholder-gray-600 focus:border-gray-600'
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-gray-500'
                }`}
              />
            </div>

            {/* Email Field */}
            <div className='flex flex-col gap-1.5'>
              <label className={`text-xs sm:text-sm font-semibold flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Mail size={15} /> Email Address
              </label>
              <input
                type='email'
                placeholder='you@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`border-2 p-2.5 px-3.5 rounded-2xl w-full outline-none text-sm sm:text-base font-medium shadow-sm transition-colors duration-300 ${
                  isDarkMode
                    ? 'border-gray-800 bg-black text-gray-300 placeholder-gray-600 focus:border-gray-600'
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-gray-500'
                }`}
              />
            </div>

            {/* Password Field */}
            <div className='flex flex-col gap-1.5'>
              <label className={`text-xs sm:text-sm font-semibold flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Lock size={15} /> Password
              </label>
              <div className='relative w-full'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='•••••••• (min 6 characters)'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`border-2 p-2.5 px-3.5 pr-11 rounded-2xl w-full outline-none text-sm sm:text-base font-medium shadow-sm transition-colors duration-300 ${
                    isDarkMode
                      ? 'border-gray-800 bg-black text-gray-300 placeholder-gray-600 focus:border-gray-600'
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-gray-500'
                  }`}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition ${
                    isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'
                  }`}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className='flex flex-col gap-1.5'>
              <label className={`text-xs sm:text-sm font-semibold flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Lock size={15} /> Confirm Password
              </label>
              <div className='relative w-full'>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={`border-2 p-2.5 px-3.5 pr-11 rounded-2xl w-full outline-none text-sm sm:text-base font-medium shadow-sm transition-colors duration-300 ${
                    isDarkMode
                      ? 'border-gray-800 bg-black text-gray-300 placeholder-gray-600 focus:border-gray-600'
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-gray-500'
                  }`}
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition ${
                    isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'
                  }`}
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={loading}
              className={`border-2 mt-2 px-6 py-3 rounded-2xl font-semibold transition whitespace-nowrap shadow-sm w-full flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer ${
                isDarkMode
                  ? 'border-gray-800 bg-black text-gray-300 hover:bg-white hover:text-black'
                  : 'border-gray-300 bg-white text-gray-800 hover:bg-black hover:text-white'
              } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className='animate-spin' />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer switch to Login */}
        <p className={`text-center text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Already have an account?{' '}
          <Link
            to='/login'
            className={`font-bold underline hover:opacity-80 transition ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}
          >
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;
