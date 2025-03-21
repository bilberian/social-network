import React from 'react';
import { AuthStatus } from '../../4features/auth/model/types';
import type { UserType } from '../../5entities/user/model/types';
import {
  getUserSubscriptionsThunk,
  subscribeToUserThunk,
  unsubscribeFromUserThunk,
} from '../../5entities/user/model/userThunks';
import { useAppDispatch, useAppSelector } from '../../6shared/lib/hooks';
import './PersonCard.css';

type PersonCardProps = {
  person: UserType;
};

export default function PersonCard({ person }: PersonCardProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const data = useAppSelector((store) => store.auth.data);
  const mySubscriptions = useAppSelector((store) => store.user.userSubscriptions);
  const mySubsIds = mySubscriptions.map((subscription) => subscription.id);

  const amSubscribed = mySubsIds.some((id) => id === person.id);

  const handleSubscribe = async (): Promise<void> => {
    try {
      await dispatch(subscribeToUserThunk(person.id));
      await dispatch(getUserSubscriptionsThunk());
    } catch (error) {
      console.error('Ошибка подписки:', error);
    }
  };

  const handleUnsubscribe = async (): Promise<void> => {
    try {
      await dispatch(unsubscribeFromUserThunk(person.id));
      await dispatch(getUserSubscriptionsThunk());
    } catch (error) {
      console.error('Ошибка отписки:', error);
    }
  };

  return (
    <div className="person-card">
      <img src={`/images/${person.img}`} alt="User" className="person-card__photo" />
      <div className="person-card__info">
        <p className="person-card__text">Имя: {person.name}</p>
        <p className="person-card__text">
          Ник:{' '}
          {person.nickname ? (
            <span>{person.nickname}</span>
          ) : (
            <span className="account_page__no-info">Не указан</span>
          )}
        </p>

        {data.status === AuthStatus.authenticated && data.user.id !== person.id && (
          <>
            {amSubscribed ? (
              <button className="person-card__button-unsubscribe" onClick={handleUnsubscribe}>
                Отписаться
              </button>
            ) : (
              <button className="person-card__button-subscribe" onClick={handleSubscribe}>
                Подписаться
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
