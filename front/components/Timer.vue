<template>
  <div class="container">
    <h1>Demarrer un minuteur</h1>
    <div class="card">
      <div class="time-sheet-container">
        <div class="time-sheet-header">
          <PButton icon="pi pi pi-arrow-left" @click="goToPreviousDay" />
          <h2>Aujourd'hui, {{ todayFormatted }}</h2>

          <PButton
            icon="pi pi-arrow-right"
            @click="goToNextDay"
            :disabled="isToday"
          />
          <PButton icon="pi pi-clock" label="Commencer" class="start-button" />
          <div>{{ currentTime }}</div>
        </div>

        <PButton
          label="+ Ajouter un journal de temps"
          @click="toggleTimeEntryCard"
        />

        <p v-if="!timeEntries.length">
          Aucun temps suivi pour cette journée. Démarrer un nouveau journal de
          temps.
        </p>

        <!-- Ici, vous mettez vos composants pour lister les journaux de temps existants -->

        <PCard>
          <template #title>Ajouter un journal de temps</template>
          <template #content
            ><PSplitter style="height: 300px">
              <PSplitterPanel
                class="flex align-items-center justify-content-center"
                :size="75"
                :minSize="10"
              >
                Panel 1
              </PSplitterPanel>
              <PSplitterPanel
                class="flex align-items-center justify-content-center"
                :size="25"
              >
                Panel 2
              </PSplitterPanel>
            </PSplitter>
          </template>
          <template #footer>
            <div class="flex gap-3 mt-1">
              <PButton label="Démarrer la minuterie" @click="startTimer" />
              <PButton label="Démarrer et fermer" @click="startTimerAndClose" />
              <PButton label="Annuler" @click="toggleTimeEntryCard" />
            </div>
          </template>
        </PCard>
      </div>
    </div>
  </div>
</template>
<script setup>
const showTimeEntryCard = ref(false);
const timeEntries = ref([]);

const today = new Date();
today.setHours(0, 0, 0, 0);
const selectedDate = ref(new Date(today));

const isToday = computed(() => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return selectedDate.value.getTime() === now.getTime();
});

const toggleTimeEntryCard = () => {
  showTimeEntryCard.value = !showTimeEntryCard.value;
};

const todayFormatted = computed(() =>
  selectedDate.value.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }),
);

const currentTime = computed(() => {
  const now = new Date();
  return now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
});

const goToPreviousDay = () => {
  selectedDate.value.setDate(selectedDate.value.getDate() - 1);
};

const goToNextDay = () => {
  if (!isToday.value) {
    selectedDate.value.setDate(selectedDate.value.getDate() + 1);
  }
};

const startTimer = () => {
  // Logique pour démarrer le suivi du temps
};

const startTimerAndClose = () => {
  startTimer();
  showTimeEntryDialog.value = false;
};
</script>
<style scoped>
.time-sheet-container {
  /* Votre CSS ici */
}

.time-sheet-header {
  /* Votre CSS ici */
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.time-entry-card {
  /* Votre CSS pour la carte d'entrée de temps */
  margin-top: 1em; /* Espace au-dessus de la carte */
}
</style>
