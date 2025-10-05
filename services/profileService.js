import {CreateProfile} from "../repositories/profileRepository.js";

export const createProfil = async (profilData, userId) => {
  try {
    const profilId = await CreateProfile(profilData, userId);
    return profilId;
  } catch (error) {
    throw new Error(error.message);
  }
};

