import dayjs from 'dayjs';
import { isNumber, isString } from '~/utils/assertion';

export const FORMAT = {
  YYYYMMDD: 'YYYY-MM-DD',
  YYYYMMDD_HHMMSS: 'YYYY-MM-DD HH:mm:ss',
  YYYYMMDD_HHMM: 'YYYY-MM-DD HH:mm',
  MM_YY: 'MM/YY',
  HHMMSS: 'HH:mm:ss',
  MMMM_D_YYYY: 'MMMM D, YYYY',
  YYYY_MM_DD: 'YYYY년 MM월 DD일',
  // May 11, 2023
  MMMM_D_COMMA_YYYY: 'MMMM D, YYYY',
};

export const dayjsWrap = (
  date?: string | number | dayjs.Dayjs | Date | null | undefined,
) => {
  return dayjs(date);
};

export const getDateFormat = (
  date: number | Date | string | null | undefined,
  key = FORMAT.MMMM_D_COMMA_YYYY,
  format = '',
) => {
  if (!date) return format;
  if (date instanceof Date) {
    const mom = dayjsWrap(date);
    if (mom.isValid()) {
      return mom.format(key);
    }
    return format;
  }
  if (isNumber(date)) {
    date = new Date(date);
  } else if (isString(date)) {
    date = new Date(date);
  }

  const mom = dayjsWrap(date);
  if (mom.isValid()) {
    return mom.format(key);
  }
  return format;
};
