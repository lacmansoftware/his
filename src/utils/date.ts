export const dateCompare = (date1, date2) => {
  if (!date1 || !date2) {
    return false
  }
  const d1 = Date.parse(date1)
  const d2 = Date.parse(date2)
  if (d1 > d2) {
    return 1
  } else if (d1 === d2) {
    return 0
  } else {
    return -1
  }
}
