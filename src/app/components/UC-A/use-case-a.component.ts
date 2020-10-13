import { Component, OnInit } from '@angular/core';
import { UCAService } from 'src/app/services/UC-A/uca.service';

@Component({
  selector: 'app-use-case-a',
  templateUrl: './use-case-a.component.html',
  styleUrls: ['./use-case-a.component.css']
})
export class UseCaseAComponent implements OnInit {

  constructor(private UCAService : UCAService) { }

  ngOnInit(): void {
  }

  ok(){
    console.log("ok");
    
  }

  notOK(){
    console.log("notOK");
    
  }

}
