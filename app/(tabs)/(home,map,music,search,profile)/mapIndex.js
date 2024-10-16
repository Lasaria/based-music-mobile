import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import Style from '../../../style';

// Set the Mapbox access token
MapboxGL.setAccessToken('sk.eyJ1IjoibGFzYXJpYSIsImEiOiJjbTJheXlodWswbnpuMmptd2xvM3VxbGhvIn0.Sgl_rqyoKzpW2UdH7lZHkA');  // Replace with your actual Mapbox Access Token

function MapScreen() {

    // Disable telemetry (optional)
    useEffect(() => {
        MapboxGL.setTelemetryEnabled(false);
    }, []);

    return (
        <View style={Style.container}>
            {/* Render Mapbox map */}
            <MapboxGL.MapView style={styles.map}>
                <MapboxGL.Camera
                    zoomLevel={10}
                    centerCoordinate={[-73.970895, 40.723279]} // Example: New York City coordinates
                />
                {/* Add more Mapbox components, such as markers, later */}
            </MapboxGL.MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
});

export default MapScreen;
