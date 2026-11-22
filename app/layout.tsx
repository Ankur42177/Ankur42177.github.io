import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import AmbientBackground from "../components/AmbientBackground";
import CardFx from "../components/CardFx";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const serif = Instrument_Serif({ variable: "--font-instrument", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });

export const metadata: Metadata = {
  title: "Ankur Kumar — Software Developer",
  description:
    "Portfolio of Ankur Kumar, SDE II at Trellix: Java/Spring Boot backend services, C++ Windows drivers, AI agents, and personal projects Pulse (microservices at scale) and Intruva (prompt security).",
  authors: [{ name: "Ankur Kumar" }],
};

// Applies the saved theme before first paint (dark unless the visitor chose light) to avoid a flash.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light')document.documentElement.classList.add('dark')}catch(e){document.documentElement.classList.add('dark')}})()`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen font-sans">
        <AmbientBackground />
        <CardFx />
        {children}
      </body>
    </html>
  );
}
