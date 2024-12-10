import React from "react";
import { Form, Input, Button, notification } from "antd";
import { RegisterUser } from "@app/services/Auth/types";

export const RegisterForm: React.FC = () => {
  const [form] = Form.useForm<RegisterUser>();

  const onFinish = (values: RegisterUser) => {
    console.log("Form submitted:", values);
    notification.success({
      message: "Registration Successful",
      description: "Your account has been created successfully.",
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validatePassword = ({ getFieldValue }: any) => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validator(_: any, value: string) {
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("Passwords do not match!"));
    },
  });

  return (
    <Form
      form={form}
      name="register"
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ coordinates: [0, 0] }}
      style={{ maxWidth: 400, margin: "0 auto" }}
    >
      {/* Name */}
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: "Please enter your name" }]}
      >
        <Input placeholder="Your Name" />
      </Form.Item>

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
        rules={[
          { required: true, message: "Please enter your password" },
          { min: 6, message: "Password must be at least 6 characters" },
        ]}
        hasFeedback
      >
        <Input.Password placeholder="Your Password" />
      </Form.Item>

      {/* Confirm Password */}
      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={["password"]}
        rules={[
          { required: true, message: "Please confirm your password" },
          validatePassword,
        ]}
        hasFeedback
      >
        <Input.Password placeholder="Confirm Your Password" />
      </Form.Item>

      {/* Address */}
      <Form.Item
        name="address"
        label="Address (Optional)"
        rules={[{ type: "string", message: "Address must be a valid string" }]}
      >
        <Input placeholder="Your Address" />
      </Form.Item>

      {/* Coordinates */}
      <Form.Item
        name="coordinates"
        label="Coordinates (Optional)"
        rules={[
          {
            type: "array",
            message: "Coordinates must be an array of two numbers",
          },
          {
            validator: (_, value) =>
              value.length === 2 && value.every((v: number) => !isNaN(v))
                ? Promise.resolve()
                : Promise.reject(
                    new Error("Coordinates must contain exactly two numbers")
                  ),
          },
        ]}
      >
        <Input.Group compact>
          <Form.Item
            name={["coordinates", 0]}
            noStyle
            rules={[
              {
                required: true,
                message: "Please enter the latitude",
              },
            ]}
          >
            <Input placeholder="Latitude" style={{ width: "50%" }} />
          </Form.Item>
          <Form.Item
            name={["coordinates", 1]}
            noStyle
            rules={[
              {
                required: true,
                message: "Please enter the longitude",
              },
            ]}
          >
            <Input placeholder="Longitude" style={{ width: "50%" }} />
          </Form.Item>
        </Input.Group>
      </Form.Item>

      {/* Submit Button */}
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};
