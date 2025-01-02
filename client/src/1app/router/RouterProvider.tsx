import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router';
import MainPage from '../../2pages/MainPage/MainPage';
import Layout from '../../2pages/Layout/Layout';
import SignupPage from '../../2pages/SignupPage/SignupPage';
import LoginPage from '../../2pages/LoginPage/LoginPage';
import AccountPage from '../../2pages/AccountPage/AccountPage';
import GamePage from '../../2pages/GamePage/GamePage';
import ProtectedRoute from '../../4features/auth/lib/ProtectedRoute';
import { AuthStatus } from '../../4features/auth/model/types';
import { refreshThunk } from '../../4features/auth/model/authThunks';
import { useAppDispatch, useAppSelector } from '../../6shared/lib/hooks';
import NotFoundPage from '../../2pages/NotFound/NotFoundPage';

export default function RouterProvider(): React.JSX.Element {
  const status = useAppSelector((store) => store.auth.data.status);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(refreshThunk()).catch(console.log);
  }, []);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<MainPage />} />
        <Route
          path="/game"
          element={
            <ProtectedRoute
              isAllowed={status === AuthStatus.authenticated}
              redirectTo="/auth/login"
            >
              <GamePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/:userId"
          element={
            <ProtectedRoute
              isAllowed={status === AuthStatus.authenticated}
              redirectTo="/auth/login"
            >
              <AccountPage />
            </ProtectedRoute>
          }
        />

        <Route
          element={<ProtectedRoute isAllowed={status === AuthStatus.guest} redirectTo="/" />}
        >
          <Route path="/auth/signup" element={<SignupPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
