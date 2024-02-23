import { Address, BigInt, log } from "@graphprotocol/graph-ts"

import { Pool } from '../../generated/schema'
import { PoolCreated } from '../../generated/UniswapV3Factory/UniswapV3Factory'
import { Pool as PoolTemplate } from '../../generated/templates'

export function onPoolCreated(event: PoolCreated): void {
  const pool = new Pool(event.params.pool.toHex())
  pool.token0 = event.params.token0
  pool.token1 = event.params.token1
  pool.save()
  PoolTemplate.create(event.params.pool)
}