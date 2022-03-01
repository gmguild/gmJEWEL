import React from "react";
import Container from "../components/Container";
import Layout from "../layouts/Default";
import PoolPage from "./PoolPage";

export default function Pool() {
  return (
    <Layout>
      <Container
        className="mx-auto font-lora py-4 md:py-8 lg:py-12"
        maxWidth="2xl"
      >
        <PoolPage />
      </Container>
    </Layout>
  );
}
