<template>
  <div id="app">
    <ckeditor :editor="editor" v-model="editorData" :config="editorConfig" />
  </div>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default {
  name: "Editor",
  data() {
    return {
      editor: ClassicEditor,
      editorData: "<p>Robin is the best teacher.</p>",
      }
    }
};
</script>