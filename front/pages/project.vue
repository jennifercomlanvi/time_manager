<template>
  <div class="container">
    <PTabMenu :model="items" v-model:activeIndex="active" />
    <component :is="currentTabComponent" />
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

const currentTabComponent = computed(() => {
  switch (active.value) {
    case 0:
      return resolveComponent("Timer");
    case 1:
      return resolveComponent("Project");
    case 2:
      return resolveComponent("Task");
    default:
      return null;
  }
});
</script>
