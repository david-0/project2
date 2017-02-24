import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TemperatureSetupComponent} from './temperature-setup/temperature-setup.component';
import {HumiditySetupComponent} from './humidity-setup/humidity-setup.component';
import {BlindsSetupComponent} from './blinds-setup/blinds-setup.component';
import {DevicesSetupComponent} from './devices-setup.component';
import {deviceSetupRouting} from './devices-setup.routes';
import {FormsModule} from '@angular/forms';
import {AnalogSetupComponent} from './analog-setup/analog-setup.component';

@NgModule({
  imports: [
    CommonModule,
    deviceSetupRouting,
    FormsModule,
  ],
  declarations: [
    AnalogSetupComponent,
    TemperatureSetupComponent,
    HumiditySetupComponent,
    BlindsSetupComponent,
    DevicesSetupComponent
  ]
})

export class DeviceSetupModule {
}
