import React from "react";
import { useLocation } from "react-router-dom";
import Container from "../components/Container";
import Layout from "../layouts/Default";
import PoolPage from "./PoolPage";
import TradePage from "./TradePage";

export default function Trade() {
  const asPath = useLocation().pathname;
  return (
    <Layout>
      <Container
        className="mx-auto font-lora py-4 md:py-8 lg:py-12"
        maxWidth="2xl"
      >
        {asPath === "/bazaar/swap" ? <TradePage /> : <PoolPage />}
      </Container>
    </Layout>
  );
}
