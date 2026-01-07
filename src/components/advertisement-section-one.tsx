import BannerSlider from "@/components/sliders/banner-slider";

const banners = [
  "/images/ad-sec-1/image1.png",
  "/images/ad-sec-1/image2.png",
  "/images/ad-sec-1/image3.png",
];

export default function AdvertisementSectionOne() {
  return (
    <section className="xl:mx-auto xl:max-w-7xl xl:px-8 px-4 sm:px-6 lg:px-8 mt-6">
      <BannerSlider images={banners} />
    </section>
  );
}

