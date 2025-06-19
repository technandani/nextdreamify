'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '../context/AuthContext';
import { SearchProvider } from '../context/SearchContext';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
      <AuthProvider>
        <SearchProvider>{children}</SearchProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default Providers;