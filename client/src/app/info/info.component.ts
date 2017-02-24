import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {CommonRestService} from '../remote/common-rest.service';
import {Info} from '../../../../server/entities/info';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  private infoList: InfoPair[] = [];

  constructor(private router: Router, private restService: CommonRestService) {
  }

  ngOnInit() {
    this.restService.getInfo().subscribe((info: Info) => {
      this.infoList.push(new InfoPair('Titel', info.title));
      this.infoList.push(new InfoPair('Node Version', info.nodeVersion));
      this.infoList.push(new InfoPair('Anzahl CPUs', info.cpus.length.toString()));
      this.infoList.push(new InfoPair('CPU Modell', info.cpus[0].model));
      this.infoList.push(new InfoPair('Speicher total', info.totalMem.toString()));
      this.infoList.push(new InfoPair('Freier Speicher', info.freeMem.toString()));
    }, (error: any) => {});
  }

  backClicked(): void {
    this.router.navigate(['/dashboard']);
  }

}

class InfoPair {
  constructor(public name: string, public value: string){}
}
