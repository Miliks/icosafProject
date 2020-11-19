import { AfterViewInit, Component, OnInit } from '@angular/core';
import { WorkArea } from 'src/app/model/work-area.model';
import { Agv } from 'src/app/model/agv.model';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { EXPANSION_PANEL_ANIMATION_TIMING } from '@angular/material/expansion';
import { UCCService } from 'src/app/services/UC-C/uc-c-service.service';
import { Order } from 'src/app/model/order.model';
import { Task } from 'src/app/model/task.model';
import { SseService } from 'src/app/services/SseService/sse-service.service';
import { LoginDialogComponent } from '../login/login-dialog/login-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [
    // Each unique animation requires its own trigger. The first argument of the trigger function is the name
    trigger('rotatedState', [
      state('collapsed', style({ transform: 'rotate(0)' })),
      state('expanded', style({ transform: 'rotate(-180deg)' })),
      transition('expanded <=> collapsed', animate(EXPANSION_PANEL_ANIMATION_TIMING)),
    ]),
  ]
})
export class DashboardComponent implements OnInit {


  stateJPH: string
  stateSat: string
  stateCycleTime: string
  useCase: string;

  expandPanel(expPanel, state) {
    expPanel.toggle()
    this.rotate(state)
  }

  rotate(state: string) {


    switch (state) {
      case 'stateSat':
        this.stateSat = (this.stateSat === 'collapsed' ? 'expanded' : 'collapsed');
        break;
      case 'stateJPH':
        this.stateJPH = (this.stateJPH === 'collapsed' ? 'expanded' : 'collapsed');

        break;
      case 'stateCycleTime':
        this.stateCycleTime = (this.stateCycleTime === 'collapsed' ? 'expanded' : 'collapsed');

        break;

      default:
        break;
    }
  }

  workAreas: WorkArea[]
  progress: number

  selectedWorkArea: WorkArea
  selectedAgv: Agv


