/*
  This is a copy of UTC plugin from dayjs v.1.11.10 with a bug fix merged: https://github.com/iamkun/dayjs/pull/2264
  Any updates to the plugin must be done manually, unless the underlying issue has been finally fixed.
*/

export const SECONDS_A_MINUTE = 60
export const SECONDS_A_HOUR = SECONDS_A_MINUTE * 60
export const SECONDS_A_DAY = SECONDS_A_HOUR * 24
export const SECONDS_A_WEEK = SECONDS_A_DAY * 7

export const MILLISECONDS_A_SECOND = 1e3
export const MILLISECONDS_A_MINUTE = SECONDS_A_MINUTE * MILLISECONDS_A_SECOND
export const MILLISECONDS_A_HOUR = SECONDS_A_HOUR * MILLISECONDS_A_SECOND
export const MILLISECONDS_A_DAY = SECONDS_A_DAY * MILLISECONDS_A_SECOND
export const MILLISECONDS_A_WEEK = SECONDS_A_WEEK * MILLISECONDS_A_SECOND

// English locales
export const MS = 'millisecond'
export const S = 'second'
export const MIN = 'minute'
export const H = 'hour'
export const D = 'day'
export const W = 'week'
export const M = 'month'
export const Q = 'quarter'
export const Y = 'year'
export const DATE = 'date'

export const FORMAT_DEFAULT = 'YYYY-MM-DDTHH:mm:ssZ'

export const INVALID_DATE_STRING = 'Invalid Date'

// regex
export const REGEX_PARSE = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/
export const REGEX_FORMAT = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g

const REGEX_VALID_OFFSET_FORMAT = /[+-]\d\d(?::?\d\d)?/g
const REGEX_OFFSET_HOURS_MINUTES_FORMAT = /([+-]|\d\d)/g

function offsetFromString(value = '') {
  const offset = value.match(REGEX_VALID_OFFSET_FORMAT)

  if (!offset) {
    return null
  }

  const [indicator, hoursOffset, minutesOffset] = `${offset[0]}`.match(REGEX_OFFSET_HOURS_MINUTES_FORMAT) || ['-', 0, 0]
  const totalOffsetInMinutes = (+hoursOffset * 60) + (+minutesOffset)

  if (totalOffsetInMinutes === 0) {
    return 0
  }

  return indicator === '+' ? totalOffsetInMinutes : -totalOffsetInMinutes
}



export default (option, Dayjs, dayjs) => {
  const proto = Dayjs.prototype 
  dayjs.utc = function (date) {
    const cfg = { date, utc: true, args: arguments } // eslint-disable-line prefer-rest-params
    return new Dayjs(cfg ) // eslint-disable-line no-use-before-define
  }

  proto.utc = function (keepLocalTime) {
    const ins = dayjs(this.toDate(), { locale: this.$L, utc: true })
    if (keepLocalTime) {
      return ins.add(this.utcOffset(), MIN)
    }
    return ins
  }

  proto.local = function () {
    return dayjs(this.toDate(), { locale: this.$L, utc: false })
  }

  const oldParse = proto.parse
  proto.parse = function (cfg) {
    if (cfg.utc) {
      this.$u = true
    }
    if (!this.$utils().u(cfg.$offset)) {
      this.$offset = cfg.$offset
    }
    oldParse.call(this, cfg)
  }

  const oldInit = proto.init
  proto.init = function () {
    if (this.$u) {
      const { $d } = this
      this.$y = $d.getUTCFullYear()
      this.$M = $d.getUTCMonth()
      this.$D = $d.getUTCDate()
      this.$W = $d.getUTCDay()
      this.$H = $d.getUTCHours()
      this.$m = $d.getUTCMinutes()
      this.$s = $d.getUTCSeconds()
      this.$ms = $d.getUTCMilliseconds()
    } else {
      oldInit.call(this)
    }
  }

  const oldUtcOffset = proto.utcOffset
  proto.utcOffset = function (input, keepLocalTime, keepTimezone) {
    const { u } = this.$utils()
    if (u(input)) {
      if (this.$u) {
        return 0
      }
      if (!u(this.$offset)) {
        return this.$offset
      }
      return oldUtcOffset.call(this)
    }
    if (typeof input === 'string') {
      input = offsetFromString(input)
      if (input === null) {
        return this
      }
    }
    const offset = Math.abs(input) <= 16 ? input * 60 : input
    let ins = this
    if (keepLocalTime) {
      ins.$offset = offset
      ins.$u = input === 0 && !keepTimezone
      return ins
    }
    if (input !== 0 || keepTimezone) {
      const localTimezoneOffset = this.$u
        ? this.toDate().getTimezoneOffset() : -1 * this.utcOffset()
      ins = this.local().add(offset + localTimezoneOffset, MIN)
      ins.$offset = offset
      ins.$x.$localOffset = localTimezoneOffset
      ins.$u = input === 0 && !keepTimezone
    } else {
      ins = this.utc()
    }
    return ins
  }

  const oldFormat = proto.format
  const UTC_FORMAT_DEFAULT = 'YYYY-MM-DDTHH:mm:ss[Z]'
  proto.format = function (formatStr) {
    const str = formatStr || (this.$u ? UTC_FORMAT_DEFAULT : '')
    return oldFormat.call(this, str)
  }

  proto.valueOf = function () {
    const addedOffset = !this.$utils().u(this.$offset)
      ? this.$offset + (this.$x.$localOffset || this.$d.getTimezoneOffset()) : 0
    return this.$d.valueOf() - (addedOffset * MILLISECONDS_A_MINUTE)
  }

  proto.isUTC = function () {
    return !!this.$u
  }

  proto.toISOString = function () {
    return this.toDate().toISOString()
  }

  proto.toString = function () {
    return this.toDate().toUTCString()
  }

  const oldToDate = proto.toDate
  proto.toDate = function (type) {
    if (type === 's' && this.$offset) {
      return dayjs(this.format('YYYY-MM-DD HH:mm:ss:SSS')).toDate()
    }
    return oldToDate.call(this)
  }
  const oldDiff = proto.diff
  proto.diff = function (input, units, float) {
    if (input && this.$u === input.$u) {
      return oldDiff.call(this, input, units, float)
    }
    const localThis = this.local()
    const localInput = dayjs(input).local()
    return oldDiff.call(localThis, localInput, units, float)
  }
} 
