'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useGoogleLogin } from '@react-oauth/google';
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login: loginUser, isLoggedIn } = useAuth();

  useEffect(()=>{
    if(isLoggedIn){
      router.push('/create');
    }
  }, [isLoggedIn])

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await axios.post(
          '/api/users/loginWithGoogle',
          { rowtoken: tokenResponse.access_token },
          { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        );
        const { success, token, name, message } = response.data;
        if (success) {
          Cookies.set('uid', token, { expires: 5 });
          Cookies.set('loggedInUser', name, { expires: 5 });
          toast.success('Login successful!');
          router.push('/create');
        } else {
          toast.error(message || 'Login failed. Please try again.');
        }
      } catch (err: any) {
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
        '/api/users/login',
        { email, password },
        { withCredentials: true }
      );
      const { success, token, name, message } = response.data;
      if (success) {
        Cookies.set('uid', token, { expires: 5 });
        Cookies.set('loggedInUser', name, { expires: 5 });
         loginUser();
        toast.success('Login successful!');
        setEmail('');
        setPassword('');
        router.push('/create');
      } else {
        toast.error(message || 'Login failed. Please try again.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="loginContainer">
        <form onSubmit={handleSubmit}>
          <div className="title">
            <h2>Welcome to Dreamify</h2>
            <p>Sign in to Dreamify and turn your imagination into beautiful, unique images</p>
          </div>
          <div className="inputBox">
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
              {loading ? (
                <p>Loading...</p>
              ) : (
                <button className="submit" type="submit">
                  SignIn
                </button>
              )}
            </div>
          </div>
          <div className="forgotBox">
            <p>
              New to Dreamify?{' '}
              <a href="/register">
                <span>SignUp</span>
              </a>
            </p>
            <div className="googleBox" onClick={() => login()}>
              <div className="googleicon">
                <img src="/images/google.png" alt="Google" />
              </div>
              <div className="google">SignIn with Google</div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;