import { FC } from 'react';
import { useSelector } from '@store';
import { Navigate, useLocation } from 'react-router-dom';
import { TProtectedRouteProps } from './type';
import { Preloader } from '@ui';
import { getIsAuthChecked, getIsAuthenticated } from '@slices';

export const ProtectedRoute: FC<TProtectedRouteProps> = ({
  children,
  onlyUnAuth = false
}): React.ReactNode => {
  const location = useLocation();
  const isAuthenticated = useSelector(getIsAuthenticated);
  const isAuthChecked = useSelector(getIsAuthChecked);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  if (onlyUnAuth && isAuthenticated) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} replace />;
  }

  return children;
};
