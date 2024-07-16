import { useState, useEffect, useRef } from "react";
import "../styles/MapModal.css";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import PropTypes from "prop-types";
import axios from "axios";
import { useSelector } from "react-redux";
import { MAPTILER_API_KEY, OPENCAGE_API_KEY } from "../lib/data";
import { CgClose } from "react-icons/cg";

const MapModal = ({ isOpen, onClose, onLocationSelect }) => {
  const { user } = useSelector((state) => state.user);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const defaultLocation = {
    lat: user && user.latitude ? user.latitude.toString() : "20.2961",
    lng: user && user.longitude ? user.longitude.toString() : "85.8245",
  };

  const [marker, setMarker] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [zoom] = useState(14);

  maptilersdk.config.apiKey = MAPTILER_API_KEY;

  useEffect(() => {
    if (isOpen) {
      if (map.current) return;

      map.current = new maptilersdk.Map({
        container: mapContainer.current,
        style: maptilersdk.MapStyle.OPENSTREETMAP,
        center: [defaultLocation.lng, defaultLocation.lat],
        zoom: zoom,
      });
    }
  }, [
    isOpen,
    defaultLocation.lat,
    defaultLocation.lng,
    onLocationSelect,
    zoom,
  ]);

  useEffect(() => {
    if (map.current) {
      map.current.on("click", (e) => {
        const { lat, lng } = e.lngLat;

        if (marker) {
          marker.remove();
        }

        const newMarker = new maptilersdk.Marker()
          .setLngLat([lng, lat])
          .addTo(map.current);
        setMarker(newMarker);

        onLocationSelect({ latitude: lat, longitude: lng });
        handleLocationSelect({ latitude: lat, longitude: lng });
      });
    }
  }, [marker, onLocationSelect]);

  const handleLocationSelect = async ({ latitude, longitude }) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${OPENCAGE_API_KEY}`
      );
      const address = response.data.results[0].formatted;
      setSearchResult(address);
      setLoading(false);
    } catch {
      console.log("Unable to retrieve your location");
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(
          searchQuery
        )}.json?key=${MAPTILER_API_KEY}`
      );

      setLoading(false);

      if (response.data.features.length > 0) {
        const { center, place_name } = response.data.features[0];
        const [lng, lat] = center;
        setSearchResult(place_name);
        map.current.flyTo({ center: [lng, lat], zoom: zoom });

        onLocationSelect({ latitude: lat, longitude: lng });
        const address = await handleLocationSelect({
          latitude: lat,
          longitude: lng,
        });
        setSearchResult(address);
      } else {
        alert("Location not found. Please try another search.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error searching location:", error);
      alert("An error occurred while searching for the location.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="search-result">
          <p>Selected Location:</p>
          <p>
            {loading
              ? "Loading..."
              : searchResult || "Click on the map to select a location"}
          </p>
        </div>
        <div className="search-container">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a location"
          />
          <button
            className="search-map"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
        <div className="map-wrap">
          <div ref={mapContainer} id="map" />
        </div>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "-15px",
            right: "-16px",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <CgClose size={40} color="#333" />
        </button>
      </div>
    </div>
  );
};

MapModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onLocationSelect: PropTypes.func.isRequired,
};

export default MapModal;
