<template>
  <PCard style="width: 35rem; overflow: hidden">
    <template #title> Création de votre premiere équipe</template>
    <template #content>
      <form @submit.prevent="onSubmit">
        <div>
          <div class="flex flex-column gap-2">
            <PIconField iconPosition="left">
              <PInputIcon class="pi pi-users"> </PInputIcon>
              <PInputText
                id="input"
                v-model="team.name"
                type="text"
                placeholder="Nom de l'équipe"
                autofocus
                style="width: 100%"
            /></PIconField>
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
  </PCard>
</template>

<script setup>
// const router = useRouter();
// const route = useRoute();
const loading = ref(false)
const team = ref({
  name: "",
  description: ""
});
const emits = defineEmits(['teamCreated']);

function onSubmit() {
  useHttp
    .post("/api/v1/team", team.value)
    .then((res) => {
      console.log(res)
      emits('teamCreated', res.data);
    })
    .catch((e) => {
      console.log(e);
    })
    .finally(() => {
      loading.value = false;
    });
}
  // team.value.error = "";
  // team.value.errors = {};

  // if (team.value.name.trim().length === 0) {
  //   team.value.errors.name = "Le nom est requis";
  // }
</script>
