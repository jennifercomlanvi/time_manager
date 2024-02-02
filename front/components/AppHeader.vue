<template>
  <div class="card">
    <PMegaMenu :model="items" class="p-3 surface-0 fixed-menu">
      <template #start>
        <img src="../assets/img/logo.png" alt="image" style="width: 125px" />
      </template>
      <template #item="{ item }">
        <a
          v-ripple
          class="flex align-items-center cursor-pointer px-3 py-2 overflow-hidden relative font-semibold text-lg uppercase"
          style="border-radius: 2rem"
        >
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
        </a>
      </template>
      <template #end>
        <PButton label="Connexion" plain text @click="redirectTo('/login')" />
        <PButton
          label="Inscription"
          severity="contrast"
          rounded
          @click="redirectTo('/inscription')"
        />
      </template>
    </PMegaMenu>
  </div>
</template>

<script setup>
// const session = useAuthTokenStore();
const router = useRouter();

const items = ref([
  {
    label: "Fonctionnalités",
    id: "fonctionnalites",
  },
  {
    label: "A propos",
    id: "a-propos",
  },
  {
    label: "Contact",
    id: "contact",
  },
]);

function redirectTo(path) {
  router.push(path);
}
</script>
<style scoped>
.fixed-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

.card {
  border: none;
  box-shadow: none;
}
</style>
