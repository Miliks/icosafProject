/**
 * Component used to show the composition of the work Areas
 * For the composition is hardcoded but it should be get from the backend whenever the methods will be implemented
 * 24/12/20
 */
import { Component, OnInit } from '@angular/core';
import { WorkArea } from 'src/app/model/work-area.model';
import { Agv } from 'src/app/model/agv.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { EXPANSION_PANEL_ANIMATION_TIMING } from '@angular/material/expansion';
import { ICOSAFService } from 'src/app/services/UC-C/ICOSAFService.service';
import { Order } from 'src/app/model/order.model';
import { Task } from 'src/app/model/task.model';
import { SseService } from 'src/app/services/SseService/sse-service.service';
import { environment } from 'src/environments/environment';

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
  workAreas: WorkArea[]
  allWorkAreas: WorkArea[]
  progress: number

  selectedWorkArea: WorkArea
  selectedAgv: Agv

  constructor(
    private activatedRoute: ActivatedRoute,
    private sseService: SseService,
    private router: Router,
    public icosafService: ICOSAFService) {

    this.stateJPH = 'collapsed';
    this.stateSat = 'collapsed'
    this.stateCycleTime = 'collapsed'

    this.progress = 75
    this.workAreas = []
    this.allWorkAreas = [new WorkArea(1, "AMR", [new Agv(1), new Agv(2)]), new WorkArea(2, "CSKP", [new Agv(3), new Agv(4), new Agv(5), new Agv(6)])]

  }



  ngOnInit(): void {

    this.activatedRoute.params.subscribe((params) => {

      if (params['useCase']) {
        this.useCase = params['useCase']

        let w1_2 = this.useCase === "UC-C" ? new WorkArea(1, "AMR", [new Agv(1), new Agv(2)]) : new WorkArea(2, "CSKP", [new Agv(3), new Agv(4), new Agv(5), new Agv(6)])
        
        this.workAreas.push(w1_2) // w5, w3, w4


        if (!this.selectedWorkArea && !this.selectedAgv) {
          this.selectWorkArea(this.workAreas[0])
          this.openAgvDetails(this.selectedWorkArea, this.selectedWorkArea.agvList[0]);
        }

        this.icosafService.getSubjectSelectedWorkAreaAndAgv().subscribe(workAreaAndAgvIds => {

          console.log(workAreaAndAgvIds);

          this.selectedWorkArea = this.allWorkAreas.find(workArea => workArea.name == workAreaAndAgvIds[0])//workArea.id === workAreaAndAgvIds[0] || 
          
          this.openAgvDetails(this.selectedWorkArea, this.selectedWorkArea.agvList.find(agv => agv.id === workAreaAndAgvIds[1]))
        })

        //TODO remove timestamp hardcoded
        this.icosafService.getOrdListByDateAndUC(this.useCase, "2020-07-24").subscribe((orders: Order[]) => {

          //Ottengo il primo ordine non terminato e definisco questo come ordine corrente
          if (!this.icosafService.currentOrder)
            this.icosafService.currentOrder = orders.find(order => order.order_ts_end && order.order_uc == this.useCase)

          //salvo nella sessione currentOrder
          localStorage.setItem('currentOrder', JSON.stringify(this.icosafService.currentOrder));

          this.icosafService.getTaskListOrder(this.icosafService.currentOrder.order_id).subscribe((tasks: Task[]) => {
            // Per ricavare la workarea in cui lavora il nostro agv facciamo una ricerca interna per il momento
                calculatePercentage(tasks, this.workAreas)
          })
        })

        /**
         * Subscription to the source of events
         */
        this.sseService
          .getServerSentEvent(`http://${environment.sseEventsHost}/events`)
          .subscribe(data => {

            //recompute percentage tasks
            this.icosafService.getTaskListOrder(this.icosafService.currentOrder.order_id).subscribe((tasks: Task[]) => {
              // Per ricavare la workarea in cui lavora il nostro agv facciamo una ricerca interna per il momento
             //Funziona solo se esiste almeno un task
              calculatePercentage(tasks, this.workAreas)
            })

          })


      }
    })
    // Order has changed
    this.icosafService.subjectCurrentOrder.subscribe((newOrder) => {
      this.orderHasChanged(newOrder)
    })
  }

  orderHasChanged(newOrder: Order) {

    this.icosafService.getTaskListOrder(newOrder.order_id).subscribe((tasks: Task[]) => {
      // Per ricavare la workarea in cui lavora il nostro agv facciamo una ricerca interna per il momento
      // w1.agvList[0].setProgress(completed*100/total)
      // w1.agvList[0].setError(error)
      //Funziona solo se esiste almeno un task
      let w1_2 = this.useCase === "UC-C" ? new WorkArea(1, "AMR", [new Agv(1), new Agv(2)]) : new WorkArea(2, "CSKP", [new Agv(3), new Agv(4), new Agv(5), new Agv(6)])
      this.workAreas = [w1_2]
      calculatePercentage(tasks, this.workAreas)
    })
  }

  /**
   * Custom method to manage the expansion of the panel related to the stats as the designer told us
   * @param expPanel 
   * @param state 
   */
  expandPanel(expPanel, state) {
    expPanel.toggle()
    this.rotate(state)
  }

  /**
   * Custom method to manage the view of the stats
   * @param state 
   */
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

  /**
   * Open the details of the agv by navigating with the named outlet as it follow
   * It will be opened the AGVDetailsComponent
   * @param workArea 
   * @param agv 
   */
  openAgvDetails(workArea: WorkArea, agv: Agv) {

    this.selectedAgv = agv
    this.selectedWorkArea = workArea
    //console.log(this.selectedAgv);

    this.router.navigate(["Home", `${this.useCase}`, { outlets: { dashboardContent: ["work-area", workArea.name, "agv-details", agv.id] } }]);

    //event.stopPropagation();
  }

  /**
   * Method to select the workArea and correspondingly navigate to the see the details of the workArea related to the use case.
   * Dashboard component will be loaded
   * @param workArea 
   */
  selectWorkArea(workArea: WorkArea) {
    this.selectedAgv = null
    this.selectedWorkArea = workArea
  }
  recomputeWorkAreas(params: Params) {
    if (params['useCase']) {
      this.useCase = params['useCase']

      let w1_2 = this.useCase === "UC-C" ? new WorkArea(1, "AMR", [new Agv(1), new Agv(2)]) : new WorkArea(2, "CSKP", [new Agv(3), new Agv(4), new Agv(5), new Agv(6)])
      this.workAreas = []
      this.workAreas.push(w1_2) // w5, w3, w4

      if (!this.selectedWorkArea && !this.selectedAgv) {
        this.selectWorkArea(this.workAreas[0])
        this.openAgvDetails(this.selectedWorkArea, this.selectedWorkArea.agvList[0]);
      }
    }
  }
  /**
   * Method to show the mock stats
   * @param typeGraph 
   */
  openGraph(typeGraph: string) {
    //event.stopPropagation();
    this.router.navigate(["Home", `${this.useCase}`, { outlets: { dashboardContent: ["work-area", this.selectedWorkArea.name, "statistics", typeGraph] } }]);
  }


}

/**
 * Method to compute the percentage of fulfillment of the cobots composing the workingAreas.
 * Called whenever an event occur
 * @param tasks 
 * @param workAreas 
 */
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

        //console.log("setting", id, stat);
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

        //console.log("setting", id, stat);

        agvIdsMap.set(id, stat)

      }
    }
  }

  let agv: Agv
  let wa: WorkArea
  // console.log("WA", workAreas)

  for (let id of agvIdsMap.keys()) {
    // console.log("ID", id);

    wa = workAreas.find(w => {
      agv = w.agvList.find(a => a.id == id)
      return agv !== undefined
    })

    let currentStat = agvIdsMap.get(id)
    console.log("CHECK WORKAREA ", wa)
    wa.agvList.find(a => a.id == id).setProgress(currentStat.completed * 100 / currentStat.total)

    wa.agvList.find(a => a.id == id).setError(currentStat.error)

  }


}

interface Statistics {
  completed: number,
  total: number,
  error: boolean
}



