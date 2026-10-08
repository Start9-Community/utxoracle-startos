import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const current = VersionInfo.of({
  version: '0.9.6:9',
  releaseNotes: {
    en_US: `Resolves the addresses of connected services more reliably.

UTXOracle looked up where to reach its dependencies through a field that only applies to one of the two ways a service can publish a port. It now reads the address itself, so a dependency changing how it serves TLS can no longer leave UTXOracle unable to find it. Nothing changes in normal operation.

- The network interface left behind by the StartOS 0.3.5 version of this package is removed and its port freed. A domain or .onion address you had added to it no longer reaches UTXOracle; add one to the Web UI interface instead.
- The Price to Compute setting in Configure explains each of its options.
- Bitcoin must be at least 28.4:29, 29.4:16, 30.3:16 or 31.1:16, depending on its major version. Bitcoin Knots (pre-RDTS) 29.3:29 or later also works.`,
    es_ES: `Resuelve de forma más fiable las direcciones de los servicios conectados.

UTXOracle localizaba sus dependencias mediante un campo que solo se aplica a una de las dos formas en que un servicio puede publicar un puerto. Ahora lee la dirección en sí, de modo que si una dependencia cambia su forma de servir TLS, UTXOracle seguirá encontrándola. En funcionamiento normal no cambia nada.

- Se elimina la interfaz de red que dejó la versión de este paquete para StartOS 0.3.5 y se libera su puerto. Un dominio o una dirección .onion que hubiera añadido a ella ya no lleva a UTXOracle; añada uno a la interfaz «Web UI» en su lugar.
- El ajuste «Price to Compute» de «Configure» explica cada una de sus opciones.
- Bitcoin debe ser al menos la versión 28.4:29, 29.4:16, 30.3:16 o 31.1:16, según su versión principal. También funciona Bitcoin Knots (pre-RDTS) 29.3:29 o posterior.`,
    de_DE: `Ermittelt die Adressen verbundener Dienste zuverlässiger.

UTXOracle suchte seine Abhängigkeiten über ein Feld, das nur für eine der beiden Arten gilt, auf die ein Dienst einen Port veröffentlichen kann. Jetzt wird die Adresse selbst gelesen, sodass eine Abhängigkeit, die ihre TLS-Bereitstellung ändert, für UTXOracle auffindbar bleibt. Im normalen Betrieb ändert sich nichts.

- Die Netzwerkschnittstelle, die die StartOS-0.3.5-Version dieses Pakets hinterlassen hatte, wird entfernt und ihr Port freigegeben. Eine Domain oder .onion-Adresse, die Sie ihr hinzugefügt hatten, führt nicht mehr zu UTXOracle; fügen Sie stattdessen eine der Schnittstelle „Web UI“ hinzu.
- Die Einstellung „Price to Compute“ in „Configure“ erklärt jede ihrer Optionen.
- Bitcoin muss je nach Hauptversion mindestens 28.4:29, 29.4:16, 30.3:16 oder 31.1:16 sein. Bitcoin Knots (pre-RDTS) ab 29.3:29 funktioniert ebenfalls.`,
    pl_PL: `Pewniej ustala adresy połączonych usług.

UTXOracle wyszukiwał swoje zależności przez pole, które dotyczy tylko jednego z dwóch sposobów publikowania portu przez usługę. Teraz odczytuje sam adres, więc zależność zmieniająca sposób udostępniania TLS nadal pozostanie odnajdywalna dla UTXOracle. W normalnej pracy nic się nie zmienia.

- Interfejs sieciowy pozostawiony przez wersję tego pakietu dla StartOS 0.3.5 zostaje usunięty, a jego port zwolniony. Domena lub adres .onion dodany do niego nie prowadzi już do UTXOracle; zamiast tego dodaj go do interfejsu „Web UI”.
- Ustawienie „Price to Compute” w „Configure” wyjaśnia każdą ze swoich opcji.
- Bitcoin musi być co najmniej w wersji 28.4:29, 29.4:16, 30.3:16 lub 31.1:16, zależnie od wersji głównej. Działa też Bitcoin Knots (pre-RDTS) 29.3:29 lub nowszy.`,
    fr_FR: `Détermine plus fiablement les adresses des services connectés.

UTXOracle localisait ses dépendances via un champ qui ne s'applique qu'à l'un des deux modes de publication d'un port par un service. Il lit désormais l'adresse elle-même : une dépendance qui change sa façon de servir TLS reste donc trouvable par UTXOracle. Rien ne change en fonctionnement normal.

- L'interface réseau laissée par la version de ce paquet pour StartOS 0.3.5 est supprimée et son port libéré. Un domaine ou une adresse .onion que vous y aviez ajouté ne mène plus à UTXOracle ; ajoutez-en un à l'interface « Web UI » à la place.
- Le réglage « Price to Compute » de « Configure » explique chacune de ses options.
- Bitcoin doit être au moins en version 28.4:29, 29.4:16, 30.3:16 ou 31.1:16, selon sa version majeure. Bitcoin Knots (pre-RDTS) 29.3:29 ou plus récent fonctionne aussi.`,
  },
  migrations: {
    up: async ({ effects }) => {
      await sdk.MultiHost.of(effects, 'main').retire()
    },
    down: IMPOSSIBLE,
  },
})
