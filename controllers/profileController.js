import {createProfil} from "../services/profileService.js";

export const addProfilController = async (req, res) => {
  try {
    const profilData = req.body;
    const userId = req.session.user.id;
    const profilId = await createProfil(profilData, userId);
    res.status(201).json({ message: "Profil added", profilId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

