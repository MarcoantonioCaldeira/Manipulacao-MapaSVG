<template>

  <header id="topo">
    <img class="logo"  src="../assets/img/logo.png" /> 
  </header>
  <main id="corpo">
    <div v-if="!svgContent">
      <label for="btn-select-image">Selecionar o Mapa</label>
      <input id="btn-select-image" type="file" placeholder="Selecione a Imagem" @change="handleFileUpload" accept=".svg" />
    </div>
  
    <div class="svg-container" v-if="svgContent" @click="handleSvgClick($event)">
      <i @click="Fechar_Janela" id="fa-solid-li"  class="fa-solid fa-circle-xmark"></i>
      <div v-html="svgContent"></div>
    </div>

    <div class="modal" v-if="open_info">
      <div id="Informacao_loteamento">
        <i @click="clearInput"  id="fa-solid-li"  class="fa-solid fa-circle-xmark"></i>    
        <p>Informações do loteamento</p>

        <input type="text" placeholder="Empreendimento" v-model="empreendimento">
        <input type="text" placeholder="Quandra" v-model="quandra">
        <input type="text" placeholder="Lote" v-model="lote">

        <button @click="Aparecer_Resumo">Salvar</button>
      </div>
    </div>

    <div class="zoom-buttons" v-if="svgContent" ref="zoomButtons">
      <button  class="btn_zoom" @click="Aumentar_Imagem">
        <font-awesome-icon :icon="['fas', 'plus']" />
      </button>

      <button class="btn_zoom" @click="Diminuir_Imagem">
        <font-awesome-icon :icon="['fas', 'minus']" />
      </button>
    </div>

  </main>
  <div  id="resumo" v-if="mostrar_resumo" ref="resumo">
    <h2>Detalhes do lotes</h2>

    <div  v-if="open_resumo">
      <div v-for="resumo in resumos" :key="resumo.id && index" class="objeto_resumo" ref="objeto_resumo">
        <i @click="Fechar_Resumo(index)" id="fa-solid-li" class="fa-solid fa-circle-xmark"></i>
        <p>Empreedimento: {{ resumo.empreendimento }}</p>
        <p>Quadra: {{ resumo.quandra }}</p>
        <p>Lote: {{ resumo.lote }}</p>
      
         <!-- Exiba o ícone de localização se showLocationIcon for true -->
        <font-awesome-icon v-if="resumo.showLocationIcon" :icon="['fas', 'map-marker']" class="location-icon" />
      </div>
    </div>
    
  </div>
  <div id="footer" ref="footer">
    <FooterComponent/>
  </div>

</template>

<script>
import '@fortawesome/fontawesome-free/css/all.css';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import FooterComponent from './Footer.vue';
import api from './api';


export default {
  
  name:'HalloWord',
  components:{
    FooterComponent,
    FontAwesomeIcon
  },
  data() {
    return {
      selectedImage: null,
      svgContent: null,
      open_info:false,
      showModal: false,
      mostrar_resumo:false,
      empreendimento:'',
      quandra:'',
      lote:'',
      loteamentoAtual: null,
      resumos: [],
      open_resumo: true,
      showLocationIcon: null,
      iconeLocation: false,
      nivel_zoon:1,
      mostrar_button_zoom: true,
      codigoEmpreendimento: "14"
    };
  },

  mounted() {
    window.addEventListener('scroll', this.Finalizar_Scroll);
  },

  beforeUnmount() {
    window.removeEventListener('scroll', this.Finalizar_Scroll);
  },

  methods: {

    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.svgContent = e.target.result;
        };
        reader.readAsText(file);
      }
    },

    handleSvgClick(event) {
      const obj = event.target;

      if ((obj.tagName === 'rect' || obj.tagName === 'path' || obj.tagName === 'polygon') && obj.classList.contains('lote')) {
        let parent = obj.parentElement;

        while (parent && parent.tagName !== 'g') {
          parent = parent.parentElement;
        }

        if (parent) {
          const loteamentoId = parent.getAttribute('id');
          console.log('ID do loteamento:', loteamentoId);

          this.PegarDadosMapa(loteamentoId).then(imovel => {
            console.log('Dados do imovel:', imovel);

            if (imovel) {
              this.loteamentoAtual = {
                id: loteamentoId,
                empreendimento: imovel.nome_usuario,
                quadra: imovel.cod_area,
                lote: imovel.cod_imovel,
              };

              this.open_info = true;
            } else {
              console.log('Loteamento não encontrado');
            }
          });
        }
      } else {
        this.open_info = false;
      }
    },


    clearInput(){
      this.open_info = false
    },

    Fechar_Janela(){
      this.svgContent = false;
    },

    Aparecer_Resumo() {
      this.mostrar_resumo = true;
      this.open_info = false;
      const loteId = this.loteamentoAtual.id; 
      const loteSvg = document.getElementById(loteId); 
      if (loteSvg){
        loteSvg.setAttribute('fill', '#b3a632'); 
      }
      this.resumos.push(this.loteamentoAtual);
    },


    Fechar_Resumo(index){
      this.resumos.splice(index, 1);
    },

    Aumentar_Imagem(){
      this.nivel_zoon += 0.1;
      this.Atualizar_Zoom();
    },

    Diminuir_Imagem(){
      this.nivel_zoon -= 0.1;
      this.Atualizar_Zoom();
    },

    Atualizar_Zoom(){
      const imagem = document.getElementById('map');
      if(imagem){
        imagem.style.transform = `scale(${this.nivel_zoon})`;
      }
    },

    Finalizar_Scroll(){
      if( this.mostrar_button_zoom){
        const resumo = this.$refs.resumo; // Usando a ref para obter a div com id "footer"
          
        if(resumo){
          const rect = resumo.getBoundingClientRect();
          const zoomButtons = this.$refs.zoomButtons;

          if (rect.top < window.innerHeight && rect.bottom >= 0) {
            
            if(zoomButtons){ //Verifica se a div zoomButtons esta disponivel
              zoomButtons.style.display = 'none'; 
            } 
          }else if(rect.top > window.innerHeight && rect.bottom >= 0){

            if(zoomButtons){
              zoomButtons.style.display = 'block';
            }
          }
        }
      }
    },

    async PegarDadosMapa(loteamentoId) {
      try {
        const response = await api.get(`/imoveis/${this.codigoEmpreendimento}/${loteamentoId}/0`);
        if (response.status === 200) {
          const loteamento = response.data;

          if (loteamento) {
            this.loteamentoAtual = {
              id: loteamentoId,
              empreendimento: loteamento.nome_usuario,
              quadra: loteamento.cod_area,
              lote: loteamento.cod_imovel,
            };

            this.open_info = true;
            console.log('Dados do loteamento:', loteamento);

          } else {

            console.log('Loteamento não encontrado');
          }
        } else {

          console.error('Erro ao buscar loteamento:', response.statusText);
        }

      } catch (error) {

        console.error('Erro ao buscar loteamento:', error);
      }
    }



  }
};
</script>


<style src="./estilo.scss"  lang="scss"/>

