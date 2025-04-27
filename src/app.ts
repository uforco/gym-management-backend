import express from "express";
const app = express();
app.use(express.json());

// import trainerRoute from "./app/Trainer/trainer.route";
import traineeRoutes from "./app/Trainee/trainee.route";
import adminRouter from "./app/Admin/admin.route";
import trainerRoutes from "./app/Trainer/trainer.route";
import authRouter from "./app/auth/auth.route";
import varifyAuthrize from "./middlewares/varifyAuthrize";


app.use("/auth", authRouter)
app.use("/trainee", traineeRoutes)
app.use("/trainer", trainerRoutes)
app.use("/admin", varifyAuthrize(['ADMIN']), adminRouter)
// app.use(trainerRoute)




export default app;