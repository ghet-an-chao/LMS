import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/test' element={<div className="p-8 text-center">Test Page</div>} />
      {/* Thêm route khác ở đây */}
    </Routes>
  );
};

export default App;
