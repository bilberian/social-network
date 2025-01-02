import React from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import { logoutThunk } from '../../4features/auth/model/authThunks';
import { AuthStatus } from '../../4features/auth/model/types';
import { useAppDispatch, useAppSelector } from '../../6shared/lib/hooks';
import './NavBar.css';

export default function NavBar(): React.JSX.Element {
  const data = useAppSelector((store) => store.auth.data);
  const dispatch = useAppDispatch();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src="/40icon.png" alt="Логотип" className="navbar-logo" />
        {data.status === AuthStatus.authenticated ? data.user.name : 'Гость'}
      </div>
      <div className="navbar__nav">
        <RouterLink to="/" className="nav-link">
          Главная
        </RouterLink>
        {data.status === AuthStatus.authenticated ? (
          <>
            {/* <RouterLink to="/game" className="nav-link">
              Играть
            </RouterLink>
            <RouterLink to="/account" className="nav-link">
              Личный кабинет
            </RouterLink> */}
            <button
              className="nav-link logout-button"
              onClick={() => {
                void dispatch(logoutThunk());
              }}
            >
              Выход
            </button>
          </>
        ) : (
          <>
            <RouterLink to="/auth/signup" className="nav-link">
              Регистрация
            </RouterLink>
            <RouterLink to="/auth/login" className="nav-link">
              Вход
            </RouterLink>
          </>
        )}
      </div>
    </nav>
  );
}
