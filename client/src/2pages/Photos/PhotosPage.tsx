import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../6shared/lib/hooks';
import { getAllPhotosThunk } from '../../5entities/photo/model/photoThunks';
import { AuthStatus } from '../../4features/auth/model/types';

export default function PhotosPage(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const photos = useAppSelector((store) => store.photo.photos);
  const data = useAppSelector((store) => store.auth.data);

  useEffect(() => {
    if (data.status === AuthStatus.authenticated) {
      dispatch(getAllPhotosThunk(data.user.id)).catch(console.error);
    }
  }, []);
  return (
    <div>
      <h1>Photos</h1>
      {photos.map((photo) => (
        <div key={photo.id}>
          <img
            src={`/images/${photo.pic}`}
            alt="User"
            className="photos_page__photo"
            style={{ width: '250px' }}
          />
          {photo.desc}
        </div>
      ))}
    </div>
  );
}
