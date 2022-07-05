<!-- This table is used to show legend used in the cytoscape.js network view -->
<template>
    <v-card outlined class="legendTable" v-show="display">
        <!-- use simple table for easy css control -->
        <v-simple-table dense>
          <template v-slot:default>
            <tbody>
              <tr> <!-- Specifify node size -->
                <td class="text-left" :style="fontSize">Node size</td>
                <td class="text-left" :style="fontSize">Pathway size</td>
                <td class="text-left" :style="fontSize">0</td>
                <td class="text-left" :style="fontSize"><canvas ref='nodeSizeCanvas' class="canvas_cell" style="width: 100px; height: 40px;"></canvas></td>
                <td class="text-left" :style="fontSize">200</td>
              </tr>
              <tr> <!-- Specifify border color -->
                <td class="text-left" :style="fontSize">border color</td>
                <td class="text-left" :style="fontSize">-Log10(FDR)</td>
                <td class="text-left" :style="fontSize">0</td>
                <td class="text-left" :style="fontSize"><canvas ref='bcCanvas' class="canvas_cell" style="width: 100px; height: 40px;"></canvas></td>
                <td class="text-left" :style="fontSize">10</td>
              </tr>
              <tr> <!-- Specifify background color -->
                <td class="text-left" :style="fontSize">background</td>
                <td class="text-left" :style="fontSize">Average dev level</td>
                <td class="text-left" :style="fontSize">tDark</td>
                <td class="text-left" :style="fontSize"><canvas ref='bgCanvas' class="canvas_cell" style="width: 100px; height: 40px;"></canvas></td>
                <td class="text-left" :style="fontSize">tClin</td>
              </tr>
              <tr> <!-- Specifify edge width -->
                <td class="text-left" :style="fontSize">Edge width</td>
                <td class="text-left" :style="fontSize">-Log10(Overlap pValue)</td>
                <td class="text-left" :style="fontSize">1</td>
                <td class="text-left" :style="fontSize"><canvas ref='edgeWidthCanvas' class="canvas_cell" style="width: 100px; height: 40px;"></canvas></td>
                <td class="text-left" :style="fontSize">10</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
    </v-card>
</template>

<script>

export default {
    name: "LegendTable",
    
    props: {
        display: {
            type: Boolean,
            default: true
        }
    },

    data() {
        return {
            fontSize: "font-size: 10px",
            buffer: 8
        }
    },

    mounted() {
        this.drawNodeSize();
        this.drawBCColor();
        this.drawBgColor();
        this.drawEdgeWidth();
    },

    methods: {
        drawNodeSize() {
            let canvas = this.$refs.nodeSizeCanvas;
            let ratio = 10/50;
            this.drawSizeCanvas(ratio, canvas);
        },
        drawSizeCanvas(ratio, canvas) {
            let w = canvas.width;
            let h = canvas.height;
            let context = canvas.getContext('2d');
            // Since we have relative sizes always, draw based on this
            let min = h * ratio;
            context.beginPath();
            context.moveTo(0, h - min - 2 * this.buffer);
            context.lineTo(w, this.buffer);
            context.lineTo(w, h - this.buffer);
            context.lineTo(0, h - this.buffer);
            context.fill();
        },
        drawBCColor() {
            let canvas = this.$refs.bcCanvas;
            let w = canvas.width;
            let h = canvas.height;
            let context = canvas.getContext('2d');
            // Create color gradient
            let colors = context.createLinearGradient(0, this.buffer, w, this.buffer);
            colors.addColorStop(0.0, '#FFFF00');
            colors.addColorStop(1.0, '#0000FF');
            context.fillStyle = colors;
            context.fillRect(0, this.buffer, w, h - 2 * this.buffer);
        },
        drawBgColor() {
            // The implementation is based on this Java class:
            // https://github.com/reactome-idg/idg-pairwise-ws/blob/master/src/main/java/org/reactome/idg/pairwise/util/FourColorGradient.java
            let canvas = this.$refs.bgCanvas;
            let w = canvas.width;
            let h = canvas.height;
            let context = canvas.getContext('2d');
            // four color scheme
            let colors = context.createLinearGradient(0, this.buffer, w, this.buffer);
            colors.addColorStop(0.0, "#f44336");
            colors.addColorStop(1/3, "#ffb259");
            colors.addColorStop(2/3, "#5bc0de");
            colors.addColorStop(1.0, "#337ab7");
            context.fillStyle = colors;
            context.fillRect(0, this.buffer, w, h - 2 * this.buffer);
        },
        drawEdgeWidth() {
            let canvas = this.$refs.edgeWidthCanvas;
            let ratio = 1/10;
            this.drawSizeCanvas(ratio, canvas);
        },
    }

}
</script>

<style scoped>
    .canvas_cell {
        width: 100px;
        height: 40px;
    }
    .legendTable {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 450px;
        font-size: 80%;
    }
</style>