
import traineeRoute from "../../lib/globle.route";
import UserController from "./trainee.controller";

// userRoute.post('/', UserController.createUser)
// userRoute.get('/', UserController.getAllUsers)

traineeRoute.post('/create-account', UserController.createAccountWithTrainee)
traineeRoute.get('/schedule', UserController.getSchedule)
traineeRoute.post('/booking-schedule', UserController.bookingSchedule)
traineeRoute.get('/mybookinglist/:traineeId', UserController.getMybookingSchedule)
traineeRoute.delete('/mybookinglist/:id', UserController.deleteMybookingSchedule)

export default traineeRoute