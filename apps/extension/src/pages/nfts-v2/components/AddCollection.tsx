import {
  BETA_EVM_NFT_TOKEN_IDS,
  BETA_NFT_CHAINS,
  BETA_NFTS_COLLECTIONS,
  ENABLED_NFTS_COLLECTIONS,
  NftChain,
  normalizeImageSrc,
  StoredBetaNftCollection,
  useBetaEvmNftTokenIdsStore,
  useBetaNFTsCollectionsStore,
  useChainApis,
  useDisabledNFTsCollections,
  useEnabledNftsCollectionsStore,
  useIsSeiEvmChain,
  useNftChains,
  useNftChainsStore,
  useSelectedNetwork,
  useSetDisabledNFTsInStorage,
} from '@leapwallet/cosmos-wallet-hooks'
import { CosmWasmClientHandler } from '@leapwallet/cosmos-wallet-hooks/dist/utils/useCosmWasmClient'
import {
  getNftBalanceCount,
  getNftContractInfo,
  getNftTokenIdInfo,
  SupportedChain,
} from '@leapwallet/cosmos-wallet-sdk'
import { GenericCard } from '@leapwallet/leap-ui'
import classNames from 'classnames'
import BottomModal from 'components/bottom-modal'
import { InputComponent } from 'components/input-component/InputComponent'
import { LoaderAnimation } from 'components/loader/Loader'
import Text from 'components/text'
import { AGGREGATED_CHAIN_KEY } from 'config/constants'
import { useActiveChain } from 'hooks/settings/useActiveChain'
import { useChainInfos } from 'hooks/useChainInfos'
import { useDontShowSelectChain } from 'hooks/useDontShowSelectChain'
import { useGetWalletAddresses } from 'hooks/useGetWalletAddresses'
import { useDefaultTokenLogo } from 'hooks/utility/useDefaultTokenLogo'
import { Images } from 'images'
import { SelectChainSheet } from 'pages/home/side-nav/CustomEndpoints'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AggregatedSupportedChain } from 'types/utility'
import { getChainName } from 'utils/getChainName'
import { imgOnError } from 'utils/imgOnError'
import { isCompassWallet } from 'utils/isCompassWallet'
import Browser from 'webextension-polyfill'

import { useNftContext } from '../context'
import { ManageCollectionsProps, NftAvatar, NftToggleCard, Text as NftText } from './index'

type AddCollectionProps = Omit<ManageCollectionsProps, 'openAddCollectionSheet'>

