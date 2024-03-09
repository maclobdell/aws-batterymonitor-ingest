#include "Adafruit_DHT.h"

// Example testing sketch for various DHT humidity/temperature sensors
// Written by ladyada, public domain
// Modified by Mac Lobdell

#define DHTPIN 2

#define DHTTYPE DHT11		// DHT 11 

// Connect pin 1 (on the left) of the sensor to +5V
// Connect pin 2 of the sensor to whatever your DHTPIN is
// Connect pin 4 (on the right) of the sensor to GROUND
// Connect a 10K resistor from pin 2 (data) to pin 1 (power) of the sensor

DHT dht(DHTPIN, DHTTYPE);

void setup() {
	Serial.begin(9600); 
	Serial.println("Environmental Sensor!");

	dht.begin();
}

void loop() {
    // Wait between measurements.
	delay(60000);

   // Reading temperature or humidity takes about 250 milliseconds!
   // Sensor readings may also be up to 2 seconds 'old' (very slow sensor)
	float h = dht.getHumidity();
	float t = dht.getTempCelcius();
	float f = dht.getTempFarenheit();
  
    // Check if any reads failed and exit early (to try again).
	if (isnan(h) || isnan(t) || isnan(f)) {
		Serial.println("Failed to read from DHT sensor!");
		Particle.publish("sensor-read-fail", NO_ACK);https://build.particle.io/build/xxxxxxxxxxxxxxxxxxxxxxxxxxx#flash
		return;
	}

	Serial.println(Time.timeStr());
	Serial.print("Humid: ");
	Serial.print(h);
	Serial.print("%");
	Serial.println();
	Serial.print("Temp: "); 
	Serial.print(t);
	Serial.print("*C ");
	Serial.print(f);
	Serial.print("*F ");
	Serial.println();
	
    Particle.publish("bat_humidity", String::format("%.1f", h), NO_ACK);
    Particle.publish("bat_temperature", String::format("%.1f", f), NO_ACK);

   // Current Sensor

    int adc = analogRead(A0);
    float voltage = adc*3.3/4095.0;
    float current = (voltage-1.65)/0.185;
    if (current < 0.16) {
        current = 0;
    }
    Serial.print("current : ");
    Serial.println(current);
    delay(300);	
	
    Particle.publish("bat_current", String::format("%.1f", current), NO_ACK);

}

