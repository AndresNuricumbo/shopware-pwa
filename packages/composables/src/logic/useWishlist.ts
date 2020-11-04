import Vue from "vue";
import { ref, Ref, reactive, computed } from "@vue/composition-api";
import { Product } from "@shopware-pwa/commons/interfaces/models/content/product/Product";

/**
 * interface for {@link useWishlist} composable
 * @beta
 */

export interface IUseWishlist {
  removeItem: (id: string) => void;
  clearWishlist: () => boolean;
  addToWishlist: () => boolean;
  updateStorage: () => boolean;
  isInWishlist: () => boolean;
  initWishlist: () => void;
  items: Ref<string[]>;
}

const sharedWishlist = Vue.observable({
  items: [],
} as any);

export const useWishlist = (product?: Product): IUseWishlist => {
  const productId: Ref<string | undefined> = ref(product?.id);
  const error: Ref<any> = ref(null);
  const localWishlist = reactive(sharedWishlist);

  const initWishlist = (): void => {
    if (!sharedWishlist.items.length) {
      sharedWishlist.items =
        (localStorage && JSON.parse(localStorage.getItem("savedWishlist"))) ||
        [];
    }
  };

  // removes item from the list
  const removeItem = (itemId: string): void => {
    const id = productId.value || itemId;
    if (!id) {
      return;
    }

    sharedWishlist.items = sharedWishlist.items.filter(
      (itemId) => itemId != id
    );
  };

  // add product id to wishlist array and trigger to update localstorage
  const addToWishlist = (): boolean => {
    if (!productId.value) {
      return;
    }

    sharedWishlist.items.push(productId.value);
  };

  // return true or false if product id is in wishlist array
  const isInWishlist = (): boolean =>
    sharedWishlist.items.includes(productId.value);

  // remove all items from wishlist
  const clearWishlist = (): boolean => {
    sharedWishlist.items = [];

    return true;
  };

  const items = computed(() => localWishlist.items);

  // update wishlist in localstorage
  const updateStorage = (): boolean => {
    localStorage.setItem("savedWishlist", items.value);

    return true;
  };

  return {
    addToWishlist,
    removeItem,
    isInWishlist,
    updateStorage,
    clearWishlist,
    initWishlist,
    items,
  };
};