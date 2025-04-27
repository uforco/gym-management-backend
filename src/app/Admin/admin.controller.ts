import { Request, Response } from "express";
import AdminServices from "./admin.services";

class AdminController {
  constructor() {}

  static async createTrainer(req: Request, res: Response) {
    try {
      const data = await AdminServices.createTrainerDB(req.body);
      res.send(data);
    } catch (err) {
      res.status(500).send(err);
    }
  }

  static async getAllUsers(req: Request, res: Response) {
    try {
      const data = await AdminServices.getUsersDB();
      res.send(data);
    } catch (err) {
      res.status(500).send(err);
    }
  }

  static async updateTrainerInfo(req: Request, res: Response) {
    try {
      const data = await AdminServices.updateTrainer(req.params.id, req.body);
      if (data.statusCode != 200) {
        res.status(data.statusCode).send(data.data);
        return;
      }
      res.status(data.statusCode).send(data.data);
    } catch (err) {
      res.status(500).send(err);
    }
  }

  static async deleteTrainerAccount (req: Request, res: Response) {
    try {
      const data = await AdminServices.removeTrainerProfile(req.params.id)
      if(data.statusCode !== 200){
        res.status(data.statusCode).send(data.data)
        return
      }
      res.status(data.statusCode).send(data.data)
    }catch(err){
      // console.log(err)
      res.status(500).send(err)
    }
  }

  static async getTrainers(req: Request, res: Response) {
    try {
      const trainerData = await AdminServices.getAllTrainersDB();
      res.send(trainerData);
    } catch (err) {
      res.send(err);
    }
  }

  static async createSchedule(req: Request, res: Response) {
    try {
      const data = await AdminServices.createScheduleTrainers(req.body);
      if (data.statusCode !== 200) {
        res.status(data.statusCode).send(data.data);
        return;
      }
      res.status(200).send(data.data);
    } catch (err) {
      res.send(err);
    }
  }

  static async deleteSchedule(req: Request, res: Response) {
    try {
      const data = await AdminServices.removeSchedule(req.params.id);
      if (data.statusCode !== 200) {
        res.status(data.statusCode).send(data.data);
        return;
      }
      res.status(data.statusCode).send(data.data);
    } catch (err) {
      res.status(500).send(err);
    }
  }
}

export default AdminController;
