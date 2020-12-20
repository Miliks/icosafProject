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
        text: "Statistics"
      },
      subtitles: [{
        text: "Try Zooming and Panning"
      }],
      axisY: {
        title: "Fulfillment[%]",
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
          name: "fulfillment",
          axisYType: "primary",
          showInLegend: true,
          dataPoints: [{ x: 1, y: 10 } as Point, { x: 2, y: 20 } as Point,{ x: 3, y: 45 } as Point,{ x: 4, y: 80 } as Point]
        },
      ]
    });

    chart.render();
  }

}

