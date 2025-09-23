import { FC, FormEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '@store';
import { clearError, getUserError, getUserLoading, login } from '@slices';
import { Preloader } from '@ui';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);

  const loading = useSelector(getUserLoading);
  const error = useSelector(getUserError);

  const dispatch = useDispatch();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(clearError());
    try {
      await dispatch(login({ email, password })).unwrap();
      setSubmitError(undefined);
    } catch (_) {
      setSubmitError(
        error ? error : 'Ошибка при входе. Пожалуйста, попробуйте еще раз.'
      );
    }
  };

  useEffect(() => {
    dispatch(clearError());
  }, []);

  if (loading) {
    return <Preloader />;
  }

  return (
    <LoginUI
      errorText={submitError}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
