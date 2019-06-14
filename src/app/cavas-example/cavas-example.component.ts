import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'cavas-example',
  templateUrl: './cavas-example.component.html',
  styleUrls: ['./cavas-example.component.scss']
})
export class CavasExampleComponent implements OnInit , AfterViewInit{
  /**
   * 이미지 데이터
   */
  imageData: any;

  /**
   * 캔버스 옵션
   */
  canvasOption: any;

  constructor() { }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    
    
  }

  ngOnInit() {

    this.canvasOption = {
      width : 1000,
      height: 1000
    }
    
    this.imageData = [
      {
        title : '1번 이미지',
        url : 'http://www.mhc.kr/files/attach/images/779/229/882/006/a9428b7f2adb9b5b243255d9c5c491dd.jpg'
      },
      {
        title : '2번 이미지',
        url : 'https://img.huffingtonpost.com/asset/5c21ca84240000f1059a377d.jpeg?ops=scalefit_630_noupscale'
      },
      {
        title : '3번 이미지',
        url : 'https://img.huffingtonpost.com/asset/5c21ca84240000f1059a377d.jpeg?ops=scalefit_630_noupscale'
      },
      {
        title : '4번 이미지',
        url : 'https://img.huffingtonpost.com/asset/5c21ca84240000f1059a377d.jpeg?ops=scalefit_630_noupscale'
      },
      {
        title : '5번 이미지',
        url : 'https://img.huffingtonpost.com/asset/5c21ca84240000f1059a377d.jpeg?ops=scalefit_630_noupscale'
      },
      {
        title : '6번 이미지',
        url : 'https://img.huffingtonpost.com/asset/5c21ca84240000f1059a377d.jpeg?ops=scalefit_630_noupscale'
      },
    ]
  }

}
