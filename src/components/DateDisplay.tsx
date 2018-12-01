import * as React from "react";

interface Props {
  date: string;
}

export default function DateDisplay({ date }: Props) {
  return <>{new Date(date).toLocaleString()}</>;
}
