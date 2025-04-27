import authRouter from "../../lib/globle.route";
import AuthControllers from "./auth.controller";


authRouter.post('/', AuthControllers.loginController)


export default authRouter