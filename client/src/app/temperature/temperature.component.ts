import {Component, OnInit} from '@angular/core';
import {Router}    from '@angular/router';
import {ClientSocketService} from '../remote/client-socket.service';
import {TemperatureService} from '../remote/temperature.service';
import {ITemperatureData} from "../../../../server/entities/data.interface";

@Component({
  selector: 'app-temperature',
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.scss']
})
export class TemperatureComponent implements OnInit {

  private temp1: TemperatureService;
  private lastValue: number;

  constructor(private socketService : ClientSocketService, private router: Router) {
  }

  ngOnInit() {
    this.temp1 = new TemperatureService("1", this.socketService);
    this.temp1.values.subscribe((temperatureData: ITemperatureData) => {
        this.lastValue = temperatureData.value;
        console.log("subscribe called");
      },
      error => console.log(error));
  }

  backClicked(): void {
    this.router.navigate(['/dashboard']);
  }
}
