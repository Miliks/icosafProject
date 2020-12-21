import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { retry } from 'rxjs/operators';
import { Order } from 'src/app/model/order.model';

@Injectable({
  providedIn: 'root'
})
export class UCCService {




  private _subjectSelectedWorkAreaAndAgv: Subject<any[]>;
  public get subjectSelectedWorkAreaAndAgv(): Subject<any[]> {
    return this._subjectSelectedWorkAreaAndAgv;
  }
  public set subjectSelectedWorkAreaAndAgv(value: Subject<any[]>) {
    this._subjectSelectedWorkAreaAndAgv = value;
  }

  public getSubjectSelectedWorkAreaAndAgv(): Observable<any[]> {
    return this._subjectSelectedWorkAreaAndAgv.asObservable();
  }

  private _currentOrder: Order;

  public get currentOrder(): Order {

    if (this._currentOrder)
      return this._currentOrder;
    else {
      let currentOrder = JSON.parse(localStorage.getItem('currentOrder'))
      if (currentOrder)
        return currentOrder as Order
      else return null
    }
  }
  public set currentOrder(value: Order) {
    this._currentOrder = value;
  }

  constructor(private http: HttpClient) {
    this.subjectSelectedWorkAreaAndAgv = new Subject();
  }


  getTaskListAgv<Task>(order_id: Number, agv_id: Number): Observable<Task[]> {
    let url = `http://icowms.cloud.reply.eu/Details/getTaskListAgv?order_id=${order_id}&agv_id=${agv_id}`
    return this.http.get<Task[]>(url).pipe(retry(3))
  }

  getTaskListOrder<Task>(order_id: Number): Observable<Task[]> {
    let url = `http://icowms.cloud.reply.eu/Details/getTaskListOrder?order_id=${order_id}`
    return this.http.get<Task[]>(url).pipe(retry(3))

  }
  getOrdListByDateAndUC<Order>(uc: string, timestamp: string): Observable<Order[]> {
    let url = `http://icowms.cloud.reply.eu/Details/getOrdListbyDate?ts=${timestamp}&uc=${uc}`
    return this.http.get<Order[]>(url).pipe(retry(3))

  }
  setTaskStatusOk(task_id: number) {
    let url = `http://icowms.cloud.reply.eu/Details/updateStatusOK?task_id=${task_id}`
    return this.http.get<any>(url).pipe(retry(3))
  }

  setSolveAction(solve_action_text: string, operator_ass_id: number, cobot_id: number, solve_act_mast_id: number, error_id: number, severity: number): Observable<any> {
    let url = `http://icowms.cloud.reply.eu/Details/insertSolveAction?solve_action=${solve_action_text}&operator_ass_id=${operator_ass_id}&cobot_id=${cobot_id}&oper_exec_id=1&solve_act_mast_id=${solve_act_mast_id}&error_id=${error_id}&severity=${severity}`
    return this.http.get<any>(url).pipe(retry(3))
  }


  getLastActiveError(task_id: number) {
    let url = `http://icowms.cloud.reply.eu/Details/getLastActError?task_id=${task_id}`
    return this.http.get<any>(url).pipe(retry(3))

  }
  createTaskOper(order_id: number, oper_id: number, agv_id: number, mach_det_id: string, task_descr: string): Observable<any> {
    let url = `http://icowms.cloud.reply.eu/Details/createTaskOper?order_id=${order_id}&oper_id=${oper_id}&agv_id=${agv_id}&match_det_id=${mach_det_id}task_descr=${task_descr}`
    return this.http.get<any>(url).pipe(retry(3))
  }


  getTaskDetails(task_id: Number): Observable<any> {
    let url = `http://icowms.cloud.reply.eu/Details/getTaskDetails?task_id=${task_id}`
    return this.http.get<any>(url).pipe(retry(3))
  }


  getMappingErAct(error_type_id: number, solve_action_type_id: number) {
    let url = `http://icowms.cloud.reply.eu/Details/getMappingErAct?error_type_id=${error_type_id}&solve_action_type_id=${solve_action_type_id}`
    return this.http.get<any>(url).pipe(retry(3))
  }
}


