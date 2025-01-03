import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../6shared/lib/hooks';
import { getUserFollowersThunk } from '../../5entities/user/model/userThunks';
import PersonCard from '../../3widgets/PersonCard/PersonCard';

export default function SubscribersPage(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const followers = useAppSelector((store) => store.user.followers);

  useEffect(() => {
    dispatch(getUserFollowersThunk()).catch(console.log);
  }, [dispatch]);

  return (
    <div className="subscription">
      <h1>Мои подписчики</h1>
      {followers.length === 0 && <p>У вас нет подписчиков</p>}
      <div className="subscription__list">
        {followers.length > 0 &&
          followers.map((follower) => (
            <PersonCard key={follower.id} person={follower} />
          ))}
      </div>
    </div>
  );
}
