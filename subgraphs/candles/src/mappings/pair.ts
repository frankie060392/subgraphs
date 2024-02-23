import { BigInt, Bytes } from '@graphprotocol/graph-ts'
import { CandleV3, Pool } from '../../generated/schema'
import { Swap as SwapV3 } from '../../generated/templates/Pool/UniswapV3Pool'

import { concat } from '@graphprotocol/graph-ts/helper-functions'

export function onSwapV3(event: SwapV3): void {
  let token0Amount: BigInt = event.params.amount0.abs()

  let token1Amount: BigInt = event.params.amount1.abs()

  if (token0Amount.isZero() || token1Amount.isZero()) {
    return
  }

  let pool = Pool.load(event.address.toHex()) as Pool
  let price = token0Amount.divDecimal(token1Amount.toBigDecimal())
  let price1 = token1Amount.divDecimal(token0Amount.toBigDecimal())
  let tokens = concat(pool.token0, pool.token1)
  let timestamp = event.block.timestamp.toI32()

  let periods: i32[] = [5 * 60, 15 * 60, 60 * 60, 4 * 60 * 60, 24 * 60 * 60, 7 * 24 * 60 * 60]
  for (let i = 0; i < periods.length; i++) {
    let time_id = timestamp / periods[i]
    let candle_id = concat(concat(Bytes.fromI32(time_id), Bytes.fromI32(periods[i])), tokens).toHex()
    let candle = CandleV3.load(candle_id)
    if (candle === null) {
      candle = new CandleV3(candle_id)
      candle.time = timestamp
      candle.timeId = time_id
      candle.period = periods[i]
      candle.token0 = pool.token0
      candle.token1 = pool.token1
      candle.pool = event.address
      candle.open0 = price
      candle.low0 = price
      candle.high0 = price
      candle.open1 = price1
      candle.low1 = price1
      candle.high1 = price1
      candle.token0TotalAmount = BigInt.fromI32(0)
      candle.token1TotalAmount = BigInt.fromI32(0)
    } else {
      if (price < candle.low0) {
        candle.low0 = price
      }
      if (price > candle.high0) {
        candle.high0 = price
      }
      if (price1 < candle.low1) {
        candle.low1 = price1
      }
      if (price1 > candle.high1) {
        candle.high1 = price1
      }
    }

    candle.close0 = price
    candle.close1 = price1

    candle.lastBlock = event.block.number.toI32()

    candle.token0TotalAmount = candle.token0TotalAmount.plus(token0Amount)

    candle.token1TotalAmount = candle.token1TotalAmount.plus(token1Amount)

    candle.save()
  }
}
