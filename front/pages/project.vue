<template>
  <div class="container">
    <PTabMenu :model="items" v-model:activeIndex="active" />
    <div v-show="active === 0"><Timer /></div>
    <div v-show="active === 1"><Project /></div>
    <div v-show="active === 2"><Task /></div>
  </div>
</template>
<script setup>
definePageMeta({
  layout: "authenticated",
  auth: useScope().CONTROLED,
});
const items = ref([
  { label: "Minuteur", icon: "pi pi-fw pi-clock" },
  { label: "Projets", icon: "pi pi-fw pi-briefcase" },
  { label: "Tâches", icon: "pi pi-fw pi-list" },
]);
const active = ref(0);
</script>
