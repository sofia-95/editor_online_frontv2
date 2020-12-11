<template>
  <div id="app">
    <ckeditor :editor="editor" v-model="content" :config="editorConfig" @input="onEditorInput" />
  </div>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import io from 'socket.io-client';
export default {
  name: "Editor",
  props:["editorData"],
  methods:{
      onEditorInput(){
        this.socket.emit('SEND_DOCUMENT', {
          user: 'Michel',
          doc: this.content
          });
          console.log("edit sent !")
      }
  },
  data() {
    return {
      editor:ClassicEditor,
      content:this.editorData,
      editorConfig:{
      },
      socket : io('http://localhost:3000', {
        transports: ['websocket'],
        upgrade: false
      }),
    }
  },
};
</script>