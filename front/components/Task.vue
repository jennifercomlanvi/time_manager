<template>
  <div class="container">
    <h1>Tâches</h1>
    <PProgressSpinner
      v-if="loading"
      style="width: 50px; height: 50px"
      strokeWidth="8"
      fill="var(--surface-ground)"
      animationDuration=".5s"
      aria-label="Custom ProgressSpinner"
    />
    <!-- <div class="card">
      <PMessage v-if="!loading && tasks.length === 0" :closable="false">
        Vous n'êtes actuellement assigné à aucun projet. Contactez votre
        administrateur pour plus de détails, pour être ajouté à un projet
        existant, ou envisagez de démarrer votre propre projet dès maintenant !
      </PMessage>
      <PButton label="Ajouter une tâche" icon="pi pi-plus" severity="success" />
    </div> -->
    <template v-else>
      <PDataTable :value="tasks" dataKey="id" :loading="loadingTask">
        <template #header>
          <div class="flex justify-content-end">
            <PDropdown
              v-model="selectedProject"
              editable
              :options="formattedProjects"
              optionLabel="teamAndProjectName"
              placeholder="Choisir un projet"
              class="w-full md:w-14rem"
            />
          </div>
        </template>
        <template #empty>
          <p v-if="selectedProject">Aucune tâche pour ce projet</p>
          <p v-else>Veuillez selectionnez un projet</p>
        </template>
        <template #loading>
          Chargement des données des projets. Veuillez patienter.</template
        >
        <!-- <PColumn field="name" header="Nom" />
          <PColumn field="description" header="Description" />
          <PColumn field="deadline" header="Date limite" />
          <PColumn
            headerStyle="width: 5rem; text-align: center"
            bodyStyle="text-align: center; overflow: visible"
          >
            <template #body>
              <PButton type="button" icon="pi pi-eye" text />
            </template>
          </PColumn> -->
      </PDataTable>
    </template>
  </div>
</template>
<script setup>
const loading = ref(false);
const loadingTask = ref(false);
const selectedProject = ref(null);
const tasks = ref([]);
const formattedProjects = ref([]);
// Fonction pour récupérer les équipes lors du chargement initial
const getProjects = () => {
  loading.value = true;
  useHttp
    .get("/api/v1/user/projects")
    .then((res) => {
      if (res) {
        formattedProjects.value = Object.entries(res).flatMap(
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
</script>
