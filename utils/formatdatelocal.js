import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/th";

dayjs.locale("th");
dayjs.extend(utc);
dayjs.extend(timezone);

export function toDatetimeLocalString(dateStr) {
  if (!dateStr) return "";

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
}

// แปลงก่อนส่ง backend
export function toSQLDatetimeFormat(dateStr) {
  if (!dateStr) return "";

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

export function formatDisplayDateTime(isoString) {
  if (!isoString) return "";

  const dateUTC = new Date(isoString);
  if (isNaN(dateUTC.getTime())) return "";

  const dateBangkok = new Date(dateUTC.getTime() + 7 * 60 * 60 * 1000); // UTC+7

  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  return dateBangkok.toLocaleString("th-TH", options); // ex: 17/05/2025, 16:00
}

export function formatDateToThaiBE(date) {
  if (!date) return "";
  const d = dayjs(date).locale("th");
  const yearBE = d.year() + 543;
  const monthNameTH = d.format("MMMM"); 
  const day = d.format("DD");
  return `${day} ${monthNameTH} ${yearBE}`;
}
