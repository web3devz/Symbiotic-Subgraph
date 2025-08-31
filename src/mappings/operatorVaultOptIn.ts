import { Address, BigInt } from "@graphprotocol/graph-ts";
import { OptIn } from "../../generated/OperatorVaultOptInService/OperatorVaultOptInService";
import { VaultOperatorOptIn, Operator, Vault } from "../../generated/schema";

export function handleOperatorVaultOptIn(event: OptIn): void {
  const optInId = event.params.vault.toHexString() + "-" + event.params.operator.toHexString();
  
  let optIn = VaultOperatorOptIn.load(optInId);
  if (!optIn) {
    optIn = new VaultOperatorOptIn(optInId);
    optIn.vault = event.params.vault.toHexString();
    optIn.operator = event.params.operator.toHexString();
    optIn.createdAt = event.block.timestamp;
    optIn.createdAtBlock = event.block.number;
  }

  optIn.isOptedIn = event.params.isOptedIn;
  optIn.updatedAt = event.block.timestamp;
  optIn.updatedAtBlock = event.block.number;
  optIn.save();

  // Update operator metrics
  let operator = Operator.load(event.params.operator.toHexString());
  if (operator) {
    if (event.params.isOptedIn) {
      operator.vaultCount = operator.vaultCount.plus(BigInt.fromI32(1));
    } else {
      operator.vaultCount = operator.vaultCount.minus(BigInt.fromI32(1));
    }
    operator.updatedAt = event.block.timestamp;
    operator.save();
  }
}
