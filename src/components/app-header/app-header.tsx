import { FC } from 'react';
import { useSelector } from '@store';
import { getUser, getIsAuthenticated } from '@slices';
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  const user = useSelector(getUser);
  const isAuthenticated = useSelector(getIsAuthenticated);

  const userName = isAuthenticated ? user?.name : undefined;

  return <AppHeaderUI userName={userName} />;
};
