'use client';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { useGoogleLogin } from '@react-oauth/google';
import Navbar from '../../components/Navbar';
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/loginWithGoogle`,
          { rowtoken: tokenResponse.access_token },
          { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        );
        const { success, token, name, message } = response.data;
        if (success) {
          localStorage.setItem('uid', token);
          localStorage.setItem('loggedInUser', name);
          Cookies.set('uid', token, { expires: 5 });
          Cookies.set('loggedInUser', name, { expires: 5 });
          router.push('/create');
          window.location.reload();
        } else {
          toast.error(message || 'Login failed. Please try again.');
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Something went wrong.');
      }
    },
    onError: () => toast.error('Google login failed. Please try again.'),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Email and password are required.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/login`,
        { email, password },
        { withCredentials: true }
      );
      const { success, token, name, message } = response.data;
      if (success) {
        localStorage.setItem('uid', token);
        localStorage.setItem('loggedInUser', name);
        Cookies.set('uid', token, { expires: 5 });
        Cookies.set('loggedInUser', name, { expires: 5 });
        toast.success('Login successful!');
        setEmail('');
        setPassword('');
        router.push('/create');
        window.location.reload();
      } else {
        toast.error(message || 'Login failed. Please try again.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-gray-800 rounded-lg">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-white">Welcome to Dreamify</h2>
            <p className="text-gray-300">Sign in to Dreamify and turn your imagination into beautiful, unique images</p>
          </div>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Enter email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded bg-gray-700 text-white"
            />
            <input
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded bg-gray-700 text-white"
            />
            <button
              type="submit"
              className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-500"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'SignIn'}
            </button>
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-300">
              New to Dreamify?{' '}
              <a href="/register" className="text-blue-400 hover:underline">SignUp</a>
            </p>
            <button
              onClick={() => login()}
              className="flex items-center justify-center gap-2 mt-4 w-full p-2 bg-transparent border border-white rounded text-white hover:bg-white/20"
            >
              <img src="images/google.png" alt="Google" className="h-6" />
              SignIn with Google
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;