// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { Pubkey } from '@cosmjs/amino';
import { Decimal } from '@cosmjs/math';
import { decodePubkey, encodePubkey } from '@cosmjs/proto-signing';
import { Any, AnyAmino, AnyProtoMsg, AnySDKType } from 'cosmjs-types/google/protobuf/any';
import { Duration, DurationAmino, DurationSDKType } from 'cosmjs-types/google/protobuf/duration';
import { Timestamp } from 'cosmjs-types/google/protobuf/timestamp';

import { BinaryReader, BinaryWriter } from '../../binary';
import { Coin, CoinAmino, CoinSDKType, DecCoin, DecCoinAmino, DecCoinSDKType } from '../../coin';
import { fromTimestamp, toTimestamp } from '../../helpers';
/** BondStatus is the status of a validator. */
export enum BondStatus {
  /** BOND_STATUS_UNSPECIFIED - UNSPECIFIED defines an invalid validator status. */
  BOND_STATUS_UNSPECIFIED = 0,
  /** BOND_STATUS_UNBONDED - UNBONDED defines a validator that is not bonded. */
  BOND_STATUS_UNBONDED = 1,
  /** BOND_STATUS_UNBONDING - UNBONDING defines a validator that is unbonding. */
  BOND_STATUS_UNBONDING = 2,
  /** BOND_STATUS_BONDED - BONDED defines a validator that is bonded. */
  BOND_STATUS_BONDED = 3,
  UNRECOGNIZED = -1,
}
export const BondStatusSDKType = BondStatus;
export const BondStatusAmino = BondStatus;
export function bondStatusFromJSON(object: any): BondStatus {
  switch (object) {
    case 0:
    case 'BOND_STATUS_UNSPECIFIED':
      return BondStatus.BOND_STATUS_UNSPECIFIED;
    case 1:
    case 'BOND_STATUS_UNBONDED':
      return BondStatus.BOND_STATUS_UNBONDED;
    case 2:
    case 'BOND_STATUS_UNBONDING':
      return BondStatus.BOND_STATUS_UNBONDING;
    case 3:
    case 'BOND_STATUS_BONDED':
      return BondStatus.BOND_STATUS_BONDED;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return BondStatus.UNRECOGNIZED;
  }
}
export function bondStatusToJSON(object: BondStatus): string {
  switch (object) {
    case BondStatus.BOND_STATUS_UNSPECIFIED:
      return 'BOND_STATUS_UNSPECIFIED';
    case BondStatus.BOND_STATUS_UNBONDED:
      return 'BOND_STATUS_UNBONDED';
    case BondStatus.BOND_STATUS_UNBONDING:
      return 'BOND_STATUS_UNBONDING';
    case BondStatus.BOND_STATUS_BONDED:
      return 'BOND_STATUS_BONDED';
    case BondStatus.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED';
  }
}
/** Infraction indicates the infraction a validator committed. */
export enum Infraction {
  /** INFRACTION_UNSPECIFIED - UNSPECIFIED defines an empty infraction. */
  INFRACTION_UNSPECIFIED = 0,
  /** INFRACTION_DOUBLE_SIGN - DOUBLE_SIGN defines a validator that double-signs a block. */
  INFRACTION_DOUBLE_SIGN = 1,
  /** INFRACTION_DOWNTIME - DOWNTIME defines a validator that missed signing too many blocks. */
  INFRACTION_DOWNTIME = 2,
  UNRECOGNIZED = -1,
}
export const InfractionSDKType = Infraction;
export const InfractionAmino = Infraction;
export function infractionFromJSON(object: any): Infraction {
  switch (object) {
    case 0:
    case 'INFRACTION_UNSPECIFIED':
      return Infraction.INFRACTION_UNSPECIFIED;
    case 1:
    case 'INFRACTION_DOUBLE_SIGN':
      return Infraction.INFRACTION_DOUBLE_SIGN;
    case 2:
    case 'INFRACTION_DOWNTIME':
      return Infraction.INFRACTION_DOWNTIME;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return Infraction.UNRECOGNIZED;
  }
}
export function infractionToJSON(object: Infraction): string {
  switch (object) {
    case Infraction.INFRACTION_UNSPECIFIED:
      return 'INFRACTION_UNSPECIFIED';
    case Infraction.INFRACTION_DOUBLE_SIGN:
      return 'INFRACTION_DOUBLE_SIGN';
    case Infraction.INFRACTION_DOWNTIME:
      return 'INFRACTION_DOWNTIME';
    case Infraction.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED';
  }
}
/**
 * CommissionRates defines the initial commission rates to be used for creating
 * a validator.
 */
export interface CommissionRates {
  /** rate is the commission rate charged to delegators, as a fraction. */
  rate: string;
  /** max_rate defines the maximum commission rate which validator can ever charge, as a fraction. */
  maxRate: string;
  /** max_change_rate defines the maximum daily increase of the validator commission, as a fraction. */
  maxChangeRate: string;
}
export interface CommissionRatesProtoMsg {
  typeUrl: '/initia.mstaking.v1.CommissionRates';
  value: Uint8Array;
}
/**
 * CommissionRates defines the initial commission rates to be used for creating
 * a validator.
 */
export interface CommissionRatesAmino {
  /** rate is the commission rate charged to delegators, as a fraction. */
  rate?: string;
  /** max_rate defines the maximum commission rate which validator can ever charge, as a fraction. */
  max_rate?: string;
  /** max_change_rate defines the maximum daily increase of the validator commission, as a fraction. */
  max_change_rate?: string;
}
export interface CommissionRatesAminoMsg {
  type: '/initia.mstaking.v1.CommissionRates';
  value: CommissionRatesAmino;
}
/**
 * CommissionRates defines the initial commission rates to be used for creating
 * a validator.
 */
export interface CommissionRatesSDKType {
  rate: string;
  max_rate: string;
  max_change_rate: string;
}
/** Commission defines commission parameters for a given validator. */
export interface Commission {
  /** commission_rates defines the initial commission rates to be used for creating a validator. */
  commissionRates: CommissionRates;
  /** update_time is the last time the commission rate was changed. */
  updateTime: Date;
}
export interface CommissionProtoMsg {
  typeUrl: '/initia.mstaking.v1.Commission';
  value: Uint8Array;
}
/** Commission defines commission parameters for a given validator. */
export interface CommissionAmino {
  /** commission_rates defines the initial commission rates to be used for creating a validator. */
  commission_rates?: CommissionRatesAmino;
  /** update_time is the last time the commission rate was changed. */
  update_time?: string;
}
export interface CommissionAminoMsg {
  type: '/initia.mstaking.v1.Commission';
  value: CommissionAmino;
}
/** Commission defines commission parameters for a given validator. */
export interface CommissionSDKType {
  commission_rates: CommissionRatesSDKType;
  update_time: Date;
}
/** Description defines a validator description. */
export interface Description {
  /** moniker defines a human-readable name for the validator. */
  moniker: string;
  /** identity defines an optional identity signature (ex. UPort or Keybase). */
  identity: string;
  /** website defines an optional website link. */
  website: string;
  /** security_contact defines an optional email for security contact. */
  securityContact: string;
  /** details define other optional details. */
  details: string;
}
export interface DescriptionProtoMsg {
  typeUrl: '/initia.mstaking.v1.Description';
  value: Uint8Array;
}
/** Description defines a validator description. */
export interface DescriptionAmino {
  /** moniker defines a human-readable name for the validator. */
  moniker?: string;
  /** identity defines an optional identity signature (ex. UPort or Keybase). */
  identity?: string;
  /** website defines an optional website link. */
  website?: string;
  /** security_contact defines an optional email for security contact. */
  security_contact?: string;
  /** details define other optional details. */
  details?: string;
}
export interface DescriptionAminoMsg {
  type: '/initia.mstaking.v1.Description';
  value: DescriptionAmino;
}
/** Description defines a validator description. */
export interface DescriptionSDKType {
  moniker: string;
  identity: string;
  website: string;
  security_contact: string;
  details: string;
}
/**
 * Validator defines a validator, together with the total amount of the
 * Validator's bond shares and their exchange rate to coins. Slashing results in
 * a decrease in the exchange rate, allowing correct calculation of future
 * undelegations without iterating over delegators. When coins are delegated to
 * this validator, the validator is credited with a delegation whose number of
 * bond shares is based on the amount of coins delegated divided by the current
 * exchange rate. Voting power can be calculated as total bonded shares
 * multiplied by exchange rate.
 */
export interface Validator {
  /** operator_address defines the address of the validator's operator; bech encoded in JSON. */
  operatorAddress: string;
  /** consensus_pubkey is the consensus public key of the validator, as a Protobuf Any. */
  consensusPubkey?: Any | undefined;
  /** jailed defined whether the validator has been jailed from bonded status or not. */
  jailed: boolean;
  /** status is the validator status (bonded/unbonding/unbonded). */
  status: BondStatus;
  /** tokens define the delegated tokens (incl. self-delegation). */
  tokens: Coin[];
  /** delegator_shares defines total shares issued to a validator's delegators. */
  delegatorShares: DecCoin[];
  /** description defines the description terms for the validator. */
  description: Description;
  /** unbonding_height defines, if unbonding, the height at which this validator has begun unbonding. */
  unbondingHeight: bigint;
  /** unbonding_time defines, if unbonding, the min time for the validator to complete unbonding. */
  unbondingTime: Date;
  /** commission defines the commission parameters. */
  commission: Commission;
  /** voting_powers defines the voting powers for each bond denoms */
  votingPowers: Coin[];
  /** voting_power defines the sum of voting powers */
  votingPower: string;
  /** strictly positive if this validator's unbonding has been stopped by external modules */
  unbondingOnHoldRefCount: bigint;
  /** unbonding id, uniquely identifing an unbonding of this validator */
  unbondingId: bigint;
}
export interface ValidatorProtoMsg {
  typeUrl: '/initia.mstaking.v1.Validator';
  value: Uint8Array;
}
export type ValidatorEncoded = Omit<Validator, 'consensusPubkey'> & {
  /** consensus_pubkey is the consensus public key of the validator, as a Protobuf Any. */ consensusPubkey?:
    | AnyProtoMsg
    | undefined;
};
/**
 * Validator defines a validator, together with the total amount of the
 * Validator's bond shares and their exchange rate to coins. Slashing results in
 * a decrease in the exchange rate, allowing correct calculation of future
 * undelegations without iterating over delegators. When coins are delegated to
 * this validator, the validator is credited with a delegation whose number of
 * bond shares is based on the amount of coins delegated divided by the current
 * exchange rate. Voting power can be calculated as total bonded shares
 * multiplied by exchange rate.
 */
