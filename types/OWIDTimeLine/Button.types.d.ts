import { MouseEventHandler } from "react";
export interface ButtonProps {
    type: 'primary' | 'secondary';
    text: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}
