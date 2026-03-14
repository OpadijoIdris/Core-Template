import prisma from "../config/postgres.js";
import cloudinary from "../utilis/cloudinary.js";

export const getUserService = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    if(!user){
        return null;
    };

    const { password, ...safeUser } = user;
    return safeUser;
};

export const getAllUsersService = async () => {
    const users = await prisma.user.findMany();

    return users.map(({ password, ...safeUser }) => safeUser);
};

export const updateUserService = async(id, data) => {
    return prisma.user.update({
        where: { id },
        data,
        select: {
            id: true,
            email: true, 
            firstName: true,
            lastName: true,
            role: false,
        }
    })
};

export const deleteUserService = async (id) => {
    await prisma.user.delete({
        where: { id }
    })
};

export const uploadAvatarService = async (userId, file) => {
  if (!file) {
    throw new Error("No file provided");
  }

  const result = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "avatars",
        public_id: `user_${userId}`,
        overwrite: true,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );

    uploadStream.end(file.buffer);
  });

  const user = await prisma.user.update({
    where: { id: userId },
    data: { avatarUrl: result.secure_url },
    select: { id: true, avatarUrl: true },
  });

  return user;
};
