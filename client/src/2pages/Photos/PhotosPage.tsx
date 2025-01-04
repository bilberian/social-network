import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../6shared/lib/hooks';
import { createPhotoThunk, getAllPhotosThunk } from '../../5entities/photo/model/photoThunks';

import { useParams } from 'react-router';
import PhotoCard from '../../3widgets/PhotoCard/PhotoCard';

export default function PhotosPage(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const photos = useAppSelector((store) => store.photo.photos);
  const { ownerId } = useParams<{ ownerId: string }>();
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const file = formData.get('pic');

    if (!file) {
      console.error('Файл не выбран');
      setIsPending(false);
      return;
    }
    try {
      await dispatch(createPhotoThunk({ ownerId: Number(ownerId), formData }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    dispatch(getAllPhotosThunk(Number(ownerId))).catch(console.error);
  }, []);
  return (
    <div>
      <h1>Photos</h1>
      {photos.length === 0 && <p>У вас нет фото</p>}
      <button className="photos_page__button" type="button">
        Добавить фото (not working yet)
      </button>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="pic">Выбери картинку</label>
          <input type="file" name="pic" required />
        </div>
        <div className="form-group">
          <label htmlFor="desc">Описание</label>
          <textarea name="desc" rows={3} placeholder="О чём ты хочешь написать?" required />
        </div>
        <button disabled={isPending} type="submit">
          {isPending ? 'Загрузка...' : 'Добавить'}
        </button>
      </form>
      {photos.length > 0 && photos.map((photo) => <PhotoCard key={photo.id} photo={photo} />)}
    </div>
  );
}
