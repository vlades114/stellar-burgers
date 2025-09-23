import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Modal } from '../modal';
import { OrderInfo } from '../order-info';
import { TOrderModalProps } from './type';

export const OrderModal: FC<TOrderModalProps> = ({ onClose }) => {
  const { number } = useParams<{ number: string }>();
  return (
    <Modal title={`Заказ #${number}`} onClose={onClose}>
      <OrderInfo />
    </Modal>
  );
};
