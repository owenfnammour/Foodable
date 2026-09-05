import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from './pages/Dashboard';
import Log from './pages/Log';
import Diary from './pages/Diary';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path = "/" element = {<Dashboard/>} />
          <Route path="/dashboard" element = {<Dashboard/>}/>
          <Route path='/log' element = {<Log/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path = "/diary" element={<Diary/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
