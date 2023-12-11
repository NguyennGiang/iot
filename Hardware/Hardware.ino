#include <Arduino.h>
#include <ESP8266WiFi.h>
#include "Adafruit_MQTT.h"
#include "Adafruit_MQTT_Client.h"
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <ArduinoJson.h>

#define WLAN_SSID "IT Hoc Bach Khoa"
#define WLAN_PASS "chungtalamotgiadinh"

#define SERVER "broker.hivemq.com"
#define SERVERPORT 1883

#define DHTPIN 5
#define DHTTYPE DHT11

WiFiClient client;
Adafruit_MQTT_Client mqtt(&client, SERVER, SERVERPORT, "", "");
Adafruit_MQTT_Publish node = Adafruit_MQTT_Publish(&mqtt, "hust/iot/data");

DHT dht(DHTPIN, DHTTYPE);

void MQTT_connect();

void setup() {
  Serial.begin(9600);
  delay(10);

  Serial.println("DHT11 MQTT Publisher");
  Serial.print("Connecting to ");
  Serial.println(WLAN_SSID);

  WiFi.begin(WLAN_SSID, WLAN_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();

  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  MQTT_connect();
}

String sPayload;
char* cPayload;

void loop() {
  float h = dht.readHumidity();
  // Read temperature as Celsius (the default)
  float t = dht.readTemperature();
  // Read temperature as Fahrenheit (isFahrenheit = true)
  if (isnan(h) || isnan(t)) {
    Serial.println("Failed to read from DHT sensor!");
  } else {
    delay(2000);
    String message = "\{\"Temperature\": " + String(t);

    message = message + ", \"Humidity\": " + String(h) + "}";

    Serial.println(message);

    char buffer[message.length() + 1];
    message.toCharArray(buffer, message.length() + 1);

    node.publish(buffer);
  }

  delay(10000);
}

void MQTT_connect() {
  int8_t ret;

  Serial.print("Connecting to MQTT... ");

  uint8_t retries = 3;
  while ((ret = mqtt.connect()) != 0) {
    Serial.println(mqtt.connectErrorString(ret));
    Serial.println("Retrying MQTT connection in 5 seconds...");
    mqtt.disconnect();
    delay(5000);
    retries--;
    if (retries == 0) {
      while (1)
        ;
    }
  }
  Serial.println("MQTT Connected!");
}