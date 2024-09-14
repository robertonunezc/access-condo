import { Response, Router , Request} from 'express';
import { AuthCtrl } from '../controllers/auth.ctrl'; // Adjust the path as necessary
const router = Router();
const authController = new AuthCtrl();

router.post('/login', (req:Request, res: Response) => {
    try {
        const response = authController.login(req);
        res.json(response);
    }catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
});