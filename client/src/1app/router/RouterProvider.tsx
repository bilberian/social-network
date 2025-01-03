import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router';
import MainPage from '../../2pages/MainPage/MainPage';
import Layout from '../../2pages/Layout/Layout';
import SignupPage from '../../2pages/SignupPage/SignupPage';
import LoginPage from '../../2pages/LoginPage/LoginPage';
import AccountPage from '../../2pages/AccountPage/AccountPage';
import NotFoundPage from '../../2pages/NotFound/NotFoundPage';
import SupscriptionPage from '../../2pages/Subscription/SubscriptionPage';
import SubscribersPage from '../../2pages/Subscription/SubscribersPage';
import PhotosPage from '../../2pages/Photos/PhotosPage';
import MessagesPage from '../../2pages/Messages/MessagesPage';
import ProtectedRoute from '../../4features/auth/lib/ProtectedRoute';
import { AuthStatus } from '../../4features/auth/model/types';
import { refreshThunk } from '../../4features/auth/model/authThunks';
import { getUserSubscriptionsThunk } from '../../5entities/user/model/userThunks';
import { useAppDispatch, useAppSelector } from '../../6shared/lib/hooks';

export default function RouterProvider(): React.JSX.Element {
  const status = useAppSelector((store) => store.auth.data.status);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(refreshThunk()).catch(console.log);
    dispatch(getUserSubscriptionsThunk()).catch(console.log); // иначе глючит mainPage при входе 
  }, []);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<MainPage />} />
        <Route
          path="/subscriptions"
          element={
            <ProtectedRoute
              isAllowed={status === AuthStatus.authenticated}
              redirectTo="/auth/login"
            >
              <SupscriptionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscribers"
          element={
            <ProtectedRoute
              isAllowed={status === AuthStatus.authenticated}
              redirectTo="/auth/login"
            >
              <SubscribersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/photos"
          element={
            <ProtectedRoute
              isAllowed={status === AuthStatus.authenticated}
              redirectTo="/auth/login"
            >
              <PhotosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute
              isAllowed={status === AuthStatus.authenticated}
              redirectTo="/auth/login"
            >
              <MessagesPage />
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

        <Route element={<ProtectedRoute isAllowed={status === AuthStatus.guest} redirectTo="/" />}>
          <Route path="/auth/signup" element={<SignupPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
