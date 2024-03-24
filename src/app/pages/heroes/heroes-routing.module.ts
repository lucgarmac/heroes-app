import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchHeroesComponent } from './search-heroes/search-heroes.component';
import { HeroeDetailComponent } from './heroe-detail/heroe-detail.component';
import { canDeactiveGuard } from '../../guards/can-deactive.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'search'
  },
  {
    path: 'search',
    title: 'HEROES.SEARCH.TITLE',
    component: SearchHeroesComponent
  },
  {
    path: 'create',
    title: 'HEROES.CREATE.TITLE',
    canDeactivate: [canDeactiveGuard],
    component: HeroeDetailComponent
  },
  {
    path: ':id',
    title: 'HEROES.DETAIL.TITLE',
    canDeactivate: [canDeactiveGuard],
    component: HeroeDetailComponent
  },
  {
    path: ':id/edit',
    title: 'HEROES.EDIT.TITLE',
    canDeactivate: [canDeactiveGuard],
    component: HeroeDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HeroesRoutingModule { }
