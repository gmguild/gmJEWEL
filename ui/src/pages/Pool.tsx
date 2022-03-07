import React from "react";
import { useLocation } from "react-router";
import Container from "../components/Container";
import Layout from "../layouts/Default";
import PoolPage from "./PoolPage";
import PoolPageAdd from "./PoolPage/Add";
import PoolPageRemove from "./PoolPage/Remove";

export default function Pool() {
  const location = useLocation();
  return (
    <Layout>
      <Container
        className="mx-auto font-lora py-4 md:py-8 lg:py-12"
        maxWidth="2xl"
      >
        {location.pathname == "/pool" ? (
          <PoolPage />
        ) : location.pathname.startsWith("/pool/add") ? (
          <PoolPageAdd />
        ) : location.pathname.startsWith("/pool/remove") ? (
          <PoolPageRemove />
        ) : (
          <></>
        )}
      </Container>
    </Layout>
  );
}
