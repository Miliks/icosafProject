/**
 * Login
 */
import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Order } from 'src/app/model/order.model';
import { ICOSAFService } from 'src/app/services/UC-C/ICOSAFService.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit {

  loginForm: FormGroup
  public dialogRef: MatDialogRef<LoginDialogComponent>
  hide = true;
  useCase: string;

  constructor(private authService: AuthService, private router: Router,    private icosafService: ICOSAFService,   private activatedRoute: ActivatedRoute) {
    this.loginForm = new FormGroup({
      text: new FormControl(''),
      password: new FormControl(''),
    });
  }
  

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {

      if (params['useCase']) {
        this.useCase = params['useCase']
        /*this.router.navigate(['use-case-details'], { queryParams: { UC:  this.useCase } })*/
       
        
      }
     
  })
  }


  onNoClick(): void {
    this.dialogRef.close();
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


  submit() {
    if (this.loginForm.valid) {
      /*this.save();*/
      this.activatedRoute.queryParams.subscribe()
     
     
    }
    this.recomputeOrderAndNavigate(this.useCase)
  }
  @Input() error: string | null;

  save() {
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(response => {

      console.log(response);

    }, error => {
      this.error = error.error;
    })


  }

  close() {
    this.dialogRef.close();

  }


}

