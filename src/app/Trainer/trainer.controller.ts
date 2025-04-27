

import { Request, Response } from "express";
import TrainerServices from "./trainer.services";

class TrainerController{
    constructor() {}

    static async getAllSchedulesByTrainerId (req: Request, res: Response){
        try{
            const data = await TrainerServices.getSchedulesBytrainer(req.params.id)
            res.status(data.statusCode).send(data.data)
        }catch(err){
            res.status(500).send(err)
        }
    }
}

export default TrainerController