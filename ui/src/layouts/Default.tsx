import React from "react";
import Popups from "../components/Popups";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="z-0 flex flex-col items-center w-full h-screen">
      {/* <Header />
      <Main>{children}</Main>
      
      <Footer /> */}
      {children}
      <Popups />
    </div>
  );
};

export default Layout;
