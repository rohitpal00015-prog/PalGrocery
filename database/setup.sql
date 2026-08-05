-- ============================================================
--  🗄️ Pal Grocery — MySQL Database Setup Script
--  phpMyAdmin me yeh run karo:
--  1. phpMyAdmin open karo: http://localhost/phpmyadmin
--  2. "SQL" tab click karo
--  3. Yeh saara script paste karo aur "Go" click karo
-- ============================================================

-- Database banao
CREATE DATABASE IF NOT EXISTS palbasket_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE palbasket_db;

-- ─── Products Table ────────────────────────────────────────
DROP TABLE IF EXISTS products;
CREATE TABLE products (
  id           VARCHAR(60)    NOT NULL PRIMARY KEY,
  name         VARCHAR(255)   NOT NULL,
  category     VARCHAR(60)    NOT NULL DEFAULT 'groceries',
  price        DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  discount_price DECIMAL(10,2) NULL,
  rating       DECIMAL(3,1)   NOT NULL DEFAULT 5.0,
  reviews_count INT           NOT NULL DEFAULT 0,
  stock        INT            NOT NULL DEFAULT 0,
  expiry_date  DATE           NULL,
  supplier     VARCHAR(255)   NULL,
  barcode      VARCHAR(50)    NULL,
  description  TEXT           NULL,
  image        LONGTEXT       NULL,
  status       VARCHAR(20)    NOT NULL DEFAULT 'active',
  created_at   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── Offers Table ──────────────────────────────────────────
DROP TABLE IF EXISTS offers;
CREATE TABLE offers (
  id          VARCHAR(60)   NOT NULL PRIMARY KEY,
  title_en    VARCHAR(255)  NOT NULL,
  title_hi    VARCHAR(255)  NOT NULL,
  desc_en     TEXT          NOT NULL,
  desc_hi     TEXT          NOT NULL,
  promo_code  VARCHAR(50)   NOT NULL,
  color       VARCHAR(30)   NOT NULL DEFAULT 'orange',
  active      TINYINT(1)    NOT NULL DEFAULT 1,
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── Shop Settings Table ───────────────────────────────────
DROP TABLE IF EXISTS settings;
CREATE TABLE settings (
  setting_key   VARCHAR(100) NOT NULL PRIMARY KEY,
  setting_value TEXT         NOT NULL,
  updated_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── Orders Table ──────────────────────────────────────────
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
  id             VARCHAR(60)   NOT NULL PRIMARY KEY,
  customer_name  VARCHAR(255)  NULL,
  customer_phone VARCHAR(20)   NULL,
  customer_email VARCHAR(255)  NULL,
  items_json     TEXT          NOT NULL,
  total          DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status         VARCHAR(30)   NOT NULL DEFAULT 'Pending',
  payment_method VARCHAR(50)   NULL DEFAULT 'UPI',
  delivery_address TEXT        NULL,
  is_parchi      TINYINT(1)    DEFAULT 0,
  notes          TEXT          NULL,
  order_date     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
--  DEFAULT DATA — Pal Grocery Products
-- ============================================================

INSERT INTO products (id, name, category, price, discount_price, rating, reviews_count, stock, expiry_date, supplier, barcode, description) VALUES
('prod-1', 'Organic Shimla Apples', 'fruits', 180.00, 149.00, 4.8, 142, 45, '2026-07-15', 'Himalayan Farms', '8901020304011', 'Crisp, sweet and hand-picked fresh organic apples direct from the orchards of Shimla. Rich in antioxidants and dietary fiber.'),
('prod-2', 'Fresh Cavendish Bananas', 'fruits', 60.00, 49.00, 4.5, 98, 8, '2026-09-30', 'Maha Fruits Ltd', '8901020304028', 'Naturally ripened premium Cavendish bananas, high in potassium and energy. Perfect as a quick workout snack.'),
('prod-3', 'Amul Premium Butter (500g)', 'essentials', 275.00, NULL, 4.9, 420, 30, '2026-09-10', 'Amul India Corp', '8901262010015', 'The classic Utterly Butterly Delicious salted butter. Spread it on toast, melt it over paranthas, or use it in baking.'),
('prod-4', 'Mother Dairy Full Cream Milk (1L)', 'essentials', 66.00, 64.00, 4.7, 310, 65, '2026-09-27', 'Mother Dairy Delhi', '8901020304042', 'Pasteurized, homogenized full cream milk with 6% fat. Excellent for making paneer, curd, tea, coffee, and desserts.'),
('prod-5', 'Organic Country Eggs (Pack of 10)', 'essentials', 110.00, 95.00, 4.6, 88, 3, '2026-07-04', 'Happy Hens Poultry', '8901020304059', 'Free-range, high-protein organic brown eggs packed with nutrition. Collected daily from humanely raised country chickens.'),
('prod-6', 'Haldiram Bhujia Sev (350g)', 'snacks', 110.00, NULL, 4.8, 512, 120, '2026-11-20', 'Haldiram Foods', '8904063200057', 'A crispy, crunchy moth pulse flour fried noodle snack spiced with red chillies, black pepper, and dry ginger.'),
('prod-7', 'Lays India Magic Masala (115g)', 'snacks', 50.00, 45.00, 4.4, 280, 90, '2026-10-05', 'Pepsico India', '8902083002131', 'Crispy potato chips seasoned with a proprietary blend of aromatic Indian spices. The ultimate tea-time companion.'),
('prod-8', 'Daawat Rozana Basmati Rice (5kg)', 'groceries', 499.00, 389.00, 4.5, 195, 22, '2027-04-12', 'Daawat Foods', '8901537006023', 'Rich aroma, pristine white long grains. Ideal for everyday dishes like steam rice, jeera rice, and khichdi.'),
('prod-9', 'Fortune Kachi Ghani Mustard Oil (1L)', 'groceries', 185.00, 165.00, 4.7, 154, 40, '2026-12-15', 'Adani Wilmar', '8906007281313', 'Cold-pressed from premium mustard seeds. Retains natural aroma, pungency and essential nutrients for authentic Indian cooking.'),
('prod-10', 'Tata Salt Iodized (1kg)', 'essentials', 28.00, NULL, 4.9, 890, 150, '2028-01-01', 'Tata Consumer Products', '8901058002315', 'Desh ka namak. Vacuum evaporated, iodized salt that guarantees purity and standardized iodine content.'),
('prod-11', 'Coca Cola Classic (750ml)', 'cold_drink', 45.00, 40.00, 4.6, 340, 80, '2026-09-01', 'Coca Cola Bottling', '8901764032222', 'The world''s favorite sparkling carbonated soft drink. Crisp, refreshing taste served chilled with meals.'),
('prod-12', 'Nescafe Classic Coffee (100g)', 'beverages', 320.00, 299.00, 4.7, 220, 15, '2027-02-28', 'Nestle India', '8901058860601', '100% pure instant coffee granules. Signature bold aroma and rich taste derived from carefully roasted Robusta beans.'),
('prod-13', 'Aashirvaad Shudh Chakki Atta (10kg)', 'essentials', 460.00, 440.00, 4.8, 654, 18, '2026-08-30', 'ITC Limited', '8901725181228', '100% stone-ground whole wheat flour. Contains zero maida, ensuring soft, fluffy, and nutritious rotis for days.'),
('prod-14', 'Cadbury Dairy Milk Silk (150g)', 'snacks', 175.00, 150.00, 4.9, 390, 35, '2026-12-25', 'Mondelez India', '7622210817028', 'Rich, smooth and creamy chocolate bar that melts in your mouth for an indulgent chocolate experience.'),
('prod-15', 'Real Fruit Power Mixed Fruit Juice (1L)', 'beverages', 130.00, 115.00, 4.5, 180, 50, '2026-10-18', 'Dabur India', '8901207010490', 'Rich blend of 9 delicious fruits - orange, apple, guava, pineapple, mango, banana, apricot, peach, passion fruit.'),
('lassi-mango', 'Shahi Mango Lassi', 'lassi', 60.00, 49.00, 4.8, 120, 25, '2026-07-15', 'Pal Dairy Solutions', '8901020305018', 'Thick, creamy, traditional sweet lassi blended with fresh mango pulp and topped with nuts.'),
('lassi-kesar', 'Royal Kesar Pista Lassi', 'lassi', 80.00, 69.00, 4.9, 154, 15, '2026-07-15', 'Pal Dairy Solutions', '8901020305025', 'Rich saffron flavored sweet lassi with real pistachios and premium almonds.'),
('lassi-rose', 'Rose Gulab Lassi', 'lassi', 70.00, NULL, 4.7, 88, 20, '2026-07-15', 'Pal Dairy Solutions', '8901020305032', 'Fragrant pink sweet lassi infused with premium organic rose syrup and petals.'),
('lassi-mint', 'Spicy Mint Chaas / Salted Lassi', 'lassi', 40.00, NULL, 4.6, 95, 35, '2026-07-15', 'Pal Dairy Solutions', '8901020305049', 'Refreshing buttermilk blended with fresh mint leaves, roasted cumin, and black salt.'),
('prod-cold-1', 'Sprite Lime Soft Drink (750ml)', 'cold_drink', 45.00, 40.00, 4.6, 195, 45, '2026-10-15', 'Coca Cola Bottling', '8901764031111', 'Crisp and clean tasting lemon-lime flavored soft drink that cures your thirst instantly.'),
('prod-cold-2', 'Thums Up Bold Taste (750ml)', 'cold_drink', 45.00, NULL, 4.7, 260, 55, '2026-10-15', 'Coca Cola Bottling', '8901764032223', 'Strong carbonated cola with a bold, masculine spicy taste. India''s favorite thanda.'),
('prod-ess-1', 'Britannia Atta Bread (400g)', 'essentials', 35.00, 32.00, 4.5, 110, 15, '2026-07-10', 'Britannia Industries', '8901063024040', 'Soft and healthy whole wheat brown bread, sliced and baked fresh daily.'),
('prod-ess-2', 'Premium Harvest Sugar (1kg)', 'essentials', 55.00, 50.00, 4.6, 305, 80, '2027-06-01', 'Harvest Agro Products', '8901020306015', 'Refined, sulphur-free pure sugar crystals, packed hygienically for daily tea, coffee, and cooking.');

-- ─── Default Settings ──────────────────────────────────────
INSERT INTO settings (setting_key, setting_value) VALUES
('shop_name', 'Pal Grocery'),
('phone', '919415552992'),
('delivery_range', '3km'),
('opening_hours', '7:00 AM - 10:00 PM'),
('owner_name', 'Ramlallu Pal');
