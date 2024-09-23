/* eslint-disable @typescript-eslint/no-namespace */
import { CosmosBaseV1Beta1Coin, CosmosStakingV1Beta1Tx } from '../../../../core-proto-ts';
import { convertToSnakeCase } from '../../../../utils';
import { MsgBase } from '../../MsgBase';

export declare namespace MsgUndelegate {
  export interface Params {
    amount: {
      denom: string;
      amount: string;
    };
    validatorAddress: string;
    injectiveAddress: string;
  }

  export type Proto = CosmosStakingV1Beta1Tx.MsgUndelegate;
}

/**
 * @category Messages
 */
export default class MsgUndelegate extends MsgBase<MsgUndelegate.Params, MsgUndelegate.Proto> {
  static fromJSON(params: MsgUndelegate.Params): MsgUndelegate {
    return new MsgUndelegate(params);
  }

  public toProto() {
    const { params } = this;

    const coinAmount = CosmosBaseV1Beta1Coin.Coin.fromPartial({});
    coinAmount.denom = params.amount.denom;
    coinAmount.amount = params.amount.amount;

    const message = CosmosStakingV1Beta1Tx.MsgUndelegate.fromPartial({});
    message.amount = coinAmount;
    message.delegatorAddress = params.injectiveAddress;
    message.validatorAddress = params.validatorAddress;

    return CosmosStakingV1Beta1Tx.MsgUndelegate.fromPartial(message);
  }

  public toData() {
    const proto = this.toProto();

    return {
      '@type': '/cosmos.staking.v1beta1.MsgUndelegate',
      ...proto,
    };
  }

  public toAmino() {
    const proto = this.toProto();
    const message = {
      ...convertToSnakeCase(proto),
    };

    return {
      type: 'cosmos-sdk/MsgUndelegate',
      value: message,
    };
  }

  public toWeb3() {
    const amino = this.toAmino();
    const { value } = amino;

    return {
      '@type': '/cosmos.staking.v1beta1.MsgUndelegate',
      ...value,
    };
  }

  public toDirectSign() {
    const proto = this.toProto();

    return {
      type: '/cosmos.staking.v1beta1.MsgUndelegate',
      message: proto,
    };
  }

  public toBinary(): Uint8Array {
    return CosmosStakingV1Beta1Tx.MsgUndelegate.encode(this.toProto()).finish();
  }
}
