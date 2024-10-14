import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { router } from 'expo-router';

const ListenerProfileScreen = ({ }) => {
    return (
        <View style={styles.container}>
            <Text>Listener Profile</Text>
            {/* Favorites Screen Button */}
            <Button
                title="Favorites"
                onPress={() => router.push("favorites")}
            />
            {/* Settings Screen Button */}
            <Button
                title="Settings"
                onPress={() => router.push("settings")}
            />
            {/* Inbox Screen Button */}
            <Button
                title="Inbox"
                onPress={() => router.push("inbox")}
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