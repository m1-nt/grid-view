import { ImagesProps } from "../types/image";

type Props = ImagesProps & {
  onDropImage: (imageId: string) => void; // Sidebarから追加
  onReorder: (sourceId: string, targetId: string) => void; // 並び替え
};

export const Main = ({ images, onDropImage, onReorder }: Props) => {
  /**
   * SidebarからMainへの追加ドロップ
   * @param e 
   */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('fromSidebar');
    if (id) onDropImage(id); // Sidebar → Main の追加
  };
  
  /**
   * Main内での画像並び替えドロップ
   * @param e 
   * @param targetId 
   */
  const handleDropOnImage = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('fromMain');
    if (sourceId) onReorder(sourceId, targetId); // 並び替え
  };

  return (
    <main className="common-main"
    onDragOver={(e) => e.preventDefault()} // SidebarからDrop有効にする
    onDrop={handleDrop}
    >
      {images.map((img) => (
        <div
        key={img.id}
        className="main-img-wrapper"
        draggable
        onDragStart={(e) => e.dataTransfer.setData('fromMain', img.id)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDropOnImage(e, img.id)}
      >
        <img src={img.src} alt="" className="main-img" draggable={false} />
      </div>
      ))}
    </main>
  );
};