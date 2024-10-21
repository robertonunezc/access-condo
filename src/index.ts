import express, { Express, Request, Response } from "express";
import knex from "knex";
import cors from "cors";
import knexConfig from "../db/knex";
import {CondoCtrl, HouseCtrl, } from "./controllers";
import { logger } from "./infra/logger";
import appointmetRoutes from "./routes/appointments.routes";
import userRoutes from "./routes/users.routes";
import authRoutes from "./routes/auth.routes";
const app: Express = express();
const port = process.env.PORT || 3000;
const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
const db = knex(knexConfig);
const condoCtrl = new CondoCtrl(db);
const houseCtrl = new HouseCtrl(db);

app.use(express.json());

app.use('/api/appointment',appointmetRoutes);
app.use('/api/user',userRoutes);
app.use('/api',authRoutes);


app.get('/condo', async (req: Request, res: Response) => {
    const condoCtrl = new CondoCtrl(db);
    const condos = await condoCtrl.getAllCondos();
    res.json(condos);
});

app.post('/condo', async (req: Request, res: Response) => {
    logger.log("[POST] /condo", req.body);
    try {
        const condoCreated = await condoCtrl.createCondo(req);
        res.json(condoCreated);
    } catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get('/house', async (req: Request, res: Response) => {
    const houses = await houseCtrl.getAllHouses();
    res.json(houses);
}
);
app.get('/house/:id/appointments', async (req: Request, res: Response) => {
    const houseId: string = req.params.id;
    const houses = await houseCtrl.getHouseAppointments(houseId);
    res.json(houses);
}
);

app.post('/house', async (req: Request, res: Response) => { 
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

app.get('/healthcheck', (req: Request, res: Response) => {
    res.send('Server is running');
});


app.listen(port, () => {
    logger.log('Server is running on port', port);
});

