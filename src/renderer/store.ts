// store.ts
import { configureStore } from '@reduxjs/toolkit';

// Импортируй редюсеры здесь
import exampleReducer from './slices/exampleSlice';

export const store = configureStore({
  reducer: {
    example: exampleReducer,
    // другие редюсеры
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
