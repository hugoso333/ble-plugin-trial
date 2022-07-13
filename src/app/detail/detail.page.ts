import { Component, OnInit, NgZone} from '@angular/core';
import { BLE } from '@awesome-cordova-plugins/ble/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

const BATTERY_SERVICE = '180F';
const BATTERY_CHARACTERISTIC = '2A19';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})

export class DetailPage implements OnInit {

  peripheral: any = {};
  battery: number;
  statusMessage: string;

  constructor(private route: ActivatedRoute,
              private ngZone: NgZone,
              private ble: BLE,
              private alertCtrl: AlertController) {

    let device = this.route.params['device'];
    this.setStatus('Connecting to ' + device.name || device.id);

    // This is not a promise, the device can call disconnect after it connects, so it's an observable
    this.ble.connect(device.id).subscribe(
      peripheral => this.onConnected(peripheral),
      //peripheral => this.showAlert('Disconnected', 'The peripheral unexpectedly disconnected')
    );
   }

  ngOnInit() {

  }

  // the connection to the peripheral was successful
  onConnected(peripheral) {

    this.peripheral = peripheral;
    this.setStatus('Connected to ' + (peripheral.name || peripheral.id));

    // // Subscribe for notifications when the temperature changes
    // this.ble.startNotification(this.peripheral.id, THERMOMETER_SERVICE, TEMPERATURE_CHARACTERISTIC).subscribe(
    //   data => this.onTemperatureChange(data),
    //   () => this.showAlert('Unexpected Error', 'Failed to subscribe for temperature changes')
    // )

    // // Read the current value of the temperature characteristic
    // this.ble.read(this.peripheral.id, THERMOMETER_SERVICE, TEMPERATURE_CHARACTERISTIC).then(
    //   data => this.onTemperatureChange(data),
    //   () => this.showAlert('Unexpected Error', 'Failed to get temperature')
    // )

  }

  async showAlert(title, message) {
    let alert = this.alertCtrl.create({
      buttons: ['OK']
    });
    (await alert).present();
  }

  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }


}
