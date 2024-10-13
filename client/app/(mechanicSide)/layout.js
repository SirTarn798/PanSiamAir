import "../globals.css";
import { UserProvider } from "@/state/UserProvider";
import Header from "@/app/component/header";
import MechanicNavBar from "@/app/component/mechanicNavBar"

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
            <MechanicNavBar />
            {children}
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
