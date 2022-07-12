import BigNumber from 'bignumber.js'

export const mul = function (...args) {
  try {
    let first = new BigNumber(args[0] || 0)
    for (let i = 1; i < args.length; i++) {
      first = first.multipliedBy(args[i] || 0)
    }
    return first.toNumber()
  } catch (e) {
    console.log(e)
    return 0
  }
}
