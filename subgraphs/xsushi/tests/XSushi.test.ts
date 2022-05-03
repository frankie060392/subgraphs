import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
import { assert, test, clearStore } from 'matchstick-as/assembly/index'
import { ADDRESS_ZERO, XSUSHI } from '../src/constants'
import { onTransfer } from '../src/mappings/xsushi'
import { createTransferEvent } from './mocks'

function cleanup(): void {
  clearStore()
}

test('XSushi count field increase on transactions', () => {
  const alice = Address.fromString('0x00000000000000000000000000000000000a71ce')
  const bob = Address.fromString('0x0000000000000000000000000000000000000b0b')
  const amount = BigInt.fromString('1337')

  // When: the zero-address make a transaction (mint)
  let mintEvent = createTransferEvent(ADDRESS_ZERO, bob, amount)
  mintEvent.transaction.hash = Address.fromString('0x0000000000000000000000000000000000000001') as Bytes
  onTransfer(mintEvent)

  // Then: count fields are increased
  assert.fieldEquals('XSushi', XSUSHI, 'transactionCount', '1')
  assert.fieldEquals('XSushi', XSUSHI, 'userCount', '2')

  // And: supply is increased
  assert.fieldEquals('XSushi', XSUSHI, 'totalSushiSupply', amount.toString())
  assert.fieldEquals('XSushi', XSUSHI, 'totalXsushiSupply', amount.toString())

  // When: the zero-address recieves a transaction (burn)
  let burnEvent = createTransferEvent(bob, ADDRESS_ZERO, BigInt.fromString('337'))
  burnEvent.transaction.hash = Address.fromString('0x0000000000000000000000000000000000000002') as Bytes
  onTransfer(burnEvent)

  // Then: the transaction count increase and userCount remains
  assert.fieldEquals('XSushi', XSUSHI, 'transactionCount', '2')
  assert.fieldEquals('XSushi', XSUSHI, 'userCount', '2')

  // And: the total supply is decreased
  assert.fieldEquals('XSushi', XSUSHI, 'totalSushiSupply', '1000')
  assert.fieldEquals('XSushi', XSUSHI, 'totalXsushiSupply', '1000')


  cleanup()
})

test('xSushiEntered is increased on mint', () => {
  const reciever = Address.fromString('0x0000000000000000000000000000000000000b0b')
  const amount = BigInt.fromString('1337')
  let transferEvent = createTransferEvent(ADDRESS_ZERO, reciever, amount)

  onTransfer(transferEvent)

  assert.fieldEquals('XSushi', XSUSHI, 'sushiEntered', amount.toString())

  cleanup()
})

test('xSushiLeaved is increased on burn', () => {
  const amount = BigInt.fromString('1337')
  const reciever = Address.fromString('0x0000000000000000000000000000000000000b0b')
  let mintEvent = createTransferEvent(ADDRESS_ZERO, reciever, amount)
  let burnEvent = createTransferEvent(reciever, ADDRESS_ZERO, amount)
  burnEvent.transaction.hash = Address.fromString("0xA16081F360e3847006dB660bae1c6d1b2e17eC2B");
  onTransfer(mintEvent)

  onTransfer(burnEvent)

  assert.fieldEquals('XSushi', XSUSHI, 'sushiLeaved', amount.toString())

  cleanup()
})
