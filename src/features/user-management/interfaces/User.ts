export interface Company {
  id: number;
  name: string;
}

export interface Branch {
  id: number;
  name: string;
  companyId: number;
}

export interface Area {
  id: number;
  name: string;
  branchId: number;
}

export interface Role {
  id: number;
  name: string;
}

export interface Card {
  id: number;
  cardNumber: string;
  userId: number;
  companyId: number;
  isActive: boolean;
  assignedAt: string;
  limite: string;
  company: Company;
}

export interface Manager {
  id: number;
  name: string;
  email: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  companyId: number;
  branchId: number;
  areaId: number;
  roleId: number;
  managerId?: number | null;
  company: Company;
  branch: Branch;
  area: Area;
  role: Role;
  manager: Manager | null;
  cards: Card[];
  avatar?: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  lastLogin?: string;
  department?: string;
  phone?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  companyId: number;
  branchId: number;
  areaId: number;
  roleId: number;
  managerId?: number;
  phone?: string;
}

export interface UserContextType {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  isModalOpen: boolean;
  searchTerm: string;
  filterRole: string;
  addUser: (user: UserFormData) => void;
  updateUser: (id: string, user: Partial<UserFormData>) => void;
  deleteUser: (id: string) => void;
  selectUser: (user: User | null) => void;
  setModalOpen: (open: boolean) => void;
  setSearchTerm: (term: string) => void;
  setFilterRole: (role: string) => void;
}
