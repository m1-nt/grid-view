import { useState } from "react";
import { ImageItem } from "../types/image";
import { Sidebar } from "./Sidebar";
import { Main } from "./Main";
import '../styles/pages.css';

export const Common = () => {
  const [sidebarImages, setSidebarImages] = useState<ImageItem[]>([]);
  const [mainImages, setMainImages] = useState<ImageItem[]>([]);
  const existingImages = [...sidebarImages, ...mainImages]; // add

  /**
   * 画像取り込み時：既存画像に追加（追記）する
   * @param images 
   */
  const handleImagesSelected = (images: ImageItem[]) => {
    // Sidebarに追加
    setSidebarImages((prev) => [...prev, ...images]);
  };

  /**
   * 画像削除
   * @param id 
   */
  const handleRemoveImageFromSidebar = (id: string) => {
    setSidebarImages((prev) => prev.filter((img) => img.id !== id));
  };

  /**
   * Main → Sidebarへ移動
   * @param imageId 
   * @returns 
   */
  const handleDropToSidebar = (imageId: string) => {
    const image = mainImages.find((img) => img.id === imageId);
    if (!image) return;
  
    setMainImages((prev) => prev.filter((img) => img.id !== imageId));
    setSidebarImages((prev) => [...prev, image]);
  };

  /**
   * Sidebar → Mainへ移動
   * @param imageId 
   * @returns 
   */
  const handleDropToMain = (imageId: string) => {
    console.log('handleDropToMain');
    const image = sidebarImages.find((img) => img.id === imageId);
    if (!image) return;

    setSidebarImages((prev) => prev.filter((img) => img.id !== imageId));
    setMainImages((prev) => [image, ...prev]);
  };

  /**
   * Main内での並び替え
   * @param sourceId 
   * @param targetId 
   * @returns 
   */
  const handleReorder = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;

    setMainImages((prev) => {
      const items = [...prev];
      const sourceIndex = items.findIndex((img) => img.id === sourceId);
      const targetIndex = items.findIndex((img) => img.id === targetId);
      if (sourceIndex === -1 || targetIndex === -1) return items;

      const [moved] = items.splice(sourceIndex, 1);
      items.splice(targetIndex, 0, moved);
      return items;
    });
  };

  return (
    <div className="common-wrapper">
      <Sidebar 
        images={sidebarImages} 
        onImagesSelected={handleImagesSelected}
        onDropFromMain={handleDropToSidebar}
        onRemoveImage={handleRemoveImageFromSidebar}
        existingImages={existingImages}
      />
      <Main
        images={mainImages}
        onDropImage={handleDropToMain}
        onReorder={handleReorder}
      />
    </div>
  );
};
