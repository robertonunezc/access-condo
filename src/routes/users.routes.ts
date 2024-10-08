import { Router, Request, Response } from 'express';
import {UserCtrl} from '../controllers/userCtrl'; // Adjust the path as necessary
import knex from 'knex';
import knexConfig from '../../db/knex';
import { logger } from "../infra/logger";


const db = knex(knexConfig);
const router = Router();
const userController = new UserCtrl(db);
router.get('/', async (req: Request, res: Response) => {
    try {
        const users = await userController.getAllUsers();
        res.json(users);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal server error" });  
    }
});

router.post('/', async (req: Request, res: Response) => {
    logger.log("[POST] /user", req.body);
    try {
        const userCreated = await userController.createUser(req);
        res.json(userCreated);
    } catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;