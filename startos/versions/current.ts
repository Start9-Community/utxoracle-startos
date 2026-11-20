import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.9.6:11',
  releaseNotes: {
    en_US:
      'With a Bitcoin too old to publish the RPC cookie UTXOracle reads, UTXOracle no longer fails to start: it waits and tells you to update Bitcoin.',
    es_ES:
      'Con un Bitcoin demasiado antiguo para publicar la cookie RPC que UTXOracle lee, UTXOracle ya no falla al iniciarse: espera y le indica que actualice Bitcoin.',
    de_DE:
      'Mit einem Bitcoin, das zu alt ist, um das von UTXOracle gelesene RPC-Cookie bereitzustellen, startet UTXOracle nicht mehr fehlerhaft: Es wartet und fordert Sie auf, Bitcoin zu aktualisieren.',
    pl_PL:
      'Gdy Bitcoin jest zbyt stary, by udostępniać plik cookie RPC odczytywany przez UTXOracle, UTXOracle nie kończy już uruchamiania błędem: czeka i prosi o aktualizację Bitcoina.',
    fr_FR:
      "Avec un Bitcoin trop ancien pour publier le cookie RPC que UTXOracle lit, UTXOracle n'échoue plus au démarrage : il attend et vous invite à mettre Bitcoin à jour.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
