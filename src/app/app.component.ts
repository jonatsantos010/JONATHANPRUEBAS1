import { environment } from './../environments/environment';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { VersionCheckService } from './shared/services/check-service/version-check.service';
import { ScreenSplashService } from '@screen-splash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  habilitarChat = false;
  showScreenSplash = false;
  messageScreenSplash = '';

  constructor(
    private readonly router: Router,
    private readonly versionCheckService: VersionCheckService,
    private readonly cdr: ChangeDetectorRef,
    private readonly screenSplash: ScreenSplashService
  ) {
  }

  ngAfterViewInit(): void {
    this.screenSplash.showSubject.subscribe(
      (show: boolean): void => {
        this.showScreenSplash = show;
        this.cdr.detectChanges();
      }
    );

    this.screenSplash.messageSubject.subscribe(
      (message: string): void => {
        this.messageScreenSplash = message;
        this.cdr.detectChanges();
      }
    );
  }

  ngOnInit(): void {
    (window as any)['global'] = window;
    this.versionCheckService.initVersionCheck(
      environment.versioncheckurl,
      1500000
    );

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.enableChat();
      }
    });
  }

  enableChat() {
    this.habilitarChat = true;
    const url = window.location.pathname;
    if (url === '/' || url.indexOf('/extranet') > -1 || url.indexOf('/siniestrosoat') > -1) {
      this.habilitarChat = false;
    }
    sessionStorage.setItem('enableSubscription', 'true');
    sessionStorage.setItem('enableSubscriptionVL', 'false');
  }
}
