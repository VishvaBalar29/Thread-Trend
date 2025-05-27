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


const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          {/* <Route path="/customers" element={<Customers />}></Route> */}
          <Route path="/admin" element={<Admin />}>
            <Route index element={<h1>Hello Admin Page</h1>} />
            <Route path="add-customer" element={<AddCustomer />} />
            <Route path="view-customers" element={<ViewCustomers />} />
            <Route path="add-design" element={<AddDesign />} />
            {/* <Route path="add-category" element={<AddCategory />} />
            <Route path="view-category" element={<ViewCategory />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;