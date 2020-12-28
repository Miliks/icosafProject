/**
 * Component not used in this context, but added for managing the activity of the shop floor operator.
 * Nevertheless is only a mock definition because no functionality was implemented
 */
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Task } from 'src/app/model/task.model';
import { SseService } from 'src/app/services/SseService/sse-service.service';
import { UCCService } from 'src/app/services/UC-C/uc-c-service.service';

// Element in the Prelievi panel
interface TaskFieldOperator {
  status: string
  det_short_id: string
}

@Component({
  selector: 'app-use-case-a',
  templateUrl: './use-case-a.component.html',
  styleUrls: ['./use-case-a.component.css']
})
export class UseCaseAComponent implements OnInit {

  currentTask: string
  displayedColumns: string[] = ['status', 'det_short_id'];
  dataSource: MatTableDataSource<TaskFieldOperator>;

  constructor(private sseService: SseService, private UCCService: UCCService) {
    this.dataSource = new MatTableDataSource<TaskFieldOperator>()

  }

  ngOnInit(): void {

    this.UCCService.getTaskListOper(1, 1).subscribe((response: any[]) => {

      if (response.length != 0) {
        this.currentTask = response[0].task_descr.toString()
      } else {
        this.currentTask = "TASK NON DEFINITO"
      }

      let tasks = response.map(element => {
        return {
          status: element.task_status_id,
          det_short_id: element.det_short_id
        }
      })
 
      // Il primo elemento nella lista deve avere loop giallo
      tasks[0].status = 5
      this.dataSource.data = [...tasks]
    })
  }

  ok() {
    console.log("ok");

  }

  notOK() {
    console.log("notOK");

  }

}
