import { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import store from '@/store';
import { router } from '@/router';
import Layout from '@/components/organisms/Layout';
import Loading from '@/components/ui/Loading';
import '@/index.css';

// Lazy load pages for code splitting and optimal performance
const Home = lazy(() => import('@/components/pages/Home'));
const HotelDetail = lazy(() => import('@/components/pages/HotelDetail'));
const Checkout = lazy(() => import('@/components/pages/Checkout'));
const Confirmation = lazy(() => import('@/components/pages/Confirmation'));
const Bookings = lazy(() => import('@/components/pages/Bookings'));
const SavedHotels = lazy(() => import('@/components/pages/SavedHotels'));

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      pauseOnHover
    />
  </Provider>
);