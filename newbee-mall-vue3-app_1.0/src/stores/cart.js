import { ref } from "vue";
import { defineStore } from "pinia";
import { getCart } from "@/service/cart";
// 使用这个store，可以方便地获取购物车数量并更新购物车数据。
export const useCartStore = defineStore("cart", () => {
  const count = ref(0);
  async function updateCart() {
    const { data = [] } = await getCart();
    count.value = data.length;
  }

  return { count, updateCart };
});
