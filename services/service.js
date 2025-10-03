import * as repo from "../repositories/repo.js";

export const createProfil = async (profilData) => {
  try {
    const profilId = await repo.addProfil(profilData);
    return profilId;
  } catch (error) {
    throw new Error(error.message);
  }
};