export interface ValidatorAmino {
  /** operator_address defines the address of the validator's operator; bech encoded in JSON. */
  operator_address?: string;
  /** consensus_pubkey is the consensus public key of the validator, as a Protobuf Any. */
  consensus_pubkey?: AnyAmino;
  /** jailed defined whether the validator has been jailed from bonded status or not. */
  jailed?: boolean;
  /** status is the validator status (bonded/unbonding/unbonded). */
  status?: BondStatus;
  /** tokens define the delegated tokens (incl. self-delegation). */
  tokens?: CoinAmino[];
  /** delegator_shares defines total shares issued to a validator's delegators. */
  delegator_shares?: DecCoinAmino[];
  /** description defines the description terms for the validator. */
  description?: DescriptionAmino;
  /** unbonding_height defines, if unbonding, the height at which this validator has begun unbonding. */
  unbonding_height?: string;
  /** unbonding_time defines, if unbonding, the min time for the validator to complete unbonding. */
  unbonding_time?: string;
  /** commission defines the commission parameters. */
  commission?: CommissionAmino;
  /** voting_powers defines the voting powers for each bond denoms */
  voting_powers?: CoinAmino[];
  /** voting_power defines the sum of voting powers */
  voting_power?: string;
  /** strictly positive if this validator's unbonding has been stopped by external modules */
  unbonding_on_hold_ref_count?: string;
  /** unbonding id, uniquely identifing an unbonding of this validator */
  unbonding_id?: string;
}
export interface ValidatorAminoMsg {
  type: '/initia.mstaking.v1.Validator';
  value: ValidatorAmino;
}
/**
 * Validator defines a validator, together with the total amount of the
 * Validator's bond shares and their exchange rate to coins. Slashing results in
 * a decrease in the exchange rate, allowing correct calculation of future
 * undelegations without iterating over delegators. When coins are delegated to
 * this validator, the validator is credited with a delegation whose number of
 * bond shares is based on the amount of coins delegated divided by the current
 * exchange rate. Voting power can be calculated as total bonded shares
 * multiplied by exchange rate.
 */
export interface ValidatorSDKType {
  operator_address: string;
  consensus_pubkey?: AnySDKType | undefined;
  jailed: boolean;
  status: BondStatus;
  tokens: CoinSDKType[];
  delegator_shares: DecCoinSDKType[];
  description: DescriptionSDKType;
  unbonding_height: bigint;
  unbonding_time: Date;
  commission: CommissionSDKType;
  voting_powers: CoinSDKType[];
  voting_power: string;
  unbonding_on_hold_ref_count: bigint;
  unbonding_id: bigint;
}
/** ValAddresses defines a repeated set of validator addresses. */
export interface ValAddresses {
  addresses: string[];
}
export interface ValAddressesProtoMsg {
  typeUrl: '/initia.mstaking.v1.ValAddresses';
  value: Uint8Array;
}
/** ValAddresses defines a repeated set of validator addresses. */
export interface ValAddressesAmino {
  addresses?: string[];
}
export interface ValAddressesAminoMsg {
  type: '/initia.mstaking.v1.ValAddresses';
  value: ValAddressesAmino;
}
/** ValAddresses defines a repeated set of validator addresses. */
export interface ValAddressesSDKType {
  addresses: string[];
}
/**
 * DVPair is struct that just has a delegator-validator pair with no other data.
 * It is intended to be used as a marshalable pointer. For example, a DVPair can
 * be used to construct the key to getting an UnbondingDelegation from state.
 */
export interface DVPair {
  delegatorAddress: string;
  validatorAddress: string;
}
export interface DVPairProtoMsg {
  typeUrl: '/initia.mstaking.v1.DVPair';
  value: Uint8Array;
}
/**
 * DVPair is struct that just has a delegator-validator pair with no other data.
 * It is intended to be used as a marshalable pointer. For example, a DVPair can
 * be used to construct the key to getting an UnbondingDelegation from state.
 */
export interface DVPairAmino {
  delegator_address?: string;
  validator_address?: string;
}
export interface DVPairAminoMsg {
  type: '/initia.mstaking.v1.DVPair';
  value: DVPairAmino;
}
/**
 * DVPair is struct that just has a delegator-validator pair with no other data.
 * It is intended to be used as a marshalable pointer. For example, a DVPair can
 * be used to construct the key to getting an UnbondingDelegation from state.
 */
export interface DVPairSDKType {
  delegator_address: string;
  validator_address: string;
}
/** DVPairs defines an array of DVPair objects. */
export interface DVPairs {
  pairs: DVPair[];
}
export interface DVPairsProtoMsg {
  typeUrl: '/initia.mstaking.v1.DVPairs';
  value: Uint8Array;
}
/** DVPairs defines an array of DVPair objects. */
export interface DVPairsAmino {
  pairs?: DVPairAmino[];
}
export interface DVPairsAminoMsg {
  type: '/initia.mstaking.v1.DVPairs';
  value: DVPairsAmino;
}
/** DVPairs defines an array of DVPair objects. */
export interface DVPairsSDKType {
  pairs: DVPairSDKType[];
}
/**
 * DVVTriplet is struct that just has a delegator-validator-validator triplet
 * with no other data. It is intended to be used as a marshalable pointer. For
 * example, a DVVTriplet can be used to construct the key to getting a
 * Redelegation from state.
 */
export interface DVVTriplet {
  delegatorAddress: string;
  validatorSrcAddress: string;
  validatorDstAddress: string;
}
export interface DVVTripletProtoMsg {
  typeUrl: '/initia.mstaking.v1.DVVTriplet';
  value: Uint8Array;
}
/**
 * DVVTriplet is struct that just has a delegator-validator-validator triplet
 * with no other data. It is intended to be used as a marshalable pointer. For
 * example, a DVVTriplet can be used to construct the key to getting a
 * Redelegation from state.
 */
export interface DVVTripletAmino {
  delegator_address?: string;
  validator_src_address?: string;
  validator_dst_address?: string;
}
export interface DVVTripletAminoMsg {
  type: '/initia.mstaking.v1.DVVTriplet';
  value: DVVTripletAmino;
}
/**
 * DVVTriplet is struct that just has a delegator-validator-validator triplet
 * with no other data. It is intended to be used as a marshalable pointer. For
 * example, a DVVTriplet can be used to construct the key to getting a
 * Redelegation from state.
 */
export interface DVVTripletSDKType {
  delegator_address: string;
  validator_src_address: string;
  validator_dst_address: string;
}
/** DVVTriplets defines an array of DVVTriplet objects. */
export interface DVVTriplets {
  triplets: DVVTriplet[];
}
export interface DVVTripletsProtoMsg {
  typeUrl: '/initia.mstaking.v1.DVVTriplets';
  value: Uint8Array;
}
/** DVVTriplets defines an array of DVVTriplet objects. */
export interface DVVTripletsAmino {
  triplets?: DVVTripletAmino[];
}
export interface DVVTripletsAminoMsg {
  type: '/initia.mstaking.v1.DVVTriplets';
  value: DVVTripletsAmino;
}
/** DVVTriplets defines an array of DVVTriplet objects. */
export interface DVVTripletsSDKType {
  triplets: DVVTripletSDKType[];
}
/**
 * Delegation represents the bond with tokens held by an account. It is
 * owned by one delegator, and is associated with the voting power of one
 * validator.
 */
export interface Delegation {
  /** delegator_address is the bech32-encoded address of the delegator. */
  delegatorAddress: string;
  /** validator_address is the bech32-encoded address of the validator. */
  validatorAddress: string;
  /** shares define the delegation shares received. */
  shares: DecCoin[];
}
export interface DelegationProtoMsg {
  typeUrl: '/initia.mstaking.v1.Delegation';
  value: Uint8Array;
}
/**
 * Delegation represents the bond with tokens held by an account. It is
 * owned by one delegator, and is associated with the voting power of one
 * validator.
 */
export interface DelegationAmino {
  /** delegator_address is the bech32-encoded address of the delegator. */
  delegator_address?: string;
  /** validator_address is the bech32-encoded address of the validator. */
  validator_address?: string;
  /** shares define the delegation shares received. */
  shares?: DecCoinAmino[];
}
export interface DelegationAminoMsg {
  type: '/initia.mstaking.v1.Delegation';
  value: DelegationAmino;
}
/**
 * Delegation represents the bond with tokens held by an account. It is
 * owned by one delegator, and is associated with the voting power of one
 * validator.
 */
export interface DelegationSDKType {
  delegator_address: string;
  validator_address: string;
  shares: DecCoinSDKType[];
}
/**
 * UnbondingDelegation stores all of a single delegator's unbonding bonds
 * for a single validator in an time-ordered list.
 */
export interface UnbondingDelegation {
  /** delegator_address is the bech32-encoded address of the delegator. */
  delegatorAddress: string;
  /** validator_address is the bech32-encoded address of the validator. */
  validatorAddress: string;
  /** entries are the unbonding delegation entries. */
  entries: UnbondingDelegationEntry[];
}
export interface UnbondingDelegationProtoMsg {
  typeUrl: '/initia.mstaking.v1.UnbondingDelegation';
  value: Uint8Array;
}
/**
 * UnbondingDelegation stores all of a single delegator's unbonding bonds
 * for a single validator in an time-ordered list.
 */
export interface UnbondingDelegationAmino {
  /** delegator_address is the bech32-encoded address of the delegator. */
  delegator_address?: string;
  /** validator_address is the bech32-encoded address of the validator. */
  validator_address?: string;
  /** entries are the unbonding delegation entries. */
  entries?: UnbondingDelegationEntryAmino[];
}
export interface UnbondingDelegationAminoMsg {
  type: '/initia.mstaking.v1.UnbondingDelegation';
  value: UnbondingDelegationAmino;
}
/**
 * UnbondingDelegation stores all of a single delegator's unbonding bonds
 * for a single validator in an time-ordered list.
 */
export interface UnbondingDelegationSDKType {
  delegator_address: string;
  validator_address: string;
  entries: UnbondingDelegationEntrySDKType[];
}
/** UnbondingDelegationEntry defines an unbonding object with relevant metadata. */
export interface UnbondingDelegationEntry {
  /** creation_height is the height which the unbonding took place. */
  creationHeight: bigint;
  /** completion_time is the unix time for unbonding completion. */
  completionTime: Date;
  /** initial_balance defines the tokens initially scheduled to receive at completion. */
  initialBalance: Coin[];
  /** balance defines the tokens to receive at completion. */
  balance: Coin[];
  /** Incrementing id that uniquely identifies this entry */
  unbondingId: bigint;
  /** Strictly positive if this entry's unbonding has been stopped by external modules */
  unbondingOnHoldRefCount: bigint;
}
export interface UnbondingDelegationEntryProtoMsg {
  typeUrl: '/initia.mstaking.v1.UnbondingDelegationEntry';
  value: Uint8Array;
}
/** UnbondingDelegationEntry defines an unbonding object with relevant metadata. */
export interface UnbondingDelegationEntryAmino {
  /** creation_height is the height which the unbonding took place. */
  creation_height?: string;
  /** completion_time is the unix time for unbonding completion. */
  completion_time?: string;
  /** initial_balance defines the tokens initially scheduled to receive at completion. */
  initial_balance?: CoinAmino[];
  /** balance defines the tokens to receive at completion. */
  balance?: CoinAmino[];
  /** Incrementing id that uniquely identifies this entry */
  unbonding_id?: string;
  /** Strictly positive if this entry's unbonding has been stopped by external modules */
  unbonding_on_hold_ref_count?: string;
}
export interface UnbondingDelegationEntryAminoMsg {
  type: '/initia.mstaking.v1.UnbondingDelegationEntry';
  value: UnbondingDelegationEntryAmino;
}
/** UnbondingDelegationEntry defines an unbonding object with relevant metadata. */
export interface UnbondingDelegationEntrySDKType {
  creation_height: bigint;
  completion_time: Date;
  initial_balance: CoinSDKType[];
  balance: CoinSDKType[];
  unbonding_id: bigint;
  unbonding_on_hold_ref_count: bigint;
}
/** RedelegationEntry defines a redelegation object with relevant metadata. */
export interface RedelegationEntry {
  /** creation_height  defines the height which the redelegation took place. */
  creationHeight: bigint;
  /** completion_time defines the unix time for redelegation completion. */
  completionTime: Date;
  /** initial_balance defines the initial balance when redelegation started. */
  initialBalance: Coin[];
  /** shares_dst is the amount of destination-validator shares created by redelegation. */
  sharesDst: DecCoin[];
  /** Incrementing id that uniquely identifies this entry */
  unbondingId: bigint;
  /** Strictly positive if this entry's unbonding has been stopped by external modules */
  unbondingOnHoldRefCount: bigint;
}
export interface RedelegationEntryProtoMsg {
  typeUrl: '/initia.mstaking.v1.RedelegationEntry';
  value: Uint8Array;
}
/** RedelegationEntry defines a redelegation object with relevant metadata. */
export interface RedelegationEntryAmino {
  /** creation_height  defines the height which the redelegation took place. */
  creation_height?: string;
  /** completion_time defines the unix time for redelegation completion. */
  completion_time?: string;
  /** initial_balance defines the initial balance when redelegation started. */
  initial_balance?: CoinAmino[];
  /** shares_dst is the amount of destination-validator shares created by redelegation. */
  shares_dst?: DecCoinAmino[];
  /** Incrementing id that uniquely identifies this entry */
  unbonding_id?: string;
  /** Strictly positive if this entry's unbonding has been stopped by external modules */
  unbonding_on_hold_ref_count?: string;
}
export interface RedelegationEntryAminoMsg {
  type: '/initia.mstaking.v1.RedelegationEntry';
  value: RedelegationEntryAmino;
}
/** RedelegationEntry defines a redelegation object with relevant metadata. */
export interface RedelegationEntrySDKType {
  creation_height: bigint;
  completion_time: Date;
  initial_balance: CoinSDKType[];
  shares_dst: DecCoinSDKType[];
  unbonding_id: bigint;
  unbonding_on_hold_ref_count: bigint;
}
/**
 * Redelegation contains the list of a particular delegator's redelegating bonds
 * from a particular source validator to a particular destination validator.
 */
