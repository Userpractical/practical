const DB_NAME = "PracticalCodeManagerDB";
const STORE = "files";
let db, activeId = null, editor, toastTimer;

const $ = id => document.getElementById(id);
const starter = [];
for (let i=1;i<=10;i++) starter.push({
  id: crypto.randomUUID(), name:`practical${i}.c`, practical:i,
  content:`/* Practical ${i}\n   Add your experiment title and code here.\n*/\n\n#include <stdio.h>\n\nint main(void) {\n    printf("Practical ${i} is ready!\\\\n");\n    return 0;\n}\n`,
  updated:Date.now()
});

function openDB(){
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open(DB_NAME,1);
    req.onupgradeneeded=()=>req.result.createObjectStore(STORE,{keyPath:"id"});
    req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error);
  });
}
function tx(mode="readonly"){return db.transaction(STORE,mode).objectStore(STORE)}
function allFiles(){return new Promise((res,rej)=>{const r=tx().getAll();r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
function putFile(file){return new Promise((res,rej)=>{const r=tx("readwrite").put(file);r.onsuccess=()=>res();r.onerror=()=>rej(r.error)})}
function removeFile(id){return new Promise((res,rej)=>{const r=tx("readwrite").delete(id);r.onsuccess=()=>res();r.onerror=()=>rej(r.error)})}
function detectMode(name){
  const ext=(name.split(".").pop()||"").toLowerCase();
  return ({c:"text/x-csrc",h:"text/x-csrc",cpp:"text/x-c++src",cc:"text/x-c++src",java:"text/x-java",py:"python",sh:"shell",bash:"shell",js:"javascript",ts:"javascript",html:"htmlmixed",htm:"htmlmixed",css:"css",json:{name:"javascript",json:true},txt:"null",md:"markdown"})[ext]||"null";
}
function showToast(msg){$("toast").textContent=msg;$("toast").classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>$("toast").classList.remove("show"),2200)}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
async function renderList(){
  const files=(await allFiles()).sort((a,b)=>(a.practical||99)-(b.practical||99)||a.name.localeCompare(b.name));
  $("fileCount").textContent=`${files.length} file${files.length===1?"":"s"}`;
  const groups=new Map();
  files.forEach(f=>{const key=f.practical?`Practical ${f.practical}`:"Other files";if(!groups.has(key))groups.set(key,[]);groups.get(key).push(f)});
  $("practicalList").innerHTML="";
  for(const [group,items] of groups){
    const section=document.createElement("div");section.className="practice-group";
    section.innerHTML=`<div class="practice-title">${escapeHtml(group)}</div>`;
    items.forEach(f=>{
      const b=document.createElement("button");b.className="file-item"+(f.id===activeId?" active":"");
      b.innerHTML=`<span class="file-icon">▤</span><span class="file-label">${escapeHtml(f.name)}</span>`;
      b.title=f.name;b.onclick=()=>openFile(f.id);section.appendChild(b);
    });
    $("practicalList").appendChild(section);
  }
}
async function openFile(id){
  const f=(await allFiles()).find(x=>x.id===id);if(!f)return;
  activeId=id;editor.setOption("mode",detectMode(f.name));editor.setValue(f.content);
  $("currentFileName").textContent=f.name;$("languageLabel").textContent=`Language: ${f.name.split(".").pop().toUpperCase()}`;
  $("savedStatus").textContent="Saved";$("emptyState").style.display="none";
  ["renameBtn","downloadBtn","deleteBtn","saveBtn"].forEach(x=>$(x).disabled=false);
  await renderList();editor.refresh();
}
async function saveCurrent(){
  if(!activeId)return;
  const files=await allFiles(),f=files.find(x=>x.id===activeId);if(!f)return;
  f.content=editor.getValue();f.updated=Date.now();await putFile(f);
  $("savedStatus").textContent="Saved";showToast("Changes saved on this device");
  await renderList();
}
async function createFile(){
  const name=prompt("Enter file name (example: practical1.c):","practical1.c");if(!name)return;
  if(!/\.[a-z0-9]+$/i.test(name)){showToast("Please include a file extension, such as .c or .py");return}
  const m=name.match(/practical\s*0*(\d+)/i),p=m?Math.min(10,Math.max(1,Number(m[1]))):null;
  const f={id:crypto.randomUUID(),name:name.trim(),practical:p,content:"",updated:Date.now()};
  await putFile(f);await openFile(f.id);showToast("New file created");
}
async function uploadFiles(fileList){
  for(const file of fileList){
    const content=await file.text();const m=file.name.match(/practical\s*0*(\d+)/i);
    const f={id:crypto.randomUUID(),name:file.name,practical:m?Math.min(10,Math.max(1,Number(m[1]))):null,content,updated:Date.now()};
    await putFile(f);
  }
  await renderList();showToast(`${fileList.length} file(s) added`);
  if(fileList.length){const fs=await allFiles();await openFile(fs[fs.length-1].id)}
}
function download(name,content){
  const blob=new Blob([content],{type:"text/plain;charset=utf-8"}),url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);
}
async function exportZip(){
  const files=await allFiles();if(!files.length){showToast("There are no files to download");return}
  if(!window.JSZip){showToast("ZIP library needs an internet connection");return}
  const zip=new JSZip();
  files.forEach(f=>zip.file((f.practical?`Practical ${f.practical}/`:"Other files/")+f.name,f.content));
  const blob=await zip.generateAsync({type:"blob"});const url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=url;a.download="practical-code-backup.zip";a.click();URL.revokeObjectURL(url);
}
async function backupJSON(){
  const files=await allFiles();download("practical-code-backup.json",JSON.stringify(files,null,2));
}
async function restoreJSON(file){
  try{const data=JSON.parse(await file.text());if(!Array.isArray(data))throw Error();
    for(const f of data){if(typeof f.name==="string"&&typeof f.content==="string")await putFile({...f,id:crypto.randomUUID()})}
    await renderList();showToast("Backup restored");
  }catch{showToast("Invalid backup file")}
}
async function init(){
  db=await openDB();
  if(!(await allFiles()).length){for(const f of starter)await putFile(f)}
  editor=CodeMirror.fromTextArea($("codeEditor"),{theme:"material-darker",lineNumbers:true,indentUnit:4,tabSize:4,indentWithTabs:false,lineWrapping:false,mode:"text/x-csrc",extraKeys:{"Ctrl-S":saveCurrent,"Cmd-S":saveCurrent}});
  editor.on("change",()=>{if(activeId)$("savedStatus").textContent="Unsaved changes"});
  $("newFileBtn").onclick=createFile;$("emptyNewBtn").onclick=createFile;
  $("uploadBtn").onclick=()=>$("fileInput").click();
  $("fileInput").onchange=e=>{if(e.target.files.length)uploadFiles([...e.target.files]);e.target.value=""};
  $("saveBtn").onclick=saveCurrent;
  $("downloadBtn").onclick=async()=>{const f=(await allFiles()).find(x=>x.id===activeId);if(f)download(f.name,editor.getValue())};
  $("deleteBtn").onclick=async()=>{if(!activeId)return;if(confirm("Delete this file permanently from this browser?")){await removeFile(activeId);activeId=null;editor.setValue("");$("currentFileName").textContent="Select a file to begin";$("savedStatus").textContent="No file selected";$("languageLabel").textContent="Language: —";$("emptyState").style.display="flex";["renameBtn","downloadBtn","deleteBtn","saveBtn"].forEach(x=>$(x).disabled=true);await renderList()}};
  $("renameBtn").onclick=async()=>{const fs=await allFiles(),f=fs.find(x=>x.id===activeId);if(!f)return;const n=prompt("New file name:",f.name);if(n&&n.trim()){f.name=n.trim();await putFile(f);await openFile(f.id)}};
  $("exportAllBtn").onclick=exportZip;
  $("importBackupBtn").onclick=()=>$("backupInput").click();
  $("backupInput").onchange=e=>{if(e.target.files[0])restoreJSON(e.target.files[0]);e.target.value=""};
  document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="s"){e.preventDefault();saveCurrent()}});
  await renderList();await openFile((await allFiles())[0].id);
}
init().catch(err=>{console.error(err);showToast("Could not start the file database. Try a modern browser.")});
