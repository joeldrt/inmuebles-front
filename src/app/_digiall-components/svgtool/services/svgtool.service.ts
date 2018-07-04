import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SvgToolService {

  // Observable string sources
  private polygonPointsSource = new Subject<string[]>();
  private optionSelectedSource = new Subject<string>();
  // Observable string streams
  polygonPoints$ = this.polygonPointsSource.asObservable();
  optionSelected$ = this.optionSelectedSource.asObservable();

  constructor() { }

  // Service message commands
  sendOptionSelected(selection : string){
    this.optionSelectedSource.next(selection);
  }

  sendPoints(points : string[]){
    this.polygonPointsSource.next(points);
  }

}
