<template>
  <form @submit.prevent="onSubmit">
    <h2>Création de votre premiere équipe</h2>
    <div>
      <div class="flex flex-column gap-2">
        <span class="p-input-icon-left">
          <i class="pi pi-users" />
          <PInputText
            id="input"
            v-model="team.name"
            type="text"
            placeholder="Nom de l'équipe"
            autofocus
            style="width: 100%"
          />
        </span>
      </div>
      <div class="flex flex-column gap-2 mt-2">
        <PTextarea
          rows="5"
          cols="30"
          placeholder="Description de l'équipe"
          v-model="team.description"
          type="email"
          style="width: 100%"
        />
        <!-- <small v-if="form.errors.description">{{ form.errors.description }}</small> -->
      </div>
      <div class="flex justify-content-end my-2">
        <PButton
          class="col-4"
          rounded
          raised
          type="submit"
          severity="contrast"
          label="Enregistrer"
        />
      </div>
    </div>
  </form>
</template>

<script setup>
// const router = useRouter();
// const route = useRoute();

const team = ref({
  name: "",
  description: "",
  error: "",
  errors: {},
});

function onSubmit(e) {
  e.preventDefault;

  team.value.error = "";
  team.value.errors = {};

  if (team.value.name.trim().length === 0) {
    team.value.errors.name = "Le nom est requis";
  }
}
</script>
