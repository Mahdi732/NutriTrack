import db from "../db/db.js";

export const addProfil = async (profilData) => {
  const sql = `
    INSERT INTO Profil (
      user_id, sexe, date_naissance, taille_cm, poids_actuel_kg, poids_cible_kg,
      niveau_activite, sport_discipline, frequence_seances, duree_moyenne_min,
      depense_energetique, objectif, calories_cible, type_pathologie,
      glucides_pct, proteines_pct, lipides_pct
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    profilData.user_id,
    profilData.sexe,
    profilData.date_naissance,
    profilData.taille_cm,
    profilData.poids_actuel_kg,
    profilData.poids_cible_kg,
    profilData.niveau_activite,
    profilData.sport_discipline,
    profilData.frequence_seances,
    profilData.duree_moyenne_min,
    profilData.depense_energetique,
    profilData.objectif,
    profilData.calories_cible,
    profilData.type_pathologie,
    profilData.glucides_pct,
    profilData.proteines_pct,
    profilData.lipides_pct
  ];
  const [result] = await db.execute(sql, values);
  return result.insertId;
};
