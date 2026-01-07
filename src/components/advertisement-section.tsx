import BannerSlider from "@/components/sliders/banner-slider";
import CardSlider from "@/components/sliders/card-slider";

const banners = [
  "/images/ad/image1.png",
  "/images/ad/image11.png",
  "/images/ad/image12.png",
  "/images/ad/image13.png",
];

const bottomAds = [
  "/images/ad/image2.png",
  "/images/ad/image3.png",
  "/images/ad/image4.png",
  "/images/ad/image5.png",
  "/images/ad/image6.png",
  "/images/ad/image7.png",
  "/images/ad/image8.png",
  "/images/ad/image9.png",
];

export default function AdvertisementSection() {
  return (
    <section className="xl:mx-auto xl:max-w-7xl xl:px-8 px-4 sm:px-6 lg:px-8 mt-6 mb-6 p-10">
      <BannerSlider images={banners} />
      <CardSlider images={bottomAds} />
    </section>
  );
}
