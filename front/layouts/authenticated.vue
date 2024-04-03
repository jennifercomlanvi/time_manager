<!-- Dans votre layout ou composant -->
<template>
  <div>
    <AppHeader />
    <main class="container">
      <NuxtPage :class="isExpanded ? 'side-off' : 'side-on'" />
    </main>
  </div>
</template>

<script setup>
const isExpanded = ref(false);

const toggleSidebar = () => {
  isExpanded.value = !isExpanded.value;
};

onMounted(() => {
  const handleResize = () => {
    isExpanded.value = window.innerWidth >= 960;
  };
  window.addEventListener("resize", handleResize);
  handleResize();

  onBeforeUnmount(() => {
    window.removeEventListener("resize", handleResize);
  });
});
</script>
