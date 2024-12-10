import React from "react";
import { Form, Input, Button, Checkbox, notification } from "antd";
import { FormattedMessage, useIntl } from "react-intl";

import axios from "axios";
import { GeoDistance } from "@services/types";

export const GeoDistanceRequest: React.FC = () => {
  const [form] = Form.useForm();
  const intl = useIntl();

  const onFinish = async (values: GeoDistance) => {
    try {
      await axios.post("http://localhost:8000/api/geo-distance", values);
      notification.success({
        message: intl.formatMessage({ id: "geoDistance.success" }),
        description: intl.formatMessage({
          id: "geoDistance.success.description",
        }),
      });
    } catch {
      notification.error({
        message: intl.formatMessage({ id: "geoDistance.error" }),
        description: intl.formatMessage({
          id: "geoDistance.error.description",
        }),
      });
    }
  };

  return (
    <Form
      form={form}
      name="geo-distance"
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 400, margin: "0 auto" }}
    >
      {/* Latitude */}
      <Form.Item
        name="lat"
        label={<FormattedMessage id="geoDistance.lat" />}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: "geoDistance.lat.required" }),
          },
        ]}
      >
        <Input placeholder={intl.formatMessage({ id: "geoDistance.lat" })} />
      </Form.Item>

      {/* Longitude */}
      <Form.Item
        name="lng"
        label={<FormattedMessage id="geoDistance.lng" />}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: "geoDistance.lng.required" }),
          },
        ]}
      >
        <Input placeholder={intl.formatMessage({ id: "geoDistance.lng" })} />
      </Form.Item>

      {/* Max Distance */}
      <Form.Item
        name="maxDistance"
        label={<FormattedMessage id="geoDistance.maxDistance" />}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: "geoDistance.maxDistance.required",
            }),
          },
        ]}
      >
        <Input
          placeholder={intl.formatMessage({ id: "geoDistance.maxDistance" })}
        />
      </Form.Item>

      {/* Filter User ID */}
      <Form.Item name="filterUserId" valuePropName="checked">
        <Checkbox>
          <FormattedMessage id="geoDistance.filterUserId" />
        </Checkbox>
      </Form.Item>

      {/* Submit Button */}
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          <FormattedMessage id="geoDistance.submit" />
        </Button>
      </Form.Item>
    </Form>
  );
};
