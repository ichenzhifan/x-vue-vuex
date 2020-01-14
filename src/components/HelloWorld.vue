<template>
  <div class="hello">
    <h3>{{$store.state.count}}</h3>
    <button @click="increase">click me</button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  methods: {
    increase() {
      this.$store.dispatch('increase');
    }
  },
}
</script>

