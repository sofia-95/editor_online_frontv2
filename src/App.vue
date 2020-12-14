<template>
  <div id="app">
    <div v-if="!name" class="container">
        <input type="text" id="login" name="login" required placeholder="Entrez votre nom (max 18 charactères)"
       minlength="1" maxlength="18" size="50">
       <button v-on:click="log()" id="okButton">OK</button>
    </div>
      <Editor v-if="name" id="editor" :loginName="name"/>
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
      log: function(){
        this.name = document.getElementById("login").value;
      },
     
    }
  },
}
</script> 
<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600&display=swap');
html, body {
  font-family: 'Montserrat', sans-serif;
}

#app {
  font-family: 'Montserrat', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
   position:fixed;
    padding:0;
    margin:0;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
}
html, body {
  height: 100vh;
  width: 100vw;
  background-color: #E4EFFF;
}
.ck-content {min-height:150px; }
</style>
