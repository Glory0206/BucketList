import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BucketList from './pages/BucketList';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/buckedtlist' element={<BucketList/>} />
      </Routes>
    </Router>
  )
}

export default App
