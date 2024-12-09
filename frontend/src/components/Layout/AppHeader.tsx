import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";

const { Header } = Layout;

export const AppHeader: React.FC = () => {
  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ color: "#fff", fontWeight: "bold", fontSize: "18px" }}>
        My App
      </div>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
        <Menu.Item key="1" icon={<HomeOutlined />}>
          Home
        </Menu.Item>
        <Menu.Item key="2" icon={<UserOutlined />}>
          Profile
        </Menu.Item>
      </Menu>
    </Header>
  );
};
