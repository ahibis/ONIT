<template>
  <div>
    <q-layout view="lHh Lpr lFf" class="bg-white">
      <q-header elevated>
        <q-toolbar>
          <q-toolbar-title>{{ title }}</q-toolbar-title>
        </q-toolbar>
        <q-tabs v-model="tab">
          <q-tab v-for="(page, index) in pages" :name="page.name" :label="page.name" @click="goToPage(page.path)" />
        </q-tabs>
      </q-header>

      <q-page-container>
        <NuxtPage />
      </q-page-container>
    </q-layout>

  </div>
</template>

<script setup>
const route = useRoute()


const pages = [
  { name: 'Шифрование файлов', path: '/' },
  { name: 'Прочесть порты', path: '/readPorts' },
  { name: 'БД управление', path: '/bdToExcel' }
]
const title = computed(()=>pages
  .find(({path})=>path == route.path).name)

const tab = ref("Главная")
const router = useRouter()

function goToPage(path) {
  router.push(path)
}
</script>