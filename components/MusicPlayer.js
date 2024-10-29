import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../constants/Color';

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
        backgroundColor: '#A95C68',
        borderRadius: 10,
        padding: 10,
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
        color: Colors.white,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    artistName: {
        color: Colors.white,
        fontFamily: 'Open Sans',
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: '400',
        opacity: 0.7
    },
    playButton: {
        marginLeft: 'auto',
        padding: 6,
    },
});

export default MusicPlayer;