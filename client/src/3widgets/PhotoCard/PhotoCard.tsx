import React, { useState, useTransition } from 'react';
import type { PhotoType } from '../../5entities/photo/model/types';
import { useAppDispatch, useAppSelector } from '../../6shared/lib/hooks';
import { AuthStatus } from '../../4features/auth/model/types';
import { deletePhotoThunk, editPhotoInfoThunk } from '../../5entities/photo/model/photoThunks';
import { Controller, useForm } from 'react-hook-form';
import { BeatLoader } from 'react-spinners';
import './PhotoCard.css';

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
          <div className="photo-card__card__editform_button-container">
            {' '}
            <button type="submit" className="photo-card__editform-button" disabled={loading}>
              {loading ? <BeatLoader size="10px" color="#e3d9d9" /> : 'Сохранить изменения'}
            </button>
            <button
              className="photo-card__editform-button"
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
            <svg
              className="photo-card__button-edit_icon"
              xmlns="http://www.w3.org/2000/svg"
              id="Layer_1"
              data-name="Layer 1"
              viewBox="0 0 24 24"
              fill="#854847"
            >
              <path d="m19,0H5C2.243,0,0,2.243,0,5v14c0,2.757,2.243,5,5,5h14c2.757,0,5-2.243,5-5V5c0-2.757-2.243-5-5-5Zm3,19c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V5c0-1.654,1.346-3,3-3h14c1.654,0,3,1.346,3,3v14ZM13.879,6.379l-6.707,6.707c-.755.755-1.172,1.76-1.172,2.828v1.586c0,.553.448,1,1,1h1.586c1.068,0,2.073-.416,2.828-1.172l6.707-6.707c1.17-1.17,1.17-3.072,0-4.242-1.134-1.133-3.11-1.133-4.243,0Zm-3.879,9.535c-.373.372-.888.586-1.414.586h-.586v-.586c0-.534.208-1.036.586-1.414l4.25-4.25,1.414,1.414-4.25,4.25Zm6.707-6.707l-1.043,1.043-1.414-1.414,1.043-1.043c.377-.379,1.036-.379,1.414,0,.39.39.39,1.024,0,1.414Z" />
            </svg>

            <svg
              className="photo-card__button-edit_icon-hover"
              xmlns="http://www.w3.org/2000/svg"
              id="Layer_1"
              data-name="Layer 1"
              viewBox="0 0 24 24"
              fill="#854847"
            >
              <path d="m14.25,11.664l-4.25,4.25c-.373.372-.888.586-1.414.586h-.586v-.586c0-.534.208-1.036.586-1.414l4.25-4.25,1.414,1.414Zm1.043-3.871l-1.043,1.043,1.414,1.414,1.043-1.043c.39-.39.39-1.024,0-1.414-.378-.379-1.037-.379-1.414,0Zm8.707-2.793v14c0,2.757-2.243,5-5,5H5c-2.757,0-5-2.243-5-5V5C0,2.243,2.243,0,5,0h14c2.757,0,5,2.243,5,5Zm-5.878,1.379c-1.134-1.133-3.11-1.133-4.243,0l-6.707,6.707c-.755.755-1.172,1.76-1.172,2.828v1.586c0,.553.448,1,1,1h1.586c1.068,0,2.073-.416,2.828-1.172l6.707-6.707c1.17-1.17,1.17-3.072,0-4.242Z" />
            </svg>
          </div>

          <div
            className="photo-card__button-delete"
            onClick={() => dispatch(deletePhotoThunk({ ownerId: data.user.id, photoId: photo.id }))}
          >
            <svg
              className="photo-card__button-delete_icon"
              xmlns="http://www.w3.org/2000/svg"
              id="Outline"
              viewBox="0 0 24 24"
              width="27"
              height="27"
              fill="#854847"
            >
              <path d="M21,4H17.9A5.009,5.009,0,0,0,13,0H11A5.009,5.009,0,0,0,6.1,4H3A1,1,0,0,0,3,6H4V19a5.006,5.006,0,0,0,5,5h6a5.006,5.006,0,0,0,5-5V6h1a1,1,0,0,0,0-2ZM11,2h2a3.006,3.006,0,0,1,2.829,2H8.171A3.006,3.006,0,0,1,11,2Zm7,17a3,3,0,0,1-3,3H9a3,3,0,0,1-3-3V6H18Z" />
              <path d="M10,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,10,18Z" />
              <path d="M14,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,14,18Z" />
            </svg>
            <svg className="photo-card__button-delete_icon-hover"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              id="Capa_1"
              x="0px"
              y="0px"
              viewBox="0 0 512 512"
              xmlSpace="preserve"
              width="27"
              height="27"
              fill="#854847"
            >
              <g>
                <path d="M448,85.333h-66.133C371.66,35.703,328.002,0.064,277.333,0h-42.667c-50.669,0.064-94.327,35.703-104.533,85.333H64   c-11.782,0-21.333,9.551-21.333,21.333S52.218,128,64,128h21.333v277.333C85.404,464.214,133.119,511.93,192,512h128   c58.881-0.07,106.596-47.786,106.667-106.667V128H448c11.782,0,21.333-9.551,21.333-21.333S459.782,85.333,448,85.333z    M234.667,362.667c0,11.782-9.551,21.333-21.333,21.333C201.551,384,192,374.449,192,362.667v-128   c0-11.782,9.551-21.333,21.333-21.333c11.782,0,21.333,9.551,21.333,21.333V362.667z M320,362.667   c0,11.782-9.551,21.333-21.333,21.333c-11.782,0-21.333-9.551-21.333-21.333v-128c0-11.782,9.551-21.333,21.333-21.333   c11.782,0,21.333,9.551,21.333,21.333V362.667z M174.315,85.333c9.074-25.551,33.238-42.634,60.352-42.667h42.667   c27.114,0.033,51.278,17.116,60.352,42.667H174.315z" />
              </g>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
