<template>
  <div class="box">
    <div style="position: fixed; z-index: 10">
      <input type="text" v-model.trim="logoName" @change="nameChange" />
      <label for="split">
        是否拆分
        <input
          id="split"
          type="checkbox"
          v-model="split"
          @change="splitChange"
        />
      </label>
      <label for="split">
        kerning
        <input
          id="split"
          type="checkbox"
          v-model="kerning"
          @change="kerningChange"
        />
      </label>
    </div>
    <svg ref="svgRef" width="800" height="800" viewBox="0 0 800 800"></svg>
  </div>
</template>

<script setup>
// 引入opentype.js库
import opentype from "opentype.js";
import { ref } from "vue";

const FONTSIZE = 72;

const svgRef = ref();
const logoName = ref("");
const split = ref(false);
const kerning = ref(false);

const drawPath2Svg = (font, chars, starts) => {
  console.time("draw");
  const outerGroup = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g"
  );
  outerGroup.setAttribute("transform", "translate(0 100)");

  for (let i = 0; i < chars.length; i++) {
    const path = font.getPath(chars[i], 0, 0, FONTSIZE, {
      kerning: false,
    });
    const svgPathString = path.toSVG(1); // 参数1表示缩放因子
    // 将SVG路径添加到SVG元素中
    const pathDom = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    const d = svgPathString.match(/d="(.*?)"/)[1];
    pathDom.setAttribute("d", d);
    pathDom.setAttribute("transform", `translate(${starts[i]} 0)`);
    outerGroup.appendChild(pathDom);
  }

  svgRef.value.innerHTML = "";
  svgRef.value?.appendChild(outerGroup);
  console.timeEnd("draw");
};

const getKernings = (font, chars) => {
  if (!kerning.value) {
    return new Array(chars.length - 1).fill(0);
  }

  const kernings = [];
  const glyphs = chars.map((char) => font.charToGlyph(char));

  for (let i = 1; i < glyphs.length; i++) {
    const kerning = font.getKerningValue(glyphs[i - 1], glyphs[i]);
    kernings.push(kerning);
  }

  return kernings;
};

const text2Path = (str) => {
  opentype.load("/src/assets/FiraSansMedium.woff", function (err, font) {
    if (err) {
      console.error("字体加载失败: ", err);
    } else {
      console.time("text2Path");

      const starts = [0];
      const chars = split.value ? str.split("") : [str];
      const kernings = getKernings(font, chars);

      let start = 0;
      for (let i = 0; i < chars.length - 1; i++) {
        const charWidth =
          (font.charToGlyph(chars[i]).advanceWidth * FONTSIZE) /
          font.unitsPerEm;
        console.log(charWidth);
        if (kernings[i]) {
          start += charWidth + (kernings[i] * FONTSIZE) / font.unitsPerEm;
        } else {
          start += charWidth;
        }
        starts.push(start);
      }

      drawPath2Svg(font, chars, starts);
      console.timeEnd("text2Path");
    }
  });
};

const nameChange = () => {
  if (logoName.value) {
    text2Path(logoName.value);
  }
};

const splitChange = () => {
  nameChange();
};

const kerningChange = () => {
  nameChange();
};
</script>

<style scoped>
.box {
  padding: 32px;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: start;
}
</style>
