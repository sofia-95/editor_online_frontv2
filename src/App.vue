<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <div>
    LUMOS TEXT EDITOR V2
    </div>
    <div v-if="!name" class="container">
        <input type="text" id="login" name="login" required placeholder="Entrez votre nom (max 18 charactères)"
       minlength="1" maxlength="18" size="50">
       <button v-on:click="log()" id="okButton">OK</button>
    </div>
    <div v-if="name">
         Logged as {{name}}<br/>
         <div>
           <button :disabled="currentPage==1" v-on:click="changeToOne()">1</button>
           <button :disabled="currentPage==2" v-on:click="changeToTwo()">2</button>
           <button :disabled="currentPage==3" v-on:click="changeToThree()">3</button>
         </div>
    </div>
   <Editor v-if="name" id="editor" :editorData="dataEditor"/>
  </div>
</template>

<script>
import Editor from './components/Editor.vue'
export default {
  name: 'App',
  components: {
    Editor
  },
  data(){
    return {
      editor: this.Editor,
      name: "",
      currentPage: 1,
      dataEditor:"Init",
      pageOne:"Page 1",
      pageTwo:"Page 2",
      pageThree:"Page 3",
      log: function(){
        this.name = document.getElementById("login").value;
      },
      changeToOne: function(){
        this.currentPage = 1;
        this.dataEditor=this.pageOne;
      },
      changeToTwo: function(){
        this.currentPage = 2;
        this.dataEditor=this.pageTwo;
      },
      changeToThree: function(){
        this.currentPage = 3;
        this.dataEditor=this.pageThree;
      }
    }
  },

}
</script> 
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
