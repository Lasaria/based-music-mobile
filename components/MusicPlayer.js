import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const MusicPlayer = () => {
    return (
        <View style={styles.container}>
            {/* Album Cover */}
            <Image
                source={{ uri: 'https://i.scdn.co/image/ab67616d0000b273aad3f4b601ae8763b3fc4e88' }}
                style={styles.albumCover}
            />

            {/* Song Details */}
            <View style={styles.songDetails}>
                <Text style={styles.songTitle} numberOfLines={1}>
                    Millionaire
                </Text>
                <Text style={styles.artistName}>Yo Yo Honey Singh</Text>
            </View>

            {/* Play Button */}
            <TouchableOpacity style={styles.playButton}>
                <MaterialIcons name="play-arrow" size={28} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E', // Dark background
        borderRadius: 10,
        padding: 10,
        // marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    albumCover: {
        width: 40,
        height: 40,
        borderRadius: 6,
    },
    songDetails: {
        flex: 1,
        marginLeft: 12,
    },
    songTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    artistName: {
        color: '#A9A9A9', // Lighter gray for artist name
        fontSize: 14,
    },
    playButton: {
        marginLeft: 'auto',
        padding: 6,
    },
});

export default MusicPlayer;
