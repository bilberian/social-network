import React, { useState, useTransition } from 'react';
import type { PhotoType } from '../../5entities/photo/model/types';
import { useAppDispatch, useAppSelector } from '../../6shared/lib/hooks';
import { AuthStatus } from '../../4features/auth/model/types';
import { deletePhotoThunk, editPhotoInfoThunk } from '../../5entities/photo/model/photoThunks';
import { Controller, useForm } from 'react-hook-form';
import { BeatLoader } from 'react-spinners';

type PhotoCardProps = {
  photo: PhotoType;
};

type PhotoEditFormValue = {
  desc: string;
};

export default function PhotoCard({ photo }: PhotoCardProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const data = useAppSelector((store) => store.auth.data);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, startTransition] = useTransition();

  const { control, handleSubmit, reset } = useForm<PhotoEditFormValue>({
    defaultValues: {
      desc: photo.desc ?? '',
    },
  });

  const handleEdit = (): void => {
    setIsEditing(true);
  };

  const hadleEditInfo = (info: PhotoEditFormValue): void => {
    const formData = new FormData();
    Object.keys(info).forEach((key) => {
      formData.append(key, info[key as keyof PhotoEditFormValue]);
    });

    startTransition(async () => {
      await dispatch(editPhotoInfoThunk({ ownerId: photo.ownerId, photoId: photo.id, formData }));
      setIsEditing(false);
      reset(info);
    });
  };

  return (
    <div className="photo-card">
      <img
        src={`/images/${photo.pic}`}
        alt="photo"
        className="photo-card__img"
        style={{ width: '250px' }}
      />

      {isEditing ? (
        <form onSubmit={handleSubmit(hadleEditInfo)} noValidate>
          <div className="photo-card__value-edit">
            <Controller
              name="desc"
              control={control}
              render={({ field }) => <input {...field} placeholder="Добавьте описание" />}
            />
          </div>
          <div className="photo-card__button-container">
            {' '}
            <button type="submit" className="photo-card__button" disabled={loading}>
              {loading ? <BeatLoader size="10px" color="#e3d9d9" /> : 'Сохранить изменения'}
            </button>
            <button
              className="photo-card__button"
              type="button"
              onClick={() => {
                setIsEditing(false);
                reset({ desc: photo.desc ?? '' });
              }}
            >
              Отменить
            </button>
          </div>
        </form>
      ) : (
        <p className="photo-card__text">{photo.desc}</p>
      )}
      {data.status === AuthStatus.authenticated && data.user.id === photo.ownerId && (
        <div className="photo-card__buttons">
          <div className="photo-card__button-edit" onClick={handleEdit}>
            <i className="fi fi-br-pen-square"></i>
            <i className="fi fi-tr-pen-square"></i>
          </div>

          <div
            className="photo-card__button-delete"
            onClick={() => dispatch(deletePhotoThunk({ ownerId: data.user.id, photoId: photo.id }))}
          >
            <i className="fi fi-br-octagon-xmark"></i>
            <i className="fi fi-tr-octagon-xmark"></i>
          </div>
        </div>
      )}
    </div>
  );
}
