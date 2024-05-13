<template>
  <svg ref="svgRef" :width :height :viewBox="computedViewBox"></svg>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';

const props = defineProps({
  width: {
    type: Number,
    default: 0,
  },
  height: {
    type: Number,
    default: 0,
  },
  data: {
    type: Array,
    default: () => [],
  },
});

const svgRef = ref();

const computedViewBox = computed(() => {
  const pixelRatio = window.devicePixelRatio;
  return `0 0 ${Math.floor(props.width * pixelRatio)} ${Math.floor(props.height * pixelRatio)}`;
});

const render = (arr) => {
  function loop(node) {
    if (!node) return null;

    const dom = document.createElementNS(
      'http://www.w3.org/2000/svg',
      node.tag || 'g',
    );
    for (const key in node.attributes) {
      dom.setAttribute(key, node.attributes[key]);
    }

    for (let i = 0; i < node?.children?.length; i++) {
      dom.appendChild(loop(node.children[i]));
    }

    return dom;
  }

  for (let i = 0; i < arr.length; i++) {
    svgRef.value?.appendChild(loop(arr[i]));
  }
};

watch(
  () => props.data,
  async (newVal) => {
    await nextTick();
    render(newVal);
  },
  {
    immediate: true,
  },
);
</script>
