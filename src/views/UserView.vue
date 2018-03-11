<template>
  <div>
    <section class="hero user-info-wrapper"
             v-bind:style="{ backgroundColor: '#'+address.slice(-6)}">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
          </h1>
          <h2 class="subtitle">
            {{$t('User')}}: {{address}}
          </h2>
        </div>
      </div>
    </section>

    <div class="tabs">
      <ul>
        <li class="is-active">
          <a v-if="me && me.address.toUpperCase() === address">{{$t('My Cards')}}</a>
          <a v-else>{{$t('His Cards')}}</a>
        </li>
      </ul>
    </div>
    <ItemList :itemIds='itemIds' />
  </div>
</template>

<script>
import ItemList from '@/components/ItemList';
import { getItemsOf } from '@/api';

export default {
  name: 'UserView',
  components: {
    ItemList,
  },
  data: () => ({
    itemIds: [],
  }),

  computed: {
    address() {
      return this.$route.params.address.toUpperCase();
    },
    me() {
      return this.$store.state.me;
    },
  },
  async created() {
    this.itemIds = await getItemsOf(this.$route.params.address);
  },

  watch: {},

  methods: {},
};
</script>
<style scoped>
.user-info-wrapper {
  border-radius: 5px;
}
</style>

