import { useEffect, useState } from 'react';
import {
  getCompanies,
  getBranchesByCompany,
  getAreasByBranch,
  getAllUsers,
} from '@/services/info-moduleService';
import type { Company, Branch, Area, User } from '@/interfaces/infoInterface';

export function useFormUser() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [managers, setManagers] = useState<User[]>([]);

  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);

  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedManager, setSelectedManager] = useState<string>('');

  useEffect(() => {
    getCompanies()
      .then(setCompanies)
      .catch(err => console.error('Error al obtener empresas:', err.message))
      .finally(() => setLoadingCompanies(false));
  }, []);

  useEffect(() => {
    if (!selectedCompany) return;
    setLoadingBranches(true);
    getBranchesByCompany(selectedCompany)
      .then(setBranches)
      .catch(err => console.error('Error al obtener sucursales:', err.message))
      .finally(() => setLoadingBranches(false));
  }, [selectedCompany]);

  useEffect(() => {
    if (!selectedBranch) return;
    setLoadingAreas(true);
    getAreasByBranch(selectedBranch)
      .then(setAreas)
      .catch(err => console.error('Error al obtener áreas:', err.message))
      .finally(() => setLoadingAreas(false));
  }, [selectedBranch]);

  useEffect(() => {
    if (!selectedCompany || !selectedBranch || !selectedArea) return;

    getAllUsers()
      .then(users => {
        const filteredManagers = users.filter(
          user =>
            user.companyId === parseInt(selectedCompany) &&
            user.branchId === parseInt(selectedBranch) &&
            user.areaId === parseInt(selectedArea) &&
            [1, 2, 3].includes(user.roleId),
        );
        setManagers(filteredManagers);
      })
      .catch(err => console.error('Error al filtrar managers:', err.message));
  }, [selectedCompany, selectedBranch, selectedArea]);

  return {
    companies,
    branches,
    areas,
    managers,
    loadingCompanies,
    loadingBranches,
    loadingAreas,
    selectedCompany,
    selectedBranch,
    selectedArea,
    selectedManager,
    setSelectedManager,
    setSelectedCompany,
    setSelectedBranch,
    setSelectedArea,
  };
}
