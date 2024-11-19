import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';


const FilterScreen = ({ onClose }) => {
    const [gender, setGender] = useState('Man');
    const [ageRange, setAgeRange] = useState([21, 35]);
    const [distance, setDistance] = useState(15);
    const [smoke, setSmoke] = useState('Non-smoker');
    const [drink, setDrink] = useState('Non-drinker');
    const [children, setChildren] = useState(0);
    const [outing, setOuting] = useState('Day time');

    return (
        <View style={styles.filterContainer}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Filter</Text>
            </View>

            <ScrollView style={styles.filterContent}>
                {/* Gender Filter */}
                <Text style={styles.filterTitle}>Gender</Text>
                <View style={styles.genderContainer}>
                    {['Man', 'Woman', 'Beyond Binary', 'Everyone'].map((genderOption) => (
                        <TouchableOpacity
                            key={genderOption}
                            style={[
                                styles.genderButton,
                                gender === genderOption && styles.selectedGenderButton,
                            ]}
                            onPress={() => setGender(genderOption)}
                        >
                            <Text style={styles.genderButtonText}>{genderOption}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Age Range */}
                <Text style={styles.filterTitle}>Age</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={21}
                    maximumValue={60}
                    step={1}
                    value={ageRange[0]}
                    onValueChange={(val) => setAgeRange([val, ageRange[1]])}
                />
                <Slider
                    style={styles.slider}
                    minimumValue={21}
                    maximumValue={60}
                    step={1}
                    value={ageRange[1]}
                    onValueChange={(val) => setAgeRange([ageRange[0], val])}
                />
                <Text style={styles.rangeText}>{`${ageRange[0]} - ${ageRange[1]} years`}</Text>

                {/* Distance Filter */}
                <Text style={styles.filterTitle}>Distance</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={50}
                    step={1}
                    value={distance}
                    onValueChange={setDistance}
                />
                <Text style={styles.rangeText}>{`${distance} miles`}</Text>

                {/* Lifestyle Preferences */}
                <Text style={styles.filterTitle}>How often do you smoke?</Text>
                <View style={styles.lifestyleButtons}>
                    {['Non-smoker', 'Sober', 'Social smoker'].map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={[
                                styles.lifestyleButton,
                                smoke === option && styles.selectedLifestyleButton,
                            ]}
                            onPress={() => setSmoke(option)}
                        >
                            <Text style={styles.lifestyleButtonText}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.filterTitle}>How often do you drink?</Text>
                <View style={styles.lifestyleButtons}>
                    {['Non-drinker', 'Sober', 'Social drinker'].map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={[
                                styles.lifestyleButton,
                                drink === option && styles.selectedLifestyleButton,
                            ]}
                            onPress={() => setDrink(option)}
                        >
                            <Text style={styles.lifestyleButtonText}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Children Filter */}
                <Text style={styles.filterTitle}>Children</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={5}
                    step={1}
                    value={children}
                    onValueChange={setChildren}
                />
                <Text style={styles.rangeText}>{`${children} child(ren)`}</Text>

                {/* Outing Preferences */}
                <Text style={styles.filterTitle}>Outing preference</Text>
                <View style={styles.lifestyleButtons}>
                    {['Day time', 'Evening', 'Night'].map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={[
                                styles.lifestyleButton,
                                outing === option && styles.selectedLifestyleButton,
                            ]}
                            onPress={() => setOuting(option)}
                        >
                            <Text style={styles.lifestyleButtonText}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Apply Changes */}
                <TouchableOpacity style={styles.applyButton}>
                    <Text style={styles.applyButtonText}>Apply Changes</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    filterContainer: {
        flex: 1,
        backgroundColor: '#121212',
        paddingTop: 40,
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginVertical: 20,
    },
    closeButton: {
        padding: 10,
    },
    headerText: {
        flex: 1,
        textAlign: 'center',
        marginRight: 44,
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    filterContent: {
        marginTop: -20,
    },
    filterTitle: {
        color: 'white',
        fontSize: 16,
        marginBottom: 8,
    },
    genderContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    genderButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginRight: 8,
        backgroundColor: '#2F2F30',
        borderRadius: 20,
    },
    selectedGenderButton: {
        backgroundColor: '#5E42E7',
    },
    genderButtonText: {
        color: 'white',
        fontSize: 14,
    },
    slider: {
        width: '100%',
        marginBottom: 8,
    },
    rangeText: {
        color: 'white',
        fontSize: 14,
    },
    lifestyleButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    lifestyleButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginRight: 8,
        backgroundColor: '#2F2F30',
        borderRadius: 20,
        marginBottom: 8,
    },
    selectedLifestyleButton: {
        backgroundColor: '#5E42E7',
    },
    lifestyleButtonText: {
        color: 'white',
        fontSize: 14,
    },
    applyButton: {
        backgroundColor: '#5E42E7',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    applyButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default FilterScreen;
