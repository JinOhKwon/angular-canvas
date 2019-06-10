import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'dass-canvas',
  templateUrl: './dass-canvas.component.html',
  styleUrls: ['./dass-canvas.component.scss']
})
export class DassCanvasComponent implements AfterViewInit, OnInit {
  /**
   * 뷰 요소 캔버스 객체
   * 
   * @description DOM 요소에 있는 타입과 캔버스 객체를 컨버팅하는 과정이다.
   */
  @ViewChild('baseCanvasEl') baseCanvasEl: ElementRef;

  /**
   * 뷰 요소 스캐일 캔버스
   * 
   * @description DOM 요소에 있는 타입과 캔버스 객체를 컨버팅하는 과정이다.
   */
  @ViewChild('scaleCanvasEl') scaleCanvasEl: ElementRef;

  /**
   * 캔버스 객체
   */
  baseCanvas: HTMLCanvasElement;

  /**
   * 스캐일 캔버스 객체
   */
  scaleCanvas: HTMLCanvasElement;

  /**
   * 캔버스 2D 객체
   */
  baseCtx: CanvasRenderingContext2D;

  /**
   * 스캐일 캔버스 2D객체
   */
  scaleCtx: CanvasRenderingContext2D;

  /**
   * 기본 사각형값
   * 
   * @property x 가로
   * @property y 세로
   * @property w 이동한 가로
   * @property h 이동한 세로
   */
  baseRect: {
    x: number,
    y: number,
    w: number,
    h: number
  } = {
    x: 75,
    y: 256,
    w: 265,
    h: 99
  }
 
  /**
   * 각도 값
   */
  radian: number = 0;

  /**
   * 다운 여부
   */
  isMouseDown: boolean = false;

  /**
   * 이미지
   */
  img: HTMLImageElement = new Image();

  /**
   * 이미지 주소
   */
  // imgAddr: string = this.img.src = 'http://www.mhc.kr/files/attach/images/779/229/882/006/a9428b7f2adb9b5b243255d9c5c491dd.jpg';
  imgAddr: string = this.img.src = 'http://d3qpgbf7vej5yf.cloudfront.net/wp-content/uploads/2016/04/INUPATHY-01212.jpg';

  /**
   * 생성자이다.
   */
  constructor() { }

  /**
   * 화면 로딩후에 초기화를 한다.
   * 
   * @description canvas 객체는 화면이 렌더링 된후에 객체 값을 가져올 수 있다.
   * 맴버변수 선언과 동시에는 가져올수 없어 Angular LifeCycle 중에 ngAfterViewInit()를 사용
   */
  ngAfterViewInit() {
    this.baseCanvas = (this.baseCanvasEl.nativeElement as HTMLCanvasElement);
    this.scaleCanvas = (this.scaleCanvasEl.nativeElement as HTMLCanvasElement);

    this.baseCtx = this.baseCanvas.getContext('2d');
    this.scaleCtx = this.scaleCanvas.getContext('2d');

    this.addListeners();

    // 1. 기본 캔버스를 그린다.
    this.drawBase();

    // 2. 확대영역 캔버스를 그린다.
    let scaleRange = this.getScaleRangeByRect(this.baseRect.x, this.baseRect.y, this.baseRect.w, this.baseRect.h);
    this.drawScale(scaleRange.x, scaleRange.y, scaleRange.w, scaleRange.h);

    // 3. 기본 캔버스의 사각형을 그린다.
    this.drawRectangle(this.baseRect.x, this.baseRect.y, this.baseRect.w, this.baseRect.h);
  }

  /**
   * 화면 부르기전 초기화 함수다.
   */
  ngOnInit() {
    
  }

  /**
   * 기본적인 그림을 그린다.
   */
  drawBase() {
    this.baseCtx.clearRect(0, 0, this.baseCanvas.width, this.baseCanvas.height);
    // 현재 값을 저장한다.
    this.baseCtx.save();

    // 좌표값을 새로 설정한다. (캔버스를 원점에서 다른점으로 이동 한다.)
    this.baseCtx.translate(this.baseCanvas.width / 2, this.baseCanvas.height / 2);

    // 돌릴 기준 값을 구한다.
    this.baseCtx.rotate(this.radian * Math.PI / 180);

    // translate에서 좌표를 구한값으로 이미지를 그리기 때문에 이동한 값 만큼 -를 해줘서 0, 0 으로 맞춰준다.
    this.baseCtx.drawImage(this.img, -this.baseCanvas.width / 2, -this.baseCanvas.height / 2, this.baseCanvas.height, this.baseCanvas.width);

    // 이전 값으로 변경한다.
    this.baseCtx.restore();
  }

