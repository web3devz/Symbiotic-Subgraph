import { Address, BigInt, BigDecimal, Bytes } from "@graphprotocol/graph-ts";
import { VaultCreated } from "../../generated/VaultFactory/VaultFactory";
import { Vault as VaultTemplate } from "../../generated/templates";
import {
  Protocol,
  Vault,
  VaultConfiguration,
  DailyProtocolMetric,
} from "../../generated/schema";
import { getOrCreateProtocol } from "../utils/protocol";
import { ONE_BI, ZERO_BD, SECONDS_PER_DAY } from "../utils/constants";

export function handleVaultCreated(event: VaultCreated): void {
  // Get or create protocol entity
  let protocol = getOrCreateProtocol(event.block.timestamp);

  // Update protocol metrics
  protocol.totalVaults = protocol.totalVaults.plus(ONE_BI);
  protocol.updatedAt = event.block.timestamp;
  protocol.save();

  // Create new vault entity
  const vault = new Vault(event.params.vault.toHexString());
  vault.address = event.params.vault;
  vault.creator = event.transaction.from;
  vault.collateralToken = event.params.collateral;
  vault.collateralSymbol = "Unknown"; // Will be updated when we have token info
  vault.collateralDecimals = 18; // Default, will be updated
  vault.delegatorType = getDelegatorType(event.params.delegator);
  vault.slasherType = getSlasherType(event.params.slasher);
  
  // Configuration defaults
  vault.depositWhitelist = false;
  vault.isDepositLimit = false;
  vault.depositLimit = BigInt.zero();
  
  // Hooks and Burners (will be set later if applicable)
  vault.depositHook = null;
  vault.withdrawalHook = null;
  vault.burner = null;
  
  // Initialize metrics
  vault.totalStaked = ZERO_BD;
  vault.totalShares = ZERO_BD;
  vault.userCount = BigInt.zero();
  vault.restakingRatio = ZERO_BD;
  
  // Timestamps
  vault.createdAt = event.block.timestamp;
  vault.updatedAt = event.block.timestamp;
  vault.createdAtBlock = event.block.number;
  
  vault.save();

  // Create vault configuration
  const config = new VaultConfiguration(vault.id + "-config");
  config.vault = vault.id;
  config.admin = event.params.admin;
  config.delegator = event.params.delegator;
  config.slasher = event.params.slasher;
  config.epochDuration = BigInt.fromI32(86400); // Default 1 day
  config.vestingDuration = BigInt.fromI32(604800); // Default 7 days
  config.updatedAt = event.block.timestamp;
  config.updatedAtBlock = event.block.number;
  config.save();

  // Start indexing this vault
  VaultTemplate.create(event.params.vault);

  // Update daily metrics
  updateDailyProtocolMetrics(event.block.timestamp, protocol);
}

function getDelegatorType(delegatorAddress: Address): string {
  // This would be enhanced with actual contract type detection
  // For now, return a default based on known addresses or patterns
  return "Full"; // Default to "Full" restaking
}

function getSlasherType(slasherAddress: Address): string {
  // This would be enhanced with actual contract type detection
  // For now, return a default based on known addresses or patterns
  return "Instant"; // Default to "Instant" slashing
}

function updateDailyProtocolMetrics(timestamp: BigInt, protocol: Protocol): void {
  const dayTimestamp = timestamp.div(SECONDS_PER_DAY).times(SECONDS_PER_DAY);
  const dayId = dayTimestamp.div(SECONDS_PER_DAY).toString();
  
  let dailyMetric = DailyProtocolMetric.load(dayId);
  if (!dailyMetric) {
    dailyMetric = new DailyProtocolMetric(dayId);
    dailyMetric.day = dayTimestamp.div(SECONDS_PER_DAY).toI32();
    dailyMetric.totalTVL = protocol.totalTVL;
    dailyMetric.totalVaults = protocol.totalVaults;
    dailyMetric.totalOperators = protocol.totalOperators;
    dailyMetric.totalNetworks = protocol.totalNetworks;
    dailyMetric.totalUsers = BigInt.zero(); // Will be calculated from other metrics
    dailyMetric.timestamp = dayTimestamp;
  } else {
    dailyMetric.totalTVL = protocol.totalTVL;
    dailyMetric.totalVaults = protocol.totalVaults;
    dailyMetric.totalOperators = protocol.totalOperators;
    dailyMetric.totalNetworks = protocol.totalNetworks;
  }
  
  dailyMetric.save();
}
