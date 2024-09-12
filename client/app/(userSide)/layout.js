import "../globals.css";
import { UserProvider } from "@/state/UserProvider";
import Header from "../component/header";
import NavBar from "../component/navBar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <Header />
          <div className="flex">
            <NavBar />
            {children}
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
