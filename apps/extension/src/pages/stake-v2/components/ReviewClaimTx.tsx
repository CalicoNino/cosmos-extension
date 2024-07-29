import { formatTokenAmount, sliceWord, useValidatorImage } from '@leapwallet/cosmos-wallet-hooks'
import {
  FeeTokenData,
  useActiveStakingDenom,
  useStakeTx,
  useStaking,
} from '@leapwallet/cosmos-wallet-hooks'
import { Validator } from '@leapwallet/cosmos-wallet-sdk'
import { Buttons, Card } from '@leapwallet/leap-ui'
import BigNumber from 'bignumber.js'
import BottomModal from 'components/bottom-modal'
import { LoaderAnimation } from 'components/loader/Loader'
import { useFormatCurrency } from 'hooks/settings/useCurrency'
import { useHideAssets } from 'hooks/settings/useHideAssets'
import { useDefaultTokenLogo } from 'hooks/utility/useDefaultTokenLogo'
import { Wallet } from 'hooks/wallet/useWallet'
import { Images } from 'images'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Colors } from 'theme/colors'
import { imgOnError } from 'utils/imgOnError'
import useGetWallet = Wallet.useGetWallet
import GasPriceOptions, { useDefaultGasPrice } from 'components/gas-price-options'
import { GasPriceOptionValue } from 'components/gas-price-options/context'
import { DisplayFee } from 'components/gas-price-options/display-fee'
import { FeesSettingsSheet } from 'components/gas-price-options/fees-settings-sheet'
import LedgerConfirmationPopup from 'components/ledger-confirmation/LedgerConfirmationPopup'
import Text from 'components/text'
import { EventName } from 'config/analytics'
import { useCaptureTxError } from 'hooks/utility/useCaptureTxError'
import mixpanel from 'mixpanel-browser'

import { StakeTxnPageState } from '../StakeTxnPage'

