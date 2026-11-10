import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=path.resolve(import.meta.dirname,'../dist');
async function walk(dir){let result=[];for(const e of await fs.readdir(dir,{withFileTypes:true})){const name=path.join(dir,e.name);if(e.isDirectory())result.push(...await walk(name));else result.push('./'+path.relative(root,name).replaceAll('\\','/'));}return result;}
const files=(await walk(root)).filter(f=>!f.endsWith('sw.js'));
const hash=createHash('sha256');for(const file of files){hash.update(file);hash.update(await fs.readFile(path.join(root,file)));}
const version=hash.digest('hex').slice(0,12);
const sw=`const CACHE='maverick-${version}';const FILES=${JSON.stringify(files)};self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('maverick-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request)));});`;
await fs.writeFile(path.join(root,'sw.js'),sw);
console.log('Offline cache: '+files.length+' archivos');
