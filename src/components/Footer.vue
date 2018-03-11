<template>
  <footer class="footer">
    <div class="container">
      <div class="columns">
        <div class="column is-4">
          <div class="content">
            <router-link class="navbar-item"
                         :to="{ name: 'Home'}">
              {{$t('Home')}}
            </router-link>
            <router-link class="navbar-item"
                         :to="{ name: 'FAQ'}">
              {{$t('FAQs')}}
            </router-link>
          </div>
        </div>
        <div class="column is-4">
          <div class="content">
            <router-link class="navbar-item"
                         :to="{ name: 'Term'}">
              {{$t('Terms of Service')}}
            </router-link>
            <router-link class="navbar-item"
                         :to="{ name: 'Privacy'}">
              {{$t('Privacy Policy')}}
            </router-link>
          </div>
        </div>
        <div class="column is-4">
          <div class="content">
            <span> {{$t('Contact Us')}}</span>
            <p><a href="http://t.me/CryptoHero_Official"
               target="_blank">
              @Telegram
            </a></p>
            <p><a href="https://discord.gg/nMXUYGQ"
               target="_blank">
              @Discord
            </a></p>
            <p>Wechat Group: add wechat friend "do_best_for_you"</p>
          </div>
        </div>
      </div>
      <div class="content has-text-centered">
        <p>
          <small>
            All rights reserved. <br>
            &copy; Copyright 2018
            <strong>CryptoHero.pro</strong>
          </small>
        </p>
      </div>
    </div>
  </footer>
</template>