interface ReviewClaimTxProps {
  isOpen: boolean
  onClose: () => void
  validator?: Validator
  validators?: Record<string, Validator>
}
export default function ReviewClaimTx({
  isOpen,
  onClose,
  validator,
  validators,
}: ReviewClaimTxProps) {
  const getWallet = useGetWallet()
  const defaultGasPrice = useDefaultGasPrice()

  const [formatCurrency] = useFormatCurrency()
  const { formatHideBalance } = useHideAssets()
  const defaultTokenLogo = useDefaultTokenLogo()
  const [activeStakingDenom] = useActiveStakingDenom()

  const { delegations, totalRewardsDollarAmt, rewards, totalRewards } = useStaking()
  const {
    showLedgerPopup,
    onReviewTransaction,
    isLoading,
    error,
    setAmount,
    recommendedGasLimit,
    userPreferredGasLimit,
    setUserPreferredGasLimit,
    gasOption,
    setGasOption,
    userPreferredGasPrice,
    setFeeDenom,
    ledgerError,
    setLedgerError,
    customFee,
    feeDenom,
  } = useStakeTx(
    'CLAIM_REWARDS',
    validator as Validator,
    undefined,
    Object.values(delegations ?? {}),
  )

  const [showFeesSettingSheet, setShowFeesSettingSheet] = useState<boolean>(false)
  const [gasError, setGasError] = useState<string | null>(null)
  const [gasPriceOption, setGasPriceOption] = useState<GasPriceOptionValue>({
    option: gasOption,
    gasPrice: userPreferredGasPrice ?? defaultGasPrice.gasPrice,
  })
  const navigate = useNavigate()

  const rewardValidators = useMemo(() => {
    if (rewards && validators) {
      return rewards.rewards.map((reward) => validators[reward.validator_address])
    }
  }, [rewards, validators])
  const { data: imageUrl } = useValidatorImage(rewardValidators && rewardValidators[0])

  const nativeTokenReward = useMemo(() => {
    if (rewards) {
      return rewards?.total?.find((token) => token.denom === activeStakingDenom.coinMinimalDenom)
    }
  }, [activeStakingDenom.coinMinimalDenom, rewards])

  useCaptureTxError(error)
  useEffect(() => {
    setAmount(nativeTokenReward?.amount ?? '0')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalRewards])

  const onGasPriceOptionChange = useCallback(
    (value: GasPriceOptionValue, feeBaseDenom: FeeTokenData) => {
      setGasPriceOption(value)
      setFeeDenom(feeBaseDenom.denom)
      if (value.option) {
        setGasOption(value.option)
      }
    },
    [setFeeDenom, setGasOption],
  )

  const handleCloseFeeSettingSheet = useCallback(() => {
    setShowFeesSettingSheet(false)
  }, [])

  const formattedTokenAmount = useMemo(() => {
    return formatHideBalance(
      `${formatTokenAmount(nativeTokenReward?.amount ?? '', activeStakingDenom.coinDenom)} ${
        rewards?.total?.length > 1 ? `+${rewards.total.length - 1} more` : ''
      }`,
    )
  }, [
    activeStakingDenom.coinDenom,
    formatHideBalance,
    nativeTokenReward?.amount,
    rewards?.total.length,
  ])

  const titleText = useMemo(() => {
    if (new BigNumber(totalRewardsDollarAmt).gt(0)) {
      return formatHideBalance(formatCurrency(new BigNumber(totalRewardsDollarAmt)))
    } else {
      return formattedTokenAmount
    }
  }, [formatCurrency, formatHideBalance, formattedTokenAmount, totalRewardsDollarAmt])

  const subTitleText = useMemo(() => {
    if (new BigNumber(totalRewardsDollarAmt).gt(0)) {
      return formattedTokenAmount
    }
    return ''
  }, [formattedTokenAmount, totalRewardsDollarAmt])

  const txCallback = useCallback(() => {
    navigate('/stake-pending-txn', {
      state: {
        validator: rewardValidators && rewardValidators[0],
        mode: 'CLAIM_REWARDS',
      } as StakeTxnPageState,
    })
    mixpanel.track(EventName.TransactionSigned, {
      transactionType: 'stake_claim',
    })
  }, [navigate, rewardValidators])

  const onClaimRewardsClick = useCallback(async () => {
    try {
      const wallet = await getWallet()
      onReviewTransaction(wallet, txCallback, false, {
        stdFee: customFee,
        feeDenom: feeDenom,
      })
    } catch (error) {
      const _error = error as Error
      setLedgerError(_error.message)

      setTimeout(() => {
        setLedgerError('')
      }, 6000)
    }
  }, [customFee, feeDenom, getWallet, onReviewTransaction, setLedgerError, txCallback])

  return (
    <GasPriceOptions
      recommendedGasLimit={recommendedGasLimit}
      gasLimit={userPreferredGasLimit?.toString() ?? recommendedGasLimit}
      setGasLimit={(value: number) => setUserPreferredGasLimit(Number(value.toString()))}
      gasPriceOption={gasPriceOption}
      onGasPriceOptionChange={onGasPriceOptionChange}
      error={gasError}
      setError={setGasError}
    >
      <BottomModal
        isOpen={isOpen}
        onClose={onClose}
        title='Review Transaction'
        closeOnBackdropClick={true}
        className='p-6'
      >
        <div className='flex flex-col gap-y-6'>
          <div className='flex flex-col items-center w-full gap-y-4'>
            <Card
              className='bg-white-100 dark:bg-gray-950'
              avatar={
                <img
                  src={activeStakingDenom.icon}
                  onError={imgOnError(defaultTokenLogo)}
                  width={36}
                  height={36}
                  className='rounded-full'
                />
              }
              isRounded
              size='md'
              title={
                <Text
                  size='sm'
                  color='text-black-100 dark:text-white-100'
                  className='font-bold mb-0.5'
                >
                  {titleText}
                </Text>
              }
              subtitle={
                <Text size='xs' color='text-gray-600 dark:text-gray-400' className='font-medium'>
                  {subTitleText}
                </Text>
              }
            />
            <Card
              className='bg-white-100 dark:bg-gray-950'
              avatar={
                <img
                  src={
                    imageUrl ??
                    (rewardValidators && rewardValidators[0]?.image) ??
                    Images.Misc.Validator
                  }
                  onError={imgOnError(Images.Misc.Validator)}
                  width={36}
                  height={36}
                  className='rounded-full'
                />
              }
              isRounded
              size='md'
              title={
                <Text
                  size='sm'
                  color='text-black-100 dark:text-white-100'
                  className='font-bold mb-0.5'
                >
                  {rewardValidators && sliceWord(rewardValidators[0]?.moniker, 10, 3)}
                </Text>
              }
              subtitle={
                <Text size='xs' color='text-gray-600 dark:text-gray-400' className='font-medium'>
                  {rewardValidators &&
                    (rewardValidators.length > 1
                      ? `+${rewardValidators.length - 1} more validators`
                      : '')}
                </Text>
              }
            />
          </div>
          <div className='flex flex-col items-center w-full gap-y-2'>
            <DisplayFee setShowFeesSettingSheet={setShowFeesSettingSheet} />

            {ledgerError && <p className='text-sm font-bold text-red-300 px-2'>{ledgerError}</p>}
            {error && <p className='text-sm font-bold text-red-300 px-2'>{error}</p>}
            {gasError && !showFeesSettingSheet && (
              <p className='text-sm font-bold text-red-300 px-2'>{gasError}</p>
            )}

            <Buttons.Generic
              color={Colors.green600}
              size='normal'
              disabled={isLoading || !!error || !!gasError || showLedgerPopup || !!ledgerError}
              className='w-full'
              onClick={onClaimRewardsClick}
            >
              {isLoading ? <LoaderAnimation color={Colors.white100} /> : 'Confirm Claim'}
            </Buttons.Generic>
          </div>
        </div>
      </BottomModal>
      {showLedgerPopup && <LedgerConfirmationPopup showLedgerPopup={showLedgerPopup} />}
      <FeesSettingsSheet
        showFeesSettingSheet={showFeesSettingSheet}
        onClose={handleCloseFeeSettingSheet}
        gasError={gasError}
      />
    </GasPriceOptions>
  )
}