  /**
   * 스케일을 그린다.
   * 
   * @param x 가로
   * @param y 높이
   * @param w 이동한 가로값
   * @param h 이동한 높이값
   */
  drawScale(x: number, y: number, w: number, h: number) {
    // 라디안이 180도 라면... 
    // TODO 90도 270도일때도 값 구하기
    // 좌표 계산값 다시 생각해보기...
    if (this.radian === 180) {
        x = this.img.width - x;
        y = this.img.height - y;
        w = -w;
        h = -h;
    }

    this.scaleCtx.clearRect(0, 0, this.scaleCanvas.width, this.scaleCanvas.height);
    
    // 현재 값을 저장한다.
    this.scaleCtx.save();

    // 좌표값을 새로 설정한다. (캔버스를 원점에서 다른점으로 이동 한다.)
    this.scaleCtx.translate(this.scaleCanvas.width / 2, this.scaleCanvas.height / 2);

    // 돌릴 기준 값을 구한다.
    this.scaleCtx.rotate(this.radian * Math.PI / 180);

    // translate에서 좌표를 구한값으로 이미지를 그리기 때문에 이동한 값 만큼 -를 해줘서 0, 0 으로 맞춰준다.
    this.scaleCtx.drawImage(this.img, x, y, w, h, -this.scaleCanvas.width / 2, -this.scaleCanvas.height / 2, this.scaleCanvas.height, this.scaleCanvas.width);

    // 이전 값으로 변경한다.
    this.scaleCtx.restore();
  }

  /**
   * 사각형을 그린다.
   * 
   * @param x 가로
   * @param y 높이
   * @param w 이동한 가로값
   * @param h 이동한 높이값
   */
  drawRectangle(x: number = this.baseRect.x, y: number = this.baseRect.y, w: number = this.baseRect.w, h: number = this.baseRect.y) {
    this.baseCtx.beginPath();
    this.baseCtx.rect(x, y, w, h);
    this.baseCtx.stroke();
  }

  /**
   * 회전하여 그린다.
   * 
   * @param degree 각도
   */
  drawRoate(degree: number) {
    360 === this.radian ? this.radian = degree : this.radian += degree;
    this.drawBase();
    let scaleRect = this.getScaleRangeByRect(this.baseRect.x, this.baseRect.y, this.baseRect.w, this.baseRect.h);
    this.drawScale(scaleRect.x, scaleRect.y, scaleRect.w, scaleRect.h);
    this.drawRectangle(this.baseRect.x, this.baseRect.y, this.baseRect.w, this.baseRect.h);
  }

  /***********************************************************************************************
  *                                      Helper Objects                                         *
  ***********************************************************************************************/

  /**
   * 마우스 좌표를 가져온다.
   * 
   * @param evt 이벤트
   */
  getMousePos(evt: MouseEvent) {
    return {
        x: evt.clientX - this.baseCanvas.getBoundingClientRect().left,
        y: evt.clientY - this.baseCanvas.getBoundingClientRect().top
    };
  }

  /**
   * 스케일영역을 사각형으로부터 반환한다.
   * 
   * @param x 가로
   * @param y 높이
   * @param w 이동한 가로값
   * @param h 이동한 높이값
   */
  getScaleRangeByRect(x: number, y: number, w: number, h: number) {
    return {
        x: x / this.baseCanvas.width * this.img.width,
        y: y / this.baseCanvas.height * this.img.height,
        w: y / this.baseCanvas.width * this.img.width,
        h: h / this.baseCanvas.height * this.img.height,
    }
  }

  /**
   * 이벤트 리스너를 등록한다.
   */
  addListeners() {
    // 콜백으로 내가 원하는 함수로 바인딩 되지 않음... 콜백 함수 구현체에다가 내가 만든 함수를 호출
    // 1. 캔버스 마우스진입해서 마우스 오버로 좌표를 체크한다.
    this.baseCanvas.addEventListener('mousedown', (evt) => {
        this.isMouseDown = true;

        const coordinate = this.getMousePos(evt);
        // 전체 가로 - 캔버스 왼쪽값 / 캔버스 오른쪽값 - 캔버스 왼쪽값 * 캔버스 가로
        this.baseRect.x = coordinate.x;
        this.baseRect.y = coordinate.y;
    });

    // 2. 마우스가 클릭이 시작되었을때 해당 좌표를 구하며 있다가 시작을 하였을때 좌표를 구한다.
    this.baseCanvas.addEventListener('mousemove', (evt) => {
        // 마우스 클릭상태가 아니라면...
        if (!this.isMouseDown) {
            return;
        }

        const coordinate = this.getMousePos(evt);
        this.baseRect.w = coordinate.x - this.baseRect.x;
        this.baseRect.h = coordinate.y - this.baseRect.y;

        this.drawBase();

        let scaleRect = this.getScaleRangeByRect(this.baseRect.x, this.baseRect.y, this.baseRect.w, this.baseRect.h);
        this.drawScale(scaleRect.x, scaleRect.y, scaleRect.w, scaleRect.h);

        this.drawRectangle(this.baseRect.x, this.baseRect.y, this.baseRect.w, this.baseRect.h);

        document.getElementById('x').innerHTML =
        `
            sx: ${this.baseRect.x} <br/>
            sy: ${this.baseRect.y} <br/>
            ex: ${coordinate.x} <br/>
            ey: ${coordinate.y} <br/>
            moveWidth: ${this.baseRect.w} <br/>
            moveHeight: ${this.baseRect.h} <br/>
        `;
    });

    // 3. 마우스가 움직이는 거리마다 해당 좌표를 구한다.
    this.baseCanvas.addEventListener('mouseup', (evt) => {
      this.isMouseDown = false;
    });
  };
}