export function AddCollection({ isVisible, onClose }: AddCollectionProps) {
  const chainInfos = useChainInfos()
  let activeChain = useActiveChain()
  if ((activeChain as AggregatedSupportedChain) === AGGREGATED_CHAIN_KEY) {
    activeChain = 'cosmos'
  }

  const activeNetwork = useSelectedNetwork()
  const defaultTokenLogo = useDefaultTokenLogo()
  const timeoutIdRef = useRef<NodeJS.Timeout>()
  const { setTriggerRerender } = useNftContext()

  const [showSelectChain, setShowSelectChain] = useState(false)
  const [enteredCollection, setEnteredCollection] = useState('')
  const [enteredTokenId, setEnteredTokenId] = useState('')
  const [selectedChain, setSelectedChain] = useState<SupportedChain>(
    isCompassWallet() ? activeChain : ('' as SupportedChain),
  )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [nftInfo, setNftInfo] = useState<{ [key: string]: any }>({})
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [fetchingCollectionInfo, setFetchingCollectionInfo] = useState(false)

  const nftChains = useNftChains()
  const disabledNFTsCollections = useDisabledNFTsCollections()
  const setDisabledNFTsCollections = useSetDisabledNFTsInStorage()
  const { setNftChains } = useNftChainsStore()
  const { setBetaNFTsCollections } = useBetaNFTsCollectionsStore()
  const { enabledNftsCollections, setEnabledNftsCollections } = useEnabledNftsCollectionsStore()
  const { setBetaEvmNftTokenIds } = useBetaEvmNftTokenIdsStore()

  const chain = useMemo(
    () => (selectedChain ? selectedChain : activeChain),
    [activeChain, selectedChain],
  )
  const forceNetwork = useMemo(() => {
    if (activeChain === 'seiDevnet') {
      return 'mainnet'
    }

    if (isCompassWallet()) {
      return activeNetwork
    }

    return chainInfos[chain].chainId === chainInfos[chain].testnetChainId ? 'testnet' : 'mainnet'
  }, [activeChain, activeNetwork, chain, chainInfos])

  const walletAddresses = useGetWalletAddresses(selectedChain)
  const { rpcUrl, evmJsonRpc } = useChainApis(chain, forceNetwork)
  const isSeiEvmChain = useIsSeiEvmChain()

  const dontShowSelectChain = useDontShowSelectChain()
  const showTokenIdInput = useMemo(() => {
    return enteredCollection.length > 0 && enteredCollection.toLowerCase().startsWith('0x')
  }, [enteredCollection])

  useEffect(() => {
    setSelectedChain(isCompassWallet() ? activeChain : ('' as SupportedChain))
  }, [activeChain])

  useEffect(() => {
    let isCancelled = false

    if (
      enteredCollection.length !== 0 &&
      (showTokenIdInput ? enteredTokenId.length !== 0 : true) &&
      rpcUrl &&
      selectedChain
    ) {
      clearTimeout(timeoutIdRef.current)

      timeoutIdRef.current = setTimeout(async () => {
        try {
          setErrors({})
          setNftInfo({})
          setFetchingCollectionInfo(true)
          let tokens = []
          let contractInfo = { name: '' }

          if (isSeiEvmChain && enteredCollection.toLowerCase().startsWith('0x') && evmJsonRpc) {
            const address = walletAddresses[0].toLowerCase().startsWith('0x')
              ? walletAddresses[0]
              : walletAddresses[1]

            const [_contractInfo, balanceCount, tokenIdInfo] = await Promise.all([
              getNftContractInfo(enteredCollection, evmJsonRpc),
              getNftBalanceCount(enteredCollection, address, evmJsonRpc),
              getNftTokenIdInfo(enteredCollection, enteredTokenId, address, evmJsonRpc),
            ])

            if (isCancelled) return
            const tempContractInfo: { name: string; image?: string } = _contractInfo
            const res = await fetch(normalizeImageSrc(tokenIdInfo.tokenURI))
            const nftDisplayInfo = await JSON.parse((await res.text()).trim())

            if (isCancelled) return
            if (nftDisplayInfo.image) {
              tempContractInfo.image = nftDisplayInfo.image
            }

            contractInfo = _contractInfo
            Number(balanceCount) && (tokens = [balanceCount])
          } else {
            const client = await CosmWasmClientHandler.getClient(rpcUrl)
            const address = walletAddresses[0].toLowerCase().startsWith('0x')
              ? walletAddresses[1]
              : walletAddresses[0]

            if (isCancelled) return
            const [tokenInfo, _contractInfo] = await Promise.all([
              client.queryContractSmart(enteredCollection, {
                tokens: { owner: address, limit: 2 },
              }),
              client.queryContractSmart(enteredCollection, {
                contract_info: {},
              }),
            ])

            if (isCancelled) return
            contractInfo = _contractInfo
            tokens = tokenInfo?.tokens ?? tokenInfo?.ids ?? []
          }

          if (tokens.length === 0) {
            setErrors((prevValue) => ({
              ...prevValue,
              noTokens: "Couldn't enable collection. You don't have any NFT in this collection.",
            }))
          }

          setNftInfo({ contractInfo, enable: false })
        } catch (error) {
          if (isCancelled) return

          if ((error as Error).message.toLowerCase().includes('token does not belong')) {
            setErrors((prevValue) => ({
              ...prevValue,
              tokenId: (error as Error).message,
            }))
          } else {
            setErrors((prevValue) => ({ ...prevValue, collection: 'Invalid collection address.' }))
          }
        } finally {
          setFetchingCollectionInfo(false)
        }
      }, 200)
    }

    return () => {
      isCancelled = true
    }
  }, [
    enteredCollection,
    walletAddresses,
    rpcUrl,
    selectedChain,
    isSeiEvmChain,
    evmJsonRpc,
    showTokenIdInput,
    enteredTokenId,
  ])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim()
    setEnteredCollection(value)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (value && selectedChain === '') {
      setErrors({ selectedChain: 'Please select a chain' })
    } else {
      setErrors({})
    }
  }

  const handleTokenIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim()
    setErrors({})
    setEnteredTokenId(value)
  }

  const updateBetaEvmNftTokenIds = async () => {
    const storage = await Browser.storage.local.get([BETA_EVM_NFT_TOKEN_IDS])
    const address = walletAddresses[0].toLowerCase().startsWith('0x')
      ? walletAddresses[0]
      : walletAddresses[1]

    if (storage[BETA_EVM_NFT_TOKEN_IDS]) {
      const betaEvmNftTokenIds = JSON.parse(storage[BETA_EVM_NFT_TOKEN_IDS] ?? '{}')
      const newStorageInfo = {
        ...betaEvmNftTokenIds,
        [enteredCollection]: {
          ...betaEvmNftTokenIds[enteredCollection],
          [address]: [...(betaEvmNftTokenIds[enteredCollection]?.[address] ?? []), enteredTokenId],
        },
      }

      await Browser.storage.local.set({ [BETA_EVM_NFT_TOKEN_IDS]: JSON.stringify(newStorageInfo) })
      setBetaEvmNftTokenIds(newStorageInfo)
    } else {
      const newStorageInfo = {
        [enteredCollection]: {
          [address]: [enteredTokenId],
        },
      }

      await Browser.storage.local.set({ [BETA_EVM_NFT_TOKEN_IDS]: JSON.stringify(newStorageInfo) })
      setBetaEvmNftTokenIds(newStorageInfo)
    }
  }

  const handleToggleClick = async (isEnabled: boolean) => {
    setNftInfo((prevValue) => ({ ...prevValue, enable: isEnabled }))

    const existingEnabledNftsCollections = enabledNftsCollections?.[selectedChain] ?? []
    let _disabledNFTsCollections: string[] = []
    let _enabledNftsCollections: string[] = []
    let hasToSetInfo = true

    if (isEnabled) {
      _disabledNFTsCollections = disabledNFTsCollections.filter(
        (collection) => collection !== enteredCollection,
      )

      if (isCompassWallet() && !existingEnabledNftsCollections.includes(enteredCollection)) {
        _enabledNftsCollections = [...existingEnabledNftsCollections, enteredCollection]
      }

      const storage = await Browser.storage.local.get([
        BETA_NFTS_COLLECTIONS,
        BETA_NFT_CHAINS,
        BETA_EVM_NFT_TOKEN_IDS,
      ])
      if (storage[BETA_NFTS_COLLECTIONS]) {
        const parsedData: StoredBetaNftCollection[] =
          JSON.parse(storage[BETA_NFTS_COLLECTIONS])?.[selectedChain]?.[forceNetwork] ?? []

        if (parsedData.some((collection) => collection.address === enteredCollection)) {
          if (enteredCollection.toLowerCase().startsWith('0x')) {
            const betaEvmNftTokenIds = JSON.parse(storage[BETA_EVM_NFT_TOKEN_IDS] ?? '{}')
            const address = walletAddresses[0].toLowerCase().startsWith('0x')
              ? walletAddresses[0]
              : walletAddresses[1]

            if (betaEvmNftTokenIds?.[enteredCollection]?.[address]?.includes(enteredTokenId)) {
              hasToSetInfo = false
            }
          } else {
            hasToSetInfo = false
          }
        }
      }
    } else {
      if (!_disabledNFTsCollections.includes(enteredCollection)) {
        _disabledNFTsCollections = [...disabledNFTsCollections, enteredCollection]
      }

      if (isCompassWallet()) {
        _enabledNftsCollections = existingEnabledNftsCollections.filter(
          (collection) => collection !== enteredCollection,
        )
      }
    }

    await setDisabledNFTsCollections(_disabledNFTsCollections)

    if (isCompassWallet()) {
      setEnabledNftsCollections({
        ...enabledNftsCollections,
        [selectedChain]: _enabledNftsCollections,
      })
      await Browser.storage.local.set({
        [ENABLED_NFTS_COLLECTIONS]: JSON.stringify({
          ...enabledNftsCollections,
          [selectedChain]: _enabledNftsCollections,
        }),
      })
    }

    if (hasToSetInfo) {
      const storage = await Browser.storage.local.get([
        BETA_NFTS_COLLECTIONS,
        BETA_NFT_CHAINS,
        BETA_EVM_NFT_TOKEN_IDS,
      ])

      const newCollection = {
        address: enteredCollection,
        name: nftInfo?.contractInfo?.name ?? 'Unknown',
        image: nftInfo?.contractInfo?.image ?? '',
      }

      if (storage[BETA_NFTS_COLLECTIONS]) {
        const parsedData = JSON.parse(storage[BETA_NFTS_COLLECTIONS])

        if (
          !parsedData?.[selectedChain]?.[forceNetwork]?.some(
            (collection: StoredBetaNftCollection) => collection.address === enteredCollection,
          )
        ) {
          const newStorageInfo = {
            ...parsedData,
            [selectedChain]: {
              ...(parsedData[selectedChain] ?? {}),
              [forceNetwork]: [...(parsedData[selectedChain]?.[forceNetwork] ?? []), newCollection],
            },
          }

          await Browser.storage.local.set({
            [BETA_NFTS_COLLECTIONS]: JSON.stringify(newStorageInfo),
          })
          setBetaNFTsCollections(newStorageInfo)
        }

        if (enteredCollection.toLowerCase().startsWith('0x')) {
          await updateBetaEvmNftTokenIds()
        }
      } else {
        const newStorageInfo = {
          [selectedChain]: {
            [forceNetwork]: [newCollection],
          },
        }

        await Browser.storage.local.set({ [BETA_NFTS_COLLECTIONS]: JSON.stringify(newStorageInfo) })
        setBetaNFTsCollections(newStorageInfo)

        if (enteredCollection.toLowerCase().startsWith('0x')) {
          await updateBetaEvmNftTokenIds()
        }
      }

      const isANewChain = nftChains.every(
        (nftChain) => nftChain.forceContractsListChain !== selectedChain,
      )

      if (isANewChain) {
        const chain: NftChain = {
          forceNetwork,
          forceChain: selectedChain,
          forceContractsListChain: selectedChain,
        }

        await Browser.storage.local.set({
          [BETA_NFT_CHAINS]: JSON.stringify([
            ...JSON.parse(storage[BETA_NFT_CHAINS] ?? '[]'),
            chain,
          ]),
        })
        setNftChains([...nftChains, chain])
      }
      setTriggerRerender((prevValue) => !prevValue)
    }
  }

  return (
    <>
      <BottomModal
        isOpen={isVisible}
        onClose={() => {
          onClose()
          setSelectedChain('' as SupportedChain)
          setEnteredCollection('')
          setNftInfo({})
          setErrors({})
        }}
        title={'Add Collection'}
        closeOnBackdropClick={true}
      >
        <div className='w-full h-[320px] flex flex-col sticky top-[72px] bg-gray-50 dark:bg-black-100'>
          <GenericCard
            title={
              selectedChain ? getChainName(chainInfos[selectedChain].chainName) : 'Select Chain'
            }
            img={
              <img
                src={
                  selectedChain
                    ? chainInfos[selectedChain].chainSymbolImageUrl ?? defaultTokenLogo
                    : defaultTokenLogo
                }
                className='w-[28px] h-[28px] mr-2 border rounded-full dark:border-[#333333] border-[#cccccc]'
                onError={imgOnError(defaultTokenLogo)}
              />
            }
            isRounded={true}
            title2={selectedChain ? 'Chain' : ''}
            icon={
              dontShowSelectChain ? undefined : (
                <img className='w-[10px] h-[10px] ml-2' src={Images.Misc.RightArrow} />
              )
            }
            className={classNames({ '!cursor-default': dontShowSelectChain })}
            onClick={dontShowSelectChain ? undefined : () => setShowSelectChain(true)}
          />
          {errors?.selectedChain && enteredCollection.length > 0 && (
            <Text size='sm' color='text-red-300 mt-1 mb-2'>
              {errors?.selectedChain}
            </Text>
          )}

          <div className='rounded-2xl bg-white-100 dark:bg-gray-900 pt-4 px-4 pb-0 block my-4 w-full'>
            <InputComponent
              placeholder='Enter collection address'
              value={enteredCollection}
              name='collection'
              onChange={handleInputChange}
              error={errors.collection}
            />
          </div>

          {showTokenIdInput ? (
            <InputComponent
              placeholder='Enter token id'
              name='tokenId'
              value={enteredTokenId}
              onChange={handleTokenIdChange}
              error={errors.tokenId}
            />
          ) : null}

          {fetchingCollectionInfo && (
            <div className='flex items-center justify-center'>
              <LoaderAnimation color='#29a874' />
            </div>
          )}

          {Object.keys(nftInfo).length > 0 && (
            <NftToggleCard
              title={
                <NftText className='capitalize'>{nftInfo.contractInfo.name.toLowerCase()}</NftText>
              }
              size='md'
              avatar={<NftAvatar image={nftInfo.contractInfo.image ?? ''} />}
              isEnabled={nftInfo.enable}
              isRounded={true}
              onClick={
                errors.noTokens ? () => undefined : (isEnabled) => handleToggleClick(isEnabled)
              }
              className='roundex-2xl'
            />
          )}

          {errors.noTokens && (
            <Text size='sm' color='text-red-300 mt-4'>
              Couldn&apos;t enable collection. You don&apos;t have any NFT in this collection.
            </Text>
          )}
        </div>
      </BottomModal>

      <SelectChainSheet
        chainsToShow={isCompassWallet() ? [chainInfos[activeChain].chainRegistryPath] : undefined}
        onPage='AddCollection'
        isVisible={showSelectChain}
        onClose={() => setShowSelectChain(false)}
        selectedChain={selectedChain}
        onChainSelect={(chaiName: SupportedChain) => {
          setSelectedChain(chaiName)
          setShowSelectChain(false)
        }}
      />
    </>
  )
}
