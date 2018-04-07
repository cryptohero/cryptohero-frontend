// https://vuex.vuejs.org/en/actions.html

// Actions are similar to mutations,
// the differences being that:
// Instead of mutating the state, actions commit mutations.
// Actions can contain arbitrary asynchronous operations.

// Action handlers receive a context object
// which exposes the same set of methods/properties on the store instance,
// so you can call context.commit to commit a mutation,
// or access the state and getters via context.state and context.getters.

// DO NOT directly modify the state in actions.
// Please use commit() to update the state.

// import * as types from './mutation-types';
import * as api from '@/api';

export default {
  async initLocale({ commit }) {
    const locale = await api.getLocale();
    commit('setLocale', locale);
  },
  async setLocale({ commit }, locale) {
    await api.setLocale(locale);
    commit('setLocale', locale);
  },
  async FETCH_ME({ commit }) {
    try {
      const me = await api.getMe();
      commit('SET_ME', me);
      commit('SET_SIGN_IN_ERROR', null);
    } catch (e) {
      commit('SET_ME', null);
      commit('SET_SIGN_IN_ERROR', e.message);
    }
  },
  async FETCH_ITEM({ commit }, id) {
    const item = await api.getItem(id);

    // Get is LCY Claimed and merge the status into the item
    const isLCYClaimed = await api.isConvert(id);
    item.isLCYClaimed = isLCYClaimed;

    commit('SET_ITEM', { id, item });
  },
  async FETCH_AD({ commit }, id) {
    const ad = await api.getGg(id);
    commit('SET_AD', { id, ad });
  },
  /* Examples:
  increment(context) {
    context.commit('increment');
  },
  increment({ commit }) {
    commit('increment');
  },
  incrementAsync({ commit }, { amount }) {
    setTimeout(() => {
      commit('increment', amount);
    }, 1000);
  },
  // this.$store.dispatch('incrementAsync', { amount: 10 });
  checkout({ commit, state }, products) {
    // save the items currently in the cart
    const savedCartItems = [...state.cart.added];
    // send out checkout request, and optimistically
    // clear the cart
    commit(types.CHECKOUT_REQUEST);
    // the shop API accepts a success callback and a failure callback
    shop.buyProducts(
      products,
      // handle success
      () => commit(types.CHECKOUT_SUCCESS),
      // handle failure
      () => commit(types.CHECKOUT_FAILURE, savedCartItems),
    );
  },
  async actionA({ commit }) {
    commit('gotData', await getData());
  },
  async actionB({ dispatch, commit }) {
    await dispatch('actionA'); // wait for `actionA` to finish
    commit('gotOtherData', await getOtherData());
  },
  actionA({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation');
        resolve();
      }, 1000);
    });
  },
  // store.dispatch('actionA').then(() => {})
  */
};
