import { IParams } from "../../../models/params";

export interface IConfirmModal {
  title: string;
  message: string;
  messageParams: IParams;
  cancelText: string;
  confirmText: string;
}
