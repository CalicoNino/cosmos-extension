/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */

/***
 * Do not remove this import and keep this on the first line.
 */
// eslint-disable-next-line simple-import-sort/imports
import './fetch-preserver'

import { SUPPORTED_METHODS } from '@leapwallet/cosmos-wallet-provider/dist/provider/messaging/requester'
import {
  ChainInfo,
  encodedUtf8HexToText,
  formatEtherValue,
  getRestUrl,
  getSeiEvmAddressToShow,
  parseStandardTokenTransactionData,
  fetchERC20Balances,
  SeiEvmTx,
} from '@leapwallet/cosmos-wallet-sdk'

import { decrypt, initCrypto, initStorage } from '@leapwallet/leap-keychain'
import {
  ACTIVE_CHAIN,
  ACTIVE_WALLET,
  AUTO_LOCK_TIME,
  BETA_CHAINS,
  BG_RESPONSE,
  ENCRYPTED_ACTIVE_WALLET,
  KEYSTORE,
  REDIRECT_REQUEST,
  SELECTED_NETWORK,
  V118_KEYSTORE_MIGRATION_COMPLETE,
  V125_BETA_NFT_COLLECTIONS_MIGRATION_COMPLETE,
  V80_KEYSTORE_MIGRATION_COMPLETE,
  VIEWING_KEYS,
} from 'config/storage-keys'
import PortStream from 'extension-port-stream'
import browser, { Storage } from 'webextension-polyfill'

import customIcon from '../images/logos/generic-light.svg'
import { getStorageAdapter } from '../utils/storageAdapter'
import { NEW_CHAIN_REQUEST, SUGGEST_TOKEN } from './../config/storage-keys'

import {
  getChains,
  getCompassSeiEvmConfigStoreSnapshot,
  getSeiEvmInfo,
  SeiEvmInfoEnum,
} from '@leapwallet/cosmos-wallet-hooks'
import { getEvmError } from '@leapwallet/cosmos-wallet-provider/dist/utils/get-evm-error'
import {
  ETHEREUM_METHOD_TYPE,
  ETHEREUM_RPC_ERROR,
  EthereumRequestMessage,
  LINE_TYPE,
  LineType,
} from '@leapwallet/cosmos-wallet-provider/dist/provider/types'
import { EncryptionUtilsImpl } from '@leapwallet/cosmos-wallet-sdk/dist/browser/secret/encryptionutil'
import { MessageTypes } from 'config/message-types'
import { handleSendTx } from './handle-sendtx'
import { storageMigrationV10 } from './migrations/v10'
import { storageMigrationV19 } from './migrations/v19'
import { storageMigrationV53 } from './migrations/v53'
import { storageMigrationV77 } from './migrations/v77'
import { storageMigrationV80 } from './migrations/v80'
import { storageMigrationV9 } from './migrations/v9'
import { PasswordManager } from './password-manager'
import { initiatePendingSwapTxTracking, listenPendingSwapTx } from './pending-swap-tx'

import {
  awaitApproveChainResponse,
  awaitSigningResponse,
  awaitUIResponse,
  checkConnection,
  disconnect,
  getSeed,
  getSupportedChains,
  getWalletAddress,
  isConnected,
  openPopup,
  requestEnableAccess,
  requestSignTransaction,
  validateNewChainInfo,
} from './utils'
import { addTxToPendingTxList } from 'utils/pendingSwapsTxsStore'
import { handleGetKey } from './request-handlers/getKey.handler'

global.window = self

const storageAdapter = getStorageAdapter()
initStorage(storageAdapter)
initCrypto()

type Data = EthereumRequestMessage & {
  origin: string
  ecosystem: LineType
}

const windowIdForPayloadId: { [x: number | string]: { type: string; payloadId: number } } = {}

const enableAccessRequests: Map<string, number> = new Map()

const passwordManager = PasswordManager.create()
initiatePendingSwapTxTracking()
listenPendingSwapTx()

