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
export function DisplayFormathSQLDatetimeFormat(dateStr) {
  if (!dateStr) return "";

  const dateUTC = new Date(dateStr);
  if (isNaN(dateUTC.getTime())) return "";

  // ลบออก 7 ชั่วโมง เพื่อแสดงเป็นเวลาประเทศไทย
  const dateBangkok = new Date(dateUTC.getTime() + 7 * 60 * 60 * 1000);

  const options = {
    timeZone: "Asia/Bangkok",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  const formatter = new Intl.DateTimeFormat("th-TH", options);
  const parts = formatter.formatToParts(dateBangkok);

  const day = parts.find((p) => p.type === "day")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const year = parts.find((p) => p.type === "year")?.value;
  const hour = parts.find((p) => p.type === "hour")?.value;
  const minute = parts.find((p) => p.type === "minute")?.value;

  return `วันที่ ${day}/${month}/${year} เวลา ${hour}:${minute}`;
}
