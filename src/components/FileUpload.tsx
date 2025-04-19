import { useRef } from 'react';
import { ImageItem } from "../types/image";
import '../styles/components.css';

type Props = {
  onImagesSelected: (images: ImageItem[]) => void;
  existingImages: ImageItem[]; // 現在取り込まれている画像一覧（重複チェック用）
};

export const FileUpload = ({ onImagesSelected, existingImages }: Props) => {
  const folderInputRef = useRef<HTMLInputElement | null>(null);
  const imagesInputRef = useRef<HTMLInputElement | null>(null);

  /**
   * 「フォルダ選択」ボタン押下
   * input押下イベント発火
   */
  const handleFolderBtnClick = () => {
    folderInputRef.current?.click();
  };

  /**
   * 「画像選択」ボタン押下
   * input押下イベント発火
   */
  const handleImagesBtnClick = () => {
    imagesInputRef.current?.click();
  };

  /**
   * ファイル選択時の共通処理
   * @param e 
   * @returns 
   */
  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    if (!input.files) return;

    const files = input.files;
    
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith('image/')
    );

    // FileReader を使って画像を読み込み、データURL化
    const readers = imageFiles.map((file, index) => {
      const id = `${file.name}_${file.size}_${file.lastModified}`;
      return new Promise<ImageItem>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve({
              id,
              src: reader.result,
            });
          } else {
            reject('読み込み失敗');
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers)
      .then((loadedImages) => {
        // 重複を除外（すでに表示中の画像を除く）
        const newImages = loadedImages.filter(
          (img) => !existingImages.some((existing) => existing.id === img.id)
        );
        onImagesSelected(newImages);
      })
      .catch(console.error)
      .finally(() => {
        // 同じファイルを再選択しても onChange が発火するようにリセット
        input.value = "";
      });
  };

  return (
    <div className="fileUpBtn">
      <button className="btn folderBtn"
        onClick={handleFolderBtnClick}>
        フォルダ選択
      </button>
      <input className='folderInput' 
        onChange={handleFolderChange}
        hidden
        type="file"
        ref={folderInputRef} 
        multiple
        /* @ts-expect-error */
        directory="true"
        webkitdirectory="true"
      />
      <button className="btn imagesBtn"
        onClick={handleImagesBtnClick}>
        画像選択
      </button>
      <input className='imagesInput' 
        onChange={handleFolderChange}
        hidden 
        type="file" 
        ref={imagesInputRef} 
        multiple
        accept="image/*"
      />
    </div>
  );
};