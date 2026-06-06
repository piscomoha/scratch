-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 06, 2026 at 01:13 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ofppt_stagiaires`
--

-- --------------------------------------------------------

--
-- Table structure for table `affectations`
--

CREATE TABLE `affectations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `filiere_id` bigint(20) UNSIGNED NOT NULL,
  `groupe` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `affectations`
--

INSERT INTO `affectations` (`id`, `user_id`, `filiere_id`, `groupe`, `created_at`, `updated_at`) VALUES
(16, 14, 1, 'DEV201', '2026-05-22 18:07:46', '2026-05-22 18:07:46'),
(17, 14, 1, 'DEV103', '2026-05-22 18:07:46', '2026-05-22 18:07:46'),
(20, 2, 2, 'TRI101', '2026-05-23 15:00:48', '2026-05-23 15:00:48'),
(21, 2, 1, 'DEV101', '2026-05-23 15:00:48', '2026-05-23 15:00:48'),
(22, 24, 1, 'DEV202', '2026-05-23 15:12:53', '2026-05-23 15:12:53'),
(23, 24, 2, 'TRI101', '2026-05-23 15:12:53', '2026-05-23 15:12:53');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_type` varchar(255) NOT NULL,
  `file_size` int(11) NOT NULL,
  `category` varchar(255) NOT NULL,
  `shared_with` varchar(255) NOT NULL DEFAULT 'all',
  `filiere_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `module_id` bigint(20) UNSIGNED DEFAULT NULL,
  `groupe` varchar(255) DEFAULT NULL,
  `annee_formation` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `documents`
--

INSERT INTO `documents` (`id`, `title`, `file_path`, `file_type`, `file_size`, `category`, `shared_with`, `filiere_id`, `user_id`, `module_id`, `groupe`, `annee_formation`, `created_at`, `updated_at`) VALUES
(1, 'Test', 'test.pdf', 'pdf', 1000, 'schedule', 'all', NULL, 1, NULL, NULL, NULL, '2026-05-22 18:18:41', '2026-05-22 18:18:41'),
(2, 'WhatsApp Image 2025-11-10 at 17', 'documents/naAj6X9XjrGCcnsWZkmgxIn59NtZ6gTZ8RpZLRRi.jpg', 'jpg', 311998, 'schedule', 'all', NULL, 1, NULL, NULL, NULL, '2026-05-22 18:28:09', '2026-05-22 18:28:09'),
(3, 'annonce pours tous', 'documents/YikzpJklapnx3MbHmFdDOGedmCdcYHrvggysmNpa.png', 'png', 1760356, 'schedule', 'all', NULL, 1, NULL, NULL, NULL, '2026-05-22 18:51:27', '2026-05-22 18:51:27'),
(4, 'Bulletin de fin d\'année', 'bulletin.pdf', 'pdf', 524288, 'administrative', 'all', NULL, 1, NULL, NULL, NULL, '2026-05-22 19:05:38', '2026-05-22 19:05:38'),
(5, '3_Ses conseils pour réussir dans l\'entrepreneuriat', 'documents/pEkYwQEFY4LWICMHcv46uBn9k7zjI4k4FDZh1KPX.png', 'png', 1760356, 'schedule', 'stagiaires', NULL, 1, NULL, NULL, NULL, '2026-05-23 08:33:43', '2026-05-23 08:33:43'),
(6, 'phptot', 'documents/VGEL66sm4lo6r3LBQ2XAYhtL67IsRMgbQryqGbSj.png', 'png', 1553297, 'schedule', 'formateurs', NULL, 1, NULL, NULL, NULL, '2026-05-23 08:36:19', '2026-05-23 08:36:19'),
(7, '1_Saloua Karkri Belkziz, une entrepreneure inspirante', 'documents/XGqxrFIwz9Tvlt0Ah9IdO0maZzoBPWXVqPvOMWIF.png', 'png', 1452621, 'schedule', 'formateurs', 1, 1, NULL, NULL, NULL, '2026-05-23 08:40:35', '2026-05-23 08:40:35'),
(8, '1_Saloua Karkri Belkziz, une entrepreneure inspirante', 'documents/74M0COhrHffxSHh4cBeElvK35yYZgAcd5SWNk29R.png', 'png', 1452621, 'schedule', 'all', NULL, 1, NULL, NULL, NULL, '2026-05-23 08:49:29', '2026-05-23 08:49:29'),
(9, '1_Saloua Karkri Belkziz, une entrepreneure inspirante', 'documents/6AGH0LzjIzCRJfBjuh0lVdHnDyjrN6ZHXQAgce5r.png', 'png', 1452621, 'schedule', 'stagiaires', NULL, 1, NULL, NULL, NULL, '2026-05-23 08:51:48', '2026-05-23 08:51:48');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `filieres`
--

CREATE TABLE `filieres` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(255) NOT NULL,
  `libelle` varchar(255) NOT NULL,
  `duree_annees` int(11) NOT NULL DEFAULT 2,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `filieres`
--

