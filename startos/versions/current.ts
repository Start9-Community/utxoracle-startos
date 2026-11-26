import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.9.6:12',
  releaseNotes: {
    en_US:
      'The web interface serves only the chart and its status page. If a run produces no chart, the web interface and the completion check report a failure.',
    es_ES:
      'La interfaz web solo muestra el gráfico y su página de estado. Si una ejecución no genera un gráfico, la interfaz web y la comprobación de finalización indican un fallo.',
    de_DE:
      'Die Weboberfläche zeigt nur das Diagramm und seine Statusseite. Wenn ein Lauf kein Diagramm erzeugt, melden die Weboberfläche und die Abschlussprüfung einen Fehler.',
    pl_PL:
      'Interfejs WWW wyświetla tylko wykres i jego stronę stanu. Jeśli obliczenie nie wygeneruje wykresu, interfejs WWW i kontrola ukończenia zgłoszą błąd.',
    fr_FR:
      'L’interface web affiche uniquement le graphique et sa page d’état. Si le calcul ne produit aucun graphique, l’interface web et la vérification de fin de calcul signalent un échec.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
