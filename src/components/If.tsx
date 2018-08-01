import * as React from 'react';
import { ReactNode } from 'react'

interface Props {
  condition: boolean;
  else?: any;
  children: React.ReactNode;
}

export default function If(props: Props) {
  if (props.condition) {
    return props.children;
  } else {
    return props.else === 'undefined'? null : props.else;
  }
}
