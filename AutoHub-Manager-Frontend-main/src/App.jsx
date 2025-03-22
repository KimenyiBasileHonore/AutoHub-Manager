import { Routes,Route } from 'react-router-dom';
import Home from "../src/pages/home";
import Userdashboard from '../src/service/Userdashboard';
import Mifotradashboard from '../src/service/Mifotradashboard';
import Companydashboard from '../src/service/Companydashboard';
import Reportingproblem from '../src/service/Reportingproblem';
import Registeredcompany from './pages/Sections';
import Registereduser from '../src/service/Registereduser';
import Reportedproblem from '../src/service/Reportedproblem';
import Companyrelatedproblem from './service/Companyrelatedinfo';
import VendorLogin from "./pages/VendorLogin";
import VendorSignup from "../src/pages/VendorSignup";
import ClientLogin from "./pages/ClientLogin";
import ClientSignup from "./pages/ClientSignup";
import PageRoutes from "./utils/PageRoutes";
import Clientdashboard from "./service/Clientdashboard";
import Vendordashboard from "./service/Vendordashboard";
import PaymentForm from "./service/PaymentForm";
import PaymentSuccess from "./service/PaymentSuccess";
import PaymentFailure from "./service/PaymentFailure";
import About from "./pages/About";
import Admoverview from './service/AdmOverview';
import AdminPage from './service/AdminPage';


function App() {
  return (
    <div>
       <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='userdashboard' element={<Userdashboard/>}/>
        <Route path='mifotradashboard' element={<Mifotradashboard/>}/>
        <Route path='companydashboard' element={<Companydashboard/>}/>
        <Route path='reportingproblem' element={<Reportingproblem/>}/>
        <Route path='registeredcompany' element={<Registeredcompany/>}/>
        <Route path='registereduser' element={<Registereduser/>}/>
        <Route path='admindashboard' element={<Admoverview/>}/>
        <Route path='adminpage' element={<AdminPage/>}/>
        <Route path='reportedproblem' element={<Reportedproblem/>}/>
        <Route path='companyrelatedproblem' element={<Companyrelatedproblem/>}/>
        <Route path='Clientlogin' element={<ClientLogin/>}/>
        <Route path='Clientsignup' element={<ClientSignup/>}/>
        <Route path='Vendorlogin' element={<VendorLogin/>}/>
        <Route path='Vendorsignup' element={<VendorSignup/>}/>
        <Route path='started' element={<PageRoutes/>}/>
        <Route path='clientdashboard' element={<Clientdashboard/>}/>
        <Route path='vendordashboard' element={<Vendordashboard/>}/>
        <Route path='paymentForm' element={<PaymentForm/>}/>
        <Route path="PaymentSuccess" element ={<PaymentSuccess/>}/>
        <Route path="PaymentFailure" element ={<PaymentFailure/>}/>
        <Route path="About" element ={<About/>}/>
        
        
        
  
      </Routes>
    </div>
  );
}

export default App;
