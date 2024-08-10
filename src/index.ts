import express, { Express, Request, Response } from "express";
import knex from "knex";
import knexConfig from "../db/knex";
import dotenv from "dotenv";
import { UserRepository } from "../src/repositories/userRepository"
import { User } from "./entities/user";
const app: Express = express();
const port = process.env.PORT || 3000;
const db = knex(knexConfig);
const dotEnv = dotenv.config();

app.use(express.json());

const userRepository = new UserRepository(db);

app.get('/user',async (req:Request, res: Response) => {
    const users = await userRepository.findAllUsers();
    res.json(users);
});

app.post('/user', async (req: Request, res: Response) => {
    const user = new User(
        "John Doe",
        "jon@mail.com",
        "1234567890"
    );
    const newUser = await userRepository.createUser(user);
    res.json(newUser);
}
);
app.listen(port, () => {
    console.log('Server is running on port 3000');
});

