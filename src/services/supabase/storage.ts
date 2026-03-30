import { supabase } from './client';

/**
 * Upload an avatar image to Supabase Storage
 * 
 * @param userId - The user's ID
 * @param file - The file to upload (base64 string for web)
 * @param fileType - The file MIME type
 * @returns The public URL of the uploaded image
 */
export async function uploadAvatar(
  userId: string,
  file: string,
  fileType: string = 'image/jpeg'
): Promise<string> {
  try {
    // Convert base64 to blob for web
    const base64Data = file.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: fileType });

    const fileName = `${userId}-${Date.now()}.jpg`;
    const filePath = `avatars/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(filePath, blob, {
        contentType: fileType,
        upsert: true,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
}

/**
 * Delete an avatar image from Supabase Storage
 * 
 * @param avatarUrl - The URL of the avatar to delete
 */
export async function deleteAvatar(avatarUrl: string): Promise<void> {
  try {
    // Extract file path from URL
    const urlParts = avatarUrl.split('/avatars/');
    if (urlParts.length < 2) {
      return;
    }
    const filePath = `avatars/${urlParts[1]}`;

    const { error } = await supabase.storage
      .from('avatars')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting avatar:', error);
    }
  } catch (error) {
    console.error('Error deleting avatar:', error);
  }
}

/**
 * Upload a class image to Supabase Storage
 * 
 * @param classId - The class ID
 * @param file - The file to upload (base64 string for web)
 * @param fileType - The file MIME type
 * @returns The public URL of the uploaded image
 */
export async function uploadClassImage(
  classId: string,
  file: string,
  fileType: string = 'image/jpeg'
): Promise<string> {
  try {
    // Convert base64 to blob for web
    const base64Data = file.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: fileType });

    const fileName = `class-${classId}-${Date.now()}.jpg`;
    const filePath = `avatars/${fileName}`; // Use avatars/ folder instead of class-images/

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(filePath, blob, {
        contentType: fileType,
        upsert: true,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading class image:', error);
    throw error;
  }
}

/**
 * Delete a class image from Supabase Storage
 * 
 * @param imageUrl - The URL of the class image to delete
 */
export async function deleteClassImage(imageUrl: string): Promise<void> {
  try {
    // Extract file path from URL - now looking in avatars/ folder
    const urlParts = imageUrl.split('/avatars/');
    if (urlParts.length < 2) {
      return;
    }
    const filePath = `avatars/${urlParts[1]}`;

    const { error } = await supabase.storage
      .from('avatars')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting class image:', error);
    }
  } catch (error) {
    console.error('Error deleting class image:', error);
  }
}
