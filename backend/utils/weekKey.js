// backend/utils/weekKey.js

export default function getCurrentWeek() {
  const now = new Date();

  const year = now.getUTCFullYear();

  // Get first Thursday of the year
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const jan4Day = jan4.getUTCDay() || 7;

  const firstThursday = new Date(jan4);
  firstThursday.setUTCDate(jan4.getUTCDate() - jan4Day + 4);

  const diff = now - firstThursday;
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  const week = Math.floor(diff / oneWeek) + 1;

  return `${year}-W${week.toString().padStart(2, '0')}`;
}
