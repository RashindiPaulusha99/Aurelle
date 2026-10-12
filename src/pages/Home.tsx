import { Hero } from "@/components/home/Hero";
import { CategoryTiles } from "@/components/home/CategoryTiles";
import { FeatureBand } from "@/components/home/FeatureBand";
import { NewArrivalsRail } from "@/components/home/NewArrivalsRail";
import { ShopTheLook } from "@/components/home/ShopTheLook";
import { PromiseStrip } from "@/components/home/PromiseStrip";
import { CommunityGrid } from "@/components/home/CommunityGrid";
import { Newsletter } from "@/components/home/Newsletter";
import { getHeroSlides } from "@/data/content";
import { getNewArrivals, getBestSellers } from "@/data/products";

export function Home() {
  const slides = getHeroSlides();
  const newArrivals = getNewArrivals(10);
  const bestSellers = getBestSellers(4);

  return (
    <>
      <Hero slides={slides} />
      <CategoryTiles />
      <FeatureBand />
      <NewArrivalsRail products={newArrivals} />
      <ShopTheLook products={bestSellers} />
      <PromiseStrip />
      <CommunityGrid />
      <Newsletter />
    </>
  );
}
