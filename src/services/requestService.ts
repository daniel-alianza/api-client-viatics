/* eslint-disable @typescript-eslint/no-explicit-any */
export interface UserData {
  id: number;
  name: string;
  email: string;
  token: string;
  companyId: number;
  branchId: number;
  areaId: number;
  roleId: number;
  managerId: number;
  company: {
    id: number;
    name: string;
  };
  branch: {
    id: number;
    name: string;
    companyId: number;
  };
  area: {
    id: number;
    name: string;
    branchId: number;
  };
  role: {
    id: number;
    name: string;
  };
  cards: Array<{
    id: number;
    cardNumber: string;
    userId: number;
    isActive: boolean;
    assignedAt: string;
    limite: string;
  }>;
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

export const createTravelExpense = async (data: any, token: string) => {
  const response = await fetch('http://localhost:4000/expense-requests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMsg = 'Error al crear la solicitud';
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorMsg;
    } catch {
      // Si ocurre un error al parsear el error, simplemente usa el mensaje por defecto
    }
    throw new Error(errorMsg);
  }

  return await response.json();
};
