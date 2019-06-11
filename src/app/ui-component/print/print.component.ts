import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'print',
	templateUrl: './print.component.html',
	styleUrls: ['./print.component.scss']
})
export class PrintComponent implements OnInit {

	// openPrintTimer;

	/**
	 * 교정내역 목록
	 */
	crrDocHisList: Array<any> = [];

	/**
	 * 스캔박스번호
	 */
	scanBoxNo: string = "";

	/**
     * 수신 data 저장
     * 
     * @property beforeParam 이전 파라미터
     */
	data: {
		beforeParam: any,
	} = {
			beforeParam: {},
		};

	/**
	 * 생성자이다.
	 * 
     * @param sessionService 세션서비스
     * @param router 라우터 서비스
     * @param activatedRoute 액티브 라우트 서비스
     * @description navigationExtras 화면 이동 중에 사용되는 추가 옵션을 표현
     * @param dialog 다이얼로그
     * @param rest rest
	 */
	constructor(
		private sessionService: SessionService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private dialog: Dialog,
		private rest: RestAPI
	) { }

	/**
	 * 초기화를 한다.
	 */
	ngOnInit() {
		// 이전화면에서 가져온 파라미터를 구독한다.
		this.activatedRoute.queryParams.subscribe(
			params => {
				this.data.beforeParam = Object.assign({}, params);
			},
			error => {
				this.dialog.error(`이전화면에서 데이터를 가져오지 못했습니다. ${error.message}`);
			}
		);

		this.scanBoxNo = Object.keys(this.data.beforeParam)[0].split("?")[0];
		this.queryCrrDocHis(this.scanBoxNo);
	}

	// ** Event Binding **************************************************************************

	/**
	 * 박스에 해당하는 교정내역 목록을 조회한다.
	 * 
	 * @param scanBoxNo 스캔박스 번호
	 */
	private queryCrrDocHis(scanBoxNo) {

		this.rest.crrBox.docCrrHis(this.wShare.baseDate, this.scanBoxNo).subscribe(
			(res) => {
				// 서버에서 받아온 스캔박스의 교정내역 목록을 할당한다. 
				let recvList = res.documentCorrectionHistoryResponses || [];
				if (0 == recvList.length) {
					alert("교정내역이 존재하지 않습니다.");
					window.close();
				}

				// 할당된 교정내역목록을 22건씩 잘라서 배열에 담는다.
				while (recvList.length) {
					this.crrDocHisList.push(recvList.splice(0, 22));
				}
			},
			(error) => {
				this.dialog.error(`문서교정내역 조회 처리 중 오류가 발생했습니다. ${error.message}`);
				throw error;
			}
		)
	};

	/**
	 * 출력을 요청한 뒤, 윈도우 창을 종료한다.
	 * 
	 * @public
	 * @method docCrrHis
	 */
	docCrrHis() {
		if (window.matchMedia) {
			window.matchMedia('print').addListener((mql) => {
				if (!mql.matches) {
					window.close();
				}
			});
		}

		window.print();
	}

	/**
	 * 화면 빠질때 제거한다.
	 */
	ngOnDestroy(): void {
		// $timeout.cancel(openPrintTimer);
	}
}
