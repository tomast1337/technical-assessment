import { GeoPointRequest } from "@components/Region/GeoPointRequest";
import { AppLayout } from "@components/Layout/AppLayout";

export const RegionsContainingPointPage = () => {
  return (
    <AppLayout>
      <GeoPointRequest />
    </AppLayout>
  );
};
