import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Color';

const EditPreview = ({ onNavigate, avatarUri, name }) => {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => onNavigate('MainPreview')}
                >
                    <View style={styles.circleButton}>
                        <Ionicons name="chevron-back" size={24} color="white" />
                    </View>
                </TouchableOpacity>

                <Image
                    source={require('../../assets/images/Group.png')}
                    style={styles.logo}
                />

                <Text style={styles.headerTitle}>Viewing Preview</Text>
            </View>

            {/* Main Content */}
            <View style={styles.mainContent}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: avatarUri }}
                        style={styles.profileImage}
                    />

                    {/* Profile Info Overlay */}
                    <View style={styles.infoOverlay}>
                        <Text style={styles.nameText}>{name}, 34</Text>
                        <View style={styles.locationContainer}>
                            <Ionicons name="location-outline" size={16} color="#fff" />
                            <Text style={styles.distanceText}>7 miles away</Text>
                        </View>

                        {/* Tags */}
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
                {/* Bottom Action Buttons */}
                <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity style={styles.actionButton}>
                        <View style={[styles.circle, styles.redCircle]}>
                            <Ionicons name="close" size={32} color="#FF2C2C" />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <View style={[styles.circle, styles.greenCircle]}>
                            <Ionicons name="heart-outline" size={32} color="#44FF2C" />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 20,
        marginTop: 50,
    },
    circleButton: {
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
        tintColor: 'white',
        marginLeft: 32,
    },
    headerTitle: {
        color: 'white',
        fontSize: 10,
        fontWeight: '500',
    },
    mainContent: {
        flex: 1,
        paddingHorizontal: 16,
    },
    imageContainer: {
        width: 343,
        height: '70%',
        marginBottom: 24,
        marginHorizontal: 'auto'
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 24,
    },
    infoOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingBottom: 30,
        background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))',
    },
    nameText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    distanceText: {
        color: 'white',
        fontSize: 14,
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
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20,
        paddingHorizontal: 40,
        marginTop: 36,
    },
    circle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    redCircle: {
        borderWidth: 2,
        borderColor: '#FF2C2C',
    },
    greenCircle: {
        borderWidth: 2,
        borderColor: '#44FF2C',
    },
});

export default EditPreview;