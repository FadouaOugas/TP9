import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

function CompteForm() {
  // Initialisation de l'état pour stocker les données du formulaire
  const [compte, setCompte] = useState({ solde: '', dateCreation: '', type: '' });

  // Gestion des changements dans les champs du formulaire
  const handleChange = (e) => {
    setCompte({ ...compte, [e.target.name]: e.target.value });
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    
    // Validation des champs
    if (!compte.solde || !compte.dateCreation || !compte.type) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    // Préparer les données pour l'API
    const compteData = {
      solde: parseFloat(compte.solde),
      dateCreation: compte.dateCreation,
      type: compte.type
    };

    axios.post(`${API_BASE_URL}/comptes`, compteData) // Envoie une requête POST avec les données
      .then(response => {
        alert('Compte ajouté avec succès !');
        // Réinitialiser le formulaire
        setCompte({ solde: '', dateCreation: '', type: '' });
        // Déclencher un événement pour rafraîchir la liste
        window.dispatchEvent(new Event('compteAdded'));
      })
      .catch(error => {
        console.error('Erreur lors de l\'ajout du compte:', error);
        alert('Erreur lors de l\'ajout du compte. Vérifiez que le backend est démarré.');
      });
  };

  return (
    <div className="container mt-4">
      <h2>Ajouter un Compte</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Solde</label>
          <input 
            type="number" 
            name="solde" 
            className="form-control" 
            value={compte.solde}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>
        <div className="mb-3">
          <label>Date de Création</label>
          <input 
            type="date" 
            name="dateCreation" 
            className="form-control" 
            value={compte.dateCreation}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Type</label>
          <select 
            name="type" 
            className="form-select" 
            value={compte.type}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionnez un type</option>
            <option value="COURANT">Courant</option>
            <option value="EPARGNE">Épargne</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Ajouter</button>
      </form>
    </div>
  );
}

export default CompteForm;

