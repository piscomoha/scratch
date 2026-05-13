<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Filiere;
use App\Models\Module;
use App\Models\Stagiaire;
use App\Models\Note;
use App\Models\Presence;
use App\Models\Stage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ═══ Création des utilisateurs ═══

        // 1 Admin
        $admin = User::create([
            'name' => 'Admin OFPPT',
            'email' => 'admin@ofppt.ma',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // 2 Formateurs
        $formateur1 = User::create([
            'name' => 'Ahmed Benali',
            'email' => 'ahmed.benali@ofppt.ma',
            'password' => Hash::make('password'),
            'role' => 'formateur',
        ]);

        $formateur2 = User::create([
            'name' => 'Fatima Zahra',
            'email' => 'fatima.zahra@ofppt.ma',
            'password' => Hash::make('password'),
            'role' => 'formateur',
        ]);

        // ═══ Création des filières ═══
        $devDigital = Filiere::create([
            'code' => 'DEV',
            'libelle' => 'Développement Digital',
            'duree_annees' => 2,
            'description' => 'Formation en développement web et mobile, option full-stack.',
        ]);

        $infra = Filiere::create([
            'code' => 'TRI',
            'libelle' => 'Techniques des Réseaux Informatiques',
            'duree_annees' => 2,
            'description' => 'Administration systèmes, réseaux et sécurité informatique.',
        ]);

        $gestion = Filiere::create([
            'code' => 'GE',
            'libelle' => 'Gestion des Entreprises',
            'duree_annees' => 2,
            'description' => 'Comptabilité, gestion financière et management.',
        ]);

        // ═══ Création des modules pour DEV ═══
        $modules = [];

        $modulesData = [
            // DEV - Année 1
            ['code' => 'M101', 'intitule' => 'Programmation structurée', 'coefficient' => 3, 'filiere_id' => $devDigital->id, 'semestre' => 1, 'annee_formation' => 1],
            ['code' => 'M102', 'intitule' => 'HTML/CSS', 'coefficient' => 2, 'filiere_id' => $devDigital->id, 'semestre' => 1, 'annee_formation' => 1],
            ['code' => 'M103', 'intitule' => 'JavaScript', 'coefficient' => 3, 'filiere_id' => $devDigital->id, 'semestre' => 1, 'annee_formation' => 1],
            ['code' => 'M104', 'intitule' => 'Base de données', 'coefficient' => 3, 'filiere_id' => $devDigital->id, 'semestre' => 2, 'annee_formation' => 1],
            ['code' => 'M105', 'intitule' => 'PHP & MySQL', 'coefficient' => 3, 'filiere_id' => $devDigital->id, 'semestre' => 2, 'annee_formation' => 1],
            // DEV - Année 2
            ['code' => 'M201', 'intitule' => 'Framework Laravel', 'coefficient' => 4, 'filiere_id' => $devDigital->id, 'semestre' => 1, 'annee_formation' => 2],
            ['code' => 'M202', 'intitule' => 'React.js', 'coefficient' => 4, 'filiere_id' => $devDigital->id, 'semestre' => 1, 'annee_formation' => 2],
            ['code' => 'M203', 'intitule' => 'DevOps & Déploiement', 'coefficient' => 2, 'filiere_id' => $devDigital->id, 'semestre' => 2, 'annee_formation' => 2],
            // TRI - Année 1
            ['code' => 'T101', 'intitule' => 'Architecture des ordinateurs', 'coefficient' => 2, 'filiere_id' => $infra->id, 'semestre' => 1, 'annee_formation' => 1],
            ['code' => 'T102', 'intitule' => 'Réseaux informatiques', 'coefficient' => 4, 'filiere_id' => $infra->id, 'semestre' => 1, 'annee_formation' => 1],
            ['code' => 'T103', 'intitule' => 'Systèmes d\'exploitation', 'coefficient' => 3, 'filiere_id' => $infra->id, 'semestre' => 2, 'annee_formation' => 1],
            // GE - Année 1
            ['code' => 'G101', 'intitule' => 'Comptabilité générale', 'coefficient' => 4, 'filiere_id' => $gestion->id, 'semestre' => 1, 'annee_formation' => 1],
            ['code' => 'G102', 'intitule' => 'Droit commercial', 'coefficient' => 2, 'filiere_id' => $gestion->id, 'semestre' => 1, 'annee_formation' => 1],
        ];

        foreach ($modulesData as $m) {
            $modules[] = Module::create($m);
        }

        // ═══ Création de 10 stagiaires de test ═══
        $stagiairesData = [
            ['code_massar' => 'D123456', 'nom' => 'Saide', 'prenom' => 'Mohammed', 'date_naissance' => '2003-05-15', 'genre' => 'M', 'telephone' => '0612345678', 'email' => 'mohammed.saide@gmail.com', 'ville' => 'Casablanca', 'filiere_id' => $devDigital->id, 'groupe' => 'DEV201', 'annee_formation' => 2],
            ['code_massar' => 'D123457', 'nom' => 'El Amrani', 'prenom' => 'Youssef', 'date_naissance' => '2002-08-20', 'genre' => 'M', 'telephone' => '0654321098', 'email' => 'youssef.amrani@gmail.com', 'ville' => 'Rabat', 'filiere_id' => $devDigital->id, 'groupe' => 'DEV201', 'annee_formation' => 2],
            ['code_massar' => 'D123458', 'nom' => 'Bennani', 'prenom' => 'Sara', 'date_naissance' => '2003-01-10', 'genre' => 'F', 'telephone' => '0698765432', 'email' => 'sara.bennani@gmail.com', 'ville' => 'Fès', 'filiere_id' => $devDigital->id, 'groupe' => 'DEV202', 'annee_formation' => 2],
            ['code_massar' => 'D123459', 'nom' => 'Tazi', 'prenom' => 'Khalid', 'date_naissance' => '2004-03-25', 'genre' => 'M', 'telephone' => '0611223344', 'email' => 'khalid.tazi@gmail.com', 'ville' => 'Marrakech', 'filiere_id' => $devDigital->id, 'groupe' => 'DEV101', 'annee_formation' => 1],
            ['code_massar' => 'D123460', 'nom' => 'Ouazzani', 'prenom' => 'Amal', 'date_naissance' => '2003-11-02', 'genre' => 'F', 'telephone' => '0622334455', 'email' => 'amal.ouazzani@gmail.com', 'ville' => 'Tanger', 'filiere_id' => $devDigital->id, 'groupe' => 'DEV101', 'annee_formation' => 1],
            ['code_massar' => 'T123461', 'nom' => 'Chakir', 'prenom' => 'Omar', 'date_naissance' => '2002-07-18', 'genre' => 'M', 'telephone' => '0633445566', 'email' => 'omar.chakir@gmail.com', 'ville' => 'Oujda', 'filiere_id' => $infra->id, 'groupe' => 'TRI101', 'annee_formation' => 1],
            ['code_massar' => 'T123462', 'nom' => 'Lahlou', 'prenom' => 'Imane', 'date_naissance' => '2003-09-30', 'genre' => 'F', 'telephone' => '0644556677', 'email' => 'imane.lahlou@gmail.com', 'ville' => 'Meknès', 'filiere_id' => $infra->id, 'groupe' => 'TRI101', 'annee_formation' => 1],
            ['code_massar' => 'G123463', 'nom' => 'Rachidi', 'prenom' => 'Hamza', 'date_naissance' => '2004-02-14', 'genre' => 'M', 'telephone' => '0655667788', 'email' => 'hamza.rachidi@gmail.com', 'ville' => 'Agadir', 'filiere_id' => $gestion->id, 'groupe' => 'GE101', 'annee_formation' => 1],
            ['code_massar' => 'G123464', 'nom' => 'Moussaoui', 'prenom' => 'Nadia', 'date_naissance' => '2003-06-22', 'genre' => 'F', 'telephone' => '0666778899', 'email' => 'nadia.moussaoui@gmail.com', 'ville' => 'Tétouan', 'filiere_id' => $gestion->id, 'groupe' => 'GE101', 'annee_formation' => 1],
            ['code_massar' => 'D123465', 'nom' => 'Idrissi', 'prenom' => 'Amine', 'date_naissance' => '2002-12-05', 'genre' => 'M', 'telephone' => '0677889900', 'email' => 'amine.idrissi@gmail.com', 'ville' => 'Kenitra', 'filiere_id' => $devDigital->id, 'groupe' => 'DEV201', 'annee_formation' => 2, 'statut' => 'suspendu'],
        ];

        $stagiaires = [];
        foreach ($stagiairesData as $data) {
            $stagiaires[] = Stagiaire::create(array_merge(['adresse' => 'Adresse test'], $data));
        }

        // ═══ Création de quelques notes ═══
        $devModules = array_slice($modules, 0, 5); // Modules DEV année 1
        foreach ([$stagiaires[0], $stagiaires[1], $stagiaires[2]] as $stag) {
            foreach (array_slice($modules, 5, 3) as $mod) { // Modules DEV année 2
                Note::create([
                    'stagiaire_id' => $stag->id,
                    'module_id' => $mod->id,
                    'note_controle' => fake()->randomFloat(2, 6, 18),
                    'note_synthese' => fake()->randomFloat(2, 6, 18),
                    'annee_scolaire' => '2024-2025',
                    'semestre' => $mod->semestre,
                ]);
            }
        }

        // Notes pour les stagiaires année 1
        foreach ([$stagiaires[3], $stagiaires[4]] as $stag) {
            foreach (array_slice($modules, 0, 3) as $mod) { // Modules DEV année 1, S1
                Note::create([
                    'stagiaire_id' => $stag->id,
                    'module_id' => $mod->id,
                    'note_controle' => fake()->randomFloat(2, 8, 19),
                    'note_synthese' => fake()->randomFloat(2, 7, 18),
                    'annee_scolaire' => '2024-2025',
                    'semestre' => 1,
                ]);
            }
        }

        // ═══ Création de présences ═══
        $dates = ['2025-03-24', '2025-03-25', '2025-03-26', '2025-03-27', '2025-03-28'];
        $statuts = ['present', 'present', 'present', 'absent', 'retard', 'present', 'justifie'];

        foreach ($dates as $date) {
            foreach ([$stagiaires[0], $stagiaires[1], $stagiaires[2], $stagiaires[3], $stagiaires[4]] as $stag) {
                Presence::create([
                    'stagiaire_id' => $stag->id,
                    'module_id' => $modules[0]->id,
                    'date_seance' => $date,
                    'heure_debut' => '08:30',
                    'heure_fin' => '12:30',
                    'statut' => $statuts[array_rand($statuts)],
                    'formateur_id' => $formateur1->id,
                ]);
            }
        }

        // ═══ Création d'un stage ═══
        Stage::create([
            'stagiaire_id' => $stagiaires[0]->id,
            'entreprise_nom' => 'TechnoSoft Maroc',
            'entreprise_secteur' => 'Développement logiciel',
            'entreprise_ville' => 'Casablanca',
            'responsable_nom' => 'Karim Alaoui',
            'responsable_telephone' => '0522445566',
            'responsable_email' => 'k.alaoui@technosoft.ma',
            'date_debut' => '2025-04-01',
            'date_fin' => '2025-05-31',
            'duree_semaines' => 8,
            'statut' => 'en_attente',
        ]);

        Stage::create([
            'stagiaire_id' => $stagiaires[1]->id,
            'entreprise_nom' => 'Digital Wave',
            'entreprise_secteur' => 'Marketing digital',
            'entreprise_ville' => 'Rabat',
            'responsable_nom' => 'Leila Fassi',
            'responsable_telephone' => '0537112233',
            'responsable_email' => 'l.fassi@digitalwave.ma',
            'date_debut' => '2025-03-15',
            'date_fin' => '2025-05-15',
            'duree_semaines' => 8,
            'statut' => 'en_cours',
        ]);
    }
}
