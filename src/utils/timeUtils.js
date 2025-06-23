function plural(value, one, few, many) {
  const mod10 = value % 10;
  const mod100 = value % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

export function timeAgo(createdAt) {
  let dateStr = createdAt;

  if (typeof dateStr === "string" && dateStr.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)) {
    dateStr = dateStr.replace(" ", "T");
  }

  const date = new Date(dateStr);
  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHrs / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffMonths / 12);
  if (isNaN(date.getTime()) || diffSec < 0) {
    return date.toLocaleDateString("ru-RU");
  }

  if (diffSec < 45) {
    return "только что";
  }
  if (diffSec < 90) {
    return "минуту назад";
  }

  if (diffMin < 45) {
    return `${diffMin} ${plural(diffMin, "минуту", "минуты", "минут")} назад`;
  }

  if (diffHrs < 24) {
    return `${diffHrs} ${plural(diffHrs, "час", "часа", "часов")} назад`;
  }

  if (diffDays === 1) {
    return "вчера";
  }
  if (diffDays < 30) {
    return `${diffDays} ${plural(diffDays, "день", "дня", "дней")} назад`;
  }

  if (diffMonths < 12) {
    return `${diffMonths} ${plural(diffMonths, "месяц", "месяца", "месяцев")} назад`;
  }

  return `${diffYears} ${plural(diffYears, "год", "года", "лет")} назад`;
}
