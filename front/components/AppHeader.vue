<template>
  <nav class="container">
    <ul>
      <li><strong>Time Manager</strong></li>
    </ul>
    <ul>
      <li>
        <NuxtLink to="/">Home</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/about">About</NuxtLink>
      </li>
      <!-- <li v-if="!session.token"> -->
      <li>
        <NuxtLink to="/login">Connexion</NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script setup>
// const session = useAuthTokenStore();
</script>
