import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Animated } from 'react-native';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { Colors } from '../../constants/Color';

const Dashboard = () => {
    // DASHBOARD STATES
    const [open, setOpen] = useState(false);
    const [selectedStat, setSelectedStat] = useState('Followers');
    const [selectedMostListened, setSelectedMostListened] = useState('Artist');
    const [selectedRange, setSelectedRange] = useState('Last 30 days');
    const [items] = useState([
        { label: 'Last week', value: 'Last week' },
        { label: 'Last 30 days', value: 'Last 30 days' },
        { label: 'Last 90 days', value: 'Last 90 days' },
    ]);

    // ANIMATION STATES
    const animation = useState(new Animated.Value(0))[0];

    // DROPDOWN FUNCTIONALITY FOR DROPDOWN PICKER
    const toggleDropdown = () => {
        Animated.timing(animation, {
            toValue: open ? 0 : 1,
            duration: 300,
            useNativeDriver: false,
        }).start(() => {
            setOpen(!open);
        });
    };

    // SELECT THE OPTIPN FROM DROPDOWN PICKER
    const handleSelect = (value) => {
        setSelectedRange(value);
        toggleDropdown();
    };

    // ANIMATION FOR ADJUST THE DROPDOWN PICKER HEIGHT
    const dropdownHeight = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, items.length * 40],
    });

    // STATS DUMMY DATA
    const stats = [
        { id: 1, title: 'Followers', value: '300' },
        { id: 2, title: 'Following', value: '130' },
        { id: 3, title: 'Events Attended', value: '14' },
    ];
    // RANKINGS DUMMY DATA
    const mostListened = [
        { id: 1, title: 'Artist', value: 'Jesse Juice' },
        { id: 2, title: 'Song', value: 'Clueless' },
        { id: 3, title: 'Genre', value: 'Jazz' },
    ];
    // CHART DUMMY DATA
    const chartData = {
        "Last week": {
            datasets: [{ data: [500, 2000, 1500, 3500, 2500, 3000, 5000] }],
        },
        "Last 30 days": {
            datasets: [{ data: [100, 150, 2000, 1200, 1307, 2211, 2400] }],
        },
        "Last 90 days": {
            datasets: [{ data: [1800, 1200, 1801, 4500, 2000, 4999] }],
        },
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* CUSTOM DROPDOWN PICKER */}
            <View style={styles.dropdownContainer}>
                <TouchableOpacity style={styles.dropdown} onPress={toggleDropdown}>
                    <Text style={styles.selectedText}>{selectedRange || "Select time range"}</Text>
                    {open ? (
                        <AntDesign name="up" size={16} color="white" />
                    ) : (
                        <AntDesign name="down" size={16} color="white" />
                    )}
                </TouchableOpacity>
                {open && (
                    <Animated.View style={[styles.dropdownList, { height: dropdownHeight }]}>
                        {items.map((item, index) => (
                            <TouchableOpacity
                                key={item.value}
                                style={styles.item}
                                onPress={() => handleSelect(item.value)}
                            >
                                <Text style={styles.itemText}>{item.label}</Text>
                                {selectedRange === item.value && (
                                    <Entypo name="check" size={16} color={Colors.themeColor} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </Animated.View>
                )}
            </View>

            {/* STATS SECTION */}
            <Text style={styles.sectionTitle}>Statistics</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {stats.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.card, selectedStat === item.title && styles.activeCard]}
                        onPress={() => setSelectedStat(item.title)}
                    >
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <Text style={styles.cardValue}>{item.value}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* LINE CHART */}
            <View style={styles.chartContainer}>
                <Text style={{ fontSize: 30, fontWeight: '900', textAlign: 'center', color: Colors.white, marginVertical: 20, }}>LINE CHART</Text>
            </View>

            {/* MOST LISTENED SECTION */}
            <Text style={styles.sectionTitle}>Most Listened</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {mostListened.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.card, selectedMostListened === item.title && styles.activeCard]}
                        onPress={() => setSelectedMostListened(item.title)}
                    >
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <Text style={styles.cardValue}>{item.value}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </ScrollView>
    );
};

export default Dashboard;

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    dropdownContainer: {
        marginBottom: 20,
        zIndex: 1,
    },
    dropdown: {
        display: 'flex',
        width: 364,
        padding: 18,
        borderRadius: 14,
        margin: 'auto',
        backgroundColor: '#232323',
        gap: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectedText: {
        color: 'white',
    },
    dropdownList: {
        backgroundColor: '#25272D',
        overflow: 'hidden',
        borderRadius: 8,
        marginTop: 5,
        marginHorizontal: 12,
    },
    item: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemText: {
        color: 'white',
    },
    sectionTitle: {
        color: Colors.white,
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 10,
    },
    card: {
        backgroundColor: '#232323',
        width: 131,
        height: 95,
        padding: 8,
        alignItems: 'flex-start',
        borderRadius: 5,
        marginHorizontal: 5,
    },
    activeCard: {
        backgroundColor: Colors.themeColor,
    },
    cardTitle: {
        color: Colors.white,
        fontFamily: "Open Sans",
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: '400',
        lineWeight: 22,
    },
    cardValue: {
        color: Colors.white,
        fontFamily: "Open Sans",
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '600',
        lineWeight: 22,
    },
    chart: {
        marginVertical: 20,
        borderRadius: 10,
    },
});