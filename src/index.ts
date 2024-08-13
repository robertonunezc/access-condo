import express, { Express, Request, Response } from "express";
import knex from "knex";
import knexConfig from "../db/knex";
import dotenv from "dotenv";
import { UserCtrl, CondoCtrl, HouseCtrl, AppointmentCtrl, } from "./controllers";

const app: Express = express();
const port = process.env.PORT || 3000;
const db = knex(knexConfig);
const dotEnv = dotenv.config();

const userCtrl = new UserCtrl(db);
const condoCtrl = new CondoCtrl(db);
const houseCtrl = new HouseCtrl(db);
const appointmentCtrl = new AppointmentCtrl(db);

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

app.get('/house', async (req: Request, res: Response) => {
    const houses = await houseCtrl.getAllHouses();
    res.json(houses);
}
);
app.post('/house', async (req: Request, res: Response) => { 
    console.log("[POST] /house", req.body);
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

app.get('/appointment', async (req: Request, res: Response) => {
    const appointments = await appointmentCtrl.getAllAppointments();
    res.json(appointments);
}
);
app.get('/appointment/:houseId', async (req: Request, res: Response) => {
    
    const appointments = await appointmentCtrl.getByHouse(req.params.houseId);
    res.json(appointments);
}
);


app.post('/appointment', async (req: Request, res: Response) => {
    console.log("[POST] /appointment", req.body);
    try {
        const appointmentCreated = await appointmentCtrl.createAppointment(req);
        res.json(appointmentCreated);
    } catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: "Internal server error" });
    }
});

app.patch('/appointment/:appointmentId', async (req: Request, res: Response) => {
    console.log("[POST] /appointment/:appointmentId", req.body);
    try {
        const appointmentUpdated = await appointmentCtrl.update(req.params.appointmentId, req);
        res.json(appointmentUpdated);
    } catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: "Internal server error" });
    }
})

app.listen(port, () => {
    console.log('Server is running on port 3000');
});

