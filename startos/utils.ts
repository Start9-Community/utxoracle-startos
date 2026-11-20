import { rpcCookieName } from 'bitcoin-core-startos/startos/utils'

export const uiPort = 80

export const bitcoinMountpoint = '/mnt/bitcoind'
export const bitcoinCookie = `${bitcoinMountpoint}/${rpcCookieName}`
