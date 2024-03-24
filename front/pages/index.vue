<template>
  <main class="container">
    <div class="card">
      <PMegaMenu :model="items" class="p-3 surface-0 fixed-menu">
        <template #start>
          <img src="../assets/img/logo.png" alt="image" style="width: 125px" />
        </template>
        <template #item="{ item }">
          <a
            v-ripple
            class="flex align-items-center cursor-pointer px-3 py-2 overflow-hidden relative font-semibold text-lg uppercase"
            style="border-radius: 2rem"
            @click="item.command"
          >
            <span :class="item.icon" />
            <span class="ml-2">{{ item.label }}</span>
          </a>
        </template>
        <template #end>
          <PButton
            label="Connexion"
            plain
            text
            @click="navigateTo({ name: 'login' })"
          />
          <PButton
            label="Inscription"
            severity="contrast"
            rounded
            @click="navigateTo({ name: 'register' })"
          />
        </template>
      </PMegaMenu>
    </div>
    <div class="grid grid-nogutter surface-section text-800">
      <div
        class="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center"
      >
        <section>
          <span class="block text-6xl font-bold mb-1">Gérez votre temps,</span>
          <div class="text-6xl text-primary font-bold mb-3">
            optimisez vos projets.
          </div>
          <p class="mt-0 mb-4 text-700 line-height-3">
            Trouvez l'équilibre parfait entre efficacité et succès. Simplifiez
            votre gestion du temps pour des projets réussis. Avec notre
            application, optimisez chaque aspect de votre travail pour des
            résultats qui dépassent vos attentes.
          </p>

          <PButton
            label="Commencer"
            type="button"
            rounded
            class="mr-3 p-button-raised"
            @click="navigateTo({ name: 'login' })"
          />
        </section>
      </div>
      <div class="col-12 md:col-6 overflow-hidden">
        <img
          src="../assets/img/image.png"
          alt="Image"
          class="md:ml-auto block md:h-full"
          style="clip-path: polygon(8% 0, 100% 0%, 100% 100%, 0 100%)"
        />
      </div>
    </div>
    <!-- Contenu de la section fonctionnalités -->
    <div
      id="fonctionnalites"
      class="surface-section px-4 py-8 md:px-6 lg:px-8 text-center"
    >
      <div class="mb-3 font-bold text-3xl">
        <span class="text-900">Un produit, </span>
        <span class="text-primary">plusieurs fonctionnalités</span>
      </div>
      <div class="text-700 mb-6">
        Gérez vos projets et améliorez votre productivité avec Time Manager.
        Transformez la gestion du temps en une expérience simple, efficace et
        collaborative. Soyez maître de votre temps, aujourd'hui et demain.
      </div>
      <div class="grid">
        <div class="col-12 md:col-4 mb-4 px-5">
          <span
            class="p-3 shadow-2 mb-3 inline-block surface-card"
            style="border-radius: 10px"
          >
            <i class="pi pi-clock text-4xl text-primary"></i>
          </span>
          <div class="text-900 text-xl mb-3 font-medium">Suivi du Temps</div>
          <span class="text-700 line-height-3"
            >Suivez avec précision le temps passé sur chaque projet grâce à nos
            outils de chronométrage facile à utiliser et nos tableaux de bord
            informatifs.</span
          >
        </div>
        <div class="col-12 md:col-4 mb-4 px-5">
          <span
            class="p-3 shadow-2 mb-3 inline-block surface-card"
            style="border-radius: 10px"
          >
            <i class="pi pi-users text-4xl text-primary"></i>
          </span>
          <div class="text-900 text-xl mb-3 font-medium">
            Gestion d'équipe collaborative
          </div>
          <span class="text-700 line-height-3"
            >Gérez les équipes, définissez les rôles et répartissez les tâches
            pour une collaboration simplifiée et productive.</span
          >
        </div>
        <div class="col-12 md:col-4 md:mb-4 mb-0 px-3">
          <span
            class="p-3 shadow-2 mb-3 inline-block surface-card"
            style="border-radius: 10px"
          >
            <i class="pi pi-shield text-4xl text-primary"></i>
          </span>
          <div class="text-900 text-xl mb-3 font-medium">Accès sécurisé</div>
          <span class="text-700 line-height-3">
            Gérez les accès avec un contrôle précis des permissions pour assurer
            la sécurité des données.</span
          >
        </div>
        <div class="col-12 md:col-4 mb-4 px-5">
          <span
            class="p-3 shadow-2 mb-3 inline-block surface-card"
            style="border-radius: 10px"
          >
            <i class="pi pi-check-circle text-4xl text-primary"></i>
          </span>
          <div class="text-900 text-xl mb-3 font-medium">Facile à Utiliser</div>
          <span class="text-700 line-height-3"
            >Avec une interface intuitive, commencez à gérer votre temps
            efficacement dès le premier jour, sans aucune complication.</span
          >
        </div>
        <div class="col-12 md:col-4 mb-4 px-5">
          <span
            class="p-3 shadow-2 mb-3 inline-block surface-card"
            style="border-radius: 10px"
          >
            <i class="pi pi-box text-4xl text-primary"></i>
          </span>
          <div class="text-900 text-xl mb-3 font-medium">
            Installation Simple avec Docker
          </div>
          <span class="text-700 line-height-3"
            >Installez facilement notre app sur diverses plateformes avec
            Docker, sans tracas de compatibilité ou dépendances</span
          >
        </div>
        <div class="col-12 md:col-4 mb-4 px-5">
          <span
            class="p-3 shadow-2 mb-3 inline-block surface-card"
            style="border-radius: 10px"
          >
            <i class="pi pi-github text-4xl text-primary"></i>
          </span>
          <div class="text-900 text-xl mb-3 font-medium">Open Source</div>
          <span class="text-700 line-height-3"
            >Bénéficiez d'une application modifiable et améliorable par tous
            grâce à son code ouvert à la communauté de développeurs.
          </span>
        </div>
      </div>
    </div>
    <div id="documentation">
      <!-- Contenu de la section Documentation -->
      <div class="surface-section px-4 py-8 md:px-6 lg:px-8">
        <div class="text-700 text-center">
          <div class="text-primary font-bold mb-3 text-3xl">Documentation</div>
          <div class="text-900 font-bold text-3xl mb-3">
            Plongez au cœur de "Time Manager" avec notre documentation complète.
          </div>
          <div class="text-700 mb-5">
            Que vous souhaitiez intégrer l'application à votre workflow,
            contribuer au code ou simplement découvrir comment tout fonctionne,
            notre documentation détaillée est là pour vous guider. Accessible,
            structurée et régulièrement mise à jour, elle vous fournira toutes
            les informations nécessaires pour maîtriser l'outil et tirer le
            meilleur parti de ses fonctionnalités. plus simple
          </div>
          <PButton
            label="Documentation API"
            icon="pi pi-book"
            class="font-bold px-5 py-3 p-button-raised p-button-rounded white-space-nowrap"
          />
        </div>
      </div>
    </div>

    <div id="contact">
      <!-- Contenu de la section Contact -->
      <div id="contact" class="surface-section px-4 py-8 md:px-6 lg:px-8">
        <div class="text-center mb-8">
          <div class="text-primary font-bold mb-3 text-3xl">Contactez-nous</div>
          <p class="text-700">
            Vous avez des questions, des suggestions, ou souhaitez simplement
            nous dire bonjour ? Remplissez le formulaire ci-dessous ou
            contactez-nous via nos canaux disponibles.
          </p>
        </div>

        <div class="grid">
          <div class="col-12 md:col-6 flex align-items-center justify-content-center">
            <img
              src="../assets/img/contact3.jpg"
              alt="Contactez-nous"
              class="md:ml-auto block"
              style="max-width: 100%; height: auto"
            />
          </div>
          <div class="col-12 md:col-6 mt-8">
            <form @submit.prevent="sendContactForm">
              <div class="p-fluid">
                <div class="field">
                  <label for="name">Nom :</label>
                  <PInputText
                    id="name"
                    v-model="contact.name"
                    variant="filled"
                    required
                  />
                </div>
                <div class="field">
                  <label for="email">Email :</label>
                  <PInputText
                    id="email"
                    type="email"
                    v-model="contact.email"
                    variant="filled"
                    required
                  />
                </div>
                <div class="field">
                  <label for="name">Sujet :</label>
                  <PInputText
                    id="name"
                    v-model="contact.sujet"
                    variant="filled"
                    required
                  />
                </div>
                <div class="field">
                  <label for="message">Message :</label>
                  <PTextarea
                    id="message"
                    rows="4"
                    v-model="contact.message"
                    variant="filled"
                    required
                  />
                </div>
                <PButton
                  label="Envoyer"
                  type="submit"
                  raised
                  rounded
                  class="mt-2 primary-100"
                />
              </div>
            </form>
            <div class="text-center mt-2">
              <p class="font-bold text-1xl">
                Ou suivez-nous sur nos réseaux sociaux :
              </p>
              <!-- Icônes des réseaux sociaux ici -->
              <div class="flex flex-wrap justify-content-center gap-3 mb-4">
                <PButton
                  icon="pi pi-facebook"
                  style="color: #3b5998"
                  text
                  raised
                  rounded
                  aria-label="Facebook"
                />
                <PButton
                  icon="pi pi-instagram"
                  style="color: #e4405f"
                  text
                  raised
                  rounded
                  aria-label="Instagram"
                />
                <PButton
                  icon="pi pi-twitter"
                  style="color: #1da1f2"
                  text
                  raised
                  rounded
                  aria-label="Twitter"
                />
                <PButton
                  icon="pi pi-github"
                  style="color: #333"
                  text
                  raised
                  rounded
                  aria-label="GitHub"
                />
                <PButton
                  icon="pi pi-linkedin"
                  style="color: #0077b5"
                  text
                  raised
                  rounded
                  aria-label="LinkedIn"
                />
                <PButton
                  icon="pi pi-youtube"
                  style="color: #bd081c"
                  text
                  raised
                  rounded
                  aria-label="YouTube"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup>
const items = ref([
  {
    label: "Fonctionnalités",
    id: "fonctionnalites",
    command: () => {
      scrollToSection("fonctionnalites");
    },
  },
  {
    label: "Documentation",
    id: "documentation",
    command: () => {
      scrollToSection("documentation");
    },
  },
  {
    label: "Contact",
    id: "contact",
    command: () => {
      scrollToSection("contact");
    },
  },
]);

const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};

const contact = reactive({
  name: "",
  email: "",
  sujet: "",
  message: "",
});

function sendContactForm() {}
</script>
