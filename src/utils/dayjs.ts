import * as customParseFormat from 'dayjs/plugin/customParseFormat.js'
import dayjs from 'dayjs'

export function configure() {
  dayjs.extend(customParseFormat.default)
}