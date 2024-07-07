import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from "react-query/devtools";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {

  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path='/*' element={<HomePage />} />
            <Route path='/auth' element={<AuthPage />} />
          </Routes>
        </Suspense>
        <ToastContainer position="top-right" theme="dark"/>
        <ReactQueryDevtools initialIsOpen={false}/>
      </QueryClientProvider>

    </>
  );
}

export default App;
