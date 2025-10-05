import pool from '../db/db.js';

export const CreateProfile = async (profilData, userId) => {
  const query = `
    INSERT INTO profiles (
      user_id, sexe, taille_cm, poids_actuel_kg, poids_cible_kg,
      niveau_activite, sport_discipline, duree_moyenne_min,
      depense_energetique, objectif, type_pathologie
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      sexe = VALUES(sexe),
      taille_cm = VALUES(taille_cm),
      poids_actuel_kg = VALUES(poids_actuel_kg),
      poids_cible_kg = VALUES(poids_cible_kg),
      niveau_activite = VALUES(niveau_activite),
      sport_discipline = VALUES(sport_discipline),
      duree_moyenne_min = VALUES(duree_moyenne_min),
      depense_energetique = VALUES(depense_energetique),
      objectif = VALUES(objectif),
      type_pathologie = VALUES(type_pathologie),
      updated_at = CURRENT_TIMESTAMP
  `;

  const values = [
    userId,
    profilData.sexe,
    profilData.taille_cm,
    profilData.poids_actuel_kg,
    profilData.poids_cible_kg || null,
    profilData.niveau_activite || null,
    profilData.sport_discipline || null,
    profilData.duree_moyenne_min || null,
    profilData.depense_energetique || null,
    profilData.objectif || null,
    profilData.type_pathologie || "none"
  ];

  const [result] = await pool.execute(query, values);
  return result.insertId || result.affectedRows; 
};

export const getUserData = async (userId) => {
    const query = `
    SELECT u.full_name, 
    p.sexe, 
    p.taille_cm,
    p.poids_actuel_kg,
    p.poids_cible_kg,
    p.niveau_activite,
    p.sport_discipline,
    p.sport_discipline,
    p.duree_moyenne_min,
    p.depense_energetique,
    p.objectif,
    p.type_pathologie
    FROM users u
    JOIN profiles p on p.user_id = u.id
    WHERE u.id = (?)`;

    const [result] = await pool.execute(query, [userId])

    return result[0];
}