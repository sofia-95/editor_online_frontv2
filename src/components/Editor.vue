<template>
  <div id="app">
    <el-container>
      <el-header height="100px" class="center">
      <div class="center" style="width:100%;height:100%;text-align:center;">
        LUMOS TEXT EDITOR V2
      </div>
      </el-header>
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
    <el-row class="row">
  <div v-for="doc in filteredList" :key="doc.id">
  <div @click="() => changeDocument(doc)">
    <el-row class="row" :gutter="20">
      <el-col :span="6" :offset="6">
      {{doc.name}}
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
      <el-row :gutter="20" class="center" style="width:100%;height:100%;text-align:center;">
  <el-col :span="8">
     <div style="display:flex;align-items:center;justify-content:center;">
      <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
        <span>{{loginName}}</span>
    </div>
    </el-col>
  <el-col :span="8">
     Utilisateurs en ligne :
  <span v-for="user in usersList" v-bind:key="user">
    <span>  {{user}} </span>
    </span>
    </el-col>
  <el-col :span="8">
          <el-button type="primary" @click="() => appendDocument()">Nouveau document</el-button>
  </el-col>
      </el-row>
      </div>
      </el-row>
      <div class="box">
    <ckeditor class="ck-content" :editor="editor" v-model="currentDoc.content" @input="onEditorInput"/>
      </div>
     </el-main>
  </el-container>
     <el-footer>
         © 2005-2020 Lumos.
     </el-footer>
</el-container>

<el-dialog
  center
  v-bind:title="currentHistory[0].name"
  :visible.sync="dialogVisible"
  width="70%"
  :before-close="handleClose">
      <el-collapse accordion>
        <div v-for="(hist,index) in currentHistory" :key="index">
            <el-collapse-item  v-bind:key="hist.created_on">
           <template slot="title">
             <el-row class="row">
      {{hist.created_on + ' | ' + hist.author + ' | ' + index}}
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
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
var timer = null
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
import io from 'socket.io-client';
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
        axios.get("http://localhost:3000/document", {params: {name: doc.name}})
        .then(response => {
          this.currentDoc = {
            name: doc.name,
            content: response.data[0].content
          }
          console.log(this.currentDoc);
          axios.get("http://localhost:3000/documenthistory", {params: {name: doc.name}})
          .then(response => {
            this.currentHistory = response.data;
            })
        })
        console.log("changed doc");
      },
      changeHistory(hist){
        console.log(hist);
        axios.get("http://localhost:3000/documenthistory", {params: {name: hist.name}})
        .then(response => {
          this.currentHistory = response.data;
          this.dialogVisible = true
          this.changeDocument(hist.name)
        })
      },
      rollBackHistory(index){
        //Delete previous history
        console.log("Index")
        console.log(index)
        console.log("LENGTh")
        console.log(this.currentHistory.historyList.length)
        this.currentDoc.content = this.currentHistory[index].content;
        //²this.dialogVisible = false;
      },
      handleClose(done) {
            done();
      },
      before_handlechange() {
        clearTimeout(timer);
        timer = setTimeout(() => this.onEditorInput(), 300);
      },
      onEditorInput(){
        if (this.currentDoc.content !== this.currentHistory[0].content && this.currentDoc.content.includes("&nbsp;", 0) === false && this.isnotapi) {
          this.socket.emit('SEND_DOCUMENT', {
            user: this.loginName,
            name: this.currentDoc.name,
            content: this.currentDoc.content
            });
            console.log("edit sent !")
          } else {
            this.isnotapi = true
          }
      },
  },
  data() {
    return {
      isnotapi: true,
      editor:ClassicEditor,
      search:'',
      usersList:['michel','arnaud'],
      doclist: [],
      activeNames: [],
      currentDoc: "",
      dialogVisible: false,
      currentDocument:new Document(0,'Nouveau Doc',[new History("Eric","02/01/2020","Fred")]),
      currentHistory:'',
    content:this.editorData, editorConfig:{ },
           socket : io('http://localhost:3000', {
        transports: ['websocket'],
        upgrade: false
      }),
      documentList:[
        new Document(Math.random(),'Document1',[new History("Eric","02/01/2020","Fred t"), new History("Fred","01/01/2020","Fred testo manger"),new History("Fred","03/01/2020","Fred testo")]),
        new Document(Math.random(),'Document3',[new History("Paul","04/01/2020","Vue"),new History("Charles","05/01/2020","Vue JS")]),
        new Document(Math.random(),'Super',[new History("Richard","04/01/2020","Empty")])
      ],
    }
  },
  mounted() {

    axios.get("http://localhost:3000/listdocuments")
    .then(response => {
      response.data.forEach(element => {
        this.doclist.push({ id: element._id, name: element.name}) 
        });
        this.changeDocument(this.doclist[0]);
    })
    
    this.socket.emit('hello', {
      username: this.loginName
    })

    this.socket.on('users', (data) => {
      this.usersList = data.users
    })

    this.socket.on('DOCUMENT', (data) => {
      if (this.currentDoc.name === data.name) {
        this.isnotapi = false
        this.currentDoc.content = data.content
        }
    })
  },
  beforeDestroy() {
    clearTimeout(timer);
    this.socket.emit('bye', {
      username: this.loginName
    })
  },
  computed:{
    filteredList(){
      return this.doclist.filter(doc=>{
        return doc.name.toLowerCase().includes(this.search.toLowerCase());
      })
  },
  }
};
</script>

<style scoped>
.row {
  margin:5%;
}
 .el-header, .el-footer {
    background-color:#3F85ED;
    color:white;
    text-align: center;
    line-height: 60px;
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