INSERT INTO `filieres` (`id`, `code`, `libelle`, `duree_annees`, `description`, `created_at`, `updated_at`) VALUES
(1, 'DEV', 'Développement Digital', 2, 'Formation en développement web et mobile, option full-stack.', '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(2, 'TRI', 'Techniques des Réseaux Informatiques', 2, 'Administration systèmes, réseaux et sécurité informatique.', '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(3, 'GE', 'Gestion des Entreprises', 2, 'Comptabilité, gestion financière et management.', '2026-03-31 09:35:16', '2026-03-31 09:35:16');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2024_01_01_000001_create_filieres_table', 1),
(5, '2024_01_01_000002_create_stagiaires_table', 1),
(6, '2024_01_01_000003_create_modules_table', 1),
(7, '2024_01_01_000004_create_notes_table', 1),
(8, '2024_01_01_000005_create_presences_table', 1),
(9, '2024_01_01_000006_create_stages_table', 1),
(10, '2026_03_31_114420_create_personal_access_tokens_table', 2),
(11, '2026_05_14_150905_add_is_regional_to_modules_table', 3),
(12, '2026_05_14_150905_create_affectations_table', 3),
(13, '2026_05_14_152735_add_extra_controls_to_notes_table', 4),
(14, '2026_05_14_153521_add_note_stage_to_notes_table', 5),
(15, '2026_05_16_103346_create_documents_table', 6),
(16, '2026_05_16_110723_create_notifications_table', 7),
(17, '2026_05_22_202426_add_shared_with_to_documents_table', 8),
(18, '2026_05_22_204952_add_stagiaire_fields_to_users_table', 9),
(19, '2026_05_23_130000_allow_incomplete_stagiaire_profiles', 9),
(20, '2026_05_26_000001_add_shared_with_admin_to_presences_table', 10),
(21, '2026_06_06_000001_add_stage_form_fields', 11);

-- --------------------------------------------------------

--
-- Table structure for table `modules`
--

CREATE TABLE `modules` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(255) NOT NULL,
  `intitule` varchar(255) NOT NULL,
  `coefficient` decimal(3,1) NOT NULL DEFAULT 1.0,
  `filiere_id` bigint(20) UNSIGNED NOT NULL,
  `semestre` int(11) NOT NULL,
  `annee_formation` int(11) NOT NULL,
  `is_regional` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `modules`
--

INSERT INTO `modules` (`id`, `code`, `intitule`, `coefficient`, `filiere_id`, `semestre`, `annee_formation`, `is_regional`, `created_at`, `updated_at`) VALUES
(1, 'M101', 'Programmation structurée', 3.0, 1, 1, 1, 0, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(2, 'M102', 'HTML/CSS', 2.0, 1, 1, 1, 0, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(3, 'M103', 'JavaScript', 3.0, 1, 1, 1, 0, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(4, 'M104', 'Base de données', 3.0, 1, 2, 1, 0, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(5, 'M105', 'PHP & MySQL', 3.0, 1, 2, 1, 0, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(6, 'M201', 'Framework Laravel', 4.0, 1, 1, 2, 0, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(7, 'M202', 'React.js', 4.0, 1, 1, 2, 0, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(8, 'M203', 'DevOps & Déploiement', 2.0, 1, 2, 2, 0, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(9, 'T101', 'Architecture des ordinateurs', 2.0, 2, 1, 1, 0, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(10, 'T102', 'Réseaux informatiques', 4.0, 2, 1, 1, 0, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(11, 'T103', 'Systèmes d\'exploitation', 3.0, 2, 2, 1, 0, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(12, 'G101', 'Comptabilité générale', 4.0, 3, 1, 1, 0, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(13, 'G102', 'Droit commercial', 2.0, 3, 1, 1, 0, '2026-03-31 09:35:16', '2026-03-31 09:35:16');

-- --------------------------------------------------------

--
-- Table structure for table `notes`
--

CREATE TABLE `notes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `stagiaire_id` bigint(20) UNSIGNED NOT NULL,
  `module_id` bigint(20) UNSIGNED NOT NULL,
  `note_controle_1` decimal(4,2) DEFAULT NULL,
  `note_controle_2` decimal(5,2) DEFAULT NULL,
  `note_controle_3` decimal(5,2) DEFAULT NULL,
  `note_synthese` decimal(4,2) DEFAULT NULL,
  `note_stage` decimal(5,2) DEFAULT NULL,
  `note_finale` decimal(4,2) DEFAULT NULL,
  `appreciation` enum('TB','B','AB','P','I') DEFAULT NULL,
  `annee_scolaire` varchar(255) NOT NULL,
  `semestre` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notes`
--

INSERT INTO `notes` (`id`, `stagiaire_id`, `module_id`, `note_controle_1`, `note_controle_2`, `note_controle_3`, `note_synthese`, `note_stage`, `note_finale`, `appreciation`, `annee_scolaire`, `semestre`, `created_at`, `updated_at`) VALUES
(4, 2, 6, 17.99, NULL, NULL, 16.80, NULL, 17.28, 'TB', '2024-2025', 1, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(5, 2, 7, 15.95, NULL, NULL, 7.33, NULL, 10.78, 'AB', '2024-2025', 1, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(6, 2, 8, 15.43, NULL, NULL, 12.70, NULL, 13.79, 'B', '2024-2025', 2, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(7, 3, 6, 12.99, NULL, NULL, 15.00, NULL, 14.20, 'TB', '2024-2025', 1, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(8, 3, 7, 15.71, NULL, NULL, 10.79, NULL, 12.76, 'B', '2024-2025', 1, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(9, 3, 8, 10.59, NULL, NULL, 16.66, NULL, 14.23, 'TB', '2024-2025', 2, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(13, 5, 1, 17.95, NULL, NULL, 11.13, NULL, 13.86, 'B', '2024-2025', 1, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(14, 5, 2, 8.82, NULL, NULL, 7.22, NULL, 7.86, 'I', '2024-2025', 1, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(15, 5, 3, 14.76, NULL, NULL, 7.07, NULL, 10.15, 'AB', '2024-2025', 1, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(16, 2, 1, 17.50, 15.00, NULL, 18.00, NULL, NULL, NULL, '2025/2026', 2, '2026-05-22 19:05:37', '2026-05-22 19:05:37'),
(18, 17, 1, 12.00, 13.00, 18.00, NULL, NULL, NULL, NULL, '2024-2025', 1, '2026-05-23 09:47:45', '2026-05-23 09:49:17'),
(19, 3, 1, 12.00, 14.00, 13.50, NULL, NULL, NULL, NULL, '2024-2025', 1, '2026-05-23 09:48:18', '2026-05-23 09:49:21'),
(20, 5, 6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-2025', 1, '2026-06-06 07:05:39', '2026-06-06 07:05:39');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'info',
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `link` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `type`, `is_read`, `link`, `created_at`, `updated_at`) VALUES
(1, 14, 'Mise à jour de vos affectations', 'L\'administrateur a mis à jour vos groupes affectés. Veuillez consulter votre tableau de bord.', 'info', 1, '/dashboard', '2026-05-22 18:05:54', '2026-05-22 18:06:50'),
(2, 14, 'Mise à jour de vos affectations', 'L\'administrateur a mis à jour vos groupes affectés. Veuillez consulter votre tableau de bord.', 'info', 0, '/dashboard', '2026-05-22 18:07:46', '2026-05-22 18:07:46'),
(3, 2, 'Nouveau document partagé', 'Un nouveau document a été partagé : WhatsApp Image 2025-11-10 at 17', 'info', 1, '/documents', '2026-05-22 18:28:09', '2026-05-26 13:16:07'),
(4, 3, 'Nouveau document partagé', 'Un nouveau document a été partagé : WhatsApp Image 2025-11-10 at 17', 'info', 0, '/documents', '2026-05-22 18:28:09', '2026-05-22 18:28:09'),
(5, 14, 'Nouveau document partagé', 'Un nouveau document a été partagé : WhatsApp Image 2025-11-10 at 17', 'info', 0, '/documents', '2026-05-22 18:28:09', '2026-05-22 18:28:09'),
(6, 4, 'Nouveau document partagé', 'Un nouveau document a été partagé : WhatsApp Image 2025-11-10 at 17', 'info', 0, '/documents', '2026-05-22 18:28:09', '2026-05-22 18:28:09'),
(7, 5, 'Nouveau document partagé', 'Un nouveau document a été partagé : WhatsApp Image 2025-11-10 at 17', 'info', 1, '/documents', '2026-05-22 18:28:09', '2026-05-22 19:29:03'),
(8, 6, 'Nouveau document partagé', 'Un nouveau document a été partagé : WhatsApp Image 2025-11-10 at 17', 'info', 0, '/documents', '2026-05-22 18:28:09', '2026-05-22 18:28:09'),
(9, 7, 'Nouveau document partagé', 'Un nouveau document a été partagé : WhatsApp Image 2025-11-10 at 17', 'info', 0, '/documents', '2026-05-22 18:28:09', '2026-05-22 18:28:09'),
(10, 8, 'Nouveau document partagé', 'Un nouveau document a été partagé : WhatsApp Image 2025-11-10 at 17', 'info', 0, '/documents', '2026-05-22 18:28:09', '2026-05-22 18:28:09'),
(11, 9, 'Nouveau document partagé', 'Un nouveau document a été partagé : WhatsApp Image 2025-11-10 at 17', 'info', 0, '/documents', '2026-05-22 18:28:09', '2026-05-22 18:28:09'),
(12, 10, 'Nouveau document partagé', 'Un nouveau document a été partagé : WhatsApp Image 2025-11-10 at 17', 'info', 0, '/documents', '2026-05-22 18:28:09', '2026-05-22 18:28:09'),
(13, 11, 'Nouveau document partagé', 'Un nouveau document a été partagé : WhatsApp Image 2025-11-10 at 17', 'info', 0, '/documents', '2026-05-22 18:28:09', '2026-05-22 18:28:09'),
(14, 12, 'Nouveau document partagé', 'Un nouveau document a été partagé : WhatsApp Image 2025-11-10 at 17', 'info', 0, '/documents', '2026-05-22 18:28:09', '2026-05-22 18:28:09'),
(15, 13, 'Nouveau document partagé', 'Un nouveau document a été partagé : WhatsApp Image 2025-11-10 at 17', 'info', 0, '/documents', '2026-05-22 18:28:09', '2026-05-22 18:28:09'),
(16, 2, 'Nouveau document partagé', 'Un nouveau document a été partagé : annonce pours tous', 'info', 1, '/documents', '2026-05-22 18:51:27', '2026-05-26 13:16:07'),
(17, 3, 'Nouveau document partagé', 'Un nouveau document a été partagé : annonce pours tous', 'info', 0, '/documents', '2026-05-22 18:51:27', '2026-05-22 18:51:27'),
(18, 14, 'Nouveau document partagé', 'Un nouveau document a été partagé : annonce pours tous', 'info', 0, '/documents', '2026-05-22 18:51:27', '2026-05-22 18:51:27'),
(19, 4, 'Nouveau document partagé', 'Un nouveau document a été partagé : annonce pours tous', 'info', 0, '/documents', '2026-05-22 18:51:27', '2026-05-22 18:51:27'),
(20, 5, 'Nouveau document partagé', 'Un nouveau document a été partagé : annonce pours tous', 'info', 1, '/documents', '2026-05-22 18:51:27', '2026-05-22 19:29:03'),
(21, 6, 'Nouveau document partagé', 'Un nouveau document a été partagé : annonce pours tous', 'info', 0, '/documents', '2026-05-22 18:51:27', '2026-05-22 18:51:27'),
(22, 7, 'Nouveau document partagé', 'Un nouveau document a été partagé : annonce pours tous', 'info', 0, '/documents', '2026-05-22 18:51:27', '2026-05-22 18:51:27'),
(23, 8, 'Nouveau document partagé', 'Un nouveau document a été partagé : annonce pours tous', 'info', 0, '/documents', '2026-05-22 18:51:27', '2026-05-22 18:51:27'),
(24, 9, 'Nouveau document partagé', 'Un nouveau document a été partagé : annonce pours tous', 'info', 0, '/documents', '2026-05-22 18:51:27', '2026-05-22 18:51:27'),
(25, 10, 'Nouveau document partagé', 'Un nouveau document a été partagé : annonce pours tous', 'info', 0, '/documents', '2026-05-22 18:51:27', '2026-05-22 18:51:27'),
(26, 11, 'Nouveau document partagé', 'Un nouveau document a été partagé : annonce pours tous', 'info', 0, '/documents', '2026-05-22 18:51:27', '2026-05-22 18:51:27'),
(27, 12, 'Nouveau document partagé', 'Un nouveau document a été partagé : annonce pours tous', 'info', 0, '/documents', '2026-05-22 18:51:27', '2026-05-22 18:51:27'),
(28, 13, 'Nouveau document partagé', 'Un nouveau document a été partagé : annonce pours tous', 'info', 0, '/documents', '2026-05-22 18:51:27', '2026-05-22 18:51:27'),
(29, 4, 'Nouvelle note enregistrée', 'Votre note pour le module Programmation structurée a été publiée.', 'success', 0, '/dashboard', '2026-05-22 19:05:38', '2026-05-22 19:05:38'),
(30, 4, 'Nouveau document partagé', 'L\'administration a partagé un nouveau document : Bulletin de fin d\'année', 'info', 0, '/dashboard', '2026-05-22 19:05:38', '2026-05-22 19:05:38'),
(31, 4, 'Nouveau document partagé', 'Un nouveau document a été partagé : 3_Ses conseils pour réussir dans l\'entrepreneuriat', 'info', 0, 'http://localhost:8000/storage/documents/pEkYwQEFY4LWICMHcv46uBn9k7zjI4k4FDZh1KPX.png', '2026-05-23 08:33:43', '2026-05-23 08:33:43'),
(32, 5, 'Nouveau document partagé', 'Un nouveau document a été partagé : 3_Ses conseils pour réussir dans l\'entrepreneuriat', 'info', 0, 'http://localhost:8000/storage/documents/pEkYwQEFY4LWICMHcv46uBn9k7zjI4k4FDZh1KPX.png', '2026-05-23 08:33:43', '2026-05-23 08:33:43'),
(33, 6, 'Nouveau document partagé', 'Un nouveau document a été partagé : 3_Ses conseils pour réussir dans l\'entrepreneuriat', 'info', 0, 'http://localhost:8000/storage/documents/pEkYwQEFY4LWICMHcv46uBn9k7zjI4k4FDZh1KPX.png', '2026-05-23 08:33:43', '2026-05-23 08:33:43'),
(34, 7, 'Nouveau document partagé', 'Un nouveau document a été partagé : 3_Ses conseils pour réussir dans l\'entrepreneuriat', 'info', 0, 'http://localhost:8000/storage/documents/pEkYwQEFY4LWICMHcv46uBn9k7zjI4k4FDZh1KPX.png', '2026-05-23 08:33:43', '2026-05-23 08:33:43'),
(35, 8, 'Nouveau document partagé', 'Un nouveau document a été partagé : 3_Ses conseils pour réussir dans l\'entrepreneuriat', 'info', 0, 'http://localhost:8000/storage/documents/pEkYwQEFY4LWICMHcv46uBn9k7zjI4k4FDZh1KPX.png', '2026-05-23 08:33:43', '2026-05-23 08:33:43'),
(36, 9, 'Nouveau document partagé', 'Un nouveau document a été partagé : 3_Ses conseils pour réussir dans l\'entrepreneuriat', 'info', 0, 'http://localhost:8000/storage/documents/pEkYwQEFY4LWICMHcv46uBn9k7zjI4k4FDZh1KPX.png', '2026-05-23 08:33:43', '2026-05-23 08:33:43'),
(37, 10, 'Nouveau document partagé', 'Un nouveau document a été partagé : 3_Ses conseils pour réussir dans l\'entrepreneuriat', 'info', 0, 'http://localhost:8000/storage/documents/pEkYwQEFY4LWICMHcv46uBn9k7zjI4k4FDZh1KPX.png', '2026-05-23 08:33:43', '2026-05-23 08:33:43'),
(38, 11, 'Nouveau document partagé', 'Un nouveau document a été partagé : 3_Ses conseils pour réussir dans l\'entrepreneuriat', 'info', 0, 'http://localhost:8000/storage/documents/pEkYwQEFY4LWICMHcv46uBn9k7zjI4k4FDZh1KPX.png', '2026-05-23 08:33:43', '2026-05-23 08:33:43'),
(39, 12, 'Nouveau document partagé', 'Un nouveau document a été partagé : 3_Ses conseils pour réussir dans l\'entrepreneuriat', 'info', 0, 'http://localhost:8000/storage/documents/pEkYwQEFY4LWICMHcv46uBn9k7zjI4k4FDZh1KPX.png', '2026-05-23 08:33:43', '2026-05-23 08:33:43'),
(40, 13, 'Nouveau document partagé', 'Un nouveau document a été partagé : 3_Ses conseils pour réussir dans l\'entrepreneuriat', 'info', 0, 'http://localhost:8000/storage/documents/pEkYwQEFY4LWICMHcv46uBn9k7zjI4k4FDZh1KPX.png', '2026-05-23 08:33:43', '2026-05-23 08:33:43'),
(41, 15, 'Nouveau document partagé', 'Un nouveau document a été partagé : 3_Ses conseils pour réussir dans l\'entrepreneuriat', 'info', 0, 'http://localhost:8000/storage/documents/pEkYwQEFY4LWICMHcv46uBn9k7zjI4k4FDZh1KPX.png', '2026-05-23 08:33:43', '2026-05-23 08:33:43'),
(42, 2, 'Nouveau document partagé', 'Un nouveau document a été partagé : phptot', 'info', 1, 'http://localhost:8000/storage/documents/VGEL66sm4lo6r3LBQ2XAYhtL67IsRMgbQryqGbSj.png', '2026-05-23 08:36:19', '2026-05-26 13:16:07'),
(43, 3, 'Nouveau document partagé', 'Un nouveau document a été partagé : phptot', 'info', 0, 'http://localhost:8000/storage/documents/VGEL66sm4lo6r3LBQ2XAYhtL67IsRMgbQryqGbSj.png', '2026-05-23 08:36:19', '2026-05-23 08:36:19'),
(44, 14, 'Nouveau document partagé', 'Un nouveau document a été partagé : phptot', 'info', 0, 'http://localhost:8000/storage/documents/VGEL66sm4lo6r3LBQ2XAYhtL67IsRMgbQryqGbSj.png', '2026-05-23 08:36:19', '2026-05-23 08:36:19'),
(45, 2, 'Nouveau document partagé', 'Un nouveau document a été partagé : 1_Saloua Karkri Belkziz, une entrepreneure inspirante', 'info', 1, 'http://localhost:8000/storage/documents/XGqxrFIwz9Tvlt0Ah9IdO0maZzoBPWXVqPvOMWIF.png', '2026-05-23 08:40:35', '2026-05-26 13:16:07'),
(46, 3, 'Nouveau document partagé', 'Un nouveau document a été partagé : 1_Saloua Karkri Belkziz, une entrepreneure inspirante', 'info', 0, 'http://localhost:8000/storage/documents/XGqxrFIwz9Tvlt0Ah9IdO0maZzoBPWXVqPvOMWIF.png', '2026-05-23 08:40:35', '2026-05-23 08:40:35'),
(47, 14, 'Nouveau document partagé', 'Un nouveau document a été partagé : 1_Saloua Karkri Belkziz, une entrepreneure inspirante', 'info', 0, 'http://localhost:8000/storage/documents/XGqxrFIwz9Tvlt0Ah9IdO0maZzoBPWXVqPvOMWIF.png', '2026-05-23 08:40:35', '2026-05-23 08:40:35'),
(48, 2, 'Nouveau document partagé', 'Un nouveau document a été partagé : 1_Saloua Karkri Belkziz, une entrepreneure inspirante', 'info', 1, 'http://localhost:8000/storage/documents/74M0COhrHffxSHh4cBeElvK35yYZgAcd5SWNk29R.png', '2026-05-23 08:49:29', '2026-05-26 13:16:07'),
(49, 3, 'Nouveau document partagé', 'Un nouveau document a été partagé : 1_Saloua Karkri Belkziz, une entrepreneure inspirante', 'info', 0, 'http://localhost:8000/storage/documents/74M0COhrHffxSHh4cBeElvK35yYZgAcd5SWNk29R.png', '2026-05-23 08:49:29', '2026-05-23 08:49:29'),
(50, 14, 'Nouveau document partagé', 'Un nouveau document a été partagé : 1_Saloua Karkri Belkziz, une entrepreneure inspirante', 'info', 0, 'http://localhost:8000/storage/documents/74M0COhrHffxSHh4cBeElvK35yYZgAcd5SWNk29R.png', '2026-05-23 08:49:29', '2026-05-23 08:49:29'),
(51, 4, 'Nouveau document partagé', 'Un nouveau document a été partagé : 1_Saloua Karkri Belkziz, une entrepreneure inspirante', 'info', 0, 'http://localhost:8000/storage/documents/74M0COhrHffxSHh4cBeElvK35yYZgAcd5SWNk29R.png', '2026-05-23 08:49:29', '2026-05-23 08:49:29'),
(52, 5, 'Nouveau document partagé', 'Un nouveau document a été partagé : 1_Saloua Karkri Belkziz, une entrepreneure inspirante', 'info', 0, 'http://localhost:8000/storage/documents/74M0COhrHffxSHh4cBeElvK35yYZgAcd5SWNk29R.png', '2026-05-23 08:49:29', '2026-05-23 08:49:29'),
(53, 6, 'Nouveau document partagé', 'Un nouveau document a été partagé : 1_Saloua Karkri Belkziz, une entrepreneure inspirante', 'info', 0, 'http://localhost:8000/storage/documents/74M0COhrHffxSHh4cBeElvK35yYZgAcd5SWNk29R.png', '2026-05-23 08:49:29', '2026-05-23 08:49:29'),
(54, 7, 'Nouveau document partagé', 'Un nouveau document a été partagé : 1_Saloua Karkri Belkziz, une entrepreneure inspirante', 'info', 0, 'http://localhost:8000/storage/documents/74M0COhrHffxSHh4cBeElvK35yYZgAcd5SWNk29R.png', '2026-05-23 08:49:29', '2026-05-23 08:49:29'),
(55, 8, 'Nouveau document partagé', 'Un nouveau document a été partagé : 1_Saloua Karkri Belkziz, une entrepreneure inspirante', 'info', 0, 'http://localhost:8000/storage/documents/74M0COhrHffxSHh4cBeElvK35yYZgAcd5SWNk29R.png', '2026-05-23 08:49:29', '2026-05-23 08:49:29'),
(56, 9, 'Nouveau document partagé', 'Un nouveau document a été partagé : 1_Saloua Karkri Belkziz, une entrepreneure inspirante', 'info', 0, 'http://localhost:8000/storage/documents/74M0COhrHffxSHh4cBeElvK35yYZgAcd5SWNk29R.png', '2026-05-23 08:49:29', '2026-05-23 08:49:29'),
(57, 10, 'Nouveau document partagé', 'Un nouveau document a été partagé : 1_Saloua Karkri Belkziz, une entrepreneure inspirante', 'info', 0, 'http://localhost:8000/storage/documents/74M0COhrHffxSHh4cBeElvK35yYZgAcd5SWNk29R.png', '2026-05-23 08:49:29', '2026-05-23 08:49:29'),
(58, 11, 'Nouveau document partagé', 'Un nouveau document a été partagé : 1_Saloua Karkri Belkziz, une entrepreneure inspirante', 'info', 0, 'http://localhost:8000/storage/documents/74M0COhrHffxSHh4cBeElvK35yYZgAcd5SWNk29R.png', '2026-05-23 08:49:29', '2026-05-23 08:49:29'),
(59, 12, 'Nouveau document partagé', 'Un nouveau document a été partagé : 1_Saloua Karkri Belkziz, une entrepreneure inspirante', 'info', 0, 'http://localhost:8000/storage/documents/74M0COhrHffxSHh4cBeElvK35yYZgAcd5SWNk29R.png', '2026-05-23 08:49:29', '2026-05-23 08:49:29'),
(60, 13, 'Nouveau document partagé', 'Un nouveau document a été partagé : 1_Saloua Karkri Belkziz, une entrepreneure inspirante', 'info', 0, 'http://localhost:8000/storage/documents/74M0COhrHffxSHh4cBeElvK35yYZgAcd5SWNk29R.png', '2026-05-23 08:49:29', '2026-05-23 08:49:29'),
(61, 15, 'Nouveau document partagé', 'Un nouveau document a été partagé : 1_Saloua Karkri Belkziz, une entrepreneure inspirante', 'info', 0, 'http://localhost:8000/storage/documents/74M0COhrHffxSHh4cBeElvK35yYZgAcd5SWNk29R.png', '2026-05-23 08:49:29', '2026-05-23 08:49:29'),
(62, 4, 'Nouveau document partagé', 'L\'administration a partagé un nouveau document : 1_Saloua Karkri Belkziz, une entrepreneure inspirante', 'info', 0, 'http://localhost:8000/storage/documents/6AGH0LzjIzCRJfBjuh0lVdHnDyjrN6ZHXQAgce5r.png', '2026-05-23 09:05:53', '2026-05-23 09:05:53'),
(63, 5, 'Nouveau document partagé', 'L\'administration a partagé un nouveau document : 1_Saloua Karkri Belkziz, une entrepreneure inspirante', 'info', 0, 'http://localhost:8000/storage/documents/6AGH0LzjIzCRJfBjuh0lVdHnDyjrN6ZHXQAgce5r.png', '2026-05-23 09:05:53', '2026-05-23 09:05:53'),
(64, 6, 'Nouveau document partagé', 'L\'administration a partagé un nouveau document : 1_Saloua Karkri Belkziz, une entrepreneure inspirante', 'info', 0, 'http://localhost:8000/storage/documents/6AGH0LzjIzCRJfBjuh0lVdHnDyjrN6ZHXQAgce5r.png', '2026-05-23 09:05:53', '2026-05-23 09:05:53'),
(65, 7, 'Nouveau document partagé', 'L\'administration a partagé un nouveau document : 1_Saloua Karkri Belkziz, une entrepreneure inspirante', 'info', 0, 'http://localhost:8000/storage/documents/6AGH0LzjIzCRJfBjuh0lVdHnDyjrN6ZHXQAgce5r.png', '2026-05-23 09:05:53', '2026-05-23 09:05:53'),
(66, 8, 'Nouveau document partagé', 'L\'administration a partagé un nouveau document : 1_Saloua Karkri Belkziz, une entrepreneure inspirante', 'info', 0, 'http://localhost:8000/storage/documents/6AGH0LzjIzCRJfBjuh0lVdHnDyjrN6ZHXQAgce5r.png', '2026-05-23 09:05:53', '2026-05-23 09:05:53'),
(67, 9, 'Nouveau document partagé', 'L\'administration a partagé un nouveau document : 1_Saloua Karkri Belkziz, une entrepreneure inspirante', 'info', 0, 'http://localhost:8000/storage/documents/6AGH0LzjIzCRJfBjuh0lVdHnDyjrN6ZHXQAgce5r.png', '2026-05-23 09:05:53', '2026-05-23 09:05:53'),
(68, 10, 'Nouveau document partagé', 'L\'administration a partagé un nouveau document : 1_Saloua Karkri Belkziz, une entrepreneure inspirante', 'info', 0, 'http://localhost:8000/storage/documents/6AGH0LzjIzCRJfBjuh0lVdHnDyjrN6ZHXQAgce5r.png', '2026-05-23 09:05:53', '2026-05-23 09:05:53'),
(69, 11, 'Nouveau document partagé', 'L\'administration a partagé un nouveau document : 1_Saloua Karkri Belkziz, une entrepreneure inspirante', 'info', 0, 'http://localhost:8000/storage/documents/6AGH0LzjIzCRJfBjuh0lVdHnDyjrN6ZHXQAgce5r.png', '2026-05-23 09:05:53', '2026-05-23 09:05:53'),
(70, 12, 'Nouveau document partagé', 'L\'administration a partagé un nouveau document : 1_Saloua Karkri Belkziz, une entrepreneure inspirante', 'info', 0, 'http://localhost:8000/storage/documents/6AGH0LzjIzCRJfBjuh0lVdHnDyjrN6ZHXQAgce5r.png', '2026-05-23 09:05:53', '2026-05-23 09:05:53'),
(71, 13, 'Nouveau document partagé', 'L\'administration a partagé un nouveau document : 1_Saloua Karkri Belkziz, une entrepreneure inspirante', 'info', 0, 'http://localhost:8000/storage/documents/6AGH0LzjIzCRJfBjuh0lVdHnDyjrN6ZHXQAgce5r.png', '2026-05-23 09:05:53', '2026-05-23 09:05:53'),
(72, 15, 'Nouveau document partagé', 'L\'administration a partagé un nouveau document : 1_Saloua Karkri Belkziz, une entrepreneure inspirante', 'info', 0, 'http://localhost:8000/storage/documents/6AGH0LzjIzCRJfBjuh0lVdHnDyjrN6ZHXQAgce5r.png', '2026-05-23 09:05:53', '2026-05-23 09:05:53'),
(73, 18, 'Nouvelle note enregistrée', 'Votre note pour le module Programmation structurée a été publiée.', 'success', 0, '/dashboard', '2026-05-23 09:47:45', '2026-05-23 09:47:45'),
(74, 5, 'Nouvelle note enregistrée', 'Votre note pour le module Programmation structurée a été publiée.', 'success', 0, '/dashboard', '2026-05-23 09:48:18', '2026-05-23 09:48:18'),
(75, 2, 'Mise à jour de vos affectations', 'L\'administrateur a mis à jour vos groupes affectés. Veuillez consulter votre tableau de bord.', 'info', 1, '/dashboard', '2026-05-23 15:00:17', '2026-05-26 13:16:07'),
(76, 2, 'Mise à jour de vos affectations', 'L\'administrateur a mis à jour vos groupes affectés. Veuillez consulter votre tableau de bord.', 'info', 1, '/dashboard', '2026-05-23 15:00:48', '2026-05-26 13:16:07'),
(77, 24, 'Mise à jour de vos affectations', 'L\'administrateur a mis à jour vos groupes affectés. Veuillez consulter votre tableau de bord.', 'info', 0, '/dashboard', '2026-05-23 15:12:53', '2026-05-23 15:12:53'),
(78, 6, 'Nouvelle note enregistrée', 'Votre note pour le module Framework Laravel a été publiée.', 'success', 0, '/dashboard', '2026-06-06 07:05:39', '2026-06-06 07:05:39');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(18, 'App\\Models\\User', 2, 'auth-token', 'bdc4a2272165d12c6c2281c38cb2c7c418c60fa4e80a1973a0810a17f33292e3', '[\"formateur\"]', '2026-05-14 13:37:06', NULL, '2026-05-14 13:15:37', '2026-05-14 13:37:06'),
(23, 'App\\Models\\User', 1, 'auth-token', '2e73c9183be53561047c4366fc720aaa4db3610eab97ca7c04dea42b53110066', '[\"admin\"]', '2026-05-19 12:13:18', NULL, '2026-05-16 08:56:02', '2026-05-19 12:13:18'),
(49, 'App\\Models\\User', 5, 'auth-token', '08d053fe723430f2c10ba86ec2a3530d0b982196bc9f98cf1cc360a6292c9c57', '[\"stagiaire\"]', '2026-05-22 19:30:38', NULL, '2026-05-22 19:28:42', '2026-05-22 19:30:38'),
(54, 'App\\Models\\User', 1, 'auth-token', 'c2e55852eac187df13d0d96f4dd64eec83e0e0e6382453b057faab17fd3fb0c3', '[\"admin\"]', NULL, NULL, '2026-05-23 08:59:15', '2026-05-23 08:59:15'),
(55, 'App\\Models\\User', 1, 'auth-token', '32a30828291a8563fa612b79476cfe4f8adb2127032171463e5848e4eb14993e', '[\"admin\"]', '2026-05-23 08:59:22', NULL, '2026-05-23 08:59:22', '2026-05-23 08:59:22'),
(56, 'App\\Models\\User', 1, 'auth-token', '7395c5bda15d425ba7d730c6235006942d8f2c59cbe741006d00cdfd82c0980a', '[\"admin\"]', '2026-05-23 09:01:54', NULL, '2026-05-23 09:01:53', '2026-05-23 09:01:54'),
(57, 'App\\Models\\User', 1, 'auth-token', '0fdc7534892977ca60b095bf9ec550778c4dc744cf906bbfb2082cc3f0019a1d', '[\"admin\"]', '2026-05-23 09:03:28', NULL, '2026-05-23 09:03:28', '2026-05-23 09:03:28'),
(58, 'App\\Models\\User', 1, 'auth-token', 'd509127222d8462c7307e1eab68842f5d291193cfb47f51dcec55d143aabc66e', '[\"admin\"]', '2026-05-23 09:03:53', NULL, '2026-05-23 09:03:52', '2026-05-23 09:03:53'),
(62, 'App\\Models\\User', 1, 'auth-token', '0286e74dca56a042d5073037c629375cf0e32145214d937885b399bfb9c466f8', '[\"admin\"]', '2026-05-23 12:12:07', NULL, '2026-05-23 09:18:02', '2026-05-23 12:12:07'),
(63, 'App\\Models\\User', 16, 'auth-token', 'd4a245fc64c89319370ce9673d82614927db105bff3a2c1f32bec144ffdcda84', '[\"stagiaire\"]', '2026-05-23 09:24:48', NULL, '2026-05-23 09:24:48', '2026-05-23 09:24:48'),
(64, 'App\\Models\\User', 17, 'auth-token', 'a1aa9a101664e7f06c8e4c97fca909ef87aa2129f5509c5ca779bd8c93751145', '[\"stagiaire\"]', '2026-05-23 09:25:31', NULL, '2026-05-23 09:25:31', '2026-05-23 09:25:31'),
(66, 'App\\Models\\User', 1, 'auth-token', '5e76016630075e54fe7339a039b2184d8443351ae59357b6c573141962b3c4f9', '[\"admin\"]', '2026-05-23 09:45:02', NULL, '2026-05-23 09:45:02', '2026-05-23 09:45:02'),
(67, 'App\\Models\\User', 2, 'auth-token', 'c0bb454c4121dad93db2c39875083de27216064afb84cd5f6a1129724f584cea', '[\"formateur\"]', '2026-05-23 12:12:07', NULL, '2026-05-23 09:47:26', '2026-05-23 12:12:07'),
(75, 'App\\Models\\User', 1, 'auth-token', 'a5fa792338b7daabfed1491cb06c07e5d5445d79faf3b1d58db7c2ecffd681ea', '[\"admin\"]', '2026-05-23 14:18:10', NULL, '2026-05-23 14:17:36', '2026-05-23 14:18:10'),
(76, 'App\\Models\\User', 19, 'auth-token', '32a96456e6e1b6f0c6d371870d3ed4ba80cff9947e2917da38f04ca10e663dad', '[\"stagiaire\"]', '2026-05-23 14:21:26', NULL, '2026-05-23 14:19:49', '2026-05-23 14:21:26'),
(79, 'App\\Models\\User', 21, 'auth-token', 'c3bb3f1c05902fbc6613ef825eac8116c561ef58de529dc500913ed7fded5189', '[\"admin\"]', '2026-05-23 15:08:29', NULL, '2026-05-23 15:00:23', '2026-05-23 15:08:29'),
(82, 'App\\Models\\User', 1, 'auth-token', '07745ce381a9f1e735d25c345293ee96228a3c669c2594c50f039ea2956f81b8', '[\"admin\"]', '2026-05-23 15:05:07', NULL, '2026-05-23 15:04:49', '2026-05-23 15:05:07'),
(83, 'App\\Models\\User', 23, 'auth-token', '69ad27f2055ed3eec82c6e2a1add5c140fd5c209dab7a258dc97f509b734db26', '[\"stagiaire\"]', '2026-05-23 15:25:27', NULL, '2026-05-23 15:06:39', '2026-05-23 15:25:27'),
(86, 'App\\Models\\User', 24, 'auth-token', 'bc686fc0e4ff8b653c62e933ec6a252e4f399cb83e7ddc6f782340e3ee79e8b9', '[\"formateur\"]', '2026-05-23 15:14:30', NULL, '2026-05-23 15:13:11', '2026-05-23 15:14:30'),
(87, 'App\\Models\\User', 1, 'auth-token', '415a2222a27459ab69c9c27a4de95a35ff92ac2965d02ad036e61306ee39949b', '[\"admin\"]', '2026-05-26 12:06:51', NULL, '2026-05-26 11:55:51', '2026-05-26 12:06:51'),
(88, 'App\\Models\\User', 1, 'auth-token', '12c60bcecb5e5da8ce253593aa0646ee04ab123084e88892d68ce8727183008b', '[\"admin\"]', '2026-05-26 12:17:12', NULL, '2026-05-26 12:17:07', '2026-05-26 12:17:12'),
(108, 'App\\Models\\User', 1, 'auth-token', 'f236b4f6f592ec5040e5203cbb44ee37988efd32b8f8714f915a4e1056a11225', '[\"admin\"]', '2026-05-26 13:23:18', NULL, '2026-05-26 13:22:30', '2026-05-26 13:23:18'),
(131, 'App\\Models\\User', 1, 'auth-token', '6f091a59279ab8674e10ccbfbeb9c0f248ebbc6e2dd4cbe54a496e2ff153251a', '[\"admin\"]', '2026-06-06 08:21:31', NULL, '2026-06-06 08:16:55', '2026-06-06 08:21:31');

-- --------------------------------------------------------

--
-- Table structure for table `presences`
--

CREATE TABLE `presences` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `stagiaire_id` bigint(20) UNSIGNED NOT NULL,
  `module_id` bigint(20) UNSIGNED NOT NULL,
  `date_seance` date NOT NULL,
  `heure_debut` time NOT NULL,
  `heure_fin` time NOT NULL,
  `statut` enum('present','absent','retard','justifie') NOT NULL DEFAULT 'present',
  `motif` varchar(255) DEFAULT NULL,
  `justificatif` varchar(255) DEFAULT NULL,
  `formateur_id` bigint(20) UNSIGNED NOT NULL,
  `shared_with_admin` tinyint(1) NOT NULL DEFAULT 0,
  `shared_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `presences`
--

INSERT INTO `presences` (`id`, `stagiaire_id`, `module_id`, `date_seance`, `heure_debut`, `heure_fin`, `statut`, `motif`, `justificatif`, `formateur_id`, `shared_with_admin`, `shared_at`, `created_at`, `updated_at`) VALUES
(2, 2, 1, '2025-03-24', '08:30:00', '12:30:00', 'present', NULL, NULL, 2, 0, NULL, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(3, 3, 1, '2025-03-24', '08:30:00', '12:30:00', 'present', NULL, NULL, 2, 0, NULL, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(5, 5, 1, '2025-03-24', '08:30:00', '12:30:00', 'present', NULL, NULL, 2, 0, NULL, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(7, 2, 1, '2025-03-25', '08:30:00', '12:30:00', 'present', NULL, NULL, 2, 0, NULL, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(8, 3, 1, '2025-03-25', '08:30:00', '12:30:00', 'retard', NULL, NULL, 2, 0, NULL, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(10, 5, 1, '2025-03-25', '08:30:00', '12:30:00', 'present', NULL, NULL, 2, 0, NULL, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(12, 2, 1, '2025-03-26', '08:30:00', '12:30:00', 'present', NULL, NULL, 2, 0, NULL, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(13, 3, 1, '2025-03-26', '08:30:00', '12:30:00', 'retard', NULL, NULL, 2, 0, NULL, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(15, 5, 1, '2025-03-26', '08:30:00', '12:30:00', 'present', NULL, NULL, 2, 0, NULL, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(17, 2, 1, '2025-03-27', '08:30:00', '12:30:00', 'justifie', NULL, NULL, 2, 0, NULL, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(18, 3, 1, '2025-03-27', '08:30:00', '12:30:00', 'present', NULL, NULL, 2, 0, NULL, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(20, 5, 1, '2025-03-27', '08:30:00', '12:30:00', 'present', NULL, NULL, 2, 0, NULL, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(22, 2, 1, '2025-03-28', '08:30:00', '12:30:00', 'justifie', NULL, NULL, 2, 0, NULL, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(23, 3, 1, '2025-03-28', '08:30:00', '12:30:00', 'present', NULL, NULL, 2, 0, NULL, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(25, 5, 1, '2025-03-28', '08:30:00', '12:30:00', 'present', NULL, NULL, 2, 0, NULL, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(26, 5, 1, '2026-05-26', '08:30:00', '11:00:00', 'present', NULL, NULL, 2, 0, NULL, '2026-05-26 12:40:17', '2026-05-26 12:40:17'),
(27, 6, 9, '2026-05-28', '08:30:00', '11:00:00', 'retard', 'retard trop', NULL, 2, 0, NULL, '2026-05-26 12:44:02', '2026-05-26 12:44:02'),
(28, 7, 9, '2026-05-28', '08:30:00', '11:00:00', 'retard', '50', NULL, 2, 0, NULL, '2026-05-26 12:44:02', '2026-05-26 12:44:02'),
(29, 6, 9, '2026-05-26', '08:30:00', '11:00:00', 'present', NULL, NULL, 2, 1, '2026-05-26 13:05:21', '2026-05-26 13:05:13', '2026-05-26 13:05:21'),
(30, 7, 9, '2026-05-26', '08:30:00', '11:00:00', 'present', NULL, NULL, 2, 1, '2026-05-26 13:05:21', '2026-05-26 13:05:13', '2026-05-26 13:05:21'),
(31, 5, 1, '2026-05-29', '08:30:00', '01:30:00', 'absent', 'RETARD TOUJORS', NULL, 2, 1, '2026-05-26 13:10:16', '2026-05-26 13:10:11', '2026-05-26 13:10:16'),
(32, 5, 2, '2026-05-28', '08:30:00', '11:00:00', 'absent', 'Rerad1', NULL, 2, 1, '2026-05-26 13:12:04', '2026-05-26 13:11:59', '2026-05-26 13:12:04'),
(33, 5, 1, '2026-05-29', '09:30:00', '11:00:00', 'absent', 'retard ttoujours', NULL, 2, 1, '2026-05-26 13:16:47', '2026-05-26 13:16:43', '2026-05-26 13:16:47'),
(34, 5, 1, '2026-05-29', '08:30:00', '11:00:00', 'absent', 'RETARD TOUJORS', NULL, 2, 0, NULL, '2026-05-26 13:21:21', '2026-05-26 13:21:21'),
(35, 6, 9, '2026-05-26', '08:30:00', '11:00:00', 'absent', NULL, NULL, 2, 0, NULL, '2026-05-26 13:22:21', '2026-05-26 13:22:21'),
(36, 7, 9, '2026-05-26', '08:30:00', '11:00:00', 'absent', NULL, NULL, 2, 0, NULL, '2026-05-26 13:22:21', '2026-05-26 13:22:21'),
(37, 5, 1, '2026-06-06', '08:30:00', '11:00:00', 'retard', 'retard', NULL, 2, 1, '2026-06-06 06:57:25', '2026-06-06 06:57:19', '2026-06-06 06:57:25'),
(38, 6, 9, '2026-06-06', '08:30:00', '12:30:00', 'absent', NULL, NULL, 2, 1, '2026-06-06 06:59:55', '2026-06-06 06:59:46', '2026-06-06 06:59:55'),
(39, 7, 9, '2026-06-06', '08:30:00', '12:30:00', 'retard', '5minute de retard', NULL, 2, 1, '2026-06-06 06:59:55', '2026-06-06 06:59:46', '2026-06-06 06:59:55');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('G6vdaf2o5hP5KUahi9CgIiWt3XOpGqrN34bYApSv', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJwTWlvNUpZZE05ZXZ0N3VzZXViNEdRZXIxRktvNkFnbVg5bjFmbG1BIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1774957011),
('HtFDaSCAP21QMBPpsv9HBrAiLqQW1FUQi2B1UCw0', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJrQVZUbUxVQmQzQnZGM1FjbmhpYTBIZzBPVXVGc05hZEpHNzZkcXgwIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1774957142),
('mZzHLTO5Sm7OMVsDszrSLD5HBsUFc9lWKgYBLQsQ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:151.0) Gecko/20100101 Firefox/151.0', 'eyJfdG9rZW4iOiJicUN1dW1vdGFOWk1tZVg0U09pelJvQTlnbEJQUnJXaGpxSXdkcGkzIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL3N0cmljdC1jYXJleS1mb3Jlc3RyeS1pZGVudGlmaWVkLnRyeWNsb3VkZmxhcmUuY29tIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1779546479),
('SaL5ENYaz4TssiLUUsWnTLrPrmyxohtWEZz86V48', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJsNHNLODlnbk5sQkpyUVNYVE1tcjRWS2FaNTUxSGMzc2ZvZlpuN2R5IiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1774957170);

-- --------------------------------------------------------

--
-- Table structure for table `stages`
--

CREATE TABLE `stages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `stagiaire_id` bigint(20) UNSIGNED NOT NULL,
  `entreprise_nom` varchar(255) NOT NULL,
  `entreprise_secteur` varchar(255) DEFAULT NULL,
  `entreprise_ville` varchar(255) DEFAULT NULL,
  `responsable_nom` varchar(255) DEFAULT NULL,
  `responsable_telephone` varchar(255) DEFAULT NULL,
  `responsable_email` varchar(255) DEFAULT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `duree_semaines` int(11) DEFAULT NULL,
  `note_entreprise` decimal(4,2) DEFAULT NULL,
  `rapport_soumis` tinyint(1) NOT NULL DEFAULT 0,
  `rapport_path` varchar(255) DEFAULT NULL,
  `statut` enum('en_attente','en_cours','termine','valide') NOT NULL DEFAULT 'en_attente',
  `observations` text DEFAULT NULL,
  `papiers_administratifs_ok` tinyint(1) NOT NULL DEFAULT 0,
  `soumis_par_stagiaire` tinyint(1) NOT NULL DEFAULT 0,
  `date_soumission` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stages`
--

INSERT INTO `stages` (`id`, `stagiaire_id`, `entreprise_nom`, `entreprise_secteur`, `entreprise_ville`, `responsable_nom`, `responsable_telephone`, `responsable_email`, `date_debut`, `date_fin`, `duree_semaines`, `note_entreprise`, `rapport_soumis`, `rapport_path`, `statut`, `observations`, `papiers_administratifs_ok`, `soumis_par_stagiaire`, `date_soumission`, `created_at`, `updated_at`) VALUES
(2, 2, 'Digital Wave', 'Marketing digital', 'Rabat', 'Leila Fassi', '0537112233', 'l.fassi@digitalwave.ma', '2025-03-15', '2025-05-15', 8, NULL, 0, NULL, 'en_cours', NULL, 0, 0, NULL, '2026-03-31 09:35:16', '2026-03-31 09:35:16');

-- --------------------------------------------------------

--
-- Table structure for table `stagiaires`
--

CREATE TABLE `stagiaires` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `code_massar` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `date_naissance` date DEFAULT NULL,
  `genre` enum('M','F') DEFAULT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `ville` varchar(255) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `filiere_id` bigint(20) UNSIGNED DEFAULT NULL,
  `groupe` varchar(255) DEFAULT NULL,
  `annee_formation` int(11) NOT NULL DEFAULT 1,
  `statut` enum('actif','suspendu','diplome','abandon') NOT NULL DEFAULT 'actif',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stagiaires`
--

INSERT INTO `stagiaires` (`id`, `user_id`, `code_massar`, `nom`, `prenom`, `date_naissance`, `genre`, `telephone`, `email`, `adresse`, `ville`, `photo`, `filiere_id`, `groupe`, `annee_formation`, `statut`, `deleted_at`, `created_at`, `updated_at`) VALUES
(2, 4, 'D123457', 'El Amrani', 'Youssef', '2002-08-20', 'M', '0654321098', 'youssef.amrani@gmail.com', 'Adresse test', 'Rabat', NULL, 1, 'DEV201', 2, 'actif', NULL, '2026-03-31 09:35:16', '2026-05-14 12:48:46'),
(3, 5, 'D123458', 'Bennani', 'Sara', '2003-01-10', 'F', '0698765432', 'sara.bennani@gmail.com', 'Adresse test', 'Fès', NULL, 1, 'DEV202', 2, 'actif', '2026-05-10 09:37:24', '2026-03-31 09:35:16', '2026-05-14 12:48:46'),
(5, 6, 'D123460', 'Ouazzani', 'Amal', '2003-11-02', 'F', '0622334455', 'amal.ouazzani@gmail.com', 'Adresse test', 'Tanger', NULL, 1, 'DEV101', 1, 'actif', NULL, '2026-03-31 09:35:16', '2026-05-14 12:48:46'),
(6, 7, 'T123461', 'Chakir', 'Omar', '2002-07-18', 'M', '0633445566', 'omar.chaki@gmail.com', 'Adresse test', 'Oujda', NULL, 2, 'TRI101', 1, 'actif', NULL, '2026-03-31 09:35:16', '2026-05-14 12:48:46'),
(7, 8, 'T123462', 'Lahlou', 'Imane', '2003-09-30', 'F', '0644556677', 'imane.lahlou@gmail.com', 'Adresse test', 'Meknès', NULL, 2, 'TRI101', 1, 'actif', NULL, '2026-03-31 09:35:16', '2026-05-14 12:48:47'),
(8, 9, 'G123463', 'Rachidi', 'Hamza', '2004-02-14', 'M', '0655667788', 'hamza.rachidi@gmail.com', 'Adresse test', 'Agadir', NULL, 3, 'GE101', 1, 'actif', NULL, '2026-03-31 09:35:16', '2026-05-14 12:48:47'),
(9, 10, 'G123464', 'Moussaoui', 'Nadia', '2003-06-22', 'F', '0666778899', 'nadia.moussaoui@gmail.com', 'Adresse test', 'Tétouan', NULL, 3, 'GE101', 1, 'actif', NULL, '2026-03-31 09:35:16', '2026-05-14 12:48:47'),
(10, 11, 'D123465', 'Idrissi', 'Amine', '2002-12-05', 'M', '0677889900', 'amine.idrissi@gmail.com', 'Adresse test', 'Kenitra', NULL, 1, 'DEV201', 2, 'suspendu', '2026-05-10 09:53:24', '2026-03-31 09:35:16', '2026-05-14 12:48:47'),
(13, 12, 'D123456', 'Saide', 'Mohammed', '2003-05-15', 'M', '0612345678', 'mohammed.saide@gmail.com', 'Adresse test', 'Casablanca', NULL, 1, 'DEV201', 2, 'actif', NULL, '2026-05-14 12:55:33', '2026-05-14 12:55:33'),
(14, 13, 'r142347', 'louis', 'bararota', '2026-04-30', 'M', '0633445566', 'doctor@dental.ma', NULL, NULL, NULL, 1, 'dev102', 2, 'actif', NULL, '2026-05-14 12:58:48', '2026-05-14 12:58:48'),
(17, 18, 'USR000018', 'barbara', 'Louis', NULL, NULL, NULL, 'barbara@ofppt.ma', NULL, NULL, NULL, 1, 'DEV202', 1, 'actif', NULL, '2026-05-23 09:28:08', '2026-05-23 09:28:50'),
(19, 19, 'USR000019', 'loce saaide so muuch ❤️', 'I', NULL, NULL, NULL, 'idk@idc.com', NULL, NULL, NULL, NULL, NULL, 1, 'actif', NULL, '2026-05-23 14:19:49', '2026-05-23 14:19:49'),
(20, 23, 'USR000023', 'mdp ghan3awd', 'Nsit', NULL, NULL, NULL, 'nsit@nsit.com', NULL, NULL, NULL, 1, 'DEV204', 2, 'actif', NULL, '2026-05-23 15:06:39', '2026-05-23 15:07:08');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','formateur','stagiaire') NOT NULL DEFAULT 'stagiaire',
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin OFPPT', 'admin@ofppt.ma', NULL, '$2y$12$YXX.sJb7dhrAir.I8.JMgODv25xI/wXjlZ2ACXWgRt36L62JwgsuG', 'admin', NULL, '2026-03-31 09:35:15', '2026-05-10 09:10:00'),
(2, 'Ahmed Benali', 'ahmed.benali@ofppt.ma', NULL, '$2y$12$R6dxsJg22GUo8baSas9uie2T4tcf7DUXKZ7bq7NNxaYijnI89f.Yy', 'formateur', NULL, '2026-03-31 09:35:15', '2026-03-31 09:35:15'),
(3, 'Fatima Zahra', 'fatima.zahra@ofppt.ma', NULL, '$2y$12$N8KXXZUy0pz8JWGO4Mebz.Wjur8J4wxKHt/NfmC/EyJlOzrj8kNPK', 'formateur', NULL, '2026-03-31 09:35:16', '2026-03-31 09:35:16'),
(4, 'Youssef El Amrani', 'youssef.amrani@gmail.com', NULL, '$2y$12$d.rWuOXzq0lL82BMu8uBw.SLjXFfT/5PHBFM4Tz/eKYUqGqfABDDO', 'stagiaire', NULL, '2026-05-14 12:48:46', '2026-05-14 12:48:46'),
(5, 'Sara Bennani', 'sara.bennani@gmail.com', NULL, '$2y$12$NsxrTFy3c0c/MsNlydYyx.2Bf6QfNQrX9TynsdeT2BdiFga9PKg66', 'stagiaire', NULL, '2026-05-14 12:48:46', '2026-05-14 12:48:46'),
(6, 'Amal Ouazzani', 'amal.ouazzani@gmail.com', NULL, '$2y$12$amsDbHezNeNPRs1LhdGiA.pTUNX2qO6GK0moVYIuEPZCwhtm9mFNy', 'stagiaire', NULL, '2026-05-14 12:48:46', '2026-05-14 12:48:46'),
(7, 'Omar Chakir', 'omar.chaki@gmail.com', NULL, '$2y$12$TqG1xQ45c1Z9LYCat/1UHuM2s1jc6377e5G6OKUAEDST5/wTpWDyO', 'stagiaire', NULL, '2026-05-14 12:48:46', '2026-05-14 12:48:46'),
(8, 'Imane Lahlou', 'imane.lahlou@gmail.com', NULL, '$2y$12$83PSQlNV3mSjJ2O84/Njg.16YpTPlAUtHCAtdYlkTrHFgXFA1eUJO', 'stagiaire', NULL, '2026-05-14 12:48:47', '2026-05-14 12:48:47'),
(9, 'Hamza Rachidi', 'hamza.rachidi@gmail.com', NULL, '$2y$12$sKA3frbCfIDWNCq0aKKzueOWJnB7UKt6/z4H5kfoI.LJMBxImmMty', 'stagiaire', NULL, '2026-05-14 12:48:47', '2026-05-14 12:48:47'),
(10, 'Nadia Moussaoui', 'nadia.moussaoui@gmail.com', NULL, '$2y$12$PcdEroSjPyOq8P0VV3WGTOCjqkzmTT9Pc.OHb/bWlIGafWGP8eze.', 'stagiaire', NULL, '2026-05-14 12:48:47', '2026-05-14 12:48:47'),
(11, 'Amine Idrissi', 'amine.idrissi@gmail.com', NULL, '$2y$12$CdOrSqNjo8.mIFLhxglDVev2dbG2kk5gA4fW/sXtz1RjZx.Ki7XY2', 'stagiaire', NULL, '2026-05-14 12:48:47', '2026-05-14 12:48:47'),
(12, 'Mohammed Saide', 'mohammed.saide@gmail.com', NULL, '$2y$12$NL0u2FhKoSjH1EGynG8rHuUEXer4WU3D/hYquswALy/I1G5JUe6bW', 'stagiaire', NULL, '2026-05-14 12:55:33', '2026-05-14 12:55:33'),
(13, 'bararota louis', 'doctor@dental.ma', NULL, '$2y$12$pZCArolahAle2MduHhoQB.H0.xOvea7S/AvQb1SsYYvvRjYCDEvmW', 'stagiaire', NULL, '2026-05-14 12:58:48', '2026-05-14 12:58:48'),
(14, 'Moha Saide', 'Moha@ofppt.com', NULL, '$2y$12$1AWyWkh4iSH3F93tJibimuJ2wMCqBOMrlLgqBGhYtNHVM84DcSGbG', 'formateur', NULL, '2026-05-22 17:50:33', '2026-05-22 17:50:33'),
(15, 'Omar Saide', 'Omar@offpt-edu.ma', NULL, '$2y$12$9CTC28x.wx7y1SQAuGDcZ.kIKgXWMck2U7vXbWqxsf3mkSakOGAbW', 'stagiaire', NULL, '2026-05-23 08:26:31', '2026-05-23 08:26:31'),
(18, 'Louis barbara', 'barbara@ofppt.ma', NULL, '$2y$12$XYITxN3cNKqPykc1z1w8aO1aFm5Tw4YSHNRZWMQe6aneTUH4yxswG', 'stagiaire', NULL, '2026-05-23 09:28:08', '2026-05-23 09:28:08'),
(19, 'I loce saaide so muuch ❤️', 'idk@idc.com', NULL, '$2y$12$2EMrtiugQhWedcKar0i.B.iDqpoqwJz8OBs11l9n.Ej0zf5xEwoh.', 'stagiaire', NULL, '2026-05-23 14:19:49', '2026-05-23 14:19:49'),
(20, 'I hate saaide 💔', 'jdjwjdjdo@bdkdbd.com', NULL, '$2y$12$yEoDaEHJtRrXJLJjD6ku7eERFN3JcnEUhNSXDtoisUS3BNzaQCG2i', 'admin', NULL, '2026-05-23 14:59:19', '2026-05-23 14:59:19'),
(21, 'nabou', 'amine@gmail.com', NULL, '$2y$12$03iYcpmBMrZu1VqUVjRNk.eKceVhzAL0riUZIrwOgPQ9v0VQBzsD.', 'admin', NULL, '2026-05-23 15:00:23', '2026-05-23 15:00:23'),
(22, 'Faaaaaaaaah', 'faaaaaah@faaaaah.com', NULL, '$2y$12$3JFyb7mu03lLMwAlGeHBlemNX5kYRXZn7tp7OnEDOSJGO7w1TBMD.', 'formateur', NULL, '2026-05-23 15:03:10', '2026-05-23 15:03:10'),
(23, 'Nsit mdp ghan3awd', 'nsit@nsit.com', NULL, '$2y$12$MP0q8cEi15jqoA9Gufe2zOoUPRYXpd.7fazKMTTWOpGgnLGsYVeAm', 'stagiaire', NULL, '2026-05-23 15:06:39', '2026-05-23 15:06:39'),
(24, 'Louis paras', 'louis@ofppt.ma', NULL, '$2y$12$yMEhxXraWAPMIWnzhSsweOOKGg6/CAYkmScgI9KjrZfT3QD0SKn5q', 'formateur', NULL, '2026-05-23 15:11:48', '2026-05-23 15:11:48'),
(25, 'Asmae Youala', 'Asmae@ofppt-edu.ma', NULL, '$2y$12$Xkw/ks1VGfahoEpaYEtMWuTph0h6jhGj/hOsUZ6aUx0etgC8uH4f6', 'formateur', NULL, '2026-06-06 06:47:00', '2026-06-06 06:47:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `affectations`
--
ALTER TABLE `affectations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `affectations_user_id_foreign` (`user_id`),
  ADD KEY `affectations_filiere_id_foreign` (`filiere_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `documents_filiere_id_foreign` (`filiere_id`),
  ADD KEY `documents_user_id_foreign` (`user_id`),
  ADD KEY `documents_module_id_foreign` (`module_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `filieres`
--
ALTER TABLE `filieres`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `filieres_code_unique` (`code`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `modules`
--
ALTER TABLE `modules`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `modules_code_unique` (`code`),
  ADD KEY `modules_filiere_id_foreign` (`filiere_id`);

--
-- Indexes for table `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `notes_stagiaire_id_module_id_annee_scolaire_semestre_unique` (`stagiaire_id`,`module_id`,`annee_scolaire`,`semestre`),
  ADD KEY `notes_module_id_foreign` (`module_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_user_id_foreign` (`user_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `presences`
--
ALTER TABLE `presences`
  ADD PRIMARY KEY (`id`),
  ADD KEY `presences_stagiaire_id_foreign` (`stagiaire_id`),
  ADD KEY `presences_module_id_foreign` (`module_id`),
  ADD KEY `presences_formateur_id_foreign` (`formateur_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `stages`
--
ALTER TABLE `stages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stages_stagiaire_id_foreign` (`stagiaire_id`);

--
-- Indexes for table `stagiaires`
--
ALTER TABLE `stagiaires`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `stagiaires_code_massar_unique` (`code_massar`),
  ADD KEY `stagiaires_user_id_foreign` (`user_id`),
  ADD KEY `stagiaires_filiere_id_foreign` (`filiere_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `affectations`
--
ALTER TABLE `affectations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `documents`
--
ALTER TABLE `documents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `filieres`
--
ALTER TABLE `filieres`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `modules`
--
ALTER TABLE `modules`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `notes`
--
ALTER TABLE `notes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=133;

--
-- AUTO_INCREMENT for table `presences`
--
ALTER TABLE `presences`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `stages`
--
ALTER TABLE `stages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `stagiaires`
--
ALTER TABLE `stagiaires`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `affectations`
--
ALTER TABLE `affectations`
  ADD CONSTRAINT `affectations_filiere_id_foreign` FOREIGN KEY (`filiere_id`) REFERENCES `filieres` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `affectations_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `documents_filiere_id_foreign` FOREIGN KEY (`filiere_id`) REFERENCES `filieres` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `documents_module_id_foreign` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `documents_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `modules`
--
ALTER TABLE `modules`
  ADD CONSTRAINT `modules_filiere_id_foreign` FOREIGN KEY (`filiere_id`) REFERENCES `filieres` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notes`
--
ALTER TABLE `notes`
  ADD CONSTRAINT `notes_module_id_foreign` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notes_stagiaire_id_foreign` FOREIGN KEY (`stagiaire_id`) REFERENCES `stagiaires` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `presences`
--
ALTER TABLE `presences`
  ADD CONSTRAINT `presences_formateur_id_foreign` FOREIGN KEY (`formateur_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `presences_module_id_foreign` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `presences_stagiaire_id_foreign` FOREIGN KEY (`stagiaire_id`) REFERENCES `stagiaires` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stages`
--
ALTER TABLE `stages`
  ADD CONSTRAINT `stages_stagiaire_id_foreign` FOREIGN KEY (`stagiaire_id`) REFERENCES `stagiaires` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stagiaires`
--
ALTER TABLE `stagiaires`
  ADD CONSTRAINT `stagiaires_filiere_id_foreign` FOREIGN KEY (`filiere_id`) REFERENCES `filieres` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `stagiaires_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
