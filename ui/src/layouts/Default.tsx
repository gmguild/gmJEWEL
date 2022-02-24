import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="z-0 flex flex-col items-center w-full h-screen">
      {/* <Header />
      <Main>{children}</Main>
      <Popups />
      <Footer /> */}
      {children}
    </div>
  );
};

export default Layout;
