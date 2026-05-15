
# Application de Suivi des Stagiaires OFPPT

Application web complète développée avec Laravel 11 et React.js permettant la gestion numérique des stagiaires.

## 🚀 Fonctionnalités

*   **Authentification & Rôles :** Admin, Formateur, et Stagiaire via API Tokens (Sanctum).
*   **Tableau de bord :** Statistiques en temps réel avec graphiques interactifs (Recharts).
*   **Gestion des Stagiaires :** Liste complète, filtres par groupe/filière/statut.
*   **Saisie des Notes :** Remplissage en masse par groupe et module. Calcul automatique de la moyenne et de l'appréciation. Export Excel.
*   **Pointage des Présences :** Interface rapide de gestion des présences et absences par séance. Système d'alerte.
*   **Suivi des Stages :** Statut d'avancement, rapport, évaluations de l'entreprise.

## 🛠 Stack Technique

*   **Backend :** Laravel 11, Sanctum API, MySQL (XAMPP).
*   **Frontend :** React 19 (Vite), Tailwind CSS v4, React Router DOM, TanStack Query, React Hook Form, Axios.

## 📦 Installation et Lancement

### 1. Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# Assurez-vous que MySQL est démarré via XAMPP
php artisan migrate:fresh --seed
php artisan serve
```

### 2. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

## 🔐 Données de test (Seeders)

L'application a été remplie avec des données marocaines factices :

*   **Admin :** `admin@ofppt.ma` | `password`
*   **Formateur :** `ahmed.benali@ofppt.ma` | `password`
*   **Stagiaire :** `mohammed.saide@gmail.com` | `password`

## 👨‍💻 Auteur

Développé par **Mohammed Saide** (Stagiaire Développement Digital - OFPPT).
=======
# scratch
>>>>>>> 909f929d1e6439f13f73f4d53306bba956952a1e
