import React, { useEffect } from 'react';
import PersonCard from '../../3widgets/PersonCard/PersonCard';
import { getUserSubscriptionsThunk } from '../../5entities/user/model/userThunks';
import { useAppDispatch, useAppSelector } from '../../6shared/lib/hooks';
import './Subscription.css';

export default function SupscriptionPage(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const mySubscriptions = useAppSelector((store) => store.user.userSubscriptions);

  useEffect(() => {
    dispatch(getUserSubscriptionsThunk()).catch(console.log);
  }, [dispatch]);

  return (
    <div className="subscription">
      <h1>Мои подписки</h1>
      {mySubscriptions.length === 0 && <p>У вас нет текущих подписок</p>}
      <div className="subscription__list">
        {mySubscriptions.length > 0 &&
          mySubscriptions.map((subscription) => (
            <PersonCard key={subscription.id} person={subscription} />
          ))}
      </div>
    </div>
  );
}
