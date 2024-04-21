<template>
  <div class="container">
    <h1>Tâches</h1>
    <div class="card">
      <PMessage v-if="!loading && tasks.length === 0" :closable="false">
        Vous n'êtes actuellement assigné à aucun projet. Contactez votre
        administrateur pour plus de détails, pour être ajouté à un projet
        existant, ou envisagez de démarrer votre propre projet dès maintenant !
      </PMessage>
      <PButton label="Ajouter une tâche" icon="pi pi-plus" severity="success" />
    </div>
  </div>
</template>
<script setup>
const loading = ref(false);
const tasks = ref([]);
</script>
