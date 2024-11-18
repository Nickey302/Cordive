import "../style/globals.css";
import GlobalAudioVisualizer from '@/components/common/GlobalAudioVisualizer'
import Header from './Header'

export const metadata = {
  title: "CorDive",
  description: "created by Team Compass+",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/assets/icons/Logo.jpeg" />
        <link rel="preload" href="/assets/fonts/NeoCode.woff" as="font" type="font/woff" crossOrigin="anonymous" />
      </head>
      <body style={{ fontFamily: 'NeoCode, sans-serif' }}>
        <Header />
        {children}
      </body>
    </html>
  );
}
