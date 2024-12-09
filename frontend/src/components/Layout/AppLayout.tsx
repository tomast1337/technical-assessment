import React from "react";
import { Layout } from "antd";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./AppFooter";

const { Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppHeader />
      <Content style={{ padding: "20px" }}>
        <div
          style={{ background: "#fff", padding: "20px", borderRadius: "4px" }}
        >
          {children}
        </div>
      </Content>
      <AppFooter />
    </Layout>
  );
};
