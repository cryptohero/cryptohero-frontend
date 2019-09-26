<template>
  <div class="item-view">
    <div v-if="item">
      <div class="columns is-multiline is-mobile">
        <div class="column
           is-full-mobile">
          <img :src="getCardImage">
        </div>
        <div class="column
           is-full-mobile">
          <img :src="getCardBackSideImage">
        </div>
        <div class="column
           is-full-mobile">
          <div class="content">
            <h2>{{item.nickname}} · {{item.name}}</h2>
            <!-- Experimental Start -->
            <div class="card">
                <div class="card-image">
                  <figure class="image is-1by1" style="margin: 0">
                    <img :src="getOwnerAvatar" alt="Holder image">
                  </figure>
                </div>
                <div class="card-content">
                  <div class="media">
                    <div class="media-content">
                      <p class="title is-4">{{$t('Owner')}} {{ownerTag}}</p>
                      <p class="subtitle is-6"> {{$t('Current Price')}}：{{toDisplayedPrice(item.price)}} </p>
                      <p class="subtitle is-6"> {{$t('isLuckyClaim')}}: {{ isConvert ? 'Yes' : 'No'}} </p>
                      <p class="subtitle is-6"> {{$t('Slogan')}}: {{ad}} </p>
                    </div>
                  </div>
                </div>
              </div>
            <!-- Experimental End -->

             <!-- <router-link :to="{ name: 'User', params:{address: item.owner}}">
            <figure class="image is-128x128">
              <img class="item-image"
              :src="getOwnerAvatar">
            </figure>
            </router-link>
            <ul>
              <li>{{$t('Owner')}}：
                <router-link :to="{ name: 'User', params:{address: item.owner}}">
                  {{ownerTag}}
                </router-link>
              </li>
              <li>{{$t('Current Price')}}：{{toDisplayedPrice(item.price)}}</li>
              <li>{{$t('isLuckyClaim')}}：{{ isConvert ? 'Yes' : 'No'}}</li>
            </ul>
            <p class="item-slogan">{{$t('Slogan')}}: {{ad}}</p> -->
            <article v-if="notOwner"
                     class="message is-warning">
              <div class="message-body">
                {{$t('EDIT_SLOGAN_TIP')}}
              </div>
            </article>
          </div>

          <template v-if="notOwner">
            <div class="buttons">
              <button class="button is-danger is-outlined"
                      @click="onBuy(1)">{{ $t('BUY_BTN') }}</button>
              <button class="button is-danger is-outlined"
                      @click="onBuy(1.1)">{{ $t('PREMIUM_BUY_BTN', { rate: '10%' }) }}</button>
              <button class="button is-danger is-outlined"
                      @click="onBuy(1.2)">{{ $t('PREMIUM_BUY_BTN', { rate: '20%' }) }}</button>
              <button class="button is-danger is-outlined"
                      @click="onBuy(1.3)">{{ $t('PREMIUM_BUY_BTN', { rate: '30%' }) }}</button>
              <button class="button is-danger is-outlined"
                      @click="onBuy(1.4)">{{ $t('PREMIUM_BUY_BTN', { rate: '40%' }) }}</button>
              <button class="button is-danger is-outlined"
                      @click="onBuy(1.5)">{{ $t('PREMIUM_BUY_BTN', { rate: '50%' }) }}</button>
            </div>
            <article class="message is-danger">
              <div class="message-body">
                {{$t('BUY_PRICE_TIP')}}
              </div>
            </article>
          </template>

          <template v-if="isOwner">
            <div class="buttons">
            <button
                  class="button is-warning"
                  @click="onUpdateAd">{{$t('Edit Slogan')}}</button>
            <button
                  class="button is-info"
                  v-if="!isConvert"
                  @click="exchangeToken">{{$t('Claim Lucky Token')}}</button>

            </div>

          </template>
        </div>
      </div>
    </div>
    <div v-else-if="item === null">
      Token doesn't exist
    </div>
  </div>
</template>

<script>
import { buyItem, exchangeLuckyToken, setGg, setNextPrice } from '@/api';
import { toReadablePrice } from '@/util';
import Dravatar from 'dravatar';

export default {
  name: 'item-view',

  data: () => ({}),

  asyncComputed: {
    async getOwnerAvatar() {
      const uri = await Dravatar(this.ownerAddress);
      return uri;
    },
  },

  computed: {
    ownerTag() {
      return this.item.owner.slice(-6).toUpperCase();
    },
    itemId() {
      return this.$route.params.id;
    },
    me() {
      return this.$store.state.me || {};
    },
    ownerAddress() {
      return this.item.owner;
    },
    item() {
      return this.$store.state.items[this.itemId];
    },
    ad() {
      return this.$store.state.ads[this.itemId];
    },
    isConvert() {
      return this.$store.state.items[this.itemId].isLCYClaimed;
    },
    getCardImage() {
      // return `http://test.cdn.hackx.org/heros/${this.itemId}.jpg`;
      return `static/assets/heros/${this.itemId}.jpg`;
    },
    getCardBackSideImage() {
      //return `http://test.cdn.hackx.org/back/${this.itemId}.jpeg`;
      return `static/assets/back/${this.itemId}.jpeg`;
    },
    isOwner() {
      return this.item.owner === this.me.address;
    },
    notOwner() {
      return !this.isOwner;
    },
  },
  async created() {
    this.$store.dispatch('FETCH_ITEM', this.itemId);
    this.$store.dispatch('FETCH_AD', this.itemId);
  },

  watch: {},

  methods: {
    onBuy(rate) {
      if (this.$store.state.signInError) {
        return this.$router.push({ name: 'Login' });
      }
      const buyPrice = this.item.price.times(rate).toFixed(0);
      buyItem(this.itemId, buyPrice)
        .then(() => {
          alert(this.$t('BUY_SUCCESS_MSG'));
          setNextPrice(this.itemId, buyPrice);
        })
        .catch((e) => {
          alert(this.$t('BUY_FAIL_MSG'));
          console.log(e);
        });
    },
    toDisplayedPrice(priceInWei) {
      const readable = toReadablePrice(priceInWei);
      return `${readable.price} ${readable.unit}`;
    },
    async onUpdateAd() {
      const ad = prompt(this.$t('UPDATE_SLOGAN_PROMPT'));
      if (ad !== null) {
        if (ad.length > 100) {
          return alert(this.$t('UPDATE_SLOGAN_FAIL_TOO_LOOG_MSG'));
        }
        setGg(this.itemId, ad)
          .then(() => {
            this.$store.dispatch('FETCH_AD', this.itemId);
          })
          .catch((e) => {
            alert(this.$t('UPDATE_SLOGAN_FAIL_MSG'));
            console.log(e);
          });
      }
      return 0;
    },
    async exchangeToken() {
      // need i18n
      exchangeLuckyToken(this.itemId)
        .then(() => alert('请求已发送 请等待交易结果'))
        .catch(() => {
          alert('交易发送失败');
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
