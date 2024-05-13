<template>
  <canvas
    ref="canvasRef"
    class="block absolute top-0 left-0 w-full h-full"
    :width="computedWidth"
    :height="computedHeight"
    @mousemove="onMousemove"
  ></canvas>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';

const props = defineProps({
  width: {
    type: Number,
    default: 0,
  },
  height: {
    type: Number,
    default: 0,
  },
});

const canvasRef = ref();

const computedWidth = computed(() => {
  const scale = window.devicePixelRatio;
  return Math.floor(props.width * scale);
});

const computedHeight = computed(() => {
  const scale = window.devicePixelRatio;
  return Math.floor(props.height * scale);
});

const computedCanvasSizeInfo = computed(() => {
  if (canvasRef.value) {
    return canvasRef.value.getBoundingClientRect();
  }
  return {};
});

const onMousemove = (e) => {
  if (!canvasRef?.value) return;

  console.log({
    x:
      (e.pageX - (computedCanvasSizeInfo.value.left || 0)) *
      (canvasRef.value.getAttribute('width') /
        computedCanvasSizeInfo.value.width),
    y:
      (e.pageY - (computedCanvasSizeInfo.value.top || 0)) *
      (canvasRef.value.getAttribute('height') /
        computedCanvasSizeInfo.value.height),
  });
};

const initCanvasScale = () => {
  if (canvasRef.value) {
    const scale = window.devicePixelRatio;
    const ctx = canvasRef.value.getContext('2d');
    ctx.scale(scale, scale);
  }
};

onMounted(() => {
  initCanvasScale();
});
</script>
