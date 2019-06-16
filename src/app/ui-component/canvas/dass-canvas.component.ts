import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

/**
 * 캔버스 옵션
 * 
 * @interface CanvasOption
 * @description 캔버스 크기 옵션 설정이다.
 */
export interface CanvasOption {
	baseWidth?: number,
	baseHeight?: number,
	scaleWidth?: number,
	scaleHeight?: number,
}

@Component({
	selector: 'dass-canvas',
	templateUrl: './dass-canvas.component.html',
	styleUrls: ['./dass-canvas.component.scss']
})
export class DassCanvasComponent implements AfterViewInit {
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

	// /**
	//  * 이미지 주소
	//  */
	// // imgAddr: string = this.img.src = 'https://img.huffingtonpost.com/asset/5c21ca84240000f1059a377d.jpeg?ops=scalefit_630_noupscale';
	// imgAddr: string = this.img.src = 'https://img.huffingtonpost.com/asset/5c21ca84240000f1059a377d.jpeg?ops=scalefit_630_noupscale';

	/*****************************************************************
	 * 					Data 영역
	 *****************************************************************/
	
	/**
	 * 스캐일 캔버스 여부
	 */
	isScaleCanvas: boolean = true;

	/**
	 * 캔버스 이미지 데이터
	 */
	canvasImgData: any;

	/**
	 * 캔버스 도우미
	 */
	cvsHelper: CanvasHelper;

	/**
	 * 캔버스 옵션 영역
	 */
	@Input() canvasOption: CanvasOption;

	/**
	 * 캔버스 data
	 */
	@Input() set data(data: any) {
		this.canvasImgData = data[1].url;

		/**
		 * TODO [원인파악필요!] image가 페이지 최초 호출 시에는 로딩이 되지 않고 이벤트 발생시 로드 되어진다.
		 * 단! 새로고침 후 진행하면 정상작동한다.
		 * 
		 * 단서
		 *  - 라이프 사이클 순서 : 생성자 -> setter -> onInit -> ngAfterViewInit
		 *  - drawimage함수의 순서를 모든 곳에 대입해봐도 동일증상
		 *  - img.onload 및 img.src의 할당 위치를 모든 곳에 대입해봐도 동일증상
		 */
		this.img.src = this.canvasImgData;
	}

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

		this.cvsHelper = new CanvasHelper(this.baseCanvas, this.scaleCanvas, this.img, this.canvasOption);
		this.cvsHelper.setCanvasOption();

		this.addListeners();

		// 1. 기본 캔버스를 그린다.
		this.drawBase();
		
		// 2. 확대영역 캔버스를 그린다.
		let scaleRange = this.cvsHelper.getScaleRangeByRect(this.baseRect.x, this.baseRect.y, this.baseRect.w, this.baseRect.h);
		this.drawScale(scaleRange.x, scaleRange.y, scaleRange.w, scaleRange.h);

		// 3. 기본 캔버스의 사각형을 그린다.
		this.drawRectangle(this.baseRect.x, this.baseRect.y, this.baseRect.w, this.baseRect.h);
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
		let scaleRect = this.cvsHelper.getScaleRangeByRect(this.baseRect.x, this.baseRect.y, this.baseRect.w, this.baseRect.h);
		this.drawScale(scaleRect.x, scaleRect.y, scaleRect.w, scaleRect.h);
		this.drawRectangle(this.baseRect.x, this.baseRect.y, this.baseRect.w, this.baseRect.h);
	}

	/**
	 * 이벤트 리스너를 등록한다.
	 */
	addListeners() {
		// 콜백으로 내가 원하는 함수로 바인딩 되지 않음... 콜백 함수 구현체에다가 내가 만든 함수를 호출
		// 1. 캔버스 마우스진입해서 마우스 오버로 좌표를 체크한다.
		this.baseCanvas.addEventListener('mousedown', (evt) => {
			this.isMouseDown = true;

			const coordinate = this.cvsHelper.getMousePos(evt);
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

			const coordinate = this.cvsHelper.getMousePos(evt);
			this.baseRect.w = coordinate.x - this.baseRect.x;
			this.baseRect.h = coordinate.y - this.baseRect.y;

			this.drawBase();

			let scaleRect = this.cvsHelper.getScaleRangeByRect(this.baseRect.x, this.baseRect.y, this.baseRect.w, this.baseRect.h);
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

/**
 * 캔버스 헬퍼 도우미이다.
 */
class CanvasHelper {
	/**
	 * 기본 캔버스
	 */
	baseCanvas: HTMLCanvasElement;

	/**
	 * 스캐일 캔버스
	 */
	scaleCanvas: HTMLCanvasElement;

	/**
	 * 이미지
	 */
	img: HTMLImageElement = new Image();

	/**
	 * 캔버스 옵션
	 */
	canvasOption: CanvasOption

	/**
	 * 생성자이다.
	 * 
	 * @param baseCanvas 기본 캔버스
	 * @param img 이미지
	 */
	constructor(baseCanvas, scaleCanvas, img, canvasOption) {
		this.baseCanvas = baseCanvas;
		this.scaleCanvas = scaleCanvas;
		this.img = img;
		this.canvasOption = canvasOption;
	}

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
			w: w / this.baseCanvas.width * this.img.width,
			h: h / this.baseCanvas.height * this.img.height,
		}
	}

	/**
	 * 캔버스 옵션을 설정한다.
	 */
	setCanvasOption() {
		if (this.canvasOption.baseWidth !== null || this.canvasOption.baseWidth !== undefined) {
			this.baseCanvas.width = this.canvasOption.baseWidth;
		}
		if (this.canvasOption.baseHeight !== null || this.canvasOption.baseHeight !== undefined) {
			this.baseCanvas.height = this.canvasOption.baseHeight;
		}

		if (this.canvasOption.scaleWidth !== null || this.canvasOption.scaleWidth !== undefined) {
			this.scaleCanvas.width = this.canvasOption.scaleWidth;
		}
		if (this.canvasOption.scaleHeight !== null || this.canvasOption.scaleHeight !== undefined) {
			this.scaleCanvas.height = this.canvasOption.scaleHeight;
		}
	}
}

