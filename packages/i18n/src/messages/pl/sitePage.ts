import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/sitePage";

export const messages = {
  "sitePage.error.title": "Nie można załadować tej strony",
  "sitePage.error.body": "Sprawdź połączenie i odśwież stronę. Jeśli nadal się nie ładuje, wróć do strony głównej.",
  "sitePage.error.reload": "Odśwież stronę",
  "sitePage.error.home": "Wróć na start",
  "sitePage.join.title": "Dołącz do serwera OmniBot",
  "sitePage.join.description": "Otwórz prywatne zaproszenie do serwera w OmniBot.",
  "sitePage.join.eyebrow": "Prywatne zaproszenie",
  "sitePage.join.intro":
    "Otwórz to zaproszenie w OmniBot. Aplikacja sprawdzi serwer i poprosi o potwierdzenie przed połączeniem.",
  "sitePage.join.invalid":
    "Ten link z zaproszeniem jest nieprawidłowy lub niekompletny. Poproś właściciela serwera o nowe zaproszenie.",
  "sitePage.join.open": "Otwórz OmniBot",
  "sitePage.join.browser": "Otwórz w przeglądarce",
  "sitePage.join.download": "Pobierz OmniBot",
  "sitePage.join.notOpened":
    "Jeśli OmniBot się nie otworzył, zainstaluj go przyciskiem {download} albo uruchom OmniBot raz, aby mógł otwierać linki z zaproszeniami. Możesz też użyć przycisku {browser}.",
  "sitePage.join.mobile":
    "Jeśli OmniBot jest zainstalowany, stuknij {open}. Możesz też wkleić ten link w Dodaj serwer w aplikacji.",
  "sitePage.join.singleUse":
    "Link jednorazowy działa raz, a potem wygasa. Link stały działa, dopóki właściciel go nie unieważni. OmniBot pokazuje datę wygaśnięcia, zanim dołączysz.",
  "sitePage.join.email": "Jeśli zaproszenie przyszło e-mailem, zaloguj się do OmniBot tym adresem e-mail.",
  "sitePage.join.share": "Ten link daje dostęp do serwera. Udostępniaj go tylko osobom, które chcesz zaprosić.",
  "sitePage.connect.title": "Wróć do OmniBot",
  "sitePage.connect.failedTitle": "Połączenie nie zostało zakończone",
  "sitePage.connect.openApp": "Otwórz OmniBot",
  "sitePage.connect.tryAgainApp": "Spróbuj w OmniBot",
  "sitePage.connect.tryAgainBrowser": "Spróbuj w przeglądarce",
  "sitePage.connect.doneInWebClient": "Twoja karta OmniBot kończy połączenie z {name}. Możesz zamknąć tę kartę.",
  "sitePage.connect.doneInApp": "OmniBot kończy połączenie z {name} na Twoim komputerze.",
  "sitePage.connect.failure.cancelled": "Połączenie z {name} zostało anulowane. Nic się nie zmieniło.",
  "sitePage.connect.failure.expired": "Logowanie do {name} wygasło. Rozpocznij połączenie ponownie.",
  "sitePage.connect.failure.exchange": "{name} nie potwierdził połączenia. Spróbuj ponownie.",
  "sitePage.connect.failure.enterprise": "Połącz jeden obszar roboczy Slack, a nie całą organizację.",
  "sitePage.connect.failure.takenSlack":
    "Inny serwer OmniBot już odpowiada w tym obszarze roboczym Slack. Odłącz go na tamtym serwerze, a potem spróbuj ponownie.",
  "sitePage.connect.failure.takenDiscord":
    "Inny serwer OmniBot już odpowiada na tym serwerze Discord. Odłącz go na tamtym serwerze, a potem spróbuj ponownie.",
  "sitePage.connect.failure.unavailable": "OmniBot nie może teraz połączyć się z {name}. Spróbuj później.",
  "sitePage.connect.failure.tabClosed":
    "Karta OmniBot, która rozpoczęła połączenie z {name}, nie odpowiedziała. Otwórz OmniBot w przeglądarce i ponownie połącz {name}.",
  "sitePage.connect.failure.failed": "{name} nie zakończył połączenia. Spróbuj ponownie.",
  "sitePage.connect.restartHint":
    "W OmniBot otwórz {serverSettings}, potem {connectors}, potem {name} i wybierz {connect}.",
  "sitePage.connect.notOpened":
    "Uruchom OmniBot, a potem spróbuj ponownie. Jeśli OmniBot nie jest zainstalowany na tym komputerze, pobierz go i połącz {name} w aplikacji.",
  "sitePage.openApp.title": "Nic się nie otworzyło?",
  "sitePage.openApp.dismiss": "Nie teraz",
  "sitePage.billing.pageTitle": "Płatności OmniBot",
  "sitePage.billing.updatedTitle": "Płatności zaktualizowane",
  "sitePage.billing.updatedBody": "Wróć do OmniBot. Możesz zamknąć tę stronę.",
  "sitePage.billing.cancelledTitle": "Płatność anulowana",
  "sitePage.billing.cancelledBody": "Nic nie zostało pobrane. Wróć do OmniBot.",
  "sitePage.report.pageTitle": "Zgłoś hostowaną stronę — OmniBot",
  "sitePage.report.title": "Zgłoś hostowaną stronę",
  "sitePage.report.intro":
    "Wyślij zgłoszenie o szkodliwych lub nielegalnych treściach pod adresem omnibot-sites.example.com.",
  "sitePage.report.hostnameLabel": "Adres strony",
  "sitePage.report.hostnameMissing": "Wpisz adres strony",
  "sitePage.report.reasonLabel": "Powód",
  "sitePage.report.reason.phishing": "Phishing",
  "sitePage.report.reason.malware": "Złośliwe oprogramowanie",
  "sitePage.report.reason.abuse": "Nadużycie",
  "sitePage.report.reason.copyright": "Prawa autorskie",
  "sitePage.report.reason.other": "Inne",
  "sitePage.report.detailsLabel": "Szczegóły",
  "sitePage.report.optional": "Opcjonalnie",
  "sitePage.report.detailsPlaceholder": "Co jest nie tak z tą stroną?",
  "sitePage.report.send": "Wyślij zgłoszenie",
  "sitePage.report.sending": "Wysyłanie…",
  "sitePage.report.tooMany": "Za dużo zgłoszeń. Spróbuj później.",
  "sitePage.report.sendFailed": "Nie można wysłać zgłoszenia. Spróbuj ponownie.",
  "sitePage.report.writeTo": "Możesz też napisać na {email}.",
  "sitePage.report.sentTitle": "Zgłoszenie wysłane",
  "sitePage.report.sentBody": "Dziękujemy. Otrzymaliśmy Twoje zgłoszenie.",
  "sitePage.report.home": "Przejdź do strony głównej",
} as const satisfies PartialTranslation<typeof source>;
