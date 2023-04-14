<template>
  <div class="q-gutter-md" style="max-width: 700px; margin:0px auto;">
    <q-virtual-scroll
    :items="portStatuses"
    style="height: 80vh;"
    separator
    v-slot="{ item, index }"
    @virtual-scroll="scroll"
  >
    <q-item
      :key="index"
      dense
    >
      <q-item-section>
        <q-item-label>
          <div v-if="item == 0">Порт {{ index }}</div>
          <div v-else-if="item == 1">Порт {{ index }} сканируется...</div>
          <div v-else-if="item == 2" class="text-positive">Порт {{ index }} открыт</div>
          <div v-else-if="item == 3" class="text-negative">Порт {{ index }} закрыт</div>
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-virtual-scroll>
  </div>
</template>
<script setup>
useHead({title:"Прочесть порты"})
function safeRequire(moduleName){
  return (process.client && window.require) && window.require(moduleName) 
}

let net = safeRequire("net");

const portStatuses = reactive((new Array(65536)).fill(0))

function scanPort(port) {
  if(!net) return portStatuses[port] = 0;
  portStatuses[port] = 1;
  const server = net.createServer();

  server.listen(port, 'localhost');

  server.on('listening', function () {
    portStatuses[port] = 2;
    server.close();
  });

  server.on('error', function () {
    portStatuses[port] = 3;
    server.close();
  });
}

function scroll({index}){
  for(let port = index; port < Math.min(index + 25, portStatuses.length); port +=1){
    if(!portStatuses[port]) scanPort(port);
  }
}

</script>