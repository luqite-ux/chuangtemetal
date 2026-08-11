export type ProductRecord = {
  slug: string;
  name: string;
  eyebrow: string;
  summary: string;
  description: string;
  image: string;
  gallery: string[];
  specifications: Array<{ label: string; value: string }>;
  features: string[];
  advantages: string[];
  applications: string[];
  updatedAt?: string;
};

export const FALLBACK_PRODUCTS: ProductRecord[] = [
  {
    slug: "heat-resistant-steel-charge-tray",
    name: "Heat-Resistant Steel Charge Tray",
    eyebrow: "Custom furnace loading fixture",
    summary: "A drawing-based cast charge tray for high-temperature heat-treatment furnace loading.",
    description:
      "Cast in heat-resistant stainless or alloy steel for demanding furnace environments, each tray is developed around the customer’s drawings, load pattern, operating temperature and handling requirements.",
    image: "/images/products/charge-tray-01.png",
    gallery: [
      "/images/products/charge-tray-01.png",
      "/images/products/charge-tray-02.png",
      "/images/products/charge-tray-03.png",
      "/images/products/charge-tray-04.png",
      "/images/products/charge-tray-05.png",
    ],
    specifications: [
      { label: "Reference diameter", value: "∅1200–∅3600" },
      { label: "Operating range", value: "800–1100°C" },
      { label: "Single-piece weight", value: "300–8000 kg" },
      { label: "Manufacturing basis", value: "Made to customer drawings" },
    ],
    features: [
      "Heat-resistant alloy steel construction",
      "Designed for oxidation and deformation resistance at elevated temperatures",
      "Geometry developed around furnace, load and handling conditions",
      "Available for large-format, heavy-duty furnace applications",
    ],
    advantages: [],
    applications: ["Heat treatment", "Metallurgy", "Power", "Petrochemical", "Mining"],
  },
  {
    slug: "heat-resistant-steel-charge-rack",
    name: "Heat-Resistant Steel Charge Rack",
    eyebrow: "Engineered load support",
    summary: "A custom cast rack for positioning and supporting workpieces through high-temperature cycles.",
    description:
      "Charge racks are engineered from customer drawings to suit furnace space, workpiece arrangement, loading methods and thermal conditions. The open structure supports reliable circulation around the loaded parts.",
    image: "/images/products/charge-rack-01.png",
    gallery: [
      "/images/products/charge-rack-01.png",
      "/images/products/charge-rack-02.png",
    ],
    specifications: [
      { label: "Reference diameter", value: "∅1200–∅3600" },
      { label: "Operating range", value: "800–1100°C" },
      { label: "Manufacturing basis", value: "Made to customer drawings" },
      { label: "Configuration", value: "Adapted to furnace and load conditions" },
    ],
    features: [
      "Heat-resistant alloy steel construction",
      "Custom support geometry for the intended workpiece",
      "Open configuration for furnace circulation",
      "Designed around loading, handling and cycle requirements",
    ],
    advantages: [],
    applications: ["Heat treatment", "Metallurgy", "Power", "Petrochemical", "Mining"],
  },
];

export function getFallbackProduct(slug: string) {
  return FALLBACK_PRODUCTS.find((product) => product.slug === slug) ?? null;
}
