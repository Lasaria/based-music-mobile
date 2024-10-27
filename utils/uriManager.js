/**
 * Convert URI to Blob
 * @param {string} uri - Local file URI
 * @returns {Promise<Blob>} Blob data
 */

const uriToBlob = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error converting URI to blob:', error);
      throw error;
    }
  };

export default uriToBlob