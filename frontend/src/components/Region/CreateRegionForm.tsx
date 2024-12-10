import React from "react";
import { Form, Input, Button, notification } from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import { Region } from "@app/services/types";

export const CreateRegionForm: React.FC = () => {
  const [form] = Form.useForm();
  const intl = useIntl();

  const onFinish = (values: Region) => {
    console.log("Form submitted:", values);
    notification.success({
      message: intl.formatMessage({ id: "region.success" }),
      description: intl.formatMessage({ id: "region.success.description" }),
    });
  };

  return (
    <Form
      form={form}
      name="region"
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ coordinates: [[[0, 0]]] }}
      style={{ maxWidth: 400, margin: "0 auto" }}
    >
      {/* Name */}
      <Form.Item
        name="name"
        label={<FormattedMessage id="region.name" />}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: "region.name.required" }),
          },
        ]}
      >
        <Input placeholder={intl.formatMessage({ id: "region.name" })} />
      </Form.Item>

      {/* Type */}
      <Form.Item
        name="type"
        label={<FormattedMessage id="region.type" />}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: "region.type.required" }),
          },
        ]}
      >
        <Input placeholder={intl.formatMessage({ id: "region.type" })} />
      </Form.Item>

      {/* Coordinates */}
      <Form.Item
        name="coordinates"
        label={<FormattedMessage id="region.coordinates" />}
        rules={[
          {
            type: "array",
            message: intl.formatMessage({ id: "region.coordinates.valid" }),
          },
          {
            validator: (_, value) =>
              value.length >= 1 &&
              value.every(
                (polygon: [number, number][]) =>
                  polygon.length >= 1 &&
                  polygon.every(
                    (coord: [number, number]) =>
                      coord.length === 2 &&
                      coord.every((v: number) => !isNaN(v))
                  )
              )
                ? Promise.resolve()
                : Promise.reject(
                    new Error(
                      intl.formatMessage({ id: "region.coordinates.valid" })
                    )
                  ),
          },
        ]}
      >
        <Input.Group compact>
          <Form.Item
            name={["coordinates", 0, 0, 0]}
            noStyle
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: "region.coordinates.latitude.required",
                }),
              },
            ]}
          >
            <Input
              placeholder={intl.formatMessage({ id: "region.latitude" })}
              style={{ width: "50%" }}
            />
          </Form.Item>
          <Form.Item
            name={["coordinates", 0, 0, 1]}
            noStyle
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: "region.coordinates.longitude.required",
                }),
              },
            ]}
          >
            <Input
              placeholder={intl.formatMessage({ id: "region.longitude" })}
              style={{ width: "50%" }}
            />
          </Form.Item>
        </Input.Group>
      </Form.Item>

      {/* Submit Button */}
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          <FormattedMessage id="region.submit" />
        </Button>
      </Form.Item>
    </Form>
  );
};