export interface Redelegation {
  /** delegator_address is the bech32-encoded address of the delegator. */
  delegatorAddress: string;
  /** validator_src_address is the validator redelegation source operator address. */
  validatorSrcAddress: string;
  /** validator_dst_address is the validator redelegation destination operator address. */
  validatorDstAddress: string;
  /** entries are the redelegation entries. */
  entries: RedelegationEntry[];
}
export interface RedelegationProtoMsg {
  typeUrl: '/initia.mstaking.v1.Redelegation';
  value: Uint8Array;
}
/**
 * Redelegation contains the list of a particular delegator's redelegating bonds
 * from a particular source validator to a particular destination validator.
 */
export interface RedelegationAmino {
  /** delegator_address is the bech32-encoded address of the delegator. */
  delegator_address?: string;
  /** validator_src_address is the validator redelegation source operator address. */
  validator_src_address?: string;
  /** validator_dst_address is the validator redelegation destination operator address. */
  validator_dst_address?: string;
  /** entries are the redelegation entries. */
  entries?: RedelegationEntryAmino[];
}
export interface RedelegationAminoMsg {
  type: '/initia.mstaking.v1.Redelegation';
  value: RedelegationAmino;
}
/**
 * Redelegation contains the list of a particular delegator's redelegating bonds
 * from a particular source validator to a particular destination validator.
 */
export interface RedelegationSDKType {
  delegator_address: string;
  validator_src_address: string;
  validator_dst_address: string;
  entries: RedelegationEntrySDKType[];
}
/** Params defines the parameters for the staking module. */
export interface Params {
  /** unbonding_time is the time duration of unbonding. */
  unbondingTime: Duration;
  /** max_validators is the maximum number of validators. */
  maxValidators: number;
  /** max_entries is the max entries for either unbonding delegation or redelegation (per pair/trio). */
  maxEntries: number;
  /** historical_entries is the number of historical entries to persist. */
  historicalEntries: number;
  /** bond_denoms defines the bondable coin denomination. */
  bondDenoms: string[];
  /** minimum voting power is the chain-wide minimum voting power to get into power update whitelist */
  minVotingPower: bigint;
  /** min_commission_rate is the chain-wide minimum commission rate that a validator can charge their delegators */
  minCommissionRate: string;
}
export interface ParamsProtoMsg {
  typeUrl: '/initia.mstaking.v1.Params';
  value: Uint8Array;
}
/** Params defines the parameters for the staking module. */
export interface ParamsAmino {
  /** unbonding_time is the time duration of unbonding. */
  unbonding_time?: DurationAmino;
  /** max_validators is the maximum number of validators. */
  max_validators?: number;
  /** max_entries is the max entries for either unbonding delegation or redelegation (per pair/trio). */
  max_entries?: number;
  /** historical_entries is the number of historical entries to persist. */
  historical_entries?: number;
  /** bond_denoms defines the bondable coin denomination. */
  bond_denoms?: string[];
  /** minimum voting power is the chain-wide minimum voting power to get into power update whitelist */
  min_voting_power?: string;
  /** min_commission_rate is the chain-wide minimum commission rate that a validator can charge their delegators */
  min_commission_rate?: string;
}
export interface ParamsAminoMsg {
  type: '/initia.mstaking.v1.Params';
  value: ParamsAmino;
}
/** Params defines the parameters for the staking module. */
export interface ParamsSDKType {
  unbonding_time: DurationSDKType;
  max_validators: number;
  max_entries: number;
  historical_entries: number;
  bond_denoms: string[];
  min_voting_power: bigint;
  min_commission_rate: string;
}
/**
 * DelegationResponse is equivalent to Delegation except that it contains a
 * balance in addition to shares which is more suitable for client responses.
 */
export interface DelegationResponse {
  delegation: Delegation;
  balance: Coin[];
}
export interface DelegationResponseProtoMsg {
  typeUrl: '/initia.mstaking.v1.DelegationResponse';
  value: Uint8Array;
}
/**
 * DelegationResponse is equivalent to Delegation except that it contains a
 * balance in addition to shares which is more suitable for client responses.
 */
export interface DelegationResponseAmino {
  delegation?: DelegationAmino;
  balance?: CoinAmino[];
}
export interface DelegationResponseAminoMsg {
  type: '/initia.mstaking.v1.DelegationResponse';
  value: DelegationResponseAmino;
}
/**
 * DelegationResponse is equivalent to Delegation except that it contains a
 * balance in addition to shares which is more suitable for client responses.
 */
export interface DelegationResponseSDKType {
  delegation: DelegationSDKType;
  balance: CoinSDKType[];
}
/**
 * RedelegationEntryResponse is equivalent to a RedelegationEntry except that it
 * contains a balance in addition to shares which is more suitable for client
 * responses.
 */
export interface RedelegationEntryResponse {
  redelegationEntry: RedelegationEntry;
  balance: Coin[];
}
export interface RedelegationEntryResponseProtoMsg {
  typeUrl: '/initia.mstaking.v1.RedelegationEntryResponse';
  value: Uint8Array;
}
/**
 * RedelegationEntryResponse is equivalent to a RedelegationEntry except that it
 * contains a balance in addition to shares which is more suitable for client
 * responses.
 */
export interface RedelegationEntryResponseAmino {
  redelegation_entry?: RedelegationEntryAmino;
  balance?: CoinAmino[];
}
export interface RedelegationEntryResponseAminoMsg {
  type: '/initia.mstaking.v1.RedelegationEntryResponse';
  value: RedelegationEntryResponseAmino;
}
/**
 * RedelegationEntryResponse is equivalent to a RedelegationEntry except that it
 * contains a balance in addition to shares which is more suitable for client
 * responses.
 */
export interface RedelegationEntryResponseSDKType {
  redelegation_entry: RedelegationEntrySDKType;
  balance: CoinSDKType[];
}
/**
 * RedelegationResponse is equivalent to a Redelegation except that its entries
 * contain a balance in addition to shares which is more suitable for client
 * responses.
 */
export interface RedelegationResponse {
  redelegation: Redelegation;
  entries: RedelegationEntryResponse[];
}
export interface RedelegationResponseProtoMsg {
  typeUrl: '/initia.mstaking.v1.RedelegationResponse';
  value: Uint8Array;
}
/**
 * RedelegationResponse is equivalent to a Redelegation except that its entries
 * contain a balance in addition to shares which is more suitable for client
 * responses.
 */
export interface RedelegationResponseAmino {
  redelegation?: RedelegationAmino;
  entries?: RedelegationEntryResponseAmino[];
}
export interface RedelegationResponseAminoMsg {
  type: '/initia.mstaking.v1.RedelegationResponse';
  value: RedelegationResponseAmino;
}
/**
 * RedelegationResponse is equivalent to a Redelegation except that its entries
 * contain a balance in addition to shares which is more suitable for client
 * responses.
 */
export interface RedelegationResponseSDKType {
  redelegation: RedelegationSDKType;
  entries: RedelegationEntryResponseSDKType[];
}
/**
 * Pool is used for tracking bonded and not-bonded token supply of the bond
 * denomination.
 */
export interface Pool {
  notBondedTokens: Coin[];
  bondedTokens: Coin[];
  votingPowerWeights: DecCoin[];
}
export interface PoolProtoMsg {
  typeUrl: '/initia.mstaking.v1.Pool';
  value: Uint8Array;
}
/**
 * Pool is used for tracking bonded and not-bonded token supply of the bond
 * denomination.
 */
export interface PoolAmino {
  not_bonded_tokens: CoinAmino[];
  bonded_tokens: CoinAmino[];
  voting_power_weights?: DecCoinAmino[];
}
export interface PoolAminoMsg {
  type: '/initia.mstaking.v1.Pool';
  value: PoolAmino;
}
/**
 * Pool is used for tracking bonded and not-bonded token supply of the bond
 * denomination.
 */
