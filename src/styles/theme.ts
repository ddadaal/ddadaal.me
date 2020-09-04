/* eslint-disable max-len */
import { ThemeType } from "grommet";

import { deepFreeze } from "grommet/utils";

export const customTheme: ThemeType = deepFreeze(
  {
    "name": "my theme",
    "rounding": 0,
    "spacing": 24,
    "defaultMode": "light",
    "global": {
      "colors": {
        "brand": "#0099e5",
        "background": {
          "dark": "#111111",
          "light": "#FFFFFF",
        },
        "background-back": {
          "dark": "#111111",
          "light": "#EEEEEE",
        },
        "background-front": {
          "dark": "#222222",
          "light": "#FFFFFF",
        },
        "background-contrast": {
          "dark": "#FFFFFF11",
          "light": "#11111111",
        },
        "text": {
          "dark": "#EEEEEE",
          "light": "#333333",
        },
        "text-strong": {
          "dark": "#FFFFFF",
          "light": "#000000",
        },
        "text-weak": {
          "dark": "#CCCCCC",
          "light": "#444444",
        },
        "text-xweak": {
          "dark": "#999999",
          "light": "#666666",
        },
        "border": {
          "dark": "#444444",
          "light": "#CCCCCC",
        },
        "control": "brand",
        "active-background": "background-contrast",
        "active-text": "text-strong",
        "selected-background": "brand",
        "selected-text": "text-strong",
        "status-critical": "#FF4040",
        "status-warning": "#FFAA15",
        "status-ok": "#00C781",
        "status-unknown": "#CCCCCC",
        "status-disabled": "#CCCCCC",
        "graph-0": "brand",
        "graph-1": "status-warning",
      },
      "elevation" :{
        "dark":{
          "none":"none",
          "xsmall":"2px 2px 2px rgba(0,0,0, 0.40)",
          "small":"4px 4px 4px rgba(0,0,0, 0.40)",
          "medium":"6px 6px 8px rgba(0,0,0, 0.40)",
          "large":"8px 8px 16px rgba(0,0,0, 0.40)",
          "xlarge":"12px 12px 24px rgba(0,0,0, 0.40)",
        },
      },
      "font": { "family": "Helvetica" },
      "active": {
        "background": "active-background",
        "color": "active-text",
      },
      "hover": {
        "background": "active-background",
        "color": "active-text",
      },
      "selected": {
        "background": "selected-background",
        "color": "selected-text",
      },
      "control": { "border": { "radius": "4px" } },
      "drop": { "border": { "radius": "4px" } },
      "focus": { "border": { "color": "brand" } },
    },
    "chart": {},
    "diagram": { "line": {} },
    "meter": {},
    "button": {
      "border": { "radius": "4px" },
      "active": { "background": { "color": "brand" } },
    },
    "checkBox": {
      "check": { "radius": "4px" },
      "toggle": { "radius": "4px" },
    },
    "radioButton": { "check": { "radius": "4px" } },
    "formField": {
      "border": {
        "color": "border",
        "error": {
          "color": {
            "dark": "white",
            "light": "status-critical",
          },
        },
        "position": "inner",
        "side": "bottom",
      },
      "content": { "pad": "small" },
      "disabled": {
        "background": {
          "color": "status-disabled",
          "opacity": "medium",
        },
      },
      "error": {
        "color": "status-critical",
        "margin": {
          "vertical": "xsmall",
          "horizontal": "small",
        },
      },
      "help": {
        "color": "dark-3",
        "margin": { "start": "small" },
      },
      "info": {
        "color": "text-xweak",
        "margin": {
          "vertical": "xsmall",
          "horizontal": "small",
        },
      },
      "label": {
        "margin": {
          "vertical": "xsmall",
          "horizontal": "small",
        },
      },
      "margin": { "bottom": "small" },
      "round": "4px",
    },
    "anchor": {
      "color": "text",
      "hover": {
        "textDecoration": "none",
        "extend": (props) => ({ color: props.theme.global.colors.brand }),
      },
      "extend": (props) => (props.active ? { color: props.theme.global.colors.brand } : undefined),
    },
    "box": {
      "extend": (props) => ({
        opacity: (
          // console.log(props.theme),
          props.theme.global.opacity[props.opacity]
        ),
      }),
    },
  }
) as any;

export default customTheme;
