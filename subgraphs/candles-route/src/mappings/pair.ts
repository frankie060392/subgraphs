import { Address, BigDecimal, BigInt, Bytes, log } from '@graphprotocol/graph-ts'
import { CandleV3, Pool, SwapTxn } from '../../generated/schema'
import { Swap as SwapV3 } from '../../generated/templates/Pool/UniswapV3Pool'
import { ERC20 } from '../../generated/UniswapV3Factory/ERC20'
import { Route } from '../../generated/RouteProcessor3_2/RouteProcessor3_2'

import { concat } from '@graphprotocol/graph-ts/helper-functions'

export function onSwapV3(event: SwapV3): void {
  let token0Amount: BigInt = event.params.amount0.abs()

  let token1Amount: BigInt = event.params.amount1.abs()

  if (token0Amount.isZero() || token1Amount.isZero()) {
    return
  }

  log.debug(`TIME_STAMPPP: ${Date.UTC(2024, 2, 1).toString()}`, [])
  log.debug(`DATEEE: ${new Date(1709020127000).toString()}`, [])


  let pool = Pool.load(event.address.toHex()) as Pool

  let decimals0 = fetchTokenDecimals(Address.fromString(pool.token0.toHex()))
  let decimals1 = fetchTokenDecimals(Address.fromString(pool.token1.toHex()))

  let amount0 = convertTokenToDecimal(token0Amount, decimals0)
  let amount1 = convertTokenToDecimal(token1Amount, decimals1)

  log.debug(`AMOUNT0: ${amount0}`, [])
  log.debug(`AMOUNT1: ${amount1}`, [])

  let price = token0Amount.divDecimal(token1Amount.toBigDecimal())
  let price1 = token1Amount.divDecimal(token0Amount.toBigDecimal())
  let tokens = concat(pool.token0, pool.token1)
  let timestamp = event.block.timestamp.toI32()

  let transactionId = concat(event.transaction.hash, tokens).toHex()

  let isNewTxn = false

  let txn = SwapTxn.load(transactionId)
  if (txn === null) isNewTxn = true

  let transaction = new SwapTxn(transactionId)

  transaction.token0 = pool.token0
  transaction.token1 = pool.token1
  transaction.amount0 = amount0
  transaction.amount1 = amount1
  transaction.origin = event.transaction.hash
  transaction.recipient = event.params.recipient
  transaction.timestamp = timestamp

  transaction.save()

  let periods: i32[] = [1 * 60, 5 * 60, 15 * 60, 30 * 60, 60 * 60, 4 * 60 * 60, 24 * 60 * 60, 7 * 24 * 60 * 60]
  for (let i = 0; i < periods.length; i++) {
    let time_id = timestamp / periods[i]
    let candle_id = concat(concat(Bytes.fromI32(time_id), Bytes.fromI32(periods[i])), tokens).toHex()
    let candle = CandleV3.load(candle_id)
    if (candle === null) {
      candle = new CandleV3(candle_id)
      candle.time = time_id * periods[i]
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
      candle.isRoute = false
      candle.token0TotalAmount = BigDecimal.fromString('0')
      candle.token1TotalAmount = BigDecimal.fromString('0')
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
    
    if (isNewTxn) {
      candle.token0TotalAmount = candle.token0TotalAmount.plus(amount0)
      candle.token1TotalAmount = candle.token1TotalAmount.plus(amount1)
    }

    candle.save()
  }
}

export function onRouteSwap(event: Route): void {

  let zeroForOne = event.params.tokenIn.toHex() < event.params.tokenOut.toHex();

  let token0 = zeroForOne ? event.params.tokenIn : event.params.tokenOut

  let token1 = zeroForOne ? event.params.tokenOut : event.params.tokenIn

  let decimals0 = fetchTokenDecimals(token0)

  let decimals1 = fetchTokenDecimals(token1)

  let token0Amount: BigInt = zeroForOne ? event.params.amountIn.abs() : event.params.amountOut.abs()

  let amount0 = convertTokenToDecimal(token0Amount, decimals0)

  let token1Amount: BigInt = zeroForOne ? event.params.amountOut.abs() : event.params.amountIn.abs()

  let amount1 = convertTokenToDecimal(token1Amount, decimals1)

  if (token0Amount.isZero() || token1Amount.isZero()) {
    return
  }

  let price = token0Amount.divDecimal(token1Amount.toBigDecimal())
  let price1 = token1Amount.divDecimal(token0Amount.toBigDecimal())
  let tokens = concat(token0, token1)
  let timestamp = event.block.timestamp.toI32()

  
  let transactionId = concat(event.transaction.hash, tokens).toHex()

  let isNewTxn = false

  let txn = SwapTxn.load(transactionId)
  if (txn === null) isNewTxn = true

  let transaction = new SwapTxn(transactionId)

  transaction.token0 = token0
  transaction.token1 = token1
  transaction.amount0 = zeroForOne ? amount0 : amount0.times(BigDecimal.fromString('-1'))
  transaction.amount1 = zeroForOne ? amount1.times(BigDecimal.fromString('-1')) : amount1
  transaction.origin = event.transaction.hash
  transaction.recipient = event.params.to
  transaction.timestamp = timestamp

  transaction.save()


  let periods: i32[] = [1 * 60, 5 * 60, 15 * 60, 30 * 60, 60 * 60, 4 * 60 * 60, 24 * 60 * 60, 7 * 24 * 60 * 60]
  for (let i = 0; i < periods.length; i++) {
    let time_id = timestamp / periods[i]
    let candle_id = concat(concat(Bytes.fromI32(time_id), Bytes.fromI32(periods[i])), tokens).toHex()
    let candle = CandleV3.load(candle_id)
    if (candle === null) {
      candle = new CandleV3(candle_id)
      candle.time = time_id * periods[i]
      candle.timeId = time_id
      candle.period = periods[i]
      candle.token0 = token0
      candle.token1 = token1
      candle.pool = event.address
      candle.open0 = price
      candle.low0 = price
      candle.high0 = price
      candle.open1 = price1
      candle.low1 = price1
      candle.high1 = price1
      candle.isRoute = true
      candle.token0TotalAmount = BigDecimal.fromString('0')
      candle.token1TotalAmount = BigDecimal.fromString('0')
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

    if (isNewTxn) {
      candle.token0TotalAmount = candle.token0TotalAmount.plus(amount0)
      candle.token1TotalAmount = candle.token1TotalAmount.plus(amount1)
    }
    
    candle.save()
  }
}

export function fetchTokenDecimals(tokenAddress: Address): BigInt {
  let contract = ERC20.bind(tokenAddress)
  // try types uint8 for decimals
  let decimalValue = BigInt.fromString('18').toI32()
  let decimalResult = contract.try_decimals()
  if (!decimalResult.reverted) {
    decimalValue = decimalResult.value
  }

  return BigInt.fromI32(decimalValue)
}

export function convertTokenToDecimal(tokenAmount: BigInt, exchangeDecimals: BigInt): BigDecimal {
  return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals))
}

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString('1')
  for (let i = BigInt.fromI32(0); i.lt(decimals as BigInt); i = i.plus(BigInt.fromI32(1))) {
    bd = bd.times(BigDecimal.fromString('10'))
  }

  return bd
}
