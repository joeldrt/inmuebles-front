import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { BreadCrumb } from './breadcrumb';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-content-header',
  templateUrl: './content-header.component.html',
  styleUrls: ['./content-header.component.css']
})
export class ContentHeaderComponent implements OnInit {
  public pageTitle: '';

  breadcrumbs$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map(event => this.buildBreadCrumb(this.activatedRoute.root)),
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {
  }

  buildBreadCrumb(route: ActivatedRoute, url: string = '',
                  breadcrumbs: Array<BreadCrumb> = []): Array<BreadCrumb> {
    // If no routeConfig is avalailable we are on the root path
    const label = route.routeConfig ? route.routeConfig.data[ 'breadcrumb' ] : 'Home';
    // If label is not a breadcrumb page "not-bc-page", we skip to the next page
    if (label === 'not-bc-page') {
      if (route.firstChild) {
        // If we are not on our current path yet,
        // there will be more children to look after, to build our breadcumb
        return this.buildBreadCrumb(route.firstChild, url, breadcrumbs);
      }
    } else {
      const path = route.routeConfig ? route.routeConfig.path : '';
      // In the routeConfig the complete path is not available,
      // so we rebuild it each time
      const nextUrl = `${url}${path}/`;
      const breadcrumb = {
        label: label,
        url: nextUrl
      };
      const newBreadcrumbs = [...breadcrumbs, breadcrumb];
      if (route.firstChild) {
        // If we are not on our current path yet,
        // there will be more children to look after, to build our breadcumb
        return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
      }
      // The last route contains the page title
      this.pageTitle = route.routeConfig ? route.routeConfig.data[ 'title' ] : 'Untitle Page';
      return newBreadcrumbs;
    }
  }

}
