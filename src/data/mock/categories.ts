export interface CategoryTile {
  id: string;
  label: string;
  href: string;
  seed: string;
}

export const CATEGORY_TILES: CategoryTile[] = [
  { id: "cat-dresses", label: "Dresses", href: "/catalog?category=women&sub=dresses", seed: "tile-dresses" },
  { id: "cat-tops", label: "Tops & Shirts", href: "/catalog?category=women&sub=tops", seed: "tile-tops" },
  { id: "cat-men", label: "Men's Casual", href: "/catalog?category=men", seed: "tile-men" },
  { id: "cat-accessories", label: "Accessories", href: "/catalog?category=accessories", seed: "tile-accessories" },
];

export const NAV_CATEGORIES = [
  {
    label: "Women",
    href: "/catalog?category=women",
    children: [
      { label: "Dresses", href: "/catalog?category=women&sub=dresses" },
      { label: "Tops", href: "/catalog?category=women&sub=tops" },
      { label: "Bottoms", href: "/catalog?category=women&sub=bottoms" },
      { label: "Occasion Wear", href: "/catalog?category=women&sub=occasion" },
    ],
  },
  {
    label: "Men",
    href: "/catalog?category=men",
    children: [
      { label: "Shirts", href: "/catalog?category=men&sub=shirts" },
      { label: "T-Shirts", href: "/catalog?category=men&sub=tshirts" },
      { label: "Trousers", href: "/catalog?category=men&sub=trousers" },
    ],
  },
  {
    label: "Accessories",
    href: "/catalog?category=accessories",
    children: [
      { label: "Bags", href: "/catalog?category=accessories&sub=bags" },
      { label: "Jewellery", href: "/catalog?category=accessories&sub=jewellery" },
    ],
  },
  { label: "Sale", href: "/catalog?tag=sale", children: [] },
];
