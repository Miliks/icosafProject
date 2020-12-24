/**
 * Component that shows the carousel with the images related to the encountered errors during the process
 * For the moment there are only mock images
 * 23/12/20
 */

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-problem-image',
  templateUrl: './problem-image.component.html',
  styleUrls: ['./problem-image.component.css']
})
export class ProblemImageComponent implements OnInit {

  slides: Slide[]

  constructor(private dialogRef: MatDialogRef<ProblemImageComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.slides = []

    if (data.images)
      this.slides = [...data.images]

  }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close()
  }
}

export interface Slide {
  image: string
}

