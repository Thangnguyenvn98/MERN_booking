import {Route, Routes} from "react-router-dom";
import LayoutPage from "./Layout";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";

axios.defaults.baseURL = 'http://localhost:4000'

 function App() {
  return (
    <Routes>
    <Route path="/" element={<LayoutPage />}>
      <Route index element={<IndexPage />} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path='/register' element={<RegisterPage/>} />
   
    </Route>
  </Routes>
  );

  }


  export default App
