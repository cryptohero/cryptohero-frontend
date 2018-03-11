<template>
  <div class="hello">
    From:
    <input v-model=from /> To:
    <input v-model=to /> Value:
    <input v-model=value
           type="number" />Message:
    <textarea v-model=message />
    <button type="submit"
            @click="onBuy">Buy</button>
  </div>
</template>

<script>

import { getGift } from '@/api';

export default {
  name: 'HelloWorld',
  data() {
    return {
      from: '',
      to: '',
      message: '',
      value: 0,
    };
  },
  methods: {
    onBuy: async () => {
      const gift = await getGift(1);
      console.log(gift);
    },
  },
  created() {
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
