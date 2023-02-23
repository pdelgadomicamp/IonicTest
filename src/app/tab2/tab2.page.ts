import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BleClient, BluetoothLe } from '@capacitor-community/bluetooth-le';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  devices:any[] = [];
  ble:boolean = false;
  scanText:string = "";

  constructor(
    private change:ChangeDetectorRef
  ) {}


  async ngOnInit(): Promise<void> {
    await BleClient.initialize({ androidNeverForLocation: true }).then( () => {
      BleClient.isEnabled().then( (res) => {
        if(res){
          this.ble = true;
        }
        else {
          this.ble = false;
        }
      })
    });
  }

  toggleBle(event:any){
    if(this.ble){
      this.enableBluetooth();
    }
    else {
      this.disableBluetooth();
    }
  }

  enableBluetooth(){
    BleClient.enable();
  }

  disableBluetooth(){
    BleClient.disable();
  }

  startScanning(){
    this.scanText = "Scanning...";
    
    BleClient.requestLEScan({allowDuplicates:false}, (res1) => {
      if(res1.localName){
        if(!this.devices.includes(res1)){
          this.devices.push(res1);
          this.change.detectChanges();
        }
      }
    });

    setTimeout( () => {
      this.stopScanning();
    },20000);
  }

  stopScanning(){
    BluetoothLe.stopLEScan().then( () => {
      this.scanText = "";
    });
  }

  connect(device:any, index:any){
    BleClient.connect(device.device.deviceId).then( () => {
      this.devices[index]["connection"] = true;
      this.change.detectChanges();

      alert("Connected");
    },
    (err) => {
      alert(err);
    });
  }

  disconnect(device:any, index:any){
    BleClient.disconnect(device.device.deviceId).then( () => {
      this.devices[index]["connection"] = false;
      this.change.detectChanges();

      alert("Disconnected");
    });
  }

}
