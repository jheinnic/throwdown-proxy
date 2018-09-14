import {UniqueValueSource} from './randomize/sources/unique-value-source';
import {generateSeedTree} from './prize/generate-seed-tree';

let seedValues = Uint32Array.of(
   -425980141, 1103513639, 1942282457, -1527452113, 1959864891, 1523640013, 1336512345, 136845265,
   -994403274, -149684310, 233234833, -2097885300, -1658929744, 1394574865, 1697034403, 729307857,
   827282160, 766521433, -598681173, -661256816, -1460697820, -1243738789, 1476933610, -1355662760,
   -1062198566, 144466172, 793013794, 99252601, -343308727, 391504460, 1953894758, -567410470, -1560143486,
   -592002236, 1266607016, -958063795, 2030203151, -829165451, 255215267, -1437048051, 86186536, -836717228,
   338511875, 1241225299, 101483407, 1574136063, -1333616676, 1861696835, 956099373, -1965178845,
   -2071625094, 1960981199, 1815996843, 154698491, 1690532364, 1874636634, -1693174155, 1366844937,
   273989028, 579365387, 1420082590, -1790985712, 1697421760, 961389520, -1497693029, -1089928850,
   2069946813, -657722374, 1530763576, -1300236390, 895185285, -666963005, 510051513, -1171226386,
   -2003755993, 892619271, 1085679496, -705878426, 929580833, 814920272, 388048786, -1855661631, -411371836,
   1315200824, -184796086, -331766335, 609868510, -68477396, 295938862, 675697586, 1632605530, -2113267308,
   984384405, 74680724, -581109993, 1714984849, 1306901731, 1778318480, -1448841039, 1787262428, -449271793,
   1116451673, -1112351366, -1992470382, -1341366886, -2119366916, 654636722, 2059261827, -1712802662,
   1868578850, 1536927786, -2076264341, 1940767380, 1222848742, -834679159, 149027442, 1704453426,
   -235481622, 2067603801, 2115764109, 662636714, 1746284354, -1106035146, -251331151, 1748194351,
   1029009592, -1084823955, -611723181, 1567631814, 1826216845, -1532871277, -1066713125, 346207674,
   1890851315, 324274691, 761076722, 499186205, -790061175, -512451712, 297077075, 804690865, 396347725,
   -841880760, 1469308648, 222765606, -771916, 1073920800, -570392238, 898570638, 1982180256, -249962219,
   1368427895, -680357505, 882565695, 2019639041, 1231235895, 1913896483, 661448392, 768112065, 1593922929,
   -573905445, 92134947, 455613566, 841559191, -1859283064, 985767955, -993814133, 1177332272, -317823789,
   -1395326046, 1154476088, -535599199, -1697353979, -1217577425, 397407023, -1972749095, -204235573,
   1747634117, 125364654, -1580376075, 725752696, -686041938, 787899437, -570124933, 1961040669, -69911856,
   511252120, 1163253357, -2095664581, 2038831156, -1996952900, 1877568481, 203174810, -928671118,
   1814340248, -2029610750, -378790881, 1526021207, 1624444443, -1537237726, -574287933, -1537053398,
   -714153994, 656289268, 1556389511, 610767417, 1290160419, 584872454, 422425361, 817844532, 1264568366,
   1873715734, -579878661, -2003302914, -1156035209, -357486810, 358734243, 83769469, 1150397443,
   -368905646, 1370441495, -1832570952, -710013738, -1066179449, 1096431131, -718279336, -608570940,
   -918466756, -657038557, 2051509708, -1199847256, 1101711281, 1941744504, -350441099, 2086959869,
   -1923874733, 463417845, -1915780813, 1647575672, 1913807363, -85301533, 1786752785, -1075229122,
   1888471219, -1267657271, -1514671293, -88591680, 1608344103, 308578547, -1625341328, 53355786, 171943132,
   -1520216847, 1269558477, 214377904, -1016609140
);

let bitSource = new UniqueValueSource(seedValues, 128, false, new Set<string>());
let subscription = generateSeedTree(bitSource, 486875, 'mypool/prizeSeeds.dat');

console.log(subscription);
