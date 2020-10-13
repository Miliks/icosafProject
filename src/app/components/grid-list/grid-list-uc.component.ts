import { Component } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {
    this.navLinks = navLinks
  }

  buttons = [
    { text: 'UC-A', value: "A", color: 'primary', image:'../../../assets/img/UC-A.png' },
    { text: 'UC-B', value: "B", color: 'accent', image:'../../../assets/img/UC-B.png' },
    { text: 'UC-C', value: "C", color: 'warn', image:'../../../assets/img/UC-C.png' },
    { text: 'UC-D', value: "D", color: 'inactive', image:'../../../assets/img/UC-D.png' }
  ]


  onClickButton(useCase: string) {

    switch (useCase) {

      case 'A':
        this.router.navigate(['UseCaseA'])
        break;
      case 'C':
        this.router.navigate(['Home'])
        break;
      default: 
      this.router.navigate(['use-case-details'], { queryParams: { UC: useCase } })
      break;
    }
  }


}