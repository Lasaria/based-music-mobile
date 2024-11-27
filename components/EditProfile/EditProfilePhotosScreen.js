import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import PhotoMainView from './PhotoMainView';
import EditPreview from './EditPreview';
import GridPhotos from './GridPhotos';

const EditProfilePhotosScreen = ({ userId, photos, setPhotos, onSave, avatarUri, onCancel, name }) => {
    const [currentView, setCurrentView] = useState('PhotoMainView');
    const [currentAvatarUri, setCurrentAvatarUri] = useState(avatarUri);
    const [currentName, setCurrentName] = useState(name);


    const renderView = () => {
        switch (currentView) {
            case 'PhotoMainView':
                return <PhotoMainView
                    onNavigate={setCurrentView}
                    avatarUri={currentAvatarUri}
                    name={currentName}
                    onCancel={onCancel} />;
            case 'EditPreview':
                return <EditPreview
                    onNavigate={setCurrentView}
                    avatarUri={currentAvatarUri}
                    name={currentName}
                    onCancel={onCancel} />;
            case 'GridPhotos':
                return <GridPhotos
                    onNavigate={setCurrentView}
                    onCancel={onCancel}
                    userId={userId}
                    photos={photos}
                    setPhotos={setPhotos}
                    onSave={onSave} />;
            default:
                return <PhotoMainView
                    onNavigate={setCurrentView}
                    avatarUri={currentAvatarUri}
                    name={currentName}
                    onCancel={onCancel}
                />;
        }
    };

    return <View style={styles.container}>{renderView()}</View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Black background
    },
});

export default EditProfilePhotosScreen;
