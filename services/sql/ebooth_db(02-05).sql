/*
 Navicat Premium Dump SQL

 Source Server         : ebooth
 Source Server Type    : MySQL
 Source Server Version : 80100 (8.1.0)
 Source Host           : localhost:3388
 Source Schema         : ebooth_db

 Target Server Type    : MySQL
 Target Server Version : 80100 (8.1.0)
 File Encoding         : 65001

 Date: 02/05/2025 16:59:26
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for activity
-- ----------------------------
DROP TABLE IF EXISTS `activity`;
CREATE TABLE `activity`  (
  `activity_id` int NOT NULL AUTO_INCREMENT,
  `activity_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `activity_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `activity_start` datetime NOT NULL,
  `activity_end` datetime NOT NULL,
  `activity_max` int NULL DEFAULT NULL,
  `reward_points` int NOT NULL,
  `is_multi_day` tinyint(1) NULL DEFAULT 0,
  `organize_id` int NULL DEFAULT NULL,
  `activity_price` int NULL DEFAULT NULL,
  PRIMARY KEY (`activity_id`) USING BTREE,
  INDEX `idx_activity_date`(`activity_start` ASC, `activity_end` ASC) USING BTREE,
  INDEX `idx_organize_id`(`organize_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 56 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of activity
-- ----------------------------
INSERT INTO `activity` VALUES (26, 'สัปดาห์วันวิทยาศาสตร์', '11 สาขาน่าสนใจ', '2025-04-22 07:30:00', '2025-04-24 09:00:00', 995, 10, 1, 19, 150);
INSERT INTO `activity` VALUES (46, 'Sunset Yoga', 'Relaxing yoga during sunset to improve flexibility and mindfulness.', '2025-04-25 18:00:00', '2025-04-25 19:30:00', 58, 8, 0, 2, 100);
INSERT INTO `activity` VALUES (47, 'Weekend Hiking Trip', 'A two-day guided hiking adventure in the nearby mountains.', '2025-05-03 06:00:00', '2025-05-04 18:00:00', 30, 20, 0, 3, 300);
INSERT INTO `activity` VALUES (48, 'Lunchtime Zumba', 'A fun and energetic Zumba session during your lunch break.', '2025-04-30 12:00:00', '2025-04-30 13:00:00', 50, 5, 0, 1, 50);
INSERT INTO `activity` VALUES (49, 'Strength Training Basics', 'Introductory strength training class focusing on proper form.', '2025-05-01 17:00:00', '2025-05-01 18:30:00', 40, 7, 0, 2, 120);
INSERT INTO `activity` VALUES (50, 'Evening Cardio Burn', 'High-intensity cardio to get your heart pumping.', '2025-05-02 19:00:00', '2025-05-02 20:00:00', 70, 6, 0, 3, 90);
INSERT INTO `activity` VALUES (51, 'Outdoor Bootcamp', 'Group fitness bootcamp held in the park.', '2025-05-05 07:00:00', '2025-05-05 08:30:00', 100, 9, 0, 1, 130);
INSERT INTO `activity` VALUES (52, 'Dance Fitness Party', 'A dance-inspired workout session with a party vibe.', '2025-05-06 20:00:00', '2025-05-06 21:30:00', 80, 10, 0, 2, 110);
INSERT INTO `activity` VALUES (53, 'Cycling Challenge', 'Endurance cycling for intermediate and advanced participants.', '2025-05-07 06:30:00', '2025-05-07 08:30:00', 25, 15, 0, 3, 180);
INSERT INTO `activity` VALUES (54, 'Weekend Wellness Retreat', 'A relaxing wellness retreat including meditation, light exercise, and nutrition workshops.', '2025-05-10 09:00:00', '2025-05-11 17:00:00', 20, 25, 0, 1, 400);
INSERT INTO `activity` VALUES (55, 'Core Focus', 'A class that targets abdominal and lower back muscles.', '2025-05-08 17:30:00', '2025-05-08 18:30:00', 55, 6, 0, 2, 95);

-- ----------------------------
-- Table structure for checkin
-- ----------------------------
DROP TABLE IF EXISTS `checkin`;
CREATE TABLE `checkin`  (
  `checkin_id` int NOT NULL AUTO_INCREMENT,
  `member_id` int NOT NULL,
  `activity_id` int NULL DEFAULT NULL,
  `sub_activity_id` int NULL DEFAULT NULL,
  `checkin_time` datetime NULL DEFAULT NULL,
  `is_checkin` tinyint NULL DEFAULT 0,
  PRIMARY KEY (`checkin_id`) USING BTREE,
  INDEX `idx_checkin_member`(`member_id` ASC) USING BTREE,
  INDEX `idx_checkin_activity`(`activity_id` ASC) USING BTREE,
  INDEX `idx_checkin_sub`(`sub_activity_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 32 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of checkin
-- ----------------------------
INSERT INTO `checkin` VALUES (26, 18, 26, 14, '2025-04-29 09:08:54', 0);
INSERT INTO `checkin` VALUES (27, 18, 26, 15, '2025-04-29 09:09:18', 0);
INSERT INTO `checkin` VALUES (28, 17, 26, 14, '2025-04-29 09:11:37', 0);
INSERT INTO `checkin` VALUES (29, 17, 26, 15, '2025-04-29 09:11:37', 0);
INSERT INTO `checkin` VALUES (30, 18, 46, 18, '2025-04-29 09:12:41', 0);
INSERT INTO `checkin` VALUES (31, 18, 26, 17, '2025-04-30 08:29:10', 0);

-- ----------------------------
-- Table structure for condition
-- ----------------------------
DROP TABLE IF EXISTS `condition`;
CREATE TABLE `condition`  (
  `condition_id` int NOT NULL AUTO_INCREMENT,
  `condition_type_id` int NULL DEFAULT NULL,
  `condition_point` int NULL DEFAULT NULL,
  `condition_start` datetime NULL DEFAULT NULL,
  `condition_end` datetime NULL DEFAULT NULL,
  `condition_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `condition_active` tinyint(1) NULL DEFAULT NULL,
  PRIMARY KEY (`condition_id`) USING BTREE,
  INDEX `idx_condition_type`(`condition_type_id` ASC) USING BTREE,
  INDEX `idx_condition_active`(`condition_active` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of condition
-- ----------------------------

-- ----------------------------
-- Table structure for condition_mission
-- ----------------------------
DROP TABLE IF EXISTS `condition_mission`;
CREATE TABLE `condition_mission`  (
  `condition_mission_id` int NOT NULL AUTO_INCREMENT,
  `condition_id` int NULL DEFAULT NULL,
  `mission_id` int NULL DEFAULT NULL,
  `condition_mission_count` int NULL DEFAULT NULL,
  PRIMARY KEY (`condition_mission_id`) USING BTREE,
  UNIQUE INDEX `condition_id`(`condition_id` ASC) USING BTREE,
  UNIQUE INDEX `mission_id`(`mission_id` ASC) USING BTREE,
  INDEX `idx_cm_mission`(`mission_id` ASC) USING BTREE,
  INDEX `idx_cm_condition`(`condition_id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of condition_mission
-- ----------------------------

-- ----------------------------
-- Table structure for condition_type
-- ----------------------------
DROP TABLE IF EXISTS `condition_type`;
CREATE TABLE `condition_type`  (
  `condition_type_id` int NOT NULL AUTO_INCREMENT,
  `condition_type_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`condition_type_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of condition_type
-- ----------------------------

-- ----------------------------
-- Table structure for member
-- ----------------------------
DROP TABLE IF EXISTS `member`;
CREATE TABLE `member`  (
  `member_id` int NOT NULL AUTO_INCREMENT,
  `member_username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `member_email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `member_password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `member_exp` int NULL DEFAULT NULL,
  `member_rank_id` int NOT NULL,
  `member_register` datetime NULL DEFAULT NULL,
  `member_address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `member_point_total` int NOT NULL,
  `member_point_remain` int NULL DEFAULT NULL,
  `is_admin` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`member_id`) USING BTREE,
  UNIQUE INDEX `member_username`(`member_username` ASC) USING BTREE,
  UNIQUE INDEX `member_email`(`member_email` ASC) USING BTREE,
  INDEX `idx_member_email`(`member_email` ASC) USING BTREE,
  INDEX `idx_member_rank_id`(`member_rank_id` ASC) USING BTREE,
  INDEX `idx_is_admin`(`is_admin` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of member
-- ----------------------------
INSERT INTO `member` VALUES (13, 'yoyo', 'yoyo@gmail.com', '$2b$10$U4sbNrUpjAM4aVHV4RP3jeZTlssls.934Oz0bn8fN234mBYNYiW6m', 0, 0, '2025-04-20 10:37:19', '153/10 Buriram', 0, 0, 1);
INSERT INTO `member` VALUES (17, 'thodnew', 'tanarat.dev18@gmail.com', '$2b$10$sohtrImAKfRf0n28KzuWWe2AB2LkyTwL.qUYxuIXmxAeG0A7NQKSq', 0, 1, '2025-04-28 13:51:26', '153/10 Buriram', 0, 0, 0);
INSERT INTO `member` VALUES (18, 'nemNew', 'nemNew@gmail.com', '$2b$10$AvGtiuCXn6uJIyXWRhf6AuMYvRfgwh3bL7OKdAtyRI2zNjutCkPbG', 0, 1, '2025-04-28 17:22:21', '153 / 10 buriram', 0, 0, 0);

-- ----------------------------
-- Table structure for member_condition
-- ----------------------------
DROP TABLE IF EXISTS `member_condition`;
CREATE TABLE `member_condition`  (
  `member_condition_id` int NOT NULL AUTO_INCREMENT,
  `member_id` int NULL DEFAULT NULL,
  `condition_id` int NULL DEFAULT NULL,
  `member_condition_update` datetime NULL DEFAULT NULL,
  `member_condition_complete` tinyint(1) NULL DEFAULT NULL,
  `member_condition_get` tinyint(1) NULL DEFAULT NULL,
  `member_condition_count` int NULL DEFAULT NULL,
  PRIMARY KEY (`member_condition_id`) USING BTREE,
  UNIQUE INDEX `member_id`(`member_id` ASC) USING BTREE,
  UNIQUE INDEX `condition_id`(`condition_id` ASC) USING BTREE,
  INDEX `idx_mc_member`(`member_id` ASC) USING BTREE,
  INDEX `idx_mc_condition`(`condition_id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of member_condition
-- ----------------------------

-- ----------------------------
-- Table structure for member_mission
-- ----------------------------
DROP TABLE IF EXISTS `member_mission`;
CREATE TABLE `member_mission`  (
  `member_mission_id` int NOT NULL AUTO_INCREMENT,
  `member_id` int NULL DEFAULT NULL,
  `mission_id` int NULL DEFAULT NULL,
  `member_mission_count` int NULL DEFAULT NULL,
  `member_mission_complete` tinyint(1) NULL DEFAULT NULL,
  PRIMARY KEY (`member_mission_id`) USING BTREE,
  UNIQUE INDEX `member_id`(`member_id` ASC) USING BTREE,
  UNIQUE INDEX `mission_id`(`mission_id` ASC) USING BTREE,
  INDEX `idx_mm_member`(`member_id` ASC) USING BTREE,
  INDEX `idx_mm_mission`(`mission_id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of member_mission
-- ----------------------------

-- ----------------------------
-- Table structure for member_notification
-- ----------------------------
DROP TABLE IF EXISTS `member_notification`;
CREATE TABLE `member_notification`  (
  `member_notification_id` int NOT NULL AUTO_INCREMENT,
  `notification_id` int NOT NULL,
  `member_id` int NOT NULL,
  `member_notification_read` tinyint(1) NULL DEFAULT NULL,
  `member_notification_reward` tinyint(1) NULL DEFAULT NULL,
  `member_notification_point` int NULL DEFAULT NULL,
  `member_notification_update` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`member_notification_id`) USING BTREE,
  INDEX `idx_mn_member`(`member_id` ASC) USING BTREE,
  INDEX `idx_mn_notification`(`notification_id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of member_notification
-- ----------------------------

-- ----------------------------
-- Table structure for member_rank
-- ----------------------------
DROP TABLE IF EXISTS `member_rank`;
CREATE TABLE `member_rank`  (
  `member_rank_id` int NOT NULL AUTO_INCREMENT,
  `member_rank_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `member_rank_base` int NULL DEFAULT NULL,
  `member_rank_logo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`member_rank_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of member_rank
-- ----------------------------
INSERT INTO `member_rank` VALUES (1, 'start', 1, '/uploads/member_ranks/n57romvp7juqjje3kpme5zw16.png');
INSERT INTO `member_rank` VALUES (2, 'silver', 1000, '/uploads/member_ranks/xej0rddk6gogc3vvufn3kx1xl.png');
INSERT INTO `member_rank` VALUES (3, 'gold', 1500, '/uploads/member_ranks/pw64igsodx7d589jfuptlmq1z.png');
INSERT INTO `member_rank` VALUES (4, 'Master', 2500, '/uploads/member_ranks/utcvj7wstfikrl78yl8is9cso.png');

-- ----------------------------
-- Table structure for mission
-- ----------------------------
DROP TABLE IF EXISTS `mission`;
CREATE TABLE `mission`  (
  `mission_id` int NOT NULL AUTO_INCREMENT,
  `mission_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `mission_detail` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `mission_type_id` int NULL DEFAULT NULL,
  `mission_points` int NULL DEFAULT 5,
  `mission_active` tinyint(1) NULL DEFAULT 1,
  `mission_target_count` int NULL DEFAULT NULL,
  PRIMARY KEY (`mission_id`) USING BTREE,
  INDEX `idx_mission_type`(`mission_type_id` ASC) USING BTREE,
  INDEX `idx_mission_active`(`mission_active` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of mission
-- ----------------------------

-- ----------------------------
-- Table structure for mission_type
-- ----------------------------
DROP TABLE IF EXISTS `mission_type`;
CREATE TABLE `mission_type`  (
  `mission_type_id` int NOT NULL AUTO_INCREMENT,
  `mission_type_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `mission_type_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  PRIMARY KEY (`mission_type_id`) USING BTREE,
  UNIQUE INDEX `mission_type_name`(`mission_type_name` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of mission_type
-- ----------------------------

-- ----------------------------
-- Table structure for notification
-- ----------------------------
DROP TABLE IF EXISTS `notification`;
CREATE TABLE `notification`  (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `member_id` int NOT NULL,
  `notification_message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `notification_read` tinyint(1) NULL DEFAULT 0,
  `notification_created` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`notification_id`) USING BTREE,
  INDEX `idx_notification_member`(`member_id` ASC) USING BTREE,
  INDEX `idx_notification_read`(`notification_read` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of notification
-- ----------------------------

-- ----------------------------
-- Table structure for organize
-- ----------------------------
DROP TABLE IF EXISTS `organize`;
CREATE TABLE `organize`  (
  `organize_id` int NOT NULL AUTO_INCREMENT,
  `organize_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `organize_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `organize_tel` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `organize_email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `organize_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  PRIMARY KEY (`organize_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 26 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of organize
-- ----------------------------
INSERT INTO `organize` VALUES (11, 'หน่อยงานวัดท่าไหม้', '555/1 ดาวอังคาร', '1234567888', 'Thamai@hotmail.com', 'ดูแลการปลูกพืชบนดาวอังคาร');
INSERT INTO `organize` VALUES (12, 'หน่อยงานวัดท่าไหม้', '555/1 ดาวอังคาร', '1234567888', 'Thamai@hotmail.com', 'ดูแลการปลูกพืชบนดาวอังคาร');
INSERT INTO `organize` VALUES (13, 'หน่อยงานวัดท่าไหม้', '555/1 ดาวอังคาร', '1234567888', 'Thamai@hotmail.com', 'ดูแลการปลูกพืชบนดาวอังคาร');
INSERT INTO `organize` VALUES (14, 'หน่อยงานวัดท่าไหม้', '555/1 ดาวอังคาร', '1234567888', 'Thamai@hotmail.com', 'ดูแลการปลูกพืชบนดาวอังคาร');
INSERT INTO `organize` VALUES (15, 'ศูนย์พัฒนาพืชบนดาวอังคาร', '101 ถนนสายหลัก เขตอังคารกลาง', '0912345678', 'center_mars01@hotmail.com', 'ส่งเสริมการเพาะปลูกพืชพันธุ์ใหม่');
INSERT INTO `organize` VALUES (16, 'กองสำรวจดินดาวอังคาร', '202 ซอยสำรวจ เขตอังคารใต้', '0912345679', 'soil_mars02@hotmail.com', 'วิเคราะห์คุณภาพดินเพื่อการเกษตร');
INSERT INTO `organize` VALUES (17, 'หน่วยงานวิจัยน้ำบนอังคาร', '303 ถนนทรัพยากร เขตอังคารเหนือ', '0912345680', 'water_mars03@hotmail.com', 'ค้นคว้าแหล่งน้ำเพื่อการเพาะปลูก');
INSERT INTO `organize` VALUES (18, 'องค์กรพัฒนาพลังงานเขียว', '404 ถนนพลังงาน เขตอังคารตะวันตก', '0912345681', 'greenenergy_mars04@hotmail.com', 'พัฒนาพลังงานหมุนเวียนสำหรับการเกษตร');
INSERT INTO `organize` VALUES (19, 'สถาบันชีววิทยาอวกาศ', '505 ถนนวิทยาศาสตร์ เขตอังคารกลาง', '0912345682', 'bio_mars05@hotmail.com', 'ศึกษาชีวิตพืชในสภาวะไร้แรงโน้มถ่วง');
INSERT INTO `organize` VALUES (20, 'ศูนย์เกษตรกรรมอัจฉริยะ', '606 ถนนเกษตร เขตอังคารตะวันออก', '0912345683', 'smartfarm_mars06@hotmail.com', 'พัฒนาเทคโนโลยีฟาร์มอัจฉริยะ');
INSERT INTO `organize` VALUES (21, 'ศูนย์เกษตรกรรมอัจฉริยะ', '606 ถนนเกษตร เขตอังคารตะวันออก', '0912345683', 'smartfarm_mars06@hotmail.com', 'พัฒนาเทคโนโลยีฟาร์มอัจฉริยะ');
INSERT INTO `organize` VALUES (22, 'ศูนย์เกษตรกรรมอัจฉริยะ', '606 ถนนเกษตร เขตอังคารตะวันออก', '0912345683', 'smartfarm_mars06@hotmail.com', 'พัฒนาเทคโนโลยีฟาร์มอัจฉริยะ');
INSERT INTO `organize` VALUES (23, 'ศูนย์เกษตรกรรมอัจฉริยะ', '606 ถนนเกษตร เขตอังคารตะวันออก', '0912345683', 'smartfarm_mars06@hotmail.com', 'พัฒนาเทคโนโลยีฟาร์มอัจฉริยะ');
INSERT INTO `organize` VALUES (24, 'ศูนย์เกษตรกรรมอัจฉริยะ', '606 ถนนเกษตร เขตอังคารตะวันออก', '0912345683', 'smartfarm_mars06@hotmail.com', 'พัฒนาเทคโนโลยีฟาร์มอัจฉริยะ');
INSERT INTO `organize` VALUES (25, 'ศูนย์เกษตรกรรมอัจฉริยะ', '606 ถนนเกษตร เขตอังคารตะวันออก', '0912345683', 'smartfarm_mars06@hotmail.com', 'พัฒนาเทคโนโลยีฟาร์มอัจฉริยะ');

-- ----------------------------
-- Table structure for personnel
-- ----------------------------
DROP TABLE IF EXISTS `personnel`;
CREATE TABLE `personnel`  (
  `personnel_id` int NOT NULL AUTO_INCREMENT,
  `personnel_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `personnel_address` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `personnel_tel` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `personnel_email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `personnel_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `personnel_username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `personnel_password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `organize_id` int NULL DEFAULT NULL,
  `personel_username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `personel_password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`personnel_id`) USING BTREE,
  INDEX `idx_personnel_org`(`organize_id` ASC) USING BTREE,
  UNIQUE INDEX `personel_username`(`personel_username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 46 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of personnel
-- ----------------------------
INSERT INTO `personnel` VALUES (26, 'คุณสมศรีย์', '555/64 จิระ', '0446313839', 'somSri@bru.ac.th', 'คนคุมบูทที่1', 'somSri332', '$2b$10$SvlOqS.L7iXleVwtSv6AyO40kotJdbF.xBXEFINvH9VdLQRodTBWW', 2, 'tanarat.dev1@gmail.com', '$2b$10$sohtrImAKfRf0n28KzuWWe2AB2LkyTwL.qUYxuIXmxAeG0A7NQKSq');
INSERT INTO `personnel` VALUES (27, 'คุณสมศรีย์', '555/64 จิระ', '0446313839', 'somSri@bru.ac.th', 'คนคุมบูทที่1', 'somSri332', '$2b$10$P536t6yfOZNI5y1JCFnEyu5K1yfL1fug/L8cAHpzPkK3uKd4CnoKO', 2, NULL, NULL);
INSERT INTO `personnel` VALUES (28, 'คุณสมศรีย์', '555/64 จิระ', '0446313839', 'somSri@bru.ac.th', 'คนคุมบูทที่1', 'somSri332', '$2b$10$jEFmqS8KBCbOOecZgjHKIeqUjBxhpIKevLeE3J91u5ShlWTVub0SC', 2, NULL, NULL);
INSERT INTO `personnel` VALUES (29, 'คุณสมศรีย์', '555/64 จิระ', '0446313839', 'somSri@bru.ac.th', 'คนคุมบูทที่1', 'somSri332', '$2b$10$MqhR1Ha22T4677/dhIVYF./D8M.zrFEeO12ONv9FojxqFyc5vzuxu', 2, NULL, NULL);
INSERT INTO `personnel` VALUES (30, 'คุณสมศรีย์', '555/64 จิระ', '0446313839', 'somSri@bru.ac.th', 'คนคุมบูทที่1', 'somSri332', '$2b$10$KoVc0V9xKaKqPLImOOCGfeNNlXfI2n0pQjhLZGeaLwj/ndTUw0ucu', 2, NULL, NULL);
INSERT INTO `personnel` VALUES (31, 'คุณสมศรีย์', '555/64 จิระ', '0446313839', 'somSri@bru.ac.th', 'คนคุมบูทที่1', 'somSri332', '$2b$10$P4WVshH2nO9ZZ6y4RfaseOsmGJfMqFooUyQCYXeyZyUMBLQ7aP/WG', 2, NULL, NULL);
INSERT INTO `personnel` VALUES (32, 'คุณสมศรีย์', '555/64 จิระ', '0446313839', 'somSri@bru.ac.th', 'คนคุมบูทที่1', 'somSri332', '$2b$10$Eac8iRXazR6vywJdG/YnTOvCkZw9yXC2KWQhSw1232ShVAHKLyzqe', 2, NULL, NULL);
INSERT INTO `personnel` VALUES (33, 'คุณสมศรีย์', '555/64 จิระ', '0446313839', 'somSri@bru.ac.th', 'คนคุมบูทที่1', 'somSri332', '$2b$10$1cZslge9PUEORplsMDnzmuvNWTsn6J4B9zEYdyNJlyInG.6uvAU8u', 2, NULL, NULL);
INSERT INTO `personnel` VALUES (34, 'คุณสมศรีย์', '555/64 จิระ', '0446313839', 'somSri@bru.ac.th', 'คนคุมบูทที่1', 'somSri332', '$2b$10$P6TyekOKH5CMQRLElAnZg.IOqdwmymujp5fSHXUapMGwgjhi6k/B6', 2, NULL, NULL);
INSERT INTO `personnel` VALUES (35, 'คุณสมศรีย์', '555/64 จิระ', '0446313839', 'somSri@bru.ac.th', 'คนคุมบูทที่1', 'somSri332', '$2b$10$NKba2FaGionQqDP5DLSq.uvqGR8bx7wYO6h5.BAuE0Fnv98CuFNQK', 2, NULL, NULL);
INSERT INTO `personnel` VALUES (36, 'คุณสมศรีย์', '555/64 จิระ', '0446313839', 'somSri@bru.ac.th', 'คนคุมบูทที่1', 'somSri332', '$2b$10$vtg8susXO59tZ4oa/oVvK.hG..2Mq46Ydxpep.hqO16Sna1Tu5Bse', 2, NULL, NULL);
INSERT INTO `personnel` VALUES (37, 'คุณสมศรีย์', '555/64 จิระ', '0446313839', 'somSri@bru.ac.th', 'คนคุมบูทที่1', 'somSri332', '$2b$10$JIU3DIAestYDuPOe3U7aq.dT2AxUpbsUhBRucxaU0bCzD7rljjIxO', 2, NULL, NULL);
INSERT INTO `personnel` VALUES (38, 'คุณสมศรีย์', '555/64 จิระ', '0446313839', 'somSri@bru.ac.th', 'คนคุมบูทที่1', 'somSri332', '$2b$10$rVybUEDAN2U2HIN4NZJVhufiBarnEEzAQDVBF06XTYtMr0QfIwez.', 2, NULL, NULL);
INSERT INTO `personnel` VALUES (39, 'คุณสมศรีย์', '555/64 จิระ', '0446313839', 'somSri@bru.ac.th', 'คนคุมบูทที่1', 'somSri332', '$2b$10$3CaS7s6/ZB0ARea/4C/ueePPl4Qgp9jA./Ovx3X8QW26ylPT3lzQu', 2, NULL, NULL);
INSERT INTO `personnel` VALUES (40, 'คุณสมศรีย์', '555/64 จิระ', '0446313839', 'somSri@bru.ac.th', 'คนคุมบูทที่1', 'somSri332', '$2b$10$CTU7cuCgJHrHhCbXergrTORnu9Kaa28wlx56.ai7IQujXZ6Fffema', 2, NULL, NULL);
INSERT INTO `personnel` VALUES (41, 'คุณสมศรีย์', '555/64 จิระ', '0446313839', 'somSri@bru.ac.th', 'คนคุมบูทที่1', 'somSri332', '$2b$10$c3iOtjXc1fiDK4QD1X.xK.D1Zlkyi0WxA.nR2F6pt11WLX11jWBU2', 2, NULL, NULL);
INSERT INTO `personnel` VALUES (42, 'คุณสมศรีย์', '555/64 จิระ', '0446313839', 'somSri@bru.ac.th', 'คนคุมบูทที่1', 'somSri332', '$2b$10$xRn/LXakf0fZINfZ.16VcOIYOFqw.mIcrmn4.n.Y6t7YQVMcoEGFC', 2, NULL, NULL);
INSERT INTO `personnel` VALUES (43, 'คุณสมศรีย์', '555/64 จิระ', '0446313839', 'somSri@bru.ac.th', 'คนคุมบูทที่1', 'somSri332', '$2b$10$zA48jiuE4OYtEQx3qI1.dudoQ9mbtmFsGmQNKNPh.P/AkXMmgZjvy', 2, NULL, NULL);
INSERT INTO `personnel` VALUES (44, 'คุณสมศรีย์', '555/64 จิระ', '0446313839', 'somSri@bru.ac.th', 'คนคุมบูทที่1', 'somSri332', '$2b$10$nBq5fO7w8YygfH89U2hVwuDpMPIjtwCZp0414ILVWkfzgB70TfgWO', 2, NULL, NULL);
INSERT INTO `personnel` VALUES (45, 'คุณสมศรีย์', '555/64 จิระ', '0446313839', 'somSri@bru.ac.th', 'คนคุมบูทที่1', 'somSri332', '$2b$10$nKPyzJvCjieiOtPZB2HuEO1bHpJY0Mo4Z9NXDy5B4W5o7nJWb8NB.', 2, NULL, NULL);

-- ----------------------------
-- Table structure for point
-- ----------------------------
DROP TABLE IF EXISTS `point`;
CREATE TABLE `point`  (
  `point_id` int NOT NULL AUTO_INCREMENT,
  `member_id` int NULL DEFAULT NULL,
  `activity_id` int NULL DEFAULT NULL,
  `sub_activity_id` int NULL DEFAULT NULL,
  `point_earned` int NULL DEFAULT NULL,
  `point_created` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`point_id`) USING BTREE,
  INDEX `idx_point_member`(`member_id` ASC) USING BTREE,
  INDEX `idx_point_activity`(`activity_id` ASC) USING BTREE,
  INDEX `idx_point_sub`(`sub_activity_id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of point
-- ----------------------------

-- ----------------------------
-- Table structure for redeem
-- ----------------------------
DROP TABLE IF EXISTS `redeem`;
CREATE TABLE `redeem`  (
  `redeem_id` int NOT NULL AUTO_INCREMENT,
  `member_id` int NULL DEFAULT NULL,
  `reward_id` int NOT NULL,
  `redeem_date` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`redeem_id`) USING BTREE,
  INDEX `idx_redeem_member`(`member_id` ASC) USING BTREE,
  INDEX `idx_redeem_reward`(`reward_id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of redeem
-- ----------------------------

-- ----------------------------
-- Table structure for reward
-- ----------------------------
DROP TABLE IF EXISTS `reward`;
CREATE TABLE `reward`  (
  `reward_id` int NOT NULL AUTO_INCREMENT,
  `reward_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `reward_point_required` int NOT NULL,
  `reward_qty_available` int NULL DEFAULT 0,
  PRIMARY KEY (`reward_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of reward
-- ----------------------------
INSERT INTO `reward` VALUES (4, 'bronze modal', 5000, 20);
INSERT INTO `reward` VALUES (5, 'bronze modal', 5000, 20);
INSERT INTO `reward` VALUES (6, 'bronze modal', 5000, 20);
INSERT INTO `reward` VALUES (7, 'bronze modal', 5000, 20);
INSERT INTO `reward` VALUES (8, 'bronze modal', 5000, 20);
INSERT INTO `reward` VALUES (9, 'bronze modal', 5000, 20);
INSERT INTO `reward` VALUES (10, 'bronze modal', 5000, 20);

-- ----------------------------
-- Table structure for sub_activity
-- ----------------------------
DROP TABLE IF EXISTS `sub_activity`;
CREATE TABLE `sub_activity`  (
  `sub_activity_id` int NOT NULL AUTO_INCREMENT,
  `activity_id` int NULL DEFAULT NULL,
  `sub_activity_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `sub_activity_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `sub_activity_start` datetime NULL DEFAULT NULL,
  `sub_activity_end` datetime NULL DEFAULT NULL,
  `sub_activity_max` int NULL DEFAULT NULL,
  `sub_activity_point` int NULL DEFAULT NULL,
  `sub_activity_price` int NULL DEFAULT NULL,
  `qr_image_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL
  PRIMARY KEY (`sub_activity_id`) USING BTREE,
  INDEX `idx_activity_id`(`activity_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sub_activity
-- ----------------------------
INSERT INTO `sub_activity` VALUES (13, 2, 'Morning Bootcamp ep.1', 'First An early morning group workout session.', '2025-04-22 07:30:00', '2025-04-24 09:00:00', 20, 2, 200);
INSERT INTO `sub_activity` VALUES (14, 26, 'เปิดกิจกรรมถ้ำเสือ', 'รอดถ้ำเสือ เล่นน้ำ มีโคลน มีแป้ง', '2025-04-28 21:06:00', '2025-04-28 21:06:00', 0, 1, 1);
INSERT INTO `sub_activity` VALUES (15, 26, 'เปิดกิจกรรมถ้ำเสือ 2', ' รอดถ้ำเสือ เล่นน้ำ มีโคลน มีแป้ง 2', '2025-04-29 10:40:47', '2025-04-30 10:40:50', 44, 2, 199);
INSERT INTO `sub_activity` VALUES (16, 26, 'ทดลองทำระเบิด', 'สนุกกก', '2025-04-22 07:30:00', '2025-04-24 09:00:00', 19, 2, 200);
INSERT INTO `sub_activity` VALUES (17, 26, 'ทดลองทำจรวดขวดน้ำ', 'สนุกกก', '2025-04-22 07:30:00', '2025-04-24 09:00:00', 17, 2, 200);
INSERT INTO `sub_activity` VALUES (18, 46, 'Sunset Yoga ท่าที่ 1 ', 'Relaxing yoga during sunset to improve flexibility and mindfulness.', '2025-04-22 07:30:00', '2025-04-24 09:00:00', 18, 2, 200);

SET FOREIGN_KEY_CHECKS = 1;
