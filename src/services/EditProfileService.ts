import prismaClient from '../prisma';

interface IEditProfileData {
  name?: string;
}

export class EditProfileService {
  async execute(userId: number, { name }: IEditProfileData) {
    await prismaClient.user.update({
      where: {
        id: userId
      },
      data: {
        name,
      }
    })
  }
}