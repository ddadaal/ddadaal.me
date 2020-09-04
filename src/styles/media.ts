import { createMedia } from "@artsy/fresnel";
import breakpoints from "./breakpoints";


const AppMedia = createMedia({
  breakpoints: {
    xs: 0,
    ...breakpoints,
  },
});

export const mediaStyles =  AppMedia.createMediaStyle();

export const { MediaContextProvider, Media } = AppMedia;
