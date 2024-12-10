import React, { useEffect, useState } from "react";
import { AppLayout } from "@components/Layout/AppLayout";

import { useParams } from "react-router-dom";
import { notification, Spin } from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import axios from "axios";
import { Region } from "@services/types";
import { UpdateRegionForm } from "@app/components/Region/UpdateRegionFrom";

export const RegionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const intl = useIntl();

  useEffect(() => {
    const fetchRegion = async () => {
      try {
        const response = await axios.get<Region>(
          `http://localhost:8000/api/regions/${id}`
        );
        setRegion(response.data);
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

    fetchRegion();
  }, [id, intl]);

  if (loading) {
    return (
      <AppLayout>
        <Spin size="large" />
      </AppLayout>
    );
  }

  if (!region) {
    return (
      <AppLayout>
        <p>
          <FormattedMessage id="region.fetchError.description" />
        </p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <h1>
        <FormattedMessage id="region.details" />
      </h1>
      <UpdateRegionForm initialValues={region} regionId={id!} />
    </AppLayout>
  );
};
