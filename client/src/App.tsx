import {Route, Routes} from "react-router-dom";
import LayoutPage from "./Layout";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";
import { UserContextProvider } from "./pages/UserContext";
import ProfilePage from "./pages/ProfilePage";
import PlacesFormPage from "./pages/PlacesFormPage";
import PlacesPage from "./pages/PlacesPage";
import PlaceDetails from "./pages/PlaceDetails";
import BookingsPage from "./pages/BookingsPage";
import BookingDetail from "./pages/BookingDetail";

axios.defaults.baseURL = process.env.REACT_APP_API_URL
axios.defaults.withCredentials = true

 function App() {
  return (
    <UserContextProvider>
    <Routes>
    <Route path="/" element={<LayoutPage />}>
      <Route index element={<IndexPage />} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path='/register' element={<RegisterPage/>} />
      <Route path="/account" element={<ProfilePage/>} />

      <Route path="/account/accomodations" element={<PlacesPage/>} />
      <Route path="/account/accomodations/new" element={<PlacesFormPage/>} />
      <Route path="/account/accomodations/:id" element={<PlacesFormPage/>} />
      <Route path="/accomodations/:id" element={<PlaceDetails/>} />

      <Route path="/account/bookings" element={<BookingsPage/>} />
      <Route path="/account/bookings/:id" element={<BookingDetail/>} />



    
    </Route>
  </Routes>
  </UserContextProvider>
  );

  }


  export default App
