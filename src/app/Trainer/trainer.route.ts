
import trainerRoutes from "../../lib/globle.route";
import TrainerController from "./trainer.controller";

trainerRoutes.get('/schedules/:id', TrainerController.getAllSchedulesByTrainerId)

export default trainerRoutes