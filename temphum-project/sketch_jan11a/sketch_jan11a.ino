#include <DHT.h>                 // Uključujemo biblioteku za rad sa DHT senzorom
#include <Firebase_ESP_Client.h> // Uključujemo biblioteku za rad sa Firebase-om
#include <ESP8266WiFi.h>         // Uključujemo biblioteku za WiFi

#define DHTPIN 2         // Pin na kojem je spojen DHT senzor (GPIO2 za NodeMCU)
#define DHTTYPE DHT11    // Tip senzora koji koristimo, DHT11

DHT dht(DHTPIN, DHTTYPE);  // Kreiramo objekat za DHT senzor

// Firebase Configuration
#define FIREBASE_HOST "iot-projekat-f96fa-default-rtdb.firebaseio.com"

// WiFi Configuration
#define WIFI_SSID "Galaxy A54 5G"
#define WIFI_PASSWORD "12345671"

FirebaseData firebaseData;
FirebaseConfig config;

// Definiramo pinove za LED diode
const int redLedPin = D7;
const int greenLedPin = D8;

// Promenljiva za praćenje prethodne temperature
float previousTemperature = NAN;

void setup() {
  Serial.begin(115200);
  dht.begin();

  pinMode(redLedPin, OUTPUT);
  pinMode(greenLedPin, OUTPUT);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println(" Connected to WiFi!");

  config.host = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_SECRET;

  Firebase.begin(&config, NULL);
  Serial.println("Firebase connected!");
}

void loop() {
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();

  if (isnan(temp) || isnan(hum)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  Serial.print("Temperature: ");
  Serial.print(temp);
  Serial.print(" °C  Humidity: ");
  Serial.print(hum);
  Serial.println(" %");

  // Povezivanje podataka sa Firebase-om
  if (Firebase.RTDB.setFloat(&firebaseData, "/temperature", temp)) {
    Serial.println("Temperature sent to Firebase");
  } else {
    Serial.println("Failed to send temperature to Firebase");
    Serial.println(firebaseData.errorReason());
  }

  if (Firebase.RTDB.setFloat(&firebaseData, "/humidity", hum)) {
    Serial.println("Humidity sent to Firebase");
  } else {
    Serial.println("Failed to send humidity to Firebase");
    Serial.println(firebaseData.errorReason());
  }

  // Kontrola LED dioda na osnovu promene temperature
  if (!isnan(previousTemperature)) {
    if (temp > previousTemperature) {
      // Temperatura se povećala – upali zelenu LED diodu
      digitalWrite(greenLedPin, HIGH);
      digitalWrite(redLedPin, LOW);
      Serial.println("Temperature increased - Green LED ON");
    } else if (temp < previousTemperature) {
      // Temperatura se smanjila – upali crvenu LED diodu
      digitalWrite(greenLedPin, LOW);
      digitalWrite(redLedPin, HIGH);
      Serial.println("Temperature decreased - Red LED ON");
    }
  }

  // Ažuriramo prethodnu temperaturu
  previousTemperature = temp;

  // Čekamo 5 sekundi pre sledećeg očitavanja
  delay(5000);
}