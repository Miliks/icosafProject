/**
 * Component with the grid for choosing the use case
 */
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from 'src/app/model/order.model';
import { ICOSAFService } from 'src/app/services/UC-C/ICOSAFService.service';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

const navLinks = [
  {
    label: 'DiPreTreatUCChoice',
    link: 'DiPreTreatUCChoice',
  }
];

@Component({
  selector: 'grid-list-uc',
  templateUrl: './grid-list-uc.component.html',
  styleUrls: ['./grid-list-uc.component.css'],
})
export class GridListUCComponent {
  tryBool: boolean = false


  navLinks: any[]

  constructor(private router: Router,    private icosafService: ICOSAFService) {
    this.navLinks = navLinks
  }

  buttons = [
    { text: 'UC-A', value: "A", color: 'primary', image:'../../../assets/img/UC-A.png' },
    /*{ text: 'UC-B', value: "B", color: 'accent', image:'../../../assets/img/UC-B.png' },*/
    { text: 'UC-C', value: "C", color: 'warn', image:'../../../assets/img/UC-C.png' },
   /* { text: 'UC-D', value: "D", color: 'inactive', image:'../../../assets/img/UC-D.png' }*/
  ]


  onClickButton(useCase: string) {
    let uc;
    switch (useCase) {
      
      case 'A':   
      uc = "UC-A"
      this.router.navigate(['login-dialog'], { queryParams: { UC: uc } })
     /*this.recomputeOrderAndNavigate(uc);*/
        break;
      case 'C':
        uc = 'UC-C'
       /* this.recomputeOrderAndNavigate(uc)*/
       this.router.navigate(['login-dialog'], { queryParams: { UC: uc } })
        break;
      default: 
      this.router.navigate(['login-dialog'], { queryParams: { UC: uc } })
     /* this.router.navigate(['use-case-details'], { queryParams: { UC: useCase } })*/
      break;
    }
  }

  private recomputeOrderAndNavigate(uc:string){
   
    this.icosafService.getOrdListByDateAndUC(uc, "2020-07-24").subscribe((orders: Order[]) => {

      //Ottengo il primo ordine non terminato e definisco questo come ordine corrente
      this.icosafService.currentOrder = orders.find(order => order.order_status_id==2  && order.order_uc == uc)

      //salvo nella sessione currentOrder
      localStorage.setItem('currentOrder', JSON.stringify(this.icosafService.currentOrder));

      this.router.navigate(['Home',uc])
       
    })
  }

}