
-- ตาราง member
CREATE INDEX idx_member_email ON member(member_email);
CREATE INDEX idx_member_rank_id ON member(member_rank_id);
CREATE INDEX idx_is_admin ON member(is_admin);

-- ตาราง activity
CREATE INDEX idx_activity_date ON activity(activity_start, activity_end);
CREATE INDEX idx_organize_id ON activity(organize_id);

-- ตาราง sub_activity
CREATE INDEX idx_activity_id ON sub_activity(activity_id);

-- ตาราง checkin
CREATE INDEX idx_checkin_member ON checkin(member_id);
CREATE INDEX idx_checkin_activity ON checkin(activity_id);
CREATE INDEX idx_checkin_sub ON checkin(sub_activity_id);

-- ตาราง point
CREATE INDEX idx_point_member ON point(member_id);
CREATE INDEX idx_point_activity ON point(activity_id);
CREATE INDEX idx_point_sub ON point(sub_activity_id);

-- ตาราง redeem
CREATE INDEX idx_redeem_member ON redeem(member_id);
CREATE INDEX idx_redeem_reward ON redeem(reward_id);

-- ตาราง notification
CREATE INDEX idx_notification_member ON notification(member_id);
CREATE INDEX idx_notification_read ON notification(notification_read);

-- ตาราง member_notification
CREATE INDEX idx_mn_member ON member_notification(member_id);
CREATE INDEX idx_mn_notification ON member_notification(notification_id);

-- ตาราง mission
CREATE INDEX idx_mission_type ON mission(mission_type_id);
CREATE INDEX idx_mission_active ON mission(mission_active);

-- ตาราง condition
CREATE INDEX idx_condition_type ON `condition`(condition_type_id);
CREATE INDEX idx_condition_active ON `condition`(condition_active);

-- ตาราง condition_mission
CREATE INDEX idx_cm_mission ON condition_mission(mission_id);
CREATE INDEX idx_cm_condition ON condition_mission(condition_id);

-- ตาราง member_mission
CREATE INDEX idx_mm_member ON member_mission(member_id);
CREATE INDEX idx_mm_mission ON member_mission(mission_id);

-- ตาราง member_condition
CREATE INDEX idx_mc_member ON member_condition(member_id);
CREATE INDEX idx_mc_condition ON member_condition(condition_id);

-- ตาราง personnel
CREATE INDEX idx_personnel_org ON personnel(organize_id);
