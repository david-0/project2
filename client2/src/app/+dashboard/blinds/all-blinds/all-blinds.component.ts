import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {BlindsDevice, DeviceType} from '../../../misc/device-pool';
import {IBlindsData} from '../../../../../../server/entities/data.interface';
import {AuthHttp} from 'angular2-jwt';
import {GenericService} from '../../../remote/generic.service';
import {ClientSocketService} from '../../../remote/client-socket.service';
import {NotificationService} from '../../../notification/notification.service';
import {BlindsDeviceCacheService} from '../../../cache/blinds-device.cache.service';
import {DataCacheService} from '../../../cache/data-cache.service';


@Component({
  selector: 'app-all-blinds',
  templateUrl: './all-blinds.component.html',
  styleUrls: ['./all-blinds.component.scss']
})
export class AllBlindsComponent implements OnInit {

  private cacheServiceSubscription: Subscription;
  private devices: BlindsDevice[] = [];
  private devicesState: Map<BlindsDevice, IBlindsData> = new Map<BlindsDevice, IBlindsData>();
  private dataSubscriptions: Map<BlindsDevice, Subscription> = new Map<BlindsDevice, Subscription>();

  constructor(private r: ActivatedRoute, private router: Router, private socketService: ClientSocketService,
              private blindsDeviceCacheService: BlindsDeviceCacheService, private dataCacheService: DataCacheService,
              private authHttp: AuthHttp, private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.cacheServiceSubscription = this.blindsDeviceCacheService.getDataService().subscribe((deviceService: GenericService<BlindsDevice>) => {
      deviceService.items.subscribe(devices => {
        this.unsubscribeAll();
        this.devices = devices.toArray().sort((a, b) => a.name.localeCompare(b.name));
        this.subscribeAll();
      }, error => this.notificationService.error(error.toString()));
      deviceService.getAll();
    });
  }

  ngOnDestroy() {
    this.unsubscribeAll();
    this.cacheServiceSubscription.unsubscribe();
  }

  subscribeAll(): void {
    this.devices.forEach(device => {
      let subscription = this.dataCacheService.getCacheAll(DeviceType.BLINDS, device).subscribe((data: IBlindsData[]) => {
        this.devicesState.set(device, data[data.length-1]);
      });
      this.dataSubscriptions.set(device, subscription);
    });
  }

  unsubscribeAll(): void {
    this.devices.forEach(device => {
      this.devicesState.delete(device);
      this.dataSubscriptions.get(device).unsubscribe();
      this.dataSubscriptions.delete(device);
    });
  }

  getData(device: BlindsDevice): IBlindsData {
    return this.devicesState.get(device);
  }

  select(device: BlindsDevice): void {
    this.router.navigate(['../blinds', device.id], {relativeTo: this.r});
  }

}
