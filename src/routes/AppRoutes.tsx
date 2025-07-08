import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import Dash from '../features/dashboard/pages/page';
import RequestPage from '../features/request/pages/page';
import AuthorizationPage from '../features/authorization/pages/page';
import CollaboratorsWCardPage from '../features/collaborators-w-card/pages/page';
import AccountingAuthorizationPage from '../features/accounting-authorization/pages';
import VerificationOfTravelPage from '../features/verification-of-travelexpenses/pages/page';
import { ExpenseVerificationPage } from '../features/TravelExpense-Checks/pages/expense-verification-page';
import { ProtectedRoute } from '../components/ProtectedRoute';
import AccountingClearancePage from '../features/accounting-clearance/pages/page';
import { MovimientosLayout } from '../features/accounting-clearance/pages/MovimientosLayout';
import UserManagement from '../features/user-management/pages/UserManagement';
import PermissionsPage from '../features/permissions/pages/page';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/login' />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />

      {/* Rutas protegidas */}
      <Route
        path='/dashboard'
        element={
          <ProtectedRoute allowedRoles={[1, 2, 3, 4]}>
            <Dash />
          </ProtectedRoute>
        }
      />
      <Route
        path='/request/page'
        element={
          <ProtectedRoute
            allowedRoles={[1, 2, 3, 4]}
            requiredPermission='request'
          >
            <RequestPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/authorization/page'
        element={
          <ProtectedRoute
            allowedRoles={[1, 2, 3, 4]}
            requiredPermission='authorization'
          >
            <AuthorizationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/collaborators-w-card/page'
        element={
          <ProtectedRoute
            allowedRoles={[1, 2, 3, 4]}
            requiredPermission='collaborators-w-card'
          >
            <CollaboratorsWCardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/accounting-authorization/page'
        element={
          <ProtectedRoute
            allowedRoles={[1, 2, 3, 4]}
            requiredPermission='accounting-authorization'
          >
            <AccountingAuthorizationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/accounting-clearance/page'
        element={
          <ProtectedRoute
            allowedRoles={[1, 2, 3, 4]}
            requiredPermission='accounting-clearance'
          >
            <AccountingClearancePage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/accounting-clearance/movimientos/:id'
        element={
          <ProtectedRoute allowedRoles={[1, 2, 3, 4]}>
            <MovimientosLayout />
          </ProtectedRoute>
        }
      />
      <Route
        path='/verification-of-travel/page'
        element={
          <ProtectedRoute
            allowedRoles={[1, 2, 3, 4]}
            requiredPermission='verification-of-travelexpenses'
          >
            <VerificationOfTravelPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/expense-verification/page'
        element={
          <ProtectedRoute
            allowedRoles={[1, 2, 3, 4]}
            requiredPermission='TravelExpense-Checks'
          >
            <ExpenseVerificationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/travel-expense-checks/page'
        element={
          <ProtectedRoute
            allowedRoles={[1, 2, 3, 4]}
            requiredPermission='TravelExpense-Checks'
          >
            <ExpenseVerificationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/user-management/page'
        element={
          <ProtectedRoute
            allowedRoles={[1, 2, 3, 4]}
            requiredPermission='user-management'
          >
            <UserManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path='/permissions/page'
        element={
          <ProtectedRoute
            allowedRoles={[1, 2, 3, 4]}
            requiredPermission='permissions'
          >
            <PermissionsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
