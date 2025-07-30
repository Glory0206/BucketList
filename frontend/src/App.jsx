import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BucketListAll from './pages/BucketListAll';
import BucketListSplit from './pages/BucketListSplit';
import Home from './pages/Home';
import Header from './components/Header';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setNavigator } from './utils/navigate';

function NavigatorInitializer() {
  const nav = useNavigate();
  useEffect(() => {
    setNavigator(nav);
  }, [nav]);

  return null;
}

function App() {
  return (
    <Router>
      <NavigatorInitializer />
      <Header/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/bucketlist/all' element={<BucketListAll/>} />
        <Route path='/bucketlist/split' element={<BucketListSplit/>} />
      </Routes>
    </Router>
  )
} 

export default App
