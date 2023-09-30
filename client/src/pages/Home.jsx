import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import GalleryList from "../Data";
import { useState } from "react";
import DragAndDrop from "../Components/DragAndDrop";
import ImageSearch from "../Components/ImageSearch";

const Home = () => {
  const [images, setImages] = useState(GalleryList);
  const [filteredImages, setFilteredImages] = useState(GalleryList);

  const handleSearch = (searchTerm) => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const filtered = images.filter((image) =>
        image?.tags?.some((tag) => tag.toLowerCase().includes(term))
      );
      setFilteredImages(filtered);
    } else {
      setFilteredImages(images);
    }
  };

  return (
    <>
      <div className="my-10 text-center">
        <ImageSearch onSearch={handleSearch} />
      </div>
      <DndProvider backend={HTML5Backend}>
        <DragAndDrop setImages={setImages} filteredImages={filteredImages} />
      </DndProvider>
    </>
  );
};

export default Home;
