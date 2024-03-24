<template>
  <div class="flex flex-row justify-content-center">
    <div class="col-12 sm:col-10 md:col-5">
      <h1 class="text-primary text-center">Bienvenue sur Time Manager !</h1>
      <!-- Compte contrôlé -->
       <template v-if="authTokenStore.isControled">
        <PMessage severity="success" :closable="false">
          <p>Mes informations sont à jour.</p>
        </PMessage>

        <div class="flex justify-content-center">
          <PButton
            type="button"
            label="Poursuivre vers le site"
            @click="navigateTo({ name: 'user' }, { replace: true })"
          />
        </div>
      </template> 

      <!-- Chargement -->
       <div class="flex justify-content-center">
        <PProgressSpinner
          style="width: 50px; height: 50px"
          stroke-width="8"
          fill="var(--surface-ground)"
          animation-duration=".5s"
          aria-label="Custom ProgressSpinner"
        />
      </div>
      <!-- <ControlCheckEmailForm /> -->
      <template> 
      <!-- Erreurs -->
      <PMessage
          v-if="errorsControl.getMessage('form')"
          severity="error"
          :closable="false"
        >
          <p>{{ errorsControl.getMessage("form") }}</p>
        </PMessage> 

      <!-- Affichage des contrôles -->
       <component
          :is="getCompoName"
          class="mb-3"
          :control="control"
          @refresh="refresh"
          @error="errorsControl.init"
        />

      <!-- Actions -->
       <div class="flex justify-content-center">
          <PButton
            type="button"
            label="Déconnexion"
            severity="danger"
            icon="pi pi-power-off"
            @click="logout"
          />
        </div> 
      </template> 
    </div>
  </div>
   <div class="flex flex-row justify-content-center">
    <div class="col-12 sm:col-10 md:col-5">
      <template v-if="authTokenStore.isControled">
        <PMessage severity="success" :closable="false">
          <p>Mes informations sont à jour.</p>
        </PMessage>

        <div class="flex justify-content-center">
          <PButton
            type="button"
            label="Poursuivre vers le site"
            @click="navigateTo({ name: 'user' }, { replace: true })"
          />
        </div>
      </template>

      <div v-else-if="refreshLoading" class="flex justify-content-center">
        <PProgressSpinner
          style="width: 50px; height: 50px"
          stroke-width="8"
          fill="var(--surface-ground)"
          animation-duration=".5s"
          aria-label="Custom ProgressSpinner"
        />
      </div>

      <template v-else>
        <PMessage
          v-if="errorsControl.getMessage('form')"
          severity="error"
          :closable="false"
        >
          <p>{{ errorsControl.getMessage("form") }}</p>
        </PMessage>

        <component
          :is="getCompoName"
          class="mb-3"
          :control="control"
          @refresh="refresh"
          @error="errorsControl.init"
        />

        <div class="flex justify-content-center">
          <PButton
            type="button"
            label="Déconnexion"
            severity="danger"
            icon="pi pi-power-off"
            @click="logout"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  auth: useScope().CONNECTED,
});

// Data ------------------------------------------------------------------------

const { CONTROLED } = useScope();
const authTokenStore = useAuthTokenStore();
const errorsControl = useFormError();

const control = ref();
const refreshLoading = ref(true);

const getCompoName = computed(() => {
  switch (control.value?.type) {
    case 1:
      return resolveComponent("ControlCheckEmailForm");
    case 2:
      return resolveComponent("ControlRequest");
    case 3:
      return resolveComponent("ControlDeleteForm");
    case 4:
      return resolveComponent("ControlChangeMdpForm");
    default:
      return null;
  }
});

// // Méthode ----------------------------------------------------------------------------------------

function refresh() {
  errorsControl.reset();
  refreshLoading.value = true;
  useHttp
    .get("api/v1/user/control")
    .then((res) => {
      control.value = res;
      if (!res) {
        authTokenStore.setAuthLevel(CONTROLED);
      }
    })
    .catch((e) => {
      errorsControl.set(e);
    })
    .finally(() => {
      refreshLoading.value = false;
    });
}

function logout() {
  authTokenStore.logout();
  return navigateTo({ name: "login" }, { replace: true });
}

// // Created ----------------------------------------------------------------------------------------

refresh();
</script>
