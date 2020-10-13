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
  dataSource = ELEMENT_DATA;
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

const ELEMENT_DATA: Item[] = [
  {
    state: 0,
    id: 'Hydrogen',
    hour: '1.0079',
    problemsFound: '',
    button:'',
    description: `Hydrogen is a chemical element with problemsFound H and atomic number 1. With a standard
        atomic hour of 1.008, hydrogen is the lightest element on the periodic table.`
  },  {
    state: 0,
    id: 'Lithium',
    hour: '6.941',
    problemsFound: 'Tipologia Errore risolto',
    button:'',
    description: `Lithium is a chemical element with problemsFound Li and atomic number 3. It is a soft,
        silvery-white alkali metal. Under standard conditions, it is the lightest metal and the
        lightest solid element.`
  }, {
    state: 0,
    id: 'Beryllium',
    hour: '9.0122',
    problemsFound: '',
    button:'',
    description: `Beryllium is a chemical element with problemsFound Be and atomic number 4. It is a
        relatively rare element in the universe, usually occurring as a product of the spallation of
        larger atomic nuclei that have collided with cosmic rays.`
  }, {
    state: 0,
    id: 'Boron',
    hour: '10.811',
    problemsFound: '',
    button:'',
    description: `Boron is a chemical element with problemsFound B and atomic number 5. Produced entirely
        by cosmic ray spallation and supernovae and not by stellar nucleosynthesis, it is a
        low-abundance element in the Solar system and in the Earth's crust.`
  },  {
    state: 0,
    id: 'Nitrogen',
    hour: '14.0067',
    problemsFound: 'Tipologia Errore risolto',
    button:'',
    description: `Nitrogen is a chemical element with problemsFound N and atomic number 7. It was first
        discovered and isolated by Scottish physician Daniel Rutherford in 1772.`
  }, {
    state: 1,
    id: 'Carbon',
    hour: '12.0107',
    problemsFound: 'Tipologia Errore',
    button:'',
    description: `Carbon is a chemical element with problemsFound C and atomic number 6. It is nonmetallic
        and tetravalent—making four electrons available to form covalent chemical bonds. It belongs
        to group 14 of the periodic table.`
  },{
    state: 1,
    id: 'Oxygen',
    hour: '15.9994',
    problemsFound: 'Tipologia Errore',
    button:'',
    description: `Oxygen is a chemical element with problemsFound O and atomic number 8. It is a member of
         the chalcogen group on the periodic table, a highly reactive nonmetal, and an oxidizing
         agent that readily forms oxides with most elements as well as with other compounds.`
  }, {
    state: 3,
    id: 'Helium',
    hour: '4.0026',
    problemsFound: '',
    button:'',
    description: `Helium is a chemical element with problemsFound He and atomic number 2. It is a
        colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas
        group in the periodic table. Its boiling point is the lowest among all the elements.`
  },{
    state: 2,
    id: 'Fluorine',
    hour: '',
    problemsFound: '',
    button:'',
    description: `Fluorine is a chemical element with problemsFound F and atomic number 9. It is the
        lightest halogen and exists as a highly toxic pale yellow diatomic gas at standard
        conditions.`
  }, {
    state: 2,
    id: 'Neon',
    hour: '',
    problemsFound: '',
    button:'',
    description: `Neon is a chemical element with problemsFound Ne and atomic number 10. It is a noble gas.
        Neon is a colorless, odorless, inert monatomic gas under standard conditions, with about
        two-thirds the density of air.`
  },
];