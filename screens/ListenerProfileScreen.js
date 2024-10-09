import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ListenerProfileScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text>Listener Profile</Text>
            {/* Favorites Screen Button */}
            <Button
                title="Favorites"
                onPress={() => navigation.navigate('Favorites')}
            />
            {/* Settings Screen Button */}
            <Button
                title="Settings"
                onPress={() => navigation.navigate('Settings')}
            />
            {/* Inbox Screen Button */}
            <Button
                title="Inbox"
                onPress={() => navigation.navigate('Inbox')}
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