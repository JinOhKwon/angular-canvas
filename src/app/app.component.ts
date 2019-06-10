import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'commponent-example';

  constructor(
    private titleService: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {

  }

  /**
   * 라이프 사이클로 화면 진입시 초기화한다.(Angular LifeCycle 참고)
   */
  ngOnInit() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        })
      )
      .pipe(
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data)
      )
      .subscribe((event) => {

        //브라우저 작업표시줄에 router에서 넘어온 제목을 설정한다.
        this.titleService.setTitle(event['title']);

        //컨텐츠헤어 컴포넌트에 제목을 넘겨준다.
        this.title = event['title'];
      });
  }
}
