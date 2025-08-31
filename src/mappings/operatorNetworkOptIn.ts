import { Address, BigInt } from "@graphprotocol/graph-ts";
import { OptIn } from "../../generated/OperatorNetworkOptInService/OperatorNetworkOptInService";
import { OperatorNetworkOptIn, Operator, Network } from "../../generated/schema";

export function handleOperatorNetworkOptIn(event: OptIn): void {
  const optInId = event.params.operator.toHexString() + "-" + event.params.network.toHexString();
  
  let optIn = OperatorNetworkOptIn.load(optInId);
  if (!optIn) {
    optIn = new OperatorNetworkOptIn(optInId);
    optIn.operator = event.params.operator.toHexString();
    optIn.network = event.params.network.toHexString();
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
      operator.networkCount = operator.networkCount.plus(BigInt.fromI32(1));
    } else {
      operator.networkCount = operator.networkCount.minus(BigInt.fromI32(1));
    }
    operator.updatedAt = event.block.timestamp;
    operator.save();
  }

  // Update network metrics
  let network = Network.load(event.params.network.toHexString());
  if (network) {
    if (event.params.isOptedIn) {
      network.operatorCount = network.operatorCount.plus(BigInt.fromI32(1));
    } else {
      network.operatorCount = network.operatorCount.minus(BigInt.fromI32(1));
    }
    network.updatedAt = event.block.timestamp;
    network.save();
  }
}
