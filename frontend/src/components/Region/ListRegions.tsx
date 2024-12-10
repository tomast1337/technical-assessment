import React, { useEffect, useState } from "react";
import { Table, notification } from "antd";

import { FormattedMessage, useIntl } from "react-intl";
import axios from "axios";
import { Region } from "@services/types";

export const RegionList: React.FC = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const intl = useIntl();

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get<Region[]>(
          "http://localhost:8000/api/regions"
        );
        setRegions(response.data);
      } catch {
        notification.error({
          message: intl.formatMessage({ id: "region.fetchError" }),
          description: intl.formatMessage({
            id: "region.fetchError.description",
          }),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, [intl]);

  const columns = [
    {
      title: <FormattedMessage id="region.name" />,
      dataIndex: "name",
      key: "name",
    },
    {
      title: <FormattedMessage id="region.type" />,
      dataIndex: "type",
      key: "type",
    },
    {
      title: <FormattedMessage id="region.coordinates" />,
      dataIndex: "coordinates",
      key: "coordinates",
      render: (coordinates: [number, number][][]) =>
        coordinates.map((polygon, index) => (
          <div key={index}>
            {polygon.map((coord, idx) => (
              <div key={idx}>
                {intl.formatMessage({ id: "region.latitude" })}: {coord[0]},{" "}
                {intl.formatMessage({ id: "region.longitude" })}: {coord[1]}
              </div>
            ))}
          </div>
        )),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>
        <FormattedMessage id="region.list" />
      </h1>
      <Table
        columns={columns}
        dataSource={regions}
        rowKey={(record) => record.name}
        loading={loading}
      />
    </div>
  );
};
