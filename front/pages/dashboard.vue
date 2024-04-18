<template>
  <div class="container">
    <h1>Tableau de bord de gestion de projet</h1>
    <div class="card">
      <PMeterGroup :value="stats" labelPosition="start">
        <template #label="{ value }">
          <div class="flex flex-wrap gap-3">
            <template v-for="(stat, i) in value" :key="i">
              <PCard class="flex-1">
                <template #content>
                  <div class="flex justify-content-between gap-5">
                    <div class="flex flex-column gap-1">
                      <span class="text-secondary text-sm">{{
                        stat.label
                      }}</span>
                      <span class="font-bold text-lg">{{ stat.value }}</span>
                    </div>
                    <span
                      class="w-2rem h-2rem border-circle inline-flex justify-content-center align-items-center text-center"
                      :style="{
                        backgroundColor: `${stat.color1}`,
                        color: '#ffffff',
                      }"
                    >
                      <i :class="stat.icon" />
                    </span>
                  </div>
                </template>
              </PCard>
            </template>
          </div>
        </template>
        <template #meter="slotProps">
          <span
            :class="slotProps.class"
            :style="{
              background: `linear-gradient(to right, ${slotProps.value.color1}, ${slotProps.value.color2})`,
              width: slotProps.size,
            }"
          />
        </template>
        <template #end>
          <div class="flex justify-content-between mt-3">
            <PButton label="Gérer les tâches" outlined size="small" />
            <PButton label="Voir les projets" size="small" />
          </div>
        </template>
      </PMeterGroup>
    </div>
  </div>
</template>
<script setup>
definePageMeta({
  layout: "authenticated",
  auth: useScope().CONTROLED,
});

const stats = ref([
  {
    label: "Tâches Complétées",
    color1: "#34d399",
    color2: "#fbbf24",
    value: 75,
    icon: "pi pi-check-circle",
  },
  {
    label: "Tâches En Attente",
    color1: "#fbbf24",
    color2: "#60a5fa",
    value: 25,
    icon: "pi pi-times-circle",
  },
  {
    label: "Projets",
    color1: "#60a5fa",
    color2: "#c084fc",
    value: 2,
    icon: "pi pi-folder-open",
  },
  {
    label: "Messages",
    color1: "#c084fc",
    color2: "#c084fc",
    value: 150,
    icon: "pi pi-comments",
  },
]);
</script>
