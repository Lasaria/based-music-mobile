import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Color';

const About = ({ userType = 'Listener', dateJoined = 'October 8, 2024', location = 'DMV Area' }) => {
    return (
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>User</Text>
                    <Text style={styles.value}>{userType}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Date Joined</Text>
                    <Text style={styles.value}>{dateJoined}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Location</Text>
                    <Text style={styles.value}>{location}</Text>
                </View>
            </View>
        </View>
    );
};

export default About;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    infoContainer: {
        backgroundColor: '#1C1C1E',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 24,
        marginVertical: 30,
        width: '100%',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    label: {
        color: Colors.white,
        fontFamily: "Open Sans",
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 14,
        opacity: 0.5
    },
    value: {
        color: Colors.white,
        fontFamily: "Open Sans",
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 14,
    },
});