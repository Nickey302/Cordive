import "../style/globals.css";

export const metadata = {
  title: "CorDive",
  description: "created by Team Compassion+",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