const connectRemote = (remotePort: any) => {
  if (remotePort.name !== 'LeapCosmosExtension') {
    return
  }

  const portStream = new PortStream(remotePort)

  const sendResponse = (name: string, payload: any, id: number) => {
    portStream.write({ name, payload, id })
  }

  browser.runtime.onMessage.addListener(async (message, sender) => {
    if (sender.id !== browser.runtime.id) return

    switch (message.type) {
      case 'chain-enabled':
        if (message.payload?.ecosystem === LINE_TYPE.ETHEREUM) {
          const store = await browser.storage.local.get([ACTIVE_WALLET, ACTIVE_CHAIN])
          const activeChain = store[ACTIVE_CHAIN] ?? 'seiTestnet2'
          const seiEvmAddress = getSeiEvmAddressToShow(store[ACTIVE_WALLET].pubKeys?.[activeChain])

          if (seiEvmAddress.startsWith('0x')) {
            const successResponse =
              message.payload?.ethMethod === ETHEREUM_METHOD_TYPE.WALLET__REQUEST_PERMISSIONS
                ? // Refer - https://docs.metamask.io/wallet/reference/wallet_requestpermissions
                  [
                    {
                      id: message.payload?.payloadId,
                      parentCapability: ETHEREUM_METHOD_TYPE.ETH__ACCOUNTS,
                      invoker: message.payload?.origin,
                      caveats: [
                        {
                          type: 'restrictReturnedAccounts',
                          value: [seiEvmAddress],
                        },
                      ],
                      date: Date.now(),
                    },
                  ]
                : [seiEvmAddress]

            sendResponse(
              `on${SUPPORTED_METHODS.ENABLE_ACCESS}`,
              { success: successResponse },
              message.payload.payloadId,
            )
          } else {
            sendResponse(
              `on${SUPPORTED_METHODS.ENABLE_ACCESS}`,
              { error: getEvmError(ETHEREUM_RPC_ERROR.INTERNAL, seiEvmAddress) },
              message.payload.payloadId,
            )
          }
        } else {
          // sendResponse(
          //   `on${SUPPORTED_METHODS.ENABLE_ACCESS}`,
          //   { success: 'Chain enabled' },
          //   message.payload.payloadId,
          // )
        }

        break

      case 'chain-approval-rejected':
        if (message.payload?.ecosystem === LINE_TYPE.ETHEREUM) {
          sendResponse(
            `on${SUPPORTED_METHODS.ENABLE_ACCESS}`,
            { error: getEvmError(ETHEREUM_RPC_ERROR.USER_REJECTED_REQUEST) },
            message.payload.payloadId,
          )
        } else {
          // sendResponse(
          //   `on${SUPPORTED_METHODS.ENABLE_ACCESS}`,
          //   { error: 'Request rejected' },
          //   message.payload.payloadId,
          // )
        }

        break

      case 'pending-swaps':
        await addTxToPendingTxList(message.payload, message.override)
        break
      // case 'popup-closed':
      //   enableAccessRequests.clear()
      //   break
    }
  })

  const requestHandler = async (data: any) => {
    const { type, ...payload } = data

    let popupWindowId = 0
    // let hasUnApprovedTx = false
    // this condition exists to prevent infinite extension popups

    //check if account exists
    const storage = await browser.storage.local.get([ACTIVE_WALLET, ENCRYPTED_ACTIVE_WALLET])

    if (!storage[ACTIVE_WALLET] && !storage[ENCRYPTED_ACTIVE_WALLET]) {
      browser.storage.local.set({ [REDIRECT_REQUEST]: null })

      return sendResponse(
        `on${type?.toUpperCase() ?? ''}`,
        { error: 'No wallet exists' },
        payload.id,
      )
    }

    switch (type) {
      case SUPPORTED_METHODS.GET_CONNECTION_STATUS: {
        return isConnected(payload).then((data) =>
          sendResponse(`on${type.toUpperCase()}`, data, payload.id),
        )
      }

      case SUPPORTED_METHODS.DISCONNECT: {
        return disconnect(payload).then((data) =>
          sendResponse(`on${type.toUpperCase()}`, data, payload.id),
        )
      }

      case SUPPORTED_METHODS.ADD_SUGGESTED_CHAIN: {
        try {
          const newChainName = payload.chainInfo.chainName
          try {
            validateNewChainInfo(payload.chainInfo)
          } catch (e: any) {
            return sendResponse(`on${type.toUpperCase()}`, { error: e.message }, payload.id)
          }
          const newChain = formatNewChainInfo(payload.chainInfo)
          return getSupportedChains()
            .then((_chains) => {
              const supportedChains = Object.values(_chains)

              const allowCoreumFromLeap =
                payload.origin === 'https://suggest-chain-leap.netlify.app' &&
                payload.chainInfo.chainId === 'coreum-mainnet-1' &&
                !supportedChains.find((chain) => chain.chainName === 'Coreum Mainnet 1')

              if (
                supportedChains.some(
                  (chain: ChainInfo) =>
                    (chain.chainId.toLowerCase() === payload.chainInfo.chainId.toLowerCase() ||
                      chain.testnetChainId?.toLowerCase() ===
                        payload.chainInfo.chainId.toLowerCase()) &&
                    chain.enabled === true,
                ) &&
                !allowCoreumFromLeap
              ) {
                return sendResponse(`on${type.toUpperCase()}`, '', payload.id)
              } else {
                return browser.storage.local
                  .set({
                    [REDIRECT_REQUEST]: { type },
                    [NEW_CHAIN_REQUEST]: {
                      chainInfo: newChain[newChainName],
                      origin: payload.origin,
                    },
                  })
                  .then(() =>
                    openPopup('suggestChain').then(async (window) => {
                      popupWindowId = window?.id ?? 0
                      windowIdForPayloadId[popupWindowId] = {
                        type: type.toUpperCase(),
                        payloadId: payload.id,
                      }

                      return awaitEnableChainResponse()
                        .then(async () =>
                          browser.storage.local.get([BETA_CHAINS]).then(async () => {
                            try {
                              return sendResponse(
                                `on${type.toUpperCase()}`,
                                {
                                  success: 'Chain added successfully',
                                },
                                payload.id,
                              )
                            } catch (error: any) {
                              return sendResponse(
                                `on${type.toUpperCase()}`,
                                {
                                  error: error.error,
                                },
                                payload.id,
                              )
                            }
                          }),
                        )
                        .catch(({ error }) =>
                          sendResponse(`on${type.toUpperCase()}`, { error }, payload.id),
                        )
                    }),
                  )
              }
            })
            .catch((error) =>
              sendResponse(
                `on${type.toUpperCase()}`,
                {
                  error: error.message,
                },
                payload.id,
              ),
            )
        } catch (error: any) {
          sendResponse(
            `on${type.toUpperCase()}`,
            {
              error: error.message,
            },
            payload.id,
          )
        }
        break
      }

      case SUPPORTED_METHODS.ENABLE_ACCESS: {
        const msg = payload
        const chainIds = msg?.chainIds

        let queryString = `?origin=${msg?.origin}`
        chainIds?.forEach((chainId: string) => {
          queryString += `&chainIds=${chainId}`
        })

        const password = passwordManager.getPassword()

        try {
          const { validChainIds, isNewChainPresent } = await checkConnection(chainIds, msg)
          if (validChainIds.length > 0) {
            if (isNewChainPresent || !password) {
              await browser.storage.local.set({
                [REDIRECT_REQUEST]: { type: type, msg: { ...msg, validChainIds } },
              })
              enableAccessRequests.delete(queryString)
              enableAccessRequests.set(queryString, popupWindowId)
              await openPopup('approveConnection', '?unlock-to-approve')
              requestEnableAccess({ origin: msg.origin, validChainIds, payloadId: payload.id })
              windowIdForPayloadId[popupWindowId] = {
                type: type.toUpperCase(),
                payloadId: payload.id,
              }
              try {
                const response: any = await awaitApproveChainResponse(payload.id)
                sendResponse(`on${type.toUpperCase()}`, response, response.payloadId)
                enableAccessRequests.delete(queryString)
              } catch (error: any) {
                sendResponse(`on${type.toUpperCase()}`, { error: error.error }, payload.id)
                enableAccessRequests.delete(queryString)
              }
            } else {
              sendResponse(`on${type.toUpperCase()}`, { success: 'Chain enabled' }, payload.id)
              enableAccessRequests.delete(queryString)
            }
          } else {
            sendResponse(`on${type.toUpperCase()}`, { error: 'Invalid chain id' }, payload.id)
            enableAccessRequests.delete(queryString)
          }
        } catch (e: any) {
          sendResponse(`on${type.toUpperCase()}`, { error: `Invalid chain id` }, payload.id)
          enableAccessRequests.delete(queryString)
        }
        break
      }

      case SUPPORTED_METHODS.GET_KEYS:
      case SUPPORTED_METHODS.GET_KEY:
        {
          await handleGetKey({
            message: { type, payload },
            passwordManager,
            sendResponse,
          })
        }
        break

      case SUPPORTED_METHODS.REQUEST_SIGN_DIRECT: {
        const msg = payload

        requestSignTransaction({
          signDoc: msg.signDoc,
          signer: msg.signer,
          origin: msg.origin,
          isAmino: false,
          signOptions: msg.signOptions,
        })

        await openPopup('sign')
        try {
          const response = await awaitSigningResponse(MessageTypes.signResponse)
          sendResponse(`on${type.toUpperCase()}`, { directSignResponse: response }, payload.id)
        } catch (e) {
          sendResponse(`on${type.toUpperCase()}`, { error: 'Transaction declined' }, payload.id)
        }
        break
      }

      case SUPPORTED_METHODS.REQUEST_SIGN_AMINO: {
        const msg = payload

        requestSignTransaction({
          signDoc: msg.signDoc,
          chainId: msg.chainId,
          signer: msg.signer,
          origin: msg.origin,
          isAmino: true,
          isAdr36: msg.signOptions.isSignArbitrary,
          isADR36WithString: msg.signOptions.isAdr36WithString,
          ethSignType: msg.signOptions.ethSignType,
          signOptions: msg.signOptions,
          eip712Types: msg.eip712,
        })

        await openPopup('sign')
        try {
          const response = await awaitSigningResponse(MessageTypes.signResponse)
          sendResponse(`on${type.toUpperCase()}`, { aminoSignResponse: response }, payload.id)
        } catch (e) {
          sendResponse(`on${type.toUpperCase()}`, { error: 'Transaction declined' }, payload.id)
        }
        break
      }

      case SUPPORTED_METHODS.SEND_TX: {
        handleSendTx(payload)
          .then((txHash) => {
            sendResponse(`on${type.toUpperCase()}`, { txHash: new Uint8Array(txHash) }, payload.id)
          })
          .catch((e) => {
            sendResponse(`on${type.toUpperCase()}`, { error: e.message }, payload.id)
          })
        break
      }

      case SUPPORTED_METHODS.GET_SUPPORTED_CHAINS: {
        return getSupportedChains().then((_chains) => {
          const supportedChains = Object.values(_chains).filter((chain) => chain.enabled)
          sendResponse(
            `on${type.toUpperCase()}`,
            {
              chains: supportedChains.map((chain) => chain.chainRegistryPath),
            },
            payload.id,
          )
        })
      }

      case SUPPORTED_METHODS.GET_SECRET20_VIEWING_KEY: {
        if (!payload.chainId || !payload.contractAddress) {
          return sendResponse(`on${type.toUpperCase()}`, '', payload.id)
        }
        const storage = await browser.storage.local.get([VIEWING_KEYS, ACTIVE_WALLET])

        if (!passwordManager.getPassword()) {
          try {
            await openPopup('login', '?close-on-login=true')
            await awaitUIResponse('user-logged-in')
          } catch {
            sendResponse(`on${type.toUpperCase()}`, { error: 'Invalid chain id' }, payload.id)
            break
          }
        }
        const viewingKeys = storage[VIEWING_KEYS] || {}
        const address = await getWalletAddress(payload.chainId)
        try {
          const key = viewingKeys[address][payload.contractAddress]
          if (!key) {
            throw Error()
          }
          const password = passwordManager.getPassword()
          if (!password) throw new Error('unable to decrypt key')
          let decryptKey = decrypt(key, password)
          if (decryptKey === '') {
            decryptKey = decrypt(key, password, 100)
          }
          sendResponse(`on${type.toUpperCase()}`, decryptKey, payload.id)
        } catch (error) {
          sendResponse(
            `on${type.toUpperCase()}`,
            {
              error: "key doesn't exists",
            },
            payload.id,
          )
        }
        break
      }

      case SUPPORTED_METHODS.SUGGEST_CW20_TOKEN:
      case SUPPORTED_METHODS.SUGGEST_TOKEN:
      case SUPPORTED_METHODS.UPDATE_SECRET20_VIEWING_KEY: {
        if (!payload.chainId || !payload.contractAddress) {
          return sendResponse(`on${type.toUpperCase()}`, '', payload.id)
        }

        const checkSuggestTokenChainConnections = (eventName: string) => {
          return checkConnection([payload.chainId], payload).then(({ validChainIds }) => {
            if (validChainIds.length === 0) {
              return sendResponse(eventName, { error: 'Invalid chain id' }, payload.id)
            }
            return browser.storage.local
              .set({
                [REDIRECT_REQUEST]: {
                  type: 'suggest-token',
                  msg: { ...payload, type },
                },
              })
              .then(async () =>
                openPopup('add-secret-token').then((window) => {
                  popupWindowId = window?.id ?? 0
                  windowIdForPayloadId[popupWindowId] = {
                    type: eventName,
                    payloadId: payload.id,
                  }

                  return awaitEnableChainResponse()
                    .then(() => sendResponse(eventName, { payload: '' }, payload.id))
                    .catch(() => sendResponse(eventName, { error: 'Request rejected' }, payload.id))
                }),
              )
          })
        }

        if (type !== SUPPORTED_METHODS.SUGGEST_CW20_TOKEN) {
          browser.storage.local.get([VIEWING_KEYS]).then(async (storage) => {
            const viewingKeys = storage[VIEWING_KEYS] || {}
            const address = await getWalletAddress(payload.chainId)
            const viewingKeysForaddress = viewingKeys[address] || {}
            const key = viewingKeysForaddress[payload.contractAddress]
            if (key) {
              return sendResponse(`on${type.toUpperCase()}`, '', payload.id)
            }
            await browser.storage.local.set({
              [SUGGEST_TOKEN]: { ...payload, address },
            })

            const eventName = `on${type.toUpperCase()}`
            checkSuggestTokenChainConnections(eventName)
          })

          const eventName = `on${type.toUpperCase()}`
          const address = await getWalletAddress(payload.chainId)

          await browser.storage.local.set({
            [SUGGEST_TOKEN]: { ...payload, address, type },
          })
          checkSuggestTokenChainConnections(eventName)
        }

        break
      }

      case SUPPORTED_METHODS.GET_PUBKEY_MSG:
      case SUPPORTED_METHODS.GET_TX_ENCRYPTION_KEY_MSG:
      case SUPPORTED_METHODS.REQUEST_ENCRYPT_MSG:
      case SUPPORTED_METHODS.REQUEST_DECRYPT_MSG: {
        if (!passwordManager.getPassword()) {
          const store = await browser.storage.local.get([ACTIVE_WALLET])
          if (!store[ACTIVE_WALLET]) {
            try {
              await openPopup('login', '?close-on-login=true')
              await awaitUIResponse('user-logged-in')
            } catch {
              sendResponse(`on${type.toUpperCase()}`, { error: 'Invalid chain id' }, payload.id)
              break
            }
          }
        }
        getSeed(passwordManager.getPassword() ?? '').then(async (seed) => {
          const ChainInfos = await getChains()
          const secretLcdUrl = getRestUrl(ChainInfos, 'secret', false)
          const result = new EncryptionUtilsImpl(secretLcdUrl, payload.chainId, seed)

          if (type === SUPPORTED_METHODS.GET_PUBKEY_MSG) {
            result
              .getPubkey()
              .then((res) => sendResponse(`on${type.toUpperCase()}`, res, payload.id))
              .catch((error) =>
                sendResponse(`on${type.toUpperCase()}`, { error: error.message }, payload.id),
              )
          } else if (type === SUPPORTED_METHODS.GET_TX_ENCRYPTION_KEY_MSG) {
            result
              .getTxEncryptionKey(payload.nonce)
              .then((res) => sendResponse(`on${type.toUpperCase()}`, res, payload.id))
              .catch((error) =>
                sendResponse(`on${type.toUpperCase()}`, { error: error.message }, payload.id),
              )
          } else if (type === SUPPORTED_METHODS.REQUEST_ENCRYPT_MSG) {
            result
              .encrypt(payload.contractCodeHash, payload.msg)
              .then((res) => sendResponse(`on${type.toUpperCase()}`, res, payload.id))
              .catch((error) =>
                sendResponse(`on${type.toUpperCase()}`, { error: error.message }, payload.id),
              )
          } else if (type === SUPPORTED_METHODS.REQUEST_DECRYPT_MSG) {
            result
              .decrypt(
                new Uint8Array(Object.values(payload.ciphertext)),
                new Uint8Array(Object.values(payload.nonce)),
              )
              .then((res) => {
                sendResponse(`on${type.toUpperCase()}`, res, payload.id)
              })
              .catch((error) =>
                sendResponse(`on${type.toUpperCase()}`, { error: error.message }, payload.id),
              )
          }
        })
      }
    }
  }

  const evmRequestHandler = async (data: Data) => {
    const { method, ..._payload } = data
    const payload = _payload as any
    const popupWindowId = 0
    const sendResponseName = `on${method.toUpperCase()}`
    const payloadId = payload.id as unknown as number
    const store = await browser.storage.local.get([ACTIVE_CHAIN, SELECTED_NETWORK])
    const activeChain = store[ACTIVE_CHAIN] ?? 'seiTestnet2'
    const activeNetwork: 'mainnet' | 'testnet' = store[SELECTED_NETWORK] ?? 'mainnet'

    const {
      COMPASS_EVM_CHAIN_IDS,
      ATLANTIC_COSMOS_CHAIN_ID,
      PACIFIC_COSMOS_CHAIN_ID,
      ATLANTIC_ETH_CHAIN_ID,
    } = await getCompassSeiEvmConfigStoreSnapshot()

    async function getWalletAddress(payloadId: number) {
      const store = await browser.storage.local.get([ACTIVE_WALLET])

      if (!store[ACTIVE_WALLET]) {
        try {
          await openPopup('login', '?close-on-login=true')
          await awaitUIResponse('user-logged-in')
        } catch {
          sendResponse(
            sendResponseName,
            { error: getEvmError(ETHEREUM_RPC_ERROR.USER_REJECTED_REQUEST) },
            payloadId,
          )

          return 'error'
        }
      }

      const seiEvmAddress = getSeiEvmAddressToShow(store[ACTIVE_WALLET].pubKeys?.[activeChain])
      return seiEvmAddress
    }

    switch (method) {
      case ETHEREUM_METHOD_TYPE.WALLET__REVOKE_PERMISSIONS: {
        try {
          const chainId = (await getSeiEvmInfo({
            activeChain,
            activeNetwork,
            infoType: SeiEvmInfoEnum.COSMOS_CHAIN_ID,
          })) as string

          await disconnect({ chainId, origin: payload.origin })
          sendResponse(sendResponseName, { success: null }, payloadId)
        } catch (_) {
          sendResponse(sendResponseName, { success: null }, payloadId)
        }

        break
      }

      case ETHEREUM_METHOD_TYPE.ETH__CHAIN_ID: {
        const chainId = await getSeiEvmInfo({
          activeChain,
          activeNetwork,
          infoType: SeiEvmInfoEnum.EVM_CHAIN_ID,
        })

        sendResponse(sendResponseName, { success: `0x${chainId.toString(16)}` }, payloadId)
        break
      }

      case ETHEREUM_METHOD_TYPE.ETH__BLOCK_NUMBER: {
        try {
          const rpcUrl = (await getSeiEvmInfo({
            activeChain,
            activeNetwork,
            infoType: SeiEvmInfoEnum.EVM_RPC_URL,
          })) as string

          const blockNumber = await SeiEvmTx.GetBlockNumber(rpcUrl)
          sendResponse(sendResponseName, { success: blockNumber }, payloadId)
        } catch (error) {
          sendResponse(
            sendResponseName,
            { error: getEvmError(ETHEREUM_RPC_ERROR.INTERNAL, (error as Error).message) },
            payloadId,
          )
        }
        break
      }

      case ETHEREUM_METHOD_TYPE.ETH__GET_BLOCK_BY_NUMBER: {
        try {
          const rpcUrl = (await getSeiEvmInfo({
            activeChain,
            activeNetwork,
            infoType: SeiEvmInfoEnum.EVM_RPC_URL,
          })) as string

          const result = await SeiEvmTx.GetBlockByNumber(payload.params, rpcUrl)
          sendResponse(sendResponseName, { success: result }, payloadId)
        } catch (error) {
          sendResponse(
            sendResponseName,
            { error: getEvmError(ETHEREUM_RPC_ERROR.INTERNAL, (error as Error).message) },
            payloadId,
          )
        }
        break
      }

      case ETHEREUM_METHOD_TYPE.ETH__GET_BALANCE: {
        try {
          const rpcUrl = (await getSeiEvmInfo({
            activeChain,
            activeNetwork,
            infoType: SeiEvmInfoEnum.EVM_RPC_URL,
          })) as string

          const result = await SeiEvmTx.EthGetBalance(payload.params, rpcUrl)
          sendResponse(sendResponseName, { success: result }, payloadId)
        } catch (error) {
          sendResponse(
            sendResponseName,
            { error: getEvmError(ETHEREUM_RPC_ERROR.INTERNAL, (error as Error).message) },
            payloadId,
          )
        }
        break
      }

      case ETHEREUM_METHOD_TYPE.ETH__GET_TRANSACTION_RECEIPT:
      case ETHEREUM_METHOD_TYPE.ETH__GET_TRANSACTION_BY_HASH: {
        const transactionHash = payload.params[0]

        if (transactionHash) {
          try {
            const rpcUrl = (await getSeiEvmInfo({
              activeChain,
              activeNetwork,
              infoType: SeiEvmInfoEnum.EVM_RPC_URL,
            })) as string

            if (method === ETHEREUM_METHOD_TYPE.ETH__GET_TRANSACTION_RECEIPT) {
              const transactionReceipt = await SeiEvmTx.GetTransactionReceipt(
                transactionHash,
                rpcUrl,
              )

              sendResponse(sendResponseName, { success: transactionReceipt }, payloadId)
            } else {
              const transactionByHash = await SeiEvmTx.GetTransactionByHash(transactionHash, rpcUrl)
              sendResponse(sendResponseName, { success: transactionByHash }, payloadId)
            }
          } catch (error) {
            sendResponse(
              sendResponseName,
              { error: getEvmError(ETHEREUM_RPC_ERROR.INTERNAL, (error as Error).message) },
              payloadId,
            )
          }
        } else {
          sendResponse(
            sendResponseName,
            {
              error: getEvmError(ETHEREUM_RPC_ERROR.INVALID_PARAMS, 'Transaction hash is required'),
            },
            payloadId,
          )
        }

        break
      }

      case ETHEREUM_METHOD_TYPE.ETH__CALL: {
        try {
          const rpcUrl = (await getSeiEvmInfo({
            activeChain,
            activeNetwork,
            infoType: SeiEvmInfoEnum.EVM_RPC_URL,
          })) as string

          const result = await SeiEvmTx.ExecuteEthCall(payload.params, rpcUrl)
          sendResponse(sendResponseName, { success: result }, payloadId)
        } catch (error) {
          sendResponse(
            sendResponseName,
            { error: getEvmError(ETHEREUM_RPC_ERROR.INTERNAL, (error as Error).message) },
            payloadId,
          )
        }

        break
      }

      case ETHEREUM_METHOD_TYPE.ETH__ESTIMATE_GAS: {
        try {
          const rpcUrl = (await getSeiEvmInfo({
            activeChain,
            activeNetwork,
            infoType: SeiEvmInfoEnum.EVM_RPC_URL,
          })) as string

          const result = await SeiEvmTx.ExecuteEthEstimateGAs(payload.params, rpcUrl)
          sendResponse(sendResponseName, { success: result }, payloadId)
        } catch (error) {
          sendResponse(
            sendResponseName,
            { error: getEvmError(ETHEREUM_RPC_ERROR.INTERNAL, (error as Error).message) },
            payloadId,
          )
        }

        break
      }

      case ETHEREUM_METHOD_TYPE.WALLET__WATCH_ASSET: {
        const seiEvmAddress = await getWalletAddress(payloadId)
        if (seiEvmAddress === 'error') {
          break
        }

        const tokenType = payload.params.type
        if (tokenType !== 'ERC20') {
          sendResponse(
            sendResponseName,
            {
              error: getEvmError(
                ETHEREUM_RPC_ERROR.INVALID_PARAMS,
                'Compass only supports ERC-20 asset type today.',
              ),
            },
            payloadId,
          )

          break
        }

        const options = payload.params.options
        if (!options.address || !options.symbol || options.decimals === undefined) {
          sendResponse(
            sendResponseName,
            {
              error: getEvmError(
                ETHEREUM_RPC_ERROR.INVALID_PARAMS,
                'Must specify address, symbol, and decimals.',
              ),
            },
            payloadId,
          )

          break
        } else if (typeof options.symbol !== 'string' || options.symbol.length > 11) {
          sendResponse(
            sendResponseName,
            {
              error: getEvmError(
                ETHEREUM_RPC_ERROR.INVALID_PARAMS,
                `Invalid symbol '${options.symbol}': must be a string not longer than 11 characters.`,
              ),
            },
            payloadId,
          )

          break
        } else if (
          typeof options.decimals !== 'number' ||
          options.decimals < 0 ||
          options.decimals > 36
        ) {
          sendResponse(
            sendResponseName,
            {
              error: getEvmError(
                ETHEREUM_RPC_ERROR.INVALID_PARAMS,
                `Invalid decimals '${options.decimals}': must be an integer between 0 and 36.`,
              ),
            },
            payloadId,
          )

          break
        } else {
          const rpcUrl = (await getSeiEvmInfo({
            activeChain,
            activeNetwork,
            infoType: SeiEvmInfoEnum.EVM_RPC_URL,
          })) as string

          const balance = await fetchERC20Balances(rpcUrl, seiEvmAddress, [options.address])
          if (balance.length === 0) {
            sendResponse(
              sendResponseName,
              {
                error: getEvmError(
                  ETHEREUM_RPC_ERROR.INVALID_PARAMS,
                  `Invalid address '${options.address}'`,
                ),
              },
              payloadId,
            )

            break
          }
        }

        await browser.storage.local.set({
          [SUGGEST_TOKEN]: { ...payload },
        })
        await openPopup('suggest-erc-20')

        try {
          await awaitEnableChainResponse()
          sendResponse(sendResponseName, { success: true }, payloadId)
        } catch (e) {
          sendResponse(sendResponseName, { success: false }, payloadId)
        }

        break
      }

      case ETHEREUM_METHOD_TYPE.ETH__SIGN:
      case ETHEREUM_METHOD_TYPE.PERSONAL_SIGN:
      case ETHEREUM_METHOD_TYPE.ETH__SIGN_TYPED_DATA_V4: {
        const seiEvmAddress = await getWalletAddress(payloadId)
        if (seiEvmAddress === 'error') {
          break
        }

        if (seiEvmAddress.startsWith('0x')) {
          if (payload.params) {
            // @ts-ignore
            let payloadAddress = payload.params[1]
            // @ts-ignore
            let data = payload.params[0]

            if (
              [
                ETHEREUM_METHOD_TYPE.ETH__SIGN,
                ETHEREUM_METHOD_TYPE.ETH__SIGN_TYPED_DATA_V4,
              ].includes(method)
            ) {
              ;[payloadAddress, data] = [data, payloadAddress]
            }

            if (typeof data === 'string') {
              try {
                data = JSON.parse(data)
              } catch {
                //
              }
            }

            if (
              seiEvmAddress.toLowerCase() !== payloadAddress.toLowerCase() ||
              !data ||
              (method !== ETHEREUM_METHOD_TYPE.ETH__SIGN_TYPED_DATA_V4 && !data?.startsWith('0x'))
            ) {
              sendResponse(
                sendResponseName,
                { error: getEvmError(ETHEREUM_RPC_ERROR.INVALID_PARAMS) },
                payloadId,
              )

              break
            }

            if (
              method === ETHEREUM_METHOD_TYPE.ETH__SIGN_TYPED_DATA_V4 &&
              !COMPASS_EVM_CHAIN_IDS.includes(data.domain.chainId)
            ) {
              sendResponse(
                sendResponseName,
                {
                  error: getEvmError(ETHEREUM_RPC_ERROR.INVALID_PARAMS, 'Invalid chainId.'),
                },
                payloadId,
              )

              break
            }

            const details: any =
              method === ETHEREUM_METHOD_TYPE.ETH__SIGN_TYPED_DATA_V4
                ? { [data.primaryType]: data.message }
                : { Message: encodedUtf8HexToText(data) }

            const signTxnData = {
              payloadAddress,
              data,
              methodType: method,
              details,
            }

            requestSignTransaction({
              origin: payload.origin,
              ecosystem: payload.ecosystem,
              signTxnData,
            })

            await openPopup('signSeiEvm')

            try {
              const response = await awaitSigningResponse(MessageTypes.signSeiEvmResponse)
              sendResponse(sendResponseName, { success: response }, payloadId)
            } catch (e) {
              sendResponse(
                sendResponseName,
                { error: getEvmError(ETHEREUM_RPC_ERROR.USER_REJECTED_REQUEST) },
                payloadId,
              )
            }
          }
        } else {
          sendResponse(
            sendResponseName,
            { error: getEvmError(ETHEREUM_RPC_ERROR.INTERNAL, seiEvmAddress) },
            payloadId,
          )
        }

        break
      }

      case ETHEREUM_METHOD_TYPE.ETH__SEND_TRANSACTION: {
        const seiEvmAddress = await getWalletAddress(payloadId)
        if (seiEvmAddress === 'error') {
          break
        }

        if (payload.params) {
          // @ts-ignore
          const parsedData = parseStandardTokenTransactionData(payload.params[0].data)
          let signTxnData = {}

          if (!parsedData) {
            // @ts-ignore
            const value = payload.params[0].value
            // @ts-ignore
            const to = payload.params[0].to
            // @ts-ignore
            const data = payload.params[0].data
            // @ts-ignore
            const gas = payload.params[0].gas

            signTxnData = {
              params: payload.params,
              value: value ? formatEtherValue(value) : '0',
              to,
              data,
              gas,
              details: {
                Value: value ? `${formatEtherValue(value)} SEI` : '0',
                'Contract Interaction': to,
                'HEX Data': data,
              },
            }
          } else {
            const value = parsedData.value.toString()
            // @ts-ignore
            const to = payload.params[0].to
            // @ts-ignore
            const data = payload.params[0].data
            // @ts-ignore
            const gas = payload.params[0].gas

            switch (parsedData.name) {
              case 'approve': {
                signTxnData = {
                  value,
                  to,
                  data,
                  gas,
                  spendPermissionCapValue: parsedData.args[1].toString(),
                  details: {
                    'Third Party': parsedData.args[0],
                    Data: {
                      Function: 'Approve',
                      HEX: data,
                    },
                  },
                }

                break
              }

              case 'safeTransferFrom': {
                signTxnData = {
                  value,
                  to,
                  data,
                  gas,
                  details: {
                    To: parsedData.args[1],
                    Data: {
                      Function: 'Safe Transfer From',
                      HEX: data,
                    },
                  },
                }

                break
              }

              default: {
                signTxnData = {
                  value,
                  to,
                  data,
                  gas,
                  details: {
                    Data: {
                      Function: parsedData.name,
                      HEX: data,
                    },
                  },
                }
              }
            }
          }

          requestSignTransaction({
            origin: payload.origin,
            ecosystem: payload.ecosystem,
            signTxnData,
          })

          await openPopup('signSeiEvm')

          try {
            const response = await awaitSigningResponse(MessageTypes.signSeiEvmResponse)
            sendResponse(sendResponseName, { success: response }, payloadId)
          } catch (e) {
            sendResponse(
              sendResponseName,
              { error: getEvmError(ETHEREUM_RPC_ERROR.USER_REJECTED_REQUEST) },
              payloadId,
            )
          }
        }

        break
      }

      case ETHEREUM_METHOD_TYPE.ETH__ACCOUNTS:
      case ETHEREUM_METHOD_TYPE.WALLET__REQUEST_PERMISSIONS:
      case ETHEREUM_METHOD_TYPE.ETH__REQUEST_ACCOUNTS: {
        if (
          method === ETHEREUM_METHOD_TYPE.WALLET__REQUEST_PERMISSIONS &&
          // @ts-ignore
          !Object.keys(payload.params?.[0] ?? {}).includes(ETHEREUM_METHOD_TYPE.ETH__ACCOUNTS)
        ) {
          break
        }

        const msg = payload
        const chainIds: string[] = [ATLANTIC_COSMOS_CHAIN_ID, PACIFIC_COSMOS_CHAIN_ID]

        let queryString = `?origin=${msg?.origin}`
        chainIds?.forEach((chainId: string) => {
          queryString += `&chainIds=${chainId}`
        })

        const seiEvmAddress = await getWalletAddress(payloadId)
        if (seiEvmAddress === 'error') {
          break
        }

        checkConnection(chainIds, msg)
          .then(async ({ validChainIds, isNewChainPresent }) => {
            if (validChainIds.length > 0) {
              const successResponse =
                method === ETHEREUM_METHOD_TYPE.WALLET__REQUEST_PERMISSIONS
                  ? // Refer - https://docs.metamask.io/wallet/reference/wallet_requestpermissions
                    [
                      {
                        id: payloadId,
                        parentCapability: ETHEREUM_METHOD_TYPE.ETH__ACCOUNTS,
                        invoker: msg?.origin,
                        caveats: [
                          {
                            type: 'restrictReturnedAccounts',
                            value: [seiEvmAddress],
                          },
                        ],
                        date: Date.now(),
                      },
                    ]
                  : [seiEvmAddress]

              if (isNewChainPresent) {
                if (method === ETHEREUM_METHOD_TYPE.ETH__ACCOUNTS) {
                  sendResponse(sendResponseName, { success: [] }, payloadId)
                } else {
                  await browser.storage.local.set({
                    [REDIRECT_REQUEST]: { type: method, msg: { ...msg, validChainIds } },
                  })

                  const shouldOpenPopup =
                    Object.keys(enableAccessRequests).length === 0 ||
                    !Object.keys(enableAccessRequests).some((key) => key.includes(msg.origin))

                  if (shouldOpenPopup) {
                    enableAccessRequests.delete(queryString)
                    enableAccessRequests.set(queryString, popupWindowId)
                    await openPopup('approveConnection')

                    requestEnableAccess({
                      origin: msg.origin,
                      validChainIds,
                      payloadId: payloadId as unknown as string,
                      ecosystem: LINE_TYPE.ETHEREUM,
                      ethMethod: method,
                    })

                    windowIdForPayloadId[popupWindowId] = {
                      type: method.toUpperCase(),
                      payloadId: payloadId,
                    }
                  } else {
                    if (!enableAccessRequests.has(queryString)) {
                      requestEnableAccess({
                        origin: msg.origin,
                        validChainIds,
                        payloadId: payloadId as unknown as string,
                        ecosystem: LINE_TYPE.ETHEREUM,
                        ethMethod: method,
                      })
                      enableAccessRequests.set(queryString, popupWindowId)
                    }
                  }

                  try {
                    await awaitEnableChainResponse()

                    if (seiEvmAddress.startsWith('0x')) {
                      sendResponse(sendResponseName, { success: successResponse }, payloadId)
                    } else {
                      sendResponse(
                        sendResponseName,
                        { error: getEvmError(ETHEREUM_RPC_ERROR.INTERNAL, seiEvmAddress) },
                        payloadId,
                      )
                    }
                    enableAccessRequests.delete(queryString)
                  } catch (error: any) {
                    sendResponse(
                      sendResponseName,
                      { error: getEvmError(ETHEREUM_RPC_ERROR.INTERNAL, error.error) },
                      payloadId,
                    )
                    enableAccessRequests.delete(queryString)
                  }
                }
              } else {
                if (seiEvmAddress.startsWith('0x')) {
                  sendResponse(sendResponseName, { success: successResponse }, payloadId)
                } else {
                  sendResponse(
                    sendResponseName,
                    { error: getEvmError(ETHEREUM_RPC_ERROR.INTERNAL, seiEvmAddress) },
                    payloadId,
                  )
                }
                enableAccessRequests.delete(queryString)
              }
            } else {
              sendResponse(
                sendResponseName,
                { error: getEvmError(ETHEREUM_RPC_ERROR.INTERNAL, 'Invalid chain id') },
                payloadId,
              )
              enableAccessRequests.delete(queryString)
            }
          })
          .catch(() => {
            sendResponse(
              sendResponseName,
              { error: getEvmError(ETHEREUM_RPC_ERROR.INTERNAL, 'Invalid chain id') },
              payloadId,
            )
            enableAccessRequests.delete(queryString)
          })

        break
      }

      case ETHEREUM_METHOD_TYPE.WALLET__SWITCH_ETHEREUM_CHAIN: {
        if (payload.params) {
          const { chainId } = payload.params[0]
          if (chainId) {
            if (COMPASS_EVM_CHAIN_IDS.includes(Number(chainId))) {
              const seiEvmAddress = await getWalletAddress(payloadId)
              if (seiEvmAddress === 'error') {
                break
              }

              const requestedActiveChain = await getSeiEvmInfo({
                evmChainId: Number(chainId),
                infoType: SeiEvmInfoEnum.COSMOS_CHAIN_KEY_USING_EVM_CHAIN_ID,
              })

              if (activeChain) {
                const storedActiveChain = activeChain
                const setNetworkTo =
                  Number(chainId) === ATLANTIC_ETH_CHAIN_ID ? 'testnet' : 'mainnet'

                if (storedActiveChain !== requestedActiveChain) {
                  await browser.storage.local.set({
                    [REDIRECT_REQUEST]: {
                      type: method,
                      msg: {
                        requestedActiveChain,
                        setNetworkTo,
                      },
                    },
                  })

                  await openPopup('switch-ethereum-chain')

                  try {
                    await awaitEnableChainResponse()
                    sendResponse(sendResponseName, { success: { chainId } }, payloadId)
                  } catch (e) {
                    sendResponse(
                      sendResponseName,
                      { error: getEvmError(ETHEREUM_RPC_ERROR.USER_REJECTED_REQUEST) },
                      payloadId,
                    )
                  }
                } else {
                  sendResponse(sendResponseName, { success: { chainId } }, payloadId)
                }
              } else {
                await browser.storage.local.set({ [ACTIVE_CHAIN]: requestedActiveChain })
                sendResponse(sendResponseName, { success: { chainId } }, payloadId)
              }
            } else {
              sendResponse(
                sendResponseName,
                {
                  error: getEvmError(
                    ETHEREUM_RPC_ERROR.UNRECOGNIZED_CHAIN_ID,
                    `Unrecognized chain id: ${Number(chainId)}`,
                  ),
                },
                payloadId,
              )
            }
          } else {
            sendResponse(
              sendResponseName,
              {
                error: getEvmError(
                  ETHEREUM_RPC_ERROR.INVALID_PARAMS,
                  `Chain id is missing in params.`,
                ),
              },
              payloadId,
            )
          }
        } else {
          sendResponse(
            sendResponseName,
            {
              error: getEvmError(
                ETHEREUM_RPC_ERROR.INVALID_PARAMS,
                `Params are required for ${method} method.`,
              ),
            },
            payloadId,
          )
        }

        break
      }

      default: {
        sendResponse(
          sendResponseName,
          {
            error: getEvmError(
              ETHEREUM_RPC_ERROR.INTERNAL,
              `Compass does not support '${method}' method as of now.`,
            ),
          },
          payloadId,
        )
      }
    }
  }

  portStream.on('data', async (data: any) => {
    if (data?.ecosystem === LINE_TYPE.ETHEREUM) {
      await evmRequestHandler(data)
    } else {
      await requestHandler(data)
    }
  })
}

