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
import MultiSelect from "react-native-multiple-select";

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
  const [isGenreModalVisible, setIsGenreModalVisible] = useState(false); // For controlling genre modal visibility
  const [activeButton, setActiveButton] = useState({}); // For tracking active buttons
  const [selectedGenres, setSelectedGenres] = useState([]); // For tracking selected genres
  const modalizeRef = useRef(null); // Ref for controlling the modal
  const animatedHeight = useRef(new Animated.Value(300)).current; // Initial height for scrollable list
  const costModalHeight = useRef(new Animated.Value(380)).current; // Initial height for cost modal
  const genreModalHeight = useRef(new Animated.Value(380)).current; // Separate height for genre modal


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
          const newHeight = gestureState.dy > 0 ? 300 : 680;
          Animated.spring(animatedHeight, {
            toValue: newHeight,
            useNativeDriver: false,
          }).start();
        },
      })
  ).current;

  const costModalPanResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (e, gestureState) => {
          if (gestureState.dy > 0) {
            costModalHeight.setValue(380 - gestureState.dy);
          }
        },
        onPanResponderRelease: (e, gestureState) => {
          if (gestureState.dy > 100) {
            setIsCostModalVisible(false);
          } else {
            Animated.spring(costModalHeight, {
              toValue: 380,
              useNativeDriver: false,
            }).start();
          }
        },
      })
  ).current;

  const genreModalPanResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (e, gestureState) => {
          if (gestureState.dy > 0) {
            genreModalHeight.setValue(380 - gestureState.dy);
          }
        },
        onPanResponderRelease: (e, gestureState) => {
          if (gestureState.dy > 100) {
            setIsGenreModalVisible(false);
          } else {
            Animated.spring(genreModalHeight, {
              toValue: 380,
              useNativeDriver: false,
            }).start();
          }
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
    { name: "Ultra Bar DC", latitude: 38.8963, longitude: -77.0241, address: "111 K St NW, Washington, DC 20001", status: "Ongoing", distance: "26 mi" },
    { name: "Decades DC", latitude: 38.9066, longitude: -77.0426, address: "1219 Connecticut Ave NW, Washington, DC 20036", status: "Closed", distance: "20 mi" },
    {
      name: "Bravo Bravo",
      latitude: 38.9031,
      longitude: -77.0405,
      address: "1001 Connecticut Ave NW, Washington, DC 20036",
      status: "Ongoing",
      distance: "15 mi"
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
    if (!activeButton['Cost']) {
      setIsCostModalVisible((prev) => !prev);
      costModalHeight.setValue(380); // Reset to full height whenever opening the modal
    }
  };

  const toggleGenreModal = () => {
    if (!activeButton['Genre']) {
      setIsGenreModalVisible((prev) => !prev);
      genreModalHeight.setValue(380); // Reset to full height whenever opening the modal
    }
  };

  const toggleButtonColor = (buttonName) => {
    setActiveButton((prev) => ({
      ...prev,
      [buttonName]: !prev[buttonName]
    }));

    if (buttonName === 'Cost' && activeButton['Cost']) {
      setIsCostModalVisible(false);
    }
    if (buttonName === 'Genre' && activeButton['Genre']) {
      setIsGenreModalVisible(false);
    }
  };

  const handleGenreSelect = (genres) => {
    setSelectedGenres(genres);
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
        {/* Overlay Drag Handle */}
        <View style={styles.overlayDragHandle} />
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
            <TouchableOpacity style={[styles.buttonStyle, activeButton['Genre'] && styles.activeButton]} onPress={() => { toggleButtonColor('Genre'); toggleGenreModal(); }}>
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
            <Animated.View style={[styles.costModal, { height: costModalHeight }]} {...costModalPanResponder.panHandlers}>
              <View style={styles.dragHandleInPopUp} />
              <Text style={styles.modalTitle}>Cost</Text>
              <View style={styles.modalContent}>
                <TouchableOpacity style={styles.modalButton}><Text style={styles.modalButtonText}>Free</Text></TouchableOpacity>
                <TouchableOpacity style={styles.modalButton}><Text style={styles.modalButtonText}>$</Text></TouchableOpacity>
                <TouchableOpacity style={styles.modalButton}><Text style={styles.modalButtonText}>$$</Text></TouchableOpacity>
                <TouchableOpacity style={styles.modalButton}><Text style={styles.modalButtonText}>$$$</Text></TouchableOpacity>
                <View style={styles.modalRangeInputContainer}>
                  <TextInput style={styles.modalRangeInputBox} placeholder="Min" placeholderTextColor="#000" />
                  <Text style={styles.connect}>-</Text>
                  <TextInput style={styles.modalRangeInputBox} placeholder="Max" placeholderTextColor="#000" />
                </View>
              </View>
            </Animated.View>
        )}
        {/* Genre Modal */}
        {isGenreModalVisible && (
            <Animated.View style={[styles.genreModal, { height: genreModalHeight }]} {...genreModalPanResponder.panHandlers}>
              <View style={styles.dragHandleInPopUp} />
              <Text style={styles.genreModalTitle}>Music Genre</Text>
              <View style={styles.genreModalContent}>
                <Text style={styles.modalGenreText}>Genre</Text>
                <ScrollView style={{ width: "100%" }}>
                  <MultiSelect
                      items={[
                        { id: "Pop", name: "Pop" },
                        { id: "RnB", name: "RnB" },
                        { id: "Hip Hop", name: "Hip Hop" },
                        { id: "Jazz", name: "Jazz" },
                      ]}
                      uniqueKey="id"
                      onSelectedItemsChange={(genres) => {
                        console.log("Selected Genres: ", genres);
                        handleGenreSelect(genres);
                      }}
                      selectedItems={selectedGenres}
                      selectText="Select Genre"
                      searchInputPlaceholderText="Search Genre"
                      tagRemoveIconColor="#6A0DAD"
                      tagBorderColor="#6A0DAD"
                      tagTextColor="#6A0DAD"
                      selectedItemTextColor="#6A0DAD"
                      selectedItemIconColor="#6A0DAD"
                      itemTextColor="#000"
                      displayKey="name"
                      searchInputStyle={{ color: "#000" }}
                      submitButtonColor="#6A0DAD"
                      submitButtonText="Submit"
                      hideTags={true}
                      hideSubmitButton = {true}
                      hideDropdown = {true}
                      styleTextDropdown={{ fontWeight: 'bold',fontSize:15 }}
                      styleDropdownMenu={styles.styleDropdownMenu}
                      styleInputGroup={styles.styleDropdownMenu}
                      // styleIndicator={{ display: 'none' }}
                      styleListContainer={{
                        width: '100%',
                        alignSelf: 'center',
                      }}
                      styleItemsContainer={{
                        width: '95%',
                        marginLeft: 0,
                      }}
                      styleMainWrapper={{
                        width: '100%',
                        paddingHorizontal: 0,
                      }}
                      styleDropdownMenuSubsection={{
                        paddingLeft: 20,
                        borderRadius: 10,
                      }}
                  />
                  {/*<Ionicons name="chevron-down" size={22} color="black" style={{ position: 'absolute', marginLeft:"85%", marginTop:"8%"}} />*/}
                </ScrollView>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 20 }}>
                  {selectedGenres.map((genre, index) => (
                      <TouchableOpacity key={index} style={[styles.genreModalButton]} onPress={() => handleGenreSelect(selectedGenres.filter(g => g !== genre))}>
                        <Text style={styles.genreModalButtonText}>{genre}</Text>
                        <Ionicons name="close" size={24} color="white" style={{ marginLeft: 5 }} />
                      </TouchableOpacity>
                  ))}
                </View>
              </View>
            </Animated.View>
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
              { height: animatedHeight, zIndex: 25 },
            ]}
        >

          <View
              style={styles.dragHandle}
              {...panResponder.panHandlers}
          >
          </View>
          <View style={[styles.dragHandleDecorator, { zIndex: 20 }]} />
          <View style={styles.eventListHeader}>
            <Text style={styles.eventListTitle}>Upcoming Events</Text>
            <View style={styles.iconsRow}>
              <Ionicons name="calendar" size={24} color="white" style={styles.iconStyle} />
              <Ionicons name="bookmark" size={24} color="white" style={styles.iconStyle} />
            </View>
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
                    <Text style={styles.eventStatus}>{venue.status}</Text>
                    <Text style={[styles.eventDistance, { textAlign: 'right', alignSelf: 'flex-end' }]}>{venue.distance}</Text>
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
  overlayDragHandle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 35,
    backgroundColor: "#2e313b",
    borderRadius: 3,
    zIndex: 30,
  },
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
    backgroundColor: "#1c1c1c",
    paddingTop: 0,
  },
  dragHandle: {
    width: "100%",
    height: 35,
    borderRadius: 5,
    backgroundColor: "#1c1c1c",
    alignSelf: "center",
    marginVertical: 10,
  },
  dragHandleDecorator: {
    height: 6,
    width: "40%",
    backgroundColor: "#2e313b",
    borderRadius: 3,
    alignSelf: "center",
    marginVertical: 0,
    marginBottom: 1,
    marginTop: -20,
    zIndex: 20,
  },
  dragHandleInPopUp: {
    height: 6,
    width: "45%",
    backgroundColor: "#2e313b",
    borderRadius: 3,
    alignSelf: "center",
    marginVertical: 0,
    marginBottom: 1,
    marginTop: 15,
    zIndex: 20,
  },
  eventListHeader: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    padding: 45,
    marginHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#000000",
    borderRadius: 15, // Updated border radius for a more rounded appearance
    borderWidth: 1.4,
    borderColor: "#FFFFFF", // White border for cards
    width: "95%",
    height: 180,
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
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
    marginTop: -20,
  },
  eventAddress: {
    fontSize: 12,
    color: "white",
  },
  eventStatus: {
    fontSize: 12,
    color: "#52980f",
  },
  eventDistance: {
    fontSize: 12,
    color: "#818695",
    marginRight: -20,
  },
  learnMoreButton: {
    backgroundColor: "#6e2cfd",
    borderRadius: 5,
    paddingVertical: 7,
    paddingHorizontal: 25, // Updated padding for a larger button
    alignSelf: "flex-start",
    marginLeft: 20,
    marginTop: 0,
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
    marginTop: -20,
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
    marginTop: 15,
    zIndex: 0,
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
    marginTop: 15,
    zIndex: 0,
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
    zIndex: 30,
    height: 380,
    width: "100%",
  },
  genreModal: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 20,
    zIndex: 30,
    height: 380,
    width: "100%",
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 27,
    marginBottom: 20,
    marginLeft: 10,
    fontFamily: "Inter"
  },
  genreModalTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 27,
    marginBottom: 5,
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
  genreModalContent: {
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginLeft: 20,
    width: "100%",
  },
  styleDropdownMenu: {
    height: 60,
    width: "95%",
    borderColor: "#949494",
    borderWidth: 1.5,
    marginTop: 10,
    borderRadius: 15,
  },
  // styleInputGroup:{
  //   height: 50,
  //   width: 350,
  //   borderColor: "#212121",
  //   borderWidth: 1,
  //   borderRadius: 10
  // },
  selectItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20
  },
  modalButton: {
    backgroundColor: "#000",
    paddingVertical: 9,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 10,
  },
  genreModalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#6e2cfd",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 13,
    marginBottom: 20,
    marginRight: 10,
    marginTop: -10,
  },
  modalButtonSelected: {
    backgroundColor: "#6e2cfd",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  genreModalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalGenreText: {
    color: "#131313",
    fontSize: 16,
    fontFamily: "Inter",
    fontWeight: "bold",
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
  modalRangeInputBox: {
    width: 110,
    height: 60,
    backgroundColor: "#ddd",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    paddingHorizontal: 39,
    color: "#000",
    fontSize: 16,
  },
  iconsRow: {
    flexDirection: "row",
  },
  iconStyle: {
    marginLeft: 15,
  },
  pickerStyle: {
    height: 50,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
  },
});

export default MapScreen;
