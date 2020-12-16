<template>
  <div id="app">
  <el-container>
    <el-aside width="400px" style="min-height:400px">
      <div class="box" style="min-height:400px">
    <el-row class="row">
  <el-input
  placeholder="Rechercher un document"
  v-model="search"
  clearable>
</el-input>
    </el-row>
    <el-row>
          <el-button type="primary" @click="() => appendDocument()">Nouveau document</el-button>
    </el-row>
    <el-row class="row">
  <div v-for="doc in filteredList" :key="doc.id">
  <div @click="() => changeDocument(doc)">
    <el-row class="row" :gutter="20">
      <el-col :span="6" :offset="6">
      {{doc.title}}
  </el-col>
  <el-col :span="6" :offset="3">
    <el-button type="primary" icon="el-icon-edit" size="small" @click="() => changeHistory(doc)" circle></el-button>
  </el-col>
    </el-row>
  </div>
  </div>
    </el-row>
      </div>
      </el-aside>
    <el-main>
      <el-row>
      <div class=box>
      <el-row class="center" style="width:100%;height:100%;text-align:center;">
  <el-col :span="12">
     <div style="display:flex;align-items:center;justify-content:center;">
      <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
        <span>{{loginName}}</span>
    </div> 
    </el-col>
  <el-col :span="12">
     Utilisateurs en ligne :
  <span v-for="user in usersList" v-bind:key="user">
    <span>  {{user}} </span>
    </span>
    </el-col>
      </el-row>
      </div>
      </el-row>
      <div class="box">
        <div class="center" style="margin:20px">
    {{currentDocument.title}}
        </div>
    <ckeditor class="ck-content" :editor="editor" v-model="currentDocument.historyList[0].content" :config="editorConfig" />
    <div style="display:none;" id="pdfZone">
              <span v-html="currentDocument.historyList[0].content"></span>
    </div>
        <div class="center" style="margin:20px">
     <el-button size="small" type="success" @click="() => downloadDocument()">Télécharger le document</el-button>
        </div>
      </div>
     </el-main>
</el-container>

<el-dialog
  center
  v-bind:title="currentHistory.title"
  :visible.sync="dialogVisible"
  width="70%"
  :before-close="handleClose">
      <el-collapse accordion>
        <div v-for="(hist,index) in currentHistory.historyList" :key="index">
            <el-collapse-item  v-bind:key="hist.date">
           <template slot="title">
             <el-row class="row">
      {{hist.date + ' | ' + hist.author + ' | ' + index}}
  <el-button style="margin-left:50px" type="primary" size="small" @click="() => rollBackHistory(index)">Rollback</el-button>
             </el-row>
    </template>
              <span v-html="hist.content"></span>
              </el-collapse-item>
        </div>
      </el-collapse>
  <span slot="footer" class="dialog-footer">
    <el-row class="row" :gutter="20">
      <el-col :span="6" :offset="6">
      <el-popconfirm
  title="Etes vous sûre de vouloir supprimer ce document ?"
   confirm-button-text='Oui'
  cancel-button-text='Non'
  @confirm="() => removeDocument(currentHistory.id)"  
>
  <el-button 
  style="margin:10px"
 type="danger" icon="el-icon-delete" circle
  slot="reference"></el-button>
</el-popconfirm>
  </el-col>
  <el-col :span="6" :offset="6">
    <el-button type="primary" @click="dialogVisible = false">Fermer</el-button>
  </el-col>
    </el-row>
  </span>
</el-dialog>
  </div>
</template>
<script>
class History {
  constructor(author, date, content){
    this.author=author,
    this.date=date,
    this.content=content
  }
}
class Document {
  constructor(id, title, historyList){
    this.id=id,
    this.title=title,
    this.historyList=historyList
  }
}
//import Base64UploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter';
import io from 'socket.io-client';
import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import EssentialsPlugin from "@ckeditor/ckeditor5-essentials/src/essentials";
import BoldPlugin from "@ckeditor/ckeditor5-basic-styles/src/bold";
import ItalicPlugin from "@ckeditor/ckeditor5-basic-styles/src/italic";
import LinkPlugin from "@ckeditor/ckeditor5-link/src/link";
import ParagraphPlugin from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import Base64UploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import Clipboard from '@ckeditor/ckeditor5-clipboard/src/clipboard';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Code from '@ckeditor/ckeditor5-basic-styles/src/code';
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript';
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript';
//import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import ImagePlugin from '@ckeditor/ckeditor5-image/src/image';
    import ImageCaptionPlugin from '@ckeditor/ckeditor5-image/src/imagecaption';
    import ImageStylePlugin from '@ckeditor/ckeditor5-image/src/imagestyle';
    import ImageToolbarPlugin from '@ckeditor/ckeditor5-image/src/imagetoolbar';
    import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';


