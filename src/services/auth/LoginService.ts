import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../../errors/AppError';
import prismaClient from '../../prisma';

interface ILoginData {
  email: string;
  password: string;
}

export class LoginService {
  async execute(data: ILoginData) {
    const { email, password } = data;

    const user = await prismaClient.user.findFirst({
      where: {
        email,
      }
    });

    if (!user)
      throw new AppError('Invalid credentials', 401);

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch)
      throw new AppError('Invalid credentials', 401);

    if (!user.emailVerified)
      throw new AppError('Email not verified', 403);

    const token = jwt.sign({}, process.env.JWT_SECRET, {
      jwtid: user.id.toString(),
      issuer: 'MyExpenses'
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    };
  }
}