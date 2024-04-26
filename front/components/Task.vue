<template>
  <div class="container">
    <h1>Tâches</h1>
    <PToast />
    <PProgressSpinner
      v-if="loading"
      style="width: 50px; height: 50px"
      strokeWidth="8"
      fill="var(--surface-ground)"
      animationDuration=".5s"
      aria-label="Custom ProgressSpinner"
    />
    <PButton
      v-if="projects"
      label="Créer une nouvelle tâche"
      icon="pi pi-plus"
      severity="success"
      @click="openDialog"
    />
    <PMessage
      v-if="!loadingProjet && projectsUser.length === 0"
      :closable="false"
    >
      Aucun projet ni tâche disponible.
    </PMessage>
    <template v-else>
      <PDataTable :value="tasks" dataKey="id" :loading="loadingTask">
        <template #header>
          <div class="flex justify-content-end">
            <PDropdown
              v-model="selectedProject"
              editable
              :options="projectsUser"
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
        <PColumn field="name" header="Nom" />
        <PColumn field="description" header="Description" />
        <PColumn header="Statut">
          <template #body="slotProps">
            <PTag
              :value="getSeverity(slotProps.data).label"
              :severity="getSeverity(slotProps.data).severity"
            />
          </template>
        </PColumn>
        <PColumn
          headerStyle="width: 5rem; text-align: center"
          bodyStyle="text-align: center; overflow: visible"
        >
          <template #body>
            <PButton type="button" icon="pi pi-eye" text />
          </template>
        </PColumn>
      </PDataTable>
    </template>
    <PDialog
      v-model:visible="open"
      :style="{ width: '600px' }"
      header="Ajouter une tâche"
      :modal="true"
      class="p-fluid"
    >
      <div class="field">
        <label for="name">Projet :</label>
        <PDropdown
          v-model="selectedProjetAdmin"
          :options="projects"
          filter
          checkmark
          optionLabel="label"
          optionGroupLabel="label"
          optionGroupChildren="items"
          placeholder="Sélectionnez un projet"
          class="w-full"
        >
          <template #value="slotProps">
            <div v-if="slotProps.value" class="flex align-items-center">
              <div>{{ slotProps.value.name }}</div>
            </div>
            <span v-else>
              {{ slotProps.placeholder }}
            </span>
          </template>
          <template #option="slotProps">
            <div class="flex align-items-center">
              <div>{{ slotProps.option.name }}</div>
            </div>
          </template>
        </PDropdown>
      </div>
      <div class="field">
        <label for="projectName">Nom :</label>
        <PInputText id="projectName" v-model.trim="task.name" required="true" />
      </div>
      <div class="field">
        <label for="projectDescription">Description :</label>
        <PTextarea
          id="projectDescription"
          v-model="task.description"
          required="true"
          rows="3"
          cols="20"
        />
      </div>

      <template #footer>
        <PButton
          label="Annuler"
          icon="pi pi-times"
          text
          @click="cancelDialog"
        />
        <PButton
          label="Valider"
          :disabled="!selectedProjetAdmin || !task.name"
          icon="pi pi-check"
          @click="saveTask"
        />
      </template>
    </PDialog>
  </div>
</template>
<script setup>
import { useToast } from "primevue/usetoast";
const toast = useToast();
const loading = ref(false);
const loadingTask = ref(false);
const selectedProjetAdmin = ref(null);
const selectedProject = ref(null);
const projects = ref([]);
const loadingProjet = ref(false);
const tasks = ref([]);
const projectsUser = ref([]);
const open = ref(false);
const task = ref({
  project: null,
  name: "",
  description: "",
});

const openDialog = () => {
  open.value = true;
  getProjects();
};
// Fonction pour récupérer les équipes lors du chargement initial
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

const fetchTasks = () => {
  if (!selectedProject.value) return;
  loadingTask.value = true;
  useHttp
    .get(`/api/v1/project/${selectedProject.value.id}/tasks`)
    .then((res) => {
      tasks.value = res.tasks;
    })
    .catch((e) => {
      console.error(e);
      tasks.value = [];
    })
    .finally(() => {
      loadingTask.value = false;
    });
};

const getAdminProjects = () => {
  loading.value = true;
  useHttp
    .get(`/api/v1/user/projects/admin`)
    .then((res) => {
      projects.value = res;
    })
    .catch((e) => {
      console.error(e);
      projects.value = [];
    })
    .finally(() => {
      loading.value = false;
    });
};

// Fonction pour ajouter un projet
const saveTask = () => {
  loadingTask.value = true;
  useHttp
    .post(`/api/v1/task`, task.value)
    .then((res) => {
      cancelDialog();
      toast.add({
        severity: "success",
        summary: "Tâche créée",
        detail: "La tâche a été créée avec succès.",
        life: 3000,
      });
    })
    .catch((e) => {
      console.error(e);
    })
    .finally(() => {
      loadingTask.value = false;
    });
};

const cancelDialog = () => {
  Object.assign(task.value, {
    name: "",
    description: "",
  });
  selectedProjetAdmin.value = null;
  open.value = false;
};

watch(selectedProject, (newValue) => {
  if (newValue) {
    fetchTasks();
  }
});
watch(selectedProjetAdmin, (newValue) => {
  if (newValue !== null) {
    task.value.project = newValue.id;
  }
});
const getSeverity = (task) => {
  switch (task.state) {
    case 1:
      return { label: "À faire", severity: "warning" };
    case 2:
      return { label: "En cours", severity: "info" };
    case 3:
      return { label: "Terminé", severity: "success" };
    default:
      return { label: "Indéfini", severity: "secondary" };
  }
};

getProjects();
getAdminProjects();
</script>
