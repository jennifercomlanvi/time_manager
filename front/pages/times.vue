<template>
  <div class="container">
    <h2>Feuille de temps hebdomadaire</h2>
    <div class="flex justify-content-between flex-wrap">
      <div>
        <PInputGroup>
          <PButton
            icon="pi pi-chevron-left"
            @click="goToPreviousWeek"
            outlined
          />
          <!-- <PCalendar showIcon v-model="date" dateFormat="DD dd MM yy" /> -->
          <PCalendar
            v-model="date"
            iconDisplay="input"
            :locale="frenchLocale"
            :maxDate="today"
            :showIcon="true"
            dateFormat="dd/mm/yy"
            showWeek
            showButtonBar
            @viewDateChange="onViewDateChange"
          />
          <PButton icon="pi pi-home" outlined />
          <PButton icon="pi pi-chevron-right" @click="goToNextWeek" outlined />
        </PInputGroup>
      </div>
      <div>
        <PButton
          icon="pi pi-stopwatch"
          severity="success"
          label="Vue quotidienne"
        />
      </div>
    </div>
    <div class="calendar-table calendar-days-row text-primary">
      <div class="cell">Lun</div>
      <div class="cell">Mar</div>
      <div class="cell">Mer</div>
      <div class="cell">Jeu</div>
      <div class="cell">Ven</div>
      <div class="cell">Sam</div>
      <div class="cell">Dim</div>
    </div>
  </div>
</template>
<script setup>
import { addDays, startOfWeek, endOfWeek } from "date-fns"; // Utilisez date-fns pour manipuler les dates

definePageMeta({
  layout: "authenticated",
  auth: useScope().CONTROLED,
});

const date = ref();

const frenchLocale = {
  firstDayOfWeek: 1,
  dayNames: [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ],
  dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
  dayNamesMin: ["D", "L", "M", "M", "J", "V", "S"],
  monthNames: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ],
  monthNamesShort: [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Jun",
    "Jul",
    "Aoû",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
  ],
  today: "Aujourd'hui",
  dateFormat: "dd/mm/yy",
  clear: "Effacer",
  weekHeader: "Sm",
};

const today = ref(new Date()); // La date d'aujourd'hui pour limiter la sélection de dates futures

// Fonctions pour la gestion de la navigation entre les semaines
const goToPreviousWeek = () => {
  date.value = startOfWeek(addDays(date.value, -7));
};

const goToNextWeek = () => {
  date.value = startOfWeek(addDays(date.value, 7));
};

const goToToday = () => {
  date.value = today.value;
};

const onViewDateChange = (event) => {
  // Fonction appelée lorsque la date visible dans le calendrier change
};

function openWeekPicker() {
  // Logique pour ouvrir un sélecteur de semaine
}

function switchToDailyView() {
  // Logique pour basculer vers la vue quotidienne
}

function addTimeEntry() {
  // Logique pour ajouter une entrée de temps
}
</script>

<style scoped>
.calendar-table {
  display: grid;
  grid-template-columns: repeat(7, minmax(2rem, 1fr));
  grid-auto-rows: 3rem;
  gap: 1px;
  background-color: rgba(0, 0, 0, 0.04);
  border: 1px solid var(--bd-defaut);
  border-radius: 0.5rem;
  margin: 1rem 0;
  padding: 2px;

  /* style commun du calendrier pour les elements sellectionnés */
  & .canceled-tmp,
  .canceled,
  .active,
  .active-tmp > div {
    font-weight: bold;
    color: rgba(0, 0, 0, 0.7);
  }

  .cell,
  .canceled,
  .canceled-tmp {
    position: relative;
  }

  /* bloc affichage jour */
  &.calendar-days-row {
    grid-auto-rows: 3rem;
  }

  /* Style des cellules */
  & .cell {
    display: grid;
    place-items: center;
    min-height: 2.5rem;
    height: 100%;
    padding: 8px;
    background-color: white;
  }
}
</style>
