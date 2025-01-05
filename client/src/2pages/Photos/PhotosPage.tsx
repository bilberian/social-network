import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../6shared/lib/hooks';
import { createPhotoThunk, getAllPhotosThunk } from '../../5entities/photo/model/photoThunks';
import { useParams } from 'react-router';
import PhotoCard from '../../3widgets/PhotoCard/PhotoCard';
import './PhotosPage.css';

export default function PhotosPage(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const photos = useAppSelector((store) => store.photo.photos);
  const { ownerId } = useParams<{ ownerId: string }>();
  const [isPending, setIsPending] = useState(false);
  const [show, setShow] = useState(false);

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
    <div className="photos_page">
      <h1 className="photos_page__heading">Фотографии</h1>
      {photos.length === 0 && <p>У вас нет фото</p>}
      <button
        className="photos_page__add_button"
        type="button"
        onClick={() => setShow((prev) => !prev)}
      >
        {show ? 'Закрыть' : 'Добавить фото'}
      </button>
      {show && (
        <form className="photos_page__add_form" onSubmit={handleSubmit}>
          <div className="photos_page__input">
            <input type="file" name="pic" required style={{ display: 'none' }} id="addfile-input" />
            <label htmlFor="addfile-input" className="addfile-label">
              Выбери картинку
            </label>
          </div>

          <div className="form-group">
            <textarea
              name="desc"
              cols={50}
              rows={5}
              placeholder="Добавь описание"
              required
            />
          </div>
          <button className="photos_page__add_button" disabled={isPending} type="submit">
            {isPending ? 'Загрузка...' : 'Добавить'}
          </button>
        </form>
      )}
      <div className="photo-card__container">
        {photos.length > 0 && photos.map((photo) => <PhotoCard key={photo.id} photo={photo} />)}
      </div>
    </div>
  );
}
