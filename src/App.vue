<template>
  <div class="w-full h-full">
    <Static :width :height :data />
    <Interaction :width :height :data />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Static from './components/static.vue';
import Interaction from './components/interaction.vue';

const width = ref(0);
const height = ref(0);

const data = ref([
  {
    tag: 'circle',
    attributes: {
      cx: 450,
      cy: 50,
      r: 50,
    },
  },
  {
    children: [
      {
        tag: 'rect',
        attributes: {
          width: 100,
          height: 100,
        },
      },
      {
        children: [
          {
            tag: 'circle',
            attributes: {
              cx: 150,
              cy: 250,
              r: 50,
            },
          },
        ],
      },
    ],
  },
]);

const getSize = () => {
  width.value = document.documentElement.clientWidth;
  height.value = document.documentElement.clientHeight;
};

onMounted(() => {
  getSize();
  window.addEventListener('resize', getSize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', getSize);
});
</script>
