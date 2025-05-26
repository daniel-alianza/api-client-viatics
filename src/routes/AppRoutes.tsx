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

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/login' />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/dashboard' element={<Dash />} />
      <Route path='/request/page' element={<RequestPage />} />
      <Route path='/authorization/page' element={<AuthorizationPage />} />
      <Route
        path='/collaborators-w-card/page'
        element={<CollaboratorsWCardPage />}
      />
      <Route
        path='/accounting-authorization/page'
        element={<AccountingAuthorizationPage />}
      />
      <Route
        path='/verification-of-travel/page'
        element={<VerificationOfTravelPage />}
      />
      <Route
        path='/expense-verification/page'
        element={<ExpenseVerificationPage />}
      />
      <Route
        path='/travel-expense-checks/page'
        element={<ExpenseVerificationPage />}
      />
    </Routes>
  );
};
