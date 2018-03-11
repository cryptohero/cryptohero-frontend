<template>
  <div class="">
    <div v-if="signInError === 'METAMASK_LOCKED'">
      <p> Your MetaMask is locked</p>
      <p> open MetaMask and follow the instructions to unlock it.</p>
    </div>

    <div v-if="signInError === 'NO_METAMASK'">
      <p>What’s this meow!?</p>
      <p>
        You can only play me on a desktop browser like Chrome or Firefox.
      </p>
    </div>

    <div v-if="me">
      <router-link :to="{
                            name: 'User',
                            params: {address:me.address},
                         }">
        Welcome {{me.address}}
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignInView',
  computed: {
    me() {
      return this.$store.state.me;
    },
    signInError() {
      return this.$store.state.signInError;
    },
  },
};
</script>

<style scoped>

</style>
