import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AccountEditForm from '../../3widgets/EditForms/AccountEditForm';
import { AuthStatus } from '../../4features/auth/model/types';
import { logoutThunk } from '../../4features/auth/model/authThunks';
import {
  deleteUserThunk,
  getUserByIdThunk,
  uploadPhotoThunk,
} from '../../5entities/user/model/userThunks';
import { useAppDispatch, useAppSelector } from '../../6shared/lib/hooks';
import './AccountPage.css';

export default function AccountPage(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const user = useAppSelector((store) => store.user.selectedUser);
  const data = useAppSelector((store) => store.auth.data);
  const { userId } = useParams<{ userId: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleEdit = (): void => {
    setIsEditing(true);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('img', file);
      try {
        await dispatch(uploadPhotoThunk({ id: Number(userId), formData }));
      } catch (error) {
        console.error(error);
        setErrorMessage('Ошибка загрузки фотографии');
      }
    }
  };

  const handleDelete = async (): Promise<void> => {
    const confirmDelete = window.confirm(
      'Вы уверены, что хотите удалить ваш аккаунт? Это действие необратимо.',
    );
    if (confirmDelete) {
      try {
        await dispatch(deleteUserThunk(Number(userId)));
        await dispatch(logoutThunk());
      } catch (error) {
        console.error(error);
        setErrorMessage('Ошибка удаления пользователя');
      }
    }
  };

  useEffect(() => {
    if (data.status === AuthStatus.authenticated && data.user.id === Number(userId)) {
      dispatch(getUserByIdThunk(Number(userId))).catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, userId]);

  return (
    <div className="account-page">
      <h1 className="account-page__heading">Ваши данные</h1>
      <button className="account_page__button" type="button" onClick={handleDelete}>
        Удалить аккаунт
      </button>
      <div className="account-page__container">
        <div className="account_page__photo-container">
          {user?.img && (
            <>
              <img
                src={`/images/${user.img}`}
                alt="User"
                className="account_page__photo"
                style={{ width: '150px' }}
              />
              {errorMessage && <p className="error">{errorMessage}</p>}

              <div className="account_page__input">
                Заменить изображение
                <br />
                <input
                  className="account_page__input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </>
          )}
        </div>
        <div className="account_page__values-container">
          {isEditing && user ? (
            <AccountEditForm user={user} setIsEditing={setIsEditing} />
          ) : (
            <div className="account_page__values-container">
              <div className="account-page__value">
                <label htmlFor="name">Имя:</label>
                <span>{user?.name}</span>
              </div>
              <div className="account-page__value">
                <label htmlFor="nickname">Ник:</label>
                {user?.nickname ? (
                  <span>{user.nickname}</span>
                ) : (
                  <span className="account_page__no-info">Не указан</span>
                )}
              </div>
              <div className="account-page__value">
                <label htmlFor="email">Email:</label>
                <span>{user?.email}</span>
              </div>
              <div className="account-page__value">
                <label htmlFor="city">Город:</label>
                {user?.city ? (
                  <span>{user.city}</span>
                ) : (
                  <span className="account_page__no-info">Не указан</span>
                )}
              </div>
              <button className="account_page__button" type="button" onClick={handleEdit}>
                Изменить данные
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
