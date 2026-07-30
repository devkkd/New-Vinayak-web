import VinayakAssurance from "./components/Vinayakassurance";
import CustomerReviews from "./components/Customerreviews";
import Hero from "./components/Hero";
import InstagramFollow from "./components/Instagramfollow";
import ShopByOccasion from "./components/Shopbyoccasion";
import VinayakCategories from "./components/Vinayakcategories";
import VinayakCollections from "./components/Vinayakcollections";
import VisitOurStore from "./components/Visitourstore";
import ImageStrip from "./components/Imagestrip";

export default function Home() {
  return (
    <>
      <Hero />
      <VinayakCollections />
      <VinayakCategories />
      <VinayakAssurance />
      <ShopByOccasion />
      <InstagramFollow />
      <CustomerReviews />
      <VisitOurStore />
      <ImageStrip />
    </>
  );
}