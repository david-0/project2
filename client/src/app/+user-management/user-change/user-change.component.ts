import {Component, OnInit} from "@angular/core";
import {IUser} from "../../../../../server/entities/user.interface";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {UserTypesArray, UserType} from "../../../../../server/entities/user-type";
import {AuthenticationService} from "../../remote/authentication.service";
import {UserCacheService} from "../../cache/service/user.cache.service";
import {NotificationService} from "../../notification/notification.service";

@Component({
  selector: 'app-user-change',
  templateUrl: 'user-change.component.html',
  styleUrls: ['user-change.component.scss']
})
export class UserChangeComponent implements OnInit {

  private sub: Subscription;
  private user: IUser = {type: UserType.STANDARD};
  private userPasswordHash: string;
  private userType: UserType;
  private title: string;
  private userTypes: any[];

  constructor(private userCacheService: UserCacheService, private route: ActivatedRoute, private router: Router,
              private authenticationService: AuthenticationService, private notificationService: NotificationService) {
    this.userTypes = UserTypesArray;
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.userCacheService.getDataService().subscribe(dataService => {
          this.user = dataService.getCache(params['id']);
          this.userPasswordHash = this.user.password;
          this.userType = this.user.type;
          this.user.password = '';
          this.title = "Benutzer ändern";
        });
      } else {
        this.title = "Neuen Benutzer anlegen";
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  submit(user: IUser) {
    this.userCacheService.getDataService().subscribe(dataService => {
      if (this.user.id) {
        user.id = this.user.id;
        if (!user.password) {
          user.password = this.userPasswordHash;
        }
        if (user.type == undefined) {
          user.type = this.userType;
        }
        dataService.getRestService().update(user).subscribe(user => {
          this.notificationService.info('Benutzer wurde erfolgreich modifiziert');
          this.router.navigate(['../..'], {relativeTo: this.route});
        }, error => {
          this.notificationService.error(`Benutzer konnte nicht modifiziert werden (${JSON.stringify(error)})`);
        });
      } else {
        dataService.getRestService().add(user).subscribe(user => {
          this.notificationService.info('Neuer Benutzer wurde erfolgreich angelegt');
          this.router.navigate(['..'], {relativeTo: this.route});
        }, error => {
          this.notificationService.error(`Neuer Benutzer konnte nicht angelegt werden (${JSON.stringify(error)})`);
        });
      }
    });
  }

  cancel() {
    if (this.user.id) {
      this.router.navigate(['../..'], {relativeTo: this.route});
    } else {
      this.router.navigate(['..'], {relativeTo: this.route});
    }
  }

  isLoggedInUser(user: IUser) {
    return user.username === this.authenticationService.getLoggedInUsername();
  }
}