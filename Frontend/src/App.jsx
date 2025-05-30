import { Navbar } from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
// import { Customers } from "./pages/Customers";
import { Admin } from "./pages/Admin/Admin";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { AddCustomer} from "./pages/Admin/AddCustomer";
import { ViewCustomers } from "./pages/Admin/ViewCustomers";
import { AddDesign } from "./pages/Admin/AddDesign";
import { Logout } from "./pages/Logout";
import { About } from "./pages/About";
import { Design } from "./pages/Design";
import { RequestForgotPassword } from "./pages/RequestForgotPassword";
import { ForgotPassword } from "./pages/ForgotPassword";
import { Profile } from "./pages/Profile";
import { AddCategory } from "./pages/Admin/AddCategory";
import { ViewCategories } from "./pages/Admin/ViewCategories";


const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/logout" element={<Logout />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/design" element={<Design />}></Route>
          <Route path="/request-forgot-password" element={<RequestForgotPassword />}></Route>
          <Route path="/customer/forgot-password" element={<ForgotPassword />}></Route>
          <Route path="/profile" element={<Profile />}></Route>

          
          <Route path="/admin" element={<Admin />}>
            <Route index element={<h1>Hello Admin Page</h1>} />
            <Route path="add-customer" element={<AddCustomer />} />
            <Route path="view-customers" element={<ViewCustomers />} />
            <Route path="add-design" element={<AddDesign />} />
            <Route path="add-category" element={<AddCategory />} />
            <Route path="view-categories" element={<ViewCategories />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;