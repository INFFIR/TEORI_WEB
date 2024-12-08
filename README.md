# PHP SERVER

php -S localhost:8000

-- 1. Create the Database
CREATE DATABASE IF NOT EXISTS web_laundry CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE web_laundry;

-- 2. Create the 'login' Table
CREATE TABLE IF NOT EXISTS login (
    user_id INT NOT NULL AUTO_INCREMENT,
    username_user VARCHAR(255) NOT NULL,
    user_image_profile VARCHAR(255),
    password_user VARCHAR(255) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id)
) ENGINE=InnoDB;

-- 3. Create the 'home' Table
CREATE TABLE IF NOT EXISTS home (
    home_id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    key_name VARCHAR(255) NOT NULL,
    key_value VARCHAR(255),
    PRIMARY KEY (home_id)
) ENGINE=InnoDB;

-- 4. Create the 'service_category' Table
CREATE TABLE IF NOT EXISTS service_category (
    category_id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    category_image VARCHAR(255),
    category_icon VARCHAR(255),
    category_description VARCHAR(500),
    PRIMARY KEY (category_id)
) ENGINE=InnoDB;

-- 5. Create the 'service_offered' Table
CREATE TABLE IF NOT EXISTS service_offered (
    offered_id INT NOT NULL AUTO_INCREMENT,
    category_id INT NOT NULL,
    offered_image_url VARCHAR(255),
    offered_name VARCHAR(255) NOT NULL,
    offered_price INT NOT NULL,
    offered_description TEXT,
    PRIMARY KEY (offered_id),
    FOREIGN KEY (category_id) REFERENCES service_category(category_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 6. Create the 'about' Table
CREATE TABLE IF NOT EXISTS about (
    about_id INT NOT NULL AUTO_INCREMENT,
    description_about TEXT,
    image_url_about VARCHAR(255),
    PRIMARY KEY (about_id)
) ENGINE=InnoDB;

-- 7. Create the 'transaction' Table
CREATE TABLE IF NOT EXISTS transaction (
    transaction_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    laundry_location VARCHAR(255),
    PRIMARY KEY (transaction_id),
    FOREIGN KEY (user_id) REFERENCES login(user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 8. Create the 'step_order' Table
CREATE TABLE IF NOT EXISTS step_order (
    step_id INT NOT NULL AUTO_INCREMENT,
    step_icon VARCHAR(255),
    step_number INT NOT NULL,
    step_title VARCHAR(255) NOT NULL,
    step_description VARCHAR(500),
    PRIMARY KEY (step_id)
) ENGINE=InnoDB;

-- 9. Create the 'transaction_detail' Table
CREATE TABLE IF NOT EXISTS transaction_detail (
    detail_id INT NOT NULL AUTO_INCREMENT,
    transaction_id INT NOT NULL,
    offered_id INT NOT NULL,
    value_count INT DEFAULT 1,
    sum_offered_price INT,
    PRIMARY KEY (detail_id),
    FOREIGN KEY (transaction_id) REFERENCES transaction(transaction_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (offered_id) REFERENCES service_offered(offered_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 10. Create the 'comments' Table
CREATE TABLE IF NOT EXISTS comments (
    comments_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    offered_id INT NOT NULL,
    stars INT,
    user_comment TEXT,
    PRIMARY KEY (comments_id),
    FOREIGN KEY (user_id) REFERENCES login(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (offered_id) REFERENCES service_offered(offered_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CHECK (stars BETWEEN 1 AND 5)
) ENGINE=InnoDB;

-- 11. Create the 'contact' Table
CREATE TABLE IF NOT EXISTS contact (
    contact_id INT NOT NULL AUTO_INCREMENT,
    image_url_contact VARCHAR(255),
    title_contact VARCHAR(255),
    PRIMARY KEY (contact_id)
) ENGINE=InnoDB;

-- 12. Create the 'contact_send' Table
CREATE TABLE IF NOT EXISTS contact_send (
    send_id INT NOT NULL AUTO_INCREMENT,
    contact_id INT,
    contact_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_message TEXT,
    PRIMARY KEY (send_id),
    FOREIGN KEY (contact_id) REFERENCES contact(contact_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 13. Add Indexes for Faster Queries (Optional but Recommended)
CREATE INDEX idx_user_role ON login(user_role);
CREATE INDEX idx_home_key ON home(key_name);
CREATE INDEX idx_home_title ON home(title);
CREATE INDEX idx_service_category_title ON service_category(title);
CREATE INDEX idx_service_offered_category ON service_offered(category_id);
CREATE INDEX idx_transaction_user ON transaction(user_id);
CREATE INDEX idx_transaction_detail_transaction ON transaction_detail(transaction_id);
CREATE INDEX idx_transaction_detail_offered ON transaction_detail(offered_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_offered ON comments(offered_id);
CREATE INDEX idx_contact_send_contact ON contact_send(contact_id);

-- ----------------------------------------------
-- 14. Insert Dummy Data into 'login' Table
-- ----------------------------------------------
INSERT INTO login (username_user, user_image_profile, password_user, user_role) VALUES
('john_doe', 'images/profiles/john.jpg', 'password123', 'customer'),
('jane_smith', 'images/profiles/jane.jpg', 'securepass', 'customer'),
('admin_user', 'images/profiles/admin.jpg', 'adminpass', 'admin'),
('alice_wonder', 'images/profiles/alice.jpg', 'alicepwd', 'customer'),
('bob_builder', 'images/profiles/bob.jpg', 'bobsecure', 'customer');

-- ----------------------------------------------
-- 15. Insert Dummy Data into 'service_category' Table
-- ----------------------------------------------
INSERT INTO service_category (title, service_icon, service_description) VALUES
('Washing', 'icons/washing.png', 'Comprehensive washing services for all types of fabrics.'),
('Dry Cleaning', 'icons/dry_cleaning.png', 'Professional dry cleaning for delicate garments.'),
('Ironing', 'icons/ironing.png', 'Expert ironing services to keep your clothes wrinkle-free.'),
('Pickup & Delivery', 'icons/pickup_delivery.png', 'Convenient pickup and delivery services at your doorstep.'),
('Stain Removal', 'icons/stain_removal.png', 'Effective stain removal for stubborn spots.');

-- ----------------------------------------------
-- 16. Insert Dummy Data into 'service_offered' Table
-- ----------------------------------------------
INSERT INTO service_offered (category_id, offered_image_url, offered_name, offered_price, offered_description) VALUES
(1, 'images/services/washing_standard.jpg', 'Standard Washing', 50000, 'Basic washing service for everyday clothes.'),
(1, 'images/services/washing_deluxe.jpg', 'Deluxe Washing', 80000, 'Enhanced washing with premium detergents.'),
(2, 'images/services/dry_cleaning_silk.jpg', 'Silk Dry Cleaning', 150000, 'Specialized dry cleaning for silk garments.'),
(3, 'images/services/ironing_premium.jpg', 'Premium Ironing', 30000, 'Top-notch ironing service with attention to detail.'),
(4, 'images/services/pickup_basic.jpg', 'Basic Pickup & Delivery', 20000, 'Standard pickup and delivery within the city.'),
(5, 'images/services/stain_removal.jpg', 'Stain Removal Treatment', 40000, 'Effective treatment to remove tough stains.');

-- ----------------------------------------------
-- 17. Insert Dummy Data into 'about' Table
-- ----------------------------------------------
INSERT INTO about (description_about, image_url_about) VALUES
( 'We provide top-notch washing services using eco-friendly detergents.', 'images/about/washing.jpg'),
( 'Our dry cleaning service ensures your delicate fabrics are handled with care.', 'images/about/dry_cleaning.jpg'),
( 'Professional ironing to give your clothes a crisp and neat appearance.', 'images/about/ironing.jpg'),
( 'Convenient pickup and delivery to save your time and effort.', 'images/about/pickup_delivery.jpg'),
( 'Advanced stain removal techniques to keep your clothes spotless.', 'images/about/stain_removal.jpg');

-- ----------------------------------------------
-- 18. Insert Dummy Data into 'contact' Table
-- ----------------------------------------------
INSERT INTO contact (image_url_contact, title_contact) VALUES
('images/contact/email.png', 'Email Us'),
('images/contact/phone.png', 'Call Us'),
('images/contact/location.png', 'Our Location'),
('images/contact/support.png', 'Customer Support'),
('images/contact/social.png', 'Follow Us on Social Media');

-- ----------------------------------------------
-- 19. Insert Dummy Data into 'transaction' Table
-- ----------------------------------------------
INSERT INTO transaction (user_id, laundry_location) VALUES
(1, '123 Laundry Street, Clean City'),
(2, '456 Fresh Avenue, Clean City'),
(4, '789 Sparkle Road, Clean City'),
(5, '321 Bright Blvd, Clean City'),
(1, '123 Laundry Street, Clean City');

-- ----------------------------------------------
-- 20. Insert Dummy Data into 'step_order' Table
-- ----------------------------------------------
-- Assuming transaction IDs 1 to 5
INSERT INTO step_order ( step_icon, step_number, step_title, step_description) VALUES
-- Transaction 1
( 'icons/order_received.png', 1, 'Order Received', 'We have received your laundry order.'),
( 'icons/washing.png', 2, 'Washing', 'Your clothes are being washed.'),
( 'icons/drying.png', 3, 'Drying', 'Drying the clothes to perfection.'),
( 'icons/ironing.png', 4, 'Ironing', 'Ironing your clothes for a crisp look.'),
( 'icons/delivery.png', 5, 'Delivered', 'Your clothes have been delivered.'),
-- Transaction 2
( 'icons/order_received.png', 1, 'Order Received', 'We have received your laundry order.'),
( 'icons/washing.png', 2, 'Washing', 'Your clothes are being washed.'),
( 'icons/drying.png', 3, 'Drying', 'Drying the clothes to perfection.'),
( 'icons/ironing.png', 4, 'Ironing', 'Ironing your clothes for a crisp look.'),
( 'icons/delivery.png', 5, 'Delivered', 'Your clothes have been delivered.'),
-- Transaction 3
( 'icons/order_received.png', 1, 'Order Received', 'We have received your laundry order.'),
( 'icons/washing.png', 2, 'Washing', 'Your clothes are being washed.'),
( 'icons/drying.png', 3, 'Drying', 'Drying the clothes to perfection.'),
( 'icons/ironing.png', 4, 'Ironing', 'Ironing your clothes for a crisp look.'),
( 'icons/delivery.png', 5, 'Delivered', 'Your clothes have been delivered.'),
-- Transaction 4
( 'icons/order_received.png', 1, 'Order Received', 'We have received your laundry order.'),
( 'icons/washing.png', 2, 'Washing', 'Your clothes are being washed.'),
( 'icons/drying.png', 3, 'Drying', 'Drying the clothes to perfection.'),
( 'icons/ironing.png', 4, 'Ironing', 'Ironing your clothes for a crisp look.'),
( 'icons/delivery.png', 5, 'Delivered', 'Your clothes have been delivered.'),
-- Transaction 5
( 'icons/order_received.png', 1, 'Order Received', 'We have received your laundry order.'),
( 'icons/washing.png', 2, 'Washing', 'Your clothes are being washed.'),
( 'icons/drying.png', 3, 'Drying', 'Drying the clothes to perfection.'),
( 'icons/ironing.png', 4, 'Ironing', 'Ironing your clothes for a crisp look.'),
( 'icons/delivery.png', 5, 'Delivered', 'Your clothes have been delivered.');

-- ----------------------------------------------
-- 21. Insert Dummy Data into 'transaction_detail' Table
-- ----------------------------------------------
-- Assuming transaction IDs 1 to 5 and offered IDs 1 to 6
INSERT INTO transaction_detail (transaction_id, offered_id, value_count, sum_offered_price) VALUES
-- Transaction 1
(1, 1, 2, 100000), -- 2 x Standard Washing
(1, 3, 1, 150000), -- 1 x Silk Dry Cleaning
(1, 4, 3, 90000),  -- 3 x Premium Ironing
-- Transaction 2
(2, 2, 1, 80000),  -- 1 x Deluxe Washing
(2, 5, 2, 80000),  -- 2 x Stain Removal Treatment
-- Transaction 3
(3, 1, 5, 250000), -- 5 x Standard Washing
(3, 4, 2, 60000),  -- 2 x Premium Ironing
-- Transaction 4
(4, 3, 2, 300000), -- 2 x Silk Dry Cleaning
(4, 5, 1, 40000),  -- 1 x Stain Removal Treatment
-- Transaction 5
(5, 2, 3, 240000); -- 3 x Deluxe Washing

-- ----------------------------------------------
-- 22. Insert Dummy Data into 'comments' Table
-- ----------------------------------------------
INSERT INTO comments (user_id, offered_id, stars, user_comment) VALUES
(1, 1, 5, 'Excellent washing service! My clothes are spotless.'),
(2, 3, 4, 'Dry cleaning was good, but took a bit longer than expected.'),
(4, 2, 5, 'Deluxe washing exceeded my expectations. Highly recommend!'),
(5, 5, 3, 'Stain removal worked for most stains, but a few remained.'),
(1, 4, 5, 'Premium ironing left my shirts perfectly pressed.');

-- ----------------------------------------------
-- 23. Insert Dummy Data into 'contact_send' Table
-- ----------------------------------------------
-- Assuming contact IDs 1 to 5 and user IDs 1 to 5
INSERT INTO contact_send (contact_id, contact_name, contact_email, contact_message) VALUES
(1, 'John Doe', '<john@example.com>', 'I have a question about your washing services.'),
(2, 'Jane Smith', '<jane@example.com>', 'Can I change my pickup address?'),
(3, 'Alice Wonder', '<alice@example.com>', 'Where are you located exactly?'),
(4, 'Bob Builder', '<bob@example.com>', 'I need help with my recent order.'),
(5, 'John Doe', '<john@example.com>', 'How can I track my delivery?');
