import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '@store';
import { fetchFeeds, getFeedsLoading, getFeedsOrders } from '@slices';
import { get } from 'http';
export const Feed: FC = () => {
  const orders: TOrder[] = useSelector(getFeedsOrders);
  const isFeedsLoading = useSelector(getFeedsLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFeeds());
  }, []);

  if (isFeedsLoading) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(fetchFeeds());
      }}
    />
  );
};
