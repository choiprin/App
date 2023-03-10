void readConfig() {
  SPIFFS.begin();
  File f = SPIFFS.open("/config.txt", "r");
  if (!f) {
      Serial.println("file open failed");
  }  Serial.println("====== Reading from SPIFFS file =======");
  String s=f.readStringUntil('\n');
  s.toCharArray(ssid,s.length());
  ssid[s.length()]=0;
  
  s=f.readStringUntil('\n');
  s.toCharArray(password,s.length());
  password[s.length()]=0;
  
  f.close();
  SPIFFS.end();
  Serial.println("ssid: "+String(ssid));
  Serial.println("pw: "+String(password));
}

void saveConfig() {
  SPIFFS.begin();
  File f = SPIFFS.open("/config.txt", "w");
  if (!f) {
      Serial.println("file open failed");
  }
  f.println(ssid);
  f.println(password); 
  f.close();
  SPIFFS.end();
  delay(2000);
  ESP.restart();
  delay(2000);
}

// trigger pin 0(D3) 2(D4)
void factoryDefault() {
    Serial.println("AP mode as Factory Deafault");
    Serial.println("Please wait over 3 min");
    SPIFFS.begin();
    SPIFFS.format();
    SPIFFS.end();
    delay(1000);
    ESP.restart();
    delay(1000);
}
