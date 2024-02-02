<template>
  <main class="container">
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
          <PButton
            label="Connexion"
            plain
            text
            @click="navigateTo({ name: 'login' })"
          />
          <PButton
            label="Inscription"
            severity="contrast"
            rounded
            @click="navigateTo({ name: 'register' })"
          />
        </template>
      </PMegaMenu>
    </div>
    <div class="grid mt-4">
      <div class="col">
        <div class="fadeinleft animation-duration-1000">
          <h1>Gérez votre temps, optimisez vos projets.</h1>
        </div>
        <PButton label="Commencer" />
      </div>
      <div class="col mt-4">
        <img src="../assets/img/image.png" alt="Image du site" />
      </div>
    </div>

    <div id="fonctionnalites" class="flex flex-column">
      <!-- Contenu de la section Fonctionnalités -->
      <div class="flex align-items-center justify-content-center">
        <h2>Nos fonctionnalités</h2>
      </div>
      <div class="flex align-items-center justify-content-center">
        <p>
          Gérez vos projets et améliorez votre productivité avec Time Manager.
          Transformez la gestion du temps en une expérience simple, efficace et
          collaborative. Soyez maître de votre temps, aujourd'hui et demain.
        </p>
      </div>
    </div>

    <div id="a-propos">
      <!-- Contenu de la section À Propos -->
    </div>

    <div id="contact">
      <!-- Contenu de la section Contact -->
    </div>
  </main>
</template>
<script setup>
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
.text {
  margin-top: 150px;
  padding-left: 50px;
}
</style>
