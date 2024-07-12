import { Sofia_Sans } from "next/font/google";
import "./globals.css";
import {Providers} from "../providers/providers";
import Header from "./components/Header";

const inter = Sofia_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Crowdfunding",
  description: "",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#191B1F] text-white`} >
        <Providers>
          <Header />
          <div className="mt-[200px] md:mt-0">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
