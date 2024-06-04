<template>
  <div class="container">
    <h1>Projets</h1>
    <div class="card">
      <PProgressSpinner
        v-if="loading"
        style="width: 50px; height: 50px"
        strokeWidth="8"
        fill="var(--surface-ground)"
        animationDuration=".5s"
        aria-label="Custom ProgressSpinner"
      />
      <PButton
        v-if="teams.length > 0"
        label="Créer un nouveau projet"
        icon="pi pi-plus"
        severity="success"
        @click="openDialog"
      />
      <PMessage
        v-if="!loadingTeam && teamsUsers.length === 0"
        :closable="false"
      >
        Vous n'êtes actuellement assigné à aucune équipe. Contactez votre
        administrateur pour plus de détails, pour être ajouté à une équipe
        existante, ou envisagez de créer une équipe dès maintenant !
      </PMessage>
      <template v-else>
        <PDataTable :value="projects" dataKey="id" :loading="loadingProject">
          <template #header>
            <div class="flex justify-content-end">
              <PDropdown
                v-model="selectedTeam"
                editable
                :options="teamsUsers"
                optionLabel="team_name"
                placeholder="Choisir une équipe"
                class="w-full md:w-14rem"
              />
            </div>
          </template>
          <template #empty>
            <p v-if="selectedTeam">Aucun projet pour cette équipe</p>
            <p v-else>Veuillez selectionnez une équipe</p>
          </template>
          <template #loading>
            Chargement des données des projets. Veuillez patienter.</template
          >
          <PColumn field="name" header="Nom" />
          <PColumn field="description" header="Description" />
          <PColumn field="deadline" header="Date limite" />
          <!-- <PColumn
            field="activity"
            header="Activity"
            sortable
            :showFilterMatchModes="false"
            style="min-width: 12rem"
          >
            <template #body="{ data }">
              <PProgressBar
                :value="data.activity"
                :showValue="false"
                style="height: 6px"
              ></PProgressBar>
            </template>
            <template #filter="{ filterModel }">
              <PSlider v-model="filterModel.value" range class="m-3"></PSlider>
              <div class="flex align-items-center justify-content-between px-2">
                <span>{{ filterModel.value ? filterModel.value[0] : 0 }}</span>
                <span>{{
                  filterModel.value ? filterModel.value[1] : 100
                }}</span>
              </div>
            </template>
          </PColumn> -->
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
    </div>
    <PDialog
      v-model:visible="open"
      :style="{ width: '600px' }"
      header="Ajouter un projet"
      :modal="true"
      class="p-fluid"
    >
      <div class="field">
        <label for="name">Equipe :</label>
        <PDropdown
          v-model="selectedTeamAdmin"
          :options="teams"
          filter
          checkmark
          optionLabel="name"
          placeholder="Sélectionnez une équipe"
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
        <PInputText
          id="projectName"
          v-model.trim="project.name"
          required="true"
        />
      </div>
      <div class="field">
        <label for="projectDate">Date limite :</label>
        <PCalendar
          id="projectDate"
          :minDate="minDate"
          dateFormat="dd/mm/yy"
          showIcon
          v-model="project.deadline"
        />
      </div>
      <div class="field">
        <label for="projectDescription">Description :</label>
        <PTextarea
          id="projectDescription"
          v-model="project.description"
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
          :disabled="!selectedTeamAdmin || !project.name"
          icon="pi pi-check"
          @click="saveProject"
        />
      </template>
    </PDialog>
  </div>
</template>
<script setup>
const loading = ref(false);
const loadingTeam = ref(false);
const loadingProject = ref(false);
const open = ref(false);
const selectedTeam = ref(null);
const selectedTeamAdmin = ref(null);
const minDate = ref(new Date());
const projects = ref([]);
const teams = ref([]);
const teamsUsers = ref([]);
const project = ref({
  team: null,
  name: "",
  description: "",
  deadline: null,
});

// Fonction pour récupérer les équipes lors du chargement initial
const getAdminTeams = () => {
  loading.value = true;
  useHttp
    .get("/api/v1/user/teams/admin")
    .then((res) => {
      teams.value = res;
    })
    .catch((e) => {
      console.log(e);
    })
    .finally(() => {
      loading.value = false;
    });
};

// Fonction pour ouvrir le dialog d'ajout de projet
const openDialog = () => {
  open.value = true;
  getAdminTeams();
};
const getTeams = () => {
  loadingTeam.value = true;
  useHttp
    .get("/api/v1/user/teams")
    .then((res) => {
      teamsUsers.value = res.teams;
    })
    .catch((e) => {
      console.log(e);
    })
    .finally(() => {
      loadingTeam.value = false;
    });
};
// Fonction pour récupérer les projets correspondants à l'équipe sélectionnée
const fetchProjects = () => {
  if (!selectedTeam.value) return;
  loadingProject.value = true;
  useHttp
    .get(`/api/v1/projects/${selectedTeam.value.team_id}`)
    .then((res) => {
      // console.log(res);
      projects.value = res.projects;
    })
    .catch((e) => {
      console.error(e);
      projects.value = [];
    })
    .finally(() => {
      loadingProject.value = false;
    });
};

// Fonction pour ajouter un projet
const saveProject = () => {
  console.log( project.value);
  useHttp
    .post("/api/v1/project", project.value)
    .then(() => {
      const team = teamsUsers.value.find(
        (team) => team.team_id === project.value.team,
      );
      if (team) {
        selectedTeam.value = team;
      }
      cancelDialog();
    })
    .catch((e) => {
      console.error(e);
    })
    .finally(() => {
      loadingProject.value = false;
    });
};

const cancelDialog = () => {
  Object.assign(project.value, {
    team: null,
    name: "",
    description: "",
    deadline: null,
  });
  selectedTeamAdmin.value = null;
  open.value = false;
};

// Observer les changements de l'équipe sélectionnée pour récupérer les projets correspondants
watch(selectedTeam, (newValue) => {
  if (newValue) {
    fetchProjects();
  }
});
watch(selectedTeamAdmin, (newValue) => {
  if (newValue !== null) {
    project.value.team = newValue.id;
  }
});
getAdminTeams();
getTeams();
</script>
