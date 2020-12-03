import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { ProblemModalComponent } from './modal/problem-modal.component';


//For now values in the db are provided statically, later will be provided from a service

export interface Item {
  state: number; // 0 nessun problema or problema risolto // 1 problema // 2 componente non ancora considerato //3 loading
  id: string;
  hour: string;
  problemsFound: string;
  description: string;
  button: string;
}


@Component({
  selector: 'app-use-case-details',
  templateUrl: './use-case-details.component.html',
  styleUrls: ['./use-case-details.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class UseCaseDetailsComponent {
  dataSource : Item[] = [];
  columnsToDisplay = ['state', 'id', 'hour', 'problemsFound', 'button'];
  expandedElement: Item | null;
 

  constructor(public dialog: MatDialog){}


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

  solve(element: Item){
    event.stopPropagation();
    this.dialog.open(ProblemModalComponent);
  }
}
