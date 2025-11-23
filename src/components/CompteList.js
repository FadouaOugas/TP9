import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

function CompteList() {
  // Déclaration d'un état pour stocker les comptes
  const [comptes, setComptes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour charger les comptes
  const loadComptes = () => {
    setLoading(true);
    setError(null);
    axios.get(`${API_BASE_URL}/comptes`)
      .then(response => {
        setComptes(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors du chargement des comptes:', error);
        setError('Impossible de charger les comptes. Vérifiez que le backend est démarré sur le port 8082.');
        setLoading(false);
      });
  };

  // Utilisation de useEffect pour effectuer un appel à l'API dès le chargement
  useEffect(() => {
    loadComptes();
  }, []); // Le tableau vide indique que l'effet s'exécute uniquement au montage du composant

  // Exposer la fonction pour pouvoir la réutiliser depuis le parent
  useEffect(() => {
    // Écouter les événements de rafraîchissement
    const handleRefresh = () => loadComptes();
    window.addEventListener('compteAdded', handleRefresh);
    return () => window.removeEventListener('compteAdded', handleRefresh);
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Liste des Comptes</h2>
        <button className="btn btn-secondary" onClick={loadComptes} disabled={loading}>
          {loading ? 'Chargement...' : 'Rafraîchir'}
        </button>
      </div>
      
      {loading && (
        <div className="alert alert-info">Chargement des comptes...</div>
      )}
      
      {error && (
        <div className="alert alert-danger">
          <strong>Erreur :</strong> {error}
          <br />
          <small>URL de l'API : {API_BASE_URL}/comptes</small>
        </div>
      )}
      
      {!loading && !error && comptes.length === 0 && (
        <div className="alert alert-warning">Aucun compte trouvé.</div>
      )}
      
      {!loading && !error && comptes.length > 0 && (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Solde</th>
              <th>Date de Création</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {comptes.map(compte => (
              <tr key={compte.id}>
                <td>{compte.id}</td>
                <td>{compte.solde != null ? compte.solde.toFixed(2) : 'N/A'}</td>
                <td>{new Date(compte.dateCreation).toLocaleDateString('fr-FR')}</td>
                <td>{compte.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CompteList;

