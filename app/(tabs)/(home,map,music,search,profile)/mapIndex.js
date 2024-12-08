import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import MapboxGL from "@rnmapbox/maps";
import { Modalize } from "react-native-modalize";
import { MapService } from "../../../services/MapService";
import * as turf from "@turf/turf";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { color } from "react-native-elements/dist/helpers";

MapboxGL.setAccessToken(
  "pk.eyJ1IjoibGFzYXJpYSIsImEiOiJjbTJheXV0cjcwNG9zMmxwdnlxZWdoMjc5In0.NoBtaBj9cNvdemNp52pxGQ"
);

const CACHE_KEY = "mapDataCache";  // Define a cache key
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const MapScreen = () => {
  const [geojsonData, setGeojsonData] = useState(null);
  const [mapData, setMapData] = useState(null);
  const [selectedLayer, setSelectedLayer] = useState(null); // For tracking the selected polygon
  const [venuesInPolygon, setVenuesInPolygon] = useState([]); // For tracking the venues inside the polygon
  const modalizeRef = useRef(null); // Ref for controlling the modal

  const [currentViewport, setCurrentViewport] = useState({
    latitude: 38.8951,
    longitude: -77.0364,
    zoomLevel: 8,
  });

  useEffect(() => {
    const getMaps = async () => {
      try {
        const cachedData = await AsyncStorage.getItem(CACHE_KEY);
        const cachedTimestamp = await AsyncStorage.getItem(`${CACHE_KEY}_timestamp`);

        const now = Date.now();
        // if (cachedData && cachedTimestamp && now - parseInt(cachedTimestamp) < CACHE_DURATION) {
        //   // If cache is valid, use cached data
        //   console.log("Using cached data");
        //   setMapData(JSON.parse(cachedData));
        // } else {
        //   // Otherwise, fetch new data from server
        //   console.log("Fetching new data");
        //   const data = await MapService.getAllMapData();
        //   setMapData(data);

        //   // Store the data and timestamp in AsyncStorage
        //   await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
        //   await AsyncStorage.setItem(`${CACHE_KEY}_timestamp`, now.toString());
        // }

        // console.log("Fetching new data");
          const data = await MapService.getAllMapData();
          //console.log(data.data);

          //data.data.map((item, index) => {console.log(item.name)});
          setMapData(data);


        // // const data = await MapService.getAllMapData();
        // // setMapData(data)
        

      } catch (error) {
        console.error("Error getting all maps: ", error);
      }
    };

    getMaps();
  }, []);

  //console.log("MAPDATA0: ", mapData?.data[0]);

  


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
    const geojson = {
      type: "FeatureCollection",
      features: venueData.map((venue) => ({
        type: "Feature",
        properties: {
          name: venue.name,
          address: venue.address, // Include address for display in modal
        },
        geometry: {
          type: "Point",
          coordinates: [venue.longitude, venue.latitude],
        },
      })),
    };

    setGeojsonData(geojson); // Set the GeoJSON data to state
  }, []);
  //   const hasLineString = geojsonData.features.some(
 

  const handlePolygonPress = (item) => {
    //console.log("ITEM: ", item);
    const polygons = JSON.parse(item.polygons);

    // Check which venues fall inside the polygon
    const venuesInsidePolygon = venueData.filter((venue) => {
      const point = turf.point([venue.longitude, venue.latitude]);
      return turf.booleanPointInPolygon(point, polygons.features[0]);
    });

    // Set the selected layer name and the venues in the polygon
    setSelectedLayer(item.name);
    setVenuesInPolygon(venuesInsidePolygon);

    // Open the modal to show the data
    modalizeRef.current?.open();
  };

  // Function to open the modal
  const openModal = () => {
    modalizeRef.current?.open();
  };

  const renderMapLayers = () => {
    if (!mapData || !mapData.data) return null;

    return mapData.data.map((item, index) => {
      // Parse the polygons and outline JSON strings
    //   if (item.level == 3) {
    //     //console.log(item.level);
    //     return <></>;
    //   }
      const polygons = JSON.parse(item.polygons);
      const outline = JSON.parse(item.outline);
      console.log(item.boundary_id);

      return (
        <React.Fragment key={index}>
          {/* FillLayer for polygons */}
          <MapboxGL.ShapeSource
            id={`polygon-source-${item.boundary_id}`}
            shape={polygons}
            onPress={() => handlePolygonPress(item)} // Capture the polygon press
          >
            <MapboxGL.FillLayer
              id={`polygon-fill-${item.boundary_id}`}
              minZoomLevel={item.level == 1 ? 0 : item.level == 2 ? 9 : 22}
              maxZoomLevel={item.level == 1 ? 9 : item.level == 2 ? 30 : 40}
                style={{
                    fillColor: "hsla(260, 100%, 40%, 0.26)",
                    fillOpacity: 0.5,
                }}
            />
          </MapboxGL.ShapeSource>

          {/* LineLayer for outline */}
          <MapboxGL.ShapeSource
            id={`outline-source-${item.boundary_id}`}
            shape={outline}
          >
            <MapboxGL.LineLayer
              id={`outline-line-${item.boundary_id}`}
              minZoomLevel={item.level == 1 ? 0 : item.level == 2 ? 9 : 22}
              maxZoomLevel={item.level == 1 ? 9 : item.level == 2 ? 30 : 40}
                style={{
                    lineColor: "#ffe8a3", // Color of the boundary line
                    lineWidth: 3, // Thickness of the boundary line
                }}
            />
          </MapboxGL.ShapeSource>
        </React.Fragment>
      );
    });
  };

  const renderModalContent = () => (
    <View style={styles.modalContent}>
      <Text style={styles.modalHeader}>Upcoming Events</Text>
      {/* Add your event data here */}
      <Text>Throwback Thursday at Kings Theater</Text>
      <Text>Tomorrow at 8 PM</Text>
      {/* More event data */}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <TextInput placeholder="Search" style={styles.searchBar} />
      </View>
      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterTab}>
          <Text style={styles.filterText}>Genre</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterTab}>
          <Text style={styles.filterText}>Cost</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterTab}>
          <Text style={styles.filterText}>Distance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterTab}>
          <Text style={styles.filterText}>Access</Text>
        </TouchableOpacity>
      </View>
      {/* Map */}
      <MapboxGL.MapView
        style={styles.map}
        styleURL="mapbox://styles/lasaria/cm2kucgfu008g01qhd4f9hvhh"
        glyphsRasterizationOptions={{
          glyphsUrl: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
        }}
      >
        <MapboxGL.Camera
          zoomLevel={7}
          centerCoordinate={[-77.0364, 38.8951]} // Washington DC area
        />

        {geojsonData && (
          <MapboxGL.ShapeSource
            id="venueSource"
            shape={geojsonData} // Use the GeoJSON data here
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

            {/* Symbol Layer to show Cluster Count */}
            <MapboxGL.SymbolLayer
              id="clusterCount"
              filter={["has", "point_count"]}
              style={{
                textField: "{point_count}",
                textSize: 12,
                textColor: "#fff",
                textHaloColor: "#000",
                textHaloWidth: 1,
              }}
            />

            {/* Circle Layer for Individual Points */}
            <MapboxGL.CircleLayer
              id="venueCircle"
              filter={["!", ["has", "point_count"]]}
              style={{
                circleColor: "blue",
                circleRadius: 10,
                circleOpacity: 0.5,
              }}
            />

            {/* Symbol Layer for Venue Names */}
            <MapboxGL.SymbolLayer
              id="venueName"
              filter={["!", ["has", "point_count"]]}
              style={{
                textField: ["get", "name"],
                textSize: 12,
                textColor: "#fff",
                textHaloColor: "blue",
                textHaloWidth: 1,
                textOffset: [0, 1.5],
                textAnchor: "top",
              }}
            />
          </MapboxGL.ShapeSource>
        )}

        {/* DMV Boundary Layer - Visible when zoomed out */}
        {renderMapLayers()}
      </MapboxGL.MapView>

      {/* Modal for upcoming events */}
      <Modalize ref={modalizeRef} snapPoint={300}>
        <View style={{ padding: 20 }}>
          <Text style={styles.modalHeader}>
            {selectedLayer ? `Venues in ${selectedLayer}` : "No area selected"}
          </Text>
          {venuesInPolygon && venuesInPolygon.length > 0 ? (
            venuesInPolygon.map((venue, index) => (
              <View key={index} style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  {venue.name}
                </Text>
                <Text style={{ fontSize: 14 }}>{venue.address}</Text>
                <Text style={{ fontSize: 14, color: "gray" }}>
                  Lat: {venue.latitude}, Lon: {venue.longitude}
                </Text>
              </View>
            ))
          ) : (
            <Text>No venues available in this area</Text>
          )}
        </View>
      </Modalize>

      {/* Button to open modal */}
      <TouchableOpacity style={styles.button} onPress={openModal}>
        <Text style={styles.buttonText}>View Upcoming Events</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  searchBarContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40, // Adjust padding for iOS vs Android
    left: 10,
    right: 10,
    zIndex: 10, // Ensure it's above the map
  },
  searchBar: {
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  filterContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 110 : 130,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 10,
  },

  filterTab: {
    backgroundColor: "#333",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  filterText: {
    color: "#fff",
    fontSize: 14,
  },
  button: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalContent: {
    padding: 20,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default MapScreen;
