import { Request, Response } from "express";
import UserServices from "./trainee.services";

class TraineeController {
  constructor() {}

  static async createAccountWithTrainee(req: Request, res: Response) {
    try {
      const data = await UserServices.createTraineeProfile(req.body);
      if (data.statusCode !== 201) {
        res.status(data.statusCode).send(data.data);
        return;
      }
      res.status(data.statusCode).send(data.data);
    } catch (err) {
      res.status(500).send(err);
    }
  }

  static async getSchedule(req: Request, res: Response) {
    try {
      const q = req.query;
      // checking valid Date
      if (
        typeof q.date === "string" &&
        ((q.date.length > 0 && q.date.length < 10) || q.date.length > 10)
      ) {
        res.status(404).send({
          data: {
            success: false,
            message: "Bad Request",
            errorDetails: "Enter the correct date.",
          },
        });
        return;
      }
      // convert local Date and Dafualt date
      const date: string =
        !q.date || typeof q.date !== "string" || q.date.length === 0
          ? new Date().toLocaleDateString("sv-SE", {
              timeZone: "Asia/Dhaka",
            })
          : q.date;
      // geting Data
      const data = await UserServices.getScheduleDB(date);
      if (data.statusCode !== 200) {
        res.status(data.statusCode).send(data.data);
        return;
      }
      res.status(200).send(data.data);
    } catch (err) {
      res.status(500).send(err);
    }
  }

  static async bookingSchedule(req: Request, res: Response) {
    try {
      const data = await UserServices.bookingSchedule(req.body);
      if (data.statusCode !== 200) {
        res.status(data.statusCode).send(data.data);
        return;
      }
      res.status(data.statusCode).send(data.data);
    } catch (err) {
      res.status(500).send(err);
    }
  }

  static async getMybookingSchedule(req: Request, res: Response) {
    try {
      const data = await UserServices.getMybookingSchedule(
        req.params.traineeId
      );
      if (typeof data === "string") {
        res.status(500).send(data);
      } else {
        res.send(data.data);
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }

  static async deleteMybookingSchedule(req: Request, res: Response) {
    try {
      const dltbooking = await UserServices.removeMybookingSchedule(
        req.params.id
      );

      res.send(dltbooking);
    } catch (err) {
      res.status(500).send(err);
    }
  }
}

export default TraineeController;
