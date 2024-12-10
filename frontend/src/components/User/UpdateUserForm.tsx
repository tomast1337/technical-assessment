import React from "react";
import { Form, Input, Button, notification } from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import { UpdateUser } from "@app/services/User/types";

export const UpdateUserForm: React.FC = () => {
  const [form] = Form.useForm();
  const intl = useIntl();

  const onFinish = (values: UpdateUser) => {
    console.log("Form submitted:", values);
    notification.success({
      message: intl.formatMessage({ id: "updateUser.success" }),
      description: intl.formatMessage({ id: "updateUser.success.description" }),
    });
  };

  return (
    <Form
      form={form}
      name="update-user"
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ coordinates: [0, 0] }}
      style={{ maxWidth: 400, margin: "0 auto" }}
    >
      {/* Name */}
      <Form.Item
        name="name"
        label={<FormattedMessage id="updateUser.name" />}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: "updateUser.name.required" }),
          },
        ]}
      >
        <Input placeholder={intl.formatMessage({ id: "updateUser.name" })} />
      </Form.Item>

      {/* Address */}
      <Form.Item
        name="address"
        label={<FormattedMessage id="updateUser.address" />}
        rules={[
          {
            type: "string",
            message: intl.formatMessage({ id: "updateUser.address.valid" }),
          },
        ]}
      >
        <Input placeholder={intl.formatMessage({ id: "updateUser.address" })} />
      </Form.Item>

      {/* Coordinates */}
      <Form.Item
        name="coordinates"
        label={<FormattedMessage id="updateUser.coordinates" />}
        rules={[
          {
            type: "array",
            message: intl.formatMessage({ id: "updateUser.coordinates.valid" }),
          },
          {
            validator: (_, value) =>
              value.length === 2 && value.every((v: number) => !isNaN(v))
                ? Promise.resolve()
                : Promise.reject(
                    new Error(
                      intl.formatMessage({ id: "updateUser.coordinates.valid" })
                    )
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
                message: intl.formatMessage({
                  id: "updateUser.coordinates.latitude.required",
                }),
              },
            ]}
          >
            <Input
              placeholder={intl.formatMessage({ id: "updateUser.latitude" })}
              style={{ width: "50%" }}
            />
          </Form.Item>
          <Form.Item
            name={["coordinates", 1]}
            noStyle
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: "updateUser.coordinates.longitude.required",
                }),
              },
            ]}
          >
            <Input
              placeholder={intl.formatMessage({ id: "updateUser.longitude" })}
              style={{ width: "50%" }}
            />
          </Form.Item>
        </Input.Group>
      </Form.Item>

      {/* Submit Button */}
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          <FormattedMessage id="updateUser.submit" />
        </Button>
      </Form.Item>
    </Form>
  );
};
