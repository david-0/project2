import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthHttp} from "angular2-jwt";

import {GenericService} from "../../remote/generic.service";
import {ClientSocketService} from "../../remote/client-socket.service";
import {TemperatureDevice, temperatureDevicesInfo, AnalogDevicesInfo, Port, portName} from '../../device-pool';


@Component({
  selector: 'app-temperature-config',
  templateUrl: 'temperature-setup.component.html',
  styleUrls: ['temperature-setup.component.scss']
})
export class TemperatureSetupComponent implements OnInit {
  headerTitle: string = `${temperatureDevicesInfo.displayName}-SETUP`;
  devices: TemperatureDevice[] = [];
  device: TemperatureDevice;
  selectedDevice: TemperatureDevice;
  ports: Port[];
  selectedPort: Port;
  addActionEnabled: boolean = true;
  private genericService: GenericService<TemperatureDevice>;
  message: string;

  constructor(private router: Router,
              private socketService: ClientSocketService, private authHttp: AuthHttp) {
  }

  ngOnInit() {
    this.genericService = new GenericService<TemperatureDevice>(this.authHttp,
      this.socketService, "/api/devices/temperature", "/temperature");
    this.genericService.items.subscribe(devices => {
        this.devices = devices.toArray();
        AnalogDevicesInfo.updateAnalogPortsInUse(temperatureDevicesInfo, devices.toArray().map(device => device.port));
        this.updatePortSet();
        this.device = null;
        this.selectedDevice = null;
      }, error => this.message = error.toString());
    this.genericService.getAll();
  }

  ngOnDestroy() {
    this.genericService.disconnect();
  }

  backClicked(): void {
    this.router.navigate(['/devices-setup']);
  }

  addClicked(): void {
    this.selectedDevice = null;
    this.updatePortSet();
    this.device = new TemperatureDevice();
  }

  selectDevice(device: TemperatureDevice) {
    this.clearMessage();
    this.updatePortSet(device);
    this.selectedDevice = device;
    this.device = new TemperatureDevice(this.selectedDevice.id, this.selectedDevice.name, this.selectedDevice.port);
  }

  updatePortSet(device?: TemperatureDevice): void {
    this.ports = temperatureDevicesInfo.portSet.filter(port => !AnalogDevicesInfo.analogPortsInUse.has(port) || device && port === device.port);
    this.addActionEnabled = device ? this.ports.length > 1 : this.ports.length > 0;
  }

  getPortName(port: Port): string {
    return portName(port);
  }

  doAddOrUpdate(): void {
    if (this.device) {
      if (this.device.id) {
        this.genericService.update(this.device);
      } else {
        this.genericService.create(this.device);
      }
    }
  }

  doDelete(): void {
    if (this.device && this.device.id) {
      this.genericService.del(this.device.id);
    }
  }

  clearMessage(): void {
    this.message = null;
  }

}