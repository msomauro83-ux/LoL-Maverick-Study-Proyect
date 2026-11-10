import fs from 'node:fs/promises';
import path from 'node:path';
import {guides,glossary} from './champion-guides.mjs';
import {standardGuide} from './standard-guides.mjs';
const root=path.resolve(import.meta.dirname,'..');
const raw=JSON.parse(await fs.readFile(path.join(root,'data/catalogue.json'),'utf8'));
const championGuides=raw.champions.map(c=>{
 const base=standardGuide(c),custom=guides.find(g=>g.id===c.id);
 return {...base,...custom,guideKind:custom?'specific':'archetype',guideLabel:custom?'Guía específica':'Orientación por arquetipo'};
});
const clean=s=>String(s||'').replace(/<br\s*\/?\s*>/gi,'\n').replace(/<[^>]*>/g,'').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').trim();
const statKey=s=>{
 const v=s.toLowerCase();
 if(v.includes('daño de ataque'))return'ad';if(v.includes('poder de habilidad'))return'ap';
 if(v.includes('velocidad de ataque'))return'as';if(v.includes('aceleración'))return'haste';
 if(v.includes('resistencia mágica'))return'mr';if(v.includes('penetración')&&v.includes('armadura'))return'armorpen';
 if(v.includes('penetración'))return'magicpen';if(v.includes('letalidad'))return'lethality';
 if(v.includes('armadura'))return'armor';if(v.includes('velocidad de movimiento'))return'speed';
 if(v.includes('regeneración'))return'regen';if(v.includes('robo de vida'))return'lifesteal';
 if(v.includes('crítico'))return'crit';if(v.includes('vida'))return'hp';if(v.includes('maná'))return'mana';return'other';
};
const items=raw.items.filter(x=>Number(x.id)<10000&&!x.requiredAlly&&!x.requiredChampion).map(x=>{
 const stats=clean(x.description.match(/<stats>([\s\S]*?)<\/stats>/i)?.[1]||'').split('\n').filter(Boolean).map(text=>({text,key:statKey(text),value:Number(text.match(/[\d.]+/)?.[0]||0),percent:text.includes('%')}));
 let effects=clean(x.description.replace(/<stats>[\s\S]*?<\/stats>/i,''));
 const dynamic=/(^|[^\d.])0(?=[^\d.%]|$)|\{\{/.test(effects);
 effects=effects.replace(/(^|[^\d.])0(?=[^\d.%]|$)/g,'$1[valor dinámico]').replace(/\{\{.*?\}\}/g,'[valor dinámico]');
 const recommendedBy=championGuides.filter(g=>[...g.stages,...Object.values(g.forms||{}).flatMap(f=>f.stages)].some(s=>s.items.includes(x.id))).map(g=>g.id);
 const groups=new Set();
 for(const s of stats){if(s.key==='ad')groups.add('AD');if(s.key==='ap')groups.add('AP');if(s.key==='as')groups.add('Ataques');if(['armor','mr','hp'].includes(s.key))groups.add('Defensa');if(s.key==='haste')groups.add('Aceleración');if(s.key==='lethality')groups.add('Letalidad');}
 if(x.tags.includes('Boots'))groups.add('Botas');
 const tier=x.gold.total===0?'Especial':x.gold.total<600?'Básico':(x.into?.length?'Componente':'Completo');
 return{id:x.id,name:x.name,aliases:({'3071':'Cuchilla negra Black Cleaver','3065':'Rostro espiritual Spirit Visage','3047':'Grebas de acero Plated Steelcaps','3111':'Botas de mercurio Mercury Treads','3153':'Blade of the Ruined King BORK','6672':'Kraken Slayer','3748':'Titanic Hydra','6333':"Death Dance Danza de la muerte"})[x.id]||'',cost:x.gold.total,sell:x.gold.sell,stats,effects,dynamic,tags:x.tags,groups:[...groups],tier,from:x.from||[],into:x.into||[],recommendedBy};
});
const available=new Set(items.map(x=>x.id));
for(const item of items){item.from=item.from.filter(id=>available.has(id));item.into=item.into.filter(id=>available.has(id));}
// Include situational defenses, boots and components, beyond the short stage examples.
const fighters=['XinZhao','Nocturne','Volibear','Jax','Warwick','JarvanIV','MonkeyKing','Kayn','Vi','Viego'];
const extraGroups=[
 [championGuides.map(g=>g.id),[3047,3111,3158,3364,3340,2055,2003,2138,2140,2139]],
 [championGuides.filter(g=>g.roles.includes('Jungla')).map(g=>g.id),[1101,1102,1103]],
 [championGuides.filter(g=>g.roles.includes('Soporte')).map(g=>g.id),[3865]],
 [fighters,[3742,3143,4401,2504,3075,3110,6609,2517,2501]],
 [['Diana','Evelynn','Volibear','Ekko'],[3020,1082,3041,3916,3165,3089,3135,3102,3157]],
 [['Diana','Volibear'],[6653,4633,4629,3115,2510]],
 [['MasterYi','Viego','Jax'],[3006,3091,3302,3124,3153,6672]],
 [['Khazix','Kayn','Nocturne'],[6695,3179,3814,6694,3139]],
 [['Volibear','Warwick','JarvanIV'],[6664,8020,3083,2502]],
 [['Jax','Warwick','MonkeyKing'],[3074]],
 [['Jax'],[3181]]
];
for(const [champions,ids] of extraGroups)for(const id of ids){const item=items.find(i=>i.id===String(id));if(item)item.recommendedBy=[...new Set([...item.recommendedBy,...champions])];}
function markComponents(item,champion,seen=new Set()){
 if(seen.has(item.id))return;seen.add(item.id);
 for(const id of item.from){const component=items.find(i=>i.id===id);if(!component.recommendedBy.includes(champion))component.recommendedBy.push(champion);markComponents(component,champion,seen);}
}
for(const item of items)for(const champion of [...item.recommendedBy])markComponents(item,champion);
const champions=await Promise.all(championGuides.map(async g=>{
 const c=raw.champions.find(c=>c.id===g.id);
 const detail=JSON.parse(await fs.readFile(path.join(root,`data/${g.id}.json`),'utf8')).data[g.id];
 return{...g,name:c.name,title:c.title,baseStats:c.stats,officialTags:c.tags,resource:detail.partype,passive:{name:detail.passive.name,description:clean(detail.passive.description)},abilities:detail.spells.map((s,i)=>({key:['Q','W','E','R'][i],name:s.name,description:clean(s.description),cooldown:s.cooldownBurn})),difficulty:c.info.difficulty};
}));
champions.sort((a,b)=>a.name.localeCompare(b.name,'es'));
const data={edition:'standard',appVersion:'2.0.0',version:raw.version,patch:'26.22',date:'2026-11-10',locale:'es_MX',champions,items,glossary,sources:[{name:'Riot · Data Dragon',url:'https://developer.riotgames.com/docs/lol'},{name:'Catálogo oficial de campeones',url:`https://ddragon.leagueoflegends.com/cdn/${raw.version}/data/es_MX/champion.json`},{name:'Catálogo oficial de objetos',url:`https://ddragon.leagueoflegends.com/cdn/${raw.version}/data/es_MX/item.json`},{name:'Notas del parche 26.22',url:'https://www.leagueoflegends.com/en-us/news/game-updates/league-of-legends-patch-26-22-notes/'}]};
await fs.mkdir(path.join(root,'dist'),{recursive:true});
await fs.writeFile(path.join(root,'dist/data.js'),`window.MAVERICK_DATA=${JSON.stringify(data)};\n`);
await fs.writeFile(path.join(root,'data/maverick.json'),JSON.stringify(data,null,2));
const guideText=['LoL Maverick Study Proyect','CHAMPION POOL · ESCALADO Y COMPRAS','Datos: Data Dragon '+data.version+' · '+data.date,'','AD y AP son estadísticas. Físico, mágico y verdadero son tipos de daño. Velocidad de ataque es una estadística; luchador, asesino y mago son identidades de combate.','Las prioridades son orientación editorial, no estadísticas de victoria ni una build obligatoria. Inicio/medio/final se entienden según objetos, niveles y partida, no un reloj rígido.',''];
for(const c of champions){guideText.push('='.repeat(65),c.name.toUpperCase(),`Build: ${c.build} | Daño: ${c.damage} | Clase: ${c.role}`,`Posiciones orientativas: ${c.roles.join(', ')} | ${c.guideLabel}`,`Estilo: ${c.style}`,`Perfil orientativo: inicio ${c.curve[0]}, medio ${c.curve[1]}, final ${c.curve[2]}`,'',c.summary,'','REGLA DE COMPRA: '+c.rule,'');
 for(const [index,s]of c.stages.entries()){guideText.push(['INICIO','MEDIO','FINAL'][index]+': '+s.focus,'Prioriza: '+s.priorities.join(' + '),s.reason,'Opciones (no comprar todas): '+s.items.map(id=>items.find(i=>i.id===id)?.name||id).join(' / '),'Ajuste: '+s.adapt,'');}
 for(const form of Object.values(c.forms||{})){guideText.push('RUTA '+form.name.toUpperCase());for(const [i,s]of form.stages.entries())guideText.push(['INICIO','MEDIO','FINAL'][i]+': '+s.focus+' | '+s.priorities.join(' + '),s.reason,'Opciones: '+s.items.map(id=>items.find(x=>x.id===id)?.name||id).join(' / '),s.adapt,'');}
 guideText.push('HABILIDADES OFICIALES',c.passive.name+': '+c.passive.description,...c.abilities.map(a=>a.key+' — '+a.name+': '+a.description),'');
}
guideText.push('GLOSARIO','',...glossary.flatMap(([key,label,text])=>[`${key} — ${label}`,text,'']),'FUENTES',...data.sources.map(s=>s.name+': '+s.url));
await fs.writeFile(path.join(root,'Champion_Pool_Guia.txt'),guideText.join('\r\n'),'utf8');
const itemText=['LoL Maverick Study Proyect — Wiki de objetos',`Datos oficiales Riot Data Dragon ${data.version} · ${data.date} · Español Latinoamérica`,`Catálogo: ${items.length} objetos comprables de Grieta del Invocador, sin variantes especiales de otros modos.`,`Opciones destacadas para el pool: ${items.filter(i=>i.recommendedBy.length).length}. Los demás permiten consultar componentes y alternativas.`,`Los valores dinámicos ausentes en la fuente se señalan; no se convierten en ceros.`, ''];
for(const i of items){itemText.push('-'.repeat(60),`${i.name} [${i.id}] — ${i.cost} oro | Venta ${i.sell}`,`Tipo: ${i.tier} | ${i.groups.join(', ')}`,...i.stats.map(s=>s.text),'',i.effects,'',`Se construye con: ${i.from.map(id=>items.find(x=>x.id===id)?.name||id).join(', ')||'—'}`,`Mejora a: ${i.into.map(id=>items.find(x=>x.id===id)?.name||id).join(', ')||'—'}`,`Considerado en fichas de: ${i.recommendedBy.map(id=>champions.find(c=>c.id===id).name).join(', ')||'Consulta general'}`,'');}
await fs.writeFile(path.join(root,'Wiki_Objetos.txt'),itemText.join('\r\n'),'utf8');
await fs.writeFile(path.join(root,'dist/Champion_Pool_Guia.txt'),guideText.join('\r\n'),'utf8');
await fs.writeFile(path.join(root,'dist/Wiki_Objetos.txt'),itemText.join('\r\n'),'utf8');
console.log(JSON.stringify({champions:champions.length,items:items.length,featured:items.filter(i=>i.recommendedBy.length).length,version:data.version}));
