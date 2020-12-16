<template>
  <div id="app">
      <el-header>
        LUMOS TEXT EDITOR V2
      </el-header>
     <div class="wrapper">
    <div v-if="!loginEditor" class="container">
<el-card>
  <div style="margin:20px">
    Bienvenue, comment vous appelez-vous ?
  </div>
      <el-input placeholder="Entrez votre nom" minlength="1" v-model="loginInput"></el-input>
         <el-button style="margin:20px" v-on:click="onEnter()" type="primary">Valider</el-button>
</el-card>
    </div>
      <Editor v-if="loginEditor" id="editor" :loginName="loginInput"/>
     </div>
     <el-footer>
         © 2020 Lumos.
     </el-footer>
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
      loginInput: "",
      loginEditor:false,
    }
  },
  methods:{
    onEnter: function(){
      if (this.loginInput != "")
        this.loginEditor=true
    }
  }
}
</script> 
<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600&display=swap');
html, body {
  font-family: 'Montserrat', sans-serif;
  background-color: #E4EFFF;
  margin:0;
  height: 100vh;
}
.wrapper {
  min-height: 83vh;
}
#app {
  font-family: 'Montserrat', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
.ck-content {min-height:200px; }
 .el-header, .el-footer {
    background-color:#3F85ED;
    color:white;
    text-align: center;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .el-card {
    width: 50%;
    margin: 5% auto;
  }
</style>
