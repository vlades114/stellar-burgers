import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { Modal } from '../modal';
import { IngredientDetails } from '../ingredient-details';
import { OrderInfo } from '../order-info';
import { ProtectedRoute } from '../protected-route';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader } from '../app-header';
import { useEffect } from 'react';
import {
  clearOrderModal,
  fetchIngredients,
  fetchUser,
  getIngredientsLoading
} from '@slices';
import { useDispatch, useSelector } from '@store';
import { Preloader } from '@ui';
import { OrderModal } from '@components';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const backgroundLocation = location.state?.background;
  const dispatch = useDispatch();

  const isIngredientsLoading = useSelector(getIngredientsLoading);

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchIngredients());
  }, []);

  const handleOnCloseModal = () => {
    navigate(-1);
    dispatch(clearOrderModal());
  };

  return (
    <div className={styles.app}>
      {isIngredientsLoading ? (
        <>
          <AppHeader />
          <Preloader />
        </>
      ) : (
        <>
          <AppHeader />
          <Routes location={backgroundLocation || location}>
            {/* Основные маршруты */}
            <Route path='/' element={<ConstructorPage />} />
            <Route path='/feed' element={<Feed />} />
            <Route
              path='/ingredients/:ingredientId'
              element={<IngredientDetails />}
            />
            <Route path='/feed/:number' element={<OrderInfo />} />

            {/* Защищённые маршруты (только для неавторизованных) */}
            <Route
              path='/login'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path='/register'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Register />
                </ProtectedRoute>
              }
            />
            <Route
              path='/forgot-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ForgotPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path='/reset-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />

            {/* Защищённые маршруты (только для авторизованных) */}
            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/orders'
              element={
                <ProtectedRoute>
                  <ProfileOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute>
                  <OrderInfo />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path='*' element={<NotFound404 />} />
          </Routes>

          {/* Модалки (только при клике с backgroundLocation) */}
          {backgroundLocation && (
            <Routes>
              <Route
                path='/ingredients/:ingredientId'
                element={
                  <Modal
                    title='Детали ингредиента'
                    onClose={handleOnCloseModal}
                  >
                    <IngredientDetails />
                  </Modal>
                }
              />
              <Route
                path='/feed/:number'
                element={<OrderModal onClose={handleOnCloseModal} />}
              />
              <Route
                path='/profile/orders/:number'
                element={
                  <ProtectedRoute>
                    <OrderModal onClose={handleOnCloseModal} />
                  </ProtectedRoute>
                }
              />
            </Routes>
          )}
        </>
      )}
    </div>
  );
};

export default App;
