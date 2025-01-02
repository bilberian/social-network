import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import PersonCard from '../../3widgets/PersonCard/PersonCard';
import { AuthStatus } from '../../4features/auth/model/types';
import { fetchUsersThunk, getAllUsersThunk } from '../../5entities/user/model/userThunks';
import type { UserType } from '../../5entities/user/model/types';
import { setSortOption } from '../../5entities/user/model/userSlice';
import { useAppDispatch, useAppSelector } from '../../6shared/lib/hooks';
import './MainPage.css';

type FormValues = {
  search: string;
};

export default function MainPage(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const data = useAppSelector((store) => store.auth.data);
  const persons = useAppSelector((store) => store.user.users);
  const { register, watch } = useForm<FormValues>();
  const input = watch('search', '');
  const foundUsers = useAppSelector((state) => state.user.foundUsers);
  const sortOption = useAppSelector((store) => store.user.sortOption);

  useEffect(() => {
    dispatch(getAllUsersThunk()).catch(console.error);
  }, [dispatch]);

  useEffect(() => {
    let timeoutId = NaN;
    if (input) {
      timeoutId = setTimeout(() => {
        void dispatch(fetchUsersThunk(input));
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [input, dispatch]);

  const usersToDisplay = input ? foundUsers : persons;

  const sortedUsers = (): UserType[] =>
    [...usersToDisplay].sort((a, b) => {
      switch (sortOption) {
        case 'nameAsc':
          return a.name.localeCompare(b.name);
        case 'nameDesc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  return (
    <>
      <div className="main-page">
        <h1 className="main-page__heading">Список пользователей</h1>
        {data.status !== AuthStatus.authenticated && (
          <p className="main-page__text">
            Чтобы подписаться на аккаунт пользователя, пожалуйста, войдите в свой аккаунт или
            зарегистрируйтесь.
          </p>
        )}
        <div className="search-input">
          <label htmlFor="search" className="search-input__label">
            <i className="fi fi-tr-member-search"></i> Поиск
          </label>
          <input
            type="text"
            id="search"
            placeholder="Введите имя или ник"
            {...register('search')}
            aria-label="search"
            className="search-input__field"
          />
        </div>
        <div className="sort-controls">
          <label htmlFor="sortSelect">Сортировка:</label>
          <select
            id="sortSelect"
            value={sortOption}
            onChange={(e) => dispatch(setSortOption(e.target.value))}
            style={{ marginLeft: '10px' }}
          >
            <option value="">Без сортировки</option>
            <option value="nameAsc">По имени (по возрастанию)</option>
            <option value="nameDesc">По имени (по убыванию)</option>
          </select>
        </div>
        <div className="main-page__list">
          {sortedUsers().length > 0 ? (
            sortedUsers().map((person) => <PersonCard key={person.id} person={person} />)
          ) : (
            <p className="main-page__text">Пользователей не найдено.</p>
          )}
        </div>
      </div>
    </>
  );
}
