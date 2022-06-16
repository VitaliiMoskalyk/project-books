import { Suspense, lazy, useLayoutEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Header from './components/Header/Header';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import { Spinner } from './components/Spinner/Spinner';

import GoogleAuth from './components/GoogleAuth/GoogleAuth';
import actions from './redux/auth/auth-actions';
import { useWindowWidth } from '@react-hook/window-size';

const LoginPage = lazy(() => import('./pages/LoginPage/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage/RegisterPage'));
const TrainingPage = lazy(() => import('./pages/TrainingPage/TrainingPage'));

const LibraryPage = lazy(() => import('./pages/LibraryPage/LibraryPage'));
const ResumePage = lazy(() => import('./pages/ResumePage/ResumePage'));
const QuoteSection = lazy(() =>
  import('./components/QuoteSection/QuoteSection'),
);

function App() {
  const onlyWidth = useWindowWidth();
  const dispatch = useDispatch();

  const { isLoggedIn, token, isPageRefreshing } = useSelector(
    state => state.auth,
  );

  useLayoutEffect(() => {
    if (!isLoggedIn && token) {
      dispatch(actions.fetchCurrentUser());
    }
  }, [dispatch, isLoggedIn, token]);

  return isPageRefreshing ? (
    <Spinner />
  ) : (
    <Suspense fallback={<Spinner />}>
      <Header />
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route
            index
            element={onlyWidth < 768 ? <QuoteSection /> : <LoginPage />}
          />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          <Route path="library" element={<LibraryPage />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="training" element={<TrainingPage />} />
          <Route path="*" element={<Navigate to="login" replace />} />
          <Route />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
