import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SplaaceInfo from "./components/pages/splaaceInfo";
import SignIn from "./components/pages/sign/signIn";
import SignUp from "./components/pages/sign/signUp";
import ForgotPassword from "./components/pages/login/forgotPassword";
import Verification from "./components/pages/login/verification";
import ResetPassword from "./components/pages/login/resetPassword";
import ChooseCar from "./components/pages/choose/chooseCar";
import ChooseCity from "./components/pages/choose/chooseCity";
import ChooseCountry from "./components/pages/choose/chooseCountry";

import VisaDocupload from "./components/pages/visa/visaDocupload";
import VisaOptions from "./components/pages/visa/visaOptions";

import Category from "./components/pages/category";
import PickupLocation from "./components/pages/pickupLocation";
import RentCaroptions from "./components/pages/rentCaroptions";

import TourTickets from "./components/pages/tourTickets";
import PageNotFound from "./components/common/404Page";
import Success from "./components/pages/success";
import Cancel from "./components/pages/cancel";
import Profile from "./components/pages/profile";
import BookingHistory from "./components/pages/bookingHistory";

// import About from ''

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SplaaceInfo />} />
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/resetPassword" element={<ResetPassword />} />

          <Route path="/chooseCar" element={<ChooseCar />} />
          <Route path="/chooseCity" element={<ChooseCity />} />
          <Route path="/chooseCountry" element={<ChooseCountry />} />

          <Route path="/visaDocupload" element={<VisaDocupload />} />
          <Route path="/visaOptions" element={<VisaOptions />} />

          <Route path="/category" element={<Category />} />
          <Route path="/pickupLocation" element={<PickupLocation />} />
          <Route path="/rentCaroptions" element={<RentCaroptions />} />
          <Route path="/tourTickets" element={<TourTickets />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/bookingHistory" element={<BookingHistory />} />

          

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
