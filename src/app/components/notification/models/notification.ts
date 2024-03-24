export enum ENotificationType {
  SUCCESS = 'success',
  ERROR = 'danger',
  ALERT = 'warning',
  INFO = 'info',
}

export interface INotification {
  messageKey: string;
  type: ENotificationType;
  closeInMillis?:number;
}
