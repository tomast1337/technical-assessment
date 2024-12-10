import React from "react";
import { Form, Input, Button, notification } from "antd";
import { FormattedMessage, useIntl } from "react-intl";

import axios from "axios";
import { GeoPoint } from "@services/types";

export const GeoPointRequest: React.FC = () => {
  const [form] = Form.useForm();
  const intl = useIntl();

  const onFinish = async (values: GeoPoint) => {
    try {
      await axios.post("http://localhost:8000/api/geo-point", values);
      notification.success({
        message: intl.formatMessage({ id: "geoPoint.success" }),
        description: intl.formatMessage({ id: "geoPoint.success.description" }),
      });
    } catch {
      notification.error({
        message: intl.formatMessage({ id: "geoPoint.error" }),
        description: intl.formatMessage({ id: "geoPoint.error.description" }),
      });
    }
  };

  return (
    <Form
      form={form}
      name="geo-point"
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 400, margin: "0 auto" }}
    >
      {/* Latitude */}
      <Form.Item
        name="lat"
        label={<FormattedMessage id="geoPoint.lat" />}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: "geoPoint.lat.required" }),
          },
        ]}
      >
        <Input placeholder={intl.formatMessage({ id: "geoPoint.lat" })} />
      </Form.Item>

      {/* Longitude */}
      <Form.Item
        name="lng"
        label={<FormattedMessage id="geoPoint.lng" />}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: "geoPoint.lng.required" }),
          },
        ]}
      >
        <Input placeholder={intl.formatMessage({ id: "geoPoint.lng" })} />
      </Form.Item>

      {/* Submit Button */}
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          <FormattedMessage id="geoPoint.submit" />
        </Button>
      </Form.Item>
    </Form>
  );
};