  constructor(
    private activatedRoute: ActivatedRoute,
    private sseService: SseService,
    private router: Router,
    private UCCService: UCCService) {




    this.stateJPH = 'collapsed';
    this.stateSat = 'collapsed'
    this.stateCycleTime = 'collapsed'

    this.progress = 75
    this.workAreas = []


  }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe((params) => {

      if (params['useCase']) {
        this.useCase = params['useCase']

        let w1_2 = this.useCase === "UC-C" ? new WorkArea(1, "AMR", [new Agv(1),new Agv(2)]) : new WorkArea(2, "CSKP", [new Agv(3), new Agv(4), new Agv(5), new Agv(6)])
        //   let w3 = new WorkArea(3, "3", [new Agv(10), new Agv(11)])
        //   let w4 = new WorkArea(4, "4", [new Agv(12), new Agv(13)])
        //   let w5 = new WorkArea(5, "5", [new Agv(8), new Agv(9)])



        //    w5.agvList[0].setProgress(100)
        //    w5.agvList[1].setProgress(52)
        //    w5.agvList[1].setError(true)

        //    w3.agvList[0].setProgress(100)
        //   w3.agvList[1].setProgress(52)
        //    w3.agvList[1].setError(true)

        //    w4.agvList[0].setProgress(77)
        //    w4.agvList[1].setProgress(99)
        //    w4.agvList[1].setError(true)

        this.workAreas.push(w1_2) // w5, w3, w4


        if (!this.selectedWorkArea && !this.selectedAgv) {
          this.selectWorkArea(this.workAreas[0])
          this.openAgvDetails(this.selectedWorkArea, this.selectedWorkArea.agvList[0]);
        }

        //TODO remove timestamp hardcoded
        this.UCCService.getSubjectSelectedWorkAreaAndAgv().subscribe(workAreaAndAgvIds => {

          console.log(workAreaAndAgvIds);

          this.selectedWorkArea = this.workAreas.find(workArea => workArea.id === workAreaAndAgvIds[0])
          //this.selectWorkArea(this.workAreas.find(workArea => workArea.id === workAreaAndAgvIds[0]))
          //console.log("selected is ", this.selectedWorkArea);      
          //console.log("its AGVList is ", this.selectedWorkArea.agvList);

          this.openAgvDetails(this.selectedWorkArea, this.selectedWorkArea.agvList.find(agv => agv.id === workAreaAndAgvIds[1]))
        })

        //TODO calcolo percentuali di risoluzione task corrente
        this.UCCService.getOrdListByDateAndUC(this.useCase, "2020-07-24").subscribe((orders: Order[]) => {

          //Ottengo il primo ordine non terminato e definisco questo come ordine corrente
          this.UCCService.currentOrder = orders.find(order => order.order_ts_end == null)
          //salvo nella sessione currentOrder
          localStorage.setItem('currentOrder', JSON.stringify(this.UCCService.currentOrder));

          this.UCCService.getTaskListOrder(this.UCCService.currentOrder.order_id).subscribe((tasks: Task[]) => {
            // Per ricavare la workarea in cui lavora il nostro agv facciamo una ricerca interna per il momento
            // w1.agvList[0].setProgress(completed*100/total)
            // w1.agvList[0].setError(error)
            //Funziona solo se esiste almeno un task
            calculatePercentage(tasks, this.workAreas)
          })
        })

        this.sseService
          .getServerSentEvent("http://localhost:4200/API/events")
          .subscribe(data => {

            //recompute percentage tasks
            this.UCCService.getTaskListOrder(this.UCCService.currentOrder.order_id).subscribe((tasks: Task[]) => {
              // Per ricavare la workarea in cui lavora il nostro agv facciamo una ricerca interna per il momento
              // w1.agvList[0].setProgress(completed*100/total)
              // w1.agvList[0].setError(error)
              //Funziona solo se esiste almeno un task
              calculatePercentage(tasks, this.workAreas)
            })

          })
      }
    })
  }



  openAgvDetails(workArea: WorkArea, agv: Agv) {

    this.selectedAgv = agv
    this.selectedWorkArea = workArea
    //console.log(this.selectedAgv);

    this.router.navigate(["Home", "use-case", `${this.useCase}`, { outlets: { dashboardContent: ["work-area", workArea.id, "agv-details", agv.id] } }]);

    //event.stopPropagation();
  }

  selectWorkArea(workArea: WorkArea) {
    this.selectedAgv = null
    if (this.selectedWorkArea == null)
      this.selectedWorkArea = workArea
    else {
      this.selectedWorkArea = null
      this.router.navigate(["Home", "use-case", `${this.useCase}`])
    }
  }

  openGraph(typeGraph: string) {
    //event.stopPropagation();
    this.router.navigate(["Home", "use-case", `${this.useCase}`, { outlets: { dashboardContent: ["work-area", this.selectedWorkArea.id, "statistics", typeGraph] } }]);
  }


}
export function calculatePercentage(tasks: Task[], workAreas: WorkArea[]) {


  let agvIdsMap = new Map<Number, Statistics>()

  for (let i = 0; i < tasks.length; i++) {
    let id = tasks[i].agv_id


    if (id) {
      if (!agvIdsMap.has(id)) {
        let stat = { completed: 0, total: 1, error: false }

        if (tasks[i].task_status_id === 3 /* TODO: add condition about PENDING status*/) {
          stat.error = true
        }
        if (tasks[i].task_status_id === 2)
          stat.completed++

        console.log("setting", id, stat);

        agvIdsMap.set(id, stat)
      }
      else {
        let stat = agvIdsMap.get(id)
        stat.total++

        if (tasks[i].task_status_id === 3 /* TODO: add condition about PENDING status*/) {
          stat.error = true
        }
        if (tasks[i].task_status_id === 2)
          stat.completed++

          console.log("setting", id, stat);

        agvIdsMap.set(id, stat)

      }
    }
  }

  let agv
  let wa

  console.log("WA", workAreas)

  for (let id of agvIdsMap.keys()) {
    console.log("ID", id);

    wa = workAreas.find(wa => {
      agv = wa.agvList.find(a => a.id == id)
      return agv !== undefined
    })
    let currentStat = agvIdsMap.get(id)
    wa.agvList.find(a => a.id == id).setProgress(currentStat.completed * 100 / currentStat.total)
    wa.agvList.find(a => a.id == id).setError(currentStat.error)
  }



}
interface Statistics {
  completed: number,
  total: number,
  error: boolean
}

