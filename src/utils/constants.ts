import { BigInt, BigDecimal, Address, Int8 } from "@graphprotocol/graph-ts";

// Constants
export const ZERO_BI = BigInt.fromI32(0);
export const ONE_BI = BigInt.fromI32(1);
export const ZERO_BD = BigDecimal.fromString("0");
export const ONE_BD = BigDecimal.fromString("1");
export const PROTOCOL_ID = "symbiotic";
export const SECONDS_PER_DAY = BigInt.fromI32(86400);

// Known contract addresses
export const VAULT_FACTORY_ADDRESS = "0xAEb6bdd95c502390db8f52c8909F703E9Af6a346";
export const DELEGATOR_FACTORY_ADDRESS = "0x985Ed57AF9D475f1d83c1c1c8826A0E5A34E8C7B";
export const SLASHER_FACTORY_ADDRESS = "0x685c2eD7D59814d2a597409058Ee7a92F21e48Fd";
export const NETWORK_REGISTRY_ADDRESS = "0xC773b1011461e7314CF05f97d95aa8e92C1Fd8aA";
export const OPERATOR_REGISTRY_ADDRESS = "0xAd817a6Bc954F678451A71363f04150FDD81Af9F";
export const VAULT_CONFIGURATOR_ADDRESS = "0x29300b1d3150B4E2b12fE80BE72f365E200441EC";

// Helper functions
export function exponentToBigDecimal(decimals: Int8): BigDecimal {
  let bd = BigDecimal.fromString("1");
  for (let i = 0; i < decimals; i++) {
    bd = bd.times(BigDecimal.fromString("10"));
  }
  return bd;
}

export function convertTokenToDecimal(tokenAmount: BigInt, exchangeDecimals: Int8): BigDecimal {
  if (exchangeDecimals == 0) {
    return tokenAmount.toBigDecimal();
  }
  return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals));
}

export function getDayTimestamp(timestamp: BigInt): BigInt {
  return timestamp.div(SECONDS_PER_DAY).times(SECONDS_PER_DAY);
}

export function getDayId(timestamp: BigInt): string {
  return timestamp.div(SECONDS_PER_DAY).toString();
}
