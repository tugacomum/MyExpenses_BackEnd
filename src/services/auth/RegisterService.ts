import bcrypt from 'bcryptjs';
import { resolve } from 'path';

import prismaClient from '../../prisma';
import { AppError } from '../../errors/AppError';
import SendMailService from './SendMailService';

export interface IRegisterData {
  name: string;
  email: string;
  password: string;
}

export class RegisterService {
  async execute(data: IRegisterData) {
    let { name, email, password } = data;

    const emailExists = await prismaClient.user.findFirst({
      where: {
        email
      }
    });

    if (emailExists) {
      throw new AppError('Email already in use', 409);
    }

    password = await bcrypt.hash(password, 10);

    const code = Math.floor(Math.random() * (999_999 - 100_000 + 1)) + 100_000;

    await prismaClient.user.create({
      data: {
        name,
        email,
        password,
        verifyEmailCode: code,
        verifyEmailCodeExpiry: new Date(Date.now() + 30 * 60 * 1000) 
      }
    });

    const variables = {
      name,
      code
    };

    const path = resolve(__dirname, '..', '..', 'views', 'email', 'verify.hbs');

    await SendMailService.execute(email, 'Verify your email on MyExpenses', variables, path);
  }
}