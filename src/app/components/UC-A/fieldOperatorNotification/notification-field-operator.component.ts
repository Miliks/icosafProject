import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UCCService } from 'src/app/services/UC-C/uc-c-service.service';

@Component({
  selector: 'app-notification-field-operator',
  templateUrl: './notification-field-operator.component.html',
  styleUrls: ['./notification-field-operator.component.css']
})
export class NotificationFieldOperatorComponent implements OnInit {


  severity: string
  cobotName: string
  typeofError: string
  taskId: Number


  public dialogRef: MatDialogRef<NotificationFieldOperatorComponent>


  constructor(@Inject(MAT_DIALOG_DATA) public data, private uccService: UCCService, private router: Router) {

    this.cobotName = data.cobotName ? data.cobotName : ""
    this.typeofError = data.typeofError ? data.typeofError : ""
    this.severity = data.severity ? data.severity : ""
    this.taskId = data.task_id ? data.task_id : null
  }

  ngOnInit(): void {
  }

  /**
 * Task effetuato con successo comunicare backend
 */
  ok() {
    this.uccService.setTaskStatusOk(Number(this.taskId)).subscribe(_ => {
      this.router.navigate(["FieldOperator"])
    })

  }

  /**
   * Task effetuato con errore comunicare backend
   */
  notOK() {

    //TODO per il momento è settato errorTypeId a 3 ma è da vedere quale valore inserire
    this.uccService.setTaskStatusNotOk(Number(this.taskId), 3).subscribe(_ => {
      this.router.navigate(["FieldOperator"])
    })

  }

}
