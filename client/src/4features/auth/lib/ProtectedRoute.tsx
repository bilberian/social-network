import React from 'react';
import { Navigate, Outlet } from 'react-router';

type ProtectedRouteProps = {
  children?: React.JSX.Element;
  isAllowed: boolean;
  redirectTo?: string;
};

export default function ProtectedRoute({
  children,
  isAllowed,
  redirectTo = '/',
}: ProtectedRouteProps): React.JSX.Element {
  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />;
  }
  return children ?? <Outlet />;
}
