import React from "react";
import { Form, Input, Button, notification } from "antd";
import { FormattedMessage, useIntl } from "react-intl";

import axios from "axios";
import { Region } from "@app/services/types";

interface UpdateRegionFormProps {
  initialValues: Region;
  regionId: string;
}

export const UpdateRegionForm: React.FC<UpdateRegionFormProps> = ({
  initialValues,
  regionId,
}) => {
  const [form] = Form.useForm();
  const intl = useIntl();

  const onFinish = async (values: Region) => {
    try {
      await axios.put(`http://localhost:8000/api/regions/${regionId}`, values);
      notification.success({
        message: intl.formatMessage({ id: "updateRegion.success" }),
        description: intl.formatMessage({
          id: "updateRegion.success.description",
        }),
      });
    } catch {
      notification.error({
        message: intl.formatMessage({ id: "updateRegion.error" }),
        description: intl.formatMessage({
          id: "updateRegion.error.description",
        }),
      });
    }
  };

  return (
    <Form
      form={form}
      name="update-region"
      layout="vertical"
      onFinish={onFinish}
      initialValues={initialValues}
      style={{ maxWidth: 400, margin: "0 auto" }}
    >
      {/* Name */}
      <Form.Item
        name="name"
        label={<FormattedMessage id="updateRegion.name" />}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: "updateRegion.name.required" }),
          },
        ]}
      >
        <Input placeholder={intl.formatMessage({ id: "updateRegion.name" })} />
      </Form.Item>

      {/* Type */}
      <Form.Item
        name="type"
        label={<FormattedMessage id="updateRegion.type" />}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: "updateRegion.type.required" }),
          },
        ]}
      >
        <Input placeholder={intl.formatMessage({ id: "updateRegion.type" })} />
      </Form.Item>

      {/* Coordinates */}
      <Form.Item
        name="coordinates"
        label={<FormattedMessage id="updateRegion.coordinates" />}
        rules={[
          {
            type: "array",
            message: intl.formatMessage({
              id: "updateRegion.coordinates.valid",
            }),
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
                      intl.formatMessage({
                        id: "updateRegion.coordinates.valid",
                      })
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
                  id: "updateRegion.coordinates.latitude.required",
                }),
              },
            ]}
          >
            <Input
              placeholder={intl.formatMessage({ id: "updateRegion.latitude" })}
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
                  id: "updateRegion.coordinates.longitude.required",
                }),
              },
            ]}
          >
            <Input
              placeholder={intl.formatMessage({ id: "updateRegion.longitude" })}
              style={{ width: "50%" }}
            />
          </Form.Item>
        </Input.Group>
      </Form.Item>

      {/* Submit Button */}
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          <FormattedMessage id="updateRegion.submit" />
        </Button>
      </Form.Item>
    </Form>
  );
};
