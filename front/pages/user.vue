<template>
  <div class="container">
    <div class="card">
      <PTabMenu :model="items" v-model:activeIndex="active" />
    </div>
    <PProgressSpinner
      v-if="loading"
      style="width: 50px; height: 50px"
      strokeWidth="8"
      fill="var(--surface-ground)"
      animationDuration=".5s"
      aria-label="Custom ProgressSpinner"
    />
    <!-- Détail du profil -->
    <div v-show="active === 0">
      <h2>Détail du profil</h2>
      <form @submit.prevent="onChangeInfo">
        <div class="grid">
          <div class="col">
            <div class="field">
              <label for="profile-name">Nom :</label>
              <PInputText
                id="profile-name"
                v-model="data.name"
                type="text"
                class="surface-boder w-full"
              />
            </div>
            <div class="field">
              <label for="profile-description">Description :</label>
              <PTextarea
                id="profile-description"
                rows="5"
                cols="30"
                placeholder="Description du profil"
                v-model="data.description"
                type="email"
                style="width: 100%"
              />
            </div>
          </div>
          <div class="col">
            <!-- <div class="card pt-4">
              <PFileUpload
                name="demo[]"
                url="/api/upload"
                :multiple="false"
                accept="image/*"
                :maxFileSize="1000000"
                chooseLabel="Choisir"
                uploadLabel="Télécharger"
                cancelLabel="Annuler"
              >
                <template #empty>
                  <p>Choisir une image maximum 30MB</p>
                </template>
              </PFileUpload>
            </div> -->
          </div>
        </div>
        <PButton
          type="submit"
          severity="contrast"
          label="Enregistrer les modifications"
        />
      </form>
    </div>
    <!-- Email -->
    <div v-show="active === 1">
      <h2>Email</h2>
      <form @submit.prevent="onChangeEmail">
        <div class="col-6">
          <div class="field">
            <label for="current-email">Adresse mail actuelle :</label>
            <PInputText
              id="current-email"
              v-model="data.email"
              type="text"
              class="surface-boder w-full"
            />
          </div>
          <div class="field">
            <label for="new-email">Nouvelle adresse mail:</label>
            <PInputText
              id="new-email"
              v-model="email"
              type="text"
              class="surface-boder w-full"
            />
          </div>
        </div>
        <PButton
          type="submit"
          severity="contrast"
          label="Enregistrer les modifications"
          class="ml-2"
        />
      </form>
    </div>
    <!-- Mot de passe -->
    <div v-show="active === 2">
      <h2>Changer de mot de passe</h2>
      <form @submit.prevent="onChangePassword">
        <div class="flex flex-column gap-2">
          <label for="password">Nouveau mot de passe :</label>
          <PPassword
            id="password"
            name="password"
            class="mt-2"
            v-model="form.password"
            :input-style="{ width: '100%' }"
            placeholder="Mot de passe"
            toggle-mask
            :feedback="false"
          />
        </div>
        <div class="flex flex-column gap-2 mt-2">
          <label for="confirm-password">Confirmer le mot de passe :</label>
          <PPassword
            id="confirm-password"
            name="confirm-password"
            class="mt-2"
            v-model="form.confirmPassword"
            :input-style="{ width: '100%' }"
            placeholder="Confirmer le mot de passe"
            toggle-mask
            :feedback="false"
          />
        </div>
        <PButton
          type="submit"
          severity="contrast"
          label="Changer le mot de passe"
          class="mt-4"
          :disabled="
            form.password !== form.confirmPassword || form.password === ''
          "
        />
        <!-- Ajouter un message d'erreur si nécessaire -->
        <div
          v-if="
            form.password !== form.confirmPassword &&
            form.confirmPassword !== ''
          "
          class="text-error mt-2"
        >
          Les mots de passe ne correspondent pas.
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "authenticated",
  auth: useScope().CONTROLED,
});
const active = ref(0);
const loading = ref(true);
const data = ref({
  uuid: "",
  name: "",
  email: "",
  description: "",
  avatar: null,
});
const email = ref("");
const form = ref({
  password: "",
  confirmPassword: "",
});
const items = ref([
  { label: "Général", icon: "pi pi-home" },
  { label: "Email", icon: "pi pi-envelope" },
  { label: "Mot de passe", icon: "pi pi-key" },
]);

useHttp
  .get("/api/v1/user/profile")
  .then((res) => {
    data.value = res;
  })
  .catch((e) => {
    console.log(e);
  })
  .finally(() => {
    loading.value = false;
  });

const onChangeInfo = () => {
  useHttp
    .put(`/api/v1/user/${data.value.uuid}`, {
      name: data.value.name,
      description: data.value.description,
    })
    .then((res) => {
      data.value.name = res.name;
      data.value.description = res.description;
    })
    .catch((e) => {
      console.log(e);
    })
    .finally(() => {
      loading.value = false;
    });
};
const onChangeEmail = () => {
  // Implémenter la logique de mise à jour de l'email
};

const onChangePassword = () => {
  if (form.password === form.confirmPassword) {
    console.log("Changement de mot de passe effectué pour:", form.password);
    form.password = "";
    form.confirmPassword = "";
  } else {
    console.log("Les mots de passe ne correspondent pas");
  }
};
</script>
