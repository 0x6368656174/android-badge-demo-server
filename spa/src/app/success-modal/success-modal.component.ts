import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-success-modal',
  templateUrl: './success-modal.component.html',
  styleUrls: ['./success-modal.component.css']
})
export class SuccessModalComponent implements OnInit {
  @ViewChild('modal') private _modal: ElementRef;

  constructor(private _modalService: NgbModal) { }

  ngOnInit() {
  }

  open() {
    this._modalService.open(this._modal);
  }
}