export interface PoolSDKType {
  not_bonded_tokens: CoinSDKType[];
  bonded_tokens: CoinSDKType[];
  voting_power_weights: DecCoinSDKType[];
}
function createBaseCommissionRates(): CommissionRates {
  return {
    rate: '',
    maxRate: '',
    maxChangeRate: '',
  };
}
export const CommissionRates = {
  typeUrl: '/initia.mstaking.v1.CommissionRates',
  encode(message: CommissionRates, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.rate !== '') {
      writer.uint32(10).string(Decimal.fromUserInput(message.rate, 18).atomics);
    }
    if (message.maxRate !== '') {
      writer.uint32(18).string(Decimal.fromUserInput(message.maxRate, 18).atomics);
    }
    if (message.maxChangeRate !== '') {
      writer.uint32(26).string(Decimal.fromUserInput(message.maxChangeRate, 18).atomics);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): CommissionRates {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCommissionRates();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.rate = Decimal.fromAtomics(reader.string(), 18).toString();
          break;
        case 2:
          message.maxRate = Decimal.fromAtomics(reader.string(), 18).toString();
          break;
        case 3:
          message.maxChangeRate = Decimal.fromAtomics(reader.string(), 18).toString();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<CommissionRates>): CommissionRates {
    const message = createBaseCommissionRates();
    message.rate = object.rate ?? '';
    message.maxRate = object.maxRate ?? '';
    message.maxChangeRate = object.maxChangeRate ?? '';
    return message;
  },
  fromAmino(object: CommissionRatesAmino): CommissionRates {
    const message = createBaseCommissionRates();
    if (object.rate !== undefined && object.rate !== null) {
      message.rate = object.rate;
    }
    if (object.max_rate !== undefined && object.max_rate !== null) {
      message.maxRate = object.max_rate;
    }
    if (object.max_change_rate !== undefined && object.max_change_rate !== null) {
      message.maxChangeRate = object.max_change_rate;
    }
    return message;
  },
  toAmino(message: CommissionRates): CommissionRatesAmino {
    const obj: any = {};
    obj.rate = message.rate === '' ? undefined : message.rate;
    obj.max_rate = message.maxRate === '' ? undefined : message.maxRate;
    obj.max_change_rate = message.maxChangeRate === '' ? undefined : message.maxChangeRate;
    return obj;
  },
  fromAminoMsg(object: CommissionRatesAminoMsg): CommissionRates {
    return CommissionRates.fromAmino(object.value);
  },
  fromProtoMsg(message: CommissionRatesProtoMsg): CommissionRates {
    return CommissionRates.decode(message.value);
  },
  toProto(message: CommissionRates): Uint8Array {
    return CommissionRates.encode(message).finish();
  },
  toProtoMsg(message: CommissionRates): CommissionRatesProtoMsg {
    return {
      typeUrl: '/initia.mstaking.v1.CommissionRates',
      value: CommissionRates.encode(message).finish(),
    };
  },
};
function createBaseCommission(): Commission {
  return {
    commissionRates: CommissionRates.fromPartial({}),
    updateTime: new Date(),
  };
}
export const Commission = {
  typeUrl: '/initia.mstaking.v1.Commission',
  encode(message: Commission, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.commissionRates !== undefined) {
      CommissionRates.encode(message.commissionRates, writer.uint32(10).fork()).ldelim();
    }
    if (message.updateTime !== undefined) {
      Timestamp.encode(toTimestamp(message.updateTime), writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Commission {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCommission();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.commissionRates = CommissionRates.decode(reader, reader.uint32());
          break;
        case 2:
          message.updateTime = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<Commission>): Commission {
    const message = createBaseCommission();
    message.commissionRates =
      object.commissionRates !== undefined && object.commissionRates !== null
        ? CommissionRates.fromPartial(object.commissionRates)
        : undefined;
    message.updateTime = object.updateTime ?? undefined;
    return message;
  },
  fromAmino(object: CommissionAmino): Commission {
    const message = createBaseCommission();
    if (object.commission_rates !== undefined && object.commission_rates !== null) {
      message.commissionRates = CommissionRates.fromAmino(object.commission_rates);
    }
    if (object.update_time !== undefined && object.update_time !== null) {
      message.updateTime = fromTimestamp(Timestamp.fromAmino(object.update_time));
    }
    return message;
  },
  toAmino(message: Commission): CommissionAmino {
    const obj: any = {};
    obj.commission_rates = message.commissionRates ? CommissionRates.toAmino(message.commissionRates) : undefined;
    obj.update_time = message.updateTime ? Timestamp.toAmino(toTimestamp(message.updateTime)) : undefined;
    return obj;
  },
  fromAminoMsg(object: CommissionAminoMsg): Commission {
    return Commission.fromAmino(object.value);
  },
  fromProtoMsg(message: CommissionProtoMsg): Commission {
    return Commission.decode(message.value);
  },
  toProto(message: Commission): Uint8Array {
    return Commission.encode(message).finish();
  },
  toProtoMsg(message: Commission): CommissionProtoMsg {
    return {
      typeUrl: '/initia.mstaking.v1.Commission',
      value: Commission.encode(message).finish(),
    };
  },
};
function createBaseDescription(): Description {
  return {
    moniker: '',
    identity: '',
    website: '',
    securityContact: '',
    details: '',
  };
}
export const Description = {
  typeUrl: '/initia.mstaking.v1.Description',
  encode(message: Description, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.moniker !== '') {
      writer.uint32(10).string(message.moniker);
    }
    if (message.identity !== '') {
      writer.uint32(18).string(message.identity);
    }
    if (message.website !== '') {
      writer.uint32(26).string(message.website);
    }
    if (message.securityContact !== '') {
      writer.uint32(34).string(message.securityContact);
    }
    if (message.details !== '') {
      writer.uint32(42).string(message.details);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Description {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDescription();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.moniker = reader.string();
          break;
        case 2:
          message.identity = reader.string();
          break;
        case 3:
          message.website = reader.string();
          break;
        case 4:
          message.securityContact = reader.string();
          break;
        case 5:
          message.details = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<Description>): Description {
    const message = createBaseDescription();
    message.moniker = object.moniker ?? '';
    message.identity = object.identity ?? '';
    message.website = object.website ?? '';
    message.securityContact = object.securityContact ?? '';
    message.details = object.details ?? '';
    return message;
  },
  fromAmino(object: DescriptionAmino): Description {
    const message = createBaseDescription();
    if (object.moniker !== undefined && object.moniker !== null) {
      message.moniker = object.moniker;
    }
    if (object.identity !== undefined && object.identity !== null) {
      message.identity = object.identity;
    }
    if (object.website !== undefined && object.website !== null) {
      message.website = object.website;
    }
    if (object.security_contact !== undefined && object.security_contact !== null) {
      message.securityContact = object.security_contact;
    }
    if (object.details !== undefined && object.details !== null) {
      message.details = object.details;
    }
    return message;
  },
  toAmino(message: Description): DescriptionAmino {
    const obj: any = {};
    obj.moniker = message.moniker === '' ? undefined : message.moniker;
    obj.identity = message.identity === '' ? undefined : message.identity;
    obj.website = message.website === '' ? undefined : message.website;
    obj.security_contact = message.securityContact === '' ? undefined : message.securityContact;
    obj.details = message.details === '' ? undefined : message.details;
    return obj;
  },
  fromAminoMsg(object: DescriptionAminoMsg): Description {
    return Description.fromAmino(object.value);
  },
  fromProtoMsg(message: DescriptionProtoMsg): Description {
    return Description.decode(message.value);
  },
  toProto(message: Description): Uint8Array {
    return Description.encode(message).finish();
  },
  toProtoMsg(message: Description): DescriptionProtoMsg {
    return {
      typeUrl: '/initia.mstaking.v1.Description',
      value: Description.encode(message).finish(),
    };
  },
};
function createBaseValidator(): Validator {
  return {
    operatorAddress: '',
    consensusPubkey: undefined,
    jailed: false,
    status: 0,
    tokens: [],
    delegatorShares: [],
    description: Description.fromPartial({}),
    unbondingHeight: BigInt(0),
    unbondingTime: new Date(),
    commission: Commission.fromPartial({}),
    votingPowers: [],
    votingPower: '',
    unbondingOnHoldRefCount: BigInt(0),
    unbondingId: BigInt(0),
  };
}
export const Validator = {
  typeUrl: '/initia.mstaking.v1.Validator',
  encode(message: Validator, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.operatorAddress !== '') {
      writer.uint32(10).string(message.operatorAddress);
    }
    if (message.consensusPubkey !== undefined) {
      Any.encode(message.consensusPubkey as Any, writer.uint32(18).fork()).ldelim();
    }
    if (message.jailed === true) {
      writer.uint32(24).bool(message.jailed);
    }
    if (message.status !== 0) {
      writer.uint32(32).int32(message.status);
    }
    for (const v of message.tokens) {
      Coin.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    for (const v of message.delegatorShares) {
      DecCoin.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    if (message.description !== undefined) {
      Description.encode(message.description, writer.uint32(58).fork()).ldelim();
    }
    if (message.unbondingHeight !== BigInt(0)) {
      writer.uint32(64).int64(message.unbondingHeight);
    }
    if (message.unbondingTime !== undefined) {
      Timestamp.encode(toTimestamp(message.unbondingTime), writer.uint32(74).fork()).ldelim();
    }
    if (message.commission !== undefined) {
      Commission.encode(message.commission, writer.uint32(82).fork()).ldelim();
    }
    for (const v of message.votingPowers) {
      Coin.encode(v!, writer.uint32(90).fork()).ldelim();
    }
    if (message.votingPower !== '') {
      writer.uint32(98).string(message.votingPower);
    }
    if (message.unbondingOnHoldRefCount !== BigInt(0)) {
      writer.uint32(104).int64(message.unbondingOnHoldRefCount);
    }
    if (message.unbondingId !== BigInt(0)) {
      writer.uint32(112).uint64(message.unbondingId);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Validator {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseValidator();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.operatorAddress = reader.string();
          break;
        case 2:
          message.consensusPubkey = Cosmos_cryptoPubKey_InterfaceDecoder(reader) as Any;
          break;
        case 3:
          message.jailed = reader.bool();
          break;
        case 4:
          message.status = reader.int32() as any;
          break;
        case 5:
          message.tokens.push(Coin.decode(reader, reader.uint32()));
          break;
        case 6:
          message.delegatorShares.push(DecCoin.decode(reader, reader.uint32()));
          break;
        case 7:
          message.description = Description.decode(reader, reader.uint32());
          break;
        case 8:
          message.unbondingHeight = reader.int64();
          break;
        case 9:
          message.unbondingTime = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 10:
          message.commission = Commission.decode(reader, reader.uint32());
          break;
        case 11:
          message.votingPowers.push(Coin.decode(reader, reader.uint32()));
          break;
        case 12:
          message.votingPower = reader.string();
          break;
        case 13:
          message.unbondingOnHoldRefCount = reader.int64();
          break;
        case 14:
          message.unbondingId = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<Validator>): Validator {
    const message = createBaseValidator();
    message.operatorAddress = object.operatorAddress ?? '';
    message.consensusPubkey =
      object.consensusPubkey !== undefined && object.consensusPubkey !== null
        ? Any.fromPartial(object.consensusPubkey)
        : undefined;
    message.jailed = object.jailed ?? false;
    message.status = object.status ?? 0;
    message.tokens = object.tokens?.map((e) => Coin.fromPartial(e)) || [];
    message.delegatorShares = object.delegatorShares?.map((e) => DecCoin.fromPartial(e)) || [];
    message.description =
      object.description !== undefined && object.description !== null
        ? Description.fromPartial(object.description)
        : undefined;
    message.unbondingHeight =
      object.unbondingHeight !== undefined && object.unbondingHeight !== null
        ? BigInt(object.unbondingHeight.toString())
        : BigInt(0);
    message.unbondingTime = object.unbondingTime ?? undefined;
    message.commission =
      object.commission !== undefined && object.commission !== null
        ? Commission.fromPartial(object.commission)
        : undefined;
    message.votingPowers = object.votingPowers?.map((e) => Coin.fromPartial(e)) || [];
    message.votingPower = object.votingPower ?? '';
    message.unbondingOnHoldRefCount =
      object.unbondingOnHoldRefCount !== undefined && object.unbondingOnHoldRefCount !== null
        ? BigInt(object.unbondingOnHoldRefCount.toString())
        : BigInt(0);
    message.unbondingId =
      object.unbondingId !== undefined && object.unbondingId !== null
        ? BigInt(object.unbondingId.toString())
        : BigInt(0);
    return message;
  },
  fromAmino(object: ValidatorAmino): Validator {
    const message = createBaseValidator();
    if (object.operator_address !== undefined && object.operator_address !== null) {
      message.operatorAddress = object.operator_address;
    }
    if (object.consensus_pubkey !== undefined && object.consensus_pubkey !== null) {
      message.consensusPubkey = encodePubkey(object.consensus_pubkey);
    }
    if (object.jailed !== undefined && object.jailed !== null) {
      message.jailed = object.jailed;
    }
    if (object.status !== undefined && object.status !== null) {
      message.status = object.status;
    }
    message.tokens = object.tokens?.map((e) => Coin.fromAmino(e)) || [];
    message.delegatorShares = object.delegator_shares?.map((e) => DecCoin.fromAmino(e)) || [];
    if (object.description !== undefined && object.description !== null) {
      message.description = Description.fromAmino(object.description);
    }
    if (object.unbonding_height !== undefined && object.unbonding_height !== null) {
      message.unbondingHeight = BigInt(object.unbonding_height);
    }
    if (object.unbonding_time !== undefined && object.unbonding_time !== null) {
      message.unbondingTime = fromTimestamp(Timestamp.fromAmino(object.unbonding_time));
    }
    if (object.commission !== undefined && object.commission !== null) {
      message.commission = Commission.fromAmino(object.commission);
    }
    message.votingPowers = object.voting_powers?.map((e) => Coin.fromAmino(e)) || [];
    if (object.voting_power !== undefined && object.voting_power !== null) {
      message.votingPower = object.voting_power;
    }
    if (object.unbonding_on_hold_ref_count !== undefined && object.unbonding_on_hold_ref_count !== null) {
      message.unbondingOnHoldRefCount = BigInt(object.unbonding_on_hold_ref_count);
    }
    if (object.unbonding_id !== undefined && object.unbonding_id !== null) {
      message.unbondingId = BigInt(object.unbonding_id);
    }
    return message;
  },
  toAmino(message: Validator): ValidatorAmino {
    const obj: any = {};
    obj.operator_address = message.operatorAddress === '' ? undefined : message.operatorAddress;
    obj.consensus_pubkey = message.consensusPubkey ? decodePubkey(message.consensusPubkey) : undefined;
    obj.jailed = message.jailed === false ? undefined : message.jailed;
    obj.status = message.status === 0 ? undefined : message.status;
    if (message.tokens) {
      obj.tokens = message.tokens.map((e) => (e ? Coin.toAmino(e) : undefined));
    } else {
      obj.tokens = message.tokens;
    }
    if (message.delegatorShares) {
      obj.delegator_shares = message.delegatorShares.map((e) => (e ? DecCoin.toAmino(e) : undefined));
    } else {
      obj.delegator_shares = message.delegatorShares;
    }
    obj.description = message.description ? Description.toAmino(message.description) : undefined;
    obj.unbonding_height = message.unbondingHeight !== BigInt(0) ? message.unbondingHeight.toString() : undefined;
    obj.unbonding_time = message.unbondingTime ? Timestamp.toAmino(toTimestamp(message.unbondingTime)) : undefined;
    obj.commission = message.commission ? Commission.toAmino(message.commission) : undefined;
    if (message.votingPowers) {
      obj.voting_powers = message.votingPowers.map((e) => (e ? Coin.toAmino(e) : undefined));
    } else {
      obj.voting_powers = message.votingPowers;
    }
    obj.voting_power = message.votingPower === '' ? undefined : message.votingPower;
    obj.unbonding_on_hold_ref_count =
      message.unbondingOnHoldRefCount !== BigInt(0) ? message.unbondingOnHoldRefCount.toString() : undefined;
    obj.unbonding_id = message.unbondingId !== BigInt(0) ? message.unbondingId.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: ValidatorAminoMsg): Validator {
    return Validator.fromAmino(object.value);
  },
  fromProtoMsg(message: ValidatorProtoMsg): Validator {
    return Validator.decode(message.value);
  },
  toProto(message: Validator): Uint8Array {
    return Validator.encode(message).finish();
  },
  toProtoMsg(message: Validator): ValidatorProtoMsg {
    return {
      typeUrl: '/initia.mstaking.v1.Validator',
      value: Validator.encode(message).finish(),
    };
  },
};
function createBaseValAddresses(): ValAddresses {
  return {
    addresses: [],
  };
}
export const ValAddresses = {
  typeUrl: '/initia.mstaking.v1.ValAddresses',
  encode(message: ValAddresses, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.addresses) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): ValAddresses {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseValAddresses();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.addresses.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<ValAddresses>): ValAddresses {
    const message = createBaseValAddresses();
    message.addresses = object.addresses?.map((e) => e) || [];
    return message;
  },
  fromAmino(object: ValAddressesAmino): ValAddresses {
    const message = createBaseValAddresses();
    message.addresses = object.addresses?.map((e) => e) || [];
    return message;
  },
  toAmino(message: ValAddresses): ValAddressesAmino {
    const obj: any = {};
    if (message.addresses) {
      obj.addresses = message.addresses.map((e) => e);
    } else {
      obj.addresses = message.addresses;
    }
    return obj;
  },
  fromAminoMsg(object: ValAddressesAminoMsg): ValAddresses {
    return ValAddresses.fromAmino(object.value);
  },
  fromProtoMsg(message: ValAddressesProtoMsg): ValAddresses {
    return ValAddresses.decode(message.value);
  },
  toProto(message: ValAddresses): Uint8Array {
    return ValAddresses.encode(message).finish();
  },
  toProtoMsg(message: ValAddresses): ValAddressesProtoMsg {
    return {
      typeUrl: '/initia.mstaking.v1.ValAddresses',
      value: ValAddresses.encode(message).finish(),
    };
  },
};
function createBaseDVPair(): DVPair {
  return {
    delegatorAddress: '',
    validatorAddress: '',
  };
}
export const DVPair = {
  typeUrl: '/initia.mstaking.v1.DVPair',
  encode(message: DVPair, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.delegatorAddress !== '') {
      writer.uint32(10).string(message.delegatorAddress);
    }
    if (message.validatorAddress !== '') {
      writer.uint32(18).string(message.validatorAddress);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): DVPair {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDVPair();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.delegatorAddress = reader.string();
          break;
        case 2:
          message.validatorAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<DVPair>): DVPair {
    const message = createBaseDVPair();
    message.delegatorAddress = object.delegatorAddress ?? '';
    message.validatorAddress = object.validatorAddress ?? '';
    return message;
  },
  fromAmino(object: DVPairAmino): DVPair {
    const message = createBaseDVPair();
    if (object.delegator_address !== undefined && object.delegator_address !== null) {
      message.delegatorAddress = object.delegator_address;
    }
    if (object.validator_address !== undefined && object.validator_address !== null) {
      message.validatorAddress = object.validator_address;
    }
    return message;
  },
  toAmino(message: DVPair): DVPairAmino {
    const obj: any = {};
    obj.delegator_address = message.delegatorAddress === '' ? undefined : message.delegatorAddress;
    obj.validator_address = message.validatorAddress === '' ? undefined : message.validatorAddress;
    return obj;
  },
  fromAminoMsg(object: DVPairAminoMsg): DVPair {
    return DVPair.fromAmino(object.value);
  },
  fromProtoMsg(message: DVPairProtoMsg): DVPair {
    return DVPair.decode(message.value);
  },
  toProto(message: DVPair): Uint8Array {
    return DVPair.encode(message).finish();
  },
  toProtoMsg(message: DVPair): DVPairProtoMsg {
    return {
      typeUrl: '/initia.mstaking.v1.DVPair',
      value: DVPair.encode(message).finish(),
    };
  },
};
function createBaseDVPairs(): DVPairs {
  return {
    pairs: [],
  };
}
export const DVPairs = {
  typeUrl: '/initia.mstaking.v1.DVPairs',
  encode(message: DVPairs, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.pairs) {
      DVPair.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): DVPairs {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDVPairs();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pairs.push(DVPair.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<DVPairs>): DVPairs {
    const message = createBaseDVPairs();
    message.pairs = object.pairs?.map((e) => DVPair.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: DVPairsAmino): DVPairs {
    const message = createBaseDVPairs();
    message.pairs = object.pairs?.map((e) => DVPair.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: DVPairs): DVPairsAmino {
    const obj: any = {};
    if (message.pairs) {
      obj.pairs = message.pairs.map((e) => (e ? DVPair.toAmino(e) : undefined));
    } else {
      obj.pairs = message.pairs;
    }
    return obj;
  },
  fromAminoMsg(object: DVPairsAminoMsg): DVPairs {
    return DVPairs.fromAmino(object.value);
  },
  fromProtoMsg(message: DVPairsProtoMsg): DVPairs {
    return DVPairs.decode(message.value);
  },
  toProto(message: DVPairs): Uint8Array {
    return DVPairs.encode(message).finish();
  },
  toProtoMsg(message: DVPairs): DVPairsProtoMsg {
    return {
      typeUrl: '/initia.mstaking.v1.DVPairs',
      value: DVPairs.encode(message).finish(),
    };
  },
};
function createBaseDVVTriplet(): DVVTriplet {
  return {
    delegatorAddress: '',
    validatorSrcAddress: '',
    validatorDstAddress: '',
  };
}
export const DVVTriplet = {
  typeUrl: '/initia.mstaking.v1.DVVTriplet',
  encode(message: DVVTriplet, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.delegatorAddress !== '') {
      writer.uint32(10).string(message.delegatorAddress);
    }
    if (message.validatorSrcAddress !== '') {
      writer.uint32(18).string(message.validatorSrcAddress);
    }
    if (message.validatorDstAddress !== '') {
      writer.uint32(26).string(message.validatorDstAddress);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): DVVTriplet {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDVVTriplet();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.delegatorAddress = reader.string();
          break;
        case 2:
          message.validatorSrcAddress = reader.string();
          break;
        case 3:
          message.validatorDstAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<DVVTriplet>): DVVTriplet {
    const message = createBaseDVVTriplet();
    message.delegatorAddress = object.delegatorAddress ?? '';
    message.validatorSrcAddress = object.validatorSrcAddress ?? '';
    message.validatorDstAddress = object.validatorDstAddress ?? '';
    return message;
  },
  fromAmino(object: DVVTripletAmino): DVVTriplet {
    const message = createBaseDVVTriplet();
    if (object.delegator_address !== undefined && object.delegator_address !== null) {
      message.delegatorAddress = object.delegator_address;
    }
    if (object.validator_src_address !== undefined && object.validator_src_address !== null) {
      message.validatorSrcAddress = object.validator_src_address;
    }
    if (object.validator_dst_address !== undefined && object.validator_dst_address !== null) {
      message.validatorDstAddress = object.validator_dst_address;
    }
    return message;
  },
  toAmino(message: DVVTriplet): DVVTripletAmino {
    const obj: any = {};
    obj.delegator_address = message.delegatorAddress === '' ? undefined : message.delegatorAddress;
    obj.validator_src_address = message.validatorSrcAddress === '' ? undefined : message.validatorSrcAddress;
    obj.validator_dst_address = message.validatorDstAddress === '' ? undefined : message.validatorDstAddress;
    return obj;
  },
  fromAminoMsg(object: DVVTripletAminoMsg): DVVTriplet {
    return DVVTriplet.fromAmino(object.value);
  },
  fromProtoMsg(message: DVVTripletProtoMsg): DVVTriplet {
    return DVVTriplet.decode(message.value);
  },
  toProto(message: DVVTriplet): Uint8Array {
    return DVVTriplet.encode(message).finish();
  },
  toProtoMsg(message: DVVTriplet): DVVTripletProtoMsg {
    return {
      typeUrl: '/initia.mstaking.v1.DVVTriplet',
      value: DVVTriplet.encode(message).finish(),
    };
  },
};
function createBaseDVVTriplets(): DVVTriplets {
  return {
    triplets: [],
  };
}
export const DVVTriplets = {
  typeUrl: '/initia.mstaking.v1.DVVTriplets',
  encode(message: DVVTriplets, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.triplets) {
      DVVTriplet.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): DVVTriplets {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDVVTriplets();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.triplets.push(DVVTriplet.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<DVVTriplets>): DVVTriplets {
    const message = createBaseDVVTriplets();
    message.triplets = object.triplets?.map((e) => DVVTriplet.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: DVVTripletsAmino): DVVTriplets {
    const message = createBaseDVVTriplets();
    message.triplets = object.triplets?.map((e) => DVVTriplet.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: DVVTriplets): DVVTripletsAmino {
    const obj: any = {};
    if (message.triplets) {
      obj.triplets = message.triplets.map((e) => (e ? DVVTriplet.toAmino(e) : undefined));
    } else {
      obj.triplets = message.triplets;
    }
    return obj;
  },
  fromAminoMsg(object: DVVTripletsAminoMsg): DVVTriplets {
    return DVVTriplets.fromAmino(object.value);
  },
  fromProtoMsg(message: DVVTripletsProtoMsg): DVVTriplets {
    return DVVTriplets.decode(message.value);
  },
  toProto(message: DVVTriplets): Uint8Array {
    return DVVTriplets.encode(message).finish();
  },
  toProtoMsg(message: DVVTriplets): DVVTripletsProtoMsg {
    return {
      typeUrl: '/initia.mstaking.v1.DVVTriplets',
      value: DVVTriplets.encode(message).finish(),
    };
  },
};
function createBaseDelegation(): Delegation {
  return {
    delegatorAddress: '',
    validatorAddress: '',
    shares: [],
  };
}
export const Delegation = {
  typeUrl: '/initia.mstaking.v1.Delegation',
  encode(message: Delegation, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.delegatorAddress !== '') {
      writer.uint32(10).string(message.delegatorAddress);
    }
    if (message.validatorAddress !== '') {
      writer.uint32(18).string(message.validatorAddress);
    }
    for (const v of message.shares) {
      DecCoin.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Delegation {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDelegation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.delegatorAddress = reader.string();
          break;
        case 2:
          message.validatorAddress = reader.string();
          break;
        case 3:
          message.shares.push(DecCoin.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<Delegation>): Delegation {
    const message = createBaseDelegation();
    message.delegatorAddress = object.delegatorAddress ?? '';
    message.validatorAddress = object.validatorAddress ?? '';
    message.shares = object.shares?.map((e) => DecCoin.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: DelegationAmino): Delegation {
    const message = createBaseDelegation();
    if (object.delegator_address !== undefined && object.delegator_address !== null) {
      message.delegatorAddress = object.delegator_address;
    }
    if (object.validator_address !== undefined && object.validator_address !== null) {
      message.validatorAddress = object.validator_address;
    }
    message.shares = object.shares?.map((e) => DecCoin.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: Delegation): DelegationAmino {
    const obj: any = {};
    obj.delegator_address = message.delegatorAddress === '' ? undefined : message.delegatorAddress;
    obj.validator_address = message.validatorAddress === '' ? undefined : message.validatorAddress;
    if (message.shares) {
      obj.shares = message.shares.map((e) => (e ? DecCoin.toAmino(e) : undefined));
    } else {
      obj.shares = message.shares;
    }
    return obj;
  },
  fromAminoMsg(object: DelegationAminoMsg): Delegation {
    return Delegation.fromAmino(object.value);
  },
  fromProtoMsg(message: DelegationProtoMsg): Delegation {
    return Delegation.decode(message.value);
  },
  toProto(message: Delegation): Uint8Array {
    return Delegation.encode(message).finish();
  },
  toProtoMsg(message: Delegation): DelegationProtoMsg {
    return {
      typeUrl: '/initia.mstaking.v1.Delegation',
      value: Delegation.encode(message).finish(),
    };
  },
};
function createBaseUnbondingDelegation(): UnbondingDelegation {
  return {
    delegatorAddress: '',
    validatorAddress: '',
    entries: [],
  };
}
export const UnbondingDelegation = {
  typeUrl: '/initia.mstaking.v1.UnbondingDelegation',
  encode(message: UnbondingDelegation, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.delegatorAddress !== '') {
      writer.uint32(10).string(message.delegatorAddress);
    }
    if (message.validatorAddress !== '') {
      writer.uint32(18).string(message.validatorAddress);
    }
    for (const v of message.entries) {
      UnbondingDelegationEntry.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): UnbondingDelegation {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUnbondingDelegation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.delegatorAddress = reader.string();
          break;
        case 2:
          message.validatorAddress = reader.string();
          break;
        case 3:
          message.entries.push(UnbondingDelegationEntry.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<UnbondingDelegation>): UnbondingDelegation {
    const message = createBaseUnbondingDelegation();
    message.delegatorAddress = object.delegatorAddress ?? '';
    message.validatorAddress = object.validatorAddress ?? '';
    message.entries = object.entries?.map((e) => UnbondingDelegationEntry.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: UnbondingDelegationAmino): UnbondingDelegation {
    const message = createBaseUnbondingDelegation();
    if (object.delegator_address !== undefined && object.delegator_address !== null) {
      message.delegatorAddress = object.delegator_address;
    }
    if (object.validator_address !== undefined && object.validator_address !== null) {
      message.validatorAddress = object.validator_address;
    }
    message.entries = object.entries?.map((e) => UnbondingDelegationEntry.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: UnbondingDelegation): UnbondingDelegationAmino {
    const obj: any = {};
    obj.delegator_address = message.delegatorAddress === '' ? undefined : message.delegatorAddress;
    obj.validator_address = message.validatorAddress === '' ? undefined : message.validatorAddress;
    if (message.entries) {
      obj.entries = message.entries.map((e) => (e ? UnbondingDelegationEntry.toAmino(e) : undefined));
    } else {
      obj.entries = message.entries;
    }
    return obj;
  },
  fromAminoMsg(object: UnbondingDelegationAminoMsg): UnbondingDelegation {
    return UnbondingDelegation.fromAmino(object.value);
  },
  fromProtoMsg(message: UnbondingDelegationProtoMsg): UnbondingDelegation {
    return UnbondingDelegation.decode(message.value);
  },
  toProto(message: UnbondingDelegation): Uint8Array {
    return UnbondingDelegation.encode(message).finish();
  },
  toProtoMsg(message: UnbondingDelegation): UnbondingDelegationProtoMsg {
    return {
      typeUrl: '/initia.mstaking.v1.UnbondingDelegation',
      value: UnbondingDelegation.encode(message).finish(),
    };
  },
};
function createBaseUnbondingDelegationEntry(): UnbondingDelegationEntry {
  return {
    creationHeight: BigInt(0),
    completionTime: new Date(),
    initialBalance: [],
    balance: [],
    unbondingId: BigInt(0),
    unbondingOnHoldRefCount: BigInt(0),
  };
}
export const UnbondingDelegationEntry = {
  typeUrl: '/initia.mstaking.v1.UnbondingDelegationEntry',
  encode(message: UnbondingDelegationEntry, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.creationHeight !== BigInt(0)) {
      writer.uint32(8).int64(message.creationHeight);
    }
    if (message.completionTime !== undefined) {
      Timestamp.encode(toTimestamp(message.completionTime), writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.initialBalance) {
      Coin.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.balance) {
      Coin.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    if (message.unbondingId !== BigInt(0)) {
      writer.uint32(40).uint64(message.unbondingId);
    }
    if (message.unbondingOnHoldRefCount !== BigInt(0)) {
      writer.uint32(48).int64(message.unbondingOnHoldRefCount);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): UnbondingDelegationEntry {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUnbondingDelegationEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creationHeight = reader.int64();
          break;
        case 2:
          message.completionTime = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 3:
          message.initialBalance.push(Coin.decode(reader, reader.uint32()));
          break;
        case 4:
          message.balance.push(Coin.decode(reader, reader.uint32()));
          break;
        case 5:
          message.unbondingId = reader.uint64();
          break;
        case 6:
          message.unbondingOnHoldRefCount = reader.int64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<UnbondingDelegationEntry>): UnbondingDelegationEntry {
    const message = createBaseUnbondingDelegationEntry();
    message.creationHeight =
      object.creationHeight !== undefined && object.creationHeight !== null
        ? BigInt(object.creationHeight.toString())
        : BigInt(0);
    message.completionTime = object.completionTime ?? undefined;
    message.initialBalance = object.initialBalance?.map((e) => Coin.fromPartial(e)) || [];
    message.balance = object.balance?.map((e) => Coin.fromPartial(e)) || [];
    message.unbondingId =
      object.unbondingId !== undefined && object.unbondingId !== null
        ? BigInt(object.unbondingId.toString())
        : BigInt(0);
    message.unbondingOnHoldRefCount =
      object.unbondingOnHoldRefCount !== undefined && object.unbondingOnHoldRefCount !== null
        ? BigInt(object.unbondingOnHoldRefCount.toString())
        : BigInt(0);
    return message;
  },
  fromAmino(object: UnbondingDelegationEntryAmino): UnbondingDelegationEntry {
    const message = createBaseUnbondingDelegationEntry();
    if (object.creation_height !== undefined && object.creation_height !== null) {
      message.creationHeight = BigInt(object.creation_height);
    }
    if (object.completion_time !== undefined && object.completion_time !== null) {
      message.completionTime = fromTimestamp(Timestamp.fromAmino(object.completion_time));
    }
    message.initialBalance = object.initial_balance?.map((e) => Coin.fromAmino(e)) || [];
    message.balance = object.balance?.map((e) => Coin.fromAmino(e)) || [];
    if (object.unbonding_id !== undefined && object.unbonding_id !== null) {
      message.unbondingId = BigInt(object.unbonding_id);
    }
    if (object.unbonding_on_hold_ref_count !== undefined && object.unbonding_on_hold_ref_count !== null) {
      message.unbondingOnHoldRefCount = BigInt(object.unbonding_on_hold_ref_count);
    }
    return message;
  },
  toAmino(message: UnbondingDelegationEntry): UnbondingDelegationEntryAmino {
    const obj: any = {};
    obj.creation_height = message.creationHeight !== BigInt(0) ? message.creationHeight.toString() : undefined;
    obj.completion_time = message.completionTime ? Timestamp.toAmino(toTimestamp(message.completionTime)) : undefined;
    if (message.initialBalance) {
      obj.initial_balance = message.initialBalance.map((e) => (e ? Coin.toAmino(e) : undefined));
    } else {
      obj.initial_balance = message.initialBalance;
    }
    if (message.balance) {
      obj.balance = message.balance.map((e) => (e ? Coin.toAmino(e) : undefined));
    } else {
      obj.balance = message.balance;
    }
    obj.unbonding_id = message.unbondingId !== BigInt(0) ? message.unbondingId.toString() : undefined;
    obj.unbonding_on_hold_ref_count =
      message.unbondingOnHoldRefCount !== BigInt(0) ? message.unbondingOnHoldRefCount.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: UnbondingDelegationEntryAminoMsg): UnbondingDelegationEntry {
    return UnbondingDelegationEntry.fromAmino(object.value);
  },
  fromProtoMsg(message: UnbondingDelegationEntryProtoMsg): UnbondingDelegationEntry {
    return UnbondingDelegationEntry.decode(message.value);
  },
  toProto(message: UnbondingDelegationEntry): Uint8Array {
    return UnbondingDelegationEntry.encode(message).finish();
  },
  toProtoMsg(message: UnbondingDelegationEntry): UnbondingDelegationEntryProtoMsg {
    return {
      typeUrl: '/initia.mstaking.v1.UnbondingDelegationEntry',
      value: UnbondingDelegationEntry.encode(message).finish(),
    };
  },
};
function createBaseRedelegationEntry(): RedelegationEntry {
  return {
    creationHeight: BigInt(0),
    completionTime: new Date(),
    initialBalance: [],
    sharesDst: [],
    unbondingId: BigInt(0),
    unbondingOnHoldRefCount: BigInt(0),
  };
}
export const RedelegationEntry = {
  typeUrl: '/initia.mstaking.v1.RedelegationEntry',
  encode(message: RedelegationEntry, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.creationHeight !== BigInt(0)) {
      writer.uint32(8).int64(message.creationHeight);
    }
    if (message.completionTime !== undefined) {
      Timestamp.encode(toTimestamp(message.completionTime), writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.initialBalance) {
      Coin.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.sharesDst) {
      DecCoin.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    if (message.unbondingId !== BigInt(0)) {
      writer.uint32(40).uint64(message.unbondingId);
    }
    if (message.unbondingOnHoldRefCount !== BigInt(0)) {
      writer.uint32(48).int64(message.unbondingOnHoldRefCount);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): RedelegationEntry {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRedelegationEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creationHeight = reader.int64();
          break;
        case 2:
          message.completionTime = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 3:
          message.initialBalance.push(Coin.decode(reader, reader.uint32()));
          break;
        case 4:
          message.sharesDst.push(DecCoin.decode(reader, reader.uint32()));
          break;
        case 5:
          message.unbondingId = reader.uint64();
          break;
        case 6:
          message.unbondingOnHoldRefCount = reader.int64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<RedelegationEntry>): RedelegationEntry {
    const message = createBaseRedelegationEntry();
    message.creationHeight =
      object.creationHeight !== undefined && object.creationHeight !== null
        ? BigInt(object.creationHeight.toString())
        : BigInt(0);
    message.completionTime = object.completionTime ?? undefined;
    message.initialBalance = object.initialBalance?.map((e) => Coin.fromPartial(e)) || [];
    message.sharesDst = object.sharesDst?.map((e) => DecCoin.fromPartial(e)) || [];
    message.unbondingId =
      object.unbondingId !== undefined && object.unbondingId !== null
        ? BigInt(object.unbondingId.toString())
        : BigInt(0);
    message.unbondingOnHoldRefCount =
      object.unbondingOnHoldRefCount !== undefined && object.unbondingOnHoldRefCount !== null
        ? BigInt(object.unbondingOnHoldRefCount.toString())
        : BigInt(0);
    return message;
  },
  fromAmino(object: RedelegationEntryAmino): RedelegationEntry {
    const message = createBaseRedelegationEntry();
    if (object.creation_height !== undefined && object.creation_height !== null) {
      message.creationHeight = BigInt(object.creation_height);
    }
    if (object.completion_time !== undefined && object.completion_time !== null) {
      message.completionTime = fromTimestamp(Timestamp.fromAmino(object.completion_time));
    }
    message.initialBalance = object.initial_balance?.map((e) => Coin.fromAmino(e)) || [];
    message.sharesDst = object.shares_dst?.map((e) => DecCoin.fromAmino(e)) || [];
    if (object.unbonding_id !== undefined && object.unbonding_id !== null) {
      message.unbondingId = BigInt(object.unbonding_id);
    }
    if (object.unbonding_on_hold_ref_count !== undefined && object.unbonding_on_hold_ref_count !== null) {
      message.unbondingOnHoldRefCount = BigInt(object.unbonding_on_hold_ref_count);
    }
    return message;
  },
  toAmino(message: RedelegationEntry): RedelegationEntryAmino {
    const obj: any = {};
    obj.creation_height = message.creationHeight !== BigInt(0) ? message.creationHeight.toString() : undefined;
    obj.completion_time = message.completionTime ? Timestamp.toAmino(toTimestamp(message.completionTime)) : undefined;
    if (message.initialBalance) {
      obj.initial_balance = message.initialBalance.map((e) => (e ? Coin.toAmino(e) : undefined));
    } else {
      obj.initial_balance = message.initialBalance;
    }
    if (message.sharesDst) {
      obj.shares_dst = message.sharesDst.map((e) => (e ? DecCoin.toAmino(e) : undefined));
    } else {
      obj.shares_dst = message.sharesDst;
    }
    obj.unbonding_id = message.unbondingId !== BigInt(0) ? message.unbondingId.toString() : undefined;
    obj.unbonding_on_hold_ref_count =
      message.unbondingOnHoldRefCount !== BigInt(0) ? message.unbondingOnHoldRefCount.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: RedelegationEntryAminoMsg): RedelegationEntry {
    return RedelegationEntry.fromAmino(object.value);
  },
  fromProtoMsg(message: RedelegationEntryProtoMsg): RedelegationEntry {
    return RedelegationEntry.decode(message.value);
  },
  toProto(message: RedelegationEntry): Uint8Array {
    return RedelegationEntry.encode(message).finish();
  },
  toProtoMsg(message: RedelegationEntry): RedelegationEntryProtoMsg {
    return {
      typeUrl: '/initia.mstaking.v1.RedelegationEntry',
      value: RedelegationEntry.encode(message).finish(),
    };
  },
};
function createBaseRedelegation(): Redelegation {
  return {
    delegatorAddress: '',
    validatorSrcAddress: '',
    validatorDstAddress: '',
    entries: [],
  };
}
export const Redelegation = {
  typeUrl: '/initia.mstaking.v1.Redelegation',
  encode(message: Redelegation, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.delegatorAddress !== '') {
      writer.uint32(10).string(message.delegatorAddress);
    }
    if (message.validatorSrcAddress !== '') {
      writer.uint32(18).string(message.validatorSrcAddress);
    }
    if (message.validatorDstAddress !== '') {
      writer.uint32(26).string(message.validatorDstAddress);
    }
    for (const v of message.entries) {
      RedelegationEntry.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Redelegation {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRedelegation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.delegatorAddress = reader.string();
          break;
        case 2:
          message.validatorSrcAddress = reader.string();
          break;
        case 3:
          message.validatorDstAddress = reader.string();
          break;
        case 4:
          message.entries.push(RedelegationEntry.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<Redelegation>): Redelegation {
    const message = createBaseRedelegation();
    message.delegatorAddress = object.delegatorAddress ?? '';
    message.validatorSrcAddress = object.validatorSrcAddress ?? '';
    message.validatorDstAddress = object.validatorDstAddress ?? '';
    message.entries = object.entries?.map((e) => RedelegationEntry.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: RedelegationAmino): Redelegation {
    const message = createBaseRedelegation();
    if (object.delegator_address !== undefined && object.delegator_address !== null) {
      message.delegatorAddress = object.delegator_address;
    }
    if (object.validator_src_address !== undefined && object.validator_src_address !== null) {
      message.validatorSrcAddress = object.validator_src_address;
    }
    if (object.validator_dst_address !== undefined && object.validator_dst_address !== null) {
      message.validatorDstAddress = object.validator_dst_address;
    }
    message.entries = object.entries?.map((e) => RedelegationEntry.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: Redelegation): RedelegationAmino {
    const obj: any = {};
    obj.delegator_address = message.delegatorAddress === '' ? undefined : message.delegatorAddress;
    obj.validator_src_address = message.validatorSrcAddress === '' ? undefined : message.validatorSrcAddress;
    obj.validator_dst_address = message.validatorDstAddress === '' ? undefined : message.validatorDstAddress;
    if (message.entries) {
      obj.entries = message.entries.map((e) => (e ? RedelegationEntry.toAmino(e) : undefined));
    } else {
      obj.entries = message.entries;
    }
    return obj;
  },
  fromAminoMsg(object: RedelegationAminoMsg): Redelegation {
    return Redelegation.fromAmino(object.value);
  },
  fromProtoMsg(message: RedelegationProtoMsg): Redelegation {
    return Redelegation.decode(message.value);
  },
  toProto(message: Redelegation): Uint8Array {
    return Redelegation.encode(message).finish();
  },
  toProtoMsg(message: Redelegation): RedelegationProtoMsg {
    return {
      typeUrl: '/initia.mstaking.v1.Redelegation',
      value: Redelegation.encode(message).finish(),
    };
  },
};
function createBaseParams(): Params {
  return {
    unbondingTime: Duration.fromPartial({}),
    maxValidators: 0,
    maxEntries: 0,
    historicalEntries: 0,
    bondDenoms: [],
    minVotingPower: BigInt(0),
    minCommissionRate: '',
  };
}
export const Params = {
  typeUrl: '/initia.mstaking.v1.Params',
  encode(message: Params, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.unbondingTime !== undefined) {
      Duration.encode(message.unbondingTime, writer.uint32(10).fork()).ldelim();
    }
    if (message.maxValidators !== 0) {
      writer.uint32(16).uint32(message.maxValidators);
    }
    if (message.maxEntries !== 0) {
      writer.uint32(24).uint32(message.maxEntries);
    }
    if (message.historicalEntries !== 0) {
      writer.uint32(32).uint32(message.historicalEntries);
    }
    for (const v of message.bondDenoms) {
      writer.uint32(42).string(v!);
    }
    if (message.minVotingPower !== BigInt(0)) {
      writer.uint32(48).uint64(message.minVotingPower);
    }
    if (message.minCommissionRate !== '') {
      writer.uint32(58).string(Decimal.fromUserInput(message.minCommissionRate, 18).atomics);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Params {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.unbondingTime = Duration.decode(reader, reader.uint32());
          break;
        case 2:
          message.maxValidators = reader.uint32();
          break;
        case 3:
          message.maxEntries = reader.uint32();
          break;
        case 4:
          message.historicalEntries = reader.uint32();
          break;
        case 5:
          message.bondDenoms.push(reader.string());
          break;
        case 6:
          message.minVotingPower = reader.uint64();
          break;
        case 7:
          message.minCommissionRate = Decimal.fromAtomics(reader.string(), 18).toString();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<Params>): Params {
    const message = createBaseParams();
    message.unbondingTime =
      object.unbondingTime !== undefined && object.unbondingTime !== null
        ? Duration.fromPartial(object.unbondingTime)
        : undefined;
    message.maxValidators = object.maxValidators ?? 0;
    message.maxEntries = object.maxEntries ?? 0;
    message.historicalEntries = object.historicalEntries ?? 0;
    message.bondDenoms = object.bondDenoms?.map((e) => e) || [];
    message.minVotingPower =
      object.minVotingPower !== undefined && object.minVotingPower !== null
        ? BigInt(object.minVotingPower.toString())
        : BigInt(0);
    message.minCommissionRate = object.minCommissionRate ?? '';
    return message;
  },
  fromAmino(object: ParamsAmino): Params {
    const message = createBaseParams();
    if (object.unbonding_time !== undefined && object.unbonding_time !== null) {
      message.unbondingTime = Duration.fromAmino(object.unbonding_time);
    }
    if (object.max_validators !== undefined && object.max_validators !== null) {
      message.maxValidators = object.max_validators;
    }
    if (object.max_entries !== undefined && object.max_entries !== null) {
      message.maxEntries = object.max_entries;
    }
    if (object.historical_entries !== undefined && object.historical_entries !== null) {
      message.historicalEntries = object.historical_entries;
    }
    message.bondDenoms = object.bond_denoms?.map((e) => e) || [];
    if (object.min_voting_power !== undefined && object.min_voting_power !== null) {
      message.minVotingPower = BigInt(object.min_voting_power);
    }
    if (object.min_commission_rate !== undefined && object.min_commission_rate !== null) {
      message.minCommissionRate = object.min_commission_rate;
    }
    return message;
  },
  toAmino(message: Params): ParamsAmino {
    const obj: any = {};
    obj.unbonding_time = message.unbondingTime ? Duration.toAmino(message.unbondingTime) : undefined;
    obj.max_validators = message.maxValidators === 0 ? undefined : message.maxValidators;
    obj.max_entries = message.maxEntries === 0 ? undefined : message.maxEntries;
    obj.historical_entries = message.historicalEntries === 0 ? undefined : message.historicalEntries;
    if (message.bondDenoms) {
      obj.bond_denoms = message.bondDenoms.map((e) => e);
    } else {
      obj.bond_denoms = message.bondDenoms;
    }
    obj.min_voting_power = message.minVotingPower !== BigInt(0) ? message.minVotingPower.toString() : undefined;
    obj.min_commission_rate = message.minCommissionRate === '' ? undefined : message.minCommissionRate;
    return obj;
  },
  fromAminoMsg(object: ParamsAminoMsg): Params {
    return Params.fromAmino(object.value);
  },
  fromProtoMsg(message: ParamsProtoMsg): Params {
    return Params.decode(message.value);
  },
  toProto(message: Params): Uint8Array {
    return Params.encode(message).finish();
  },
  toProtoMsg(message: Params): ParamsProtoMsg {
    return {
      typeUrl: '/initia.mstaking.v1.Params',
      value: Params.encode(message).finish(),
    };
  },
};
function createBaseDelegationResponse(): DelegationResponse {
  return {
    delegation: Delegation.fromPartial({}),
    balance: [],
  };
}
export const DelegationResponse = {
  typeUrl: '/initia.mstaking.v1.DelegationResponse',
  encode(message: DelegationResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.delegation !== undefined) {
      Delegation.encode(message.delegation, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.balance) {
      Coin.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): DelegationResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDelegationResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.delegation = Delegation.decode(reader, reader.uint32());
          break;
        case 2:
          message.balance.push(Coin.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<DelegationResponse>): DelegationResponse {
    const message = createBaseDelegationResponse();
    message.delegation =
      object.delegation !== undefined && object.delegation !== null
        ? Delegation.fromPartial(object.delegation)
        : undefined;
    message.balance = object.balance?.map((e) => Coin.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: DelegationResponseAmino): DelegationResponse {
    const message = createBaseDelegationResponse();
    if (object.delegation !== undefined && object.delegation !== null) {
      message.delegation = Delegation.fromAmino(object.delegation);
    }
    message.balance = object.balance?.map((e) => Coin.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: DelegationResponse): DelegationResponseAmino {
    const obj: any = {};
    obj.delegation = message.delegation ? Delegation.toAmino(message.delegation) : undefined;
    if (message.balance) {
      obj.balance = message.balance.map((e) => (e ? Coin.toAmino(e) : undefined));
    } else {
      obj.balance = message.balance;
    }
    return obj;
  },
  fromAminoMsg(object: DelegationResponseAminoMsg): DelegationResponse {
    return DelegationResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: DelegationResponseProtoMsg): DelegationResponse {
    return DelegationResponse.decode(message.value);
  },
  toProto(message: DelegationResponse): Uint8Array {
    return DelegationResponse.encode(message).finish();
  },
  toProtoMsg(message: DelegationResponse): DelegationResponseProtoMsg {
    return {
      typeUrl: '/initia.mstaking.v1.DelegationResponse',
      value: DelegationResponse.encode(message).finish(),
    };
  },
};
function createBaseRedelegationEntryResponse(): RedelegationEntryResponse {
  return {
    redelegationEntry: RedelegationEntry.fromPartial({}),
    balance: [],
  };
}
export const RedelegationEntryResponse = {
  typeUrl: '/initia.mstaking.v1.RedelegationEntryResponse',
  encode(message: RedelegationEntryResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.redelegationEntry !== undefined) {
      RedelegationEntry.encode(message.redelegationEntry, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.balance) {
      Coin.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): RedelegationEntryResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRedelegationEntryResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.redelegationEntry = RedelegationEntry.decode(reader, reader.uint32());
          break;
        case 2:
          message.balance.push(Coin.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<RedelegationEntryResponse>): RedelegationEntryResponse {
    const message = createBaseRedelegationEntryResponse();
    message.redelegationEntry =
      object.redelegationEntry !== undefined && object.redelegationEntry !== null
        ? RedelegationEntry.fromPartial(object.redelegationEntry)
        : undefined;
    message.balance = object.balance?.map((e) => Coin.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: RedelegationEntryResponseAmino): RedelegationEntryResponse {
    const message = createBaseRedelegationEntryResponse();
    if (object.redelegation_entry !== undefined && object.redelegation_entry !== null) {
      message.redelegationEntry = RedelegationEntry.fromAmino(object.redelegation_entry);
    }
    message.balance = object.balance?.map((e) => Coin.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: RedelegationEntryResponse): RedelegationEntryResponseAmino {
    const obj: any = {};
    obj.redelegation_entry = message.redelegationEntry
      ? RedelegationEntry.toAmino(message.redelegationEntry)
      : undefined;
    if (message.balance) {
      obj.balance = message.balance.map((e) => (e ? Coin.toAmino(e) : undefined));
    } else {
      obj.balance = message.balance;
    }
    return obj;
  },
  fromAminoMsg(object: RedelegationEntryResponseAminoMsg): RedelegationEntryResponse {
    return RedelegationEntryResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: RedelegationEntryResponseProtoMsg): RedelegationEntryResponse {
    return RedelegationEntryResponse.decode(message.value);
  },
  toProto(message: RedelegationEntryResponse): Uint8Array {
    return RedelegationEntryResponse.encode(message).finish();
  },
  toProtoMsg(message: RedelegationEntryResponse): RedelegationEntryResponseProtoMsg {
    return {
      typeUrl: '/initia.mstaking.v1.RedelegationEntryResponse',
      value: RedelegationEntryResponse.encode(message).finish(),
    };
  },
};
function createBaseRedelegationResponse(): RedelegationResponse {
  return {
    redelegation: Redelegation.fromPartial({}),
    entries: [],
  };
}
export const RedelegationResponse = {
  typeUrl: '/initia.mstaking.v1.RedelegationResponse',
  encode(message: RedelegationResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.redelegation !== undefined) {
      Redelegation.encode(message.redelegation, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.entries) {
      RedelegationEntryResponse.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): RedelegationResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRedelegationResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.redelegation = Redelegation.decode(reader, reader.uint32());
          break;
        case 2:
          message.entries.push(RedelegationEntryResponse.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<RedelegationResponse>): RedelegationResponse {
    const message = createBaseRedelegationResponse();
    message.redelegation =
      object.redelegation !== undefined && object.redelegation !== null
        ? Redelegation.fromPartial(object.redelegation)
        : undefined;
    message.entries = object.entries?.map((e) => RedelegationEntryResponse.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: RedelegationResponseAmino): RedelegationResponse {
    const message = createBaseRedelegationResponse();
    if (object.redelegation !== undefined && object.redelegation !== null) {
      message.redelegation = Redelegation.fromAmino(object.redelegation);
    }
    message.entries = object.entries?.map((e) => RedelegationEntryResponse.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: RedelegationResponse): RedelegationResponseAmino {
    const obj: any = {};
    obj.redelegation = message.redelegation ? Redelegation.toAmino(message.redelegation) : undefined;
    if (message.entries) {
      obj.entries = message.entries.map((e) => (e ? RedelegationEntryResponse.toAmino(e) : undefined));
    } else {
      obj.entries = message.entries;
    }
    return obj;
  },
  fromAminoMsg(object: RedelegationResponseAminoMsg): RedelegationResponse {
    return RedelegationResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: RedelegationResponseProtoMsg): RedelegationResponse {
    return RedelegationResponse.decode(message.value);
  },
  toProto(message: RedelegationResponse): Uint8Array {
    return RedelegationResponse.encode(message).finish();
  },
  toProtoMsg(message: RedelegationResponse): RedelegationResponseProtoMsg {
    return {
      typeUrl: '/initia.mstaking.v1.RedelegationResponse',
      value: RedelegationResponse.encode(message).finish(),
    };
  },
};
function createBasePool(): Pool {
  return {
    notBondedTokens: [],
    bondedTokens: [],
    votingPowerWeights: [],
  };
}
export const Pool = {
  typeUrl: '/initia.mstaking.v1.Pool',
  encode(message: Pool, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.notBondedTokens) {
      Coin.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.bondedTokens) {
      Coin.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.votingPowerWeights) {
      DecCoin.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Pool {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePool();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.notBondedTokens.push(Coin.decode(reader, reader.uint32()));
          break;
        case 2:
          message.bondedTokens.push(Coin.decode(reader, reader.uint32()));
          break;
        case 3:
          message.votingPowerWeights.push(DecCoin.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<Pool>): Pool {
    const message = createBasePool();
    message.notBondedTokens = object.notBondedTokens?.map((e) => Coin.fromPartial(e)) || [];
    message.bondedTokens = object.bondedTokens?.map((e) => Coin.fromPartial(e)) || [];
    message.votingPowerWeights = object.votingPowerWeights?.map((e) => DecCoin.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: PoolAmino): Pool {
    const message = createBasePool();
    message.notBondedTokens = object.not_bonded_tokens?.map((e) => Coin.fromAmino(e)) || [];
    message.bondedTokens = object.bonded_tokens?.map((e) => Coin.fromAmino(e)) || [];
    message.votingPowerWeights = object.voting_power_weights?.map((e) => DecCoin.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: Pool): PoolAmino {
    const obj: any = {};
    if (message.notBondedTokens) {
      obj.not_bonded_tokens = message.notBondedTokens.map((e) => (e ? Coin.toAmino(e) : undefined));
    } else {
      obj.not_bonded_tokens = message.notBondedTokens;
    }
    if (message.bondedTokens) {
      obj.bonded_tokens = message.bondedTokens.map((e) => (e ? Coin.toAmino(e) : undefined));
    } else {
      obj.bonded_tokens = message.bondedTokens;
    }
    if (message.votingPowerWeights) {
      obj.voting_power_weights = message.votingPowerWeights.map((e) => (e ? DecCoin.toAmino(e) : undefined));
    } else {
      obj.voting_power_weights = message.votingPowerWeights;
    }
    return obj;
  },
  fromAminoMsg(object: PoolAminoMsg): Pool {
    return Pool.fromAmino(object.value);
  },
  fromProtoMsg(message: PoolProtoMsg): Pool {
    return Pool.decode(message.value);
  },
  toProto(message: Pool): Uint8Array {
    return Pool.encode(message).finish();
  },
  toProtoMsg(message: Pool): PoolProtoMsg {
    return {
      typeUrl: '/initia.mstaking.v1.Pool',
      value: Pool.encode(message).finish(),
    };
  },
};
export const Cosmos_cryptoPubKey_InterfaceDecoder = (input: BinaryReader | Uint8Array): Any => {
  const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
  const data = Any.decode(reader, reader.uint32());
  switch (data.typeUrl) {
    default:
      return data;
  }
};
export const Cosmos_cryptoPubKey_FromAmino = (content: AnyAmino): Any => {
  return encodePubkey(content);
};
export const Cosmos_cryptoPubKey_ToAmino = (content: Any): Pubkey | null => {
  return decodePubkey(content);
};