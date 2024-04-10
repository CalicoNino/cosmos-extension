import {
  currencyDetail,
  formatTokenAmount,
  IbcChainInfo,
  sliceWord,
  useUserPreferredCurrency,
} from '@leapwallet/cosmos-wallet-hooks'
import { GenericCard } from '@leapwallet/leap-ui'
import BigNumber from 'bignumber.js'
import Badge from 'components/badge/Badge'
import IBCTokenBadge from 'components/badge/IbcTokenBadge'
import { useFormatCurrency } from 'hooks/settings/useCurrency'
import { useHideAssets } from 'hooks/settings/useHideAssets'
import { useDefaultTokenLogo } from 'hooks/utility/useDefaultTokenLogo'
import React from 'react'
import { imgOnError } from 'utils/imgOnError'

type TokenCardProps = {
  readonly title: string
  readonly usdValue: string | undefined
  readonly amount: string
  readonly symbol: string
  readonly assetImg: string | undefined
  readonly isRounded: boolean
  readonly onClick?: () => void
  readonly cardClassName?: string
  readonly isIconVisible?: boolean
  readonly iconSrc?: string
  readonly size?: 'sm' | 'md' | 'lg'
  readonly ibcChainInfo?: IbcChainInfo | undefined
  readonly hasToShowIbcTag?: boolean
  readonly hasToShowEvmTag?: boolean
  readonly isEvm?: boolean
  readonly hideAmount?: boolean
}

export function TokenCard({
  title,
  ibcChainInfo,
  usdValue,
  amount,
  symbol,
  assetImg,
  isRounded,
  onClick,
  cardClassName,
  isIconVisible,
  iconSrc,
  size,
  hasToShowIbcTag,
  hasToShowEvmTag,
  isEvm,
  hideAmount = false,
}: TokenCardProps) {
  const [formatCurrency] = useFormatCurrency()
  const { formatHideBalance } = useHideAssets()

  const defaultTokenLogo = useDefaultTokenLogo()
  const [preferredCurrency] = useUserPreferredCurrency()
  const formattedFiatValue = usdValue ? formatCurrency(new BigNumber(usdValue)) : '-'

  return (
    <GenericCard
      title={
        <h3 className='text-md text-ellipsis overflow-hidden whitespace-nowrap' title={title}>
          {sliceWord(title, 7, 4)}
        </h3>
      }
      subtitle={
        <div className='flex space-x-2 font-normal text-gray-400'>
          {ibcChainInfo && !hasToShowIbcTag ? (
            <IBCTokenBadge
              text={`${ibcChainInfo.pretty_name} / ${sliceWord(
                ibcChainInfo?.channelId ?? '',
                7,
                5,
              )}`}
            />
          ) : null}

          {ibcChainInfo && hasToShowIbcTag ? <Badge text='IBC' /> : null}
          {isEvm && hasToShowEvmTag ? <Badge text='EVM' /> : null}
        </div>
      }
      title2={
        formattedFiatValue &&
        formattedFiatValue !== '-' && (
          <div className='text-md text-gray-600 dark:text-gray-200 font-medium'>
            {formatHideBalance(formattedFiatValue)}
          </div>
        )
      }
      subtitle2={
        hideAmount === false && (
          <p className='whitespace-nowrap text-gray-400 font-medium text-xs'>
            {formatHideBalance(
              formatTokenAmount(
                amount,
                sliceWord(symbol, 4, 4),
                3,
                currencyDetail[preferredCurrency].locale,
              ),
            )}
          </p>
        )
      }
      img={
        <img
          src={assetImg ?? defaultTokenLogo}
          className='w-[28px] h-[28px] mr-2 border rounded-full dark:border-[#333333] border-[#cccccc]'
          onError={imgOnError(defaultTokenLogo)}
        />
      }
      icon={<img className={`w-5 h-5 ml-2 ${isIconVisible ? '' : 'hidden'}`} src={iconSrc} />}
      isRounded={isRounded}
      className={cardClassName}
      onClick={onClick}
      size={size}
    />
  )
}
