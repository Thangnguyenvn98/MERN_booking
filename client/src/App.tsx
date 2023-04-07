import {Route, Routes} from "react-router-dom";
import LayoutPage from "./Layout";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";
import { UserContextProvider } from "./pages/UserContext";
import AccountPage from "./pages/AccountPage";

axios.defaults.baseURL = 'http://localhost:4000'
axios.defaults.withCredentials = true

 function App() {
  return (
    <UserContextProvider>
    <Routes>
    <Route path="/" element={<LayoutPage />}>
      <Route index element={<IndexPage />} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path='/register' element={<RegisterPage/>} />
      <Route path="/account/:page" element={<AccountPage/>} />
      <Route path="/account/:page/:action" element={<AccountPage/>} />

    
    </Route>
  </Routes>
  </UserContextProvider>
  );

  }


  export default App