browser.runtime.onConnect.addListener(connectRemote)

browser.runtime.onInstalled.addListener((details) => {
  browser.storage.local
    .get([
      KEYSTORE,
      ACTIVE_WALLET,
      ENCRYPTED_ACTIVE_WALLET,
      AUTO_LOCK_TIME,
      'encrypted',
      'timestamp',
    ])
    .then(async (storage) => {
      const activeWallet = storage[ACTIVE_WALLET]
      const encryptedActiveWallet = storage[ENCRYPTED_ACTIVE_WALLET]

      if (!activeWallet && !encryptedActiveWallet) {
        browser.tabs.create({
          url: browser.runtime.getURL('index.html'),
          active: true,
        })
        await browser.storage.local.set({
          [V80_KEYSTORE_MIGRATION_COMPLETE]: true,
          [V118_KEYSTORE_MIGRATION_COMPLETE]: true,
          [V125_BETA_NFT_COLLECTIONS_MIGRATION_COMPLETE]: true,
        })
      } else if (details.reason === 'update' && (activeWallet || encryptedActiveWallet)) {
        //previous version as int (e.g. v 0.1.9 will return 19)
        const previousVersion = details?.previousVersion?.split('.').join('')

        if (!previousVersion) return

        const prevVersionInt = parseInt(previousVersion, 10)

        const execV80Migration =
          [710, 711, 712, 713].includes(prevVersionInt) || prevVersionInt < 80

        if (prevVersionInt < 9) {
          storageMigrationV9(storage)
        }
        if (prevVersionInt < 10) {
          storageMigrationV10(storage)
        }
        if (prevVersionInt < 19) {
          storageMigrationV19()
        }
        if (prevVersionInt < 53) {
          storageMigrationV53(storage)
        }
        if (prevVersionInt < 74) {
          storageMigrationV77(storage)
        }
        if (execV80Migration) {
          storageMigrationV80(passwordManager)
        }
      }
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const openAuthPage = async function (message: any) {
  const { 'active-wallet': activeWallet, 'encrypted-active-wallet': encryptedActiveWallet } =
    await browser.storage.local.get([ACTIVE_WALLET, ENCRYPTED_ACTIVE_WALLET])
  if (!activeWallet && !encryptedActiveWallet) {
    await browser.tabs.create({
      url: browser.runtime.getURL('index.html#/onboarding'),
      active: true,
    })
  } else {
    await browser.action.setPopup({ popup: 'index.html' })
  }
}

if (!browser.action.onClicked.hasListener(openAuthPage)) {
  browser.action.onClicked.addListener(openAuthPage)
}

// function awaitResponse(txType: 'direct' | 'amino') {
//   return new Promise((resolve, reject) => {
//     const directSignResponseListener = (changes: Record<string, Storage.StorageChange>) => {
//       const { newValue } = changes[BG_RESPONSE] || {}
//       if (newValue) {
//         if (newValue.error) {
//           return reject(newValue)
//         }
//         const response = JSON.parse(newValue)
//         if (txType === 'direct') {
//           response.signed.authInfoBytes = new Uint8Array(
//             Object.values(response.signed.authInfoBytes),
//           )
//           response.signed.bodyBytes = new Uint8Array(Object.values(response.signed.bodyBytes))

//           resolve(response)
//         } else {
//           resolve(response)
//         }
//         browser.storage.local.remove(BG_RESPONSE)

//         browser.storage.onChanged.removeListener(directSignResponseListener)
//       }
//     }
//     browser.storage.onChanged.addListener(directSignResponseListener)
//   })
// }

function awaitEnableChainResponse(): Promise<any> {
  return new Promise((resolve, reject) => {
    const enableChainListener = (changes: Record<string, Storage.StorageChange>) => {
      const { newValue } = changes[BG_RESPONSE] || {}
      if (newValue) {
        if (newValue.error) {
          reject(newValue)
        } else {
          resolve(newValue)
        }
        resolve({})
        browser.storage.onChanged.removeListener(enableChainListener)
      }
    }
    browser.storage.onChanged.addListener(enableChainListener)
  })
}

function removeTrailingSlash(url?: string) {
  if (!url) return ''
  return url.replace(/\/$/, '')
}

function formatNewChainInfo(chainInfo: any) {
  const apis = {
    rest: removeTrailingSlash(chainInfo.rest),
    rpc: removeTrailingSlash(chainInfo.rpc),
    rpcTest: removeTrailingSlash(chainInfo.rpcTest) || '',
    restTest: removeTrailingSlash(chainInfo.restTest) || '',
  }
  if (chainInfo.rpcTest) apis.rpcTest = chainInfo.rpcTest
  if (chainInfo.restTest) apis.restTest = chainInfo.restTest
  try {
    const { gasPriceStep, ...rest } = chainInfo.feeCurrencies[0]
    const addressPrefix = chainInfo.bech32Config.bech32PrefixAccAddr
    let testnetData = {}
    if (chainInfo?.rpcTest || chainInfo?.restTest) {
      testnetData = {
        testnetChainId: chainInfo.chainId,
        testnetChainRegistryPath: chainInfo.chainRegistryPath ?? addressPrefix,
      }
    }
    return {
      [chainInfo.chainName]: {
        chainId: chainInfo.chainId,
        chainName: chainInfo.chainName,
        chainRegistryPath: chainInfo.chainRegistryPath ?? addressPrefix,
        key: chainInfo.chainName,
        chainSymbolImageUrl: chainInfo.image || customIcon,
        txExplorer: {
          mainnet: chainInfo.txExplorer?.mainnet || {},
        },
        apis,
        denom: rest.coinDenom,
        bip44: {
          coinType: `${chainInfo.bip44.coinType}`,
        },
        addressPrefix: addressPrefix,
        gasPriceStep: gasPriceStep,
        ibcChannelIds: {},
        feeCurrencies: chainInfo.feeCurrencies,
        nativeDenoms: {
          [rest.coinMinimalDenom]: rest,
        },
        theme: chainInfo.theme || {
          primaryColor: '#E18881',
          gradient:
            'linear-gradient(180deg, rgba(225, 136, 129, 0.32) 0%, rgba(225, 136, 129, 0) 100%)',
        },
        enabled: true,
        beta: true,
        features: chainInfo.features || [],
        apiStatus: chainInfo?.apiStatus,
        ...testnetData,
      },
    }
  } catch (error) {
    throw Error('missing params')
  }
}
