/* Dati del sito Mezzolitro: menu, cantina, tavola che gira, orari */
window.DATA = {
  tel: '+390291327868',
  telLabel: '+39 02 9132 7868',

  /* Orari: 0 = domenica ... 6 = sabato. Fasce in minuti dalla mezzanotte */
  hours: [
    { d: 'Lunedì',    slots: [[19 * 60, 23 * 60]] },
    { d: 'Martedì',   slots: [[12 * 60 + 15, 14 * 60], [19 * 60, 23 * 60]] },
    { d: 'Mercoledì', slots: [[12 * 60 + 15, 14 * 60], [19 * 60, 23 * 60]] },
    { d: 'Giovedì',   slots: [[12 * 60 + 15, 14 * 60], [19 * 60, 23 * 60]] },
    { d: 'Venerdì',   slots: [[12 * 60 + 15, 14 * 60], [19 * 60, 23 * 60]] },
    { d: 'Sabato',    slots: [[12 * 60 + 15, 14 * 60], [19 * 60, 23 * 60]] },
    { d: 'Domenica',  slots: [] }
  ],

  /* Piatti della tavola che gira: [file, nome] */
  dishes: [
    ['dish-1', 'Tartare di pecora'],
    ['dish-2', 'Cecì e cicoria'],
    ['dish-3', 'Fettuccine al tartufo'],
    ['dish-4', 'Fettuccine all’abruzzese'],
    ['dish-5', 'Pallotte cacio e ova'],
    ['dish-6', 'Pappardelle al ragù di papera']
  ],

  /* Menu: categorie con foto abbinata */
  menu: [
    { id: 'antipasti', name: 'Antipasti', img: 'qualita', items: [
      ['Il pecoreccio', 'Tagliere di salumi e formaggi artigianali abruzzesi o solo selezione di pecorini abruzzesi', '16'],
      ['Pallotte cacio e ova', 'Polpette di pane e pecorino con salsa di pomodoro fresco', '10'],
      ['Pallotte cacio e ova a “modo nostro”', 'Polpette di pane e pecorino con crema cacio e pepe', '11'],
      ['L’ovetto co je scorzone', 'Uovo al tegamino con scaglie di tartufo scorzone abruzzese', '12'],
      ['Cecì e cicoria', 'Zuppetta in terrina di ceci abruzzesi e cicorietta selvatica', '13'],
      ['Prosciutto crudo nostrano', 'Prosciutto abruzzese paesano tagliato al coltello con la nostra focaccia', '16']
    ]},
    { id: 'primi', name: 'Primi piatti', img: 'dettagli', items: [
      ['Chitarra alla teramana', 'Spaghetti alla chitarra con polpettine fatte a mano di carne di manzo e maiale, pomodoro e pecorino', '16'],
      ['Fettuccine all’abruzzese', 'Fettuccine con battuto di erbette, cipolla, guanciale, pecorino e scaglie di tartufo scorzone vastese', '18'],
      ['Pappardelle al ragù di papera', 'Pasta lavorata a mano con ragù di papera rosolata nel vino Pecorino, profumi dell’orto e pomodoro', '18'],
      ['Ceppe alla marsicana', 'Pasta artigianale abruzzese, acqua e farina, con melanzane, salsiccia e caciocavallo', '16'],
      ['I ravioli “de na vota”', 'Ravioli ricotta e spinaci con pomodoro e pecorino', '14']
    ]},
    { id: 'secondi', name: 'Secondi piatti', img: 'spec-arrosticini', items: [
      ['Costolette “d’agnello”', 'Costolette di agnello IGP dell’Az. Agr. F.lli Testone, al profumo di rosmarino', '28'],
      ['Tagliata di pecora', 'Tagliata di carne di pecora dell’Az. Agr. F.lli Testone, con spinacino crudo, olio, sale e limone', '19'],
      ['Tartare di pecora', 'Battuta di carne di pecora dell’Az. Agr. F.lli Testone con crema di carote, menta e cipolle caramellate', '19'],
      ['La pecora “polentona”', 'Spezzatino di carne di pecora F.lli Testone con polenta grigliata', '24'],
      ['Le rustelle', 'Arrosticini di carne di pecora dell’Az. Agr. F.lli Testone, fatti a mano, con bruschette', '14'],
      ['Porchetta teramana con scaglie di tartufo', 'Porchetta al forno con scaglie di tartufo scorzone vastese', '16'],
      ['Stracotto al Montepulciano d’Abruzzo', 'Manzo a lunga cottura nel vino Montepulciano d’Abruzzo e profumi di cannella', '20']
    ]},
    { id: 'contorni', name: 'Contorni', img: 'atmosfera-2', items: [
      ['Le “patane”', '', '6'],
      ['La caponatina', '', '7'],
      ['Cicoria ripassata', '', '6'],
      ['Contorno del giorno', '', '6']
    ]},
    { id: 'dolci', name: 'Dolci', img: 'dolci-4', items: [
      ['Il pecoramisù', '', '8'],
      ['Il fiadone di Nonna Maria', '', '8'],
      ['Il cannolo del Castello', '', '8'],
      ['Torta cioccolato e mandorle', '', '8'],
      ['Il dolce del giorno', '', '9']
    ]},
    { id: 'amari', name: 'Amari abruzzesi', img: 'vini-2', items: [
      ['Genziana', '', '5'],
      ['Ratafia', '', '5'],
      ['Centerba', '', '5'],
      ['Liquirizia', '', '6'],
      ['Centuca', '', '5'],
      ['Amaro Taccone', '', '5'],
      ['Amaro forte e gentile', '', '5'],
      ['Distillati', 'Possibile visionare la carta', '']
    ]}
  ],

  /* Cantina: sezioni di vini [nome, produttore, prezzo] */
  wine: [
    { t: 'Le bollicine', rows: [
      ['Pecorino spumante brut', 'San Giacomo · Rocca S. G. (CH)', '27'],
      ['Prosecco Valdobbiadene DOCG', '', '28'],
      ['Franciacorta', '', 'da 53']
    ]},
    { t: 'I bianchi', rows: [
      ['Passerina', 'Antonini · S. E. Vibrata (TE)', '25'],
      ['Trebbiano', 'Antonini · S. Egidio (TE)', '25'],
      ['“Giocheremo con i fiori” Pecorino', 'Torre dei Beati · Loreto A. (PE)', '27'],
      ['“La Canaglia” Pecorino', 'Fontefico · Vasto (CH)', '29'],
      ['Pecorino Superiore', 'Pesolillo · Colle R. (CH)', '29'],
      ['Pecorino “La foia”', 'Fontefico · Vasto (CH)', '36']
    ]},
    { t: 'I rosati', rows: [
      ['“Fossimatto” Montepulciano', 'Fontefico · Vasto (CH)', '29'],
      ['“Fonte Cupa” Montepulciano', 'Camillo Montori · Controguerra (TE)', '29'],
      ['Rosato Terre di Chieti', 'Pesolillo · Colle R. (CH)', '29']
    ]}
  ]
};
