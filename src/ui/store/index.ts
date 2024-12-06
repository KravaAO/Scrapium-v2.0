import { configureStore } from '@reduxjs/toolkit';
import tabReducer from './tabSlice'; // Імпортуйте ваш слайс
import userSlice from './userSlice';
// Створення Redux store
const store = configureStore({
  reducer: {
    tabs: tabReducer, // Підключення ред'юсера
    user: userSlice,
  },
});

export default store;

// Тип кореневого стану
export type RootState = ReturnType<typeof store.getState>;

// Тип диспетчера екшенів
export type AppDispatch = typeof store.dispatch;
