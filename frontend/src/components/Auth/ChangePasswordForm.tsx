import React from "react";
import { Form, Input, Button, notification } from "antd";
import { UpdatePassword } from "@app/services/Auth/types";
import { FormattedMessage, useIntl } from "react-intl";

export const ChangePasswordForm: React.FC = () => {
  const [form] = Form.useForm<UpdatePassword>();
  const intl = useIntl();

  const onFinish = (values: UpdatePassword) => {
    console.log("Password change submitted:", values);
    notification.success({
      message: intl.formatMessage({ id: "changePassword.success" }),
      description: intl.formatMessage({
        id: "changePassword.success.description",
      }),
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validatePassword = ({ getFieldValue }: any) => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validator(_: any, value: string) {
      if (!value || getFieldValue("newPassword") === value) {
        return Promise.resolve();
      }
      return Promise.reject(
        new Error(
          intl.formatMessage({ id: "changePassword.confirmNewPassword.match" })
        )
      );
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
        label={<FormattedMessage id="changePassword.newPassword" />}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: "changePassword.newPassword.required",
            }),
          },
          {
            min: 6,
            message: intl.formatMessage({
              id: "changePassword.newPassword.min",
            }),
          },
        ]}
        hasFeedback
      >
        <Input.Password
          placeholder={intl.formatMessage({ id: "changePassword.newPassword" })}
        />
      </Form.Item>

      {/* Confirm New Password */}
      <Form.Item
        name="confirmNewPassword"
        label={<FormattedMessage id="changePassword.confirmNewPassword" />}
        dependencies={["newPassword"]}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: "changePassword.confirmNewPassword.required",
            }),
          },
          validatePassword,
        ]}
        hasFeedback
      >
        <Input.Password
          placeholder={intl.formatMessage({
            id: "changePassword.confirmNewPassword",
          })}
        />
      </Form.Item>

      {/* Submit Button */}
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          <FormattedMessage id="changePassword.submit" />
        </Button>
      </Form.Item>
    </Form>
  );
};
