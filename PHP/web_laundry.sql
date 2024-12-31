-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 31, 2024 at 03:43 AM
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
(1, 'bye bye', 'We provide top-notch washing services using eco-friendly detergents.', 'images/about/dry_cleaning.jpg'),
(2, '', 'Our dry cleaning service ensures your delicate fabrics are handled with care.', 'http://localhost:8000/uploads/about_675020dfbb1019.62066586.jpg'),
(3, NULL, 'Professional ironing to give your clothes a crisp and neat appearance.', 'images/about/ironing.jpg'),
(4, NULL, 'Convenient pickup and delivery to save your time and effort.', 'images/about/pickup_delivery.jpg'),
(6, NULL, 'aassssss', 'http://localhost:8000/uploads/about_674fdcaf056f37.22286471.jpg'),
(7, '', 'aaaaa', NULL),
(9, '', 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of \"de Finibus Bonorum et Malorum\" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32.\r\n\r\nThe standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from \"de Finibus Bonorum et Malorum\" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.', NULL),
(10, 'halooo', 'We provide top-notch washing services using eco-friendly detergents.', NULL),
(11, 'iyakah', 'We provide top-notch washing services using eco-friendly detergents.', NULL),
(12, 'iyakah', 'We provide top-notch washing services using eco-friendly detergents.', 'http://localhost:8000/uploads/about_67501f6b5d7547.64344398.jpg'),
(13, '', 'We provide top-notch washing services using eco-friendly detergents.', 'http://localhost:8000/uploads/about_67501fef24f449.41021308.jpg'),
(14, 'iyakah', 'sss', NULL);

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

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`comments_id`, `user_id`, `offered_id`, `stars`, `user_comment`) VALUES
(1, 1, 1, 5, 'Excellent washing service! My clothes are spotless.'),
(2, 2, 3, 4, 'Dry cleaning was good, but took a bit longer than expected.'),
(3, 4, 2, 5, 'Deluxe washing exceeded my expectations. Highly recommend!'),
(4, 5, 5, 3, 'Stain removal worked for most stains, but a few remained.'),
(5, 1, 4, 5, 'Premium ironing left my shirts perfectly pressed.');

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
(1, 'http://localhost:8000/uploads/contact_images/contact_67563e06147732.36413564.jpg', 'Email Usss');

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
(7, 'Admin2', 'https://www.mewarnai.net/wp-content/uploads/2023/10/gambar-estetik-mewarnai.jpg', '$2y$10$oHOcfns9mI0/UCdP7rIpUuttcVG5.BB3JVayPbU0QkuGmgQjaZl8O', 'user');

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
(1, 'Washing', NULL, 'icons/washing.png', 'Comprehensive washing services for all types of fabrics.'),
(2, 'Dry Cleaning', NULL, 'icons/dry_cleaning.png', 'Professional dry cleaning for delicate garments.'),
(3, 'Ironing', NULL, 'icons/ironing.png', 'Expert ironing services to keep your clothes wrinkle-free.'),
(4, 'Pickup & Delivery', NULL, 'icons/pickup_delivery.png', 'Convenient pickup and delivery services at your doorstep.'),
(5, 'Stain Removal', NULL, 'icons/stain_removal.png', 'Effective stain removal for stubborn spots.'),
(7, 'aaa', 'uploads/category_images/service_67561a631a9f66.68530654.jpeg', 'uploads/category_icons/service_67561a631a8f78.11111699.jpeg', 'aaa');

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
(1, 1, 'images/services/washing_standard.jpg', 'Standard Washing', 50000, 'Basic washing service for everyday clothes.'),
(2, 1, 'http://localhost:8000/uploads/service_offered/service_67561f371400a3.34137120.jpg', 'Deluxe Washing', 80000, 'Enhanced washing with premium detergents.'),
(3, 2, 'images/services/dry_cleaning_silk.jpg', 'Silk Dry Cleaning', 150000, 'Specialized dry cleaning for silk garments.'),
(4, 3, 'images/services/ironing_premium.jpg', 'Premium Ironing', 30000, 'Top-notch ironing service with attention to detail.'),
(5, 4, 'images/services/pickup_basic.jpg', 'Basic Pickup & Delivery', 20000, 'Standard pickup and delivery within the city.'),
(6, 5, 'images/services/stain_removal.jpg', 'Stain Removal Treatment', 40000, 'Effective treatment to remove tough stains.'),
(7, 7, 'uploads/service_offered/service_67561e6b8874b2.36305639.jpg', 'baru', 10000, 'kerenn'),
(8, 2, 'http://localhost:8000/uploads/service_offered/service_6756200d961911.99060433.jpeg', 's', 100000, 's'),
(9, 1, NULL, 'ss', 100, 'wew');

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
(1, 'icons/order_received.png', 1, 'Order Received', 'We have received your laundry order.'),
(2, 'icons/washing.png', 2, 'Washing', 'Your clothes are being washed.'),
(3, 'icons/drying.png', 3, 'Drying', 'Drying the clothes to perfection.'),
(4, 'icons/ironing.png', 6, 'Ironing', 'Ironing your clothes for a crisp look.'),
(5, 'icons/delivery.png', 5, 'Delivered', 'Your clothes have been delivered.'),
(26, 'http://localhost:8000/uploads/step_icons/step_675624bc66d045.59506871.jpg', 4, 'w', 'w'),
(28, NULL, 7, 'incoming', 'sssss'),
(30, NULL, 8, 'incominggg', 'sssss'),
(31, NULL, 9, 'Ironingss', 'dddddd');

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
(6, 1, 'aa');

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
(1, 1, 1, 2, 100000),
(2, 1, 3, 1, 150000),
(3, 1, 4, 3, 90000),
(4, 2, 2, 1, 80000),
(5, 2, 5, 2, 80000),
(6, 3, 1, 5, 250000),
(7, 3, 4, 2, 60000),
(8, 4, 3, 2, 300000),
(9, 4, 5, 1, 40000),
(10, 5, 2, 3, 240000);

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
  MODIFY `about_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

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
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `service_category`
--
ALTER TABLE `service_category`
  MODIFY `category_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `service_offered`
--
ALTER TABLE `service_offered`
  MODIFY `offered_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `step_order`
--
ALTER TABLE `step_order`
  MODIFY `step_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `transaction_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `transaction_detail`
--
ALTER TABLE `transaction_detail`
  MODIFY `detail_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

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
