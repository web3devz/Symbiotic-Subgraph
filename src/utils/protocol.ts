import { BigInt, BigDecimal, Bytes } from "@graphprotocol/graph-ts";
import { Protocol } from "../../generated/schema";
import { 
  PROTOCOL_ID, 
  ZERO_BI, 
  ZERO_BD,
  VAULT_FACTORY_ADDRESS,
  DELEGATOR_FACTORY_ADDRESS,
  SLASHER_FACTORY_ADDRESS,
  NETWORK_REGISTRY_ADDRESS,
  OPERATOR_REGISTRY_ADDRESS,
  VAULT_CONFIGURATOR_ADDRESS
} from "./constants";

export function getOrCreateProtocol(timestamp: BigInt): Protocol {
  let protocol = Protocol.load(PROTOCOL_ID);
  
  if (!protocol) {
    protocol = new Protocol(PROTOCOL_ID);
    protocol.vaultFactoryAddress = Bytes.fromHexString(VAULT_FACTORY_ADDRESS);
    protocol.delegatorFactoryAddress = Bytes.fromHexString(DELEGATOR_FACTORY_ADDRESS);
    protocol.slasherFactoryAddress = Bytes.fromHexString(SLASHER_FACTORY_ADDRESS);
    protocol.networkRegistryAddress = Bytes.fromHexString(NETWORK_REGISTRY_ADDRESS);
    protocol.operatorRegistryAddress = Bytes.fromHexString(OPERATOR_REGISTRY_ADDRESS);
    protocol.vaultConfiguratorAddress = Bytes.fromHexString(VAULT_CONFIGURATOR_ADDRESS);
    protocol.totalVaults = ZERO_BI;
    protocol.totalOperators = ZERO_BI;
    protocol.totalNetworks = ZERO_BI;
    protocol.totalTVL = ZERO_BD;
    protocol.createdAt = timestamp;
    protocol.updatedAt = timestamp;
    protocol.save();
  }
  
  return protocol;
}
