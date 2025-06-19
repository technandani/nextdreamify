import './globals.css';
import '../styles/app.css';
import { GoogleAnalytics } from '@next/third-parties/google';
import Providers from './Providers';

export const metadata = {
  title: "Dreamify – Free AI Image Generator | Create Art from Prompts Online",
  description: "Generate stunning, high-quality images instantly using AI and creative prompts. Ideal for artists, marketers, developers, and creators.",
  keywords: "AI Image Generator, Dreamify, AI Art, prompt-based image generation, text to image, creative AI, generative art, AI design tool",
  authors: [{ name: "Nandani Singh" }],
  openGraph: {
    title: "Dreamify – Free AI Image Generator | Create Art from Prompts Online",
    description: "Create visually captivating AI-generated images from text prompts in seconds with Dreamify.",
    url: "https://nextdreamify.vercel.app",
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
    images: ["https://res.cloudinary.com/dpmengi5q/image/upload/v1735566750/image_2_cmhkfh.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://nextdreamify.vercel.app/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Dreamify",
              url: "https://nextdreamify.vercel.app",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://nextdreamify.vercel.app/?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className="!bg-[#000]">
        <Providers>
          {children}
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''} />
        </Providers>
      </body>
    </html>
  );
}