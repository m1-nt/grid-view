import { useState } from "react";
import { ImageItem, ImagesProps } from "../types/image";
import { FileUpload } from "./FileUpload";
import { ViewAllImage } from "./ViewAllImage";
import { ScrollableContainer } from "./ScrollableContainer";

type Props = ImagesProps & {
  onImagesSelected: (images: ImageItem[]) => void;  // 画像取り込み
  onDropFromMain: (imageId: string) => void;  // MainからD&D
  onRemoveImage: (id: string) => void;  // 画像削除
  existingImages: ImageItem[];  // 重複取り込み防止
};

export const Sidebar = ({ images, onImagesSelected, onDropFromMain, onRemoveImage, existingImages }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Main からの D&D ドロップ時
   * @param e 
   */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('fromMain'); // Mainからきたか確認
    if (id) {
      onDropFromMain(id);
    }
  };

  /**
   * ファイル取り込み時の処理
   * @param newImages 
   */
  const handleImagesSelected = (newImages: ImageItem[]) => {
    setIsLoading(true);
    setTimeout(() => {
      onImagesSelected(newImages); // 親(Common)に渡す
      setIsLoading(false);
    }, 800); // 見せるための遅延
  };

  /**
   * 画像削除
   * @param id 
   */
  const handleRemoveImage = (id: string) => {
    onRemoveImage(id);
  };

  return (
    <aside className="common-sidebar"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
        <FileUpload onImagesSelected={handleImagesSelected}
          existingImages={existingImages}
        />

        <ScrollableContainer>
          <ViewAllImage 
            images={images} 
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            onRemoveImage={handleRemoveImage}
          />
        </ScrollableContainer>
        
        {isLoading && (
          <div className="sidebar-overlay">読み込み中...</div>
        )}
    </aside>
  );
};