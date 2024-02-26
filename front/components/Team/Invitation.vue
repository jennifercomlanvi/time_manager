<template>
  <form @submit.prevent="onSubmit">
    <h2>Invitez des membres</h2>
    <div>
      <div class="flex flex-column gap-2">
        <span class="p-input-icon-left">
          <i class="pi pi-envelope" />
          <PInputText
            id="input"
            v-model="invitations.email1"
            type="text"
            placeholder="Adresse mail"
            autofocus
            style="width: 100%"
          />
        </span>
      </div>
      <div class="flex flex-column gap-2 my-2">
        <span class="p-input-icon-left">
          <i class="pi pi-envelope" />
          <PInputText
            id="input"
            v-model="invitations.email2"
            type="text"
            placeholder="Adresse mail"
            autofocus
            style="width: 100%"
          />
        </span>
      </div>
      <div class="flex flex-column gap-2">
        <span class="p-input-icon-left">
          <i class="pi pi-envelope" />
          <PInputText
            id="input"
            v-model="invitations.email3"
            type="text"
            placeholder="Adresse mail"
            autofocus
            style="width: 100%"
          />
        </span>
      </div>
      <div class="flex flex-column gap-2 mt-2">
        <span class="p-input-icon-left">
          <i class="pi pi-envelope" />
          <PInputText
            id="input"
            v-model="invitations.email4"
            type="text"
            placeholder="Adresse mail"
            autofocus
            style="width: 100%"
          />
        </span>
      </div>
      <div class="flex justify-content-between my-2">
        <PButton
          class="col-4"
          rounded
          raised
          type="submit"
          severity="contrast"
          label="Inviter"
        />
        <PButton
          class="col-4"
          rounded
          text
          label="Passer"

        />
      </div>
    </div>
  </form>
</template>

<script setup>
const invitations = ref({
    email1: '',
    email2: '',
    email3: '',
    email4: '',
});
const errors = ref([]);
function onSubmit(e) {
  e.preventDefault;
}
</script>
<style scoped></style>
