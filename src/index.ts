import express, { Express, Request, Response } from "express";
import knex from "knex";
import knexConfig from "../db/knex";
import { UserCtrl, CondoCtrl, HouseCtrl, AppointmentCtrl, } from "./controllers";
import { UploadFile } from "./services/uploadFiles/uploadFile.services";
import { S3Client } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
import path from 'path';
import multer from "multer";

const app: Express = express();
const port = process.env.PORT || 3000;
// Configure Multer to store files in memory (you can also configure it to save to disk)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
      } else {
        cb(null, false);
      }
    },
  });
  


const db = knex(knexConfig);
const dotEnv = dotenv.config({
    path: path.resolve(__dirname, '../.env'),
  });

const s3Client = new S3Client({
    credentials: {
        accessKeyId: dotEnv.parsed?.AWS_ACCESS_KEY_ID ?? "fake",
        secretAccessKey: dotEnv.parsed?.AWS_SECRET_ACCESS_KEY ?? "fake"
    },
    region: dotEnv.parsed?.AWS_REGION ?? "us-east-1"});

const bucket = dotEnv.parsed?.AWS_BUCKET_NAME?? "condo-app-uploads";
const uploadFileService = new UploadFile(s3Client,bucket, "images");
const userCtrl = new UserCtrl(db);
const condoCtrl = new CondoCtrl(db);
const houseCtrl = new HouseCtrl(db);
const appointmentCtrl = new AppointmentCtrl(db,uploadFileService);

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

app.get('/appointment/house/:houseId', async (req: Request, res: Response) => {
    if (req.query.date) {
        const date = new Date(req.query.date.toString());

        console.log("Getting appointments by date and house", date, req.params.houseId);
        const appointments = await appointmentCtrl.getByDateAndHouse(date, req.params.houseId);
        return res.json(appointments);
    }
    const appointments = await appointmentCtrl.getByHouse(req.params.houseId);
    return res.json(appointments);
}
);

app.get('/appointment/date/:date', async (req: Request, res: Response) => {
    const date = new Date(req.params.date);
    const appointments = await appointmentCtrl.getByDate(date);
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

app.patch('/appointment/:appointmentId',upload.single('file'), async (req: Request, res: Response) => {
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

