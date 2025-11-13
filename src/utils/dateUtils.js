import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";

export const formatDate = (date) => {
  return format(new Date(date), "MMM dd, yyyy");
};

export const formatShortDate = (date) => {
  return format(new Date(date), "MM/dd/yyyy");
};

export const formatMonthYear = (date) => {
  return format(new Date(date), "MMMM yyyy");
};

export const getCurrentMonth = () => {
  return format(new Date(), "yyyy-MM");
};

export const getMonthStart = (monthString) => {
  // Handle various month string formats (YYYY-MM or YYYY-MM-DD)
  const normalizedMonth = monthString.includes('-') ? monthString.split('-').slice(0, 2).join('-') : monthString;
  const date = new Date(normalizedMonth + "-01T00:00:00");
  
  // Validate the date is valid
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid month string: ${monthString}`);
  }
  
  return startOfMonth(date);
};

export const getMonthEnd = (monthString) => {
  // Handle various month string formats (YYYY-MM or YYYY-MM-DD)
  const normalizedMonth = monthString.includes('-') ? monthString.split('-').slice(0, 2).join('-') : monthString;
  const date = new Date(normalizedMonth + "-01T00:00:00");
  
  // Validate the date is valid
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid month string: ${monthString}`);
  }
  
  return endOfMonth(date);
};

export const getLastSixMonths = () => {
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    months.push(format(date, "yyyy-MM"));
  }
  return months;
};