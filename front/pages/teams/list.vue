<template>
  <div class="container">
    <div class="card">
      <PMessage v-if="!loading && teams.length === 0" :closable="false"
        >Vous n'êtes actuellement assigné à aucune équipe. Contactez votre
        administrateur pour plus de détails, être ajouté à une équipe existante,
        ou créez votre propre équipe dès maintenant !</PMessage
      >
      <PToolbar class="mb-4">
        <template #start>
          <PButton
            label="Ajouter une équipe"
            icon="pi pi-plus"
            severity="success"
            class="mr-2"
            @click="openNew"
          />
        </template>
      </PToolbar>
      <PProgressSpinner
        v-if="loading"
        style="width: 50px; height: 50px"
        strokeWidth="8"
        fill="var(--surface-ground)"
        animationDuration=".5s"
        aria-label="Custom ProgressSpinner"
      />
      <PDataTable
        v-if="!loading && teams.length > 0"
        v-model:expandedRows="expandedRows"
        :value="teams"
        dataKey="team_id"
      >
        <template #header>
          <div class="flex flex-wrap justify-content-end gap-2">
            <PButton
              text
              icon="pi pi-plus"
              label="Tout étendre"
              @click="expandAll"
            />
            <PButton
              text
              icon="pi pi-minus"
              label="Tout réduire"
              @click="collapseAll"
            />
          </div>
        </template>
        <PColumn expander />
        <PColumn field="team_name" header="Equipe"></PColumn>
        <PColumn field="team_description" header="Description"></PColumn>
        <PColumn>
          <template #body="slotProps">
            <PButton
              v-if="isUserAdmin(slotProps.data)"
              icon="pi pi-pencil"
              @click="editTeam(slotProps.data)"
              rounded
            />
          </template>
        </PColumn>
        <template #expansion="slotProps">
          <div class="p-3">
            <PDataTable :value="slotProps.data.Users">
              <template #header>
                <PButton
                  v-if="isUserAdmin(slotProps.data)"
                  icon="pi pi-user-plus"
                  @click="inviteMember"
                />
              </template>
              <PColumn field="user_name" header="Nom"></PColumn>
              <PColumn field="user_email" header="Email"></PColumn>
              <PColumn field="permission" header="Role">
                <template #body="slotProps">
                  <PTag
                    :value="getRole(slotProps.data.permission)"
                    :severity="getSeverity(slotProps.data.permission)"
                  />
                </template>
              </PColumn>
              <PColumn v-if="isUserAdmin(slotProps.data)">
                <template #body="userSlotProps">
                  <PButton
                    icon="pi pi-eye"
                    @click="viewMemberInfo(userSlotProps.data)"
                    severity="info"
                    rounded
                    text
                  />
                  <PButton
                    icon="pi pi-pencil"
                    @click="
                      editMember(userSlotProps.data, slotProps.data.team_id)
                    "
                    rounded
                    severity="success"
                    text
                  />
                  <PButton
                    icon="pi pi-trash"
                    @click="
                      deleteMember(userSlotProps.data, slotProps.data.team_id)
                    "
                    severity="danger"
                    rounded
                    text
                  />
                </template>
              </PColumn>
            </PDataTable>
          </div>
        </template>
      </PDataTable>
    </div>
    <PDialog
      v-model:visible="open"
      :style="{ width: '450px' }"
      header="Ajouter une équipe"
      :modal="true"
      class="p-fluid"
    >
      <div class="field">
        <label for="name">Nom :</label>
        <PInputText
          id="name"
          v-model.trim="team.name"
          required="true"
          autofocus
        />
        <!-- <PInputText id="name" v-model.trim="team.name" required="true" autofocus :invalid="submitted && !product.name" /> -->
        <!-- <small class="p-error" v-if="submitted && !product.name">Name is required.</small> -->
      </div>
      <div class="field">
        <label for="description">Description :</label>
        <PTextarea
          id="description"
          v-model="team.description"
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
          @click="open = false"
        />
        <PButton label="Valider" icon="pi pi-check" @click="saveTeam" />
      </template>
    </PDialog>
  </div>
</template>
<script setup>
import { ref } from "vue";

definePageMeta({
  layout: "authenticated",
  auth: useScope().CONTROLED,
});
const userId = ref(null);
const expandedRows = ref({});

const expandAll = () => {
  expandedRows.value = teams.value.reduce(
    (acc, team) => ({ ...acc, [team.team_id]: true }),
    {},
  );
};
const collapseAll = () => {
  expandedRows.value = null;
};
const loading = ref(true);
const teams = ref([]);
const open = ref(false);

const team = ref({
  name: null,
  description: null,
});

const openNew = () => {
  team.value.name = null;
  team.value.description = null;
  // submitted.value = false;
  open.value = true;
};

function isUserAdmin(team) {
  return team.Users.some(
    (u) => u.user_id === userId.value && u.permission === 1,
  );
}

function getTeams() {
  loading.value = true;
  useHttp
    .get("/api/v1/teams/user")
    .then((res) => {
      teams.value = res.teams;
      userId.value = res.user;
    })
    .catch((e) => {
      console.log(e);
    })
    .finally(() => {
      loading.value = false;
    });
}
const getRole = (permission) => {
  const roleMap = {
    1: "Administrateur",
    2: "Membre",
  };
  return roleMap[permission] || "Inconnu";
};

const getSeverity = (permission) => {
  const severityMap = {
    1: "success", // Pour l'admin
    2: "info", // Pour le membre
  };
  return severityMap[permission] || "neutral";
};

const inviteMember = () => {
  // Logique pour inviter un membre
};

const editMember = (user, team) => {
  console.log("edit", user.user_id, "from team", team);
};
const deleteMember = (user, team) => {
  console.log("delete", user.user_id, "from team", team);
};

const viewMemberInfo = (user) => {
  console.log("Viewing info for user", user.user_id);
};

const editTeam = (team) => {
  console.log("from team", team);
};

function saveTeam() {
  if (team.value.name !== null) {
    useHttp
      .post("/api/v1/team", team.value)
      .then((res) => {
        console.log(res);
        open.value = false;
        getTeams();
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        loading.value = false;
      });
  }
}
getTeams();
</script>
<style scoped></style>
