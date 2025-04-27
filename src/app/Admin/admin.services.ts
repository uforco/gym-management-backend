import { Prisma } from "@prisma/client";
import prisma from "../../lib/prismaClient";
import { CreateUserInput } from "../Trainee/dto/create-user.dto";
import argon2 from "argon2";

class AdminServices {
  constructor() {}

  static async createTrainerDB(data: CreateUserInput) {
    try {
      const ExstUser = await prisma.user.findFirst({
        where: { email: data.email },
        select: {
          email: true,
        },
      });
      if (ExstUser?.email) {
        return {
          statusCode: 406,
          errorMessage: "TRAINER all ready Exist",
        };
      }
      const hashedPassword = await argon2.hash(data.password); // Hash the password
      return await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          role: "TRAINER",
          profile: data.profile
            ? {
                create: {
                  name: data.profile.name,
                  age: data.profile.age,
                  phone: data.profile.phone,
                },
              }
            : undefined,
        },
        select: {
          id: true,
          email: true,
          role: true,
          profile: {
            select: {
              name: true,
              age: true,
              phone: true,
            },
          },
        },
      });
    } catch (err) {
      throw new Error("internal server error");
    }
  }

  static async getUsersDB() {
    try {
      return await prisma.user.findMany();
    } catch (err) {
      throw new Error("internal server error");
    }
  }

  static async getAllTrainersDB() {
    try {
      return await prisma.user.findMany({
        where: { role: "TRAINER" },
        select: {
          id: true,
          email: true,
          profile: {
            select: {
              name: true,
              age: true,
              phone: true,
            },
          },
        },
      });
    } catch (err) {
      throw new Error("internal server error");
    }
  }

  static async updateTrainer(trainerId: string, updateData: any) {
    try {
      const data = await prisma.user.update({
        where: { id: trainerId },
        data: {
          email: updateData.email,
          profile: {
            update: updateData.profile,
          },
        },
        select: {
          id: true,
          email: true,
          profile: {
            select: {
              name: true,
              age: true,
              phone: true,
            },
          },
        },
      });
      return {
        statusCode: 200,
        data: {
          success: true,
          message: "profile update successful",
          data: data,
        },
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return {
          statusCode: 400,
          data: {
            success: false,
            message: "Bad Request",
            errorDetails: "invalid request",
          },
        };
      } else {
        console.error("❌ Unexpected error:", error);
        throw new Error("internal server Error");
      }
      // throw new Error("internal server Error");
    }
  }

  static async removeTrainerProfile(trainerId: string) {
    try {
      await prisma.$transaction(async (tx) => {
        const trainerSchedules = await tx.schedule.findMany({
          where: { trainerId: trainerId },
          select: { id: true },
        });
        const scheduleIds = trainerSchedules.map((s) => s.id);
        await tx.booking.deleteMany({
          where: {
            scheduleId: { in: scheduleIds },
          },
        });
        await tx.schedule.deleteMany({
          where: { trainerId: trainerId },
        });
      });

      await prisma.profile.delete({
        where: { userId: trainerId },
      });

      const dltTrainer = await prisma.user.delete({
        where: { id: trainerId },
      });

      if (!dltTrainer.id) {
        return {
          statusCode: 400,
          data: {
            success: false,
            message: "Bad Request",
            errorDetails: "invalid request",
          },
        };
      }
      return {
        statusCode: 200,
        data: {
          success: true,
          message: "profile delete successful",
          data: dltTrainer.id,
        },
      };
    } catch (error) {
      console.log(error);
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        (error.code === "P2025" || error.code === "P2014")
      ) {
        return {
          statusCode: 400,
          data: {
            success: false,
            message: "Bad Request",
            errorDetails: "invalid request",
          },
        };
      } else {
        console.error("❌ Unexpected error:", error);
        throw new Error("internal server Error");
      }
    }
  }

  static async createScheduleTrainers(data: any) {
    try {
      const { date, startTime, trainerId } = data;

      const start = new Date(`${date}, ${startTime}`);
      const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

      const dailyCount = await prisma.schedule.count({
        where: { date: new Date(date) },
      });
      if (dailyCount >= 5) {
        return {
          statusCode: 406,
          data: {
            success: false,
            message: "Not Acceptable",
            errorDetails: "Maximum 5 classes per day allowed.",
          },
        };
      }

      const NotExistTrainer = await prisma.user.findFirst({
        where: { id: trainerId },
      });
      if (!NotExistTrainer) {
        return {
          statusCode: 403,
          data: {
            success: false,
            message: "Forbidden",
            errorDetails: "Trainer Not Found",
          },
        };
      }

      const trainerAllreadyThisTime = await prisma.schedule.findFirst({
        where: {
          trainerId: trainerId,
          OR: [
            {
              startTime: { lt: end },
              endTime: { gt: start },
            },
          ],
        },
      });
      if (trainerAllreadyThisTime) {
        return {
          statusCode: 406,
          data: {
            success: false,
            message: "Not Acceptable",
            errorDetails: "Trainer has a conflicting class at this time.",
          },
        };
      }

      const newSchedule = await prisma.schedule.create({
        data: {
          date: new Date(date),
          startTime: start,
          endTime: end,
          trainerId: trainerId,
        },
      });
      return {
        statusCode: 201,
        data: {
          success: true,
          statusCode: 201,
          message: "Class booked successfully",
          data: newSchedule,
        },
      };
    } catch (err) {
      throw new Error("internal server Error");
    }
  }

  static async removeSchedule(scheduleId: string) {
    try {
      const dltBS = await prisma.booking.deleteMany({
        where: { scheduleId: scheduleId },
      });
      const data = await prisma.schedule.delete({
        where: { id: scheduleId },
      });
      if (!data.id) {
        return {
          statusCode: 400,
          data: {
            success: false,
            message: "Bad Request",
            errorDetails: "invalid request",
          },
        };
      }
      return {
        statusCode: 200,
        data: {
          success: true,
          totalBookingSchedule: dltBS.count,
          message: "delete Trainer schedule successfully",
        },
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        (error.code === "P2025" || error.code === "P2014")
      ) {
        return {
          statusCode: 400,
          data: {
            success: false,
            message: "Bad Request",
            errorDetails: "invalid request",
          },
        };
      } else {
        console.error("❌ Unexpected error:", error);
        throw new Error("internal server Error");
      }
    }
  }
}

export default AdminServices;
