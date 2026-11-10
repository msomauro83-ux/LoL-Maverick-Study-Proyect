// Positions and purchase profiles are editorial orientation, not Riot winrate data.
const set=s=>new Set(s.split(/\s+/).filter(Boolean));
const positions={
 Superior:set('Aatrox Akali Ambessa Aurora Camille Chogath Darius DrMundo Fiora Gangplank Garen Gnar Gragas Gwen Illaoi Irelia Jax Jayce Kayle Kennen Kled KSante Malphite Mordekaiser Nasus Olaf Ornn Pantheon Poppy Quinn Renekton Riven Rumble Sett Shen Singed Sion Skarner TahmKench Teemo Trundle Tryndamere Udyr Urgot Vayne Vladimir Volibear Warwick Wukong MonkeyKing Yasuo Yone Yorick Zaahen'),
 Jungla:set('Amumu Belveth Brand Briar Diana Ekko Elise Evelynn Fiddlesticks Gragas Graves Gwen Hecarim Ivern JarvanIV Jax Karthus Kayn Khazix Kindred LeeSin Lillia MasterYi MonkeyKing Morgana Naafiri Nidalee Nocturne Nunu Olaf Pantheon Poppy Rammus RekSai Rengar Sejuani Shaco Shyvana Skarner Sylas Taliyah Talon Trundle Udyr Vi Viego Volibear Warwick XinZhao Zac Zaahen Zed Zyra'),
 Centro:set('Ahri Akali Akshan Anivia Annie AurelionSol Aurora Azir Brand Cassiopeia Corki Diana Ekko Fizz Galio Gangplank Gragas Heimerdinger Hwei Irelia Jayce Kassadin Katarina Kayle Kennen Leblanc Lissandra Locke Lux Malzahar Mel Morgana Naafiri Neeko Orianna Pantheon Qiyana Ryze Seraphine Smolder Swain Sylas Syndra Taliyah Talon Tristana TwistedFate Veigar Velkoz Vex Viktor Vladimir Xerath Yasuo Yone Ziggs Zilean Zoe'),
 Tirador:set('Aphelios Ashe Caitlyn Corki Draven Ezreal Jhin Jinx Kaisa Kalista KogMaw Lucian MissFortune Nilah Samira Senna Seraphine Sivir Smolder Swain Tristana Twitch Varus Vayne Xayah Yasuo Yunara Zeri Ziggs'),
 Soporte:set('Alistar Amumu Annie Ashe Bard Blitzcrank Brand Braum Fiddlesticks Galio Heimerdinger Hwei Ivern Janna Karma Leona Lulu Lux Maokai Mel Milio Morgana Nami Nautilus Neeko Pantheon Poppy Pyke Rakan Rell Renata Senna Seraphine Shaco Sona Soraka Swain TahmKench Taric Thresh Velkoz Xerath Yuumi Zilean Zyra')
};
const ap=set('Ahri Akali Anivia Annie AurelionSol Aurora Azir Brand Cassiopeia Diana Ekko Elise Evelynn Fiddlesticks Fizz Galio Gragas Gwen Heimerdinger Hwei Karthus Kassadin Katarina Kennen Leblanc Lillia Lissandra Locke Lux Malzahar Mel Mordekaiser Morgana Neeko Nidalee Orianna Rumble Ryze Singed Swain Sylas Syndra Taliyah Teemo TwistedFate Veigar Velkoz Vex Viktor Vladimir Xerath Ziggs Zoe Zyra Kayle');
const hybrid=set('Jax Kaisa KogMaw Shaco Shyvana Udyr Varus Volibear Warwick');
const tanks=set('Alistar Amumu Blitzcrank Braum Chogath DrMundo KSante Leona Malphite Maokai Nautilus Nunu Ornn Poppy Rammus Rell Sejuani Shen Sion Skarner TahmKench Taric Thresh Zac');
const enchanters=set('Bard Ivern Janna Karma Lulu Milio Nami Rakan Renata Seraphine Sona Soraka Yuumi Zilean');
const supportTanks=set('Alistar Blitzcrank Braum Leona Nautilus Rell Taric Thresh Rakan');
const onhit=set('Belveth Irelia Jax Kalista Kaisa Kindred KogMaw MasterYi Varus Vayne Viego Warwick');
const apFighters=set('Diana Galio Gragas Gwen Lillia Mordekaiser Rumble Shyvana Singed Swain Sylas Udyr Volibear');
const manaDps=set('Anivia AurelionSol Cassiopeia Karthus Malzahar Ryze Swain Taliyah');
const apAttack=set('Azir Kayle Teemo');
const adAssassins=set('Khazix Naafiri Pyke Qiyana Rengar Shaco Talon Zed');
const critFighters=set('Gangplank Nilah Tryndamere Yasuo Yone');
const mixed=set('Akali Bard Corki DrMundo Elise Ezreal Gnar Jax Kaisa Kalista KogMaw KSante Leona Malphite Maokai Nasus Nidalee Nunu Ornn Poppy Sejuani Shen Shyvana Sion Skarner TahmKench Taric Thresh Twitch Udyr Varus Vayne Viego Volibear Warwick Yunara Yone Zeri');
const magicTanks=set('Alistar Amumu Blitzcrank Rammus Zac');
const trueDamage=set('Ahri Camille Chogath Darius Fiora Gangplank Gwen KogMaw Lillia MasterYi Olaf RekSai Sett Smolder Vayne Velkoz');
const classNames={Fighter:'Luchador',Tank:'Tanque',Mage:'Mago',Assassin:'Asesino',Marksman:'Tirador',Support:'Soporte'};
const aliases={MonkeyKing:['Wukong','Wu kong','Rey mono'],MasterYi:['Master Yi','Maestro Yi','Yi'],Khazix:["Kha Zix",'Ka six','Kha six','Khazix'],JarvanIV:['Jarvan 4','Jarvan IV','J4'],Chogath:['Cho Gath'],Kaisa:['Kai Sa'],KSante:['K Sante'],Leblanc:['Le Blanc'],LeeSin:['Lee Sin'],MissFortune:['Miss Fortune','MF'],Nunu:['Nunu','Willump'],Renata:['Renata Glasc'],RekSai:['Rek Sai'],TahmKench:['Tahm Kench'],TwistedFate:['Twisted Fate','TF'],DrMundo:['Doctor Mundo','Mundo'],AurelionSol:['Aurelion Sol','Asol'],Belveth:['Bel Veth'],Velkoz:['Vel Koz'],KogMaw:['Kog Maw'],XinZhao:['Xin Zhao','Xin Zao','Zin Xao','Zinxhao']};
const customNotes={
 AurelionSol:'Sus acumulaciones y mejoras de habilidades elevan su impacto con el tiempo; necesita espacio para canalizar y llegar a sus objetos.',
 Nasus:'Las acumulaciones de Q son una fuente propia de escalado. No reemplazan movilidad, aceleración y aguante para alcanzar a los objetivos.',
 Veigar:'Su pasiva acumula AP. Vida o una defensa puntual pueden permitir aplicar ese AP antes de morir.',
 Smolder:'Las acumulaciones de su pasiva mejoran sus habilidades. AD y crítico pueden complementar esa progresión; las acumulaciones no protegen del control.',
 Kayle:'Los niveles 6, 11 y 16 cambian su patrón de ataques. AP y velocidad de ataque ganan valor si logra mantenerse a salvo mientras golpea.',
 Kassadin:'Sus niveles y la disponibilidad de maná y aceleración afectan cuánto puede reposicionarse y repetir habilidades.',
 Senna:'Las almas aportan una progresión propia de ataques. Su economía y función de soporte cambian las prioridades frente a las de un tirador que farmea.',
 Thresh:'Las almas aportan estadísticas. Sus herramientas de control y rescate pueden mantener valor incluso con poca economía.',
 Chogath:'Las acumulaciones de R pueden aumentar su vida. Combina ese crecimiento con resistencias y herramientas para llegar al objetivo.',
 Kindred:'Las marcas amplían herramientas de su kit; sus ataques también necesitan AD, velocidad y una posición segura.',
 Belveth:'Los ataques y su progresión propia de velocidad de ataque favorecen peleas sostenidas. El control y la ráfaga pueden impedirle aplicar ese daño.',
 Azir:'Su daño mágico sostenido aprovecha AP y velocidad de ataque, pero depende de la posición de soldados y del margen para seguir atacando.',
 Pyke:'Su pasiva convierte la vida adicional en AD: comprar vida no lo vuelve resistente como a un tanque convencional. Busca AD, letalidad y utilidad de soporte.',
 Jhin:'Su patrón de cuatro disparos modifica cómo aprovecha estadísticas ofensivas. No interpretes velocidad de ataque como más disparos continuos al estilo de otros tiradores.',
 Zeri:'Combina daño de ataques y movilidad; la forma particular de su Q hace importante revisar los efectos que realmente aplica.',
 Corki:'Compra principalmente AD aunque sus habilidades y efectos pueden combinar tipos de daño; AP y daño mágico no son sinónimos.',
 Yunara:'Sus críticos pueden añadir daño mágico. La identidad de compra sigue vinculada a ataques y crítico, con supervivencia para mantenerlos.',
 Zaahen:'AD y aguante sostienen sus intercambios de luchador. Su mecánica de acumulaciones y resurrección no reemplaza evaluar el daño que recibe.',
 Locke:'Su kit combina habilidades y ataques con daño mágico. AP y acceso al objetivo importan; sus herramientas de recuperación no garantizan sobrevivir a una ráfaga.'
 ,Shaco:'Puede seguir rutas AD o AP con patrones de daño distintos. Esta orientación toma la ruta de asesino AD como referencia; una ruta AP exige valorar por separado sus cajas y herramientas de control.'
 ,Shyvana:'Puede orientar su build a AP o a ataques y AD. Los ejemplos de esta ficha priorizan la ruta de luchadora AP; no implican mezclar todas las rutas en una compra.'
 ,Udyr:'Sus rutas AD y AP/tanque priorizan habilidades y objetos diferentes. Los ejemplos toman una dirección de luchador AP como referencia y deben adaptarse a la habilidad que priorices.'
 ,Varus:'Tiene rutas de ataques, letalidad y AP con objetivos distintos. Aquí se toma la ruta de ataques y efectos al impacto como referencia; no es una build completa para las otras rutas.'
 ,Kaisa:'AD, AP y velocidad de ataque pueden cambiar su patrón y las evoluciones de su kit. Esta orientación usa una ruta de ataques como referencia; decide una dirección coherente.'
};
const phase=(focus,priorities,reason,items,adapt)=>({focus,priorities,reason,items:items.map(String),adapt});
const templates={
 fighter:{role:'Luchador',style:'Daño y supervivencia',curve:['Según duelo','Objetos de luchador','Aguante y acceso'],rule:'Combina una fuente de daño con vida y aceleración. Adelanta resistencias si no sobrevives para repetir habilidades.',stages:[
 phase('Un primer objeto de luchador',['AD','Vida'],'Busca sinergia con ataques o habilidades, según el kit. Los ejemplos son alternativas para evaluar, no una compra universal.',[3078,6610,6692],'Revisa si tu campeón aprovecha Espada Encantada antes de elegir Trinidad.'),
 phase('Más rotaciones y aguante',['Aceleración','Vida'],'Combina el daño ya adquirido con estadísticas que te permitan mantenerte cerca del rival.',[3071,3161,3053],'Contra armadura, valora reducción o penetración; contra una ráfaga, una defensa puede ser más urgente.'),
 phase('Defenderte de la amenaza real',['Armadura / RM','Protección'],'Completa resistencias según el enemigo y tu función en la pelea.',[6333,3156,3026],'Un objeto defensivo puede aportar más daño real si te permite seguir peleando.') ]},
 adAssassin:{role:'Asesino AD',style:'Ráfaga y letalidad',curve:['Según objetivo','Ráfaga con objetos','Acceso y penetración'],rule:'Busca AD y penetración para amenazar a objetivos vulnerables; añade protección cuando una habilidad enemiga impida la entrada.',stages:[
 phase('AD y una dirección de letalidad',['AD','Letalidad'],'La penetración plana favorece el daño físico contra poca armadura.',[3142,6698],'Elige el objeto por acceso, limpieza y función; no todos los asesinos necesitan el mismo primero.'),
 phase('Acceder y completar el daño',['Letalidad','Protección'],'Una protección contra una habilidad puede ser más útil que sumar daño sin poder entrar.',[3814,6699,6695],'Colmillo de Serpiente es una respuesta situacional a escudos, no una compra automática.'),
 phase('Adaptarte a armadura y control',['Penetración','Supervivencia'],'La penetración porcentual responde a armadura; una segunda oportunidad puede proteger una ventaja.',[6694,3026],'Más letalidad no soluciona por sí sola una pelea contra cinco enemigos agrupados.') ]},
 adc:{role:'Tirador',style:'Ataques y crítico',curve:['Depende del intercambio','AD y crítico','Daño con posición'],rule:'Construye daño de ataques y la sinergia de crítico de tu campeón; conserva una respuesta para sobrevivir y seguir disparando.',stages:[
 phase('Primer motor de ataques',['AD','Sinergia de ataques'],'Elige un objeto que encaje con el patrón de ataques, en vez de comprar solo por su precio.',[3032,6672],'Matakrakens y una ruta de crítico no tienen la misma función; elige una ruta coherente.'),
 phase('Potenciar tus ataques',['Crítico','AD / velocidad'],'Crítico y sus amplificadores funcionan según lo que ya construiste. No todos los tiradores aprovechan igual la velocidad.',[3031,3046,3085],'Huracán exige ataques a distancia y objetivos accesibles; no es una respuesta universal.'),
 phase('Penetración y tiempo para atacar',['Penetración','Supervivencia'],'Adapta penetración contra armadura y protección según el daño enemigo.',[3036,3033,3072,3026],'Anticuraciones y penetración deben responder a lo que necesita la partida.') ]},
 onhit:{role:'Duelista de ataques',style:'Velocidad de ataque / on-hit',curve:['Según duelo','Sinergias de ataques','Depende de poder golpear'],rule:'Combina un motor de ataques con efectos que tu kit aplique; añade aguante cuando el rival te impida seguir atacando.',stages:[
 phase('AD y ataques sostenidos',['AD','Velocidad de ataque'],'Una fuente de efectos al impacto puede apoyar el duelo y la limpieza.',[3153,6672],'No toda habilidad aplica todos los efectos al impacto; revisa el kit.'),
 phase('Completar la sinergia',['On-hit','Velocidad de ataque'],'Guinsoo, Terminus y Al Filo de la Cordura ofrecen funciones distintas; valora daño, penetración y defensa.',[3124,3302,3091],'No necesitas acumular todas estas opciones: reserva espacio para la amenaza rival.'),
 phase('Sobrevivir para aplicar el daño',['Resistencias','Protección'],'La defensa aporta valor si permite mantener ataques en una pelea real.',[3026,6333,3156],'La cantidad de daño potencial no evita perderlo todo durante un control de masas.') ]},
 mage:{role:'Mago',style:'Habilidades y daño mágico',curve:['Niveles y recursos','AP y rotaciones','Penetración y posición'],rule:'AP es la base; completa recursos y aceleración si tu kit los necesita. Ajusta penetración y protección a los objetivos.',stages:[
 phase('AP y recursos del kit',['AP','Maná si corresponde'],'Un primer objeto debe permitir usar tus habilidades con el ritmo que pide tu campeón.',[6655,2503],'Los objetos de maná solo son apropiados si tu campeón utiliza maná.'),
 phase('Aumentar el impacto del AP',['AP','Aceleración / penetración'],'Rabadon amplifica AP construido; otras opciones favorecen daño a enemigos vulnerables o rotaciones.',[3089,4645],'La posición y acertar habilidades determinan cuánto de ese daño puedes aplicar.'),
 phase('Responder a RM y amenazas',['Penetración mágica','Protección'],'Báculo del Vacío ayuda contra RM; Zhonya y Banshee ofrecen defensas distintas.',[3135,3157,3102],'Elige la defensa por la habilidad y el tipo de daño que te matan.') ]},
 apAssassin:{role:'Asesino AP',style:'Ráfaga y acceso',curve:['Elegir intercambios','AP y acceso','Amenaza sobre vulnerables'],rule:'Prioriza AP y una entrada viable; velocidad de ataque o maná solo si ayudan al patrón concreto de tu campeón.',stages:[
 phase('AP con una función clara',['AP','Acceso / ráfaga'],'Un primer objeto puede facilitar la entrada o potenciar un ataque entre habilidades.',[3152,3100],'Maldición del Liche exige aprovechar su ataque potenciado; no sirve igual para todos los kits.'),
 phase('Elevar la amenaza de eliminación',['AP','Penetración mágica'],'Amplifica AP o daño contra objetivos vulnerables según tus compras y la RM del rival.',[3089,4645],'Si una ráfaga te mata antes de completar el daño, valora defensa antes.'),
 phase('Penetrar y poder salir',['Penetración','Protección'],'Adapta penetración a RM y una respuesta defensiva a los controles o daño relevantes.',[3135,3157,3102],'La protección no convierte una entrada sin información en una pelea favorable.') ]},
 apFighter:{role:'Luchador AP',style:'Daño mágico sostenido',curve:['Según duelo','AP y aguante','Resistir para repetir'],rule:'Combina AP con vida y tiempo de combate. Velocidad de ataque, maná y aceleración dependen de cómo aplica daño tu kit.',stages:[
 phase('AP con supervivencia',['AP','Vida'],'Agrietador y Liandry representan funciones de peleas prolongadas; comprueba cuál aprovecha tu patrón de daño.',[4633,6653],'Un efecto de daño prolongado no siempre es la mejor respuesta para una ventana muy corta.'),
 phase('Mantenerte peleando',['AP','Vida / aceleración'],'La movilidad o la protección pueden dar margen para repetir habilidades.',[4629,3157],'Nashor es situacional para kits que mantienen ataques; AP no implica necesitarlo.'),
 phase('Penetración y defensa adaptada',['Penetración mágica','Resistencias'],'Alterna daño útil y defensa contra la amenaza principal.',[3135,3102,3065],'Una resistencia puede rendir más que otro objeto ofensivo si mueres sin repetir habilidades.') ]},
 apOnhit:{role:'Atacante AP',style:'AP y ataques repetidos',curve:['Niveles y seguridad','AP y velocidad','Daño con espacio'],rule:'El AP y los ataques trabajan juntos; protege tu posición para aprovechar el tiempo de ataque.',stages:[
 phase('Un motor de AP y ataques',['AP','Velocidad de ataque'],'Nashor ofrece AP y velocidad en un objeto; evalúa cuándo puedes mantener ataques.',[3115],'Si el rival impide atacar, no valores solo las estadísticas de daño potencial.'),
 phase('Aumentar el daño útil',['AP','Sinergia del kit'],'Rabadon amplifica AP; una opción de efectos al impacto requiere comprobar su interacción con tus ataques o habilidades.',[3089,3124],'Guinsoo no se aplica de la misma forma a todas las habilidades especiales.'),
 phase('Penetrar y conservar el acceso',['Penetración mágica','Protección'],'RM enemiga y el riesgo de entrada o posición determinan las últimas compras.',[3135,3157,3102],'Prioriza sobrevivir a la amenaza que corta tu tiempo de ataque.') ]},
 tank:{role:'Tanque',style:'Vida, resistencias y control',curve:['Utilidad del kit','Aguante y rotaciones','Control y protección'],rule:'Combina vida con resistencias frente al daño recibido; la aceleración ayuda a repetir el control y otras herramientas.',stages:[
 phase('Aguante para tu enfrentamiento',['Vida','Armadura / RM'],'Elige daño físico o mágico como referencia defensiva; un objeto de limpieza puede ayudar en línea o jungla.',[3068,6664],'Estas compras de economía alta no son un inicio universal para un soporte.'),
 phase('Resistencias que acompañen la vida',['Armadura / RM','Aceleración'],'Adapta la defensa al enemigo que más amenaza y a tu función en la pelea.',[3143,4401,2504],'No acumules solo vida sin considerar daño porcentual ni resistencias.'),
 phase('Mantener el control y la protección',['Resistencias','Utilidad'],'Una defensa combinada o una respuesta a curación puede completar tu función.',[6665,3075,3065],'Cota de Espinas aplica anticuraciones bajo condiciones; no sustituye cualquier fuente de anticuración.') ]},
 engage:{role:'Soporte de iniciación',style:'Control y protección',curve:['Control disponible','Utilidad con poco oro','Decisiones de entrada'],rule:'Tu economía de soporte favorece objetos de utilidad y defensa eficientes. Protege a quien aporta daño o facilita una entrada con seguimiento.',stages:[
 phase('Utilidad con presupuesto de soporte',['Vida','Resistencias','Aceleración'],'Solari o Zeke ofrecen funciones distintas de protección o pelea cerca del objetivo.',[3190,3050],'No retrases toda tu utilidad intentando copiar la build cara de un tanque de otra posición.'),
 phase('Proteger a tu condición de victoria',['Utilidad','Defensa'],'Promesa del Caballero puede apoyar a un aliado; otros objetos responden a la composición.',[3109,3110],'Corazón de Hielo está orientado a ataques físicos y requiere valorar si tu kit aprovecha su maná.'),
 phase('Responder a la amenaza de equipo',['Armadura / RM','Utilidad'],'La defensa debe ayudarte a completar tu control, rescate o protección.',[3143,4401,3190],'Entrar primero y proteger al aliado son funciones distintas: compra para la que necesita tu partida.') ]},
 enchanter:{role:'Soporte de utilidad',style:'Protección y amplificación',curve:['Herramientas de línea','Utilidad con poco oro','Impacto mediante aliados'],rule:'Compra para la curación, escudos, mejoras o control que sí tiene tu kit. No todas las pasivas de soporte sirven para todos los campeones.',stages:[
 phase('Un primer objeto que active tu kit',['Utilidad','Aceleración'],'Renovador de Piedra Lunar, Ecos de Helia o Shurelya tienen condiciones y usos distintos.',[6617,6620,2065],'Revisa si puedes activar curación o escudos antes de comprar una pasiva que los exige.'),
 phase('Amplificar al aliado adecuado',['Curación / escudos','Utilidad'],'Pebetero beneficia patrones de ataques; Báculo de Agua Fluyente favorece otros aliados y rotaciones.',[3504,6616],'Selecciona la mejora según quién puede aprovecharla, no solo por su AP.'),
 phase('Utilidad para la pelea decisiva',['Protección','Aceleración'],'Redención y Mikael ofrecen respuestas de equipo diferentes.',[3107,3222],'Una respuesta a control solo sirve si puedes aplicarla en la situación adecuada.') ]}
};

