import { Component, NgZone } from '@angular/core';
import { BLE } from '@awesome-cordova-plugins/ble/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  readBLE:any;
  wifiName:any;
  wifiPassword:any;
  devices:any[] = [];
  data:any;
  Mac:any;
  constructor(private ble:BLE,private ngZone: NgZone,private alertController: AlertController) 
  {
    
  }

  stringToBytes(string) { //앱에서 보낼 때 데이터가공
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
        array[i] = string.charCodeAt(i);
    }
    return array.buffer;
  }

  bytesToString(buffer) { 
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
  }

  Scan(){
    this.devices = [];
    this.ble.scan([],15).subscribe(
      device => this.onDeviceDiscovered(device)
    );
  }

  connect(){
    this.ble.connect(this.Mac).subscribe(peripheralData => {
      console.log(peripheralData);
      this.ble.write(this.Mac, "6E400001-B5A3-F393-E0A9-E50E24DCCA9E" , "6E400002-B5A3-F393-E0A9-E50E24DCCA9E",
      this.stringToBytes(this.data));
    },
    peripheralData => {
      console.log('disconnected');
    });
  }

  // connect2(){
    
  //   this.ble.connect(this.Mac).subscribe(peripheralData => {
  //     console.log(peripheralData);
  //     //this.readBLE = this.ble.read(this.Mac, "6E400001-B5A3-F393-E0A9-E50E24DCCA9E", "6E400003-B5A3-F393-E0A9-E50E24DCCA9E");
  //     //this.data=this.readBLE;
  //     this.readBLE=this.ble.read(this.Mac,"4fafc201-1fb5-459e-8fcc-c5c9c331914b" , "beb5483e-36e1-4688-b7f5-ea07361b26a8");
  //     console.log(this.readBLE);
  //   },
  //   peripheralData => {
  //     console.log('disconnected');
  //   });

    
  //   /*this.devices = [];
  //   this.ble.connect("C4:7C:8D:63:92:E5",connectCallback(),disconnectCallback());*/
  // }

  onDeviceDiscovered(device){
    console.log('Discovered' + JSON.stringify(device,null,2));
    this.ngZone.run(()=>{
      this.devices.push(device)
      console.log(device)
      if(device.name=="LightTalk"){
        this.Mac=device.id;
        
      }
    })
  }
  
  async presentAlert() {
    const alert = await this.alertController.create({
      header: '와이파이 정보를 입력해주세요',
      buttons: [
        {
            text: 'Ok',
            handler: (alertData) => {
              this.data = alertData.ssid+","+alertData.pw;
              this.wifiName=alertData.ssid;
              this.wifiPassword=alertData.pw;
          }
        }
    ],
      inputs: [
        { name: "ssid",
          placeholder: 'Wifi 이름',
        },
        { 
          name: "pw",
          placeholder: 'Wifi 비밀번호',
          type: "password"
        }
      ],
    });

    await alert.present();
  }

  async presentAlert2() {
    const alert = await this.alertController.create({
      header: 'WiFi',
      subHeader: '',
      message: '이름 : '+ this.wifiName + '<br>' +'비밀번호 : ' + this.wifiPassword,
      buttons: ['OK'],
    });

    await alert.present();
  }
}

