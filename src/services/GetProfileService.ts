import { AppError } from '../errors/AppError';
import prismaClient from '../prisma';

export class GetProfileService {
  async execute(userId: number) {
    const user = await prismaClient.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user)
      throw new AppError('User not found', 404);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}