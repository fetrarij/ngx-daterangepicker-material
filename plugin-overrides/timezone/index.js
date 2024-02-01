/*
  This is a copy of timezone plugin from dayjs v.1.11.10 with a bug fix merged: https://github.com/iamkun/dayjs/pull/2264
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

const typeToPos = {
  year: 0,
  month: 1,
  day: 2,
  hour: 3,
  minute: 4,
  second: 5
}

// Cache time-zone lookups from Intl.DateTimeFormat,
// as it is a *very* slow method.
const dtfCache = {}
const getDateTimeFormat = (timezone, options = {}) => {
  const timeZoneName = options.timeZoneName || 'short'
  const key = `${timezone}|${timeZoneName}`
  let dtf = dtfCache[key]
  if (!dtf) {
    dtf = new Intl.DateTimeFormat('en-US', {
      hour12: false,
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName
    })
    dtfCache[key] = dtf
  }
  return dtf
}

export default (o, c, d) => {
  let defaultTimezone

  const makeFormatParts = (timestamp, timezone, options = {}) => {
    const date = new Date(timestamp)
    const dtf = getDateTimeFormat(timezone, options)
    return dtf.formatToParts(date)
  }

  const tzOffset = (timestamp, timezone) => {
    const formatResult = makeFormatParts(timestamp, timezone)
    const filled = []
    for (let i = 0; i < formatResult.length; i += 1) {
      const { type, value } = formatResult[i]
      const pos = typeToPos[type]

      if (pos >= 0) {
        filled[pos] = parseInt(value, 10)
      }
    }
    const hour = filled[3]
    // Workaround for the same behavior in different node version
    // https://github.com/nodejs/node/issues/33027
    /* istanbul ignore next */
    const fixedHour = hour === 24 ? 0 : hour
    const utcString = `${filled[0]}-${filled[1]}-${filled[2]} ${fixedHour}:${filled[4]}:${filled[5]}:000`
    const utcTs = d.utc(utcString).valueOf()
    let asTS = +timestamp
    const over = asTS % 1000
    asTS -= over
    return (utcTs - asTS) / (60 * 1000)
  }

  // find the right offset a given local time. The o input is our guess, which determines which
  // offset we'll pick in ambiguous cases (e.g. there are two 3 AMs b/c Fallback DST)
  // https://github.com/moment/luxon/blob/master/src/datetime.js#L76
  const fixOffset = (localTS, o0, tz) => {
    // Our UTC time is just a guess because our offset is just a guess
    let utcGuess = localTS - (o0 * 60 * 1000)
    // Test whether the zone matches the offset for this ts
    const o2 = tzOffset(utcGuess, tz)
    // If so, offset didn't change and we're done
    if (o0 === o2) {
      return [utcGuess, o0]
    }
    // If not, change the ts by the difference in the offset
    utcGuess -= (o2 - o0) * 60 * 1000
    // If that gives us the local time we want, we're done
    const o3 = tzOffset(utcGuess, tz)
    if (o2 === o3) {
      return [utcGuess, o2]
    }
    // If it's different, we're in a hole time.
    // The offset has changed, but the we don't adjust the time
    return [localTS - (Math.min(o2, o3) * 60 * 1000), Math.max(o2, o3)]
  }

  const proto = c.prototype

  proto.tz = function (timezone = defaultTimezone, keepLocalTime) {
    const oldOffset = this.utcOffset()
    const date = this.toDate()
    const target = date.toLocaleString('en-US', { timeZone: timezone })
    const diff = Math.round((date - new Date(target)) / 1000 / 60)
    let ins = d(target, { locale: this.$L }).$set(MS, this.$ms)
      .utcOffset((-Math.round(date.getTimezoneOffset() / 15) * 15) - diff, true, timezone !== 'UTC')
    if (keepLocalTime) {
      const newOffset = ins.utcOffset()
      ins = ins.add(oldOffset - newOffset, MIN)
    }
    ins.$x.$timezone = timezone
    return ins
  }

  proto.offsetName = function (type) {
    // type: short(default) / long
    const zone = this.$x.$timezone || d.tz.guess()
    const result = makeFormatParts(this.valueOf(), zone, { timeZoneName: type }).find(m => m.type.toLowerCase() === 'timezonename')
    return result && result.value
  }

  const oldStartOf = proto.startOf
  proto.startOf = function (units, startOf) {
    if (!this.$x || !this.$x.$timezone) {
      return oldStartOf.call(this, units, startOf)
    }

    const withoutTz = d(this.format('YYYY-MM-DD HH:mm:ss:SSS'), { locale: this.$L })
    const startOfWithoutTz = oldStartOf.call(withoutTz, units, startOf)
    return startOfWithoutTz.tz(this.$x.$timezone, true)
  }

  d.tz = function (input, arg1, arg2) {
    const parseFormat = arg2 && arg1
    const timezone = arg2 || arg1 || defaultTimezone
    const previousOffset = tzOffset(+d(), timezone)
    if (typeof input !== 'string') {
      // timestamp number || js Date || Day.js
      return d(input).tz(timezone)
    }
    const localTs = d.utc(input, parseFormat).valueOf()
    const [targetTs, targetOffset] = fixOffset(localTs, previousOffset, timezone)
    const ins = d(targetTs).utcOffset(targetOffset, false, timezone !== 'UTC')
    ins.$x.$timezone = timezone
    return ins
  }

  d.tz.guess = function () {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  }

  d.tz.setDefault = function (timezone) {
    defaultTimezone = timezone
  }
}