<template>
  <div class="q-gutter-md" style="max-width: 700px; margin:0px auto;">
    <q-virtual-scroll :items="messages" style="height: 60vh;" separator v-slot="{ item, index }" @virtual-scroll="scroll">
      <q-item :key="index" dense>
        <q-item-section>
          <q-item-label>
            {{ item.id }}. {{ item.text }}
            <q-popup-edit v-model="item.text" auto-save v-slot="scope" @save="value => saveMessage(value, item)">
              <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
            </q-popup-edit>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-virtual-scroll>
    <q-input outlined v-model="textMessage" @keydown.enter="sendMessage" label="Сообщение" />
    <q-btn color="secondary" @click="sendMessage">Отправить</q-btn>
  </div>
</template>
<script setup>
function safeRequire(moduleName) {
  return (process.client && window.require) && window.require(moduleName)
}
const sequelizeLib = safeRequire("sequelize")
let sequelize, Message, messageCount;
const messages = ref([])
const textMessage = ref("")

onMounted(async () => {
  if (!sequelizeLib) return alert("Данная страница поддерживается только в exe версии")
  const { Sequelize, DataTypes } = sequelizeLib
  const { STRING } = DataTypes;
  sequelize = new Sequelize("onit", "root", "", {
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false
  });
  Message = sequelize.define('message', {
    text: { type: STRING, allowNull: false }
  }, {});
  sequelize.sync({ alter: true })
  messages.value = await Message.findAll()
})
async function sendMessage() {
  if (!Message) return;
  const message = await Message.create({ text: textMessage.value })
  messages.value.push(message)
  textMessage.value = ""
}
async function saveMessage(text, item) {
  if (text == "") {
    await Message.destroy({
      where: {
        id: item.id
      }
    })
    messages.value = messages.value.filter(({ id }) => id != item.id)
    return;
  }
  item.text = text;
  item.save()

}
function scroll() {

}
</script>