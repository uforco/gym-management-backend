import prisma from "../../../lib/prismaClient";
import argon2 from 'argon2';



const createProfileSystem = async (data: any) => {
    try{
      const ExstUser = await prisma.user.findFirst({
        where: { email: data.email },
        select: {
          email: true,
        },
      });
      if (ExstUser?.email) {
        return {
          statusCode: 406,
          errorMessage: "Trainee all ready Exist",
        };
      }
      const hashedPassword = await argon2.hash(data.password); // Hash the password
      const newTrainee = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          role: 'TRAINEE',
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
                    phone: true
                }
            }
        }
      });

      return {
        statusCode: 201,
        data: {
            success: true,
            message: "your account created successfully please login",
            data: newTrainee
        }
      };


    }catch(err){
      throw new Error ('internal server Error')
    }
  }

export default createProfileSystem;