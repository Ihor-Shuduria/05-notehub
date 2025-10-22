import css from "./ErrorMessage.module.css";

interface Props {
  message?: string;
}

export default function ErrorMessage({ message = "Error" }: Props) {
  return <div className={css.error}>{message}</div>;
}
