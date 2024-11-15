import { AppError } from '../../errors/AppError';
import prismaClient from '../../prisma';

interface IVerifyAccData {
  email: string;
  code: string;
}

export class VerifyAccService {
  async execute({ email, code }: IVerifyAccData) {
    const user = await prismaClient.user.findFirst({
      where: {
        email
      }
    });

    if (!user)
      throw new AppError('User not found', 404);

    if (user.emailVerified)
      throw new AppError('Email already verified', 400);

    if (user.verifyEmailCode !== Number(code))
      throw new AppError('Invalid verification code', 401);

    if (Date.now() > user.verifyEmailCodeExpiry!.getTime())
      throw new AppError('Expired verification code', 401);

    await prismaClient.user.update({
      where: {
        id: user.id
      },
      data: {
        emailVerified: true,
        verifyEmailCode: null,
        verifyEmailCodeExpiry: null
      }
    });
  }
}