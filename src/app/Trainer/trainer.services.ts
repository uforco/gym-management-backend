import prisma from "../../lib/prismaClient";

class TrainerServices {
  constructor() {}

  static async getSchedulesBytrainer(trainerId: any) {
    try {
      const scheduls = await prisma.schedule.findMany({
        where: { trainerId },
        select: {
          id: true,
          date: true,
          startTime: true,
          endTime: true,
          bookings: {
            select: {
              trainee: {
                select: {
                  profile: {
                    select: {
                      name: true,
                      age: true,
                      phone: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
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
}

export default TrainerServices;
