// config inicial
import express, { Response } from 'express';
import cors from 'cors';

import userRoutes from './routes/userRoutes';
import funkoRoutes from './routes/funkoRoutes';

const app = express();

//way to read json
//middleware
app.use(
    express.urlencoded({ extended: true })
);

app.use(express.json());

//solve cors
app.use(cors());

//public folder for images
app.use(express.static("public"));

//user api routes
app.use("/user", userRoutes);

//funkos api routes
app.use("/funko", funkoRoutes);

//initial route
app.get("/", (res: Response) => {
    res.json({ message: "API criada para projeto final em React - Gabriel Forcellini" })
});

app.listen(4000);