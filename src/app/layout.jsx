import "../style/globals.css";

export const metadata = {
  title: "CorDive",
  description: "created by Team Compassion+",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/assets/icons/Logo.jpeg" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
