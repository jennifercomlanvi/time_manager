<template>
  <main class="container">
    <div class="grid">
      <div class="col">
        <p>Connectez vous à votre compte pour commencer à optimiser votre productivité Nous sommes ravis de vous avoir parmi nous !</p>
      </div>
      <div class="col">
        <form @submit.prevent="onSubmit">
          <h1>Creer un compte</h1>
          <div class="social-container">
            <a href="#" class="social"
              ><i class="pi pi-facebook" style="font-size: 2rem"></i
            ></a>
            <a href="#" class="social"
              ><i class="pi pi-google" style="font-size: 2rem"></i
            ></a>
            <a href="#" class="social"
              ><i class="pi pi-apple" style="font-size: 2rem"></i
            ></a>
          </div>
          <p>ou utiliser votre email pour inscription</p>
          <LoginAuthForm />
        </form>
      </div>
    </div>
  </main>
</template>

<script setup></script>
