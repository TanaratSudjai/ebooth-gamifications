-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 28, 2025 at 10:26 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `warehouse`
--

-- --------------------------------------------------------

--
-- Table structure for table `lot`
--

CREATE TABLE `lot` (
  `lot_id` int(11) NOT NULL,
  `lot_name` varchar(255) DEFAULT NULL,
  `lot_detail` varchar(255) DEFAULT NULL,
  `warehouse_id` int(11) DEFAULT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `lot_date` datetime DEFAULT NULL,
  `lot_status_id` int(11) DEFAULT NULL,
  `warehouse_from_id` int(11) DEFAULT NULL,
  `warehouse_inout` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lot`
--

INSERT INTO `lot` (`lot_id`, `lot_name`, `lot_detail`, `warehouse_id`, `supplier_id`, `lot_date`, `lot_status_id`, `warehouse_from_id`, `warehouse_inout`) VALUES
(1, 'Lot-10/12/2568-0123A', 'รับจากจีนจำนวนมาก', 2, 1, '2025-04-25 16:52:36', 2, 2, 1),
(2, 'LOT-AAA', 'sadasdad', 2, 1, '2025-04-28 14:44:42', 2, 2, 1),
(3, 'Lot-10/12/2568-0123Bb', '6', 2, 1, '2025-04-28 14:46:22', 1, 2, 1),
(4, 'Lot-10/12/2568-0123Bb', '66+', 2, 1, '2025-04-28 14:46:22', 2, 2, 1),
(5, 'Lot-10/12/2568-0123Cc', '3454534535', 2, 1, '2025-04-28 14:48:31', 1, 2, 1),
(6, 'Lot-10/12/2568-0123Cc', '3454534535', 2, 1, '2025-04-28 14:48:31', 2, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `lot_product`
--

CREATE TABLE `lot_product` (
  `lot_product_id` bigint(20) NOT NULL,
  `lot_id` int(11) DEFAULT NULL,
  `lot_name` varchar(255) DEFAULT NULL,
  `lot_product_qty` int(11) DEFAULT NULL,
  `lot_product_remain` int(11) DEFAULT NULL,
  `lot_product_capital` int(11) DEFAULT NULL,
  `lot_product_date` datetime DEFAULT NULL,
  `lot_product_status` int(11) DEFAULT NULL,
  `product_id` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lot_product`
--

INSERT INTO `lot_product` (`lot_product_id`, `lot_id`, `lot_name`, `lot_product_qty`, `lot_product_remain`, `lot_product_capital`, `lot_product_date`, `lot_product_status`, `product_id`) VALUES
(1, 1, NULL, 50, 40, 25, '2025-04-25 16:52:51', 1, '8850904410083'),
(2, 1, NULL, 50, 50, 25, '2025-04-25 16:53:00', 1, '8850904410410'),
(3, 2, NULL, 51, 51, 25, '2025-04-28 14:45:15', 1, '51545454656'),
(4, 2, NULL, 50, 50, 35, '2025-04-28 14:45:59', 1, '98564643565'),
(5, 4, NULL, 50, 50, 39, '2025-04-28 14:47:27', 1, '88454565646'),
(6, 4, NULL, 25, 25, 29, '2025-04-28 14:47:55', 1, '54546446564545'),
(8, 6, NULL, 55, 52, 49, '2025-04-28 14:49:29', 1, '46246642524'),
(9, 6, NULL, 50, 50, 45, '2025-04-28 14:49:32', 1, '45245242'),
(10, 6, NULL, 60, 60, 29, '2025-04-28 14:49:36', 1, '2452424524');

-- --------------------------------------------------------

--
-- Table structure for table `lot_status`
--

CREATE TABLE `lot_status` (
  `lot_status_id` int(11) NOT NULL,
  `lot_status_name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lot_status`
--

INSERT INTO `lot_status` (`lot_status_id`, `lot_status_name`) VALUES
(1, 'รอการอนุมัติ'),
(2, 'ยืนยันแล้ว');

-- --------------------------------------------------------

--
-- Table structure for table `member`
--

CREATE TABLE `member` (
  `member_id` int(11) NOT NULL,
  `member_name` varchar(50) DEFAULT NULL,
  `member_address` varchar(100) DEFAULT NULL,
  `member_phone` varchar(10) DEFAULT NULL,
  `member_register_date` datetime DEFAULT NULL,
  `member_type_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `member`
--

INSERT INTO `member` (`member_id`, `member_name`, `member_address`, `member_phone`, `member_register_date`, `member_type_id`) VALUES
(1, 'จักรกฤษ เที่ยงไทยสงค์', '12/4-5, ถนนหลักเมือง', '0854651551', '2025-04-04 00:00:00', 3);

-- --------------------------------------------------------

--
-- Table structure for table `member_type`
--

CREATE TABLE `member_type` (
  `member_type_id` int(11) NOT NULL,
  `member_type_name` varchar(50) DEFAULT NULL,
  `member_type_min` int(11) DEFAULT NULL,
  `member_type_max` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `member_type`
--

INSERT INTO `member_type` (`member_type_id`, `member_type_name`, `member_type_min`, `member_type_max`) VALUES
(1, 'รายเดือน', NULL, NULL),
(2, 'รายปี', NULL, NULL),
(3, 'vip', NULL, NULL),
(4, 'supper vip', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `personnel`
--

CREATE TABLE `personnel` (
  `personnel_id` int(11) NOT NULL,
  `personnel_name` varchar(50) DEFAULT NULL,
  `personnel_address` varchar(150) DEFAULT NULL,
  `personnel_phone` varchar(10) DEFAULT NULL,
  `personnel_username` varchar(50) DEFAULT NULL,
  `personnel_password` varchar(12) DEFAULT NULL,
  `personnel_type_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `personnel`
--

INSERT INTO `personnel` (`personnel_id`, `personnel_name`, `personnel_address`, `personnel_phone`, `personnel_username`, `personnel_password`, `personnel_type_id`) VALUES
(3, 'นายอดิเทพ บำรุงกลาง', '123/9 บ้านเช่า', '0987654321', 'Aditep', '12345678', 6);

-- --------------------------------------------------------

--
-- Table structure for table `personnel_type`
--

CREATE TABLE `personnel_type` (
  `personnel_type_id` int(11) NOT NULL,
  `personnel_type_name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `personnel_type`
--

INSERT INTO `personnel_type` (`personnel_type_id`, `personnel_type_name`) VALUES
(6, 'พนักงานขาย'),
(7, 'พนักงานตรวจสอบสินค้า'),
(8, 'พนักงานตรวจรับสินค้า');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `product_id` varchar(255) NOT NULL,
  `product_name` varchar(100) DEFAULT NULL,
  `product_price1` decimal(10,2) DEFAULT NULL,
  `product_price2` decimal(10,2) DEFAULT NULL,
  `product_price3` decimal(10,2) DEFAULT NULL,
  `product_price4` decimal(10,2) DEFAULT NULL,
  `product_capital` decimal(10,2) DEFAULT NULL,
  `product_type_id` int(11) DEFAULT NULL,
  `product_brand_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`product_id`, `product_name`, `product_price1`, `product_price2`, `product_price3`, `product_price4`, `product_capital`, `product_type_id`, `product_brand_id`) VALUES
('2452424524', 'สูตรใหม่ MEDITA ZINC PLUS Vitamin C+ Collagen เมดิต้า ซิงค์ พลัส 30 แคปซูล', 199.00, 219.00, 239.00, 245.00, 29.00, 9, 25),
('45245242', 'ไลฟ์ ซิงค์ พลัส วิตามินซี Life Zinc Plus Vitaminc วิตามินบำรุงผม ชุด 2 กระปุก [LLAAD_02]', 159.00, 229.00, 245.00, 289.00, 45.00, 9, 28),
('46246642524', 'MEDITA​ ZINC​ GLUCONATE 75​ mg​ ผลิตภัณฑ์เสริมอาหารเมดิต้า ซิงค์ 21 แคปซูล', 269.00, 279.00, 289.00, 299.00, 49.00, 1, 1),
('51545454656', 'เลซิติน สายดื่มทานได้ กิฟฟารีน Lecithin Giffarine ผสมแคโรทีนอยด์ และวิตามินอี', 0.00, 0.00, 0.00, 0.00, 25.00, NULL, NULL),
('54546446564545', 'กาแฟ กิฟฟารีน รีดิวซ์ซูการ์ กาแฟน้ำตาลต่ำ รอยัลคราวน์ Max รสละมุน ได้สุขภาพ กาแฟสำเร็จรูป กาแฟแท้', 0.00, 0.00, 0.00, 0.00, 29.00, NULL, NULL),
('88454565646', 'กิฟฟารีน ผลิตภัณฑ์เสริมอาหาร เลซิติน ผสมแคโรทีนอยด์และวิตามิน อี (60 แคปซูลนิ่ม)', 0.00, 0.00, 0.00, 0.00, 39.00, NULL, NULL),
('8850904410083', 'เคอร์คิวมา ซี-อี', 25.00, 35.00, 39.00, 49.00, 25.00, 9, 27),
('8850904410410', 'กระชายดำ แมกซ์ พลัส+', 15.00, 25.00, 35.00, 39.00, 25.00, 9, 27),
('98564643565', 'Giffarine ผลิตภัณฑ์แท้กิฟฟารีน โพรไบโอติก 10 พลัส (ผลิตภัณฑ์เสริมอาหาร)', 0.00, 0.00, 0.00, 0.00, 35.00, NULL, NULL),
('สูตรใหม่ MEDITA ZINC PLUS Vitamin C+ Collagen เมดิต้า ซิงค์ พลัส 30 แคปซูล', 'ยังไม่ระบุ', 0.00, 0.00, 0.00, 0.00, 0.00, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_brand`
--

CREATE TABLE `product_brand` (
  `product_brand_id` int(11) NOT NULL,
  `product_brand_name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_brand`
--

INSERT INTO `product_brand` (`product_brand_id`, `product_brand_name`) VALUES
(1, 'B2'),
(2, 'Breeze'),
(3, 'Omo'),
(4, 'Attack'),
(5, 'Singha'),
(6, 'Lay\'s'),
(7, 'Crystal'),
(8, 'Nestlé Pure Life'),
(9, 'Pocky'),
(10, 'Tasto'),
(11, 'Mama'),
(12, 'Wai Wai'),
(13, 'Yum Yum'),
(14, 'ตราปลาหมึก'),
(15, 'Healthy Boy'),
(16, 'Maggi'),
(17, 'Colgate'),
(18, 'Darlie'),
(19, 'Dentiste'),
(20, 'Lux'),
(21, 'Sunsilk'),
(22, 'Pantene'),
(23, 'Coca-Cola'),
(24, 'Pepsi'),
(25, 'Est'),
(26, 'Nivea'),
(27, 'Garnier'),
(28, 'Smooth E'),
(29, 'sad');

-- --------------------------------------------------------

--
-- Table structure for table `product_type`
--

CREATE TABLE `product_type` (
  `product_type_id` int(11) NOT NULL,
  `product_type_name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_type`
--

INSERT INTO `product_type` (`product_type_id`, `product_type_name`) VALUES
(1, 'A1'),
(2, 'ของใช้ในครัวเรือน'),
(3, 'อาหารแห้ง'),
(4, 'เครื่องดื่ม'),
(5, 'ขนมและของทานเล่น'),
(6, 'เครื่องปรุงรส'),
(7, 'ของใช้ส่วนตัว'),
(8, 'ของใช้สำนักงาน/เบ็ดเตล็ด'),
(9, 'เครื่องสำอาง / ผลิตภัณฑ์เพื่อความงาม'),
(10, 'ของเล่นเด็ก / เครื่องเขียน'),
(11, 'สินค้าเทศกาล/โปรโมชั่น'),
(12, 'sd');

-- --------------------------------------------------------

--
-- Table structure for table `sale`
--

CREATE TABLE `sale` (
  `sale_id` int(11) NOT NULL,
  `sale_date` datetime DEFAULT NULL,
  `sale_status_id` int(11) DEFAULT NULL,
  `member_id` int(11) DEFAULT NULL,
  `personnel_id` int(11) DEFAULT NULL,
  `store_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sale`
--

INSERT INTO `sale` (`sale_id`, `sale_date`, `sale_status_id`, `member_id`, `personnel_id`, `store_id`) VALUES
(2, '2025-04-28 14:30:45', 2, 1, 3, NULL),
(3, '2025-04-28 14:36:15', 2, NULL, NULL, NULL),
(4, '2025-04-28 15:03:19', 1, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sale_product`
--

CREATE TABLE `sale_product` (
  `sale_product_id` int(11) NOT NULL,
  `sale_id` int(11) DEFAULT NULL,
  `sale_product_qty` int(11) DEFAULT NULL,
  `sale_product_price` decimal(5,2) DEFAULT NULL,
  `sale_product_capital` decimal(5,2) DEFAULT NULL,
  `product_id` varchar(15) DEFAULT NULL,
  `warehouse_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sale_product`
--

INSERT INTO `sale_product` (`sale_product_id`, `sale_id`, `sale_product_qty`, `sale_product_price`, `sale_product_capital`, `product_id`, `warehouse_id`) VALUES
(5, 2, 10, 49.00, 25.00, '8850904410083', NULL),
(6, 3, 3, 299.00, 49.00, '46246642524', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sale_status`
--

CREATE TABLE `sale_status` (
  `sale_status_id` int(11) NOT NULL,
  `sale_status_name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sale_status`
--

INSERT INTO `sale_status` (`sale_status_id`, `sale_status_name`) VALUES
(1, 'รอจ่าย'),
(2, 'จ่ายแล้ว');

-- --------------------------------------------------------

--
-- Table structure for table `store`
--

CREATE TABLE `store` (
  `store_id` int(11) NOT NULL,
  `store_name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `supplier`
--

CREATE TABLE `supplier` (
  `supplier_id` int(11) NOT NULL,
  `supplier_name` varchar(50) DEFAULT NULL,
  `supplier_address` varchar(150) DEFAULT NULL,
  `supplier_phone` varchar(10) DEFAULT NULL,
  `supplier_detail` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `supplier`
--

INSERT INTO `supplier` (`supplier_id`, `supplier_name`, `supplier_address`, `supplier_phone`, `supplier_detail`) VALUES
(1, 'วรินทร์พิพัชร วัชรพงษ์เกษม', 'อาคารเทคโนโลยีสารสนเทศ มหาวิทยาลัยราชภัฏบุรีรัมย์ 439 ถ.จิระ', '098526421', 'เป็นผู้บริหารระดับสูง');

-- --------------------------------------------------------

--
-- Table structure for table `transport`
--

CREATE TABLE `transport` (
  `transport_id` int(11) NOT NULL,
  `transport_name` varchar(255) DEFAULT NULL,
  `transport_date_out` datetime DEFAULT NULL,
  `transport_date_in` datetime DEFAULT NULL,
  `transport_status_id` int(11) DEFAULT NULL,
  `transport_product_id` int(11) DEFAULT NULL,
  `store_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transport_product`
--

CREATE TABLE `transport_product` (
  `transport_product_id` int(11) NOT NULL,
  `transport_product_qty` int(11) DEFAULT NULL,
  `product_id` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transport_status`
--

CREATE TABLE `transport_status` (
  `transport_status_id` int(11) NOT NULL,
  `transport_status_name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `warehouse`
--

CREATE TABLE `warehouse` (
  `warehouse_id` int(11) NOT NULL,
  `warehouse_name` varchar(50) DEFAULT NULL,
  `warehouse_status` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `warehouse`
--

INSERT INTO `warehouse` (`warehouse_id`, `warehouse_name`, `warehouse_status`) VALUES
(2, 'คลังหลัก', 'พร้อมใช้งาน'),
(3, 'คลังสำรอง', 'พร้อมใช้งาน');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `lot`
--
ALTER TABLE `lot`
  ADD PRIMARY KEY (`lot_id`),
  ADD KEY `warehouse_id` (`warehouse_id`),
  ADD KEY `supplier_id` (`supplier_id`),
  ADD KEY `lot_status_id` (`lot_status_id`),
  ADD KEY `warehouse_from_id` (`warehouse_from_id`);

--
-- Indexes for table `lot_product`
--
ALTER TABLE `lot_product`
  ADD PRIMARY KEY (`lot_product_id`),
  ADD KEY `lot_id` (`lot_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `lot_status`
--
ALTER TABLE `lot_status`
  ADD PRIMARY KEY (`lot_status_id`);

--
-- Indexes for table `member`
--
ALTER TABLE `member`
  ADD PRIMARY KEY (`member_id`),
  ADD KEY `member_type_id` (`member_type_id`);

--
-- Indexes for table `member_type`
--
ALTER TABLE `member_type`
  ADD PRIMARY KEY (`member_type_id`);

--
-- Indexes for table `personnel`
--
ALTER TABLE `personnel`
  ADD PRIMARY KEY (`personnel_id`),
  ADD KEY `personnel_type_id` (`personnel_type_id`);

--
-- Indexes for table `personnel_type`
--
ALTER TABLE `personnel_type`
  ADD PRIMARY KEY (`personnel_type_id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`product_id`) USING BTREE;

--
-- Indexes for table `product_brand`
--
ALTER TABLE `product_brand`
  ADD PRIMARY KEY (`product_brand_id`);

--
-- Indexes for table `product_type`
--
ALTER TABLE `product_type`
  ADD PRIMARY KEY (`product_type_id`);

--
-- Indexes for table `sale`
--
ALTER TABLE `sale`
  ADD PRIMARY KEY (`sale_id`),
  ADD KEY `sale_status_id` (`sale_status_id`),
  ADD KEY `member_id` (`member_id`),
  ADD KEY `personnel_id` (`personnel_id`),
  ADD KEY `store_id` (`store_id`);

--
-- Indexes for table `sale_product`
--
ALTER TABLE `sale_product`
  ADD PRIMARY KEY (`sale_product_id`),
  ADD KEY `sale_id` (`sale_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `warehouse_id` (`warehouse_id`);

--
-- Indexes for table `sale_status`
--
ALTER TABLE `sale_status`
  ADD PRIMARY KEY (`sale_status_id`);

--
-- Indexes for table `store`
--
ALTER TABLE `store`
  ADD PRIMARY KEY (`store_id`);

--
-- Indexes for table `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`supplier_id`);

--
-- Indexes for table `transport`
--
ALTER TABLE `transport`
  ADD PRIMARY KEY (`transport_id`),
  ADD KEY `transport_status_id` (`transport_status_id`),
  ADD KEY `transport_product_id` (`transport_product_id`),
  ADD KEY `store_id` (`store_id`);

--
-- Indexes for table `transport_product`
--
ALTER TABLE `transport_product`
  ADD PRIMARY KEY (`transport_product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `transport_status`
--
ALTER TABLE `transport_status`
  ADD PRIMARY KEY (`transport_status_id`);

--
-- Indexes for table `warehouse`
--
ALTER TABLE `warehouse`
  ADD PRIMARY KEY (`warehouse_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `lot`
--
ALTER TABLE `lot`
  MODIFY `lot_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `lot_product`
--
ALTER TABLE `lot_product`
  MODIFY `lot_product_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `lot_status`
--
ALTER TABLE `lot_status`
  MODIFY `lot_status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `member`
--
ALTER TABLE `member`
  MODIFY `member_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `member_type`
--
ALTER TABLE `member_type`
  MODIFY `member_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `personnel`
--
ALTER TABLE `personnel`
  MODIFY `personnel_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `personnel_type`
--
ALTER TABLE `personnel_type`
  MODIFY `personnel_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `product_brand`
--
ALTER TABLE `product_brand`
  MODIFY `product_brand_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `product_type`
--
ALTER TABLE `product_type`
  MODIFY `product_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `sale`
--
ALTER TABLE `sale`
  MODIFY `sale_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `sale_product`
--
ALTER TABLE `sale_product`
  MODIFY `sale_product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `sale_status`
--
ALTER TABLE `sale_status`
  MODIFY `sale_status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `supplier`
--
ALTER TABLE `supplier`
  MODIFY `supplier_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `warehouse`
--
ALTER TABLE `warehouse`
  MODIFY `warehouse_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
