import { Component, OnDestroy } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnDestroy {

  qrCodeString = "";
  scannedResult:any;
  content_visibility = '';
  loadingController: any;

  constructor() {}
  
  async checkPermission() {
    try {
      //check or request permission
      const status = await BarcodeScanner.checkPermission({force:true});
      if(status.granted){
        return true;
      }
      
    }
    catch(ex){
      console.log(ex);
    }
    return false;
  }

  async startScan() {
    try {
      const permission = await this.checkPermission();
      if(!permission){
        return;
      }
      await BarcodeScanner.hideBackground();
      //document.querySelector('body').classList.add('scanner-active');
      this.content_visibility = 'hidden';  
      const result = await BarcodeScanner.startScan();
      console.log(result);
      this.content_visibility = '';
      BarcodeScanner.showBackground();
      //document.querySelector('body').classList.remove('scanner-active');
      if(result?.hasContent){
        this.scannedResult = result.content;
        
        
        console.log(this.scannedResult);
      }
    } catch (error) {
      console.log(error);
      this.stopScan();
    }
  }

  stopScan() {
    this.content_visibility = '';
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    //document.querySelector('body').classList.remove('scanner-active');
  }

  changeQRCode(){
    this.qrCodeString = (document.getElementById('generateqr') as HTMLInputElement).value;

    /*const loading = await this.loadingController.create({
      message: 'Loading...',
      duration: 3000,
      spinner: 'bubbles'
    });
    await loading.present();*/
  }

  ngOnDestroy(): void {
    this.stopScan();
  }
}