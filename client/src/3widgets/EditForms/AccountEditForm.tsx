import React, { useState, useTransition } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { BeatLoader } from 'react-spinners';
import type { UserType } from '../../5entities/user/model/types';
import { editAccountValuesThunk } from '../../5entities/user/model/userThunks';
import { useAppDispatch } from '../../6shared/lib/hooks';

type AccountFormValues = {
  name: string;
  nickname: string;
  email: string;
  city: string;
};

type AccountFormProps = {
  user: UserType;
  setIsEditing: (isEditing: boolean) => void;
};

type ResActionPayload = {
  text: string;
};

export default function AccountEditForm({
  user,
  setIsEditing,
}: AccountFormProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, startTransition] = useTransition();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AccountFormValues>({
    defaultValues: {
      name: user.name || '',
      nickname: user.nickname ?? '',
      email: user.email || '',
      city: user.city ?? '',
    },
  });

  const onSubmit = (info: AccountFormValues): void => {
    const formData = new FormData();
    Object.keys(info).forEach((key) => {
      formData.append(key, info[key as keyof AccountFormValues]);
    });
    startTransition(async () => {
      const resultAction = await dispatch(editAccountValuesThunk({ id: user.id, formData }));
      if (editAccountValuesThunk.rejected.match(resultAction)) {
        setErrorMessage((resultAction.payload as ResActionPayload).text);
      } else {
        setErrorMessage(null);
        setIsEditing(false);
        reset(info);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="account_page__values-container">
        <div className="account-page__value-edit">
          <label htmlFor="name">Имя:</label>
          <Controller
            name="name"
            control={control}
            rules={{
              required: 'Имя обязательно',
            }}
            render={({ field }) => <input {...field} placeholder="Добавьте имя" />}
          />
        </div>
        {errors.name && <p className="error">{errors.name.message}</p>}
        <div className="account-page__value-edit">
          <label htmlFor="nickname">Ник:</label>
          <Controller
            name="nickname"
            control={control}
            render={({ field }) => <input {...field} placeholder="Добавьте никнейм" />}
          />
        </div>
        <div className="account-page__value-edit">
          <label htmlFor="email">Email:</label>
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'Email обязателен',
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-z]{2,3}/gm,
                message: 'Некорректный email',
              },
            }}
            render={({ field }) => (
              <input {...field} type="email" id="email" placeholder="Введите email" />
            )}
          />
        </div>
        {errors.email && <p className="error">{errors.email.message}</p>}
        <div className="account-page__value-edit">
          <label htmlFor="city">Город:</label>
          <Controller
            name="city"
            control={control}
            render={({ field }) => <input {...field} placeholder="Добавьте город" />}
          />
        </div>
      </div>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <div className="account_page__button-container">
        {' '}
        <button type="submit" className="account_page__button" disabled={loading}>
          {loading ? <BeatLoader size="10px" color="#e3d9d9" /> : 'Сохранить изменения'}
        </button>
        <button className="account_page__button" type="button" onClick={() => setIsEditing(false)}>
          Отменить
        </button>
      </div>
    </form>
  );
}
