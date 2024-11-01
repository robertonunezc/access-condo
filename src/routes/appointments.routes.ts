import { Router, Request, Response } from "express";
import { UploadFile } from "../services/uploadFiles/uploadFile.services";
import { S3Client } from "@aws-sdk/client-s3";
import { AppointmentCtrl } from "../controllers/appointmentCtrl";
import knex from "knex";
import knexConfig from "../../db/knex";
import multer from "multer";
import { logger } from "../infra/logger";
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


const bucket = process.env.AWS_BUCKET_NAME?? "condo-app-uploads";

const s3Client = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "fake",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "fake"
    },
    region: process.env.AWS_REGION ?? "us-east-1"});


const uploadFileService = new UploadFile(s3Client,bucket, "images");

const router = Router();
const appointmentCtrl = new AppointmentCtrl(db, uploadFileService);


router.get('/', async (req: Request, res: Response) => {
    const appointments = await appointmentCtrl.getAllAppointments();
    res.json(appointments);
}
);

router.get('/:appointmentId', async (req: Request, res: Response) => {
    const appointment = await appointmentCtrl.getAppointmentById(req.params.appointmentId);
    res.json(appointment);
}
);

router.get('/:appointmentId/confirm', async (req: Request, res: Response) => {
    try {
        const appointment = await appointmentCtrl.confirm(req.params.appointmentId);
        return res.json(appointment);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal server error" });  
    }

}
);

router.get('/house/:houseId', async (req: Request, res: Response) => {
    if (req.query.date) {
        const date = new Date(req.query.date.toString());

        logger.log("Getting appointments by date and house", req.params.houseId);
        const appointments = await appointmentCtrl.getByDateAndHouse(date, req.params.houseId);
        return res.json(appointments);
    }
    const appointments = await appointmentCtrl.getByHouse(req.params.houseId);
    return res.json(appointments);
}
);

router.get('/date/:date', async (req: Request, res: Response) => {
    const date = new Date(req.params.date);
    const appointments = await appointmentCtrl.getByDate(date);
    res.json(appointments);
}
);
/*
    this endpoint is for the sharable link in case the user wants to share the appointment
    completion with the visitor.
*/
router.post('/dummy', async (req: Request, res: Response) => {
    console.log("[POST] /appointment/dummy", req.body);
    try {
        const appointmentCreated = await appointmentCtrl.createDummyAppointment(req);
        res.json(appointmentCreated);
    } catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/', async (req: Request, res: Response) => {
    logger.log("[POST] /appointment", req.body);
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


router.patch('/:appointmentId',upload.single('file'), async (req: Request, res: Response) => {
    logger.log("[PATCH] /appointment/:appointmentId", req.body, req.file);
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


export default router;