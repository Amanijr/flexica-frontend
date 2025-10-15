"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import SubCategory from "../components/reusables/SubCategory";
import Categories from "../components/reusables/Categories";
import { apiRequest } from "@/app/lib/apiGateway";
import type { ComponentType } from "react";
import {
  FaMobileAlt,
  FaLaptop,
  FaHeadphones,
  FaTshirt,
  FaHatCowboy,
  FaRing,
  FaCar,
  FaTruck,
  FaBolt,
  FaDumbbell,
  FaCampground,
  FaRunning,
  FaBlender,
  FaBroom,
  FaLightbulb,
  FaBook,
  FaBookOpen,
  FaGraduationCap,
  FaCouch,
  FaBed,
  FaChair,
  FaGamepad,
  FaChessBoard,
  FaPuzzlePiece,
  FaTag,
} from "react-icons/fa";

// Backend response wrappers and DTOs
interface ApiCustomResponse<T> {
  token: string | null;
  statusCode: number;
  message: string;
  data: T;
}

interface BackendCategoryResponse {
  id: number;
  categoryName: string;
  categoryDescription: string;
  parent: string | null;
}

// Map a category/subcategory name to an icon and bg color for UI
function getSubcategoryVisuals(name: string): {
  icon: ComponentType<{ className?: string }>;
  bgColor: string;
} {
  const key = name.toLowerCase();
  if (key.includes("phone") || key.includes("smart")) return { icon: FaMobileAlt, bgColor: "bg-pink-100" };
  if (key.includes("laptop")) return { icon: FaLaptop, bgColor: "bg-pink-100" };
  if (key.includes("headphone")) return { icon: FaHeadphones, bgColor: "bg-pink-100" };
  if (key.includes("men")) return { icon: FaTshirt, bgColor: "bg-blue-100" };
  if (key.includes("women")) return { icon: FaHatCowboy, bgColor: "bg-blue-100" };
  if (key.includes("accessor")) return { icon: FaRing, bgColor: "bg-blue-100" };
  if (key.includes("sedan")) return { icon: FaCar, bgColor: "bg-pink-100" };
  if (key.includes("suv")) return { icon: FaTruck, bgColor: "bg-pink-100" };
  if (key.includes("electric")) return { icon: FaBolt, bgColor: "bg-pink-100" };
  if (key.includes("fitness") || key.includes("gym")) return { icon: FaDumbbell, bgColor: "bg-blue-100" };
  if (key.includes("outdoor") || key.includes("camp")) return { icon: FaCampground, bgColor: "bg-blue-100" };
  if (key.includes("sport")) return { icon: FaRunning, bgColor: "bg-blue-100" };
  if (key.includes("kitchen")) return { icon: FaBlender, bgColor: "bg-blue-100" };
  if (key.includes("clean") || key.includes("broom")) return { icon: FaBroom, bgColor: "bg-blue-100" };
  if (key.includes("decor") || key.includes("light")) return { icon: FaLightbulb, bgColor: "bg-blue-100" };
  if (key.includes("fiction")) return { icon: FaBook, bgColor: "bg-pink-100" };
  if (key.includes("non") || key.includes("open")) return { icon: FaBookOpen, bgColor: "bg-pink-100" };
  if (key.includes("educat") || key.includes("study")) return { icon: FaGraduationCap, bgColor: "bg-pink-100" };
  if (key.includes("living")) return { icon: FaCouch, bgColor: "bg-blue-100" };
  if (key.includes("bed")) return { icon: FaBed, bgColor: "bg-blue-100" };
  if (key.includes("office") || key.includes("chair")) return { icon: FaChair, bgColor: "bg-blue-100" };
  if (key.includes("video")) return { icon: FaGamepad, bgColor: "bg-pink-100" };
  if (key.includes("board")) return { icon: FaChessBoard, bgColor: "bg-pink-100" };
  if (key.includes("puzzle")) return { icon: FaPuzzlePiece, bgColor: "bg-pink-100" };
  // default icon
  return { icon: FaTag, bgColor: "bg-gray-100" };
}

const CategoriesPage = () => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  // For subcategory view
  const [allCategories, setAllCategories] = useState<BackendCategoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryParam) return; // only fetch when a category is selected

    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiRequest<ApiCustomResponse<BackendCategoryResponse[]>>("/product/public/readCategory", {
          method: "GET",
        });
        setAllCategories(res.data || []);
      } catch (e: any) {
        setError(e?.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [categoryParam]);

  if (!categoryParam) {
    return (
      <>
        <Categories />
      </>
    );
  }

  // Find the selected top-level category (case-insensitive)
  const selectedCategory = useMemo(() => {
    return allCategories.find(
      (c) => c.parent == null && c.categoryName.toLowerCase() === categoryParam.toLowerCase()
    );
  }, [allCategories, categoryParam]);

  // Children are categories whose parent equals the selected category name
  const subcategories = useMemo(() => {
    const children = allCategories.filter(
      (c) => c.parent !== null && selectedCategory && c.parent.toLowerCase() === selectedCategory.categoryName.toLowerCase()
    );
    // Map to SubCategory props structure
    return children.map((c) => {
      const visuals = getSubcategoryVisuals(c.categoryName);
      return {
        name: c.categoryName,
        icon: visuals.icon,
        bgColor: visuals.bgColor,
      } as { name: string; icon: ComponentType<{ className?: string }>; bgColor: string };
    });
  }, [allCategories, selectedCategory]);

  if (loading) {
    return (
      <section className="bg-gray-50">
        <div className="container mx-auto px-4">
          <p className="py-12">Loading subcategories...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gray-50">
        <div className="container mx-auto px-4">
          <p className="py-12 text-red-500">Error: {error}</p>
        </div>
      </section>
    );
  }

  if (!selectedCategory) {
    return <div className="text-center py-12">Category not found</div>;
  }

  return (
    <section className="bg-gray-50">
      <div className="container mx-auto px-4">
        <Categories />
        <SubCategory
          title={selectedCategory.categoryName}
          subcategories={subcategories as any}
          category={selectedCategory.categoryName}
        />
      </div>
    </section>
  );
};

export default CategoriesPage;
