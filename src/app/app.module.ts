import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { GridListUCComponent } from './components/grid-list/grid-list-uc.component';
import { UseCaseDetailsComponent } from './components/UCDetails/use-case-details.component';
import { ProblemModalComponent } from './components/UCDetails/modal/problem-modal.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoginDialogComponent } from './components/login/login-dialog/login-dialog.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


import {MatSortModule} from '@angular/material/sort'; 

import {MatInputModule} from '@angular/material/input'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { AgvDetailsComponent } from './components/agv-details/agv-details.component';
import { ProblemImageComponent } from './components/agv-details/error-image-modal/problem-image.component';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { StatsComponent } from './components/stats/stats.component';


import {MatPaginatorModule} from '@angular/material/paginator';
import { NotificationComponent } from './components/notification/notification.component';
import { UseCaseAComponent } from './components/UC-A/use-case-a.component'; 

@NgModule({
  declarations: [
    GridListUCComponent,
    UseCaseDetailsComponent,
    ProblemModalComponent,
    AppComponent,
    ToolbarComponent,
    DashboardComponent,
    LoginDialogComponent,
    AgvDetailsComponent,
    ProblemImageComponent,
    StatsComponent,
    NotificationComponent,
    UseCaseAComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatRadioModule,
    MatTabsModule,
    MatListModule,
    MatTableModule,
    MatExpansionModule,
    MatGridListModule,
    MatSidenavModule,
    HttpClientModule,
    MatCardModule,
    MatProgressBarModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatCarouselModule.forRoot(),

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
