import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { router } from 'expo-router';

const ListenerProfileScreen = ({ }) => {
    return (
        <View style={styles.container}>
            <Text>Listener Profile</Text>
            {/* Settings Screen Button */}
            <Button
                title="Settings"
                onPress={() => router.push("profile/settings")}
            />
            {/* Inbox Screen Button */}
            <Button
                title="Inbox"
                onPress={() => router.push("profile/inbox")}
            />
        </View>
    )
}

export default ListenerProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})