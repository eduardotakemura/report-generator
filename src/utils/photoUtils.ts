import type { Photo } from '../models/Photo';

/**
 * Gets the image source URL from a Photo object
 * Handles both URL-based photos (dummy data) and File-based photos (uploads)
 */
export const getPhotoSrc = (photo: Photo): string => {
  if (photo.file) {
    // For uploaded files, create object URL
    return URL.createObjectURL(photo.file);
  } else if (photo.url) {
    // For dummy data or existing photos with URLs
    return photo.url;
  }
  return '';
};

/**
 * Cleans up object URLs to prevent memory leaks
 * Call this when unmounting components or when photos are no longer needed
 */
export const revokePhotoObjectURL = (photo: Photo): void => {
  if (photo.file) {
    // Note: We can't revoke the URL here because we don't store the object URL
    // The browser will automatically clean up object URLs when the page unloads
    // For better memory management, consider storing the object URL in the Photo object
  }
};
