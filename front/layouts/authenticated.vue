<!-- Dans votre layout ou composant -->
<template>
  <div>
    <div :class="isExpanded ? 'side-off' : 'side-on'">
      <PButton
        v-if="!isExpanded"
        size="large"
        text
        class="z-0"
        icon="pi pi-bars"
        @click="toggleSidebar"
      />
    </div>

    <div v-if="isExpanded">
      <AppHeader @expanded="updateExpand" />
    </div>

    <div class="container" :class="isExpanded ? 'side-off' : 'side-on'">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup>
const MEDIUM = 960;

const isExpanded = ref(false);

const initSidebar = () => {
  isExpanded.value = window.innerWidth >= MEDIUM;
};

const updateExpand = (e) => {
  console.log(e);
  isExpanded.value = e.value;
};

onMounted(() => {
  initSidebar();
  window.addEventListener("resize", initSidebar);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", initSidebar);
});

const toggleSidebar = () => {
  isExpanded.value = !isExpanded.value;
};
</script>
