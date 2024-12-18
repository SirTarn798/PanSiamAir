import "../globals.css";
import { UserProvider } from "@/state/UserProvider";
import Header from "../component/header";
import CusNavBar from "../component/cusNavBar"
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
            <CusNavBar />
            {children}
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
