import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Color';

const PhotoMainView = ({ onNavigate, avatarUri, name, onCancel }) => {
    return (
        <View style={styles.container}>
            {/* Header with adjusted spacing */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerButton} onPress={onCancel}>
                    <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>
                <Image
                    source={require('../../assets/images/Group.png')}
                    style={styles.logo}
                />
                <TouchableOpacity onPress={() => onNavigate('EditPreview')}>
                    <Ionicons name="eye-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Profile Image */}
            <View style={styles.profileImageContainer}>
                <Image
                    source={{ uri: avatarUri }}
                    style={styles.profileImage}
                />

                {/* Info Overlay */}
                <View style={styles.overlay}>
                    <Text style={styles.nameText}>{name}, 34</Text>
                    <View style={styles.locationContainer}>
                        <Ionicons name="location-outline" size={16} color="#ccc" />
                        <Text style={styles.distanceText}>7 miles away</Text>
                    </View>

                    <View style={styles.tagsContainer}>
                        <View style={styles.tagRow}>
                            <Text style={[styles.tag, styles.primaryTag]}>Big bad Event</Text>
                            <Text style={styles.tag}>Non-drinker</Text>
                            <Text style={styles.tag}>Likes Pop music</Text>
                        </View>
                        <View style={styles.tagRow}>
                            <Text style={styles.tag}>+2</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Action Buttons */}
            <TouchableOpacity style={styles.actionButton} onPress={() => onNavigate('GridPhotos')}>
                <Text style={styles.buttonText}>Edit Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.buttonText}>Edit Interests</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingTop: Platform.OS === 'ios' ? 50 : 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
        tintColor: 'white'
    },
    profileImageContainer: {
        width: 343,
        height: '60%',
        marginBottom: 24,
        marginHorizontal: 'auto'
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 24,
    },
    overlay: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
    },
    nameText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    distanceText: {
        fontSize: 14,
        color: '#ccc',
        marginLeft: 4,
    },
    tagsContainer: {
        width: '100%',
    },
    tagRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 8,
        width: 140,
    },
    tag: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginRight: 8,
        color: Colors.white,
        fontSize: 10,
    },
    primaryTag: {
        backgroundColor: '#FFD074',
        color: Colors.black,
        fontWeight: '600',
    },
    actionButton: {
        backgroundColor: Colors.primary,
        marginHorizontal: 'auto',
        marginTop: 18,
        height: 49,
        width: 343,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default PhotoMainView;