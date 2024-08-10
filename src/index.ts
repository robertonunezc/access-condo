import express, { Express, Request, Response } from "express";
import knex from "knex";
import knexConfig from "../db/knex";
import dotenv from "dotenv";
import { UserCtrl } from "./controllers/userCtrl";
import { CondoCtrl } from "./controllers/condoCtrl";

const app: Express = express();
const port = process.env.PORT || 3000;
const db = knex(knexConfig);
const dotEnv = dotenv.config();

const userCtrl = new UserCtrl(db);
const condoCtrl = new CondoCtrl(db);

app.use(express.json());


app.get('/user',async (req:Request, res: Response) => {
    const users = await userCtrl.getAllUsers();
    res.json(users);
});

app.post('/user', async (req: Request, res: Response) => {
    console.log("[POST] /user", req.body);
    try {
        const userCreated = await userCtrl.createUser(req);
        res.json(userCreated);
    }catch(err) {
        if (err instanceof Error) {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: "Internal server error" });
    }   
}
);

app.get('/condo', async (req: Request, res: Response) => {
    const condoCtrl = new CondoCtrl(db);
    const condos = await condoCtrl.getAllCondos();
    res.json(condos);
});

app.post('/condo', async (req: Request, res: Response) => {
    console.log("[POST] /condo", req.body);
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

app.listen(port, () => {
    console.log('Server is running on port 3000');
});

