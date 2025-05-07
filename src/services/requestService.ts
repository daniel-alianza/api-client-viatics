/* eslint-disable @typescript-eslint/no-explicit-any */
interface UserData {
  token: string;
  [key: string]: any; // Added missing semicolon
}

let userData: UserData | null = null;

export const setUserData = (data: UserData) => {
  // console.log('Setting user data:', data); // Debug log
  userData = data;
};

export const getUserData = (): UserData | null => {
  // console.log('Getting user data:', userData); // Debug log
  return userData;
};

export const fetchUserSpecificData = async () => {
  if (!userData) {
    throw new Error('User is not logged in');
  }

  try {
    const response = await fetch('/api/user-data', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user-specific data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user-specific data:', error);
    throw error;
  }
};
