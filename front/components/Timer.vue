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
          <PButton
            icon="pi pi-clock"
            label="Commencer"
            class="start-button"
            @click="startTimer"
          />
          <!-- <div>{{ currentTime }}</div> -->
          <div>{{ elapsedTime }}</div>
        </div>

        <!-- <PButton
          label="+ Ajouter un journal de temps"
          @click="toggleTimeEntryCard"
        /> -->

        <!-- <p v-if="!timeEntries.length">
          Aucun temps suivi pour cette journée. Démarrer un nouveau journal de
          temps.
        </p> -->

        <!-- Ici, vous mettez vos composants pour lister les journaux de temps existants -->

        <PCard>
          <template #title>Ajouter un journal de temps</template>
          <template #content
            ><PSplitter style="height: 300px">
              <PSplitterPanel class="pt-4 px-2"
                :size="75"
              >
                <div class="flex flex-column">
                  <div class="field">
                    <PDropdown
                      v-model="selectedProject"
                      editable
                      :options="projectsUser"
                      optionLabel="teamAndProjectName"
                      placeholder="Choisir un projet"
                      class="w-full"
                    />
                  </div>
                  <div class="field">
                    <PDropdown
                      v-model="selectedTask"
                      :options="tasks"
                      optionLabel="name"
                      placeholder="Choisir une tâche"
                      :disabled="!selectedProject || tasks.length === 0"
                      class="w-full"
                    />
                  </div>
                <PTextarea v-model="comment" placeholder="Commentaire" autoResize rows="5" cols="30" />

                </div>
                
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
              <!-- <PButton label="Démarrer et fermer" @click="startTimerAndClose" /> -->
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
const startTime = ref(null);
const timerInterval = ref(null);
const elapsedTime = ref("00:00:00");
const today = new Date();
today.setHours(0, 0, 0, 0);
const selectedDate = ref(new Date(today));
const projectsUser = ref([]);
const tasks = ref([]);
const selectedProject = ref(null);
const selectedTask = ref(null);
const comment = ref(null);
const loading = ref(false);

const getProjects = () => {
  loading.value = true;
  useHttp
    .get("/api/v1/user/projects")
    .then((res) => {
      if (res) {
        projectsUser.value = Object.entries(res).flatMap(
          ([teamName, projects]) =>
            projects.map((project) => ({
              ...project,
              teamAndProjectName: `${teamName} - ${project.name}`,
            })),
        );
      }
    })
    .catch((e) => {
      console.log(e);
    })
    .finally(() => {
      loading.value = false;
    });
};
getProjects();
const fetchTasksForSelectedProject = () => {
  if (!selectedProject.value) {
    tasks.value = [];
    return;
  }
    useHttp.get(`/api/v1/project/${selectedProject.value.id}/tasks`)
    .then((res) => {
        tasks.value = res.tasks || [];
      }
    )
    .catch((e) => {
      console.log(e);
    })
    .finally(() => {
      // loading.value = false;
    });
  
};

watch(selectedProject, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    fetchTasksForSelectedProject();
  }
});
// Fonction pour formater le temps écoulé en HH:MM:SS
function formatTime(duration) {
  const hours = Math.floor(duration / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((duration % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (duration % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

// Démarrer le minuteur
const startTimer = () => {
  if (timerInterval.value) clearInterval(timerInterval.value);
  startTime.value = Date.now();
  timerInterval.value = setInterval(() => {
    const secondsPassed = Math.floor((Date.now() - startTime.value) / 1000);
    elapsedTime.value = formatTime(secondsPassed);
  }, 1000);
};

// Arrêter le minuteur
const stopTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }
};
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

const startTimerAndClose = () => {
  startTimer();
  showTimeEntryDialog.value = false;
};

// Nettoyer à la destruction du composant
onUnmounted(() => {
  if (timerInterval.value) clearInterval(timerInterval.value);
});
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
