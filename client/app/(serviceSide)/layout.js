import "../globals.css";
import { UserProvider } from "@/state/UserProvider";
import Header from "../component/header";
import ServiceNavBar from "../component/serviceNavbar";

export const metadata = {
  title: "CentralAir",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="icon" href="/icon.png" sizes="any" />
      <body>
        <UserProvider>
          <Header />
          <div className="flex">
            <ServiceNavBar />
            {children}
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
