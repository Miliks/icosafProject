import { Component, OnInit } from '@angular/core';
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
export class StatsComponent implements OnInit {


  constructor() {




  }




  ngOnInit() {
    let chart = new CanvasJS.Chart("chartContainer", {
      zoomEnabled: true,
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "STATS"
      },
      subtitles: [{
        text: "Try Zooming and Panning"
      }],
      axisY: {
        title: "Humidity[%]",
      },
      axisY2: {
        title: "Temperature[C]", //TODO: definire unità 
      },
      legend: {
        cursor: "pointer",
        verticalAlign: "top",
        horizontalAlign: "center",
        dockInsidePlotArea: true,
      },
      toolTip: {
        shared: true
      },
      data: [
        {
          type: "line",
          name: "Humidity",
          axisYType: "primary",
          showInLegend: true,
          dataPoints: [{ x: 1, y: 2 } as Point, { x: 3, y: 5 } as Point]
        },
      ]
    });

    chart.render();
  }

}

