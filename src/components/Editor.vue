<template>
  <div id="app">
    <ckeditor :editor="editor" v-model="content" :config="editorConfig" @input="onEditorInput" />
  </div>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default {
  name: "Editor",
  props:["editorData"],
  methods:{
      onEditorInput(){
        this.$emit("update-data",this.content)
      }
  },
  data() {
    return {
      editor:ClassicEditor,
      content:this.editorData,
      editorConfig:{
      },
    }
  }
};
</script>