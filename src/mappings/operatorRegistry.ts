import { Address, BigInt } from "@graphprotocol/graph-ts";
import { OperatorRegistered } from "../../generated/OperatorRegistry/OperatorRegistry";
import { Protocol, Operator } from "../../generated/schema";
import { getOrCreateProtocol } from "../utils/protocol";
import { ONE_BI, ZERO_BD } from "../utils/constants";

export function handleOperatorRegistered(event: OperatorRegistered): void {
  // Get or create protocol entity
  let protocol = getOrCreateProtocol(event.block.timestamp);

  // Update protocol metrics
  protocol.totalOperators = protocol.totalOperators.plus(ONE_BI);
  protocol.updatedAt = event.block.timestamp;
  protocol.save();

  // Create new operator entity
  const operator = new Operator(event.params.operator.toHexString());
  operator.address = event.params.operator;
  operator.admin = event.params.admin;
  
  // Initialize metrics
  operator.totalStake = ZERO_BD;
  operator.networkCount = BigInt.zero();
  operator.vaultCount = BigInt.zero();
  
  // Timestamps
  operator.createdAt = event.block.timestamp;
  operator.updatedAt = event.block.timestamp;
  operator.createdAtBlock = event.block.number;
  
  operator.save();
}
