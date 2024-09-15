import { DATE_FORMAT } from 'src/utils/const'
import { DateTime } from 'luxon'

export const fromISOToFormat = (date, format = DATE_FORMAT) => {
  return date && DateTime.fromISO(date).toFormat(format)
}
