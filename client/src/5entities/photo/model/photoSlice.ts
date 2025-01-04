import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { PhotoType } from './types';
import {
  createPhotoThunk,
  deletePhotoThunk,
  editPhotoInfoThunk,
  getAllPhotosThunk,
  getPhotoByIdThunk,
} from './photoThunks';

type PhotoState = {
  photos: PhotoType[];
  chosenPhoto: PhotoType | null;
};

const initialState: PhotoState = {
  photos: [],
  chosenPhoto: null,
};

export const photoSlice = createSlice({
  name: 'photo',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAllPhotosThunk.fulfilled, (state, action) => {
        state.photos = action.payload;
      })
      .addCase(getPhotoByIdThunk.fulfilled, (state, action: PayloadAction<PhotoType>) => {
        state.chosenPhoto = action.payload;
      })
      .addCase(createPhotoThunk.fulfilled, (state, action: PayloadAction<PhotoType>) => {
        state.photos.unshift(action.payload);
      })
      .addCase(editPhotoInfoThunk.fulfilled, (state, action) => {
        const targetIndex = state.photos.findIndex((m) => m.id === action.payload.id);
        state.photos[targetIndex] = action.payload;
      })
      .addCase(deletePhotoThunk.fulfilled, (state, action) => {
        state.photos = state.photos.filter((photo) => photo.id !== action.payload);
      });
  },
});

export default photoSlice.reducer;
