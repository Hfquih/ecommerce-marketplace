import Home from "./home";
import Register from "./register";
import Login from "./login";
import Account from "./account";
import CreateProducts from "./createProducts";
import ViewProducts from "./viewProducts";
import AllInfo from "./allInfo";
import SellerProduct from "./sellerProductInfo";
import EditProduct from "./editProduct";
import Cart from "./cart";
import Checkout from "./checkout";
import SellerEditInfo from "../sub-functionality/sellerEditInfo";
import AdminChangeInfo from "./adminEdit";
import { BrowserRouter , Route , Routes } from "react-router-dom";
import ForgetPass from "../functionality/forgetPass";
import ResetPass from "../functionality/resetPassword";
import VerifyEmail from "../functionality/verifyEmail";


export default function App(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}></Route>
                <Route path="/register" element={<Register/>}></Route>
                <Route path="/login" element={<Login/>}></Route>
                <Route path="/account" element={<Account/>}></Route>
                <Route path="/createProducts" element={<CreateProducts/>}></Route>
                <Route path="/viewProducts" element={<ViewProducts/>}></Route>
                <Route path="/allInfo/:id" element={<AllInfo/>}></Route>
                <Route path="/info-Seller/:id" element={<SellerProduct/>}></Route>
                <Route path="/editProduct/:id" element={<EditProduct/>}></Route>
                <Route path="/cart" element={<Cart/>}></Route>
                <Route path="/checkout" element={<Checkout/>}></Route>
                <Route path="/edit-info" element={<SellerEditInfo/>}></Route>
                <Route path="/admin-edit/:id" element={<AdminChangeInfo/>}></Route>
                <Route path="/forgot-password" element={<ForgetPass/>}></Route>
                <Route path="/reset-password/:token" element={<ResetPass/>}></Route>
                <Route path="/verify-email/:token" element={<VerifyEmail/>}></Route>
            </Routes>
        </BrowserRouter>
    )
}