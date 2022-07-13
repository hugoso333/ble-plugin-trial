import { Component, NgZone } from '@angular/core';

import { BLE } from '@awesome-cordova-plugins/ble/ngx';
import { NavController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

const BATTERY_SERVICE = '180F';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})



export class HomePage {

  devices:any[] = [];
  statusMessage: string;
  alertCtrl: any;

  constructor(public navCtrl: NavController,
              private ble: BLE,
              private ngZone: NgZone,
              private router: Router)  {
  }

  blescan() {
    this.ble.scan([], 5).subscribe((device) => {
      console.log(JSON.stringify(device));

    },
      error => {
        console.log('Fail to scan!');

      });
  }

  bleStartScan() {
  this.ble.startScan([]).subscribe(device => {
    console.log(JSON.stringify(device));
  });
  setTimeout(() => {
    this.ble.stopScan();
  }, 5000);
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter');
    this.scan();
  }

  scan() {
    this.setStatus('Scanning for Bluetooth LE Devices');
    this.devices = [];  // clear list

    this.ble.scan([], 5).subscribe(
      device => this.onDeviceDiscovered(device),
      error => this.scanError(error)
    );

    setTimeout(this.setStatus.bind(this), 5000, 'Scan complete');
  }


  onDeviceDiscovered(device){
    console.log('Discovered' + JSON.stringify(device,null,2));
    this.ngZone.run(()=>{
      this.devices.push(device)
      console.log(device)
    })
    //this.bleconnect(device.id);
    //this.bleread(device.id, "0000180F-0000-1000-8000-00805F9B34FB", "00002A19-0000-1000-8000-00805F9B34FB");
  }

  bleconnect(device_id: string) {
    this.ble.connect(device_id).subscribe((peripheralData) => {
      console.log(peripheralData);

    }, peripheralData => {
      console.log('Fail to connect');

    }
    )
  }

  bleread(device_id: string, service_uuid: string, characteristic_uuid: string) {
    this.ble.read(device_id, service_uuid, characteristic_uuid).then((data) => {
      console.log('Success', JSON.stringify(data));
      alert('Data' + JSON.stringify(data));
    }, error => {
      alert('Fail')
    })
  }

  // If location permission is denied, you'll end up here
  async scanError(error) {
    this.setStatus('Error ' + error);
    const alert = await this.alertCtrl.create({
      message: 'Error scanning for Bluetooth low energy devices',
      position: 'middle',
      duration: 5000
    });
    await alert.present();
  }

  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

  deviceSelected(device) {
    console.log(JSON.stringify(device) + ' selected');
    this.router.navigate(['/detail', {device: device}]);
    //this.router.navigate(['/detail']);
  }

  jump() {
    this.router.navigate(['/detail']);
  }

}



// var battery = {
//   service: "180F",
//   level: "2A19"
// };
