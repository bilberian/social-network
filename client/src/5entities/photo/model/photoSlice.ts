import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { PhotoType } from './types';
import { getAllPhotosThunk, getPhotoByIdThunk } from './photoThunks';

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
      });
  },
});

export default photoSlice.reducer;
