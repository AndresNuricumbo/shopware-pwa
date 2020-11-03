import { ProductMedia } from "./ProductMedia";
import { Tax } from "../../system/tax/Tax";
import { Unit } from "../../system/unit/Unit";
import { ProductReview } from "./ProductReview";
import { ListingPrice } from "../../framework/pricing/ListingPrice";
import { Price } from "../../framework/pricing/Price";
import { CalculatedPrice } from "../../checkout/cart/price/CalculatedPrice";
import { ProductPrice } from "./ProductPrice";
import { PropertyGroup } from "../property/PropertyGroup";
import { DeliveryTime } from "../../checkout/delivery/DeliveryTime";
import { ProductManufacturer } from "./ProductManufacturer";
import { ProductTranslation } from "./ProductTranslation";
import { PropertyGroupOption } from "../property/PropertyGroupOption";
import { Category } from "../category/Category";
import { Tag } from "../../system/tag/Tag";
import { CustomField } from "../../common/CustomField";

/**
 * @alpha
 */
export interface SeoUrl {
  reatedAt: Date;
  customFields: null | any;
  extensions: any[];
  foreignKey: string;
  id: string;
  isCanonical: boolean;
  isDeleted: boolean;
  isModified: boolean;
  isValid: boolean | null;
  language: string | null;
  languageId: string;
  pathInfo: string;
  routeName: string;
  salesChannelId: string | null;
  seoPathInfo: string;
  updatedAt: Date | null;
  url: string | null;
  versionId: string | null;
}

/**
 * @alpha
 */
export interface Product {
  calculatedListingPrice: ListingPrice;
  calculatedPrices: CalculatedPrice[];
  calculatedPrice: CalculatedPrice;
  sortedProperties: PropertyGroup[] | null;
  isNew: boolean;
  parentId: string | null;
  childCount: number;
  autoIncrement: number;
  taxId: string | null;
  manufacturerId: string | null;
  unitId: string | null;
  active: boolean;
  displayGroup: string;
  price: Price[] | null;
  manufacturerNumber: string | null;
  ean: string | null;
  productNumber: string;
  stock: number;
  availableStock: number | null;
  available: boolean;
  deliveryTimeId: string | null;
  deliveryTime: DeliveryTime;
  restockTime: number;
  isCloseout: boolean | null;
  purchaseSteps: number | null;
  maxPurchase: number | null;
  minPurchase: number | null;
  purchaseUnit: number | null;
  referenceUnit: number | null;
  shippingFree: boolean | null;
  purchasePrice: number | null;
  markAsTopseller: boolean | null;
  weight: number | null;
  width: number | null;
  height: number | null;
  length: number | null;
  releaseDate: Date;
  categoryTree: [] | null;
  optionIds?: string[];
  propertyIds: [] | null;
  additionalText?: string | null;
  name: string | null;
  keywords: string | null;
  description: string | null;
  metaTitle: string | null;
  packUnit: string | null;
  tax: Tax;
  manufacturer: ProductManufacturer | null;
  unit: Unit | null;
  prices: ProductPrice[];
  listingPrices: ListingPrice[] | null;
  cover: ProductMedia;
  parent: Product;
  children: Product[];
  media: ProductMedia[];
  translations: ProductTranslation[];
  categories: Category[];
  tags: Tag[];
  properties: PropertyGroupOption[] | null;
  options: PropertyGroupOption[] | null;
  categoriesRo: Category[] | null;
  coverId: string | null;
  customFields: CustomField[];
  tagIds: [] | null;
  productReviews: ProductReview[] | null;
  ratingAverage: number | null;
  extensions: [];
  id: string;
  parentVersionId: string;
  productManufacturerVersionId: string;
  seoUrls: SeoUrl[] | null;
  translated: {
    name: string | null;
  };
  productMediaVersiond?: null;
}
