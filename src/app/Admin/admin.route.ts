import adminRouter from "../../lib/globle.route";
import AdminController from "./admin.controller";

adminRouter.get('/get-users', AdminController.getAllUsers)

adminRouter.post('/create-user', AdminController.createTrainer)
adminRouter.get('/trainers', AdminController.getTrainers)

adminRouter.put('/update-trainer-profile/:id', AdminController.updateTrainerInfo)
adminRouter.delete('/delete-trainer-profile/:id', AdminController.deleteTrainerAccount)

adminRouter.post('/create-schedule', AdminController.createSchedule)
adminRouter.delete('/delete-schedule/:id', AdminController.deleteSchedule)

export default adminRouter