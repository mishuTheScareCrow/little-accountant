import {
  Coffee,
  ShoppingCart,
  Home,
  Car,
  Utensils,
  Briefcase,
  Film,
  GraduationCap,
  Heart,
  Activity,
  Shirt,
  Plane,
  Smartphone,
  Gift,
  DollarSign,
  type LucideIcon,
} from "lucide-react";

const categoryIcons: Record<string, LucideIcon> = {
  Food: Utensils,
  Groceries: ShoppingCart,
  Transport: Car,
  Housing: Home,
  Entertainment: Film,
  Shopping: Shirt,
  Coffee: Coffee,
  Education: GraduationCap,
  Health: Heart,
  Fitness: Activity,
  Travel: Plane,
  Technology: Smartphone,
  Gifts: Gift,
  Work: Briefcase,
  Other: DollarSign,
};

export const getCategoryIcon = (category: string): LucideIcon => {
  return categoryIcons[category] || DollarSign;
};

export const getCategories = (): string[] => {
  return Object.keys(categoryIcons);
};