export function standardGuide(c){
 const id=c.id;const roles=Object.entries(positions).filter(([,ids])=>ids.has(id)).map(([r])=>r);
 const classes=(c.tags||[]).map(t=>classNames[t]||t);
 let archetype='fighter';
 if(supportTanks.has(id))archetype='engage';
 else if(enchanters.has(id))archetype='enchanter';
 else if(tanks.has(id))archetype='tank';
 else if(apAttack.has(id))archetype='apOnhit';
 else if(apFighters.has(id))archetype='apFighter';
 else if(ap.has(id))archetype=c.tags.includes('Assassin')?'apAssassin':'mage';
 else if(adAssassins.has(id))archetype='adAssassin';
 else if(onhit.has(id))archetype='onhit';
 else if(c.tags.includes('Marksman')||critFighters.has(id))archetype='adc';
 const t=structuredClone(templates[archetype]);
 const buildFamilies=enchanters.has(id)?['AP','Utilidad']:tanks.has(id)?['Tanque']:hybrid.has(id)?['AD','AP','Híbrido']:ap.has(id)?['AP']:['AD'];
 let build=hybrid.has(id)?'Híbrido':enchanters.has(id)?'Utilidad / AP':tanks.has(id)?'Tanque':ap.has(id)?'AP':'AD';
 let damageFamily=mixed.has(id)?'Mixto':ap.has(id)||enchanters.has(id)||magicTanks.has(id)?'Mágico':'Físico';
 if(id==='Chogath')damageFamily='Mágico';
 const damage=(damageFamily==='Mixto'?'Mixto':damageFamily+' principalmente')+(trueDamage.has(id)?' + verdadero en su kit':'');
 const usesMana=c.partype==='Maná';
 if(archetype==='mage'&&!usesMana)t.stages[0]=phase('AP sin invertir en maná',['AP','Ráfaga / acceso'],'Elige AP y una función ofensiva apropiada; tu recurso no necesita una reserva de maná.',[3152,4646],'Compara acceso, daño y supervivencia según la forma de combatir del campeón.');
 if(archetype==='fighter'&&set('Aatrox Ambessa Riven Renekton RekSai Hecarim LeeSin').has(id))t.stages[0]=phase('AD y aguante para habilidades',['AD','Vida / escudo'],'Una ruta de luchador basada en habilidades puede priorizar daño y supervivencia en sus primeros intercambios.',[6692,6610],'No elijas Trinidad por ser un luchador: necesitas aprovechar su patrón de ataque potenciado.');
 if(archetype==='fighter'&&set('Darius Garen Sett Illaoi Yorick Urgot').has(id))t.stages[0]=phase('AD con vida y acceso',['AD','Vida'],'Una herramienta de limpieza o para mantener al rival cerca puede sostener tu patrón de luchador.',[6631,3748],'Elige según limpieza, acceso y habilidades; no todos estos objetos son igual de apropiados para cada kit.');
 if(manaDps.has(id))t.stages[0]=phase('AP y recursos para sostener habilidades',['AP','Maná'],'Valora recursos y daño sostenido: Vara de las Edades, Serafín o Liandry responden a necesidades distintas.',[6657,3003,6653],'Los objetos que requieren progresión de recursos necesitan tiempo; comprueba su receta y condición.');
 if(id==='Ezreal')t.stages[0]=phase('AD y habilidades con ataques',['AD','Maná','Aceleración'],'Trinidad y Manamune son opciones para una ruta de habilidades y ataques; revisa la progresión de recursos.',[3078,3004],'No copies sin más una ruta de velocidad y crítico de otro tirador.');
 if(id==='Ezreal'){
  t.style='Habilidades AD y ataques potenciados';t.rule='Prioriza AD, maná y aceleración para sus habilidades. Las opciones de crítico no reemplazan automáticamente esas necesidades.';
  t.stages[1]=phase('Repetir habilidades y aplicar daño',['AD','Aceleración'],'Lanza de Shojin es una opción para una ruta centrada en habilidades. Ajusta la compra al daño y a la defensa que ya tiene tu objetivo.',[3161,6694],'No valores crítico solo porque el campeón sea un tirador.');
  t.stages[2]=phase('Penetración y margen para disparar',['Penetración','Supervivencia'],'Serylda puede responder a armadura y Ángel Guardián a una entrada peligrosa.',[6694,3026,3072],'Elige según lo que te impide mantener el patrón de habilidades y ataques.');
 }
 if(id==='Azir')t.stages[1]=phase('Potenciar el AP de tus soldados',['AP','Aceleración'],'Rabadon y Liandry son opciones para ampliar daño mágico en patrones distintos.',[3089,6653],'No todos los efectos al impacto funcionan con soldados como con un ataque básico normal.');
 if(id==='Jhin'){
  t.stages[0]=phase('Daño por disparo',['AD','Crítico'],'El Coleccionista o una ruta hacia Filo del Infinito son opciones de daño por disparo que deben encajar con tu economía.',[6676,3031],'Su patrón de cuatro disparos hace que la velocidad de ataque tenga un uso distinto al de otros tiradores.');
  t.stages[1]=phase('Crítico y acceso al disparo',['AD','Crítico','Alcance situacional'],'Filo del Infinito amplifica crítico; Cañón de Fuego Rápido puede facilitar un disparo de apertura.',[3031,3094],'No copies sin revisar una build que depende de muchos ataques consecutivos.');
 }
 if(id==='Gangplank')t.stages[0]=phase('AD y ataque potenciado',['AD','Espada Encantada'],'Trinidad es una opción para alternar habilidades y ataques potenciados.',[3078],'La ruta posterior puede incluir crítico; evalúa economía y riesgo.');
 if(['Yasuo','Yone','Tryndamere','Nilah'].includes(id))t.stages[0]=phase('Daño de ataques con supervivencia',['AD','Ataques / crítico'],'Rey Arruinado o Arcoescudo representan funciones distintas; elige según el patrón y el riesgo de duelo.',[3153,6673],'No todos los objetos de tirador a distancia tienen sentido para este campeón.');
 if(id==='Pyke')t.stages[0]=phase('AD y utilidad de soporte',['AD','Letalidad'],'Espada de la Penumbra y Youmuu son opciones para amenaza y movilidad desde una economía de soporte.',[3179,3142],'La vida adicional se convierte en AD por su pasiva.');
 if(id==='Senna'){t.role='Tiradora de utilidad';t.rule='Equilibra ataques y utilidad con tu economía de soporte. Las almas aportan parte de tu progresión.';t.stages[0]=phase('AD con función de soporte',['AD','Utilidad'],'Evalúa una compra que refuerce tus ataques y el papel que necesitas cumplir en la línea.',[3071,3179],'No presupongas la economía de un tirador que recibe todo el farmeo.');t.stages[1]=phase('Aprovechar ataques y progresión',['AD','Alcance / crítico'],'Cañón de Fuego Rápido y Filo del Infinito responden a funciones distintas según la progresión conseguida.',[3094,3031],'Valora qué compra puedes completar sin retrasar la utilidad que requiere tu equipo.');}
 if(id==='Zilean'){
  t.stages[0]=phase('Recursos y utilidad de soporte',['Maná','Aceleración','Utilidad'],'Shurelya aporta una herramienta de movimiento; Mandato Imperial puede apoyar un patrón de control.',[2065,4005],'No tiene una curación o un escudo frecuente para activar todas las pasivas de encantador.');
  t.stages[1]=phase('Más rotaciones y apoyo',['Aceleración','Utilidad'],'Adapta AP y utilidad al daño o protección que necesita tu equipo.',[3137,3107],'No compres amplificadores de curación o escudos sin comprobar cómo los aplicaría su kit.');
  t.stages[2]=phase('Poder usar tu herramienta de rescate',['Supervivencia','Utilidad'],'Una respuesta a control o una protección propia puede permitir completar tu función.',[3222,3102],'La utilidad de la R depende de poder activarla a tiempo y sobre el aliado adecuado.');
 }
 const summary=customNotes[id]||`Su perfil de ${t.role.toLowerCase()} orienta la compra hacia ${t.style.toLowerCase()}. El impacto cambia con niveles, objetos, economía y acceso al objetivo; no depende de un minuto fijo. Consulta sus habilidades oficiales para comprobar qué estadísticas y efectos aprovecha.`;
 return {id,build,buildFamilies,damage,damageFamily,role:t.role,style:t.style,curve:t.curve,summary,rule:t.rule,stages:t.stages,roles:roles.length?roles:['Centro'],classes,aliases:aliases[id]||[],archetype,guideKind:'archetype',guideLabel:'Orientación por arquetipo',usesMana};
}
