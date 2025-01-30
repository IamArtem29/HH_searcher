import { Dispatch, SetStateAction } from "react";
import { IOpenButton, ISubmitButton } from ".";

export interface ModalContainerProps {
  children: string | JSX.Element;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  title?: string;
  description?: string;
  submitButton?: ISubmitButton;
  declineButton?: string;
  onSubmitClick?: () => void;
  openButton: IOpenButton;
}
