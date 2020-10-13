import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-problem-modal',
  templateUrl: './problem-modal.component.html',
  styleUrls: ['./problem-modal.component.css']
})
export class ProblemModalComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  confirm(){
    console.log("Confirm")
  }

}
