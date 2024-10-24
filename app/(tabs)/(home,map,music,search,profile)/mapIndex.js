import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import MapboxGL from "@rnmapbox/maps";

MapboxGL.setAccessToken(
  "pk.eyJ1IjoibGFzYXJpYSIsImEiOiJjbTJheXV0cjcwNG9zMmxwdnlxZWdoMjc5In0.NoBtaBj9cNvdemNp52pxGQ"
);

const MapScreen = () => {
  const [venues, setVenues] = useState(null);

  // Hardcoded venue data
  const venueData = [
    { name: "Ultra Bar DC", latitude: 38.8963, longitude: -77.0241 },
    { name: "Decades DC", latitude: 38.9066, longitude: -77.0426 },
    {
      name: "Bravo Bravo",
      latitude: 38.9031,
      longitude: -77.0405,
      address: "1001 Connecticut Ave NW, Washington, DC 20036",
    },
    {
      name: "Bliss DC",
      latitude: 38.9106,
      longitude: -77.0197,
      address: "2122 24th Pl NE, Washington, DC 20018",
    },
    {
      name: "Kiss Lounge",
      latitude: 38.9167,
      longitude: -77.0229,
      address: "637 T St NW, Washington, DC 20001",
    },
    {
      name: "Kiss Lounge Falls Church",
      latitude: 38.8462,
      longitude: -77.1312,
      address: "5820 Seminary Rd, Falls Church, VA 22041",
    },
    {
      name: "The Park at 14th",
      latitude: 38.9023,
      longitude: -77.0317,
      address: "920 14th St NW, Washington, DC 20005",
    },
    {
      name: "Soundcheck",
      latitude: 38.9047,
      longitude: -77.0311,
      address: "1420 K St NW, Washington, DC 20005",
    },
    {
      name: "Heist Nightclub",
      latitude: 38.9092,
      longitude: -77.0433,
      address: "1216 18th St NW, Washington, DC 20036",
    },
    {
      name: "Rosebar Lounge",
      latitude: 38.9059,
      longitude: -77.0436,
      address: "1215 Connecticut Ave NW, Washington, DC 20036",
    },
    {
      name: "Echostage",
      latitude: 38.9176,
      longitude: -76.9773,
      address: "2135 Queens Chapel Rd NE, Washington, DC 20018",
    },
    {
      name: "Saint Yves",
      latitude: 38.9096,
      longitude: -77.0397,
      address: "1220 Connecticut Ave NW, Washington, DC 20036",
    },
    {
      name: "Opera Ultra Lounge",
      latitude: 38.9041,
      longitude: -77.0309,
      address: "1400 I St NW, Washington, DC 20005",
    },
    {
      name: "Living Room DC",
      latitude: 38.9074,
      longitude: -77.0317,
      address: "1008 Vermont Ave NW, Washington, DC 20005",
    },
    {
      name: "Barcode",
      latitude: 38.9024,
      longitude: -77.0363,
      address: "1101 17th St NW, Washington, DC 20036",
    },
    {
      name: "Abigail Nightclub",
      latitude: 38.9059,
      longitude: -77.0436,
      address: "1730 M St NW, Washington, DC 20036",
    },
    {
      name: "PaperMoon Springfield",
      latitude: 38.7779,
      longitude: -77.1854,
      address: "6315 Amherst Ave, Springfield, VA 22150",
    },
    {
      name: "The Buca Room",
      latitude: 38.8038,
      longitude: -77.0475,
      address: "305 S Washington St, Alexandria, VA 22314",
    },
    {
      name: "O’Malley’s Sports Pub",
      latitude: 38.8572,
      longitude: -77.0526,
      address: "2650 Jefferson Davis Hwy, Arlington, VA 22202",
    },
    {
      name: "Murphy’s Grand Irish Pub",
      latitude: 38.8048,
      longitude: -77.0469,
      address: "713 King St, Alexandria, VA 22314",
    },
    {
      name: "Clarendon Ballroom",
      latitude: 38.8877,
      longitude: -77.0953,
      address: "3185 Wilson Blvd, Arlington, VA 22201",
    },
    {
      name: "Bungalow Billiards",
      latitude: 39.0363,
      longitude: -77.4184,
      address: "13891 Metrotech Dr, Chantilly, VA 20151",
    },
    {
      name: "Black Hoof Brewing Co.",
      latitude: 39.1142,
      longitude: -77.5669,
      address: "11 South King St, Leesburg, VA 20175",
    },
    {
      name: "Samuel Beckett's Irish Gastro Pub",
      latitude: 38.8675,
      longitude: -77.1095,
      address: "2800 S Randolph St, Arlington, VA 22206",
    },
    {
      name: "Carlyle Club",
      latitude: 38.8059,
      longitude: -77.0669,
      address: "2050 Ballenger Ave, Alexandria, VA 22314",
    },
    {
      name: "Fish Market",
      latitude: 38.8032,
      longitude: -77.0426,
      address: "105 King St, Alexandria, VA 22314",
    },
    {
      name: "Atlas Brew Works",
      latitude: 38.8049,
      longitude: -77.1224,
      address: "2429 Mandeville Lane, Alexandria, VA 22332",
    },
    {
      name: "Studio Dhoom",
      latitude: 38.9661,
      longitude: -77.3981,
      address: "14531 Lee Jackson Memorial Hwy, Chantilly, VA 20151",
    },
  ];

  useEffect(() => {
    const geojsonData = {
      type: "FeatureCollection",
      features: venueData.map((venue) => ({
        type: "Feature",
        properties: {
          name: venue.name,
        },
        geometry: {
          type: "Point",
          coordinates: [venue.longitude, venue.latitude],
        },
      })),
    };

    setVenues(geojsonData);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MapboxGL.MapView
        style={styles.map}
        styleURL="mapbox://styles/lasaria/cm2kucgfu008g01qhd4f9hvhh"
        glyphsRasterizationOptions={{
          glyphsUrl: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
        }}
      >
        <MapboxGL.Camera
          zoomLevel={10}
          centerCoordinate={[-77.0364, 38.8951]} // Washington DC area
        />

        {venues && (
          <MapboxGL.ShapeSource
            id="venueSource"
            shape={venues}
            cluster={true} // Enable clustering
            clusterRadius={50} // Radius of clustering
            clusterMaxZoom={14} // Maximum zoom level for clustering
          >
            {/* Circle Layer for Clustered Points */}
            <MapboxGL.CircleLayer
              id="clusteredPoints"
              filter={["has", "point_count"]}
              style={{
                circleColor: "blue",
                circleRadius: ["step", ["get", "point_count"], 20, 100, 30],
                circleOpacity: 0.7,
              }}
            />

            {/* Symbol Layer to show Cluster Count (the number inside the circle) */}
            <MapboxGL.SymbolLayer
              id="clusterCount"
              filter={["has", "point_count"]}
              style={{
                textField: "{point_count}",
                textSize: 12,
                textColor: "#fff", // White text for cluster count
                textHaloColor: "#000", // Black halo around numbers
                textHaloWidth: 1,
              }}
            />

            {/* Circle Layer for Individual Points */}
            <MapboxGL.CircleLayer
              id="venueCircle"
              filter={["!", ["has", "point_count"]]} // Only individual points
              style={{
                circleColor: "blue",
                circleRadius: 10,
                circleOpacity: 0.5,
              }}
            />

            {/* Symbol Layer for Venue Names (only when zoomed in) */}
            <MapboxGL.SymbolLayer
              id="venueName"
              filter={["!", ["has", "point_count"]]} // Only individual points
              style={{
                textField: ["get", "name"],
                textSize: 12,
                textColor: "#fff", // White text for venue names
                textHaloColor: "blue", // Blue halo around text
                textHaloWidth: 1,
                textOffset: [0, 1.5],
                textAnchor: "top",
              }}
            />
          </MapboxGL.ShapeSource>
        )}
      </MapboxGL.MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

export default MapScreen;
