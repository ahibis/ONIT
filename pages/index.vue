<template>
  <div class="q-pa-lg">

    <div class="q-gutter-md" style="max-width: 500px; margin:0px auto;">
      <q-file outlined v-model="file" label="Файл для шифрования / расшифрования">
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template>
      </q-file>
      <q-select v-model="cryptoOptions.mode" :options="modes" label="Что сделать с файлом" />
      <q-select v-model="cryptoOptions.method" :options="methods" label="Метод шифрования" />
      <q-input outlined v-model="cryptoOptions.password" label="Ключ шифрования" />
      <q-btn color="secondary" @click="encrypt">{{ cryptoOptions.mode }}</q-btn>
      <div class="text-h6 text-negative">{{ error }}</div>
    </div>
  </div>
</template>
<script setup>
import CryptoJS from 'crypto-js';

useHead({title:"Шифрование файлов"})

const file = ref()
const cryptoOptions = reactive({
  mode: "Зашифровать",
  method: "DES",
  password: ""
})

const modes = ["Зашифровать", "Расшифровать"]
const methods = ["DES", "AES"]
const error = ref("")

function fileDownload(text, fileName, type) {
  const file = new Blob([text], { type })

  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(file),
    download: fileName
  })
  a.click()
}
function showError(text) {
  error.value = text
}
const cryptoFunctions = {
  Зашифровать: {
    DES: CryptoJS.DES.encrypt,
    AES: CryptoJS.AES.encrypt
  },
  Расшифровать: {
    DES: CryptoJS.DES.decrypt,
    AES: CryptoJS.AES.decrypt
  }
}
async function encrypt() {
  error.value = ""
  const File = file.value
  const { password, mode, method } = cryptoOptions
  if (!File) return showError("Вы не выбрали файл");
  if (!password) return showError("ключ шифрования не может быть пустым");
  const { name: filename, type } = File
  const text = await File.text()
  const encrypted = cryptoFunctions[mode][method](text, password)
  const encryptedText = mode == "Зашифровать" ? 
    encrypted.toString() : 
    encrypted.toString(CryptoJS.enc.Utf8)
  console.log(File)
  fileDownload(encryptedText, filename, type)
}

</script>