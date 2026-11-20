import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.9.6:10',
  releaseNotes: {
    en_US: `Requires StartOS 0.4.2 or later.

UTXOracle now reads only Bitcoin's RPC cookie, instead of having read access to Bitcoin's entire data directory. Bitcoin must be at least 28.4:42, 29.5:4, 30.4:4 or 31.2:4, depending on its major version, or Bitcoin Knots (pre-RDTS) 29.3:33 or later; update Bitcoin first if it is older.`,
    es_ES: `Requiere StartOS 0.4.2 o posterior.

UTXOracle ahora lee solo la cookie RPC de Bitcoin, en lugar de tener acceso de lectura a todo el directorio de datos de Bitcoin. Bitcoin debe ser al menos la versión 28.4:42, 29.5:4, 30.4:4 o 31.2:4, según su versión principal, o Bitcoin Knots (pre-RDTS) 29.3:33 o posterior; actualice Bitcoin primero si es más antiguo.`,
    de_DE: `Erfordert StartOS 0.4.2 oder neuer.

UTXOracle liest jetzt nur noch das RPC-Cookie von Bitcoin, statt Lesezugriff auf das gesamte Datenverzeichnis von Bitcoin zu haben. Bitcoin muss je nach Hauptversion mindestens 28.4:42, 29.5:4, 30.4:4 oder 31.2:4 sein, oder Bitcoin Knots (pre-RDTS) ab 29.3:33; aktualisieren Sie Bitcoin zuerst, falls es älter ist.`,
    pl_PL: `Wymaga StartOS 0.4.2 lub nowszego.

UTXOracle odczytuje teraz tylko plik cookie RPC Bitcoina, zamiast mieć dostęp do odczytu całego katalogu danych Bitcoina. Bitcoin musi być co najmniej w wersji 28.4:42, 29.5:4, 30.4:4 lub 31.2:4, zależnie od wersji głównej, albo Bitcoin Knots (pre-RDTS) 29.3:33 lub nowszy; jeśli jest starszy, najpierw zaktualizuj Bitcoina.`,
    fr_FR: `Nécessite StartOS 0.4.2 ou une version ultérieure.

UTXOracle lit désormais uniquement le cookie RPC de Bitcoin, au lieu d'avoir un accès en lecture à tout le répertoire de données de Bitcoin. Bitcoin doit être au moins en version 28.4:42, 29.5:4, 30.4:4 ou 31.2:4, selon sa version majeure, ou Bitcoin Knots (pre-RDTS) 29.3:33 ou plus récent ; mettez d'abord Bitcoin à jour s'il est plus ancien.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
