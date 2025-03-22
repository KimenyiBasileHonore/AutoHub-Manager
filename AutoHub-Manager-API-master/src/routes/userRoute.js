import express from 'express';
const router = express.Router();
import { ClientSignup, ClientLogin, VendorSignup, VendorLogin, getAllUsers, getClientById, getClientProfile, UserCount , getVendors} from '../controllers/userController.js';
import checkAuth from '../middleware/checkAuthentication.js';



router.post('/client/signup', ClientSignup); 
router.post('/client/login', ClientLogin);  
router.post('/vendor/signup', VendorSignup);
router.post('/vendor/login', VendorLogin); 
router.get('/client-list', getAllUsers) ;
router.get('/clientId/:id',getClientById)
router.get('/client/profile', checkAuth,getClientProfile);
router.get('/count-clients', UserCount);
router.get('/vendors', getVendors);


export default router;
