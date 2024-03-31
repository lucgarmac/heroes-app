import { Dialog, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { ConfirmModalComponent } from '../../../components/confirm-modal/confirm-modal.component';
import { LoadingService } from '../../../components/loading/services/loading.service';
import { IPagination, ITableColumn } from '../../../models/components/table';
import { IHeroeSearch } from '../../../models/heroe';
import { HeroeService } from '../../../services/heroe.service';

@Component({
  selector: 'app-search-heroes',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
    DialogModule,
  ],
  templateUrl: './search-heroes.component.html',
  styleUrl: './search-heroes.component.scss',
})
export class SearchHeroesComponent implements OnInit, OnDestroy{

  constructor(
    private _dialog: Dialog,
    private _heroeService: HeroeService,
    private _loadingService: LoadingService,
  ) {}


  private readonly _stopObservables$ = new Subject<void>();
  private readonly _defaultPagination = {
    pageIndex: 0,
    pageSize: 5,
    pageSizeOptions: [5,10,20,50],
    ariaLabel: 'COMPONENTS.TABLE.PAGINATION.LABEL',
  };
  private _nameSubject$ = new BehaviorSubject<string>('');

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  name: string = '';
  firstSearch: boolean = false;

  displayedColumns!: string[];
  columns!: ITableColumn[];
  dataSource!: MatTableDataSource<any>;

  pagination!: IPagination;

  heroes:IHeroeSearch[] = [];

  private _loadTableConfig() {
    this.columns = [
      {
        id: 1,
        name: 'id',
        labelKey: 'HEROES.SEARCH.TABLE.ID'
      },
      {
        id: 1,
        name: 'name',
        labelKey: 'HEROES.SEARCH.TABLE.NAME'
      },
      {
        id: 1,
        name: 'actions',
        labelKey: 'GENERAL.ACTIONS'
      }
    ];
    this.displayedColumns = this.columns.map(col => col.name);
    this.pagination = this._defaultPagination;
  }

  private _confirmDelete(heroeId: string) {
    this._loadingService.show('HEROES.DELETE.LOADING');
    this._heroeService.deleteHeroe(heroeId)
      .pipe(
        takeUntil(this._stopObservables$)
        )
      .subscribe({
        next: () => {
          this._loadingService.hide();
          this._dialog.closeAll();
          this._heroeService.findHeroes(this.name);

        }, error: _ => this._loadingService.hide()
      })

  }

  private _search() {
    this._nameSubject$.pipe(
      takeUntil(this._stopObservables$),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(name => {
        this._loadingService.show('HEROES.SEARCH.LOADING');
        return this._heroeService.findHeroes(name)
      }),
    ).subscribe({
      next: (response: IHeroeSearch[]) => {
        this._loadingService.hide();
        this._getDataTable(response);
      },
      error: () => this._loadingService.hide()
    });
  }

  private _getDataTable(response:IHeroeSearch[]) {
    this.dataSource = new MatTableDataSource(response);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.heroes = response;
  }

  onOpenDeleteHeroeModal(heroe: IHeroeSearch) {
    const dialogRef:DialogRef<any,any> = this._dialog.open<string>(ConfirmModalComponent, {
      disableClose: true,
      data: {
        title: 'HEROES.DELETE.TITLE',
        message: 'HEROES.DELETE.MESSAGE',
        messageParams: {
          name: heroe.name
        },
        confirmText: 'GENERAL.CONFIRM'
      },
    });

    dialogRef.componentInstance.closeModal
      .pipe(takeUntil(this._stopObservables$))
      .subscribe( (_:void) => {
        this._confirmDelete(heroe.id.toString());
      });
  }

  onChangeName(name: string) {
    this.firstSearch = true;
    this.name = name;
    this._nameSubject$.next(name);
  }

  ngOnInit(): void {
    this._loadTableConfig();
    this._search();
  }

  ngOnDestroy(): void {
    this._stopObservables$.next();
    this._stopObservables$.complete();
  }
}
