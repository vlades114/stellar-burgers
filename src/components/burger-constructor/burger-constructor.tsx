import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '@store';
import {
  createOrder,
  clearOrderModal,
  getBurgerConstructor,
  getOrderRequest,
  getOrderDetailsData,
  getIsAuthenticated,
  resetConstructor
} from '@slices';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(getBurgerConstructor);
  const orderRequest = useSelector(getOrderRequest);
  const orderModalData = useSelector(getOrderDetailsData);
  const isAuthenticated = useSelector(getIsAuthenticated);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onOrderClick = async () => {
    if (!constructorItems.bun || orderRequest || !isAuthenticated) {
      if (!isAuthenticated) {
        return navigate('/login');
      }
      return;
    }

    const burgerItem: string[] = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id),
      constructorItems.bun._id
    ];

    const resultAction = await dispatch(createOrder(burgerItem));

    if (createOrder.fulfilled.match(resultAction)) {
      dispatch(resetConstructor());
    }
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData?.order ? orderModalData.order : null}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
