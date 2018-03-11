<template>
  <header>
    <nav class="navbar is-light">
      <div class="navbar-brand">
        <router-link class="navbar-item"
                     :to="{ name: 'Home'}">
          <img src="/static/assets/logo.png">&nbsp;&nbsp;{{$t('CryptoHero')}}
        </router-link>

        <router-link v-if="!me"
                     class="navbar-item"
                     :to="{ name: 'Login'}">
          {{$t('Sign In')}}
        </router-link>

        <router-link v-else
                     class="navbar-item"
                     :to="{ name: 'User', params:{address: me.address}}">
          {{$t('My Cards')}}
        </router-link>

        <router-link class="navbar-item"
                     :to="{ name: 'FAQ'}">
          {{$t('FAQs')}}
        </router-link>

        <!-- <router-link class="navbar-item"
                     :to="{ name: 'BirthdayGift'}">
          {{$t('BirthdayGift')}}
        </router-link>         -->
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="field is-grouped">
            <p class="control">
              {{network.name}}
            </p>
          </div>
        </div>
        <div class="navbar-item">
          <div class="field is-grouped">

            <div class="control">
              <div class="select">
                <select v-model="locale">
                  <option v-for="(item) in $config.i18n"
                          :key="item.locale"
                          :value="item.locale">
                    {{item.langDisplay}}</option>
                </select>
              </div>
            </div>

          </div>
        </div>
      </div>

    </nav>
    <div v-if="infos.length > 0" class="notification is-danger content" >
        <p v-for="(info,index) in infos" :key="index">{{info}}</p>
    </div>
  </header>
</template>

<script>
import { getNetwork, getAnnouncements } from '@/api';

export default {
  name: 'Header',
  data() {
    return {
      network: {},
      infos: [],
    };
  },
  async created() {
    this.$store.dispatch('initLocale');
    this.$store.dispatch('FETCH_ME');
    const network = await getNetwork();
    if (!network) {
      alert('Unknown network!');
      return;
    }
    this.network = network;
    if (!network.contract) {
      alert(`Unsupported ${network.name}`);
    }
    const infos = [];
    const announcements = await getAnnouncements();
    announcements.forEach(({ type, content }) => {
      if (type === 'info') {
        infos.push(content);
      }
    });
    this.infos = infos;
  },
  computed: {
    locale: {
      get() {
        const locale = this.$store.state.locale;
        const i18n = this.$config ? this.$config.i18n : [];
        const lang = i18n.find(
          item =>
            item.locale === locale ||
            item.aliases.some(alias => alias === locale),
        );
        return lang ? lang.locale : null;
      },
      set(value) {
        this.$store.dispatch('setLocale', value);
      },
    },
    me() {
      return this.$store.state.me;
    },
  },
  watch: {
    locale(val) {
      this.$i18n.locale = val;
    },
  },
};
</script>

<style>

</style>
