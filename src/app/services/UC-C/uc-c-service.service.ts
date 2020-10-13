import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { retry } from 'rxjs/operators';
import { Order } from 'src/app/model/order.model';
import { Task } from 'src/app/model/task.model';

@Injectable({
  providedIn: 'root'
})
export class UCCService {


  private _subjectSelectedWorkAreaAndAgv: Subject<number[]>;
  public get subjectSelectedWorkAreaAndAgv(): Subject<number[]> {
    return this._subjectSelectedWorkAreaAndAgv;
  }
  public set subjectSelectedWorkAreaAndAgv(value: Subject<number[]>) {
    this._subjectSelectedWorkAreaAndAgv = value;
  }
 
  public getSubjectSelectedWorkAreaAndAgv(): Observable<number[]> {
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

  setSolveAction(solve_action_text: string, operator_ass_id: number, cobot_id: number, solve_act_mast_id: number, error_id: number): Observable<any> {
    let url = `http://icowms.cloud.reply.eu/Details/insertSolveAction?solve_action=${solve_action_text}&operator_ass_id=${operator_ass_id}&cobot_id=${cobot_id}&solve_act_mast_id=${solve_act_mast_id}&error_id=${error_id}`
    return this.http.get<any>(url).pipe(retry(3))
  }


  getLastActionError(task_id: number) {
    let url = `http://icowms.cloud.reply.eu/Details/getLastActError?task_id=${task_id}`
    return this.http.get<any>(url).pipe(retry(3))

  }

}
