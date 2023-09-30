/* eslint-disable react/prop-types */

import {  useCallback } from "react";

import ImageCard from "./ImageCard";


const DragAndDrop = ({setImages, filteredImages}) => {

    

  const moveImage = useCallback((dragIndex, hoverIndex) => {
    setImages((prevCards) => {
      const clonedCards = [...prevCards];
      const removedItem = clonedCards.splice(dragIndex, 1)[0];

      clonedCards.splice(hoverIndex, 0, removedItem);
      return clonedCards;
    });
  }, [setImages]);

  return (
   
      <main>
        {filteredImages?.map((image, index) => (
          <ImageCard
            key={image.id}
            src={image.img}
            title={image.title}
            id={image.id}
            index={index}
            moveImage={moveImage}
          />
        ))}
      </main>
  
  );
};

export default DragAndDrop;
