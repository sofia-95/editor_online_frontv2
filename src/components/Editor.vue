<template>
  <div id="app">
    <ckeditor :editor="editor" v-model="editorData" :config="editorConfig" @input="onEditorInput" />
  </div>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default {
  name: "Editor",
  props:["editorData"],
  data() {
    return {
      editor:ClassicEditor,
      editorConfig:{
      },
      onEditorInput: function(d){
        console.log(d)
      }
    }
  }
};
</script>