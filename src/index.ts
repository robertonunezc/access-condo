import express, { Express, Request, Response } from "express";
import knex from "knex";
import cors from "cors";
import knexConfig from "../db/knex";
import {CondoCtrl, } from "./controllers";
import { logger } from "./infra/logger";
import appointmetRoutes from "./routes/appointments.routes";
import userRoutes from "./routes/users.routes";
import authRoutes from "./routes/auth.routes";
import housesRoutes from "./routes/houses.routes";
import { setupSwagger } from "./api-doc/swagger";
import {config} from "./infra/config";
const app: Express = express();
const port = config.appPort || 3000;
const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
const db = knex(knexConfig);
const condoCtrl = new CondoCtrl(db);

app.use(express.json());

app.use('/api/user',userRoutes);
app.use('/api',authRoutes);
app.use('/api/house',housesRoutes);
app.use('/api/appointment',appointmetRoutes);


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


app.get('/healthcheck', (req: Request, res: Response) => {
    res.send('Server is running');
});

setupSwagger(app);
app.listen(port, () => {
    logger.log('Server is running on port', port);
});

