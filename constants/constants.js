export const USER_ROLE = {
  ADMIN: "admin", 
  CUSTOMER: "customer",
  BOOTH: "booth",
};

export const API_STATUS = {
  SUCCESS: {
    code: "success",
    defaultMessage: "ดำเนินการสำเร็จ",
    statusCode: 200,
  },
  CREATED: {
    code: "created",
    defaultMessage: "ดำเนินการสำเร็จ",
    statusCode: 201,
  },
  ERROR: {
    code: "error",
    defaultMessage: "เกิดข้อผิดพลาด",
    statusCode: 500,
  },
  UNAUTHORIZED: {
    code: "unauthorized",
    defaultMessage: "คุณไม่มีสิทธิ์ทำรายการนี้",
    statusCode: 401,
  },
  NOT_FOUND: {
    code: "not_found",
    defaultMessage: "ไม่พบข้อมูลที่ต้องการ",
    statusCode: 404,
  },
  VALIDATION_FAILED: {
    code: "validation_failed",
    defaultMessage: "กรอกข้อมูลไม่ครบถ้วนหรือไม่ถูกต้อง",
    statusCode: 422,
  },
};


// // how to use 
//       import { API_STATUS } from '@/constants';
//       import { success, error } from '@/plugins/toast';

//       try {
//         const res = await updateProfile(form);
//         success(API_STATUS.SUCCESS.defaultMessage); // ✅ แสดงข้อความสำเร็จ
//       } catch (err) {
//         error(API_STATUS.ERROR.defaultMessage); // ✅ แสดงข้อความผิดพลาดทั่วไป
//       }