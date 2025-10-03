import * as service from "../services/service.js";

export const addProfilController = async (req, res) => {
  try {
    const profilData = req.body; 
    const profilId = await service.createProfil(profilData);
    res.status(201).json({ message: "Profil added", profilId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

