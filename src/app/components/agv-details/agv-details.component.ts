/**
 * Component that is shown on the right side of the screen with the two panels.
 * Here is managed all the related logic
 * 24/12/20
 */

import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ProblemImageComponent, Slide } from './error-image-modal/problem-image.component';
import { SseService } from 'src/app/services/SseService/sse-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { UCCService } from 'src/app/services/UC-C/uc-c-service.service';
import { MatRadioGroup } from '@angular/material/radio';
import { MatSort } from '@angular/material/sort';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Task } from 'src/app/model/task.model';
import { Order } from 'src/app/model/order.model';
import { environment } from 'src/environments/environment';


// Options used to show the timestamp with the following format
const options = { hour: "numeric", minute: "numeric", second: "numeric" }

// Element in the problems panel
export interface Problem {
  state: number; // 0 nessun problema or problema risolto // 1 problema // 2 componente non ancora considerato //3 loading
  components: string;
  kit: string;
  hour: string;
  problemsFound: string;
  description: string;
  button: string;
  task_id: Number;
}

// Element in the Prelievi panel
interface Prelievo {
  state: number;
  components: string
  kit: string;
  hour: string;
  delay: number;
  task_id: Number;
}


@Component({
  selector: 'app-agv-details',
  templateUrl: './agv-details.component.html',
  styleUrls: ['./agv-details.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class AgvDetailsComponent implements OnInit, AfterViewInit, OnDestroy {

  sseSub: Subscription

  @ViewChild('problemPanel', { static: false }) problemPanel: MatExpansionPanel
  @ViewChild('matSortProblems') matSortProblems: MatSort;
  @ViewChild('matSortPrelievi') matSortPrelievi: MatSort;
  @ViewChild("OperatorSelection") opSelection: MatRadioGroup
  @ViewChild("AGVActionSelected") AGVsel: MatRadioGroup

  dataSourceProblems: MatTableDataSource<Problem>
  displayedColumnsProblems = ['state', 'id', 'kit', 'problemsFound', 'button', 'hour'];
  expandedElement: Problem | null;
  isHidingProblemHandling: boolean
  AGVActionSelected: string
  OpActionSelected: string
  opChecked: boolean = false

  agvOptions = ['Ritentare', 'Rimanere fermo', 'Continuo attività']
  opOptions = [{ text: 'Richiesta intervento', val: false, dis: false }, { text: 'Richiesta intervento urgente', val: false, dis: false }]

  displayedColumnsPrelievi: string[] = ['state', 'components', 'kit', 'hour', 'delay'];
  dataSourcePrelievi: MatTableDataSource<Prelievo>
  problems: Slide[];
  taskErrorId: Number;
  queryParamsSub: Subscription;
  useCase: string;
  selectedAgv: string;

  private _paginatorPrelievi: MatPaginator;
  paramsSub: Subscription;

  public get paginatorPrelievi(): MatPaginator {
    return this._paginatorPrelievi;
  }

  @ViewChild('paginatorPrelievi')
  public set paginatorPrelievi(value: MatPaginator) {
    this._paginatorPrelievi = value;
    this.dataSourcePrelievi.paginator = this.paginatorPrelievi

  }
  private _paginatorErrors: MatPaginator;
  public get paginatorErrors(): MatPaginator {
    return this._paginatorErrors;
  }
  @ViewChild('paginatorErrors')
  public set paginatorErrors(value: MatPaginator) {
    this._paginatorErrors = value;
    this.dataSourceProblems.paginator = this.paginatorErrors
  }


  constructor(
    public dialog: MatDialog,
    public imageDialog: MatDialog,
    private sseService: SseService,
    private UCCService: UCCService,
    private activatedRoute: ActivatedRoute) {

    this.isHidingProblemHandling = true
    this.problems = []
    this.problems.push(
      { image: "../../../assets/img/errorIcon.svg" },
      { image: "../../../assets/img/dangerIcon.svg" },
      { image: "../../../assets/img/settingIconSelected.svg" }
    )

    this.AGVActionSelection("");

    this.dataSourcePrelievi = new MatTableDataSource()
    this.dataSourceProblems = new MatTableDataSource()
  }
  ngAfterViewInit(): void {
    this.paginatorPrelievi = this.dataSourcePrelievi.paginator
    this.paginatorErrors = this.dataSourceProblems.paginator
    this.matSortProblems = this.dataSourcePrelievi.sort
    this.matSortPrelievi = this.dataSourcePrelievi.sort
  }

  ngOnInit(): void {

    //TODO chiamata per ottenere tutti i problemi e i task risolti fino a quel momento
    this.paramsSub = this.activatedRoute.params.subscribe(params => {

      if (params['workAreaId'] && params['agvId'] && this.activatedRoute.parent.snapshot.params["useCase"]) {
        this.useCase = this.activatedRoute.parent.snapshot.params["useCase"]
        this.selectedAgv = params['agvId']

        this.UCCService.subjectSelectedWorkAreaAndAgv.next([params['workAreaId'], Number(params['agvId'])])

        if (!this.UCCService.currentOrder) {

          //TODO remove timestamp hardcoded
          this.UCCService.getOrdListByDateAndUC(this.useCase, "2020-07-24").subscribe((orders: Order[]) => {
            //Ottengo il primo ordine non terminato e definisco questo come ordine corrente
            this.UCCService.currentOrder = orders.find(order => order.order_ts_end == null)
            //salvo nella sessione currentOrder
            localStorage.setItem('currentOrder', JSON.stringify(this.UCCService.currentOrder));

            this.initializeTables(params)
          })

        } else {
          this.initializeTables(params)
        }


        if (!this.sseSub) {
          console.log("Mi iscrivo");


          this.sseSub = this.sseService
            .getServerSentEvent(`http://${environment.sseEventsHost}/events`)
            .subscribe(data => {

              console.log("data received in events: ", data.data);


              let event = JSON.parse(data.data)

              // console.log(response)

              let uc: string = event.uc;

              // console.log(uc, this.useCase, response.agv_id, response.agv_id, this.selectedAgv)

              if (uc === this.useCase && event.agv_id !== null && event.agv_id === Number(this.selectedAgv)) {

                if (event.status === "OK") {

                  let det_short_id = event.det_short_id

                  let problemFound = false

                  let sourceProblem = this.dataSourceProblems.data.filter(problem => { problemFound = true; return problem.components !== `${det_short_id}` })

                  this.dataSourceProblems.data = sourceProblem

                  // controllo se c'è un pending task con lo stesso id
                  let taskAlreadyInPending = this.dataSourcePrelievi.data.find(prelievo => {
                    console.log("TASKID",prelievo.task_id);
                    
                    return prelievo.task_id == Number(`${event.task_id}`)
                  })

                  console.log("TASKALREADYPENDING",taskAlreadyInPending);
                  

                  // se lo trovo 
                  if (taskAlreadyInPending != undefined) {
                    // Se trovo il task già in prelievi allora:
                    // è un errore ed era già solved ==> ignoro
                    // il task era pending ==> passo a error solved

                    // Stato pending ==> aggiorno a error_solved
                    if (taskAlreadyInPending.state == 4) {
                      taskAlreadyInPending.state = 5
                    }
                    // Aggirono datasource
                    this.dataSourcePrelievi.data = [...this.dataSourcePrelievi.data]
                  } else {
                    // Non ho trovato task in prelievi ==> devo aggiungere
                    let sourcePrelievi = [
                      ...this.dataSourcePrelievi.data,
                      {
                        state: problemFound ? 4 : 2,
                        components: `${event.det_short_id}`,
                        kit: `${event.kit_name}`,
                        // Settato da noi da vedere se corretto
                        hour: new Date().toLocaleTimeString('it', options),
                        delay: event.delay,
                        task_id: Number(event.task_id)
                      } as Prelievo
                    ]
                    sourcePrelievi = sourcePrelievi.sort((a, b) => b.hour.localeCompare(a.hour))
                    this.dataSourcePrelievi.data = sourcePrelievi
                  }

                  this.dataSourcePrelievi.paginator = this.paginatorPrelievi
                  this.dataSourcePrelievi.sort = this.matSortPrelievi

                } else {
                  if (event.status === "NOK") {

                    this.UCCService.getLastActiveError(event.task_id).subscribe(lastActiveError => {
                      console.log("lastActiveError", lastActiveError);

                      let taskId = event.task_id
                      this.dataSourceProblems.data = [
                        {
                          state: 3,
                          components: `${event.det_short_id}`,
                          kit: `${event.kit_name}`,
                          hour: new Date().toLocaleTimeString('it', options),
                          problemsFound: `${lastActiveError[0].error_description}`,
                          button: '',
                          description: `Problem description`,
                          task_id: taskId
                        }
                      ]

                      this.dataSourceProblems.paginator = this.paginatorErrors
                      this.dataSourceProblems.sort = this.matSortProblems
                    })
                  }
                }
              }
            })
        }



        this.queryParamsSub = this.activatedRoute.queryParams.subscribe(queryParams => {
          if (queryParams['openError']) {
            //Se c'è errore allora lo dobbiamo far vedere

            this.problemPanel.open()
            console.log("datasourceproblems.data ", this.dataSourceProblems.data);

            this.expandedElement = this.dataSourceProblems.data[0];//un solo errore
            //this.dataSourceProblems.data.find(problem => problem.id == `${queryParams['openError']}`)
            this.taskErrorId = Number(queryParams['openError'])
            this.isHidingProblemHandling = false
          }
        })
      }
    })

  }

  ngOnDestroy(): void {
    this.paramsSub.unsubscribe()
    this.queryParamsSub.unsubscribe()
    this.sseSub.unsubscribe()
    this.sseSub = null
  }

  AGVActionSelection(actionSelected: string) {
    this.AGVActionSelected = actionSelected

    if (this.AGVActionSelected == null || (this.AGVActionSelected != 'Ritentare' && this.AGVActionSelected != 'Rimanere fermo' && this.AGVActionSelected != 'Continuo attività'))
      this.AGVActionSelected = this.agvOptions[0]

    if (actionSelected === this.agvOptions[1]) {
      console.log("selezionato rimanere fermo")
      if (!this.opOptions.find(o => o.val == true))
        this.opOptions[0].val = true
      for (let op of this.opOptions) {
        op.dis = false
      }
      console.log("Changed now")
    }
    else {
      console.log("selezionato altro")
      for (let op of this.opOptions) {
        op.val = false
        op.dis = true
      }
    }
  }

  OpActionSelection(opSel) {
    if (!opSel.dis) {
      for (let op of this.opOptions)
        if (opSel != op) op.val = false
      //this.opOptions.find(o=>o!=opSel).val = false
      this.opOptions.find(o => o == opSel).val = true
    }
  }

  headerOfColumn(column: string) {
    switch (column) {
      case 'state':
        return 'Stato';
      case 'id':
        return 'Componente';
      case 'hour':
        return 'Ora';
      case 'problemsFound':
        return 'Problemi Rilevati';
      default:
        break;
    }
  }

  /**
   * Method called whenever the "RISOLVI" button is called
   */
  proceed() {

    // C'è sempre e solo un errore
    let lastActiveError = this.dataSourceProblems.data[0]
    this.UCCService.getLastActiveError(Number(lastActiveError.task_id)).subscribe(lastActiveError => {
      //console.log(success[0].error_id);

      //TODO: modificare campi fissi e controllo azione selezionata con stringa

      this.UCCService.getTaskDetails(this.taskErrorId).subscribe(res => {


        //TODO: qui ottenere il mach det id e l'order id corrispondenti al task
        let order_id = res[0].order_id;
        let mach_det_id = res[0].mach_det_id

        console.log("IMPOR", order_id, mach_det_id, this.selectedAgv, lastActiveError[0].error_id);


        let solve_action_type_id: number
        if (this.AGVActionSelected == 'Richiesta intervento urgente') {
          solve_action_type_id = 5
        } else {
          if (this.AGVActionSelected == 'Richiesta intervento')
            solve_action_type_id = 2
          else solve_action_type_id = 1 // ritentare o continuo attività ha type id = 1
        }

        console.log("getMappingErAct", lastActiveError[0].error_type_id, solve_action_type_id);

        this.UCCService.getMappingErAct(lastActiveError[0].error_type_id, solve_action_type_id).subscribe(solveActMastIdResponse => {

          console.log(solveActMastIdResponse);

          let solve_act_master_id: number = solveActMastIdResponse[0].solve_act_master_id


          console.log("insertSolveAction", this.AGVActionSelected, 2, Number(this.selectedAgv), solve_act_master_id, lastActiveError[0].error_id, this.AGVActionSelected == 'Richiesta intervento urgente' ? 1 : 2);

          this.UCCService.setSolveAction(this.AGVActionSelected, 2, Number(this.selectedAgv), solve_act_master_id, lastActiveError[0].error_id, this.AGVActionSelected == 'Richiesta intervento urgente' ? 1 : 2).subscribe(response => {

            //INSERTSOLVEACTION EFFETTUATA
            console.log("INSERTSOLVEACTION EFFETTUATA");

            // Se non si da il caso che sia una richiesta ad operatore allora invia la risoluzione
            if (this.AGVActionSelected != 'Rimanere fermo') {
              this.UCCService.setTaskStatusOk(Number(this.taskErrorId)).subscribe(_ => {
                console.log("Risolvi ora", this.AGVActionSelected, response)
                this.taskErrorId = null
                this.ngOnInit()
              })
            } else {
              // rimuovere da task da risolvere da operatore sul campo da errore e spostare in pending
              let pendingProblem = this.dataSourceProblems.data[0]
              // Aggiornamento problems
              this.dataSourceProblems.data = []

              let pendingTask = {
                state: 4,
                components: pendingProblem.components,
                kit: pendingProblem.kit,
                hour: pendingProblem.hour,
                delay: null,
                task_id: pendingProblem.task_id
              } as Prelievo

              let newDataSourcePrelievi = [...this.dataSourcePrelievi.data, pendingTask]
              this.dataSourcePrelievi.data = [...newDataSourcePrelievi]


              console.log("Nuovi PRELIEVI: ", this.dataSourcePrelievi.data)
              console.log("Nuovi PROBLEMS: ", this.dataSourceProblems.data);
            }
          })
        })
      })
    })
  }

  /**
   * Method called when the user clicks on RISOLVI to open and see the possible action that can be performed in order to solve it
   * @param element 
   */
  solve(element: Problem) {
    event.stopPropagation();
    //this.dialog.open(ProblemModalComponent);
    this.isHidingProblemHandling = false
    this.expandedElement = element
  }

  /**
   * Method to open the carousel where the images related to the errors encountered are shown
   * @param imageSrc 
   */
  openImage(imageSrc: Slide) {
    console.log(imageSrc)
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = "50%"
    dialogConfig.minHeight = "50%"
    dialogConfig.panelClass = "zeroPaddingModal"


    let imageArray = []

    imageArray.push(imageSrc)

    this.problems.forEach(element => {
      if (element.image != imageSrc.image)
        imageArray.push(element)
    });

    dialogConfig.data = {
      images: imageArray
    };
    this.imageDialog.open(ProblemImageComponent, dialogConfig)
  }



  initializeTables(params) {
    this.UCCService.getTaskListAgv(this.UCCService.currentOrder.order_id, Number(params['agvId'])).subscribe(tasks => {

      console.log("getTaskListAGV", tasks);

      let sourceProblems: Problem[] = []
      let sourcePrelievi: Prelievo[] = []


      //TODO: definire come dare settare le due data source problemi e prelievi
      tasks.forEach((t: any) => {
        let task = new Task(t.task_id, t.task_descr, t.det_short_id, t.order_id, t.start_time,
          t.stop_time, t.task_status_id, t.task_comment, t.agv_id, t.oper_id, t.error_time, t.component_id,
          t.task_type_id, t.task_ref, t.create_time)


        switch (task.task_status_id) {

          //created
          case 1:
            //  sourcePrelievi.push({
            //   state: 1,
            //   components: `PN${task.task_id}`,
            //   kit: "45",
            // //  hour: task.startTime.toLocaleTimeString('it', options)
            // hour: new Date().toLocaleTimeString('it', options)
            // })
            break;

          //completed
          case 2:

            console.log("task", task);

            //  console.log("STAMPA", task.computeDelayInMilliseconds())
            sourcePrelievi.push({
              state: task.error_time ? 5 : 2, // se ha avuto un errore allora error_solved
              components: `${task.mach_det_id}`,
              kit: `${task.task_descr}`,
              //   hour: task.stop_time.toLocaleTimeString('it', options)
              hour: task.start_time_date.toLocaleTimeString('it', options),
              delay: task.computeDelayInMilliseconds() / 1000,
              task_id: Number(task.task_id)
            })

            break;

          //failed
          case 3:

            // c'è un errore ricavo tipologia problema
            this.UCCService.getLastActiveError(Number(task.task_id)).subscribe(lastActiveError => {
              this.taskErrorId = task.task_id
              sourceProblems.push({
                state: 3,
                components: `${task.mach_det_id}`,
                kit: `${task.task_descr}`,
                //hour: task.error_time.toLocaleTimeString('it', options),
                hour: new Date().toLocaleTimeString('it', options),
                problemsFound: `${lastActiveError[0].error_description}`,
                button: '',
                description: `Problem description`,
                task_id: this.taskErrorId
              })
              this.dataSourceProblems.data = [...sourceProblems]
              this.dataSourceProblems.paginator = this.paginatorErrors
            })
            console.log("task", task);

            //  console.log("STAMPA", task.computeDelayInMilliseconds())

            break;

          // pending
          case 4:
            console.log("task", task);

            //  console.log("STAMPA", task.computeDelayInMilliseconds())
            sourcePrelievi.push({
              state: 4,
              components: `${task.mach_det_id}`,
              kit: `${task.task_descr}`,
              //   hour: task.stop_time.toLocaleTimeString('it', options)
              hour: task.start_time_date.toLocaleTimeString('it', options),
              delay: null,// TODO VERIFICARE SE CORRETTO,
              task_id: Number(task.task_id)
            })
            break;

          // error_solved
          case 5:
            console.log("task", task);

            //  console.log("STAMPA", task.computeDelayInMilliseconds())
            sourcePrelievi.push({
              state: 5,
              components: `${task.mach_det_id}`,
              kit: `${task.task_descr}`,
              //   hour: task.stop_time.toLocaleTimeString('it', options)
              hour: task.start_time_date.toLocaleTimeString('it', options),
              delay: task.computeDelayInMilliseconds(),
              task_id: Number(task.task_id)
            })
            break;
        }

        sourcePrelievi = sourcePrelievi.sort((a, b) => b.hour.localeCompare(a.hour))
        this.dataSourcePrelievi.data = sourcePrelievi

        this.dataSourceProblems.data = [...sourceProblems]

        this.dataSourcePrelievi.paginator = this.paginatorPrelievi
        this.dataSourcePrelievi.sort = this.matSortPrelievi
        this.dataSourceProblems.paginator = this.paginatorErrors
        this.dataSourceProblems.sort = this.matSortProblems

        console.log("PRELIEVI: ", this.dataSourcePrelievi.data)
        console.log("PROBLEMS: ", this.dataSourceProblems.data);

      })
    })
  }
}


// const PROBLEMS: Item[] = [
//   {
//     state: 2,
//     id: 'PN 45335478',
//     kit: 'Nome kit',
//     hour: '10:59',
//     problemsFound: 'Tipologia Problema',
//     button: '',
//     description: `Problem description`
//   },
// ]


