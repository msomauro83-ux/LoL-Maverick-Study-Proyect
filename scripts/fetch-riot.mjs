import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const dist=path.join(root,'dist');
await fs.mkdir(path.join(root,'data'),{recursive:true});
for(const p of ['assets/champions','assets/items','assets/portraits']) await fs.mkdir(path.join(dist,p),{recursive:true});
async function get(url,file,json=false){
  try{await fs.access(file);return json?JSON.parse((await fs.readFile(file,'utf8')).replace(/^\uFEFF/,'')):null;}catch{}
  for(let attempt=0;attempt<3;attempt++)try{
    const r=await fetch(url,{signal:AbortSignal.timeout(45000)});
    if(!r.ok)throw Error(`${r.status}: ${url}`);
    const bytes=Buffer.from(await r.arrayBuffer());await fs.writeFile(file,bytes);
    return json?JSON.parse(bytes.toString('utf8')):null;
  }catch(e){if(attempt===2)throw e;}
}
async function parallel(tasks,n=6){let i=0;await Promise.all(Array.from({length:n},async()=>{while(i<tasks.length)await tasks[i++]();}));}
const versions=await get('https://ddragon.leagueoflegends.com/api/versions.json',path.join(root,'data/versions.json'),true);
const version=versions[0];
const base=`https://ddragon.leagueoflegends.com/cdn/${version}`;
const items=await get(`${base}/data/es_MX/item.json`,path.join(root,'data/items.raw.json'),true);
const champions=await get(`${base}/data/es_MX/champion.json`,path.join(root,'data/champions.raw.json'),true);
const ids=Object.keys(champions.data);
const available=Object.entries(items.data).filter(([,v])=>v.maps?.['11']&&v.gold?.purchasable&&v.inStore!==false);
await fs.writeFile(path.join(root,'data/catalogue.json'),JSON.stringify({version,items:available.map(([id,v])=>({id,...v})),champions:ids.map(id=>champions.data[id])}));
await parallel(ids.map(id=>async()=>{
 await get(`${base}/data/es_MX/champion/${id}.json`,path.join(root,`data/${id}.json`),true);
 await get(`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${id}_0.jpg`,path.join(dist,`assets/champions/${id}.jpg`));
 await get(`${base}/img/champion/${id}.png`,path.join(dist,`assets/portraits/${id}.png`));
 console.log(`Campeón: ${id}`);
}));
await parallel(available.map(([id,v])=>()=>get(`${base}/img/item/${v.image.full}`,path.join(dist,`assets/items/${id}.png`))),8);
console.log(JSON.stringify({version,champions:ids.length,items:available.length}));
