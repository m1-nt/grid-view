import { ReactNode } from "react";
import '../styles/components.css';

type Props = {
  children: ReactNode;
  maxHeight?: string;
};

/**
 * ScrollableContainer: コンテンツを縦スクロール可能なラッパーにする汎用コンポーネント
 * @param param0 
 * @returns 
 */
export const ScrollableContainer = ({ children, maxHeight = "95vh" }: Props) => {
  return (
    <div
      className="scrollable-container"
      style={{ maxHeight, overflowY: "auto" }}
    >
      {children}
    </div>
  );
};