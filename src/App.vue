<template>
  <div class="container py-3">
    <div class="text-center mb-5">
      <h1>Pokemon GO of Rochester, NY</h1>
      <h2>Raid Reporting Tool</h2>
    </div>

    <template v-if="auth.check()">
      <p class="mb-5 text-center">
        <b>Logged in as:</b>
        {{ auth.user().username }}#{{ auth.user().discriminator }}
        <a href="#" @click.prevent="auth.logout()">(Not you?)</a>
      </p>

      <div v-if="!auth.user()['serverMember']" class="text-center">
        <p class="font-weight-bold mb-3">
          Sorry, you must be a member of the Pokemon GO of Rochester, NY server to use this tool
        </p>
        <a href="#" class="btn btn-secondary" @click.prevent="auth.logout()">Logout</a>
      </div>

      <template v-else-if="submitting">
        <p class="font-weight-bold mb-3">
          Sending raid report...
        </p>
      </template>

      <template v-else-if="success">
        <p class="font-weight-bold mb-3">
          Report sent successfully!
        </p>
      </template>

      <raid-form v-else @submit="onSubmit"></raid-form>
    </template>

    <div v-else class="text-center mt-5">
      <a href="https://us-east4-pokemon-go-of-rochester-ny.cloudfunctions.net/discord-login" class="btn btn-primary">Login
        with Discord</a>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Guard from "@/Guard";
import RaidForm from "@/components/RaidForm.vue";
import RaidData from "@/data/RaidData";
import axios from 'axios';

const SUBMIT_URL = "https://us-east4-pokemon-go-of-rochester-ny.cloudfunctions.net/raid-report";

@Component({
  components: {RaidForm}
})
export default class App extends Vue {
  protected readonly auth: Guard = new Guard();
  protected submitting: boolean = false;
  protected success: boolean = false;

  protected onSubmit(raidData: RaidData) {
    if (this.submitting) {
      return;
    }

    this.submitting = true;

    const requestData = { ...raidData, token: this.auth.jwt() };

    axios.post(SUBMIT_URL, requestData)
        .then(() => {
          this.submitting = false;
          this.success = true;
          setTimeout(() => {
            this.success = false;
          }, 1000);
        });
  }
}
</script>

<style lang="scss">
@import '~bootstrap/scss/bootstrap';
@import '~bootstrap-vue/src/index.scss';
</style>
