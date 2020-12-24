/**
 * Component not used in this context, but added for managing the activity of the shop floor operator.
 * Nevertheless is only a mock definition because no functionality was implemented
 */
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-use-case-a',
  templateUrl: './use-case-a.component.html',
  styleUrls: ['./use-case-a.component.css']
})
export class UseCaseAComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  ok(){
    console.log("ok");
    
  }

  notOK(){
    console.log("notOK");
    
  }

}
