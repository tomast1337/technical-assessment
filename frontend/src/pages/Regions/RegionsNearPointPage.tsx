import { GeoDistanceRequest } from "@components/Region/GeoDistanceRequest";
import { AppLayout } from "@components/Layout/AppLayout";

export const RegionsNearPointPage = () => {
  return (
    <AppLayout>
      <GeoDistanceRequest />
    </AppLayout>
  );
};
