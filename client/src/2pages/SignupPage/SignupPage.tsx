import React, { useTransition } from 'react';
import { useForm, Controller } from 'react-hook-form';
import BeatLoader from 'react-spinners/BeatLoader';
import { signupThunk } from '../../4features/auth/model/authThunks';
import { useAppDispatch } from '../../6shared/lib/hooks';

type SignupFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignupPage(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const [loading, startTransition] = useTransition();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignupFormValues>();

  const onSubmit = (data: SignupFormValues): void => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key as keyof SignupFormValues]);
    });
    startTransition(async () => {
      await dispatch(signupThunk(formData));
    });
  };

  return (
    <div className="signup-container">
      <h1 className="signup-heading">Регистрация</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="signup-form" noValidate>
        {/* Имя */}
        <div className="form-group">
          <label htmlFor="name">Имя</label>
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Имя обязательно' }}
            render={({ field }) => (
              <input {...field} type="text" id="name" placeholder="Введите имя" />
            )}
          />
          {errors.name && <p className="error">{errors.name.message}</p>}
        </div>

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
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                message:
                  'Пароль должен содержать минимум 6 символов, включая заглавные и строчные буквы, цифры и специальные символы',
              },
            }}
            render={({ field }) => (
              <input {...field} type="password" id="password" placeholder="Введите пароль" />
            )}
          />
          {errors.password && <p className="error">{errors.password.message}</p>}
        </div>

        {/* Подтверждение пароля */}
        <div className="form-group">
          <label htmlFor="confirmPassword">Подтвердите пароль</label>
          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: 'Подтвердите пароль',
              validate: (value, { password }) => value === password || 'Пароли не совпадают',
            }}
            render={({ field }) => (
              <input
                {...field}
                type="password"
                id="confirmPassword"
                placeholder="Подтвердите пароль"
              />
            )}
          />
          {errors.confirmPassword && <p className="error">{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" className="signup-button" disabled={loading}>
          {loading ? <BeatLoader size="10px" color="#e3d9d9" /> : 'Создать аккаунт'}
        </button>
      </form>
    </div>
  );
}
