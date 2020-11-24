import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GridListUCComponent } from './components/grid-list/grid-list-uc.component';
import { UseCaseDetailsComponent } from './components/UCDetails/use-case-details.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginDialogComponent } from './components/login/login-dialog/login-dialog.component';
import { AgvDetailsComponent } from './components/agv-details/agv-details.component';
import { StatsComponent } from './components/stats/stats.component';
import { UseCaseAComponent } from './components/UC-A/use-case-a.component';
import { PerimetralLoginComponent } from './components/login/perimetral-login/perimetral-login.component';



const routes: Routes = [
  {
    path: '',
    redirectTo: 'Login',
    pathMatch: 'full'
  },

  {
    path: 'Login',
    component: PerimetralLoginComponent,  
  },

  {
    path: 'Home',
    // canActivate: [AuthGuard],
    component: GridListUCComponent,  
  },
  {
    path:'UseCaseA',
    component: UseCaseAComponent
  },
  {
    path: 'use-case-details',
    component: UseCaseDetailsComponent,
  },
  {
    path: 'Home/:useCase',
    component: DashboardComponent,
    children: [
      {
        path: 'work-area/:workAreaId/agv-details/:agvId',
        component: AgvDetailsComponent,
        outlet: "dashboardContent"
      },
      {
        path: 'work-area/:workAreaId/statistics/:graphType',
        component: StatsComponent,
        outlet: "dashboardContent",
      }
    ]
  },



  // {
  //   path: 'logged',
  //   children: [
  //     // {
  //     //   path: 'applicationi-internet/students',
  //     //   component: StudentsContComponent
  //     // },
  //     // {
  //     //   path: 'applicationi-internet/vms',
  //     //   component: VmsContComponentComponent
  //     // }
  //   ]
  // },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
