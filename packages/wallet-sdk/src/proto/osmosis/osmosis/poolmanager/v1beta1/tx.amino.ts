/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import {
  MsgSplitRouteSwapExactAmountIn,
  MsgSplitRouteSwapExactAmountOut,
  MsgSwapExactAmountIn,
  MsgSwapExactAmountOut,
} from './tx';
export const AminoConverter = {
  '/osmosis.poolmanager.v1beta1.MsgSwapExactAmountIn': {
    aminoType: 'osmosis/poolmanager/swap-exact-amount-in',
    toAmino: MsgSwapExactAmountIn.toAmino,
    fromAmino: MsgSwapExactAmountIn.fromAmino,
  },
  '/osmosis.poolmanager.v1beta1.MsgSwapExactAmountOut': {
    aminoType: 'osmosis/poolmanager/swap-exact-amount-out',
    toAmino: MsgSwapExactAmountOut.toAmino,
    fromAmino: MsgSwapExactAmountOut.fromAmino,
  },
  '/osmosis.poolmanager.v1beta1.MsgSplitRouteSwapExactAmountIn': {
    aminoType: 'osmosis/poolmanager/split-amount-in',
    toAmino: MsgSplitRouteSwapExactAmountIn.toAmino,
    fromAmino: MsgSplitRouteSwapExactAmountIn.fromAmino,
  },
  '/osmosis.poolmanager.v1beta1.MsgSplitRouteSwapExactAmountOut': {
    aminoType: 'osmosis/poolmanager/split-amount-out',
    toAmino: MsgSplitRouteSwapExactAmountOut.toAmino,
    fromAmino: MsgSplitRouteSwapExactAmountOut.fromAmino,
  },
};
