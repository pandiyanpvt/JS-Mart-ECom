"use client";

import Image from "next/image";

export default function AdvertisementSection() {
  return (
    <section className="xl:mx-auto xl:max-w-7xl xl:px-8 px-4 sm:px-6 lg:px-8 mt-6">
      
      {/* Top Banner */}
      <div className="w-full rounded-xl overflow-hidden">
        <Image
          src="/images/ad/image1.png"
          alt="Vegetables and Fruits Offer"
          width={1400}
          height={350}
          className="w-full h-auto object-cover"
          priority
        />
      </div>

      {/* Bottom Ad Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Image
          src="/images/ad/image2.png"
          alt="Ad 1"
          width={400}
          height={200}
          className="rounded-xl w-full h-auto object-cover"
        />
        <Image
          src="/images/ad/image3.png"
          alt="Ad 2"
          width={400}
          height={200}
          className="rounded-xl w-full h-auto object-cover"
        />
        <Image
          src="/images/ad/image4.png"
          alt="Ad 3"
          width={400}
          height={200}
          className="rounded-xl w-full h-auto object-cover"
        />
        <Image
          src="/images/ad/image5.png"
          alt="Ad 4"
          width={400}
          height={200}
          className="rounded-xl w-full h-auto object-cover"
        />
      </div>

    </section>
  );
}
