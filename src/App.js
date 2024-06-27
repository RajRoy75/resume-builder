import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import { Suspense } from 'react';
function App() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path='/*' element={<HomePage />} />
          <Route path='/auth' element={<AuthPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
