import "../globals.css";
import { UserProvider } from "@/state/UserProvider";
import Header from "@/app/component/header";
import StoreNavBar from "@/app/component/storeNavBar"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <Header />
          <div className="flex">
            <StoreNavBar />
            {children}
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
