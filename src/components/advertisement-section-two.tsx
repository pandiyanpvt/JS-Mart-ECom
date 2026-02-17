import BannerSlider from "@/components/sliders/banner-slider";

const banners = [
  "/images/ad-sec-2/image1.png",
  "/images/ad-sec-2/image2.png",
  "/images/ad-sec-2/image3.png",
];

export default function AdvertisementSectionTwo() {
  return (
    <section className="w-full">
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
        <BannerSlider images={banners} />
      </div>
    </section>
  );
}


