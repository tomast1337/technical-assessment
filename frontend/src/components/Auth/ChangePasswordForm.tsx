import React from "react";
import { Form, Input, Button, notification } from "antd";

export const ChangePasswordForm: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Password change submitted:", values);
    notification.success({
      message: "Password Changed",
      description: "Your password has been successfully updated.",
    });
  };

  const validatePassword = ({ getFieldValue }: any) => ({
    validator(_: any, value: string) {
      if (!value || getFieldValue("newPassword") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("Passwords do not match!"));
    },
  });

  return (
    <Form
      form={form}
      name="change-password"
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 400, margin: "0 auto" }}
    >
      {/* New Password */}
      <Form.Item
        name="newPassword"
        label="New Password"
        rules={[
          { required: true, message: "Please enter a new password" },
          { min: 6, message: "Password must be at least 6 characters" },
        ]}
        hasFeedback
      >
        <Input.Password placeholder="New Password" />
      </Form.Item>

      {/* Confirm New Password */}
      <Form.Item
        name="confirmNewPassword"
        label="Confirm New Password"
        dependencies={["newPassword"]}
        rules={[
          { required: true, message: "Please confirm your new password" },
          validatePassword,
        ]}
        hasFeedback
      >
        <Input.Password placeholder="Confirm New Password" />
      </Form.Item>

      {/* Submit Button */}
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Change Password
        </Button>
      </Form.Item>
    </Form>
  );
};
