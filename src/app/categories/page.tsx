"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import SubCategory from "../components/reusables/SubCategory";
import Categories from "../components/reusables/Categories";
import { categories } from "../Categories";

const CategoriesPage = () => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  if (!categoryParam) {
    return (
        <>
        <Categories/>
        </>
    );
  }

  const category = categories.find(
    (cat) => cat.name.toLowerCase() === categoryParam.toLowerCase()
  );

  if (!category) {
    return <div className="text-center py-12">Category not found</div>;
  }

  return (
    <section className="bg-gray-50">
      <div className="container mx-auto px-4">
        <Categories />
        <SubCategory
          title={category.name}
          subcategories={category.subcategories}
          category={category.name}
        />
      </div>
    </section>
  );
};

export default CategoriesPage;
