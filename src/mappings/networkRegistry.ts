import { Address, BigInt } from "@graphprotocol/graph-ts";
import { NetworkRegistered } from "../../generated/NetworkRegistry/NetworkRegistry";
import { Protocol, Network } from "../../generated/schema";
import { getOrCreateProtocol } from "../utils/protocol";
import { ONE_BI, ZERO_BD } from "../utils/constants";

export function handleNetworkRegistered(event: NetworkRegistered): void {
  // Get or create protocol entity
  let protocol = getOrCreateProtocol(event.block.timestamp);

  // Update protocol metrics
  protocol.totalNetworks = protocol.totalNetworks.plus(ONE_BI);
  protocol.updatedAt = event.block.timestamp;
  protocol.save();

  // Create new network entity
  const network = new Network(event.params.network.toHexString());
  network.address = event.params.network;
  network.admin = event.params.admin;
  network.middleware = null; // Will be set later if applicable
  
  // Default configuration
  network.epochDuration = BigInt.fromI32(86400); // 1 day default
  network.slashingWindow = BigInt.fromI32(604800); // 7 days default
  
  // Initialize metrics
  network.totalStake = ZERO_BD;
  network.operatorCount = BigInt.zero();
  network.vaultCount = BigInt.zero();
  
  // Timestamps
  network.createdAt = event.block.timestamp;
  network.updatedAt = event.block.timestamp;
  network.createdAtBlock = event.block.number;
  
  network.save();
}
