<template>
  <b-form>
    <b-form-radio-group v-model="hatched">
      <b-form-row class="mb-3">
        <b-col cols="6">
          <b-form-radio :value="false">Egg</b-form-radio>
        </b-col>
        <b-col cols="6">
          <b-form-radio :value="true">Raid</b-form-radio>
        </b-col>
      </b-form-row>
    </b-form-radio-group>
    <b-form-row>
      <b-col cols="12">
        <b-form-group label="Gym:"
                      label-for="inputGym">
          <b-form-select id="inputGym"
                         :options="gymOptions"
                         required
                         v-model="gym">
          </b-form-select>
        </b-form-group>
      </b-col>
    </b-form-row>
    <b-form-row>
      <b-col cols="6">
        <b-form-group label="Level:"
                      label-for="inputLevel">
          <b-form-input id="inputLevel"
                        v-model="level"
                        type="number"
                        max="5"
                        min="1"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col cols="6">
        <b-form-group label="Time Remaining (Minutes):"
                      label-for="inputRemaining">
          <b-form-input id="inputRemaining"
                        v-model="remaining"
                        type="number"
                        max="60"
                        min="0"></b-form-input>
        </b-form-group>
      </b-col>
    </b-form-row>
    <b-form-row v-if="hatched">
      <b-col cols="12">
        <b-form-group label="Raid Boss:"
                      label-for="inputBoss">
          <b-form-input id="inputBoss"
                        v-model="boss"
                        type="text"></b-form-input>
        </b-form-group>
      </b-col>
    </b-form-row>
    <div class="text-center">
      <b-button variant="primary" @click="onSubmit">Submit</b-button>
    </div>
  </b-form>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import gyms from '../data/gyms.json';

interface GymObject {
  name: string;
  lat: string;
  lon: string;
}

@Component
export default class RaidForm extends Vue {
  protected hatched: boolean = false;
  protected gym: number = 0;
  protected level: number = 5;
  protected remaining: number = 59;
  protected boss: string = "";

  get gymOptions() {
    return gyms.map((gym: GymObject, index: number) => {
      return {
        value: index,
        text: gym.name
      }
    });
  }

  protected onSubmit() {
    this.$emit('submit', {
      gym: this.gym,
      level: this.level,
      remaining: this.remaining,
      hatched: this.hatched,
      boss: this.boss
    })
  }
}
</script>

<style scoped>

</style>