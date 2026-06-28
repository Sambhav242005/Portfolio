"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type ProjectCoverImageProps = {
  sources: string[];
  alt: string;
  className?: string;
  priority?: boolean;
  width?: number;
  height?: number;
};

const fallbackCover = "/project-assets/default-project-cover.svg";

export function ProjectCoverImage({
  sources,
  alt,
  className,
  priority = false,
  width = 1200,
  height = 760,
}: ProjectCoverImageProps) {
  const imageSources = useMemo(() => (sources.length > 0 ? sources : [fallbackCover]), [sources]);
  const [index, setIndex] = useState(0);
  const src = imageSources[index] ?? fallbackCover;

  return (
    <Image
      key={src}
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      unoptimized
      onError={() => {
        setIndex((current) => (current < imageSources.length - 1 ? current + 1 : current));
      }}
    />
  );
}
