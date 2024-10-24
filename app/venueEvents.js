import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native'; 

const VenueEventScreen = ({ }) => {
    const navigation = useNavigation(); 
    return (
        <View style={styles.container}>
            <Text>Venue Profile</Text>
            {/* create Event Button */}
            <Button
                title="Create Event"
                onPress={() => router.push('eventOptions/createEvent')}
            />
            {/* Upcoming Event Button */}
            <Button
                title="Upcoming Event"
                onPress={() => router.push('eventOptions/pastEvent')}
            />
            {/* Past Event Button */}
            <Button
                title="Past Event"
                onPress={() => router.push('eventOptions/upcomingEvent')}
            />
            <Button
                title="Back"
                onPress={() => navigation.goBack()} // Use the goBack method
            />
        </View>
    )
}
export default VenueEventScreen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})