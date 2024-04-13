<template>
  <div class="flex flex-column align-items-center">
    <h1 class="text-primary">Bienvenue sur Time Manager !</h1>
    <div>
      <TeamAdd @teamCreated="handleTeamCreated" />
    </div>
    <div v-if="teamCreated"><TeamInvitation /></div>
  </div>
</template>

<script setup>
definePageMeta({
  auth: useScope().CONTROLED,
});

const teamCreated = ref(false);

function handleTeamCreated(teamData) {
  console.log("Équipe créée avec succès", teamData);
  teamCreated.value = true;
}
</script>
<style scoped></style>
