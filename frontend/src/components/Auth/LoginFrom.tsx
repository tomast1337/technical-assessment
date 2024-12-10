import { Form, Input, Button, notification } from "antd";
import { LoginUser } from "@app/services/Auth/types";
import { FormattedMessage, useIntl } from "react-intl";
export const LoginForm: React.FC = () => {
  const [form] = Form.useForm();
  const intl = useIntl();

  const onFinish = (values: LoginUser) => {
    console.log("Login successful:", values);
    notification.success({
      message: intl.formatMessage({ id: "login.success" }),
      description: intl.formatMessage({ id: "login.success.description" }),
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
        label={<FormattedMessage id="login.email" />}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: "login.email" }),
          },
          { type: "email", message: intl.formatMessage({ id: "login.email" }) },
        ]}
      >
        <Input placeholder={intl.formatMessage({ id: "login.email" })} />
      </Form.Item>

      {/* Password */}
      <Form.Item
        name="password"
        label={<FormattedMessage id="login.password" />}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: "login.password" }),
          },
        ]}
      >
        <Input.Password
          placeholder={intl.formatMessage({ id: "login.password" })}
        />
      </Form.Item>

      {/* Submit Button */}
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          <FormattedMessage id="login.submit" />
        </Button>
      </Form.Item>

      {/* Register Link */}
      <Form.Item>
        <Button type="link" block>
          <FormattedMessage id="login.register" />
        </Button>
      </Form.Item>

      {/* Language Switcher */}
    </Form>
  );
};
