// https://vuex.vuejs.org/en/mutations.html

// The only way to actually change state in a Vuex store is by committing a mutation.

// You cannot directly call a mutation handler.
// Think of it more like event registration: "When a mutation with type increment is triggered,
// call this handler." To invoke a mutation handler, you need to call store.commit with its type.

// Mutation handler functions must be synchronous
// One important rule to remember is that mutation handler functions must be synchronous.

// Using Constants for Mutation Types
// import * as types from './mutation-types';

import Vue from 'vue';

export default {
  setLocale(state, locale) {
    state.locale = locale;
  },
  SET_ME(state, me) {
    state.me = me;
  },
  SET_SIGN_IN_ERROR(state, error) {
    state.signInError = error;
  },
  SET_ITEM(state, { id, item }) {
    Vue.set(state.items, id, item);
  },
  SET_AD(state, { id, ad }) {
    Vue.set(state.ads, id, ad);
  },
  /* Examples:
  [types.ADD_TO_CART](state, payload) {
    state.cart.push(payload);
  },
  // this.$store.commit(types.ADD_TO_CART, product);

  increment(state) {
    state.count++;
  },
  // this.$store.commit('increment');
  */
};
