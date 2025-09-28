import { useState } from "react";
import './App.css';
import './formulario.css';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const produtosMock = [
  {
    id: 1,
    codigo: "1199",
    nome: "MICRO ASPERSOR 50 L/H BRANCO",
    desc: "Embalagem com 500 unidades",
    img: "public/micro-branco.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },
  {
    id: 2,
    codigo: "82",
    nome: "MICRO ASPERSOR 75 L/H MARROM",
    desc: "Embalagem com 500 unidades",
    img: "public/micro-marrom.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },
  {
    id: 3,
    codigo: "81",
    nome: "MICRO ASPERSOR 100 L/H LARANJA",
    desc: "Embalagem com 500 unidades",
    img: "public/micro-laranja.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },
  {
    id: 4,
    codigo: "80",
    nome: "MICRO ASPERSOR 120 L/H AZUL",
    desc: "Embalagem com 500 unidades",
    img: "public/micro-azul.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },
  {
    id: 5,
    codigo: "85",
    nome: "ESTACA 300MM",
    desc: "Saco com 500 unidades",
    img: "public/estaca.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },
  {
    id: 6,
    codigo: "84",
    nome: "ESTACA 600MM",
    desc: "Saco com 100 unidades",
    img: "public/estaca.webp",
    undPorEmbalagem: 100,
    undMedida: "unidades"
  },
  {
    id: 7,
    codigo: "86",
    nome: "MICROTUBO 4/6 x 100CM COM CONECTOR",
    desc: "500 unidades",
    img: "public/microtubo.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },
  {
    id: 8,
    codigo: "87",
    nome: "TAMPÃO 4/5",
    desc: "Embalagem com 1.000 unidades",
    img: "public/tampao-4x5.webp",
    undPorEmbalagem: 1000,
    undMedida: "unidades"
  },
  {
    id: 9,
    codigo: "88",
    nome: "TAMPÃO 4/7",
    desc: "Embalagem com 1.000 unidades",
    img: "public/tampao-4x7.webp",
    undPorEmbalagem: 1000,
    undMedida: "unidades"
  },
  {
    id: 10,
    codigo: "89",
    nome: "TAMPÃO DUPLO (PLUG) 4/6",
    desc: "Embalagem com 1.000 unidades",
    img: "public/tampao-duplo-4x6.webp",
    undPorEmbalagem: 1000,
    undMedida: "unidades"
  },
  {
    id: 11,
    codigo: "92",
    nome: "COLAR DE TOMADA 50MM C/ ROSCA 1' ",
    desc: "Embalagem com 25 unidades",
    img: "public/colar-de-tomada.webp",
    undPorEmbalagem: 25,
    undMedida: "unidades"
  },
  {
    id: 12,
    codigo: "91",
    nome: "COLAR DE TOMADA 75MM C/ ROSCA 1' ",
    desc: "Embalagem com 25 unidades",
    img: "public/colar-de-tomada.webp",
    undPorEmbalagem: 25,
    undMedida: "unidades"
  },
  {
    id: 13,
    codigo: "90",
    nome: "COLAR DE TOMADA 100MM C/ ROSCA 1' ",
    desc: "Embalagem com 25 unidades",
    img: "public/colar-de-tomada.webp",
    undPorEmbalagem: 25,
    undMedida: "unidades"
  },
  {
    id: 14,
    codigo: "93",
    nome: "CHULA BILABIAL 17MM",
    desc: "Embalagem com 500 unidades",
    img: "public/chula-bilabial.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },
  {
    id: 15,
    codigo: "94",
    nome: "CONECTOR INICIAL 16MM COM ANEL GARRA",
    desc: "Embalagem com 500 unidades",
    img: "public/conector-inicial-anel-garra.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },
  {
    id: 16,
    codigo: "95",
    nome: "CONECTOR INICIAL 16MM COM ANEL LISO",
    desc: "Embalagem com 500 unidades",
    img: "public/conector-inicial-anel-liso.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },
  {
    id: 17,
    codigo: "96",
    nome: "UNIÃO DE 16MM COM ANÉIS GARRA",
    desc: "Embalagem com 500 unidades",
    img: "public/uniao-anel-garra.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },
  {
    id: 18,
    codigo: "97",
    nome: "UNIÃO DE 16MM COM ANÉIS LISO",
    desc: "Embalagem com 500 unidades",
    img: "public/uniao-anel-liso.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },
  {
    id: 19,
    codigo: "98",
    nome: "TRANSIÇÃO 16MM P/ 16MM COM ANÉIS LISO E GARRA",
    desc: "Embalagem com 200 unidades",
    img: "public/transicao-liso-garra.webp",
    undPorEmbalagem: 200,
    undMedida: "unidades"
  },
  {
    id: 20,
    codigo: "99",
    nome: "T 16MM COM ANÉIS GARRA",
    desc: "Embalagem com 200 unidades",
    img: "public/t-16mm-anel-garra.webp",
    undPorEmbalagem: 200,
    undMedida: "unidades"
  },
  {
    id: 21,
    codigo: "100",
    nome: "T 16MM COM ANÉIS LISO",
    desc: "Embalagem com 200 unidades",
    img: "public/t-16mm-anel-liso.webp",
    undPorEmbalagem: 200,
    undMedida: "unidades"
  },
  {
    id: 22,
    codigo: "101",
    nome: "T 16MM COM ANÉIS LISO E GARRA",
    desc: "Embalagem com 200 unidades",
    img: "public/t-16mm-anel-garra-2-pontas-anel-liso.webp",
    undPorEmbalagem: 200,
    undMedida: "unidades"
  },
  {
    id: 23,
    codigo: "102",
    nome: "Y 16MM COM ANÉIS GARRA NAS 3 PONTAS",
    desc: "Embalagem com 200 unidades",
    img: "public/y-16mm-anel-garra.webp",
    undPorEmbalagem: 200,
    undMedida: "unidades"
  },
  {
    id: 24,
    codigo: "103",
    nome: "Y 16MM COM ANÉIS LISO NAS 3 PONTAS",
    desc: "Embalagem com 200 unidades",
    img: "public/y-16mm-anel-liso.webp",
    undPorEmbalagem: 200,
    undMedida: "unidades"
  },
  {
    id: 25,
    codigo: "104",
    nome: "Y 16MM COM ANEL GARRA E 2 PONTAS COM ANÉIS LISO",
    desc: "Embalagem com 200 unidades",
    img: "public/y-16mm-anel-garra-2-pontas-anel-liso.webp",
    undPorEmbalagem: 200,
    undMedida: "unidades"
  },
  {
    id: 26,
    codigo: "105",
    nome: "Y INICIAL 16MM 2 PONTAS COM ANÉIS LISO",
    desc: "Embalagem com 200 unidades",
    img: "public/y-inicial-16mm-anel-liso.webp",
    undPorEmbalagem: 200,
    undMedida: "unidades"
  },
  {
    id: 27,
    codigo: "106",
    nome: "Y INICIAL 16MM 2 PONTAS COM ANÉIS GARRA",
    desc: "Embalagem com 200 unidades",
    img: "public/y-inicial-16mm-anel-garra.webp",
    undPorEmbalagem: 200,
    undMedida: "unidades"
  },
  {
    id: 28,
    codigo: "107",
    nome: "JOELHO 16MM COM ANÉIS GARRA",
    desc: "Embalagem com 400 unidades",
    img: "public/joelho-16mm-anel-garra.webp",
    undPorEmbalagem: 400,
    undMedida: "unidades"
  },
  {
    id: 29,
    codigo: "108",
    nome: "JOELHO 16MM COM ANÉIS LISO",
    desc: "Embalagem com 400 unidades",
    img: "public/joelho-16mm-anel-liso.webp",
    undPorEmbalagem: 400,
    undMedida: "unidades"
  },
  {
    id: 30,
    codigo: "109",
    nome: "JOELHO 16MM COM ANÉIS LISO E GARRA",
    desc: "Embalagem com 400 unidades",
    img: "public/joelho-16mm-anel-liso-e-garra.webp",
    undPorEmbalagem: 400,
    undMedida: "unidades"
  },
  {
    id: 31,
    codigo: "111",
    nome: "FIM DE LINHA COM ANEL LISO",
    desc: "Embalagem com 500 unidades",
    img: "public/fim-de-linha-anel-liso.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },
  {
    id: 32,
    codigo: "110",
    nome: "FIM DE LINHA COM ANEL GARRA",
    desc: "Embalagem com 500 unidades",
    img: "public/fim-de-linha-anel-garra.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },
  {
    id: 33,
    codigo: "112",
    nome: "TAMPÃO DE 16MM COM ABA PARA CHULA",
    desc: "Embalagem com 500 unidades",
    img: "public/tampao-com-aba.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },
  {
    id: 34,
    codigo: "53",
    nome: "CONECTOR PARA MICROTUBO 4/5 (MILHEIRO)",
    desc: "Embalagem com 1.000 unidades",
    img: "public/conector-para-microtubo.webp",
    undPorEmbalagem: 1000,
    undMedida: "unidades"
  },
  {
    id: 35,
    codigo: "113",
    nome: "VÁLVULA ANTI-VÁCUO (VENTOSA) PARA CHULA 16MM",
    desc: "Embalagem com 50 unidades",
    img: "public/valvula-anti-vacuo-p-chula.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },
  {
    id: 36,
    codigo: "1331",
    nome: "MINI GOTEJADOR",
    desc: "Embalagem com 100 unidades",
    img: "public/mini-gotejador.webp",
    undPorEmbalagem: 100,
    undMedida: "unidades"
  },
  {
    id: 37,
    codigo: "114",
    nome: "REGISTRO INICIAL 16MM COM ANEL LISO",
    desc: "Embalagem com 100 unidades",
    img: "public/registro-inicial-16mm-anel-liso.webp",
    undPorEmbalagem: 100,
    undMedida: "unidades"
  },
  {
    id: 38,
    codigo: "115",
    nome: "REGISTRO INICIAL 16MM COM ANEL GARRA",
    desc: "Embalagem com 100 unidades",
    img: "public/registro-inicial-16mm-anel-garra.webp",
    undPorEmbalagem: 100,
    undMedida: "unidades"
  },
  {
    id: 39,
    codigo: "116",
    nome: "REGISTRO UNIÃO 16MM COM ANEL LISO",
    desc: "Embalagem com 100 unidades",
    img: "public/registro-uniao-16mm-anel-liso.webp",
    undPorEmbalagem: 100,
    undMedida: "unidades"
  },
  {
    id: 40,
    codigo: "117",
    nome: "REGISTRO UNIÃO 16MM COM ANEL GARRA",
    desc: "Embalagem com 100 unidades",
    img: "public/registro-uniao-16-mm-anel-garra.webp",
    undPorEmbalagem: 100,
    undMedida: "unidades"
  },
  {
    id: 41,
    codigo: "153",
    nome: "REGISTRO UNIÃO 16MM COM ANÉIS LISO E GARRA",
    desc: "Embalagem com 100 unidades",
    img: "public/registro-uniao-16mm-anel-liso-e-garra.webp",
    undPorEmbalagem: 100,
    undMedida: "unidades"
  },
  {
    id: 42,
    codigo: "1347",
    nome: "VENTOSA DUPLO EFEITO ROSCA 1' ",
    desc: "Embalagem com 10 unidades",
    img: "public/ventosa-duplo-efeito.webp",
    undPorEmbalagem: 10,
    undMedida: "unidades"
  },
  {
    id: 43,
    codigo: "1355",
    nome: "VENTOSA DUPLO EFEITO ROSCA 3/4' ",
    desc: "Embalagem com 10 unidades",
    img: "public/ventosa-duplo-efeito.webp",
    undPorEmbalagem: 10,
    undMedida: "unidades"
  },
  {
    id: 44,
    codigo: "118",
    nome: "ADAPTADOR ESPIGÃO C/ ROSCA EXT. 1' ",
    desc: "Embalagem com 25 unidades",
    img: "public/adaptador-espigao-c-rosca-1-pol.webp",
    undPorEmbalagem: 25,
    undMedida: "unidades"
  },
  {
    id: 45,
    codigo: "119",
    nome: "ADAPTADOR ESPIGÃO C/ ROSCA EXT. 1 x 3/4' ",
    desc: "Embalagem com 50 unidades",
    img: "public/adaptador-espigao-c-rosca-1-pol.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },
  {
    id: 46,
    codigo: "120",
    nome: "ADAPTADOR ESPIGÃO C/ ROSCA EXT. 1 x 1/2' ",
    desc: "Embalagem com 50 unidades",
    img: "public/adaptador-espigao-c-rosca-1-pol.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },
  {
    id: 47,
    codigo: "121",
    nome: "ADAPTADOR ESPIGÃO C/ ROSCA EXT. 3/4 x 1/2' ",
    desc: "Embalagem com 50 unidades",
    img: "public/adaptador-espigao-c-rosca-1-pol.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },
  {
    id: 48,
    codigo: "122",
    nome: "ADAPTADOR ESPIGÃO C/ ROSCA EXT. 3/4 x 1' ",
    desc: "Embalagem com 50 unidades",
    img: "public/adaptador-espigao-c-rosca-1-pol.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },
  {
    id: 49,
    codigo: "123",
    nome: "ADAPTADOR ESPIGÃO C/ ROSCA EXT. 3/4' ",
    desc: "Embalagem com 50 unidades",
    img: "public/adaptador-espigao-c-rosca-1-pol.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },
  {
    id: 50,
    codigo: "124",
    nome: "JOELHO 90° SOLDÁVEL DN 20MM",
    desc: "Embalagem com 50 unidades",
    img: "public/joelho-25mm.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },
  {
    id: 51,
    codigo: "125",
    nome: "JOELHO 90° SOLDÁVEL DN 25MM",
    desc: "Embalagem com 50 unidades",
    img: "public/joelho-25mm.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },
  {
    id: 52,
    codigo: "1401",
    nome: "JOELHO 90° SOLDÁVEL DN 32MM",
    desc: "Embalagem com 50 unidades",
    img: "public/joelho-25mm.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },
  {
    id: 53,
    codigo: "125",
    nome: "JOELHO 90° SOLDÁVEL DN 50MM",
    desc: "Embalagem com 10 unidades",
    img: "public/joelho-25mm.webp",
    undPorEmbalagem: 10,
    undMedida: "unidades"
  },
  {
    id: 54,
    codigo: "127",
    nome: "JOELHO 45° SOLDÁVEL DN 35MM",
    desc: "Embalagem com 25 unidades",
    img: "public/joelho-45-35mm.webp",
    undPorEmbalagem: 25,
    undMedida: "unidades"
  },
  {
    id: 55,
    codigo: "1404",
    nome: "JOELHO 45° SOLDÁVEL DN 50MM",
    desc: "Embalagem com 10 unidades",
    img: "public/joelho-45-35mm.webp",
    undPorEmbalagem: 10,
    undMedida: "unidades"
  },
  {
    id: 56,
    codigo: "129",
    nome: "JOELHO 90° REDUÇÃO SOLDÁVEL DN 25 x 20",
    desc: "Embalagem com 50 unidades",
    img: "public/joelho-reducao-soldavel-25x20mm.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },
  {
    id: 57,
    codigo: "130",
    nome: "LUVA IRRIGA SOLDÁVEL DN 20MM",
    desc: "Embalagem com 50 unidades",
    img: "public/luva-irriga-soldavel-dn-50mm.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },
  {
    id: 58,
    codigo: "131",
    nome: "LUVA IRRIGA SOLDÁVEL DN 25MM",
    desc: "Embalagem com 50 unidades",
    img: "public/luva-irriga-soldavel-dn-50mm.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },
  {
    id: 59,
    codigo: "132",
    nome: "LUVA IRRIGA SOLDÁVEL DN 35MM",
    desc: "Embalagem com 25 unidades",
    img: "public/luva-irriga-soldavel-dn-50mm.webp",
    undPorEmbalagem: 25,
    undMedida: "unidades"
  },
  {
    id: 60,
    codigo: "1399",
    nome: "LUVA IRRIGA SOLDÁVEL DN 50MM",
    desc: "Embalagem com 10 unidades",
    img: "public/luva-irriga-soldavel-dn-50mm.webp",
    undPorEmbalagem: 10,
    undMedida: "unidades"
  },
  {
    id: 61,
    codigo: "133",
    nome: "LUVA DE REDUÇÃO SOLDÁVEL DN 25 x 20",
    desc: "Embalagem com 50 unidades",
    img: "public/luva-reducao-soldavel.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },
  {
    id: 62,
    codigo: "1476",
    nome: "LUVA DE 20MM x 1/2' ROSCA EXTERNA",
    desc: "Embalagem com 50 unidades",
    img: "public/luva-reducao-roscavel-32x1pol.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },
  {
    id: 63,
    codigo: "134",
    nome: "LUVA DE 25MM x 3/4' ROSCA EXTERNA",
    desc: "Embalagem com 50 unidades",
    img: "public/luva-roscavel-25x3.4.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },
  {
    id: 64,
    codigo: "1341",
    nome: "LUVA DE 32MM x 1' ROSCA EXTERNA",
    desc: "Embalagem com 25 unidades",
    img: "public/luva-reducao-roscavel-32x1pol.webp",
    undPorEmbalagem: 25,
    undMedida: "unidades"
  },
  {
    id: 65,
    codigo: "1349",
    nome: "LUVA DE 50 X 1.1/2' ROSCA EXTERNA",
    desc: "Embalagem com 10 unidades",
    img: "public/luva-roscavel-50x1-1.2pol.webp",
    undPorEmbalagem: 25,
    undMedida: "unidades"
  },
  {
    id: 66,
    codigo: "135",
    nome: "TE SOLDÁVEL DN 20MM",
    desc: "Embalagem com 50 unidades",
    img: "public/tee-20mm.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },
  {
    id: 67,
    codigo: "135",
    nome: "TE SOLDÁVEL DN 25MM",
    desc: "Embalagem com 25 unidades",
    img: "public/tee-20mm.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },
  {
    id: 68,
    codigo: "1461",
    nome: "TE SOLDÁVEL DN 32MM",
    desc: "Embalagem com 25 unidades",
    img: "public/tee-soldavel-50mm.webp",
    undPorEmbalagem: 25,
    undMedida: "unidades"
  },
  {
    id: 69,
    codigo: "1477",
    nome: "TE SOLDÁVEL DN 35MM",
    desc: "Embalagem com 10 unidades",
    img: "public/tee-soldavel-50mm.webp",
    undPorEmbalagem: 10,
    undMedida: "unidades"
  },
  {
    id: 70,
    codigo: "137",
    nome: "TE SOLDÁVEL DN 50MM",
    desc: "Embalagem com 10 unidades",
    img: "public/tee-soldavel-50mm.webp",
    undPorEmbalagem: 10,
    undMedida: "unidades"
  },
  {
    id: 71,
    codigo: "138",
    nome: "TE REDUÇÃO SOLDÁVEL DN 25 X 20MM",
    desc: "Embalagem com 50 unidades",
    img: "public/tee-reducao-soldavel-25x20mm.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },
  {
    id: 72,
    codigo: "139",
    nome: "TE REDUÇÃO SOLDÁVEL DN 32 X 25MM",
    desc: "Embalagem com 50 unidades",
    img: "public/tee-reducao-soldavel-25x20mm.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },
  {
    id: 73,
    codigo: "140",
    nome: "TE REDUÇÃO SOLDÁVEL DN 50 X 25MM",
    desc: "Embalagem com 10 unidades",
    img: "public/tee-reducao-soldavel-50x25mm.webp",
    undPorEmbalagem: 10,
    undMedida: "unidades"
  },
  {
    id: 74,
    codigo: "141",
    nome: "CURVA IRRI DN 50MM",
    desc: "Embalagem com 10 unidades",
    img: "public/curva-irri-90graus-soldavel-50mm.webp",
    undPorEmbalagem: 10,
    undMedida: "unidades"
  },
  {
    id: 75,
    codigo: "142",
    nome: "PLUG ROSCÁVEL 1/2' ",
    desc: "Embalagem com 50 unidades",
    img: "public/plug-roscavel-1.2.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },
  {
    id: 76,
    codigo: "1475",
    nome: "PLUG ROSCÁVEL 3/4' ",
    desc: "Embalagem com 50 unidades",
    img: "public/plug-roscavel-1.2.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },
  {
    id: 77,
    codigo: "143",
    nome: "NÍPEL 3/4' ",
    desc: "Embalagem com 50 unidades",
    img: "public/nipel-roscavel-3.4.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },
  {
    id: 78,
    codigo: "1478",
    nome: "BUCHA DE REDUÇÃO SOLDÁVEL 3/4 X 1/2 ",
    desc: "Embalagem com 50 unidades",
    img: "public/bucha-reducao-roscavel.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },
  {
    id: 79,
    codigo: "1203",
    nome: "CAP 25MM",
    desc: "Embalagem com 50 unidades",
    img: "public/cap-25mm.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },
  {
    id: 80,
    codigo: "57",
    nome: "MANGUEIRA 16MM C/ 500MTS",
    desc: "1 Unidade de bobina",
    img: "public/mangueira-polietileno.webp",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },
  {
    id: 81,
    codigo: "58",
    nome: "MANGUEIRA 16MM C/ 200MTS",
    desc: "1 Unidade de bobina",
    img: "public/mangueira-polietileno.webp",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },
  {
    id: 82,
    codigo: "61",
    nome: "MANGUEIRA 1/2 C/ 100MTS",
    desc: "1 Unidade de bobina",
    img: "public/mangueira-polietileno.webp",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },
  {
    id: 83,
    codigo: "60",
    nome: "MANGUEIRA 3/4 C/ 100MTS",
    desc: "1 Unidade de bobina",
    img: "public/mangueira-polietileno.webp",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },
  {
    id: 84,
    codigo: "59",
    nome: "MANGUEIRA 1\" C/ 100MTS",
    desc: "1 Unidade de bobina",
    img: "public/mangueira-polietileno.webp",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },
  {
    id: 85,
    codigo: "62",
    nome: "MANGUEIRA 1.1/2\" C/ 50MTS",
    desc: "1 Unidade de bobina",
    img: "public/mangueira-polietileno.webp",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },
  {
    id: 86,
    codigo: "63",
    nome: "MANGUEIRA 1.1/4\" C/ 50MTS",
    desc: "1 Unidade de bobina",
    img: "public/mangueira-polietileno.webp",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },
  {
    id: 87,
    codigo: "1165",
    nome: "MANGUEIRA 1\" X 3.0MM C/ 100MTS",
    desc: "1 Unidade de bobina",
    img: "public/mangueira-polietileno.webp",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },
  {
    id: 88,
    codigo: "64",
    nome: "TUBO PEBDA DE 40MM (TUBO PRETO)",
    desc: "1 Unidade de tubo",
    img: "public/tubo-pebda.webp",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },
  {
    id: 89,
    codigo: "69",
    nome: "TUBO PVC RÍG. PN60 20MM C/ 6MTS",
    desc: "1 Unidade de tubo",
    img: "public/tubo-rigido.webp",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },
  {
    id: 90,
    codigo: "70",
    nome: "TUBO PVC RÍG. PN60 25MM C/ 6MTS",
    desc: "1 Unidade de tubo",
    img: "public/tubo-rigido.webp",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },
  {
    id: 91,
    codigo: "71",
    nome: "TUBO PVC RÍG. PN60 32MM C/ 6MTS",
    desc: "1 Unidade de tubo",
    img: "public/tubo-rigido.webp",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },
  {
    id: 92,
    codigo: "65",
    nome: "TUBO PVC RÍG. PN40 35MM C/ 6MTS",
    desc: "1 Unidade de tubo",
    img: "public/tubo-rigido.webp",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },
  {
    id: 93,
    codigo: "66",
    nome: "TUBO PVC RÍG. PN40 50MM C/ 6MTS",
    desc: "1 Unidade de tubo",
    img: "public/tubo-rigido.webp",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },
  {
    id: 94,
    codigo: "75",
    nome: "TUBO PVC RÍG. PN80 50MM C/ 6MTS",
    desc: "1 Unidade de tubo",
    img: "public/tubo-rigido.webp",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },
  {
    id: 95,
    codigo: "67",
    nome: "TUBO PVC RÍG. PN40 75MM C/ 6MTS",
    desc: "1 Unidade de tubo",
    img: "public/tubo-rigido.webp",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },
  {
    id: 96,
    codigo: "76",
    nome: "TUBO PVC RÍG. PN80 75MM C/ 6MTS",
    desc: "1 Unidade de tubo",
    img: "public/tubo-rigido.webp",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },
  {
    id: 97,
    codigo: "68",
    nome: "TUBO PVC RÍG. PN40 100MM C/ 6MTS",
    desc: "1 Unidade de tubo",
    img: "public/tubo-rigido.webp",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },
  {
    id: 98,
    codigo: "77",
    nome: "TUBO PVC RÍG. PN80 100MM C/ 6MTS",
    desc: "1 Unidade de tubo",
    img: "public/tubo-rigido.webp",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },
  {
    id: 99,
    codigo: "78",
    nome: "TUBO PVC ROSCÁVEL 1\" C/ 6MTS",
    desc: "1 Unidade de tubo",
    img: "public/tubo-roscavel.webp",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },
  {
    id: 100,
    codigo: "79",
    nome: "TUBO PVC ROSCÁVEL 1.1/4\" C/ 6MTS",
    desc: "1 Unidade de tubo",
    img: "public/tubo-roscavel.webp",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },
  {
    id: 101,
    codigo: "1311",
    nome: "TUBO PVC ROSCÁVEL 1.1/2\" C/ 6MTS",
    desc: "1 Unidade de tubo",
    img: "public/tubo-roscavel.webp",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },
  {
    id: 102,
    codigo: "1312",
    nome: "TUBO PVC ROSCÁVEL 2\" C/ 6MTS",
    desc: "1 Unidade de tubo",
    img: "public/tubo-roscavel.webp",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  }
];

export default function App() {
  const [busca, setBusca] = useState("");
  const [carrinho, setCarrinho] = useState({});
  const [cnpj, setCnpj] = useState("");
  const [pagamento, setPagamento] = useState("avista");
  const [cnpjErro, setCnpjErro] = useState("");
  
  // Estados para dados da empresa
  const [dadosEmpresa, setDadosEmpresa] = useState(null);
  const [carregandoDados, setCarregandoDados] = useState(false);
  const [cnpjConsultado, setCnpjConsultado] = useState("");

  // FUNÇÕES DE VALIDAÇÃO DE CNPJ
  const validarCNPJ = (cnpj) => {
    cnpj = cnpj.replace(/[^\d]/g, '');
    if (!/^\d{14}$/.test(cnpj)) return false;
    if (/^(\d)\1{13}$/.test(cnpj)) return false;
    
    let soma = 0;
    let multiplicador = 5;
    for (let i = 0; i < 12; i++) {
      soma += parseInt(cnpj.charAt(i)) * multiplicador;
      multiplicador = multiplicador === 2 ? 9 : multiplicador - 1;
    }
    let resto = soma % 11;
    let dv1 = resto < 2 ? 0 : 11 - resto;
    if (parseInt(cnpj.charAt(12)) !== dv1) return false;
    
    soma = 0;
    multiplicador = 6;
    for (let i = 0; i < 13; i++) {
      soma += parseInt(cnpj.charAt(i)) * multiplicador;
      multiplicador = multiplicador === 2 ? 9 : multiplicador - 1;
    }
    resto = soma % 11;
    let dv2 = resto < 2 ? 0 : 11 - resto;
    return parseInt(cnpj.charAt(13)) === dv2;
  };

  const aplicarMascaraCNPJ = (valor) => {
    valor = valor.replace(/\D/g, '');
    valor = valor.substring(0, 14);
    valor = valor.replace(/^(\d{2})(\d)/, '$1.$2');
    valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    valor = valor.replace(/\.(\d{3})(\d)/, '.$1/$2');
    valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
    return valor;
  }

  // FUNÇÃO PARA CONSULTAR CNPJ VIA API
  const consultarCNPJ = async (cnpjLimpo) => {
    if (cnpjLimpo === cnpjConsultado) return;
    
    setCarregandoDados(true);
    setCnpjConsultado(cnpjLimpo);
    
    try {
      // Primeira tentativa: BrasilAPI
      let response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`);
      
      if (response.ok) {
        const data = await response.json();
        const dadosFormatados = {
          razao_social: data.company_name || data.nome || data.razao_social || '',
          nome_fantasia: data.trade_name || data.fantasia || data.nome_fantasia || '',
          municipio: data.city || data.municipio || '',
          uf: data.state || data.uf || '',
          logradouro: data.street || data.logradouro || '',
          numero: data.number || data.numero || '',
          bairro: data.neighborhood || data.bairro || '',
          cep: data.zip_code || data.cep || '',
          situacao: data.registration_status || data.situacao || data.descricao_situacao_cadastral || '',
          tipo: data.legal_nature || data.natureza_juridica || ''
        };
        setDadosEmpresa(dadosFormatados);
        setCnpjErro("");
      } else {
        // Segunda tentativa: ReceitaWS (backup)
        response = await fetch(`https://www.receitaws.com.br/v1/cnpj/${cnpjLimpo}`);
        
        if (response.ok) {
          const data = await response.json();
          const dadosFormatados = {
            razao_social: data.nome || '',
            nome_fantasia: data.fantasia || '',
            municipio: data.municipio || '',
            uf: data.uf || '',
            logradouro: data.logradouro || '',
            numero: data.numero || '',
            bairro: data.bairro || '',
            cep: data.cep || '',
            situacao: data.situacao || '',
            tipo: data.natureza_juridica || ''
          };
          setDadosEmpresa(dadosFormatados);
          setCnpjErro("");
        } else {
          throw new Error('CNPJ não encontrado');
        }
      }
    } catch (error) {
      console.error('Erro ao consultar CNPJ:', error);
      setCnpjErro("Erro ao consultar CNPJ. Verifique o número e tente novamente.");
      setDadosEmpresa(null);
    } finally {
      setCarregandoDados(false);
    }
  };

  const handleCNPJChange = async (e) => {
    const valor = aplicarMascaraCNPJ(e.target.value);
    setCnpj(valor);
    
    const somenteNumeros = valor.replace(/\D/g, '');
    if (somenteNumeros.length === 14) {
      if (!validarCNPJ(valor)) {
        setCnpjErro("CNPJ inválido");
        setDadosEmpresa(null);
      } else {
        setCnpjErro("");
        await consultarCNPJ(somenteNumeros);
      }
    } else if (somenteNumeros.length > 0) {
      setCnpjErro("");
      setDadosEmpresa(null);
    }
  };

  // FUNÇÕES DE ADICIONAR E REMOVER PRODUTOS DO CARRINHO
  const adicionar = (id) => {
    const produto = produtosMock.find(p => p.id === id);
    const incremento = produto?.undPorEmbalagem || 1;
    setCarrinho((c) => ({
      ...c,
      [id]: (c[id] || 0) + incremento
    }));
  }

  const remover = (id) => {
    const produto = produtosMock.find(p => p.id === id);
    const decremento = produto?.undPorEmbalagem || 1;
    
    setCarrinho((c) =>
      c[id] > decremento
        ? { ...c, [id]: c[id] - decremento }
        : Object.fromEntries(Object.entries(c).filter(([k]) => k != id))
    );
  };

  // NOVA FUNÇÃO PARA EDIÇÃO MANUAL DE QUANTIDADE
  const editarQuantidadeManual = (id, novaQuantidade) => {
    const produto = produtosMock.find(p => p.id === id);
    
    // Só permite edição manual para produtos com undPorEmbalagem = 1
    if (produto?.undPorEmbalagem !== 1) return;
    
    const quantidade = parseInt(novaQuantidade) || 0;
    
    if (quantidade <= 0) {
      setCarrinho((c) => {
        const novoCarrinho = { ...c };
        delete novoCarrinho[id];
        return novoCarrinho;
      });
    } else {
      setCarrinho((c) => ({
        ...c,
        [id]: quantidade
      }));
    }
  };

  // FUNÇÃO DE FILTRO APRIMORADA - BUSCA POR NOME E CÓDIGO
  const produtosFiltrados = produtosMock.filter((produto) => {
    if (!busca.trim()) return true; // Se não há busca, mostra todos
    
    const termoBusca = busca.toLowerCase().trim();
    const nomeMatch = produto.nome.toLowerCase().includes(termoBusca);
    const codigoMatch = produto.codigo.toLowerCase().includes(termoBusca);
    
    // Retorna true se encontrar match no nome OU no código
    return nomeMatch || codigoMatch;
  });

  const totalItens = Object.values(carrinho).reduce((total, qtd) => total + qtd, 0);

  // FUNÇÃO PARA GERAR PDF
  const gerarPDF = () => {
    if (!cnpj.trim()) {
      alert("Por favor, informe o CNPJ do cliente.");
      return;
    }
    
    if (cnpjErro) {
      alert("Por favor, corrija o CNPJ antes de gerar o PDF.");
      return;
    }
    
    if (!dadosEmpresa || !dadosEmpresa.razao_social) {
      alert("Aguarde o carregamento dos dados da empresa ou verifique se o CNPJ é válido.");
      return;
    }
    
    if (Object.keys(carrinho).length === 0) {
      alert("Por favor, adicione produtos ao carrinho antes de gerar o PDF.");
      return;
    }

    const doc = new jsPDF();

    // Cabeçalho da empresa
    doc.setFontSize(16);
    doc.text("VALLETUBO INDUSTRIA DE PLASTICOS LTDA", 14, 15);
    
    // Linha separadora
    doc.setLineWidth(0.5);
    doc.line(14, 18, 200, 18);

    // Dados do cliente com informações da API
    doc.setFontSize(12);
    doc.text("DADOS DO CLIENTE", 14, 28);
    doc.setFontSize(10);
    
    let yPos = 35;
    doc.text(`Razão Social: ${dadosEmpresa.razao_social}`, 14, yPos);
    yPos += 5;
    doc.text(`CNPJ: ${cnpj}`, 14, yPos);
    yPos += 5;
    
    // Endereço completo
    const endereco = [
      dadosEmpresa.logradouro,
      dadosEmpresa.numero,
      dadosEmpresa.bairro
    ].filter(Boolean).join(', ');
    
    if (endereco) {
      doc.text(`Endereço: ${endereco}`, 14, yPos);
      yPos += 5;
    }
    
    const cidadeUF = [dadosEmpresa.municipio, dadosEmpresa.uf].filter(Boolean).join(' - ');
    if (cidadeUF) {
      doc.text(`Cidade: ${cidadeUF}`, 14, yPos);
      yPos += 5;
    }
    
    if (dadosEmpresa.cep) {
      doc.text(`CEP: ${dadosEmpresa.cep}`, 14, yPos);
      yPos += 5;
    }
    
    doc.text(`Pagamento: ${pagamento === "avista" ? "À vista" : "A prazo"}`, 14, yPos);
    yPos += 10;

    // Tabela de produtos
    const colunas = ["Código", "Descrição", "Quantidade"];
    const linhas = Object.entries(carrinho).map(([id, qtd]) => {
      const prod = produtosMock.find((p) => p.id == id);
      return [prod.codigo, prod.nome, qtd.toLocaleString('pt-BR')];
    });

    autoTable(doc, {
      startY: yPos,
      head: [colunas],
      body: linhas,
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold'
      }
    });

    // Rodapé com totais
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Total de Itens: ${totalItens.toLocaleString('pt-BR')}`, 14, finalY);

    // Data de geração
    const dataAtual = new Date().toLocaleString('pt-BR');
    doc.setFontSize(8);
    doc.text(`Gerado em: ${dataAtual}`, 14, finalY + 10);

    // Salvar com nome mais específico
    const nomeArquivo = `pedido_${dadosEmpresa.razao_social.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    doc.save(nomeArquivo);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Cabeçalho */}
        <header style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 className="glass" style={{ 
            padding: "2rem", 
            margin: "0", 
            borderRadius: "24px",
            fontSize: "2.5rem"
          }}>
            Sistema de Pedidos - Valletubo
          </h1>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "2rem" }}>
          
          {/* Coluna Principal */}
          <div>
            
            {/* Formulário de Dados */}
            <div className="form-container">
              <h3>Dados do Cliente</h3>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "var(--gray-700)" }}>
                    CNPJ do Cliente *
                  </label>
                  <input
                    type="text"
                    className="modern-input"
                    placeholder="00.000.000/0000-00"
                    value={cnpj}
                    onChange={handleCNPJChange}
                    style={{ marginBottom: cnpjErro ? "0.5rem" : "0" }}
                  />
                  {cnpjErro && (
                    <p style={{ color: "red", fontSize: "0.875rem", margin: "0.25rem 0 0 0" }}>
                      {cnpjErro}
                    </p>
                  )}
                  {carregandoDados && (
                    <p style={{ color: "var(--primary-blue)", fontSize: "0.875rem", margin: "0.25rem 0 0 0" }}>
                      Consultando dados...
                    </p>
                  )}
                </div>
                
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "var(--gray-700)" }}>
                    Razão Social
                  </label>
                  <input
                    type="text"
                    className="modern-input"
                    value={dadosEmpresa?.razao_social || ''}
                    readOnly
                    placeholder="Será preenchido automaticamente"
                    style={{ backgroundColor: "var(--gray-100)", cursor: "not-allowed" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "var(--gray-700)" }}>
                  Forma de Pagamento
                </label>
                <div className="payment-options">
                  <label>
                    <input
                      type="radio"
                      value="avista"
                      checked={pagamento === "avista"}
                      onChange={(e) => setPagamento(e.target.value)}
                    />
                    À vista
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="aprazo"
                      checked={pagamento === "aprazo"}
                      onChange={(e) => setPagamento(e.target.value)}
                    />
                    A prazo
                  </label>
                </div>
              </div>
            </div>

            {/* Busca de Produtos - APRIMORADA */}
            <div className="glass" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
              <input
                type="text"
                className="modern-input"
                placeholder="🔍 Buscar produtos por nome ou código..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
              {busca.trim() && (
                <p style={{ 
                  fontSize: "0.875rem", 
                  color: "var(--gray-600)", 
                  margin: "0.5rem 0 0 0" 
                }}>
                  Encontrados: {produtosFiltrados.length} produto(s)
                </p>
              )}
            </div>

            {/* Grid de Produtos */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", 
              gap: "1.5rem" 
            }}>
              {produtosFiltrados.length > 0 ? (
                produtosFiltrados.map((p) => (
                  <div key={p.id} className="product-card">
                    <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                      <div style={{ 
                        height: "120px", 
                        borderRadius: "12px", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        marginBottom: "0.75rem",
                        overflow: "hidden",
                        backgroundColor: "var(--gray-100)",
                        border: "1px solid var(--gray-200)"
                      }}>
                        <img 
                          src={p.img}
                          alt={p.nome}
                          style={{
                            width: "30%",
                            height: "auto",
                            objectFit: "cover",
                            borderRadius: "12px",
                            transition: "transform 0.3s ease"
                          }}
                          onLoad={() => {
                            console.log(`✅ Imagem carregada: ${p.img}`);
                          }}
                          onError={(e) => {
                            console.error(`❌ Erro ao carregar: ${p.img}`);
                            console.error(`❌ URL completa: ${e.target.src}`);
                            
                            // Esconder a imagem quebrada
                            e.target.style.display = 'none';
                            
                            // Criar fallback apenas se não existir
                            if (!e.target.parentNode.querySelector('.fallback-icon')) {
                              const fallbackDiv = document.createElement('div');
                              fallbackDiv.className = 'fallback-icon';
                              fallbackDiv.style.cssText = `
                                width: 100%; 
                                height: 100%; 
                                display: flex; 
                                align-items: center; 
                                justify-content: center; 
                                font-size: 3rem; 
                                color: var(--gray-400);
                                background: var(--gray-100);
                                border-radius: 12px;
                              `;
                              fallbackDiv.textContent = '📦';
                              e.target.parentNode.appendChild(fallbackDiv);
                            }
                          }}
                        />
                      </div>
                      
                      <div style={{ 
                        background: "var(--gray-800)", 
                        color: "white", 
                        padding: "0.25rem 0.75rem", 
                        borderRadius: "8px", 
                        fontSize: "0.875rem", 
                        fontWeight: "600", 
                        display: "inline-block",
                        marginBottom: "0.5rem"
                      }}>
                        Código: {p.codigo}
                      </div>
                      
                      <h4 style={{ 
                        margin: "0 0 0.5rem 0", 
                        fontSize: "1.1rem", 
                        fontWeight: "600", 
                        color: "var(--gray-800)" 
                      }}>
                        {p.nome}
                      </h4>
                      
                      <p style={{ 
                        color: "var(--gray-600)", 
                        margin: "0 0 1rem 0", 
                        fontSize: "0.9rem" 
                      }}>
                        {p.desc}
                      </p>
                      
                      <p style={{ 
                        color: "var(--primary-blue)", 
                        fontWeight: "600", 
                        margin: "0 0 1rem 0", 
                        fontSize: "0.9rem" 
                      }}>
                        Vendido em lotes de {p.undPorEmbalagem} {p.undMedida}
                      </p>
                    </div>

                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.75rem"
                    }}>
                      {p.undPorEmbalagem === 1 ? (
                        // Input manual para produtos com undPorEmbalagem = 1
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <button
                            className="btn-remover"
                            onClick={() => remover(p.id)}
                            disabled={!carrinho[p.id]}
                          >
                            −
                          </button>
                          
                          <input
                            type="number"
                            min="0"
                            value={carrinho[p.id] || 0}
                            onChange={(e) => editarQuantidadeManual(p.id, e.target.value)}
                            style={{
                              width: "80px",
                              textAlign: "center",
                              padding: "0.5rem",
                              border: "2px solid var(--gray-300)",
                              borderRadius: "8px",
                              fontSize: "1rem",
                              fontWeight: "600"
                            }}
                            placeholder="0"
                          />
                          
                          <button
                            className="btn-adicionar"
                            onClick={() => adicionar(p.id)}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        // Botões normais para produtos com undPorEmbalagem > 1
                        <>
                          <button
                            className="btn-remover"
                            onClick={() => remover(p.id)}
                            disabled={!carrinho[p.id]}
                          >
                            −
                          </button>

                          <span style={{
                            minWidth: "80px",
                            textAlign: "center",
                            fontSize: "1.1rem",
                            fontWeight: "600",
                            color: "var(--gray-800)"
                          }}>
                            {carrinho[p.id] || 0} {p.undMedida}
                          </span>

                          <button
                            className="btn-adicionar"
                            onClick={() => adicionar(p.id)}
                          >
                            +
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass" style={{ 
                  padding: "3rem", 
                  textAlign: "center", 
                  gridColumn: "1 / -1" 
                }}>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
                  <h3 style={{ color: "var(--gray-600)", margin: "0 0 0.5rem 0" }}>
                    Nenhum produto encontrado
                  </h3>
                  <p style={{ color: "var(--gray-500)", margin: 0 }}>
                    Tente buscar por outro nome ou código de produto
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Carrinho Lateral */}
          <div className="cart-container" style={{ padding: "2rem" }}>
            <h3 style={{ 
              marginTop: 0, 
              color: "var(--gray-800)", 
              fontSize: "1.3rem" 
            }}>
              🛒 Carrinho de Pedidos
            </h3>

            {Object.keys(carrinho).length > 0 ? (
              <>
                <div style={{ marginBottom: "2rem", maxHeight: "400px", overflowY: "auto" }}>
                  {Object.entries(carrinho).map(([id, qtd]) => {
                    const produto = produtosMock.find((p) => p.id == id);
                    return (
                      <div
                        key={id}
                        className="glass-light"
                        style={{
                          padding: "1rem",
                          marginBottom: "0.75rem",
                          borderRadius: "12px"
                        }}
                      >
                        <h5 style={{ margin: "0 0 0.5rem 0", fontSize: "0.95rem" }}>
                          {produto.nome}
                        </h5>
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: "0.9rem",
                          color: "var(--gray-600)"
                        }}>
                          <span>Código: {produto.codigo}</span>
                          <span style={{ fontWeight: "600", color: "var(--primary-blue)" }}>
                            {qtd} {produto.undMedida}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="glass-strong" style={{ padding: "1rem", marginBottom: "1.5rem" }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <span style={{ fontSize: "1.1rem", fontWeight: "600" }}>
                      Total de Itens:
                    </span>
                    <span style={{
                      fontSize: "1.2rem",
                      fontWeight: "700",
                      color: "var(--primary-blue)"
                    }}>
                      {totalItens.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>

                <button className="btn-pdf" onClick={gerarPDF}>
                  📄 Gerar PDF do Pedido
                </button>
              </>
            ) : (
              <div style={{
                textAlign: "center",
                color: "var(--gray-500)",
                padding: "2rem 1rem"
              }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛒</div>
                <p>Nenhum item adicionado.</p>
                <p style={{ fontSize: "0.9rem" }}>
                  Adicione produtos para começar seu pedido
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
