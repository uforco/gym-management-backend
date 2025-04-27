import { Prisma } from "@prisma/client";
import prisma from "../../lib/prismaClient";
import createProfileSystem from "./createTaineeProfile/createProfileSystem";

class TraineeServices {
  constructor() {}

  static async createTraineeProfile (data: any){
    return await createProfileSystem(data)
  }

  static async getScheduleDB(dtoData: string) {

    try {
      const scheduls = await prisma.schedule.findMany({
        where: { date: new Date(dtoData) },
        select: {
          id: true,
          startTime: true,
          endTime: true,
          trainer: {
            select: {
              profile: {
                select: {
                  name: true,
                  phone: true,
                },
              },
            },
          },
        },
      });
      if (scheduls.length < 1) {
        return {
          statusCode: 404,
          data: {
            success: false,
            message: "Not Found",
            errorDetails: "this time not available schedule",
          },
        };
      }
      return {
        statusCode: 200,
        data: {
          success: true,
          data: scheduls,
        },
      };
    } catch (err) {
      throw new Error("internal server error");
    }
  }

  static async bookingSchedule(dtoData: any) {
    try {
      const bookingCountSchedule = await prisma.booking.count({
        where: { scheduleId: dtoData.scheduleId },
      });
      if (bookingCountSchedule >= 10) {
        return {
          statusCode: 400,
          data: {
            success: false,
            message: "Bad Request",
            errorDetails:
              "Class schedule is full. Maximum 10 trainees allowed per schedule.",
          },
        };
      }
      const existBooking = await prisma.booking.findFirst({
        where: {
          scheduleId: dtoData.scheduleId,
          traineeId: dtoData.traineeId,
        },
      });
      if (existBooking) {
        return {
          statusCode: 406,
          data: {
            success: false,
            message: "Not Acceptable",
            errorDetails: "You have already booked the schedule for this time.",
          },
        };
      }
      const newBooking = await prisma.booking.create({
        data: {
          scheduleId: dtoData.scheduleId,
          traineeId: dtoData.traineeId,
        },
      });
      return {
        statusCode: 201,
        data: {
          success: true,
          message: "Class booked successfully",
          data: newBooking,
        },
      };
    } catch (err) {
      throw new Error("internal server Error");
    }
  }

  static async getMybookingSchedule(traineeId: string) {
    try {
      const data = await prisma.booking.findMany({
        where: { traineeId: traineeId },
        select: {
          id: true,
          schedule: {
            select: {
              id: true,
              date: true,
              startTime: true,
              endTime: true,
              trainer: {
                select: {
                  profile: {
                    select: {
                      name: true
                    }
                  }
                }
              }
            },
          },
        },
      });
      return {
        statusCode: 200,
        data: {
          success: true,
          data: data,
        },
      };
    } catch (err) {
      return "internal server eror";
    }
  }

  static async removeMybookingSchedule(bookingId: string) {
    try {
      const data = await prisma.booking.delete({
        where: { id: bookingId },
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
          message: "your booking schedule delete successfully",
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
    }
  }
}

export default TraineeServices;
