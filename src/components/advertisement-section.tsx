import BannerSlider from "@/components/sliders/banner-slider";
import CardSlider from "@/components/sliders/card-slider";

const banners = [
  "/images/ad/image1.png",
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
    <section className="w-full">
      <div className="w-full mx-auto px-4 md:px-6 lg:px-8">
        <BannerSlider images={banners} />
        <div className="mt-8">
          <CardSlider images={bottomAds} />
        </div>
      </div>
    </section>
  );
}
