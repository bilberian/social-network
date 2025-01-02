import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary';
import { store } from './store';
import RouterProvider from './router/RouterProvider';
import { injectStore } from '../6shared/api/axiosInstance';
import LoadingSpinner from '../6shared/ui/LoadingSpinner';

injectStore(store);

function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <ErrorBoundary fallback={<h1>Возникла ошибка</h1>}>
        <Suspense fallback={<LoadingSpinner />}>
          <Provider store={store}>
            <RouterProvider />
          </Provider>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
