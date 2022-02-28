import React, { FC } from "react";
import Container from "../components/Container";
import DoubleGlowShadow from "../components/DoubleGlowShadow";
import DefaultLayout from "./Default";

export interface Layout {
  id: string;
}

export const SwapLayoutCard: FC = ({ children }) => {
  return (
    <div className="flex flex-col gap-3 p-2 md:p-4 pt-4 rounded-[24px] bg-taupe-300 shadow-md shadow-taupe-500">
      {children}
    </div>
  );
};

export const Layout: FC<Layout> = ({ children, id }) => {
  return (
    <DefaultLayout>
      <Container
        id={id}
        className="py-4 md:py-12 lg:py-[120px] px-2"
        maxWidth="md"
      >
        <DoubleGlowShadow>{children}</DoubleGlowShadow>
      </Container>
    </DefaultLayout>
  );
};

type SwapLayout = (id: string) => FC;
export const SwapLayout: SwapLayout = (id: string) => {
  // eslint-disable-next-line react/display-name
  return (props) => <Layout id={id} {...props} />;
};
