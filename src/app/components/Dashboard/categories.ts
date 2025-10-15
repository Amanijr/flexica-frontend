

export interface SubCategory {
    id: number;
    name: string;
  }
  
  export interface Category {
    id: number;
    name: string;
    subcategories: SubCategory[];
  }
  
  export const categories: Category[] = [
    {
      id: 1,
      name: "Electronics",
      subcategories: [
        { id: 16, name: "Smartphones" },
        { id: 17, name: "Laptops" },
        { id: 18, name: "Televisions" },
      ],
    },
    {
      id: 2,
      name: "Fashion",
      subcategories: [
        { id: 19, name: "Men Clothing" },
        { id: 20, name: "Women Clothing" },
        { id: 21, name: "Accessories" },
      ],
    },
    {
      id: 3,
      name: "Home & Kitchen",
      subcategories: [
        { id: 22, name: "Furniture" },
        { id: 23, name: "Cookware" },
        { id: 24, name: "Appliances" },
      ],
    },
    {
      id: 4,
      name: "Beauty & Personal Care",
      subcategories: [
        { id: 25, name: "Skincare" },
        { id: 26, name: "Makeup" },
        { id: 27, name: "Haircare" },
      ],
    },
    {
      id: 5,
      name: "Sports & Outdoors",
      subcategories: [
        { id: 28, name: "Fitness Equipment" },
        { id: 29, name: "Outdoor Gear" },
        { id: 30, name: "Sportswear" },
      ],
    },
    {
      id: 6,
      name: "Books & Stationery",
      subcategories: [
        { id: 31, name: "Novels" },
        { id: 32, name: "Academic" },
        { id: 33, name: "Office Stationery" },
      ],
    },
    {
      id: 7,
      name: "Toys & Games",
      subcategories: [
        { id: 34, name: "Action Figures" },
        { id: 35, name: "Board Games" },
        { id: 36, name: "Puzzles" },
      ],
    },
    {
      id: 8,
      name: "Automotive",
      subcategories: [
        { id: 37, name: "Car Electronics" },
        { id: 38, name: "Spare Parts" },
        { id: 39, name: "Car Care" },
      ],
    },
    {
      id: 9,
      name: "Health & Wellness",
      subcategories: [
        { id: 40, name: "Supplements" },
        { id: 41, name: "Medical Devices" },
        { id: 42, name: "Hygiene" },
      ],
    },
    {
      id: 10,
      name: "Groceries",
      subcategories: [
        { id: 43, name: "Beverages" },
        { id: 44, name: "Snacks" },
        { id: 45, name: "Fresh Produce" },
      ],
    },
    {
      id: 11,
      name: "Baby Products",
      subcategories: [
        { id: 46, name: "Diapers" },
        { id: 47, name: "Baby Food" },
        { id: 48, name: "Toys" },
      ],
    },
    {
      id: 12,
      name: "Pet Supplies",
      subcategories: [
        { id: 49, name: "Pet Food" },
        { id: 50, name: "Pet Toys" },
        { id: 51, name: "Pet Grooming" },
      ],
    },
    {
      id: 13,
      name: "Office Supplies",
      subcategories: [
        { id: 52, name: "Desks & Chairs" },
        { id: 53, name: "Printers" },
        { id: 54, name: "Stationery" },
      ],
    },
    {
      id: 14,
      name: "Jewelry & Watches",
      subcategories: [
        { id: 55, name: "Necklaces" },
        { id: 56, name: "Rings" },
        { id: 57, name: "Watches" },
      ],
    },
    {
      id: 15,
      name: "Footwear",
      subcategories: [
        { id: 58, name: "Sneakers" },
        { id: 59, name: "Formal Shoes" },
        { id: 60, name: "Sandals" },
      ],
    },
  ];
  