import { RegisterOptions } from "react-hook-form";

export type RefReturn =
    | ((instance: HTMLInputElement | null) => void)
    | React.RefObject<HTMLInputElement>
    | null
    | undefined;

export type InputProps = React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
> & {
    register: (formInpErr: RegisterOptions) => RefReturn;
};
