<template>
  <div class="columns is-multiline is-mobile">
    <router-link v-for="item in items"
                 v-if="item"
                 :to="{ name: 'Item', params:{id: item.id}}"
                 :key=item.id.toString()
                 class="column
           is-full-mobile
           is-one-quarter-tablet
           is-one-quarter-desktop
           is-one-quarter-widescreen
           is-one-quarter-fullhd">
      <template v-if="1 <= item.id && item.id <= 114">
        <div class="card">
          <div class="card-image">
            <figure class="image is-5by4">
              <img v-lazy="getCardImage(item.id)">
            </figure>
          </div>
          <div class="card-content">
            <div class="content is-small">
              <h4>{{item.nickname}} · {{item.name}}</h4>
              <ul>
                <li>{{$t('Owner')}}：
                  <router-link v-if="item.owner"
                               :to="{ name: 'User', params:{address: item.owner}}">
                    {{item.owner.slice(-6).toUpperCase()}}
                  </router-link>
                </li>
                <li>{{$t('Current Price')}}: {{toDisplayedPrice(item.price)}}</li>
              </ul>
              <p class="item-slogan">{{$t('Slogan')}}: {{toDisplayedAd(item.id)}}</p>
            </div>
          </div>
        </div>
      </template>
    </router-link>
  </div>
</template>

<script>
import { toReadablePrice } from '@/util';

export default {
  name: 'item-lists',
  props: ['itemIds'],

  data: () => ({}),

  computed: {
    items() {
      return this.itemIds.map((id) => {
        const item = this.$store.state.items[id];
        return item || { id };
      });
    },
  },

  methods: {
    toDisplayedPrice(priceInWei) {
      const readable = toReadablePrice(priceInWei);
      return `${readable.price} ${readable.unit}`;
    },
    toDisplayedAd(id) {
      const ad = this.$store.state.ads[id];
      if (ad && ad.length >= 45) {
        return `${ad.slice(0, 44)} ...`;
      }
      return ad;
    },
    getCardImage(id) {
      // return `http://test.cdn.hackx.org/heros/${id}.jpg`;
      return `static/assets/heros/${id}.jpg`;
    },
  },

  created() {},

  watch: {
    itemIds(newItemIds) {
      newItemIds.forEach((itemId) => {
        this.$store.dispatch('FETCH_ITEM', itemId);
        this.$store.dispatch('FETCH_AD', itemId);
      });
    },
  },
};
</script>
 <style scoped>
.item-slogan {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-all;
}
</style>

