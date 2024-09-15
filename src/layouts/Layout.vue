<template>
  <q-layout view="hHh Lpr lff">
    <router-view name="header" />
    <router-view name="sidebar" />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'Layout'
}
</script>
