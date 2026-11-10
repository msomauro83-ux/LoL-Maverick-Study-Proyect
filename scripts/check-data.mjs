import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const context={window:{}};
vm.runInNewContext(await fs.readFile(path.join(root,'dist/data.js'),'utf8'),context);
const data=context.window.MAVERICK_DATA;
const official=JSON.parse(await fs.readFile(path.join(root,'data/champions.raw.json'),'utf8'));
assert.equal(data.edition,'standard');
assert.deepEqual([...data.champions.map(c=>c.id)].sort(),Object.keys(official.data).sort());
assert.equal(new Set(data.champions.map(c=>c.id)).size,data.champions.length);
assert.equal(data.champions.find(c=>c.id==='Ekko')?.build,'AP');
assert.ok(data.items.find(i=>i.id==='2510').recommendedBy.includes('Ekko'));
assert.ok(data.items.length>150);
const ids=new Set(data.items.map(i=>i.id));
for(const c of data.champions){
 assert.ok(c.roles.length>0&&c.classes.length>0&&c.buildFamilies.length>0,c.id+' filtros');
 assert.equal(c.abilities.length,4,c.id+' habilidades');
 assert.ok(c.passive.name&&c.passive.description,c.id+' pasiva');
 assert.ok(['specific','archetype'].includes(c.guideKind),c.id+' procedencia');
 assert.equal(c.stages.length,3,c.id);
 for(const s of [...c.stages,...Object.values(c.forms||{}).flatMap(f=>f.stages)]){
  assert.ok(s.priorities.length&&s.reason&&s.adapt,c.id);
  for(const id of s.items)assert.ok(ids.has(id),`${c.id}: objeto ${id}`);
 }
 for(const p of [`assets/champions/${c.id}.jpg`,`assets/portraits/${c.id}.png`])assert.ok((await fs.stat(path.join(root,'dist',p))).size>100,p);
}
for(const i of data.items){
 assert.ok(Number(i.id)<10000&&i.cost>=0,i.id);
 for(const id of [...i.from,...i.into])assert.ok(ids.has(id),`${i.id}: receta ${id}`);
 for(const c of i.recommendedBy)assert.ok(data.champions.some(ch=>ch.id===c));
 for(const s of i.stats)assert.ok(Number.isFinite(s.value),`${i.name}: estadística`);
 assert.ok((await fs.stat(path.join(root,`dist/assets/items/${i.id}.png`))).size>100,i.id);
}
const raw=JSON.parse(await fs.readFile(path.join(root,'data/items.raw.json'),'utf8'));
for(const i of data.items)assert.equal(i.cost,raw.data[i.id].gold.total);
for(const id of ['3748','3071','6333','3115']){
 const item=data.items.find(i=>i.id===id);
 for(const [key,rawKey]of [['ad','FlatPhysicalDamageMod'],['ap','FlatMagicDamageMod'],['hp','FlatHPPoolMod'],['armor','FlatArmorMod']]){
  if(raw.data[id].stats[rawKey])assert.equal(item.stats.find(s=>s.key===key)?.value,raw.data[id].stats[rawKey]);
 }
}
for(const file of ['app.js','roster.js','data.js','sw.js'])new vm.Script(await fs.readFile(path.join(root,'dist',file),'utf8'),{filename:file});
vm.runInNewContext(await fs.readFile(path.join(root,'dist/roster.js'),'utf8'),context);
const {score,distance}=context.window.MaverickRoster;
for(const [query,id]of [['ka six','Khazix'],['KHA ZIX','Khazix'],['master yi','MasterYi'],['jarvan4','JarvanIV'],['zin xao','XinZhao'],['velkoz','Velkoz']]){
 const matches=[...data.champions].sort((a,b)=>score(b,query)-score(a,query));
 assert.equal(matches[0].id,id,'busqueda '+query);
}
assert.equal(distance('ekkoo','Ekko'),1);
for(const file of ['Champion_Pool_Guia.txt','Wiki_Objetos.txt'])assert.ok((await fs.stat(path.join(root,file))).size>5000);
console.log(`OK: ${data.champions.length} fichas, ${data.items.length} objetos, recetas, precios, estadísticas, recursos y JavaScript.`);
