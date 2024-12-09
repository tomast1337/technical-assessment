import { Layout } from "antd";

const { Footer } = Layout;

export const AppFooter: React.FC = () => {
  return (
    <Footer style={{ textAlign: "center" }}>
      ©{new Date().getFullYear()} My App. All rights reserved.
    </Footer>
  );
};
