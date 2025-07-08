import { api } from '@/services/api';

export async function getUserPermissions(userId: number | string) {
  const res = await api.get(`/permissions/user/${userId}`);
  return res.data;
}

export async function addPermission(userId: number | string, viewName: string) {
  const res = await api.post('/permissions', { userId, viewName });
  return res.data;
}

export async function removePermission(permissionId: number) {
  await api.delete(`/permissions/${permissionId}`);
}
