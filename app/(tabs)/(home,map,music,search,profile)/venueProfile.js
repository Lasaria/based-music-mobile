import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { router } from 'expo-router';


const VenueProfileScreen = ({ }) => {
    return (
        <View style={styles.container}>
            <Text>Venue Profile</Text>
            {/* Venue Info Button */}
            <Button
                title="Venue Info"
                onPress={() => router.push('VenueInfo')}
            />
            {/* Events Button */}
            <Button
                title="Events"
                onPress={() => router.push('venueEvents')}
            />
            {/* Bookings Button */}
            <Button
                title="Bookings"
                onPress={() => router.push('VenueBookings')}
            />
            {/* Inbox Screen Button */}
            <Button
                title="Inbox"
                onPress={() => router.push('Inbox')}
            />
        </View>
    )
}
export default VenueProfileScreen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})