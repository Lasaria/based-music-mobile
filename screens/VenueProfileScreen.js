import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
const VenueProfileScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text>Venue Profile</Text>
            {/* Venue Info Button */}
            <Button
                title="Venue Info"
                onPress={() => navigation.navigate('VenueInfo')}
            />
            {/* Events Button */}
            <Button
                title="Events"
                onPress={() => navigation.navigate('Events')}
            />
            {/* Bookings Button */}
            <Button
                title="Bookings"
                onPress={() => navigation.navigate('VenueBookings')}
            />
            {/* Inbox Screen Button */}
            <Button
                title="Inbox"
                onPress={() => navigation.navigate('Inbox')}
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