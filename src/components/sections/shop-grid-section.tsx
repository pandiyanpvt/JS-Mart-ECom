"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Heading } from "@/components/ui/heading";
import Image from "next/image";

type Item = {
  id: number;
  name: string;
  image: string;
};

type ShopGridSectionProps = {
  title: string;
  items: Item[];
  linkPrefix: string;
  gridCols: string;
  imageSize: string;
  showViewMore?: boolean;
  initialCount?: number;
};

export default function ShopGridSection({
  title,
  items,
  linkPrefix,
  gridCols,
  imageSize,
  showViewMore = false,
  initialCount = items.length,
}: ShopGridSectionProps) {
  const [showAll, setShowAll] = useState(false);

  const displayedItems = showAll ? items : items.slice(0, initialCount);

  return (
    <section
      aria-labelledby={`${title}-heading`}
      className="pt-8 sm:pt-24 xl:mx-auto xl:max-w-7xl xl:px-8 w-full"
    >
      {/* Heading */}
      <div className="px-4 sm:px-6 lg:px-8 xl:px-0 flex items-center justify-between">
        <Heading id={`${title}-heading`} className="tracking-tight">
          {title}
        </Heading>

        {showViewMore && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="hidden sm:block text-red-600 font-semibold text-sm hover:underline"
          >
            {showAll ? "View Less" : "View More"}
          </button>
        )}
      </div>

      {/* Grid */}
      <div
        className={`mt-6 grid ${gridCols} gap-6 place-items-center mx-auto px-4 sm:px-6 lg:px-8 xl:px-0`}
      >
        {displayedItems.map((item) => (
          <Link
            key={item.id}
            href={`${linkPrefix}${item.id}`}
            className="flex flex-col items-center"
          >
            <div
              className={`${imageSize} rounded-full overflow-hidden border border-gray-200`}
            >
              {/* <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              /> */}
               <Image
                src={item.image}
                alt={item.name}
                width={200}
                height={200}
                className="object-cover"
              />
            </div>
            <span className="mt-2 text-center text-sm font-medium">
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
