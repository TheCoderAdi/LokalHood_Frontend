import { useRef, useEffect, useState } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { MAPTILER_API_KEY } from "../lib/data";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const Map = ({ vendorArray, selectedVendor, loading }) => {
  const { user } = useSelector((state) => state.user);
  const mapContainer = useRef(null);
  const map = useRef(null);

  const [zoom] = useState(14);

  maptilersdk.config.apiKey = MAPTILER_API_KEY;

  useEffect(() => {
    if (map.current) return;

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.OPENSTREETMAP,
      center: [user.longitude, user.latitude],
      zoom: zoom,
    });
    if (!loading) {
      vendorArray.forEach((vendor) => {
        new maptilersdk.Marker()
          .setLngLat([
            vendor.location.coordinates[0],
            vendor.location.coordinates[1],
          ])
          .addTo(map.current);
      });
    }

    new maptilersdk.Marker()
      .setLngLat([user.longitude, user.latitude])
      .addTo(map.current);
  }, [user, zoom, vendorArray, loading]);

  useEffect(() => {
    if (!selectedVendor) return;

    map.current.flyTo({
      center: [
        selectedVendor.location.coordinates[0],
        selectedVendor.location.coordinates[1],
      ],
      zoom: 16,
      essential: true,
    });
  }, [selectedVendor]);

  return (
    <div
      className="map-wrap"
      style={{
        height: "70vh",
      }}
    >
      <div ref={mapContainer} id="map" style={{ borderRadius: "10px" }} />
    </div>
  );
};

Map.propTypes = {
  vendorArray: PropTypes.array.isRequired,
  selectedVendor: PropTypes.object,
  loading: PropTypes.bool.isRequired,
};

export default Map;
