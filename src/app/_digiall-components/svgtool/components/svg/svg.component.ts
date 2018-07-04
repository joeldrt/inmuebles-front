import {forEach} from '@angular/router/src/utils/collection';

declare var svgPanZoom: any;
import {Component, OnInit, Input, Renderer2, ElementRef, ViewChild, OnDestroy, AfterViewInit} from '@angular/core';

import {Polygon} from '../../models/polygon.model';
import {Image} from '../../models/image.model';
import {Svg} from '../../models/svg.model';
import {SvgToolService} from '../../services/svgtool.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-svg',
  templateUrl: './svg.component.html',
  styleUrls: ['./svg.component.sass']
})
export class SvgComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('svgTag') private svgTag: ElementRef;
  @Input('imageSvg') public imageSvg: Image;

  public subscriptionPolygons: Subscription;
  private objSvg: Svg;
  public objPolygon: Polygon;
  public isVisibleMenu: boolean;
  public stringPoints: string;
  public arrayPolygons: Map<number, Polygon>;
  public descriptionActions: string;
  public idSvgTag: any;
  public isSaveSvg: boolean;
  public elPolygon: any;
  public subscriptionOption: Subscription;

  public stringStatusControls : string;
  public stringStatusZoom : string;
  public stringStatusSections : string;

  public tagPolySelected: any;

  private isDrawing: boolean;
  private pX: string;
  private pY: string;
  private idSvg: number;
  private isZoom: boolean;
  private countZoom: number;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private svgToolService: SvgToolService) {

    this.isDrawing = false;
    this.pX = '';
    this.pY = '';
    this.initializePolygon();
    this.stringPoints = '';
    this.idSvg = Date.now();
    this.isVisibleMenu = true;
    this.descriptionActions = '';
    this.isZoom = false;
    this.countZoom = 100;
    this.isSaveSvg = false;

    this.tagPolySelected = null;

    this.subscriptionPolygons = svgToolService.polygonPoints$.subscribe(
      points => {
        const idPolygon = points[0].toString();
        const stringPoints = points[1].toString();
        this.createPolygon(idPolygon, stringPoints);
      }
    );
    /*this.subscriptionOption = svgToolService.optionSelected$.subscribe(
        optionSelected => {
            this.hiddenShowSection
            (optionSelected);
        }
    );*/

    //---Functions
    this.resetMsgsEstatus();


  }// end constructor

  ngOnInit() {
    this.arrayPolygons = new Map();
  }// end - ngOnInit

  ngAfterViewInit() {
    this.addSettingsZoom();
  }

  ngOnDestroy() {
    // this.subscriptionOption.unsubscribe();
    this.subscriptionPolygons.unsubscribe();
  }

  addSettingsZoom() {
    this.idSvgTag = svgPanZoom('#svgTag', {
      zoomEnabled: true,
      controlIconsEnabled: false,
      dblClickZoomEnabled: false,
      center: true
    });
  }

  doZoomIn(event){
    event.preventDefault();
    this.isZoom = true;
    this.idSvgTag.zoomIn();
    this.countZoom++;
    this.stringStatusZoom = (this.countZoom) + '%';
  }

  doZoomOut(event){
    event.preventDefault();
    this.isZoom = true;
    this.idSvgTag.zoomOut();
    this.countZoom--;
    this.stringStatusZoom = '' + (this.countZoom) + '%';
  }

  doZoomReset(event){
    event.preventDefault();
    this.isZoom = false;
    this.idSvgTag.resetZoom();
    this.countZoom = 100;
    this.stringStatusZoom = '100%';
  }

  /**/
  beginDraw() {
    if (this.isDrawing){
      return;
    }
    this.isDrawing = true;
    this.initializePolygon();
  }

  clickInSvg(event) {
    if (this.isDrawing) {
      const objG = this.svgTag.nativeElement.querySelector('g');
      const pt = this.svgTag.nativeElement.createSVGPoint();
      pt.x = event.clientX;
      pt.y = event.clientY;
      const newPoint = pt.matrixTransform(objG.getScreenCTM().inverse());
      this.pX = newPoint.x;
      this.pY = newPoint.y;
      this.addPoint(this.pX, this.pY);
    }
    else {
      return;
    }
  }

  addPoint(pX, pY) {
    let pointAdd = [pX, pY];
    this.objPolygon.pointsArray.push([pointAdd]);
    this.paintInSvg();
  }

  undoLastPoint() {
    if (this.isDrawing && this.objPolygon.pointsArray.length > 0) {
      this.objPolygon.pointsArray.pop();
      this.paintInSvg();
    }
  }

  drawElements() {
    /*
    switch(typeEl){
        case 'polygon':
            console.log("Pintando un polygono :: ");
            this.elPolygon = document.createElementNS('http://www.w3.org/2000/svg', typeEl);
            this.elPolygon.setAttribute('points', points);
            this.elPolygon.setAttribute('fill', 'rgba(0,0,255,0.6)');
            this.elPolygon.addEventListener('click', this.onClickPolygon.bind(this));
            this.renderer.appendChild(this.svgTag.nativeElement, this.elPolygon);
            break;
    }
    */
  }

  paintInSvg() {
    this.stringPoints = '';
    if (this.objPolygon.pointsArray.length != 0) {
      for (let i = 0; i < this.objPolygon.pointsArray.length; i++) {
        this.stringPoints += this.objPolygon.pointsArray[i] + ' ';
      }
      console.log('===> Impriendo stringPoints : ' + this.stringPoints);
    }
  }

  /**/
  initializePolygon() {
    this.objPolygon = new Polygon();
    this.objPolygon.pointsArray = [];
    this.objPolygon.id = 0;
    this.objPolygon.status = '';
    this.stringPoints = '';
  }

  addPolygon() {
    if (this.isDrawing) {
      if(this.objPolygon.pointsArray.length >= 3){
          let pointsString = '';
          pointsString = this.objPolygon.pointsArray.join(' ');
          if(pointsString != ''){
            let idPolygon = Date.now().toString();
            this.isDrawing = false;
            this.objPolygon.genUid = Date.now();
            this.arrayPolygons.set(this.objPolygon.genUid, this.objPolygon);
            this.createPolygon(idPolygon, pointsString);
            this.initializePolygon();
          }
      }
    }
  }

  createPolygon(idPolygon: string, stringPoints: string) {
    const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    poly.setAttribute('points', stringPoints);
    poly.setAttribute('fill', 'rgba(2,134,222,0.72)');
    poly.setAttribute('stroke', 'black');
    poly.setAttribute('stroke-width', '1px');
    poly.setAttribute('id', idPolygon);
    poly.addEventListener('click', this.onClickPolygon.bind(this));
    //this.renderer.appendChild(this.svgTag.nativeElement, poly);
    this.renderer.appendChild(this.svgTag.nativeElement.querySelector('g'), poly);
  }

  saveSvg() {
    // validate if not is draw
    if (!this.isDrawing) {
      if (this.arrayPolygons.size > 0) {
        let objSvg = this.createBodyRequestSave();
        this.isSaveSvg = true;
        console.log(objSvg);
        this.stringStatusControls = "Se ha guardado el Svg " + Date.now();
      }
    }
  }

  createBodyRequestSave(): Svg {
    let arrayPolygonsSend: Polygon[] = new Array();
    for (let poly of Array.from(this.arrayPolygons.entries())) {
      console.log(poly);
      let polyToSend = new Polygon();
      polyToSend.genUid = poly[1].genUid;
      polyToSend.status = poly[1].status;
      polyToSend.pointsArray = poly[1].pointsArray;
      polyToSend.points = poly[1].pointsArray.join(' ');
      arrayPolygonsSend.push(polyToSend);
    }

    this.objSvg = new Svg();
    this.objSvg.base64Image = this.imageSvg.srcB64;
    this.objSvg.width = this.imageSvg.widthContent;
    this.objSvg.height = this.imageSvg.heightContent;
    this.objSvg.polygons = arrayPolygonsSend;
    return this.objSvg;
  }

  onClickPolygon(event) {
    let idPolygon = event.currentTarget.id.toString();
    let listTagsPolygons = this.svgTag.nativeElement.querySelectorAll('polygon');

    if(listTagsPolygons.length > 1){
      for(let poly of listTagsPolygons){
        poly.setAttribute('fill', 'rgba(2,134,222,0.72)');
      }

      this.svgTag.nativeElement.getElementById('polygonTagDraw').setAttribute('fill', 'rgba(33,144,2,0.72)');
    }

    this.tagPolySelected = this.svgTag.nativeElement.getElementById(idPolygon);
    this.tagPolySelected.setAttribute('fill', 'rgba(222,2,24,0.72)');
    this.stringStatusSections = "ID: " + idPolygon;
  }

  hiddenShowSection(optionSelected) {
    console.log('hiddenShowSection' + optionSelected);
    switch (optionSelected) {
      case 'edit':
      case 'create':
        this.isVisibleMenu = true;
        break;
      case 'show':
        this.isVisibleMenu = false;
        break;
    }
  }

  /**/
  resetMsgsEstatus(){
    this.stringStatusControls = 'Puede iniciar el pintado, dando click en pintar';
    this.stringStatusZoom = '100%';
    this.stringStatusSections = 'Al seleccionar una de las secciones pintadas, puede agregar su información';
  }

  deletePolygon(event){
    if(this.tagPolySelected != null){
      alert("Desea eliminar el elemento : " + this.tagPolySelected.getAttribute('id'));
    }
  }

}// end - class SvgComponent
