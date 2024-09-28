import "../globals.css";
import { UserProvider } from "@/state/UserProvider";
import Header from "../component/header";
import ServiceNavBar from "../component/serviceNavbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
