import { Address, BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import { 
  Deposit,
  Withdrawal, 
  Slash,
  Claim
} from "../../generated/templates/Vault/Vault";
import { 
  Vault,
  Deposit as DepositEntity,
  Withdrawal as WithdrawalEntity,
  Slash as SlashEntity,
  Claim as ClaimEntity,
  DailyVaultMetric
} from "../../generated/schema";

const ZERO_BD = BigDecimal.fromString("0");
const ONE_BI = BigInt.fromI32(1);
const SECONDS_PER_DAY = BigInt.fromI32(86400);

export function handleDeposit(event: Deposit): void {
  // Create deposit entity
  const depositId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  const deposit = new DepositEntity(depositId);
  deposit.vault = event.address.toHexString();
  deposit.depositor = event.params.depositor;
  deposit.recipient = event.params.recipient;
  deposit.amount = event.params.amount.toBigDecimal();
  deposit.shares = event.params.shares.toBigDecimal();
  deposit.timestamp = event.block.timestamp;
  deposit.blockNumber = event.block.number;
  deposit.transactionHash = event.transaction.hash;
  deposit.save();

  // Update vault metrics
  const vault = Vault.load(event.address.toHexString());
  if (vault) {
    vault.totalStaked = vault.totalStaked.plus(deposit.amount);
    vault.totalShares = vault.totalShares.plus(deposit.shares);
    
    // Update user count (simplified - would need to track unique depositors)
    vault.userCount = vault.userCount.plus(ONE_BI);
    
    vault.updatedAt = event.block.timestamp;
    vault.save();
    
    // Update daily metrics
    updateDailyVaultMetrics(event.address, event.block.timestamp, vault);
  }
}

export function handleWithdrawal(event: Withdrawal): void {
  // Create withdrawal entity
  const withdrawalId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  const withdrawal = new WithdrawalEntity(withdrawalId);
  withdrawal.vault = event.address.toHexString();
  withdrawal.withdrawer = event.params.withdrawer;
  withdrawal.claimer = event.params.claimer;
  withdrawal.epoch = event.params.epoch;
  withdrawal.amount = event.params.amount.toBigDecimal();
  withdrawal.shares = event.params.shares.toBigDecimal();
  withdrawal.timestamp = event.block.timestamp;
  withdrawal.blockNumber = event.block.number;
  withdrawal.transactionHash = event.transaction.hash;
  withdrawal.save();

  // Update vault metrics
  const vault = Vault.load(event.address.toHexString());
  if (vault) {
    vault.totalStaked = vault.totalStaked.minus(withdrawal.amount);
    vault.totalShares = vault.totalShares.minus(withdrawal.shares);
    vault.updatedAt = event.block.timestamp;
    vault.save();
    
    // Update daily metrics
    updateDailyVaultMetrics(event.address, event.block.timestamp, vault);
  }
}

export function handleSlash(event: Slash): void {
  // Create slash entity
  const slashId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  const slash = new SlashEntity(slashId);
  slash.vault = event.address.toHexString();
  slash.slasher = event.params.slasher;
  slash.amount = event.params.amount.toBigDecimal();
  slash.captureTimestamp = event.params.captureTimestamp;
  slash.timestamp = event.block.timestamp;
  slash.blockNumber = event.block.number;
  slash.transactionHash = event.transaction.hash;
  slash.save();

  // Update vault metrics
  const vault = Vault.load(event.address.toHexString());
  if (vault) {
    vault.totalStaked = vault.totalStaked.minus(slash.amount);
    vault.updatedAt = event.block.timestamp;
    vault.save();
    
    // Update daily metrics
    updateDailyVaultMetrics(event.address, event.block.timestamp, vault);
  }
}

export function handleClaim(event: Claim): void {
  // Create claim entity
  const claimId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  const claim = new ClaimEntity(claimId);
  claim.vault = event.address.toHexString();
  claim.claimer = event.params.claimer;
  claim.amount = event.params.amount.toBigDecimal();
  claim.timestamp = event.block.timestamp;
  claim.blockNumber = event.block.number;
  claim.transactionHash = event.transaction.hash;
  claim.save();

  // Update vault metrics if needed
  const vault = Vault.load(event.address.toHexString());
  if (vault) {
    vault.updatedAt = event.block.timestamp;
    vault.save();
  }
}

function updateDailyVaultMetrics(vaultAddress: Address, timestamp: BigInt, vault: Vault): void {
  const dayTimestamp = timestamp.div(SECONDS_PER_DAY).times(SECONDS_PER_DAY);
  const dayId = vaultAddress.toHexString() + "-" + dayTimestamp.div(SECONDS_PER_DAY).toString();
  
  let dailyMetric = DailyVaultMetric.load(dayId);
  if (!dailyMetric) {
    dailyMetric = new DailyVaultMetric(dayId);
    dailyMetric.vault = vault.id;
    dailyMetric.day = dayTimestamp.div(SECONDS_PER_DAY).toI32();
    dailyMetric.depositsCount = BigInt.zero();
    dailyMetric.depositsVolume = ZERO_BD;
    dailyMetric.withdrawalsCount = BigInt.zero();
    dailyMetric.withdrawalsVolume = ZERO_BD;
    dailyMetric.timestamp = dayTimestamp;
  }
  
  dailyMetric.totalStaked = vault.totalStaked;
  dailyMetric.totalShares = vault.totalShares;
  dailyMetric.userCount = vault.userCount;
  dailyMetric.save();
}
