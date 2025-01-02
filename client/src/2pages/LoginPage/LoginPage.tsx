import React, { useState, useTransition } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { loginThunk } from '../../4features/auth/model/authThunks';
import { useAppDispatch } from '../../6shared/lib/hooks';
import { BeatLoader } from 'react-spinners';

type LoginFormValues = {
  email: string;
  password: string;
};

type ResActionPayload = {
  error: string;
};

export default function LoginPage(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const [loading, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormValues): void => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key as keyof LoginFormValues]);
    });

    startTransition(async () => {
      const resultAction = await dispatch(loginThunk(formData));
      if (loginThunk.rejected.match(resultAction)) {
        setErrorMessage((resultAction.payload as ResActionPayload).error);
      } else {
        setErrorMessage(null);
      }
    });
  };

  return (
    <div className="login-container">
      <h1 className="login-heading">Вход в аккаунт</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="login-form" noValidate>
        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
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
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>

        {/* Пароль */}
        <div className="form-group">
          <label htmlFor="password">Пароль</label>
          <Controller
            name="password"
            control={control}
            rules={{
              required: 'Пароль обязателен',
            }}
            render={({ field }) => (
              <input {...field} type="password" id="password" placeholder="Введите пароль" />
            )}
          />
          {errors.password && <p className="error">{errors.password.message}</p>}
        </div>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? <BeatLoader size="10px" color="#e3d9d9" /> : 'Войти'}
        </button>
      </form>
    </div>
  );
}
