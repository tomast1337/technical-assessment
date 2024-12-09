import React from "react";
import { Form, Input, Button, notification } from "antd";

export const LoginForm: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Login successful:", values);
    notification.success({
      message: "Login Successful",
      description: "You have been logged in successfully.",
    });
  };

  return (
    <Form
      form={form}
      name="login"
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 400, margin: "0 auto" }}
    >
      {/* Email */}
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "Please enter your email" },
          { type: "email", message: "Please enter a valid email address" },
        ]}
      >
        <Input placeholder="Your Email" />
      </Form.Item>

      {/* Password */}
      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: "Please enter your password" }]}
      >
        <Input.Password placeholder="Your Password" />
      </Form.Item>

      {/* Submit Button */}
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};
