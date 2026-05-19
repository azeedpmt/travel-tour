import { Router } from 'express';
import { loginUser, addUserRole, myProfile,registerUser,testLogin } from '../controllers/auth';
import { isAuth, isAdmin } from '../middlewares/isAuth';

const router = Router();

router.post("/login", loginUser);
router.put("/add/role", isAuth, addUserRole);
router.get("/me", isAuth, myProfile);
router.get("/admin/verify", isAuth, isAdmin, (req, res) => {
    res.json({ message: "Admin verified", user: (req as any).user });
});
router.post("/register", registerUser);
// ✅ Test login (only for E2E tests)
router.post('/test-login', testLogin);


export default router;