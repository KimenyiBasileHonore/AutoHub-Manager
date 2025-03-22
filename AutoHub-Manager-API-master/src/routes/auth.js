const {login,register,getAllUsersByRole,logOut,getAllClientUsers,
    getAllEmployeeUsers,allemployeeCount,allclientCount,UserCount
} = require("../controllers/userController");

const router = require("express").Router();

router.post("/login", login);
router.post("/register", register);
router.get("/allusers/:id", getAllUsersByRole);
router.get("/logout/:id", logOut);
router.get("/allclientusers", getAllClientUsers);
router.get("/allemployeeusers", getAllEmployeeUsers);
router.get("/allclient",allclientCount);
router.get("/allemployee",allemployeeCount);
router.get('/count-clients', UserCount);

module.exports = router;
