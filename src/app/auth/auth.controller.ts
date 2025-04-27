import { Request, Response } from "express";
import AuthServices from "./auth.services";

class AuthControllers {
    constructor(){}

    static async loginController (req: Request, res: Response){
        try{
            const data = await AuthServices.loginService(req.body)
            if(data.statusCode !== 200){
                res.status(data.statusCode).send(data)
                return
            }
            if ('data' in data && data.data.BearerrToken) {
                res.setHeader('authorization', `Bearer ${data.data.BearerrToken}`);
            }
            res.status(data.statusCode).send(data)
        }catch(err){
            res.status(500).send(err)
        }
    }
}

export default AuthControllers