# Euro-Stückelungsrechner

Willkommen zum Euro-Stückelungs-Rechner, einer Webanwendung, die für einen eingegebenen Betrag die Stückelung in Euro-Scheine und -Münzen berechnet. Dabei werden stets die größten verfügbaren Scheine und Münzen zuerst verwendet, um die Anzahl der benötigten Geldstücke zu minimieren. Nach jeder Berechnung wird angezeigt, wie sich die Stückelung im Vergleich zur vorherigen Eingabe verändert hat. Die Berechnung kann wahlweise im Frontend (Angular) oder Backend (Spring Boot) erfolgen und ist über die Oberfläche umschaltbar.

## Technologie-Stack

### Frontend
- Angular 20
- TypeScript
- SCSS
- Jasmine & Karma (Testing)
- Volta (Node-Version-Management)

### Backend
- Spring Boot 3.4
- Java 21 (Temurin)
- Maven Wrapper
- JUnit & MockMvc (Testing)

## Getting Started

### Voraussetzungen

- [Node.js](https://nodejs.org/) >= 20.19.0 (via [Volta](https://volta.sh/))
- [npm](https://www.npmjs.com/) >= 10.8.2
- [Java 21 (Temurin)](https://adoptium.net/)
- [Maven Wrapper](https://maven.apache.org/wrapper/)

### Installation

1. Volta, Node.js und npm installieren
   ```bash
   curl https://get.volta.sh | bash
   volta install node@20.19.0
   volta install npm@10.8.2
   ```
1. Klone das Repository:
   ```bash
   git clone https://github.com/Ali-Uen/euro-stueckelung-rechner.git
   ```
2. Frontend starten:
   ```bash
   cd euro-stueckelung-frontend
   npm install
   npm start
   ```
3. Backend starten:
   ```bash
   cd euro-stueckelung-backend
   ./mvnw spring-boot:run
   ```

## Nutzung
1. Anwendung im Browser öffnen: `http://localhost:4200`
2. Betrag eingeben, Stückelung und Differenz im Modus Backend oder Frontend berechnen lassen