import React, { useState, useEffect, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation, useLocalSearchParams, usePathname, useSegments } from 'expo-router';
import { Colors } from '../../../constants/Color';
import { UserService } from '../../../services/UserService';
import { tokenManager } from '../../../utils/tokenManager';
import ArtistProfileScreen from './artistProfile';
import ListenerProfileScreen from './listenerProfile';

const ProfileScreen = () => {
  const [loading, setLoading] = useState(true);
  //const [userType, setUserType] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [profileData, setProfileData] = useState({
    id: '',
    email: '',
    username: '',
    display_name: '',
    description: '',
    user_type: '',
    user_location: '',
    selected_genres: '',
    profile_image_url: '',
    cover_image_url: '',
    created_at: '',
    updated_at: '',
    isSelfProfile: false,
    followers_count: 0,
    following_count: 0
  });
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const pathname = usePathname();
  const segments = useSegments();

  // Pass isRootProfile to child components
  const isRootProfile = !params.userId;


  // Fetch user profile when component mounts
    const fetchUserProfile = async (showLoadingSpinner = true) => {
      try {
        if (showLoadingSpinner) {
          setLoading(true);
        }
        const userId = params.userId || await tokenManager.getUserId();
        const response = await UserService.getUserProfile(userId);


        if (response) {
          // Determine if user is viewing their own profile
          const ownUserId = await tokenManager.getUserId();
          const isUserSelfProfile = response.id === ownUserId;

          // Validate and set profile image URLs
          const validProfileImageUrl = (response.profile_image_url && response.profile_image_url !== 'Unknown')
            ? response.profile_image_url
            : DEFAULT_PROFILE_IMAGE;

          const validCoverImageUrl = (response.cover_image_url && response.cover_image_url !== 'Unknown')
            ? response.cover_image_url
            : DEFAULT_COVER_IMAGE;

          // Set display_name to first_name if display_name is empty
          const displayName = (!response.display_name || response.display_name.trim() === '') 
            ? response.first_name 
            : response.display_name;

          setProfileData({
            ...response,
            display_name: displayName,
            profile_image_url: validProfileImageUrl,
            cover_image_url: validCoverImageUrl,
            isSelfProfile: isUserSelfProfile
          });
        } else {
          console.error('No user data found');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setLoading(false);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

  // Initial fetch
  useEffect(() => {
    fetchUserProfile();
    navigation.setOptions({ headerShown: false });
  }, [refreshing]);


  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserProfile(false); // Wait for the fetch to complete
  }, []);

  const handleProfileUpdate = async (updatedData) => {
    try {
      const response = await UserService.updateUserProfile({
        userId: profileData.id,
        ...updatedData,
      });

      if (response) {
        setProfileData(prev => ({
          ...prev,
          ...updatedData,
          updated_at: new Date().toISOString()
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };


  const refreshProfile = () => {
    fetchUserProfile();
  };



  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.white} />
      </View>
    );
  }


  // const refreshProfile = () => {
  //   setLoading(true);
  //   // This will trigger the useEffect to fetch profile again
  // };
  // Render appropriate profile screen based on user type
  // Render appropriate profile screen based on user type

  // Common props for both profile screens
  const commonProps = {
    userData: profileData,
    onUpdateProfile: handleProfileUpdate,
    refreshProfile,
    refreshControl: (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        tintColor={Colors.white}
        colors={[Colors.white]}
        progressBackgroundColor="#121212"
      />
    )
  };

  return profileData.user_type === 'artist' ? (
    <ArtistProfileScreen {...commonProps} isRootProfile={isRootProfile}/>
  ) : (
    <ListenerProfileScreen {...commonProps} isRootProfile={isRootProfile}/>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
});

export default ProfileScreen;