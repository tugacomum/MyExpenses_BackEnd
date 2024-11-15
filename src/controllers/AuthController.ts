import { Request, Response } from 'express';
import { AppError } from '../errors/AppError';
import { LoginService } from '../services/auth/LoginService';
import { RegisterService } from '../services/auth/RegisterService';
import { VerifyAccService } from '../services/auth/VerifyAccService';

export class AuthController {
  async register(req: Request, res: Response) {
    const { name, email, password } = req.body;

    if (!name)
      throw new AppError('Name field missing', 400);

    if (!email)
      throw new AppError('Email field missing', 400);

    if (!password)
      throw new AppError('Password field missing', 400);

    const registerService = new RegisterService();

    await registerService.execute({
      name,
      email,
      password
    });

    return res.status(201).send();
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email)
      throw new AppError('Email field missing', 400);

    if (!password)
      throw new AppError('Password field missing', 400);

    const loginService = new LoginService();

    const { token, user } = await loginService.execute({
      email,
      password
    });

    return res.status(200).send({ token, user });
  }

  async verify(req: Request, res: Response) {
    const { email, code } = req.body;

    if (!email)
      throw new AppError('Email field missing', 400);

    if (!code)
      throw new AppError('Verification code field missing', 400);

    const verifyAccService = new VerifyAccService();

    await verifyAccService.execute({ email, code });

    res.status(200).send();
  }
}