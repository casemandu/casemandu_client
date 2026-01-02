import HeroSlider from "@/components/pages/home/hero-slider/HeroSlider";
import { getProducts } from "@/frontend/lib/productActions";
import { getHappyCustomers } from "@/frontend/lib/happyCustomerAction";
import { getAllCategories } from "@/frontend/lib/categoriesAction";
import HappyCustomers from "@/components/pages/home/happy-customers/HappyCustomers";
import CategoryBentoGrid from "@/components/pages/home/categories/CategoryBentoGrid";
import MostPopularSection from "@/components/pages/home/products/MostPopularSection";
import NewArrivalSection from "@/components/pages/home/products/NewArrivalSection";
import BestSellerSection from "@/components/pages/home/products/BestSellerSection";
import CustomizeSection from "@/components/pages/home/customize/CustomizeSection";
import OptionsShowcase from "@/components/pages/home/options/OptionsShowcase";
import { fetchOptions } from "@/frontend/lib/api";

export default async function Home() {
  const { products } = await getProducts({ pageSize: 30, pageNumber: 1 });
  const happyCustomers = await getHappyCustomers();
  const categories = await getAllCategories();
  const options = await fetchOptions();
  return (
    <>
      <HeroSlider />
      <CategoryBentoGrid categories={categories} />
      <OptionsShowcase options={options} />
      <NewArrivalSection products={products} />
      <MostPopularSection products={products} />
      <BestSellerSection products={products} />
      {/* <CustomizeSection /> */}
      <HappyCustomers customers={happyCustomers} />
    </>
  );
}
