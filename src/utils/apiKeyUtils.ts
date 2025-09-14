export const generateApiKey = () => {
  // Generate a secure random API key
  const prefix = 'ak_';
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const randomPart = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  return prefix + randomPart;
};

export const hashApiKey = async (apiKey: string) => {
  // Create a SHA-256 hash of the API key for storage
  const encoder = new TextEncoder();
  const data = encoder.encode(apiKey);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const generateKeyPrefix = (apiKey: string) => {
  // Generate a prefix for display purposes (first 8 characters after prefix)
  if (apiKey.startsWith('ak_')) {
    return apiKey.substring(0, 11) + '...';
  }
  return apiKey.substring(0, 8) + '...';
};