import './globals.css';
import '../styles/app.css';
import { AuthProvider } from '../context/AuthContext';
import { SearchProvider } from '../context/SearchContext';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata = {
  title: "Dreamify | AI Image Generator with Prompts",
  description: "Generate stunning, high-quality images instantly using AI and creative prompts. Ideal for artists, marketers, developers, and creators.",
  keywords: "AI Image Generator, Dreamify, AI Art, prompt-based image generation, text to image, creative AI, generative art, AI design tool",
  author: "Nandani Singh",
  openGraph: {
    title: "Dreamify | AI Image Generator with Prompts",
    description: "Create visually captivating AI-generated images from text prompts in seconds with Dreamify.",
    url: "https://dreamify-sigma.vercel.app",
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/dpmengi5q/image/upload/v1735566750/image_2_cmhkfh.png",
        width: 1200,
        height: 630,
        alt: "AI-generated image examples by Dreamify",
      },
    ],
  },
  icons: {
    icon: "https://res.cloudinary.com/dpmengi5q/image/upload/v1735566750/image_2_cmhkfh.png",
    apple: "https://res.cloudinary.com/dpmengi5q/image/upload/v1735566750/image_2_cmhkfh.png",
  },
  twitter: {
    card: "summary_large_image",
    site: "@dreamifyapp",
    title: "Dreamify | AI Image Generator with Prompts",
    description: "Transform your ideas into art with Dreamify. Generate AI-powered images using simple text prompts.",
    image: "https://res.cloudinary.com/dpmengi5q/image/upload/v1735566750/image_2_cmhkfh.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className='!bg-[#000]'>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
        <AuthProvider>
          <SearchProvider>
            {children}
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''}/>
          </SearchProvider>
        </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
