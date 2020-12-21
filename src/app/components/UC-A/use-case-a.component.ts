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
