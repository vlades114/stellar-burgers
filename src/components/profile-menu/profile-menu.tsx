import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { Preloader, ProfileMenuUI } from '@ui';
import { useDispatch, useSelector } from '@store';
import { getUserLoading, logout } from '@slices';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const loading = useSelector(getUserLoading);

  const handleLogout = async () => {
    if (loading) return;

    try {
      await dispatch(logout()).unwrap();
    } catch (_) {}
  };

  if (loading) {
    return <Preloader />;
  }

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
