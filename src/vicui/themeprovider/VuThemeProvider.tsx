import "./default.css";
import "./dark.css";
import pickClass from "../utils/pickClass";
import "normalize.css";

interface Props {
  dark?: boolean;
}

export const VuThemeProvider = pickClass<Props>("div")("theme", (props: Props) => {
  return props.dark ? "dark" : undefined;
});

VuThemeProvider.defaultProps = {
  dark: false,
};
