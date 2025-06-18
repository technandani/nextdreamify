'use client';
import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios'; // ✅ Import AxiosError
import { useGoogleLogin } from '@react-oauth/google';
import Cookies from 'js-cookie';
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isLoggedIn, login: loginUser, } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/create');
    }
  }, [isLoggedIn, router]);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await axios.post(
          '/api/users/loginWithGoogle',
          { rowtoken: tokenResponse.access_token },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        );
        const { success, token, name, message } = response.data;
        if (success) {
         loginUser();
          Cookies.set('uid', token, { expires: 5 });
          Cookies.set('loggedInUser', name, { expires: 5 });
          router.push('/create');
        } else {
          toast.error(message || 'Login failed. Please try again.');
        }
      } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        toast.error(
          error.response?.data?.message || 'Something went wrong.'
        );
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
      const response = await axios.post('/api/users/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(response.data.message);
      setName('');
      setEmail('');
      setPassword('');
      setProfilePic(null);
      router.push('/login');
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(
        error.response?.data?.message || 'Something went wrong.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="loginContainer">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="title">
            <h2>Welcome to Dreamify</h2>
            <p>
              Sign up to Dreamify and turn your imagination into beautiful,
              unique images
            </p>
          </div>
          <div className="inputBox">
            <div className="authInput">
              <input
                type="text"
                placeholder="Enter name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="authInput">
              <input
                type="email"
                placeholder="Enter email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="authInput">
              <input
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="authInput">
              <input
                type="file"
                onChange={(e) => setProfilePic(e.target.files?.[0] || null)}
              />
            </div>
            <div className="authInput">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <button className="submit" type="submit">
                  Sign Up
                </button>
              )}
            </div>
            <div className="forgotBox">
              <p>
                Already have an account?{' '}
                <a href="/login">
                  <span>SignIn</span>
                </a>
              </p>
              <div className="googleBox" onClick={() => login()}>
                <div className="googleicon">
                  <Image
                    src="/images/google.png"
                    alt="Google"
                    width={24}
                    height={24}
                  />
                </div>
                <div className="google">SignIn with Google</div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;