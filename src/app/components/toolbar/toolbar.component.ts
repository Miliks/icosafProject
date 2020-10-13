import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  path: string

  constructor(private router: Router, public location: Location, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {



    iconRegistry.addSvgIcon(
      'bell-icon-notified',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/bellIconNotified.svg'));

  }


  ngOnInit(): void {

    this.location.onUrlChange(() => {
      this.path = "";
      let url = this.location.path()
      let normalizedUrl = url.slice(1, url.length)
      let segments = normalizedUrl.split("/")


      for (let i = 0; i < segments.length; i++) {

        console.log(segments[i])
        switch (segments[i]) {
          case "(dashboardContent:work-area":
            segments[i] = "Area di Lavoro"
            break;
          case "agv-details":
            segments[i] = "AGV"
            break;
          default:
            break;
        }

        if (i == segments.length - 1) {
          if (segments[i].endsWith(")")) {
            this.path += segments[i].substring(0, segments[i].length - 1)
          } else {
            this.path += segments[i]
          }
        }
        else
          this.path += segments[i] + " > "
      }
    })

  }


  logout() {
    // this.authService.logout()
    this.router.navigate(['home'])
  }
}
