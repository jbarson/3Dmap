var systemsArr=[
{id: 1,  x:  0.00, y:  0.00, z:  0.00, sysName:"Sol",             planetName: "Earth", type: ["G2V"], absMag: [4.85], mass: [1.00]},
{id: 2,  x:  0.13, y:  1.26, z: -5.15, sysName:"Luyten 722-22",   type: ["M"], absMag: [13.44], mass: [0.18]},
{id: 3,  x:  2.75, y: -3.48, z: -5.66, sysName:"Zeta Tucanae",    planetName: "Xing Cheng", type: ["F9V"], absMag: [4.549391764], mass: [0.99]},
{id: 4,  x: -2.06, y:  3.37, z: -6.21, sysName:"BD+04°123",       type: ["K2V"], absMag: [6.376172096], mass: []},
{id: 5,  x:  2.69, y: -4.64, z: -6.30, sysName:"CP-68°41",        type: ["M"], absMag: [10.24705255], mass: []},
{id: 6,  x:  1.14, y: -3.19, z: -5.80, sysName:"P Eridani",       type: ["K0V"], absMag: [6.345107504], mass: []},
{id: 7,  x: -4.50, y:  3.92, z: -5.19, sysName:"107 Piscium",     planetName:"Schwarzvaal", type: ["K1V"], absMag: [5.85406505], mass: [0.83]},
{id: 8,  x: -5.37, y:  2.80, z: -5.91, sysName:"USNO 694",        type: ["M"], absMag: [16.15308738], mass: []},
{id: 9,  x: -4.99, y:  1.49, z: -5.71, sysName:"BD+06°398",       type: ["K3V"], absMag: [6.530695401], mass: []},
{id: 10, x: -4.27, y: -0.91, z: -7.06, sysName:"BD-13°544",       type: ["K"], absMag: [12.38635648], mass: []},
{id: 11, x: -6.15, y:  0.50, z: -5.80, sysName:"GJ 1057",         type: ["M"], absMag: [14.16124949], mass: []},
{id: 12, x: -6.99, y:  0.22, z: -6.54, sysName:"Kappa Ceti",      type: ["G5Vvar"], absMag: [5.01071545], mass: [1.037]},
{id: 13, x: -1.15, y: -3.30, z: -5.20, sysName:"82 Eridani",      type: ["G8V"], absMag: [5.347682914], mass: [0.7]},
{id: 14, x: -6.38, y: -2.09, z: -6.95, sysName:"Delta Eridani",   type: ["K0IV"], absMag: [3.748382928], mass: []},
{id: 15, x: -3.56, y: -1.35, z: -2.97, sysName:"40(O2) Eridani",  type: ["K1V"], absMag: [5.915956445], mass: []},
{id: 16, x: -1.43, y: -5.62, z: -5.70, sysName:"GJ 2034",         type: ["D"], absMag: [14.80952556], mass: []},
{id: 17, x: -6.78, y: -1.37, z: -2.94, sysName:"1 Pi(3)Orionis",  type: ["F6V"], absMag: [3.667590212], mass: []},
{id: 18, x: -7.28, y: -3.41, z: -4.13, sysName:"BD-05°1123",      type: ["K3V"], absMag: [6.494213896], mass: []},
{id: 19, x: -5.00, y: -5.32, z: -3.29, sysName:"Gamma Leporis",   planetName: "Concord", type: ["F7V"], absMag: [3.816179577], mass: [1.23]},
{id: 20, x: -4.80, y: -2.20, z: -0.95, sysName:"NN 3379",         type: ["M4"], absMag: [12.68106427], mass: []},
{id: 21, x:  2.09, y: -7.39, z: -4.22, sysName:"Alpha Mensae",    planetName:"Novoya Rossiya / Nova Brazil", type: ["G5V "], absMag: [5.04806279], mass: [0.96]},
{id: 22, x: -1.76, y: -1.91, z: -0.41, sysName:"Sirius",          type: ["A0m"], absMag: [1.464398907], mass: [1.99]},
{id: 23, x: -7.26, y: -5.60, z: -0.35, sysName:"BD-05°1844",      planetName:"Pacifica", type: ["K3V"], absMag: [6.892355964], mass: []},
{id: 24, x: -2.84, y: -1.89, z:  0.79, sysName:"Procyon",         type: ["F5IV-V"], absMag: [2.661298621], mass: [1.42]},
{id: 25, x: -4.89, y: -3.54, z:  1.45, sysName:"YZ Canis Minoris",type: ["M4.5Ve"], absMag: [12.33415905], mass: [0.20]},
{id: 26, x: -6.55, y: -5.49, z:  2.04, sysName:"Luyten 961-1",    type: ["M"], absMag: [13.78071131], mass: []},
{id: 29, x: -5.19, y: -3.51, z:  2.52, sysName:"Ross 619",        type: ["M5"], absMag: [13.68130858], mass: []},
{id: 32, x: -2.93, y: -0.90, z:  1.95, sysName:"DX Cancri",       type: ["M6.5"], absMag: [17.01297131], mass: [0.09]},
{id: 37, x: -3.73, y: -1.95, z:  3.11, sysName:"GJ 1116",         type: ["M","M"], absMag: [15.46857485,16.32857485], mass: []},
{id: 38, x: -2.89, y: -2.44, z:  2.38, sysName:"NN 3522",         type: ["M"], absMag: [12.64124009], mass: []},
{id: 46, x: -2.79, y:  0.70, z:  3.70, sysName:"BD+50°1725",      type: ["K"], absMag: [10.31922222], mass: []},
{id: 47, x: -2.29, y: -1.69, z:  4.00, sysName:"AD Leonis",       type: ["M4.5Ve"], absMag: [10.94708613], mass: []},
{id: 48, x: -0.58, y: -1.20, z:  1.99, sysName:"Wolf 359",        type: ["M6"], absMag: [16.55743932], mass: [0.09]},
{id: 49, x: -2.40, y: -1.77, z:  6.24, sysName:"AC+23°468-46",    type: ["M3"], absMag: [10.91430944], mass: []},
{id: 50, x: -1.04, y: -0.09, z:  2.29, sysName:"Lalande 21185",   type: ["M2V"], absMag: [10.44864499], mass: [0.46]},
{id: 51, x: -2.47, y:  3.29, z:  3.21, sysName:"AC+79°3888",      type: ["M4"], absMag: [12.14148544], mass: [0.225]},
{id: 52, x: -2.86, y:  1.80, z:  7.48, sysName:"GJ 1151",         type: ["M"], absMag: [13.67823644], mass: []},
{id: 53, x: -2.12, y:  0.12, z:  7.81, sysName:"BD+36°2219",      type: ["M1V"], absMag: [10.06944403], mass: []},
{id: 54, x: -2.37, y:  0.49, z:  8.27, sysName:"Groombridge 1830",type: ["K"], absMag: [6.641312036], mass: [0.661]},
{id: 56, x:  0.45, y: -1.30, z:  4.08, sysName:"FL Virginis",     type: ["M5.5eJ","M7"], absMag: [14.86931108,15.12931108], mass: [0.12,0.12]},
{id: 57, x: -1.59, y:  1.53, z:  8.43, sysName:"Beta Canum Venaticorum", planetName:"Damso", type: ["G0V"], absMag: [4.656112552], mass: [1.025]},
{id: 58, x:  0.49, y:  0.46, z:  8.32, sysName:"Beta Comae Berenices", type: ["G0V"], absMag: [4.451709668], mass: [1.15]},
{id: 59, x:  0.83, y:  0.95, z:  7.84, sysName:"NN 3789",         type: ["M4 e"], absMag: [12.45185273], mass: []},
{id: 60, x:  2.78, y:  0.26, z:  9.13, sysName:"Eta Boötis",      type: ["G0IV"], absMag: [2.406604204], mass: [1.71]},
{id: 61, x:  0.96, y: -0.93, z: -0.02, sysName:"Alpha Centauri",  planetName:"Olympia", type: ["G2V","K1V"], absMag: [4.36237068,5.69237068], mass: [1.14,0.92]},
{id: 62, x:  4.49, y: -1.79, z:  3.10, sysName:"BD-20°4125",      type: ["K4V"], absMag: [6.893541299], mass: []},
{id: 63, x:  4.83, y: -0.50, z:  4.07, sysName:"BD-07°4003",      type: ["M5"], absMag: [11.5740757], mass: []},
{id: 64, x:  5.95, y:  1.16, z:  2.34, sysName:"V1054 Ophiuchi",  type: ["M3Ve"], absMag: [10.89561468], mass: []},
{id: 65, x:  7.19, y: -2.30, z: -0.69, sysName:"41 Arae",         planetName:"Refuge", type: ["G"], absMag: [5.810902117], mass: []},
{id: 66, x:  7.07, y: -1.01, z:  0.18, sysName:"CD-34°11626",     type: ["K4V"], absMag: [7.1], mass: []},
{id: 67, x:  4.55, y: -1.14, z: -0.55, sysName:"CD-44°11909",     type: ["M"], absMag: [], mass: []},//???
{id: 68, x:  4.27, y:  2.46, z:  0.99, sysName:"70 Ophiuchi",     type: ["K0V SB"], absMag: [5.7], mass: [0.92]},
{id: 69, x:  2.83, y:  0.57, z: -0.52, sysName:"AC-24°2833-183",  type: ["M3.5Ve "], absMag: [13.1], mass: [0.17]},
{id: 70, x: -1.02, y:  5.11, z:  2.09, sysName:"Sigma Draconis",  planetName: "Medina", type: ["K0V"], absMag: [5.875370691], mass: [0.89]},//(G or K?)
{id: 71, x:  0.90, y:  4.58, z:  0.70, sysName:"V1581 Cygni",     type: ["M5.5 V e"], absMag: [15.0416793], mass: [0.11]},
{id: 72, x:  4.16, y: -2.42, z: -3.06, sysName:"Delta Pavonis",   planetName:"Altiplano", type: ["G5IV-Vvar"], absMag: [4.630641309], mass: [1.1]},
{id: 73, x:  0.46, y:  3.41, z: -0.35, sysName:"61 Cygni",        type: ["K5V", "K7V"], absMag: [8.3,7.5], mass: [0.70,0.63]},
{id: 74, x:  2.12, y: -0.93, z: -2.57, sysName:"Epsilon Indi",    type: ["K5V ","T","T"], absMag: [6.9], mass: [0.77,0.03,0.03]},
{id: 75, x: -1.01, y:  3.84, z:  0.00, sysName:"Krüger 60",       type: ["M2V","M"], absMag: [11.84], mass: [0.28,0.16]},
{id: 76, x:  1.26, y:  1.36, z: -2.85, sysName:"EZ Aquarii",      type: ["M5 e ","M","M"], absMag: [15.00], mass: [0.11,0.11,0.08]},
{id: 77, x:  0.43, y:  3.66, z: -6.20, sysName:"GJ 1286",         type: ["M5"], absMag: [15.40], mass: []},
{id: 78, x:  4.36, y: -5.17, z: -6.40, sysName:"CP-73°2299",      type: ["K"], absMag: [10.72], mass: []},
{id: 79, x: -2.11, y: -0.60, z: -2.43, sysName:"Epsilon Eridani", type: ["K"], absMag: [6.19], mass: [0.82]},
{id: 80, x:  1.53, y:  0.91, z:  0.44, sysName:"Barnard's Star",  type: ["M4Ve"], absMag: [13.22], mass: [0.144]},
{id: 81, x: -0.99, y:  0.12, z: -3.35, sysName:"Tau Ceti",        type: ["G8.5 V"], absMag: [5.69], mass: [0.783]},
{id: 82, x: -0.65, y:  0.05, z: -2.55, sysName:"UV Ceti",         type: ["M5.5 V"], absMag: [12.57], mass:[0.102]},
{id: 83, x:  1.06, y: -0.31, z: -4.37, sysName:"CD-37°15492",     type:["M1.5V"],absMag:[10.35],mass:[0.45]},
{id: 84, x: -0.81, y: -2.46, z: -3.42, sysName:"GJ 1061",         type: ["M5.5 V"], absMag: [15.26], mass: [0.113]},
{id: 85, x: -0.08, y:  1.78, z: -4.35, sysName:"GJ 1002",         type: ["M5.5 V"], absMag: [15.37], mass: []},
{id: 86, x: -3.19, y:  4.98, z: -0.52, sysName:"Eta Cassiopeiae", type: ["FV[4]","K7 V[3]"], absMag: [3.44,7.51], mass: [0.972,0.57] },
{id: 88, x: -0.91, y:  4.86, z: -1.15, sysName:"EV Lacertae",     type: ["M3.5"], absMag: [10.09], mass: [0.35]},
{id: 89, x:  5.32, y:  1.04, z:  2.10, sysName:"Wolf 629",        type: ["M3.5 V"], absMag: [12.69], mass: [0.19]},
{id: 90, x:  2.58, y:  0.97, z: -5.89, sysName:"Fomalhaut",       type: ["A3 V"], absMag: [1.72], mass: [1.92]},
{id: 91, x:  0.67, y:  0.40, z: -7.49, sysName:"GJ 2005",         type: ["M6.0V C"], absMag: [], mass: []},
{id: 92, x:  2.82, y: -4.06, z: -4.12, sysName:"Beta Hydri",      type: ["G2 V"], absMag: [3.45], mass: [1.08]},
{id: 93, x:  3.71, y: -2.91, z: -4.90, sysName:"Luyten 119-44",   type: ["M3.5V"], absMag: [], mass: []},
{id:101, x: -4.83, y: -4.31, z: -4.21, sysName:"BD-21°1051",      type: ["K V"], absMag: [], mass: []},
{id:102, x: -6.47, y: -3.24, z: -6.06, sysName:"Luyten 806-34",   type: ["M0 V"], absMag: [], mass: []},
{id:103, x: -6.79, y: -1.81, z: -6.44, sysName:"GJ 1065",         type: ["M3.5 V"], absMag: [], mass: []},
{id:104, x: -2.60, y:  1.65, z: -3.24, sysName:"Luyten 1159-016", type: ["M8 e"], absMag: [], mass: []},
{id:105, x:  1.43, y:  0.13, z: -3.20, sysName:"Lacaille 9352",   type: ["M0.5V"], absMag: [], mass: []},
{id:106, x:  1.21, y:  2.64, z: -8.53, sysName:"NN 4360",         type: ["M"], absMag: [], mass: []},
{id:107, x:  2.68, y:  2.03, z: -7.03, sysName:"CD-23°17699",     type: ["K7+Vx"], absMag: [], mass: []},
{id:108, x:  3.52, y:  2.73, z: -7.43, sysName:"FK Aquarii",      type: ["M0Vpe"], absMag: [], mass: []},
{id:109, x: -0.63, y:  0.37, z: -3.67, sysName:"Luyten 725-32",   type: ["M5e"], absMag: [], mass: []},
{id:110, x:  2.76, y:  0.19, z: -2.70, sysName:"CD-39°14192",     type: ["M0 Ve"], absMag: [], mass: []},
{id:111, x:  1.47, y:  1.89, z: -4.08, sysName:"IL Aquarii",      type: ["M4V"], absMag: [], mass: []},
{id:112, x:  5.10, y: -0.46, z: -3.32, sysName:"CD-45°13677",     type: ["M0 V"], absMag: [], mass: []},
{id:113, x:  2.10, y: -1.06, z:  6.82, sysName:"BD+11°2576",      type: ["M1n V"], absMag: [], mass: []},
{id:114, x:  0.72, y: -0.36, z:  6.36, sysName:"GJ 2097",         type: ["M1.5V "], absMag: [], mass: []},
{id:115, x: -2.47, y: -0.15, z:  8.26, sysName:"61 Ursae Majoris",type: ["G8V"], absMag: [], mass: []},
{id:116, x:  6.43, y:  1.27, z: -4.83, sysName:"AT Microscopii",  type: ["M4 Ve", "M4.5e"], absMag: [], mass: []},
{id:117, x:  0.21, y: -1.98, z:  6.23, sysName:"GJ 1156",         type: ["M e"], absMag: [], mass: []},
{id:118, x: -1.81, y: -3.52, z:  5.64, sysName:"Wolf 358",        type: ["M4 V"], absMag: [], mass: []},
{id:119, x:  4.82, y:  0.44, z: -2.90, sysName:"HR 7703",         type: ["K2V"], absMag: [], mass: []},
{id:120, x: -0.53, y: -3.36, z:  2.99, sysName:"Lalande 21258",   type: ["M6.5"], absMag: [], mass: []},
{id:121, x:  5.29, y: -0.16, z:  0.64, sysName:"36 Ophiuchi",     type: ["K0 V","K1 V","K5 V"], absMag: [], mass: []},
{id:122, x:  5.26, y: -2.72, z:  1.27, sysName:"CD-40°9712",      type: ["M3 V"], absMag: [], mass: []},
{id:123, x:  5.45, y: -0.15, z:  0.65, sysName:"CD-26°12036",     type: ["K"], absMag: [], mass: []},
{id:124, x:  6.62, y:  3.06, z:  2.65, sysName:"BD+02°3312",      type: ["K"], absMag: [], mass: []},
{id:125, x:  7.12, y:  3.30, z:  1.23, sysName:"BD-03°4233",      type: ["M"], absMag: [], mass: []},
{id:126, x: -5.11, y: -3.15, z:  1.41, sysName:"NN 3454",         type: ["M"], absMag: [], mass: []},
{id:127, x: -3.45, y: -2.23, z: -0.45, sysName:"V577 Monocerotis",type: ["M4.5V","M8V"], absMag: [], mass: []},
{id:128, x: -5.76, y: -1.40, z: -0.96, sysName:"AC+12°1800-213",  type: ["M"], absMag: [], mass: []},
{id:129, x: -6.55, y: -1.22, z: -2.28, sysName:"Steph 538",       type: ["M"], absMag: [], mass: []},
{id:130, x: -8.88, y:  0.00, z: -2.79, sysName:"BD+18°683",       type: ["M"], absMag: [], mass: []},
{id:131, x: -4.88, y: -2.48, z: -1.93, sysName:"BD-03°1123",      type: ["M"], absMag: [], mass: []},
{id:132, x: -9.44, y: -2.42, z: -2.37, sysName:"Ross 41",         type: ["M5"], absMag: [], mass: []},
{id:133, x: -7.32, y: -2.92, z: -1.34, sysName:"GJ 1087",         type: ["D"], absMag: [], mass: []},
{id:134, x: -3.14, y: -1.99, z:  0.68, sysName:"Luyten's Star",   type: ["M3.5V"], absMag: [], mass: []},
{id:135, x:  2.99, y:  7.97, z:  4.93, sysName:"BD+43°2796",      type: ["M"], absMag: [], mass: []},
{id:136, x:  4.24, y:  6.12, z:  6.21, sysName:"BD+33°2777",      type: ["M"], absMag: [], mass: []},
{id:137, x:  2.79, y:  6.73, z:  2.54, sysName:"Vega",            type: ["A0V"], absMag: [], mass: []},
{id:138, x:  1.62, y:  4.81, z:  3.68, sysName:"Kuiper 79",       type: ["M"], absMag: [], mass: []},
{id:139, x: -0.60, y:  3.94, z:  2.49, sysName:"BD+68°946",       type: ["M"], absMag: [], mass: []},
{id:140, x:  2.33, y:  6.01, z:  4.74, sysName:"USNO 752",        type: ["M3"], absMag: [], mass: []},
{id:141, x:  4.77, y:  6.21, z:  3.76, sysName:"Mu Herculis",     type: ["G5 IV","M3.5 V","M4 V"], absMag: [], mass: []},
{id:142, x:  1.51, y:  7.39, z:  5.79, sysName:"NN 3988",         type: ["M"], absMag: [], mass: []},
{id:143, x: -0.19, y:  7.34, z:  3.75, sysName:"GJ 1227",         type: ["M"], absMag: [], mass: []},
{id:144, x: -1.55, y:  6.47, z:  3.55, sysName:"Chi Draconis",    type: ["F7V","K0V"], absMag: [], mass: []},
{id:145, x: -2.32, y:  6.41, z: -0.38, sysName:"HR 8832",         type: ["K3 V"], absMag: [], mass: []},
{id:146, x:  3.74, y:  0.22, z:  1.64, sysName:"BD-12°4523",      type: ["M"], absMag: [], mass: []},
{id:147, x:  4.28, y: -4.77, z:  6.21, sysName:"61 Virginis",     type: ["G5V"], absMag: [5.07], mass: [0.95]},
{id:148, x:  2.22, y: -1.20, z: -7.38, sysName:"Luyten 362-081",  type: ["D"], absMag: [], mass: []},
{id:149, x:  3.31, y:  3.64, z: -0.77, sysName:"Altair",          type: ["A7 V"], absMag: [2.21], mass: [1.79]},
{id:150, x:  2.26, y: -0.93, z:  8.59, sysName:"70 Virginis",     type: ["G2.5Va"], absMag: [3.70], mass: [1.12]},
{id:151, x:  2.96, y:  1.26, z:  5.89, sysName:"Xi Boötis",       type: ["G8 Ve"], absMag: [5.54], mass: [0.90]},
{id:152, x:  1.76, y:  2.25, z:  8.21, sysName:"Luyten 1484-43",  type: ["M"], absMag: [], mass: []}
];
