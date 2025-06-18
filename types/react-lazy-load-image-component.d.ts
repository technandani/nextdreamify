declare module 'react-lazy-load-image-component' {
  import * as React from 'react';

  export interface LazyLoadImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    effect?: string;
    placeholderSrc?: string;
    visibleByDefault?: boolean;
    afterLoad?: () => void;
  }

  export class LazyLoadImage extends React.Component<LazyLoadImageProps> {}
}
