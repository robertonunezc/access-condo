import { Router, Request, Response } from "express";

import { HouseCtrl } from "../controllers/houseCtrl";

import knex from "knex";

import knexConfig from "../../db/knex";
import { logger } from "../infra/logger";

const db = knex(knexConfig);
const router = Router();
const houseCtrl = new HouseCtrl(db);

router.get("/by-user/:userId", async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const houses = await houseCtrl.getHousesByUserId(userId);
    res.json(houses);
})


router.get('/', async (req: Request, res: Response) => {
    const houses = await houseCtrl.getAllHouses();
    res.json(houses);
}
);
router.get('/:id/appointments', async (req: Request, res: Response) => {
    const houseId: string = req.params.id;
    const houses = await houseCtrl.getHouseAppointments(houseId);
    res.json(houses);
}
);

router.post('/', async (req: Request, res: Response) => { 
    logger.log("[POST] /house", req.body);
    try {
        const houseCreated = await houseCtrl.createHouse(req);
        res.json(houseCreated);
    } catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;