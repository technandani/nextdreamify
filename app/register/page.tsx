'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useGoogleLogin } from '@react-oauth/google';
import Cookies from 'js-cookie';
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/navigation';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState<File | null>(null);
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
    if (!name || !email || !password) {
      toast.error('All fields are required.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email.');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    if (profilePic) formData.append('profilePic', profilePic);

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/register`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      toast.success(response.data.message);
      setName('');
      setEmail('');
      setPassword('');
      setProfilePic(null);
      router.push('/login');
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
            <p className="text-gray-300">Sign up to Dreamify and turn your imagination into beautiful, unique images</p>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded bg-gray-700 text-white"
            />
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
            <input
              type="file"
              onChange={(e) => setProfilePic(e.target.files?.[0] || null)}
              className="w-full p-2 border rounded bg-gray-700 text-white"
            />
            <button
              type="submit"
              className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-500"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Sign Up'}
            </button>
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-300">
              Already have an account?{' '}
              <a href="/login" className="text-blue-400 hover:underline">SignIn</a>
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
        <ToastContainer theme="dark" />
      </div>
    </>
  );
};

export default Register;