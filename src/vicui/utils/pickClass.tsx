import React from "react";

const VU_PREFIX = "vu-";

export function addClasses(baseClassName: string, modifier?: string, other?: string) {
  return [baseClassName, modifier, other].filter((x) => x).join(" ");
}

export interface WrapperComponentProps {
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  className?: string;
}

export default function pickClass<Props>(
  WrapperComponent: React.ComponentType<Props & WrapperComponentProps> | string,
) {
  return (
    baseClassName: string,
    getModifier: (props: Props) => string | undefined = () => undefined,
  ) => {
    const prefixedClassName = VU_PREFIX + baseClassName;

    const NewComponent: typeof WrapperComponent = (props: Props & WrapperComponentProps) => {

      return (
        <WrapperComponent
          {...props}
          className={addClasses(
            prefixedClassName,
            getModifier(props),
            props.className,
          )}
        />
      );
    };

    return NewComponent;
  };
}
