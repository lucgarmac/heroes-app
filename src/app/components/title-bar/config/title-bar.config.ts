import { TitleBarUrl } from "../models/title-bar";

export const routesMap: TitleBarUrl[] = [
  {
    id: 'home',
    path: '/home',
    translateKey: 'HOME.TITLE'
  },
  {
    id: 'heroes-search',
    path: '/heroes/search',
    translateKey: 'HEROES.SEARCH.TITLE'
  },
  {
    id: 'heroes-create',
    path: '/heroes/create',
    translateKey: 'HEROES.CREATE.TITLE'
  },
  {
    id: 'heroes-detail',
    path: '/heroes/:id',
    translateKey: 'HEROES.DETAIL.TITLE',
    params: ['id']
  },
  {
    id: 'heroes-edit',
    path: '/heroes/:id/edit',
    translateKey: 'HEROES.EDIT.TITLE',
    params: ['id']
  },
  {
    id: 'about',
    path: '/about',
    translateKey: 'ABOUT.TITLE'
  }
];

export const routesWithReturn = [
  {route:'heroes-create', return: 'heroes-search'},
  {route:'heroes-detail', return: 'heroes-search'},
  {route:'heroes-edit', return: 'heroes-search'},
];
