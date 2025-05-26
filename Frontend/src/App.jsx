import { Navbar } from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Customers } from "./pages/Customers";
import { AddCustomer } from "./pages/AddCustomer";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/addCustomer" element={<AddCustomer />}></Route>
            <Route path="/customers" element={<Customers />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;