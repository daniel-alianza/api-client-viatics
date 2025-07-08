import type React from 'react';
import { useState, useEffect } from 'react';
import { useUserContext } from '../context/UserContext';
import type { UserFormData } from '../interfaces/User';
import type { User as InfoUser } from '@/interfaces/infoInterface';
import { X, Save, User as UserIcon, Mail, Users } from 'lucide-react';
import {
  getCompanies,
  getBranchesByCompany,
  getAreasByBranch,
  getRoles,
  getAllUsers,
} from '@/services/info-moduleService';
import { useToastContext } from './ToastProvider';

const UserModal: React.FC = () => {
  const { selectedUser, isModalOpen, setModalOpen, addUser, updateUser } =
    useUserContext();
  const { toast } = useToastContext();
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    password: '',
    companyId: 1,
    branchId: 1,
    areaId: 1,
    roleId: 1,
    managerId: undefined,
    phone: '',
  });
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [branches, setBranches] = useState<{ id: string; name: string }[]>([]);
  const [areas, setAreas] = useState<{ id: string; name: string }[]>([]);
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [allUsers, setAllUsers] = useState<InfoUser[]>([]);
  const [filteredLeaders, setFilteredLeaders] = useState<InfoUser[]>([]);

  useEffect(() => {
    getCompanies().then(setCompanies);
    getRoles().then(setRoles);
    getAllUsers().then(setAllUsers);
  }, []);

  useEffect(() => {
    if (formData.companyId) {
      getBranchesByCompany(formData.companyId.toString()).then(setBranches);
    }
  }, [formData.companyId]);

  useEffect(() => {
    if (formData.branchId) {
      getAreasByBranch(formData.branchId.toString()).then(setAreas);
    }
  }, [formData.branchId]);

  // Filtrar líderes basado en sucursal, área y rol
  useEffect(() => {
    if (formData.companyId && formData.branchId && formData.areaId) {
      const filtered = allUsers.filter(
        user =>
          user.companyId === formData.companyId &&
          user.branchId === formData.branchId &&
          user.areaId === formData.areaId &&
          [1, 2, 3].includes(user.roleId) && // Solo roles de líderes
          user.id.toString() !== selectedUser?.id, // Excluir al usuario actual si está editando
      );
      setFilteredLeaders(filtered);
    } else {
      setFilteredLeaders([]);
    }
  }, [
    formData.companyId,
    formData.branchId,
    formData.areaId,
    allUsers,
    selectedUser,
  ]);

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        name: selectedUser.name,
        email: selectedUser.email,
        password: '',
        companyId: selectedUser.companyId,
        branchId: selectedUser.branchId,
        areaId: selectedUser.areaId,
        roleId: selectedUser.roleId || selectedUser.role?.id,
        managerId: selectedUser.managerId ?? undefined,
        phone: selectedUser.phone || '',
      });
      console.log('DEBUG selectedUser:', selectedUser);
      console.log('DEBUG selectedUser.role:', selectedUser.role);
      console.log('DEBUG selectedUser.roleId:', selectedUser.roleId);
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        companyId: companies[0]?.id ? Number(companies[0].id) : 1,
        branchId: 1,
        areaId: 1,
        roleId: 1,
        managerId: undefined,
        phone: '',
      });
    }
  }, [selectedUser, companies]);

  // Obtener el nombre del líder actual
  const getCurrentLeaderName = () => {
    if (!selectedUser?.manager) return 'Sin líder asignado';
    return selectedUser.manager.name;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend = { ...formData };
    if (!dataToSend.password) delete dataToSend.password;
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, dataToSend);
        toast({
          title: 'Usuario actualizado',
          description: 'Los datos del usuario se actualizaron correctamente.',
          variant: 'default',
        });
      } else {
        await addUser(dataToSend);
        toast({
          title: 'Usuario creado',
          description: 'El usuario fue creado exitosamente.',
          variant: 'default',
        });
      }
      setModalOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron guardar los cambios. Intenta de nuevo.',
        variant: 'destructive',
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isModalOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-3xl transform transition-all duration-300 scale-100 animate-in slide-in-from-bottom-4'>
        <div className='flex items-center justify-between p-8 border-b border-gray-100'>
          <h2 className='text-2xl font-bold text-[#02082C] flex items-center gap-3'>
            <span className='w-10 h-10 bg-gradient-to-br from-[#F34602] to-[#02082C] rounded-lg flex items-center justify-center'>
              <UserIcon className='w-6 h-6 text-white' />
            </span>
            {selectedUser ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h2>
          <button
            onClick={() => setModalOpen(false)}
            className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:rotate-90'
          >
            <X className='w-6 h-6' />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className='p-8 w-full flex flex-col gap-8 items-center'
        >
          <div className='w-full max-w-2xl flex flex-col gap-8 mx-auto'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Nombre completo
                </label>
                <div className='relative'>
                  <UserIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#F34602]' />
                  <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F34602]/20 focus:border-[#F34602] transition-all duration-300'
                    placeholder='Nombre completo'
                  />
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Email
                </label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#F34602]' />
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F34602]/20 focus:border-[#F34602] transition-all duration-300'
                    placeholder='usuario@empresa.com'
                  />
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Contraseña
                </label>
                <div className='relative'>
                  <input
                    type='password'
                    name='password'
                    value={formData.password || ''}
                    onChange={handleChange}
                    className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F34602]/20 focus:border-[#F34602] transition-all duration-300'
                    placeholder='Dejar en blanco para no cambiar'
                    autoComplete='new-password'
                  />
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Compañía
                </label>
                <select
                  name='companyId'
                  value={formData.companyId}
                  onChange={handleChange}
                  className='w-full pl-3 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F34602]/20 focus:border-[#F34602] transition-all duration-300'
                  required
                >
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Sucursal
                </label>
                <select
                  name='branchId'
                  value={formData.branchId}
                  onChange={handleChange}
                  className='w-full pl-3 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F34602]/20 focus:border-[#F34602] transition-all duration-300'
                  required
                >
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Área
                </label>
                <select
                  name='areaId'
                  value={formData.areaId}
                  onChange={handleChange}
                  className='w-full pl-3 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F34602]/20 focus:border-[#F34602] transition-all duration-300'
                  required
                >
                  {areas.map(area => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Rol
                </label>
                <select
                  name='roleId'
                  value={formData.roleId}
                  onChange={handleChange}
                  className='w-full pl-3 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F34602]/20 focus:border-[#F34602] transition-all duration-300'
                  required
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Cambiar Líder
                </label>
                <select
                  name='managerId'
                  value={formData.managerId ?? ''}
                  onChange={handleChange}
                  className='w-full pl-3 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F34602]/20 focus:border-[#F34602] transition-all duration-300'
                  required
                >
                  <option value=''>Sin líder</option>
                  {filteredLeaders.map(leader => (
                    <option key={leader.id} value={leader.id}>
                      {leader.name}
                    </option>
                  ))}
                </select>
              </div>
              {selectedUser && (
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Líder Actual
                  </label>
                  <div className='relative'>
                    <Users className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#F34602]' />
                    <input
                      type='text'
                      value={getCurrentLeaderName()}
                      readOnly
                      className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed'
                      placeholder='Sin líder asignado'
                    />
                  </div>
                </div>
              )}
            </div>
            <div className='flex flex-row gap-4 justify-center w-full mt-4'>
              <button
                type='button'
                onClick={() => setModalOpen(false)}
                className='px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300 font-medium'
              >
                Cancelar
              </button>
              <button
                type='submit'
                className='px-6 py-3 bg-gradient-to-r from-[#F34602] to-[#02082C] text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium flex items-center justify-center gap-2'
              >
                <Save className='w-4 h-4' />
                <span>{selectedUser ? 'Actualizar' : 'Crear'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
