<template>
  <div id="app">
    Utilisateurs connectés :
  <div v-for="user in usersList" v-bind:key="user">
    <div>{{user}}</div>
    </div>
    <el-row :gutter="20">
  <el-col :span="16">
    <ckeditor :editor="editor" v-model="currentDocument.historyList[0].content" />
  </el-col>
  <el-col :span="8">
  <el-button @click="() => appendDocument()" type="primary">Nouveau document</el-button>
  <el-input
  placeholder="Entrez quelque chose"
  v-model="search"
  clearable>
</el-input>
  <div v-for="doc in filteredList" :key="doc.id">
  <div @click="() => changeDocument(doc)">
    <el-row :gutter="20">
      <el-col :span="6" :offset="6">
      {{doc.title}}
  </el-col>
  <el-col :span="6" :offset="6">
  <el-button type="primary" size="small" @click="() => changeHistory(doc)">Historique</el-button>
  </el-col>
    </el-row>
  </div>
  </div>
    </el-col>
</el-row>

<el-dialog
  v-bind:title="currentHistory.title"
  :visible.sync="dialogVisible"
  width="70%"
  :before-close="handleClose">
      <el-popconfirm
  title="Etes vous sûre de vouloir supprimer ce document ?"
   confirm-button-text='Oui'
  cancel-button-text='Non'
  @confirm="() => removeDocument(currentHistory.id)"  
>
  <el-button 
  slot="reference">Supprimer le document</el-button>
</el-popconfirm>
      <el-collapse accordion>
        <div v-for="(hist,index) in currentHistory.historyList" :key="index">
            <el-collapse-item  v-bind:key="hist.date">
           <template slot="title">
             <el-row>
      {{hist.date + ' | ' + hist.author + ' | ' + index}}
  <el-button type="primary" size="small" @click="() => rollBackHistory(index)">Rollback</el-button>
             </el-row>
    </template>
              <span v-html="hist.content"></span>
              </el-collapse-item>
        </div>
      </el-collapse>
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="dialogVisible = false">Fermer</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
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
  props:["editorData"],
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
      }
  },
  data() {
    return {
      editor:ClassicEditor,
      search:'',
      usersList:['michel','arnaud'],
      activeNames: [],
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
  computed:{
    filteredList(){
      return this.documentList.filter(doc=>{
        return doc.title.toLowerCase().includes(this.search.toLowerCase());
      })
  },
  }
};
</script>