import pdfMake from "pdfmake/build/pdfmake";
var htmlToPdfmake = require("html-to-pdfmake");
export default {
  name: "Editor",
  props:["editorData","loginName"],
  methods:{
      appendDocument() {
        const newDocument = new Document(Math.random(),Math.random().toString(36).substring(7),[new History(Math.random().toString(36).substring(7),"01/01/2020",Math.random().toString(36).substring(7))]);
        this.documentList.push(newDocument);
      },
      removeDocument(id) {
        const index = this.documentList.findIndex(d => d.id === id);
        this.documentList.splice(index, 1);
        this.dialogVisible = false;
      },
      changeDocument(doc){
        this.currentDocument = doc;
      },
      changeHistory(hist){
        this.currentHistory = hist;
        this.dialogVisible = true;
      },
      rollBackHistory(index){
        //Delete previous history
        console.log("Index")
        console.log(index)
        console.log("LENGTh")
        console.log(this.currentHistory.historyList.length)
        this.currentHistory.historyList.splice(index, this.currentHistory.historyList.length);
        this.documentList.map(obj => this.currentHistory.id === obj.id || obj);
        this.currentDocument = this.currentHistory;
        //²this.dialogVisible = false;
      },
      handleClose(done) {
            done();
      },
      onEditorInput(){
        this.socket.emit('SEND_DOCUMENT', {
          user: 'Michel',
          doc: this.content
          });
          console.log("edit sent !")
      },
      downloadDocument(){
        pdfMake.pageLayout = {
  height: 792,
  width: 612,
  margins: Array(4).fill(72)
}
        console.log(document.getElementById("pdfZone").innerHTML)
        var val = htmlToPdfmake(document.getElementById("pdfZone").innerHTML);
        pdfMake.createPdf({content:val, pageSize: 'LETTER',  pageMargins: [0, 0, 0, 0]}).download();
      }
  },
  data() {
      let documentList = [
        new Document(Math.random(),'Document1',[new History("Eric","02/01/2020","Fred t"), new History("Fred","01/01/2020","Fred testo manger"),new History("Fred","03/01/2020","Fred testo")]),
        new Document(Math.random(),'Document3',[new History("Paul","04/01/2020","Vue"),new History("Charles","05/01/2020","Vue JS")]),
        new Document(Math.random(),'Super',[new History("Richard","04/01/2020","Empty")])
      ];
    return {
      editor: ClassicEditor,
      editorConfig: {
        plugins: [
          EssentialsPlugin,
          BoldPlugin,
          ItalicPlugin,
          LinkPlugin,
          ParagraphPlugin,
          Base64UploadAdapter,
          Table,
          TableToolbar,
          Clipboard,
          MediaEmbed,
          Bold,
          Italic,
          Underline,
          Strikethrough,
          Code,
          Subscript,
          Superscript,
           ImagePlugin,
                        ImageCaptionPlugin,
                        ImageStylePlugin,
                        ImageToolbarPlugin,
                        ImageUpload,
          //EasyImage,
        ],
        toolbar: [
           'bold',
            'italic', 'link', 'bulletedList', 'numberedList', '|',
             'insertTable', '|', 'imageUpload', 'mediaEmbed', '|', 
             'undo',
              'redo' ,
           'underline', 'strikethrough', 'code','subscript', 'superscript',
              ],
        table: {
           toolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
        },
        image: {
        toolbar: [
               'imageStyle:full',
               'imageStyle:side',
                'imageTextAlternative'
           ]
 },
         cloudServices: {
            tokenUrl: 'https://76684.cke-cs.com/token/dev/243d6805f85beb3073512e847ca4ad68a52faca8351ceb239ebbefe18c82',
            uploadUrl: 'https://76684.cke-cs.com/easyimage/upload/'
        }
      },
      search:'',
      usersList:['michel','arnaud'],
      activeNames: [],
      dialogVisible: false,
      currentHistory:'',
      currentDocument:documentList[0],
      content:this.editorData,
      socket : io('http://localhost:3000', {
        transports: ['websocket'],
        upgrade: false
      }),
      documentList:documentList,
    }
  },
  computed:{
    filteredList(){
      return this.documentList.filter(doc=>{
        return doc.title.toLowerCase().includes(this.search.toLowerCase());
      })
  },
  }
};
</script>

<style scoped>
.row {
  margin:5%;
}
  .center {
    justify-content: center;
    align-items: center;
    display: flex;
  }
  .box{
    border-radius: 5px;
    padding: 15px;
    margin:15px;
    background-color: white;
  }
</style>