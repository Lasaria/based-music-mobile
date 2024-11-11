import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Platform,
  FlatList,
  Image,
  Animated,
  ScrollView,
  PanResponder,
  Button,
} from "react-native";
import MapboxGL from "@rnmapbox/maps";
import { Modalize } from "react-native-modalize";
import { MapService } from "../../../services/MapService";
import * as turf from "@turf/turf";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { color } from "react-native-elements/dist/helpers";
import { Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

MapboxGL.setAccessToken(
    "pk.eyJ1IjoibGFzYXJpYSIsImEiOiJjbTJheXV0cjcwNG9zMmxwdnlxZWdoMjc5In0.NoBtaBj9cNvdemNp52pxGQ"
);

const CACHE_KEY = "mapDataCache"; // Define a cache key
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const screenHeight = Dimensions.get("window").height;

const MapScreen = () => {
  const [geojsonData, setGeojsonData] = useState(null);
  const [mapData, setMapData] = useState(null);
  const [selectedLayer, setSelectedLayer] = useState(null); // For tracking the selected polygon
  const [venuesInPolygon, setVenuesInPolygon] = useState([]); // For tracking the venues inside the polygon
  const [isCostModalVisible, setIsCostModalVisible] = useState(false); // For controlling cost modal visibility
  const [activeButton, setActiveButton] = useState({}); // For tracking active buttons
  const modalizeRef = useRef(null); // Ref for controlling the modal
  const animatedHeight = useRef(new Animated.Value(300)).current; // Initial height for scrollable list

  const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
          // Only start panResponder if gesture starts at the top bar of the scrollable list
          return gestureState.y0 < 40;
        },
        onPanResponderMove: (e, gestureState) => {
          // Update height based on the gesture movement
          const newHeight = screenHeight - gestureState.moveY;
          animatedHeight.setValue(newHeight);
        },
        onPanResponderRelease: (e, gestureState) => {
          // Snap to closest position based on the release velocity and dy
          const newHeight = gestureState.dy > 0 ? 300 : 650;
          Animated.spring(animatedHeight, {
            toValue: newHeight,
            useNativeDriver: false,
          }).start();
        },
      })
  ).current;

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
        if (cachedData && cachedTimestamp && now - parseInt(cachedTimestamp) < CACHE_DURATION) {
          // If cache is valid, use cached data
          console.log("Using cached data");
          setMapData(JSON.parse(cachedData));
        } else {
          // Otherwise, fetch new data from server
          console.log("Fetching new data");
          const data = await MapService.getAllMapData();
          setMapData(data);

          // Store the data and timestamp in AsyncStorage
          await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
          await AsyncStorage.setItem(`${CACHE_KEY}_timestamp`, now.toString());
        }
      } catch (error) {
        console.error("Error getting all maps: ", error);
      }
    };

    getMaps();
  }, []);

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

  const handlePolygonPress = (item) => {
    console.log("ITEM: ", item);
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

  const toggleCostModal = () => {
    setIsCostModalVisible((prev) => !prev);
  };

  const toggleButtonColor = (buttonName) => {
    setActiveButton((prev) => ({
      ...prev,
      [buttonName]: !prev[buttonName]
    }));
  };

  const renderMapLayers = () => {
    if (!mapData || !mapData.data) return null;

    return mapData.data.map((item, index) => {
      // Parse the polygons and outline JSON strings
      const polygons = JSON.parse(item.polygons);
      const outline = JSON.parse(item.outline);

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
                  minZoomLevel={item.level == 1 ? 0 : 9} // Visible from the lowest zoom level
                  maxZoomLevel={item.level == 1 ? 9 : 22} // Hidden at zoom level 10 and above
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
                  minZoomLevel={item.level == 1 ? 0 : 9}
                  maxZoomLevel={item.level == 1 ? 9 : 22}
                  style={{
                    lineColor: "purple", // Color of the boundary line
                    lineWidth: 3, // Thickness of the boundary line
                  }}
              />
            </MapboxGL.ShapeSource>
          </React.Fragment>
      );
    });
  };

  const renderEvent = ({ item }) => (
      <TouchableOpacity style={styles.eventCard} onPress={() => alert(`Navigating to details of ${item.name}`)}>
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle}>{item.name}</Text>
          <Text style={styles.eventAddress}>{item.address}</Text>
        </View>
      </TouchableOpacity>
  );

  return (
      <View style={{ flex: 1 }}>
        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={22} color="white"/>
            <TextInput placeholder="Search" placeholderTextColor="gray" style={{ flex: 1, color: "white", marginLeft: "4%", fontSize: 15 }} />
          </View>
        </View>
        {/* Filter Tabs */}
        <View style={{ width: '100%', height: "1%" }}>
          <ScrollView
              horizontal
              style={[styles.filterContainer, { top: Platform.OS === "ios" ? 90 : 140, paddingLeft: 0 }]}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ alignItems: "flex-start" }} // 将 alignItems 放在这里
          >
            <TouchableOpacity style={[styles.buttonStyle, activeButton['Genre'] && styles.activeButton]} onPress={() => toggleButtonColor('Genre')}>
              <Text style={styles.buttonText}>Genre</Text>
              <Ionicons name="chevron-down" size={22} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttonStyle, activeButton['Cost'] && styles.activeButton]} onPress={() => { toggleButtonColor('Cost'); toggleCostModal(); }}>
              <Text style={styles.buttonText}>Cost</Text>
              <Ionicons name="chevron-down" size={22} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttonStyle, activeButton['Distance'] && styles.activeButton]} onPress={() => toggleButtonColor('Distance')}>
              <Text style={styles.buttonText}>Distance</Text>
              <Ionicons name="chevron-down" size={22} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttonStyle, activeButton['Access'] && styles.activeButton]} onPress={() => toggleButtonColor('Access')}>
              <Text style={styles.buttonText}>Access</Text>
              <Ionicons name="chevron-down" size={22} color="white" />
            </TouchableOpacity>
          </ScrollView>
        </View>
        {/* Cost Modal */}
        {isCostModalVisible && (
            <View style={styles.costModal}>
              <View style={styles.dragHandle} />
              <Text style={styles.modalTitle}>Cost</Text>
              <View style={styles.modalContent}>
                <TouchableOpacity style={styles.modalButton}><Text style={styles.modalButtonText}>Free</Text></TouchableOpacity>
                <TouchableOpacity style={styles.modalButton}><Text style={styles.modalButtonText}>$</Text></TouchableOpacity>
                <TouchableOpacity style={styles.modalButton}><Text style={styles.modalButtonText}>$$</Text></TouchableOpacity>
                <TouchableOpacity style={styles.modalButton}><Text style={styles.modalButtonText}>$$$</Text></TouchableOpacity>
                <View style={styles.modalRangeInputContainer}>
                  <View style={styles.modalRangeInput}><Text style={styles.modalRangeText}>Min</Text></View>
                  <Text style={styles.connect}>-</Text>
                  <View style={styles.modalRangeInput}><Text style={styles.modalRangeText}>Max</Text></View>
                </View>
              </View>
            </View>
        )}
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

        {/* Scrollable Event List */}
        <Animated.View
            style={[
              styles.scrollableList,
              { height: animatedHeight },
            ]}
        >
          <View
              style={styles.dragHandle}
              {...panResponder.panHandlers}
          >
            <Text style={styles.dragHandleText}>Drag Here</Text>
          </View>
          <View style={styles.eventListHeader}>
            <Text style={styles.eventListTitle}>Upcoming Events</Text>
          </View>
          <ScrollView>
            <Text style={styles.eventToday}>Today</Text>
            {venueData.map((venue, index) => (
                <View key={index} style={styles.eventCard}>
                  <Ionicons name="bookmark-outline" size={24} color="white" style={styles.bookmarkIcon} />
                  <View style={styles.eventImagePlaceholder}>
                    <Text style={styles.eventPlaceholderText}>Image</Text>
                  </View>
                  <View style={styles.eventDetails}>
                    <Text style={styles.eventTitle}>{venue.name}</Text>
                    <Text style={styles.eventAddress}>{venue.address}</Text>
                    <View style={styles.cardBottomRow}>
                      <View style={styles.profileImagesContainer}>
                        <View style={styles.profileImagePlaceholder} />
                        <View style={styles.profileImagePlaceholder} />
                        <View style={styles.profileImagePlaceholder} />
                      </View>
                      <TouchableOpacity style={styles.learnMoreButton}>
                        <Text style={styles.learnMoreText}>Learn More</Text>
                      </TouchableOpacity>
                    </View>

                  </View>
                </View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Added Map Icons */}
        <TouchableOpacity  style={[styles.settingIcon, { left: "85%", top: "18%" }]}>
          <Ionicons name="settings-outline" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.arrowIcon, { left: "85%", top: "25%" }]}>
          <Ionicons name="navigate" size={24} color="white" />
        </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  searchBarContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40, // Adjust padding for iOS vs Android
    left: 10,
    right: 10,
    zIndex: 10, // Ensure it's above the map

  },

  filterContainer: {
    marginTop: -30,
    flexDirection: "row",
    zIndex: 1,
    marginHorizontal: 10,
  },
  searchBar: {
    // Search container styling
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 0,
    paddingLeft: "5%",
    // Position and size styling
    width: "100%",
    height: 63,
    backgroundColor: "#000000",
    borderRadius: 15,
    borderWidth: 1.4,
    borderColor: "#FFFFFF", // Add white border
    paddingHorizontal: 10,

  },
  buttonStyle: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    alignContent: "flex-start",
    padding: 5,
    gap: 4,
    width: 110,
    height: 32,
    backgroundColor: "#000000",
    borderWidth: 1.4,
    borderColor: "#FFFFFF",
    borderRadius: 10,
    flexGrow: 0,
    marginRight: 6,
    justifyContent: "space-between",
  },
  activeButton: {
    backgroundColor: "#6A0DAD",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 12,
    textAlign: "center",
  },
  downArrowIconImage: {
    width: 14,
    height: 8,
    resizeMode: "contain",
  },
  scrollableList: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#121212",
    paddingTop: 20,

  },
  dragHandle: {
    width: "40%",
    height: 5,
    borderRadius: 5,
    backgroundColor: "#444",
    alignSelf: "center",
    marginVertical: 10,
  },

  dragHandleText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  eventListHeader: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  eventListTitle: {
    fontSize: 29,
    fontWeight: "bold",
    color: "#fff",
  },
  eventToday: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#fff",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  eventCard: {
    flexDirection: "row",
    padding: 50,
    marginHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#000000",
    borderRadius: 15, // Updated border radius for a more rounded appearance
    borderWidth: 1.4,
    borderColor: "#FFFFFF", // White border for cards
  },
  eventImagePlaceholder: {
    width: 110,
    height: 110, // Updated size for larger image placeholder
    backgroundColor: "#444",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 35,
    marginRight: 15,
    marginLeft: -30, // Shift the image to the left by adding negative margin
    marginTop: -20, // Adjusts the top margin, increasing the value moves it down
    marginBottom: 0, // Adjusts the bottom margin, increasing the value moves it up
  },

  eventPlaceholderText: {
    color: "#fff",
    fontSize: 12,
  },
  eventDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  eventTitle: {
    fontSize: 22, // Updated size for a larger title
    color: "#fff",
    fontWeight: "bold",
  },
  eventAddress: {
    fontSize: 16,
    color: "#bbb",
  },
  learnMoreButton: {
    backgroundColor: "#6A0DAD",
    borderRadius: 5,
    paddingVertical: 7,
    paddingHorizontal: 25, // Updated padding for a larger button
    alignSelf: "flex-start",
    marginLeft: 10,
    marginTop: 15,
  },

  learnMoreText: {
    color: "#fff",
    fontSize: 16, // Updated size for larger button text
  },
  bookmarkIcon: {
    position: "absolute",
    top: "30%",
    right: "5%",
  },
  cardBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  profileImagesContainer: {
    flexDirection: "row",
  },
  profileImagePlaceholder: {
    width: 35, // Placeholder for profile images without using PNG
    height: 35, // Placeholder for profile images without using PNG
    borderRadius: 17.5, // Adjusted for placeholder appearance
    backgroundColor: "#888",
    marginLeft: -10,
    marginTop: 15,
    zIndex: 1,
  },

  mapIcon: {
    position: "absolute",
    backgroundColor: "transparent",
  },
  settingIcon: {
    position: "absolute",
    width: 45,
    height: 45,
    backgroundColor: "#000000", // Solid black background
    borderRadius: 19, // Rounded corners for a square button
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.4, // Add white border
    borderColor: "#FFFFFF",
  },
  settingIconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  arrowIcon: {
    position: "absolute",
    width: 45,
    height: 45,
    backgroundColor: "#000000", // Solid black background
    borderRadius: 19, // Rounded corners for a square button
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.4, // Add white border
    borderColor: "#FFFFFF",
  },

  iconImage: {
    width: 70,
    height: 70,
  },
  costModal: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 20,
    zIndex: 10,
    height: '44%',
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 27,
    marginBottom: 20,
    marginLeft: 10,
    fontFamily: "Inter"
  },
  modalContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 10,
  },
  modalButton: {
    backgroundColor: "#000",
    paddingVertical: 9,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalButtonSelected: {
    backgroundColor: "#6A0DAD",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalRangeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    marginLeft: -10,
  },
  connect: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Inter"
  },
  modalRangeInput: {
    width: 110,
    height: 60,
    backgroundColor: "#ddd",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },

  modalRangeText: {
    color: "#000",
    fontSize: 16,
  },
});

export default MapScreen;
