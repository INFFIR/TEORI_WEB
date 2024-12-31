-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 31, 2024 at 07:16 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `web_laundry`
--

-- --------------------------------------------------------

--
-- Table structure for table `about`
--

CREATE TABLE `about` (
  `about_id` int NOT NULL,
  `about_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description_about` text COLLATE utf8mb4_unicode_ci,
  `image_url_about` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `about`
--

INSERT INTO `about` (`about_id`, `about_title`, `description_about`, `image_url_about`) VALUES
(1, 'bye bye', 'We provide top-notch washing services using eco-friendly detergents.', ''),
(3, NULL, 'Professional ironing to give your clothes a crisp and neat appearance.', ''),
(4, NULL, 'Convenient pickup and delivery to save your time and effort.', ''),
(10, 'halooo', 'We provide top-notch washing services using eco-friendly detergents.', NULL),
(16, 'aaaaa', 'assa', 'http://localhost/TEORI_WEB/PHP/uploads/about_67737f7ae738d6.59652217.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `comments_id` int NOT NULL,
  `user_id` int NOT NULL,
  `offered_id` int NOT NULL,
  `stars` int DEFAULT NULL,
  `user_comment` text COLLATE utf8mb4_unicode_ci
) ;

-- --------------------------------------------------------

--
-- Table structure for table `contact`
--

CREATE TABLE `contact` (
  `contact_id` int NOT NULL,
  `image_url_contact` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title_contact` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contact`
--

INSERT INTO `contact` (`contact_id`, `image_url_contact`, `title_contact`) VALUES
(1, 'http://localhost/TEORI_WEB/PHP/uploads/contact_images/contact_677384810bf743.62320063.jpg', 'Email Usss');

-- --------------------------------------------------------

--
-- Table structure for table `contact_send`
--

CREATE TABLE `contact_send` (
  `send_id` int NOT NULL,
  `contact_id` int DEFAULT NULL,
  `contact_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_message` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contact_send`
--

INSERT INTO `contact_send` (`send_id`, `contact_id`, `contact_name`, `contact_email`, `contact_message`) VALUES
(1, 1, 'John Doe', 'john@example.com', 'I have a question about your washing services.'),
(2, NULL, 'Jane Smith', 'jane@example.com', 'Can I change my pickup address?'),
(3, NULL, 'Alice Wonder', 'alice@example.com', 'Where are you located exactly?'),
(4, NULL, 'Bob Builder', 'bob@example.com', 'I need help with my recent order.'),
(5, NULL, 'John Doe', 'john@example.com', 'How can I track my delivery?');

-- --------------------------------------------------------

--
-- Table structure for table `home`
--

CREATE TABLE `home` (
  `home_id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `key_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `key_value` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE `login` (
  `user_id` int NOT NULL,
  `username_user` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_image_profile` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password_user` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_role` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `login`
--

INSERT INTO `login` (`user_id`, `username_user`, `user_image_profile`, `password_user`, `user_role`) VALUES
(1, 'john_doe', 'images/profiles/john.jpg', 'password123', 'customer'),
(2, 'jane_smith', 'images/profiles/jane.jpg', 'securepass', 'customer'),
(3, 'admin_user', 'images/profiles/admin.jpg', 'adminpass', 'admin'),
(4, 'alice_wonder', 'images/profiles/alice.jpg', 'alicepwd', 'customer'),
(5, 'bob_builder', 'images/profiles/bob.jpg', 'bobsecure', 'customer'),
(6, 'Admin1', 'https://www.mewarnai.net/wp-content/uploads/2023/10/gambar-estetik-mewarnai.jpg', '$2y$10$2RaRRbEqbpsX1kFAciCoAOq5isDO5EjbV4EVgfdG.PNpIkba0OSG6', 'user'),
(7, 'Admin2', 'https://www.mewarnai.net/wp-content/uploads/2023/10/gambar-estetik-mewarnai.jpg', '$2y$10$oHOcfns9mI0/UCdP7rIpUuttcVG5.BB3JVayPbU0QkuGmgQjaZl8O', 'user'),
(8, 'Admin4', 'https://www.mewarnai.net/wp-content/uploads/2023/10/gambar-estetik-mewarnai.jpg', '$2y$10$X3ZcbHVeZCb32TczyjU6LOSeJX4ICzrRpKcXPtQgsPsjMQ/c6MZoK', 'user');

-- --------------------------------------------------------

--
-- Table structure for table `service_category`
--

CREATE TABLE `service_category` (
  `category_id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category_icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category_description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `service_category`
--

INSERT INTO `service_category` (`category_id`, `title`, `category_image`, `category_icon`, `category_description`) VALUES
(9, 'washing', 'TEORI_WEB/PHP/uploads/uploads/category_images/service_6773824c5a1c32.62344398.jpg', 'TEORI_WEB/PHP/uploads/uploads/category_icons/service_677381f5ea2e56.16985382.jpg', 'test');

-- --------------------------------------------------------

--
-- Table structure for table `service_offered`
--

CREATE TABLE `service_offered` (
  `offered_id` int NOT NULL,
  `category_id` int NOT NULL,
  `offered_image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `offered_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `offered_price` int NOT NULL,
  `offered_description` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `service_offered`
--

INSERT INTO `service_offered` (`offered_id`, `category_id`, `offered_image_url`, `offered_name`, `offered_price`, `offered_description`) VALUES
(10, 9, 'http://localhost/TEORI_WEB/PHP/uploads/service_offered/service_6773841f3c48e9.86186030.jpg', 'baru', 22, 'ss');

-- --------------------------------------------------------

--
-- Table structure for table `step_order`
--

CREATE TABLE `step_order` (
  `step_id` int NOT NULL,
  `step_icon` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `step_number` int NOT NULL,
  `step_title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `step_description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `step_order`
--

INSERT INTO `step_order` (`step_id`, `step_icon`, `step_number`, `step_title`, `step_description`) VALUES
(32, 'http://localhost/TEORI_WEB/PHP/uploads/step_icons/step_677384686576e1.21348382.jpg', 1, 'Ironing', 'ssss');

-- --------------------------------------------------------

--
-- Table structure for table `transaction`
--

CREATE TABLE `transaction` (
  `transaction_id` int NOT NULL,
  `user_id` int NOT NULL,
  `laundry_location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `transaction`
--

INSERT INTO `transaction` (`transaction_id`, `user_id`, `laundry_location`) VALUES
(1, 1, '123 Laundry Street, Clean City'),
(2, 2, '456 Fresh Avenue, Clean City'),
(3, 4, '789 Sparkle Road, Clean City'),
(4, 5, '321 Bright Blvd, Clean City'),
(5, 1, '123 Laundry Street, Clean City'),
(6, 1, 'aa'),
(7, 6, 'aa'),
(8, 6, 'aa'),
(9, 6, 'aa'),
(10, 8, 'baru'),
(11, 8, 'baru'),
(12, 6, 'aaaa'),
(13, 6, 'sss');

-- --------------------------------------------------------

--
-- Table structure for table `transaction_detail`
--

CREATE TABLE `transaction_detail` (
  `detail_id` int NOT NULL,
  `transaction_id` int NOT NULL,
  `offered_id` int NOT NULL,
  `value_count` int DEFAULT '1',
  `sum_offered_price` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `transaction_detail`
--

INSERT INTO `transaction_detail` (`detail_id`, `transaction_id`, `offered_id`, `value_count`, `sum_offered_price`) VALUES
(11, 7, 10, 1, 22),
(12, 8, 10, 1, 22),
(13, 9, 10, 1, 22),
(14, 10, 10, 1, 22),
(15, 11, 10, 1, 22),
(16, 12, 10, 1, 22),
(17, 13, 10, 1, 22);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `about`
--
ALTER TABLE `about`
  ADD PRIMARY KEY (`about_id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`comments_id`),
  ADD KEY `idx_comments_user` (`user_id`),
  ADD KEY `idx_comments_offered` (`offered_id`);

--
-- Indexes for table `contact`
--
ALTER TABLE `contact`
  ADD PRIMARY KEY (`contact_id`);

--
-- Indexes for table `contact_send`
--
ALTER TABLE `contact_send`
  ADD PRIMARY KEY (`send_id`),
  ADD KEY `idx_contact_send_contact` (`contact_id`);

--
-- Indexes for table `home`
--
ALTER TABLE `home`
  ADD PRIMARY KEY (`home_id`),
  ADD KEY `idx_home_key` (`key_name`),
  ADD KEY `idx_home_title` (`title`);

--
-- Indexes for table `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `idx_user_role` (`user_role`);

--
-- Indexes for table `service_category`
--
ALTER TABLE `service_category`
  ADD PRIMARY KEY (`category_id`),
  ADD KEY `idx_service_category_title` (`title`);

--
-- Indexes for table `service_offered`
--
ALTER TABLE `service_offered`
  ADD PRIMARY KEY (`offered_id`),
  ADD KEY `idx_service_offered_category` (`category_id`);

--
-- Indexes for table `step_order`
--
ALTER TABLE `step_order`
  ADD PRIMARY KEY (`step_id`),
  ADD UNIQUE KEY `step_number` (`step_number`);

--
-- Indexes for table `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `idx_transaction_user` (`user_id`);

--
-- Indexes for table `transaction_detail`
--
ALTER TABLE `transaction_detail`
  ADD PRIMARY KEY (`detail_id`),
  ADD KEY `idx_transaction_detail_transaction` (`transaction_id`),
  ADD KEY `idx_transaction_detail_offered` (`offered_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `about`
--
ALTER TABLE `about`
  MODIFY `about_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `comments_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact`
--
ALTER TABLE `contact`
  MODIFY `contact_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `contact_send`
--
ALTER TABLE `contact_send`
  MODIFY `send_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `home`
--
ALTER TABLE `home`
  MODIFY `home_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `login`
--
ALTER TABLE `login`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `service_category`
--
ALTER TABLE `service_category`
  MODIFY `category_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `service_offered`
--
ALTER TABLE `service_offered`
  MODIFY `offered_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `step_order`
--
ALTER TABLE `step_order`
  MODIFY `step_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `transaction_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `transaction_detail`
--
ALTER TABLE `transaction_detail`
  MODIFY `detail_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `login` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`offered_id`) REFERENCES `service_offered` (`offered_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `contact_send`
--
ALTER TABLE `contact_send`
  ADD CONSTRAINT `contact_send_ibfk_1` FOREIGN KEY (`contact_id`) REFERENCES `contact` (`contact_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `service_offered`
--
ALTER TABLE `service_offered`
  ADD CONSTRAINT `service_offered_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `service_category` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `transaction`
--
ALTER TABLE `transaction`
  ADD CONSTRAINT `transaction_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `login` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `transaction_detail`
--
ALTER TABLE `transaction_detail`
  ADD CONSTRAINT `transaction_detail_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `transaction` (`transaction_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `transaction_detail_ibfk_2` FOREIGN KEY (`offered_id`) REFERENCES `service_offered` (`offered_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
