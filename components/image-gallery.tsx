"use client";

import Image from "next/image";
import { useState } from "react";

export function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(images[0]);
  return (
    <div className="gallery">
      <div className="gallery-main"><Image src={active} alt={alt} fill sizes="(max-width: 900px) 100vw, 55vw" priority /></div>
      <div className="gallery-thumbs" aria-label={`${alt} gallery`}>
        {images.map((image, index) => (
          <button key={image} type="button" onClick={() => setActive(image)} className={active === image ? "active" : ""} aria-label={`Show image ${index + 1}`}>
            <Image src={image} alt="" fill sizes="90px" />
          </button>
        ))}
      </div>
    </div>
  );
}
