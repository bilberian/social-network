import React from 'react';
import type { UserType } from '../../5entities/user/model/types';
import { useAppSelector } from '../../6shared/lib/hooks';
import { AuthStatus } from '../../4features/auth/model/types';
import './PersonCard.css';

type PersonCardProps = {
  person: UserType;
};

export default function PersonCard({ person }: PersonCardProps): React.JSX.Element {
  const data = useAppSelector((store) => store.auth.data);
  return (
    <div className="person-card">
      <img src={`/images/${person.img}`} alt="User" className="person-card__photo" />
      <div className="person-card__info">
        <p className='person-card__text'>Имя: {person.name}</p>
        <p className="person-card__text">Ник: {person.nickname ? (
                  <span>{person.nickname}</span>
                ) : (
                  <span className="account_page__no-info">Не указан</span>
                )}</p>
       
                
        {data.status === AuthStatus.authenticated && data.user.id !== person.id && (
          <button className="person-card__button">Подписаться</button>
        )}
      </div>
    </div>
  );
}
