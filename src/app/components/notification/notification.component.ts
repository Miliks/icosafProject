import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UCCService } from 'src/app/services/UC-C/uc-c-service.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  public dialogRef: MatDialogRef<NotificationComponent>

  taskId: string
  workAreaId: string
  agvId: string
  constructor(
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data, private UCCService: UCCService) {
    if (data.taskId) this.taskId = data.taskId
    if (data.workAreaId) this.workAreaId = data.workAreaId
    if (data.agvId) this.agvId = data.agvId
  }

  ngOnInit(): void {
  }

  risolviOra() {
    this.router.navigate(["Home", { outlets: { dashboardContent: ["work-area", this.workAreaId, "agv-details", this.agvId] } }], { queryParams: { taskId: this.taskId } });
  }



}
