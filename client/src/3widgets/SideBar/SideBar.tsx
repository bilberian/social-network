import React, { useEffect } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import { AuthStatus } from '../../4features/auth/model/types';
import { getUserByIdThunk } from '../../5entities/user/model/userThunks';
import { useAppDispatch, useAppSelector } from '../../6shared/lib/hooks';
import './SideBar.css';

export default function Sidebar(): React.JSX.Element {
  const data = useAppSelector((store) => store.auth.data);

  const dispatch = useAppDispatch();
  const user = useAppSelector((store) => store.user.selectedUser);

  useEffect(() => {
    if (data.status === AuthStatus.authenticated) {
      dispatch(getUserByIdThunk(data.user.id)).catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.status, dispatch]);

  return (
    <div className="sidebar">
      {data.status === AuthStatus.authenticated && (
        <>
          {user?.img && (
            <img
              src={`/images/${user.img}`}
              alt="User"
              className="user-photo"
              style={{ height: '120px', maxWidth: '150px', marginTop: '30px' }}
            />
          )}
          <div className="sidebar__nav">
            <RouterLink to={`/account/${String(data.user.id)}`} className="side-link">
              <i className="fi fi-tr-folder-minus"></i>
              <span>Мой аккаунт</span>
            </RouterLink>
            <RouterLink to="/game" className="side-link">
              <i className="fi fi-tr-people-poll"></i>
              Мои подписки
            </RouterLink>
            <RouterLink to="/game" className="side-link">
              <i className="fi fi-tr-subscription"></i>
              Подписчики
            </RouterLink>
            <RouterLink to="/game" className="side-link">
              <i className="fi fi-tr-camera"></i>
              Фотографии
            </RouterLink>
            <RouterLink to="/game" className="side-link">
              <i className="fi fi-tr-circle-envelope"></i>
              Сообщения
            </RouterLink>
          </div>
        </>
      )}
    </div>
  );
}
