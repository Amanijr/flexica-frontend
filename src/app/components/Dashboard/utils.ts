export function getProductImage(
    images?: string[]
  ): string {
    if (!images || images.length === 0) return '/placeholder.png'; // fallback if undefined or empty
  
    // Return the first image as base64 data URL
    const firstImage = images[0];
    if (firstImage.startsWith('data:')) {
      return firstImage; // Already a data URL
    }
    
    // If it's base64 without data URL prefix, add the prefix
    return `data:image/jpeg;base64,${firstImage}`;
  }
  