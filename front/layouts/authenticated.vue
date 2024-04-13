<template>
  <div>
    <div :class="isExpanded ? 'side-off' : 'side-on'">
      <PButton
        v-if="!isExpanded"
        size="large"
        text
        icon="pi pi-bars"
        @click="toggleSidebar"
      />
    </div>

    <div v-if="isExpanded">
      <AppHeader @expanded="updateExpand" />
    </div>

    <div class="container">
      <NuxtPage :class="isExpanded ? 'side-off' : 'side-on'" />
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
