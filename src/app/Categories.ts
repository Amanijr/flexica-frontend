import electronicsIcon from '@/app/components/assets/smartwatch-removebg-preview.png'
import fashionIcon from '@/app/components/assets/fashion-removebg-preview.png'
import carsIcon from '@/app/components/assets/car-removebg-preview.png'
import sportsIcon from '@/app/components/assets/football-removebg-preview.png'
import homeUtilitiesIcon from '@/app/components/assets/house-removebg-preview.png'
import booksIcon from '@/app/components/assets/books-removebg-preview (1).png'
import furnitureIcon from '@/app/components/assets/furniture-removebg-preview.png'
import gamesIcon from '@/app/components/assets/controller-removebg-preview.png'

import { FaMobileAlt, FaLaptop, FaHeadphones, FaTshirt, FaHatCowboy, FaRing, FaCar, FaTruck, FaBolt, FaDumbbell, FaCampground, FaRunning, FaBlender, FaBroom, FaLightbulb, FaBook, FaBookOpen, FaGraduationCap, FaCouch, FaBed, FaChair, FaGamepad, FaChessBoard, FaPuzzlePiece } from 'react-icons/fa';

export const categories = [
  {
      name: 'Electronics',
      icon: electronicsIcon,
      bgColor: 'bg-pink-100',
      subcategories: [
          { name: 'Smartphones', icon: FaMobileAlt, bgColor: 'bg-pink-100' },
          { name: 'Laptops', icon: FaLaptop, bgColor: 'bg-pink-100' },
          { name: 'Headphones', icon: FaHeadphones, bgColor: 'bg-pink-100' },
      ],
  },
  {
      name: 'Fashion',
      icon: fashionIcon,
      bgColor: 'bg-blue-100',
      subcategories: [
          { name: 'Men\'s Clothing', icon: FaTshirt, bgColor: 'bg-blue-100' },
          { name: 'Women\'s Clothing', icon: FaHatCowboy, bgColor: 'bg-blue-100' },
          { name: 'Accessories', icon: FaRing, bgColor: 'bg-blue-100' },
      ],
  },
  {
      name: 'Cars',
      icon: carsIcon,
      bgColor: 'bg-pink-100',
      subcategories: [
          { name: 'Sedans', icon: FaCar, bgColor: 'bg-pink-100' },
          { name: 'SUVs', icon: FaTruck, bgColor: 'bg-pink-100' },
          { name: 'Electric Vehicles', icon: FaBolt, bgColor: 'bg-pink-100' },
      ],
  },
  {
      name: 'Sports',
      icon: sportsIcon,
      bgColor: 'bg-blue-100',
      subcategories: [
          { name: 'Fitness Equipment', icon: FaDumbbell, bgColor: 'bg-blue-100' },
          { name: 'Outdoor Gear', icon: FaCampground, bgColor: 'bg-blue-100' },
          { name: 'Sportswear', icon: FaRunning, bgColor: 'bg-blue-100' },
      ],
  },
  {
      name: 'Home Utilities',
      icon: homeUtilitiesIcon,
      bgColor: 'bg-blue-100',
      subcategories: [
          { name: 'Kitchen Appliances', icon: FaBlender, bgColor: 'bg-blue-100' },
          { name: 'Cleaning Tools', icon: FaBroom, bgColor: 'bg-blue-100' },
          { name: 'Home Decor', icon: FaLightbulb, bgColor: 'bg-blue-100' },
      ],
  },
  {
      name: 'Books',
      icon: booksIcon,
      bgColor: 'bg-pink-100',
      subcategories: [
          { name: 'Fiction', icon: FaBook, bgColor: 'bg-pink-100' },
          { name: 'Non-Fiction', icon: FaBookOpen, bgColor: 'bg-pink-100' },
          { name: 'Educational', icon: FaGraduationCap, bgColor: 'bg-pink-100' },
      ],
  },
  {
      name: 'Furniture',
      icon: furnitureIcon,
      bgColor: 'bg-blue-100',
      subcategories: [
          { name: 'Living Room', icon: FaCouch, bgColor: 'bg-blue-100' },
          { name: 'Bedroom', icon: FaBed, bgColor: 'bg-blue-100' },
          { name: 'Office', icon: FaChair, bgColor: 'bg-blue-100' },
      ],
  },
  {
      name: 'Games',
      icon: gamesIcon,
      bgColor: 'bg-pink-100',
      subcategories: [
          { name: 'Video Games', icon: FaGamepad, bgColor: 'bg-pink-100' },
          { name: 'Board Games', icon: FaChessBoard, bgColor: 'bg-pink-100' },
          { name: 'Puzzles', icon: FaPuzzlePiece, bgColor: 'bg-pink-100' },
      ],
  },
];