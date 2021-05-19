var jumpList= [
// {bridge:[1,22],type:"D",year:2111},
// {bridge:[1,50],type:"D",year:2122},
// {bridge:[1,82],type:"D",year:2118},
// {bridge:[2,76],type:"D",year:2147},
// {bridge:[2,77],type:"D",year:2149},
// {bridge:[2,85],type:"B",year:2140},
// {bridge:[2,90],type:"D",year:2147},
// {bridge:[2,91],type:"D",year:2150},
// {bridge:[3,92],type:"G",year:2183},
// {bridge:[3,21],type:"E",year:2195},
// {bridge:[3,13],type:"E",year:2195},
// {bridge:[3,74],type:"E",year:2194},
// {bridge:[3,6],type:"G",year:2180},
// {bridge:[3,78],type:"D",year:2189},
// {bridge:[4,77],type:"D",year:2156},
// {bridge:[4,7],type:"D",year:2165},
// {bridge:[5,93],type:"D",year:2195},
// {bridge:[5,13],type:"E",year:2210},
// {bridge:[5,16],type:"E",year:2213},
// {bridge:[5,72],type:"E",year:2197},
// {bridge:[6,72],type:"E",year:2180},
// {bridge:[6,74],type:"E",year:2180},
// {bridge:[6,92],type:"D",year:2180},
// {bridge:[7,8],type:"G",year:2172},
// {bridge:[7,9],type:"D",year:2174},
// {bridge:[7,12],type:"D",year:2173},
// {bridge:[8,11],type:"D",year:2181},
// {bridge:[9,11],type:"G",year:2181},
// {bridge:[9,12],type:"D",year:2186},
// {bridge:[9,14],type:"E",year:2197},
// {bridge:[9,15],type:"E",year:2180},
// {bridge:[9,17],type:"E",year:2198},
// {bridge:[10,11],type:"D",year:2192},
// {bridge:[10,13],type:"E",year:2212},
// {bridge:[10,14],type:"D",year:2188},
// {bridge:[10,15],type:"E",year:2180},
// {bridge:[11,103],type:"D",year:2195},
// {bridge:[12,14],type:"D",year:2197},
// {bridge:[12,17],type:"E",year:2198},
// {bridge:[12,18],type:"E",year:2201},
// {bridge:[13,79],type:"E",year:2198},
// {bridge:[13,92],type:"E",year:2195},
// {bridge:[14,17],type:"E",year:2198},
// {bridge:[15,19],type:"E",year:2180},
// {bridge:[15,20],type:"D",year:2140},
// {bridge:[15,127],type:"D",year:2180},
// {bridge:[16,19],type:"E",year:2180},
// {bridge:[16,21],type:"E",year:2180},
// {bridge:[17,18],type:"E",year:2180},
// {bridge:[17,19],type:"E",year:2202},
// {bridge:[17,23],type:"E",year:2185},
// {bridge:[17,130],type:"D",year:2186},
// {bridge:[17,131],type:"D",year:2187},
// {bridge:[18,23],type:"E",year:2180},
// {bridge:[18,101],type:"D",year:2184},
// {bridge:[20,24],type:"D",year:2140},
// {bridge:[20,133],type:"D",year:2142},
// {bridge:[20,126],type:"D",year:2141},
// {bridge:[20,131],type:"B",year:2143},
// {bridge:[22,24],type:"G",year:2122},
// {bridge:[22,79],type:"D",year:2128},
// {bridge:[23,26],type:"D",year:2139},
// {bridge:[24,126],type:"D",year:2133},
// {bridge:[24,37],type:"D",year:2128},
// {bridge:[24,46],type:"E",year:2197},
// {bridge:[24,32],type:"G",year:2132},
// {bridge:[24,48],type:"D",year:2128},
// {bridge:[24,61],type:"E",year:2180},
// {bridge:[25,26],type:"D",year:2139},
// {bridge:[25,37],type:"D",year:2139},
// {bridge:[25,38],type:"D",year:2139},
// {bridge:[25,134],type:"D",year:2142},
// {bridge:[26,29],type:"D",year:2142},
// {bridge:[29,38],type:"D",year:2147},
// {bridge:[32,38],type:"G",year:2149},
// {bridge:[38,120],type:"D",year:2137},
// {bridge:[38,126],type:"D",year:2155},
// {bridge:[46,47],type:"D",year:2146},
// {bridge:[46,51],type:"D",year:2155},
// {bridge:[47,48],type:"D",year:2137},
// {bridge:[47,50],type:"D",year:2135},
// {bridge:[47,118],type:"D",year:2141},
// {bridge:[47,120],type:"D",year:2140},
// {bridge:[48,61],type:"D",year:2148},
// {bridge:[49,53],type:"D",year:2156},
// {bridge:[49,55],type:"D",year:2149},
// {bridge:[49,115],type:"D",year:2160},
// {bridge:[49,117],type:"D",year:2146},
// {bridge:[50,56],type:"D",year:2128},
// {bridge:[51,70],type:"D",year:2163},
// {bridge:[52,54],type:"G",year:2183},
// {bridge:[52,57],type:"G",year:2190},
// {bridge:[53,57],type:"G",year:2161},
// {bridge:[53,58],type:"D",year:2163},
// {bridge:[53,115],type:"A",year:2161},
// {bridge:[54,55],type:"E",year:2180},
// {bridge:[55,56],type:"D",year:2138},
// {bridge:[55,118],type:"D",year:2142},
// {bridge:[56,114],type:"D",year:2144},
// {bridge:[56,120],type:"D",year:2142},
// {bridge:[57,59],type:"D",year:2171},
// {bridge:[57,58],type:"D",year:2165},
// {bridge:[58,59],type:"D",year:2167},
// {bridge:[58,60],type:"D",year:2174},
// {bridge:[58,113],type:"D",year:2173},
// {bridge:[59,60],type:"D",year:2174},
// {bridge:[59,113],type:"D",year:2173},
// {bridge:[58,150],type:"D",year:2180},
// {bridge:[58,152],type:"G",year:2175},
// {bridge:[58,152],type:"G",year:2175},
// //{bridge:[61,152],type:"D",year:2175},
// {bridge:[61,81],type:"E",year:2199},
// {bridge:[61,79],type:"E",year:2180},
// {bridge:[62,63],type:"G",year:2183},
// {bridge:[62,146],type:"D",year:2182},
// {bridge:[62,147],type:"E",year:2196},
// {bridge:[62,66],type:"E",year:2180},
// {bridge:[63,64],type:"D",year:2183},
// {bridge:[63,89],type:"D",year:2191},
// {bridge:[64,68],type:"D",year:2183},
// {bridge:[64,125],type:"D",year:2183},
// {bridge:[64,146],type:"D",year:2185},
// {bridge:[65,66],type:"G",year:2139},
// {bridge:[65,119],type:"E",year:2180},
// {bridge:[66,119],type:"E",year:2180},
// {bridge:[66,67],type:"D",year:2139},
// {bridge:[67,69],type:"D",year:2139},
// {bridge:[67,122],type:"D",year:2149},
// {bridge:[67,146],type:"D",year:2160},
// {bridge:[68,73],type:"E",year:2180},
// {bridge:[69,80],type:"G",year:2141},
// {bridge:[69,74],type:"D",year:2136},
// {bridge:[70,71],type:"D",year:2163},
// {bridge:[70,75],type:"D",year:2163},
// {bridge:[70,137],type:"E",year:2196},
// {bridge:[71,73],type:"G",year:2163},
// {bridge:[71,139],type:"D",year:2170},
// {bridge:[71,88],type:"D",year:2171},
// {bridge:[72,74],type:"D",year:2183},
// {bridge:[72,78],type:"E",year:2189},
// {bridge:[73,75],type:"G",year:2163},
// {bridge:[73,86],type:"E",year:2180},
// {bridge:[73,145],type:"E",year:2182},
// {bridge:[74,76],type:"D",year:2148},
// {bridge:[74,79],type:"E",year:2180},
// {bridge:[75,86],type:"D",year:2163},
// {bridge:[75,88],type:"G",year:2163},
// {bridge:[77,85],type:"D",year:2149},
// {bridge:[77,106],type:"D",year:2154},
// {bridge:[79,81],type:"G",year:2170},
// {bridge:[79,82],type:"G",year:2132},
// {bridge:[79,84],type:"D",year:2137},
// {bridge:[79,104],type:"D",year:2135},
// {bridge:[80,146],type:"D",year:2172},
// {bridge:[81,84],type:"D",year:2140},
// {bridge:[81,105],type:"D",year:2147},
// {bridge:[82,84],type:"D",year:2140},
// {bridge:[82,85],type:"D",year:2139},
// {bridge:[82,83],type:"D",year:2138},
// {bridge:[82,104],type:"D",year:2135},
// {bridge:[83,90],type:"D",year:2147},
// {bridge:[83,110],type:"D",year:2152},
// {bridge:[85,91],type:"D",year:2154},
// {bridge:[85,105],type:"D",year:2147},
// {bridge:[85,109],type:"G",year:2160},
// {bridge:[85,111],type:"G",year:2157},
// {bridge:[86,139],type:"D",year:2172},
// {bridge:[89,124],type:"D",year:2197},
// {bridge:[90,91],type:"D",year:2151},
// {bridge:[90,107],type:"G",year:2151},
// {bridge:[90,108],type:"D",year:2150},
// {bridge:[90,148],type:"D",year:2158},
// {bridge:[91,107],type:"D",year:2152},
// {bridge:[91,106],type:"D",year:2155},
// {bridge:[92,93],type:"G",year:2186},
// {bridge:[101,102],type:"D",year:2187},
// {bridge:[102,103],type:"G",year:2192},
// {bridge:[106,108],type:"D",year:2154},
// {bridge:[109,111],type:"D",year:2157},
// {bridge:[110,111],type:"D",year:2154},
// {bridge:[110,112],type:"D",year:2154},
// {bridge:[113,114],type:"G",year:2171},
// {bridge:[113,151],type:"D",year:2173},
// {bridge:[116,119],type:"D",year:2185},
// {bridge:[117,118],type:"D",year:2145},
// {bridge:[119,149],type:"E",year:2194},
// {bridge:[121,122],type:"D",year:2149},
// {bridge:[121,124],type:"E",year:2197},
// {bridge:[122,123],type:"D",year:2157},
// {bridge:[123,124],type:"E",year:2197},
// {bridge:[124,125],type:"G",year:2204},
// {bridge:[126,127],type:"D",year:2166},
// {bridge:[127,128],type:"D",year:2183},
// {bridge:[128,129],type:"G",year:2184},
// {bridge:[129,130],type:"D",year:2185},
// {bridge:[130,132],type:"D",year:2157},
// {bridge:[131,133],type:"D",year:2160},
// {bridge:[132,133],type:"D",year:2151},
// {bridge:[135,137],type:"D",year:2190},
// {bridge:[135,136],type:"D",year:2188},
// {bridge:[136,137],type:"E",year:2188},
// {bridge:[136,140],type:"D",year:2188},
// {bridge:[136,141],type:"D",year:2187},
// {bridge:[137,138],type:"D",year:2185},
// {bridge:[138,139],type:"D",year:2178},
// {bridge:[140,141],type:"D",year:2187},
// {bridge:[141,142],type:"E",year:2186},
// {bridge:[142,143],type:"D",year:2185},
// {bridge:[143,144],type:"G",year:2184},
// {bridge:[144,145],type:"E",year:2183}
    {bridge:[0, 244], type:'D', year:2111},
    {bridge:[0, 65], type:'D', year:2118},
    {bridge:[0, 411], type:'D', year:2122},
    {bridge:[244, 280], type:'G', year:2122},
    {bridge:[411, 388], type:'D', year:2124},
    {bridge:[388, 406], type:'D', year:2126},
    {bridge:[411, 473], type:'D', year:2128},
    {bridge:[280, 406], type:'D', year:2128},
    {bridge:[280, 1116], type:'D', year:2128},
    {bridge:[406, 559], type:'D', year:2128},      // Olympia
    {bridge:[244, 144], type:'D', year:2128},
    {bridge:[65, 144], type:'G', year:2132},
    {bridge:[280, 1111], type:'G', year:2132},
    {bridge:[280, 3454], type:'D', year:2133},
    {bridge:[388, 412], type:'D', year:2133},
    {bridge:[1116, 3454], type:'D', year:2133},
    {bridge:[144, 9066], type:'D', year:2135},
    {bridge:[65, 9066], type:'D', year:2135},
    {bridge:[559, 729], type:'D', year:2135},
    {bridge:[729, 845], type:'D', year:2136},
    {bridge:[144, 1061], type:'D', year:2137},
    {bridge:[406, 3522], type:'D', year:2137},
    {bridge:[412, 3522], type:'D', year:2137},
    {bridge:[65, 1], type:'D', year:2138},
    {bridge:[1116, 273], type:'D', year:2138},
    {bridge:[65, 1002], type:'D', year:2139},
    {bridge:[1116, 285], type:'D', year:2139},
    {bridge:[285, 1103], type:'D', year:2139},
    {bridge:[285, 3522], type:'D', year:2139},
    {bridge:[729, 682], type:'D', year:2139},
    {bridge:[1103, 250], type:'D', year:2139},     // Pacifica
    {bridge:[682, 667], type:'D', year:2139},
    {bridge:[667, 666], type:'G', year:2139},      // Refuge
    {bridge:[1002, 1005], type:'B', year:2140},
    {bridge:[280, 3379], type:'D', year:2140},
    {bridge:[3379, 166], type:'D', year:2140},
    {bridge:[65, 1061], type:'D', year:2140},
    {bridge:[1061, 71], type:'D', year:2140},
    {bridge:[3454, 3379], type:'D', year:2141},
    {bridge:[388, 402], type:'D', year:2141},
    {bridge:[729, 699], type:'G', year:2141},
    {bridge:[3379, 1087], type:'D', year:2142},
    {bridge:[473, 412], type:'D', year:2142},
    {bridge:[285, 273], type:'D', year:2142},
    {bridge:[1005, 866], type:'D', year:2142},
    {bridge:[299, 1103], type:'D', year:2142},
    {bridge:[887, 1005], type:'D', year:2143},
    {bridge:[3379, 205], type:'B', year:2143},
    {bridge:[473, 2097], type:'D', year:2144},
    {bridge:[402, 1156], type:'D', year:2145},
    {bridge:[388, 380], type:'D', year:2146},
    {bridge:[1156, 408], type:'D', year:2146},
    {bridge:[1005, 881], type:'D', year:2147},
    {bridge:[3522, 299], type:'D', year:2147},
    {bridge:[1, 881], type:'D', year:2147},
    {bridge:[1002, 887], type:'D', year:2147},
    {bridge:[71, 887], type:'D', year:2147},
    {bridge:[845, 866], type:'D', year:2148},
    {bridge:[1005, 1286], type:'D', year:2149},
    {bridge:[1111, 3522], type:'G', year:2149},
    {bridge:[682, 588], type:'D', year:2149},
    {bridge:[1002, 1286], type:'D', year:2149},
    {bridge:[588, 663], type:'D', year:2149},
    {bridge:[1005, 2005], type:'D', year:2150},
    {bridge:[881, 867], type:'D', year:2150},
    {bridge:[1087, 203], type:'D', year:2151},
    {bridge:[881, 2005], type:'D', year:2151},
    {bridge:[881, 884], type:'G', year:2151},
    {bridge:[1, 825], type:'D', year:2152},
    {bridge:[71, 866], type:'D', year:2152},
    {bridge:[2005, 884], type:'D', year:2152},
    {bridge:[1286, 4360], type:'D', year:2154},
    {bridge:[867, 4360], type:'D', year:2154},
    {bridge:[825, 876], type:'D', year:2154},
    {bridge:[825, 784], type:'D', year:2154},
    {bridge:[3454, 3522], type:'D', year:2155},
    {bridge:[380, 445], type:'D', year:2155},
    {bridge:[2005, 4360], type:'D', year:2155},
    {bridge:[1286, 33], type:'D', year:2156},
    {bridge:[408, 450], type:'D', year:2156},
    {bridge:[588, 664], type:'D', year:2157},
    {bridge:[1002, 876], type:'G', year:2157},
    {bridge:[876, 54001], type:'D', year:2157},
    {bridge:[203, 176], type:'D', year:2157},
    {bridge:[881, 915], type:'D', year:2158},      // Luyten 362-081 *
    {bridge:[408, 434], type:'D', year:2160},
    {bridge:[682, 628], type:'D', year:2160},
    {bridge:[1002, 54001], type:'G', year:2160},
    {bridge:[1087, 205], type:'D', year:2160},
    {bridge:[450, 475], type:'G', year:2161},      // Damso
    {bridge:[450, 434], type:'A', year:2161},
    {bridge:[445, 764], type:'D', year:2163},      // Medina
    {bridge:[764, 1245], type:'D', year:2163},
    {bridge:[1245, 820], type:'G', year:2163},
    {bridge:[764, 860], type:'D', year:2163},
    {bridge:[860, 34], type:'D', year:2163},
    {bridge:[860, 820], type:'G', year:2163},
    {bridge:[860, 873], type:'G', year:2163},
    {bridge:[33, 68], type:'D', year:2165},        // Schwarzvaal
    {bridge:[3454, 234], type:'D', year:2166},
    {bridge:[784, 799], type:'D', year:2170},
    {bridge:[1245, 687], type:'D', year:2170},
    {bridge:[144, 71], type:'G', year:2170},
    {bridge:[1245, 873], type:'D', year:2171},
    {bridge:[475, 3789], type:'D', year:2171},
    {bridge:[2097, 514], type:'G', year:2171},
    {bridge:[68, 3146], type:'G', year:2172},
    {bridge:[628, 699], type:'D', year:2172},
    {bridge:[514, 3789], type:'D', year:2173},
    {bridge:[514, 566], type:'D', year:2173},      // Xi Bootis *
    {bridge:[68, 105], type:'D', year:2174},
    {bridge:[3789, 534], type:'D', year:2174},     // Eta Bootis *
    {bridge:[534, 502], type:'D', year:2174},      // Beta Comae Berenices *
    {bridge:[534, 3839], type:'D', year:2175},     // Luyten 1484-43 *
    {bridge:[3789, 9446], type:'D', year:2176},    // 70 Virginis *
    {bridge:[687, 661], type:'D', year:2178},
    {bridge:[845, 66], type:'E', year:2180},
    {bridge:[66, 780], type:'E', year:2180},       // Altiplano
    {bridge:[166, 105], type:'E', year:2180},
    {bridge:[166, 117], type:'E', year:2180},
    {bridge:[166, 216], type:'E', year:2180},      // Concord
    {bridge:[216, 2034], type:'E', year:2180},
    {bridge:[2034, 231], type:'E', year:2180},     // NR/NB
    {bridge:[250, 183], type:'E', year:2180},
    {bridge:[559, 280], type:'E', year:2180},
    {bridge:[667, 570], type:'E', year:2180},
    {bridge:[666, 783], type:'E', year:2180},
    {bridge:[783, 667], type:'E', year:2180},
    {bridge:[820, 702], type:'E', year:2180},
    {bridge:[820, 34], type:'E', year:2180},
    {bridge:[66, 17], type:'G', year:2180},        // Xing Cheng
    {bridge:[66, 19], type:'D', year:2180},
    {bridge:[234, 166], type:'D', year:2180},
    {bridge:[183, 178], type:'D', year:2180},
    {bridge:[3146, 1057], type:'D', year:2181},
    {bridge:[105, 1057], type:'G', year:2181},
    {bridge:[687, 34], type:'E', year:2182},
    {bridge:[820, 892], type:'E', year:2182},
    {bridge:[628, 570], type:'D', year:2182},
    {bridge:[19, 17], type:'G', year:2183},
    {bridge:[570, 581], type:'G', year:2183},
    {bridge:[581, 644], type:'D', year:2183},
    {bridge:[644, 702], type:'D', year:2183},
    {bridge:[644, 701], type:'D', year:2183},
    {bridge:[234, 213], type:'D', year:2183},
    {bridge:[845, 780], type:'D', year:2183},
    {bridge:[892, 713], type:'E', year:2183},
    {bridge:[183, 185], type:'D', year:2184},
    {bridge:[713, 1227], type:'G', year:2184},
    {bridge:[213, 3322], type:'G', year:2184},
    {bridge:[783, 799], type:'D', year:2185},
    {bridge:[628, 644], type:'D', year:2185},
    {bridge:[1227, 3988], type:'D', year:2185},
    {bridge:[661, 721], type:'D', year:2185},
    {bridge:[3322, 176], type:'D', year:2185},
    {bridge:[3988, 695], type:'E', year:2186},
    {bridge:[176, 178], type:'D', year:2186},
    {bridge:[4285, 19], type:'G', year:2186},
    {bridge:[205, 178], type:'D', year:2187},
    {bridge:[185, 2033], type:'D', year:2187},
    {bridge:[695, 3991], type:'D', year:2187},
    {bridge:[695, 638], type:'D', year:2187},
    {bridge:[638, 721], type:'E', year:2188},
    {bridge:[117, 150], type:'D', year:2188},
    {bridge:[638, 694], type:'D', year:2188},
    {bridge:[144, 845], type:'E', year:2188},
    {bridge:[638, 3991], type:'D', year:2188},
    {bridge:[17, 902], type:'D', year:2189},
    {bridge:[780, 902], type:'E', year:2189},
    {bridge:[721, 694], type:'D', year:2190},
    {bridge:[559, 144], type:'E', year:2190},
    {bridge:[475, 1151], type:'G', year:2190},
    {bridge:[581, 643], type:'D', year:2191},
    {bridge:[1151, 451], type:'G', year:2191},
    {bridge:[1057, 117], type:'D', year:2192},
    {bridge:[2033, 1065], type:'G', year:2192},
    {bridge:[17, 845], type:'E', year:2194},
    {bridge:[783, 768], type:'E', year:2194},     // Altair *
    {bridge:[231, 17], type:'E', year:2195},
    {bridge:[139, 17], type:'E', year:2195},
    {bridge:[139, 19], type:'E', year:2195},
    {bridge:[4285, 54], type:'D', year:2195},
    {bridge:[1057, 1065], type:'D', year:2195},
    {bridge:[721, 764], type:'E', year:2196},
    {bridge:[451, 1156], type:'E', year:2196},
    {bridge:[570, 506], type:'E', year:2196},     // 61 Virginis *
    {bridge:[54, 780], type:'E', year:2197},
    {bridge:[663, 673], type:'E', year:2197},
    {bridge:[673, 664], type:'E', year:2197},
    {bridge:[150, 105], type:'E', year:2197},
    {bridge:[280, 380], type:'E', year:2197},
    {bridge:[150, 137], type:'D', year:2197},
    {bridge:[643, 673], type:'D', year:2197},
    {bridge:[178, 137], type:'E', year:2198},
    {bridge:[178, 105], type:'E', year:2198},
    {bridge:[178, 150], type:'E', year:2198},
    {bridge:[559, 71], type:'E', year:2199},
    {bridge:[183, 137], type:'E', year:2201},
    {bridge:[178, 216], type:'E', year:2202},
    {bridge:[144, 139], type:'E', year:2203},
    {bridge:[701, 673], type:'G', year:2204},
    {bridge:[139, 54], type:'E', year:2210},
    {bridge:[117, 139], type:'E', year:2212},
    {bridge:[54, 2034], type:'E', year:2213},
];