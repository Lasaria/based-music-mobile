import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { tokenManager } from '../utils/tokenManager';

const serverURL = 'http://localhost:3000';

export const uploadImage = async (imageUri, endpoint, imageName, method = 'PATCH') => {
    if (!imageUri) return;

    try {
        const accessToken = await tokenManager.getAccessToken();

        const normalizedUri = Platform.select({
            ios: imageUri.replace('file://', ''),
            android: imageUri,
        });

        const response = await FileSystem.uploadAsync(
            `${serverURL}${endpoint}`,
            normalizedUri,
            {
                uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                fieldName: imageName,
                mimeType: 'image/jpeg',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data',
                },
                httpMethod: method,
            }
        );

        if (response.status !== 200) {
            let errorMessage;
            try {
                // Try to parse error message from response body
                const errorResponse = JSON.parse(response.body);
                errorMessage = errorResponse.message || errorResponse.error || 'Unknown error occurred';
            } catch (parseError) {
                // If parsing fails, use response status text or generic message
                errorMessage = response.statusText || `Server returned status ${response.status}`;
            }

            console.error(`Upload error for ${imageName}:`, {
                status: response.status,
                message: errorMessage,
                response: response.body
            });

            throw new Error(errorMessage);
        }

        console.log(`${imageName} uploaded successfully`);
        return response;
    } catch (error) {
        console.error(`Error uploading ${imageName}:`, error);
        // If it's already our parsed error, throw it directly
        if (error.message) {
            throw error;
        }
        // For unexpected errors
        throw new Error(`Failed to upload ${imageName}: ${error.message || 'Unknown error occurred'}`);
    }
};