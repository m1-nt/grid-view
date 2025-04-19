import { useCallback, useEffect, useRef, useState } from "react";
import { ImagesProps } from "../types/image";
import '../styles/components.css';

type Props = ImagesProps & {
  onLoadStart: () => void;
  onLoadEnd: () => void;
  onRemoveImage?: (id: string) => void;
};

export const ViewAllImage = ({ images, onLoadStart, onLoadEnd, onRemoveImage }: Props) => {
  const [visibleCount, setVisibleCount] = useState(6); // 初回表示6件
  const [isFetching, setIsFetching] = useState(false); // 追加読み込み中フラグ
  const observer = useRef<IntersectionObserver | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  /**
   * スクロールによる追加読み込み
   */
  const loadMore = useCallback(() => {
    if (isFetching || visibleCount >= images.length) return;

    setIsFetching(true);
    onLoadStart(); // ローディング開始通知

    setTimeout(() => {
      console.log('表示件数追加', visibleCount);
      setVisibleCount((prev) => Math.min(prev + 3, images.length));
      onLoadEnd(); // ローディング終了通知
      setIsFetching(false);
    }, 800);
  }, [isFetching, visibleCount, images.length, onLoadStart, onLoadEnd]);

  /**
   * IntersectionObserver による監視
   */
  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect(); // 古いオブザーバーを解除
    }

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      }, 
      {
        root: null, // ビューポート全体を監視対象に
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    const trigger = triggerRef.current;
    if (trigger) {
      observer.current.observe(trigger);
    }

    return () => {
      if (observer.current && trigger) {
        observer.current.unobserve(trigger);
      }
    };
  }, [loadMore]);

  return (
    <div className="image-scroll-wapper">
      {images.slice(0, visibleCount).map((img) => (
        <div className="image-viewer" 
          key={img.id}
          draggable={true}
          onDragStart={(e) => e.dataTransfer.setData('fromSidebar', img.id)}
        >
          <button className="delete-button" onClick={() => onRemoveImage?.(img.id)}>
            ✕
          </button>
          <img
            src={img.src}
            alt={`ID ${img.id}`}
            draggable={false} />
        </div>
      ))}
      {/* ロードトリガー（透明で見えない） */}
      {visibleCount < images.length && (
        <div id="load-trigger" ref={triggerRef} style={{ height: "1px" }} />
      )}
    </div>
  );
};