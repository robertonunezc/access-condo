import { Response, Router , Request} from 'express';
import { AuthCtrl } from '../controllers/auth.ctrl'; // Adjust the path as necessary
import knex from 'knex';
import knexConfig from "../../db/knex";

const router = Router();

const db = knex(knexConfig);

const authController = new AuthCtrl(
    db,
);

router.post('/login',async (req:Request, res: Response) => {
    try {
        const response = await authController.login(req);
        return res.json(response);
    }catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/verify-otc', async(req:Request, res: Response) => {
    try {
        const response = await authController.verifyOtc(req);
        return res.json(response);
    }catch (error) {
        console.log("aaaa",error);
        if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;