import moment from 'moment'

const momentFunction = {
    FormatDate,
    DateIntoUnix,
    FormatDateTime,
    DateNowIntoUnix,
    FormatFullDateTime,
    UnixSecondsIntoDate,
    UnixMiliSecondsIntoDate,
}

function DateIntoUnix(date) {
    return moment(date).unix()
}

function DateNowIntoUnix() {
    const date = Date.now()
    return moment(date).unix()
}

function UnixSecondsIntoDate(unix) {
    return moment.unix(unix * 1000)._d
}

function UnixMiliSecondsIntoDate(unix) {
    return moment.unix(unix)._d
}

function FormatDate(date) {
    return moment(date).format('YYYY-MM-DD')
}

function FormatDateTime(date) {
    return moment(date).format('YYYY-MM-DD HH:MM')
}

function FormatFullDateTime(date) {
    return moment(date).format('dddd, YYYY-MM-DD')
}

export default momentFunction