export interface ITableColumn {
  id: number;
  name: string;
  labelKey: string;
}

export interface IPagination {
  pageIndex: number;
  pageSize: number;
  pageSizeOptions: number[];
  ariaLabel: string;
}
