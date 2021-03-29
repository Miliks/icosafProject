import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICOSAFService } from 'src/app/services/UC-C/ICOSAFService.service';
import * as CanvasJS from '../../external-libraries/canvasjs.min'


interface Point {
  x: number,
  y: number
}
@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit, AfterViewInit {


  useCase: string
  constructor(private icosafService:ICOSAFService, private activatedRoute: ActivatedRoute) {
  }

  ngAfterViewInit(): void {
    
    this.useCase = this.activatedRoute.parent.snapshot.params["useCase"]

    this.activatedRoute.params.subscribe((params) => {
      let pointsToDisplay = []   

      switch(params['graphType']){
        case 'MCT':
          this.icosafService.getCycleTime(this.useCase).subscribe((response) => {            
            console.log(response);            
            response.forEach(element => {
              pointsToDisplay.push({x: element.order_id, y: element.cycle_time} as Point)
            });
            this.showGraph(pointsToDisplay, "Tempo di ciclo medio", "Ordine")
            

          })
          break;
        case 'SAT':
          this.icosafService.getSAT(this.useCase).subscribe((response) => {
            //TODO to be done

            pointsToDisplay.push({ x: 20, y: 10 } as Point)            
            this.showGraph(pointsToDisplay, "Saturazione", "")

          })
          break;
        case 'JPH':
          this.icosafService.getJPH(this.useCase).subscribe((response) => {            
            response.forEach(element => {
              pointsToDisplay.push({x: element.agv_id, y: element.medium_JPH} as Point)
            });
            this.showGraph(pointsToDisplay, "JPH", "AGV ID")
          })
          break;
        default: break;

        

      }



      
  

    })
  }

  ngOnInit() {

  }
  showGraph(pointsToDisplay, title, axisXLabel){
    let chart = new CanvasJS.Chart("chartContainer", {
      zoomEnabled: false,
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Statistics"
      },
      subtitles: [{
        text: ""
      }],
      axisY: {
        title: title
      },
      axisX: {
        interval: 1,
        title: axisXLabel
      },
      legend: {
        cursor: "pointer",
        verticalAlign: "top",
        horizontalAlign: "center",
        dockInsidePlotArea: false,
      },
      toolTip: {
        shared: true
      },
      data: [
        {
          type: "column",
          name: title,
          axisYType: "primary",
          showInLegend: true,
          dataPoints: pointsToDisplay
        },
      ]
    });

    chart.render();
  }

}

