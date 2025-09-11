import { useState } from "react";
import './app.css'; // Certifique-se de importar o CSS
import './formulario.css';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const produtosMock = [
  { 
    id: 1,
    codigo: "1199", 
    nome: "MICRO ASPERSOR 50 L/H BRANCO", 
    desc: "Embalagem com 500 unidades", 
    img: "img/micro-branco.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },

  { 
    id: 2,
    codigo: "82",
    nome: "MICRO ASPERSOR 75 L/H MARROM",
    desc: "Embalagem com 500 unidades", 
    img: "img/micro-marrom.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },

  {
    id: 3,
    codigo: "81",
    nome: "MICRO ASPERSOR 100 L/H LARANJA",
    desc: "Embalagem com 500 unidades", 
    img: "img/micro-laranja.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },

  {
    id: 4,
    codigo: "80", 
    nome: "MICRO ASPERSOR 120 L/H AZUL", 
    desc: "Embalagem com 500 unidades", 
    img: "img/micro-azul.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },

  { 
    id: 5,
    codigo: "85",
    nome: "ESTACA 300MM",
    desc: "Saco com 500 unidades", 
    img: "img/estaca.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },

  {
    id: 6,
    codigo: "84",
    nome: "ESTACA 600MM", 
    desc: "Saco com 100 unidades", 
    img: "img/estaca.webp",
    undPorEmbalagem: 100,
    undMedida: "unidades"
  },

  { 
    id: 7,
    codigo: "86",
    nome: "MICROTUBO 4/6 x 100CM COM CONECTOR", 
    desc: "500 unidades", 
    img: "img/microtubo.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },

  {
    id: 8,
    codigo: "87",
    nome: "TAMPÃO 4/5",
    desc: "Embalagem com 1.000 unidades", 
    img: "img/tampao-4x5.webp",
    undPorEmbalagem: 1000,
    undMedida: "unidades"
  },

  {
    id: 9,
    codigo: "88",
    nome: "TAMPÃO 4/7", 
    desc: "Embalagem com 1.000 unidades", 
    img: "img/tampao-4x7.webp",
    undPorEmbalagem: 1000,
    undMedida: "unidades"
  },

  {
    id: 10,
    codigo: "89",
    nome: "TAMPÃO DUPLO (PLUG) 4/6", 
    desc: "Embalagem com 1.000 unidades", 
    img: "img/tampao-duplo-4x6.webp",
    undPorEmbalagem: 1000,
    undMedida: "unidades"
  },

  {
    id: 11,
    codigo: "92",
    nome: "COLAR DE TOMADA 50MM C/ ROSCA 1' ", 
    desc: "Embalagem com 25 unidades", 
    img: "img/colar-de-tomada.webp",
    undPorEmbalagem: 25,
    undMedida: "unidades"
  },

  {
    id: 12,
    codigo: "91",
    nome: "COLAR DE TOMADA 75MM C/ ROSCA 1' ", 
    desc: "Embalagem com 25 unidades", 
    img: "img/colar-de-tomada.webp",
    undPorEmbalagem: 25,
    undMedida: "unidades"
  },

  {
    id: 13,
    codigo: "90",
    nome: "COLAR DE TOMADA 100MM C/ ROSCA 1' ", 
    desc: "Embalagem com 25 unidades", 
    img: "img/colar-de-tomada.webp",
    undPorEmbalagem: 25,
    undMedida: "unidades"
  },

  {
    id: 14,
    codigo: "93",
    nome: "CHULA BILABIAL 17MM", 
    desc: "Embalagem com 500 unidades", 
    img: "img/chula-bilabial.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },

  {
    id: 15,
    codigo: "94",
    nome: "CONECTOR INICIAL 16MM COM ANEL GARRA", 
    desc: "Embalagem com 500 unidades", 
    img: "img/conector-inicial-anel-garra.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },

  {
    id: 16,
    codigo: "95",
    nome: "CONECTOR INICIAL 16MM COM ANEL LISO", 
    desc: "Embalagem com 500 unidades", 
    img: "img/conector-inicial-anel-liso.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },

  {
    id: 17,
    codigo: "96",
    nome: "UNIÃO DE 16MM COM ANÉIS GARRA", 
    desc: "Embalagem com 500 unidades", 
    img: "dist/img/uniao-anel-garra.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },

  {
    id: 18,
    codigo: "97",
    nome: "UNIÃO DE 16MM COM ANÉIS LISO", 
    desc: "Embalagem com 500 unidades", 
    img: "dist/img/uniao-anel-liso.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },

  {
    id: 19,
    codigo: "98",
    nome: "TRANSIÇÃO 16MM P/ 16MM COM ANÉIS LISO E GARRA", 
    desc: "Embalagem com 200 unidades", 
    img: "dist/img/transicao-liso-garra.webp",
    undPorEmbalagem: 200,
    undMedida: "unidades"
  },

  {
    id: 20,
    codigo: "99",
    nome: "T 16MM COM ANÉIS GARRA", 
    desc: "Embalagem com 200 unidades", 
    img: "img/t-16mm-anel-garra.webp",
    undPorEmbalagem: 200,
    undMedida: "unidades"
  },

  {
    id: 21,
    codigo: "100",
    nome: "T 16MM COM ANÉIS LISO", 
    desc: "Embalagem com 200 unidades", 
    img: "img/t-16mm-anel-liso.webp",
    undPorEmbalagem: 200,
    undMedida: "unidades"
  },

  {
    id: 22,
    codigo: "101",
    nome: "T 16MM COM ANÉIS LISO E GARRA", 
    desc: "Embalagem com 200 unidades", 
    img: "img/t-16mm-anel-garra-2-pontas-anel-liso.webp",
    undPorEmbalagem: 200,
    undMedida: "unidades"
  },

  {
    id: 23,
    codigo: "102",
    nome: "Y 16MM COM ANÉIS GARRA NAS 3 PONTAS", 
    desc: "Embalagem com 200 unidades", 
    img: "img/y-16mm-anel-garra.webp",
    undPorEmbalagem: 200,
    undMedida: "unidades"
  },

  {
    id: 24,
    codigo: "103",
    nome: "Y 16MM COM ANÉIS LISO NAS 3 PONTAS", 
    desc: "Embalagem com 200 unidades", 
    img: "img/y-16mm-anel-liso.webp",
    undPorEmbalagem: 200,
    undMedida: "unidades"
  },

  {
    id: 25,
    codigo: "104",
    nome: "Y 16MM COM ANEL GARRA E 2 PONTAS COM ANÉIS LISO", 
    desc: "Embalagem com 200 unidades", 
    img: "img/y-16mm-anel-garra-2-pontas-anel-liso.webp",
    undPorEmbalagem: 200,
    undMedida: "unidades"
  },

  {
    id: 26,
    codigo: "105",
    nome: "Y INICIAL 16MM 2 PONTAS COM ANÉIS LISO", 
    desc: "Embalagem com 200 unidades", 
    img: "img/y-inicial-16mm-anel-liso.webp",
    undPorEmbalagem: 200,
    undMedida: "unidades"
  },

  {
    id: 27,
    codigo: "106",
    nome: "Y INICIAL 16MM 2 PONTAS COM ANÉIS GARRA", 
    desc: "Embalagem com 200 unidades", 
    img: "img/y-inicial-16mm-anel-garra.webp",
    undPorEmbalagem: 200,
    undMedida: "unidades"
  },

  {
    id: 28,
    codigo: "107",
    nome: "JOELHO 16MM COM ANÉIS GARRA", 
    desc: "Embalagem com 400 unidades", 
    img: "img/joelho-16mm-anel-garra.webp",
    undPorEmbalagem: 400,
    undMedida: "unidades"
  },

  {
    id: 29,
    codigo: "108",
    nome: "JOELHO 16MM COM ANÉIS LISO", 
    desc: "Embalagem com 400 unidades", 
    img: "img/joelho-16mm-anel-liso.webp",
    undPorEmbalagem: 400,
    undMedida: "unidades"
  },

  {
    id: 30,
    codigo: "109",
    nome: "JOELHO 16MM COM ANÉIS LISO E GARRA", 
    desc: "Embalagem com 400 unidades", 
    img: "img/joelho-16mm-anel-liso-e-garra.webp",
    undPorEmbalagem: 400,
    undMedida: "unidades"
  },

  {
    id: 31,
    codigo: "111",
    nome: "FIM DE LINHA COM ANEL LISO", 
    desc: "Embalagem com 500 unidades", 
    img: "img/fim-de-linha-anel-liso.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },

  {
    id: 32,
    codigo: "110",
    nome: "FIM DE LINHA COM ANEL GARRA", 
    desc: "Embalagem com 500 unidades", 
    img: "img/fim-de-linha-anel-garra.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },

  {
    id: 33,
    codigo: "112",
    nome: "TAMPÃO DE 16MM COM ABA PARA CHULA", 
    desc: "Embalagem com 500 unidades", 
    img: "img/tampao-com-aba.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },

  {
    id: 34,
    codigo: "53",
    nome: "CONECTOR PARA MICROTUBO 4/5 (MILHEIRO)", 
    desc: "Embalagem com 1.000 unidades", 
    img: "dist/img/conector-para-microtubo.webp",
    undPorEmbalagem: 1000,
    undMedida: "unidades"
  },

  {
    id: 35,
    codigo: "113",
    nome: "VÁLVULA ANTI-VÁCUO (VENTOSA) PARA CHULA 16MM", 
    desc: "Embalagem com 50 unidades", 
    img: "img/valvula-anti-vacuo-p-chula.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },

  {
    id: 36,
    codigo: "1331",
    nome: "MINI GOTEJADOR", 
    desc: "Embalagem com 100 unidades", 
    img: "dist/img/mini-gotejador.webp",
    undPorEmbalagem: 100,
    undMedida: "unidades"
  },

  {
    id: 37,
    codigo: "114",
    nome: "REGISTRO INICIAL 16MM COM ANEL LISO", 
    desc: "Embalagem com 100 unidades", 
    img: "img/registro-inicial-16mm-anel-liso.webp",
    undPorEmbalagem: 100,
    undMedida: "unidades"
  },

  {
    id: 38,
    codigo: "115",
    nome: "REGISTRO INICIAL 16MM COM ANEL GARRA", 
    desc: "Embalagem com 100 unidades", 
    img: "img/registro-inicial-16mm-anel-garra.webp",
    undPorEmbalagem: 100,
    undMedida: "unidades"
  },

  {
    id: 39,
    codigo: "116",
    nome: "REGISTRO UNIÃO 16MM COM ANEL LISO", 
    desc: "Embalagem com 100 unidades", 
    img: "img/registro-uniao-16mm-anel-liso.webp",
    undPorEmbalagem: 100,
    undMedida: "unidades"
  },

  {
    id: 40,
    codigo: "117",
    nome: "REGISTRO UNIÃO 16MM COM ANEL GARRA", 
    desc: "Embalagem com 100 unidades", 
    img: "img/registro-uniao-16-mm-anel-garra.webp",
    undPorEmbalagem: 100,
    undMedida: "unidades"
  },

  {
    id: 41,
    codigo: "153",
    nome: "REGISTRO UNIÃO 16MM COM ANÉIS LISO E GARRA", 
    desc: "Embalagem com 100 unidades", 
    img: "img/registro-uniao-16mm-anel-liso-e-garra.webp",
    undPorEmbalagem: 100,
    undMedida: "unidades"
  },

  {
    id: 42,
    codigo: "1347",
    nome: "VENTOSA DUPLO EFEITO ROSCA 1' ", 
    desc: "Embalagem com 10 unidades", 
    img: "img/ventosa-duplo-efeito.webp",
    undPorEmbalagem: 10,
    undMedida: "unidades"
  },

  {
    id: 43,
    codigo: "1355",
    nome: "VENTOSA DUPLO EFEITO ROSCA 3/4' ", 
    desc: "Embalagem com 10 unidades", 
    img: "img/ventosa-duplo-efeito.webp",
    undPorEmbalagem: 10,
    undMedida: "unidades"
  },

  {
    id: 44,
    codigo: "118",
    nome: "ADAPTADOR ESPIGÃO C/ ROSCA EXT. 1' ", 
    desc: "Embalagem com 25 unidades", 
    img: "img/adaptador-espigao-c-rosca-1-pol.webp",
    undPorEmbalagem: 25,
    undMedida: "unidades"
  },

  {
    id: 45,
    codigo: "119",
    nome: "ADAPTADOR ESPIGÃO C/ ROSCA EXT. 1 x 3/4' ", 
    desc: "Embalagem com 50 unidades", 
    img: "img/adaptador-espigao-c-rosca-1-pol.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },

  {
    id: 46,
    codigo: "120",
    nome: "ADAPTADOR ESPIGÃO C/ ROSCA EXT. 1 x 1/2' ", 
    desc: "Embalagem com 50 unidades", 
    img: "img/adaptador-espigao-c-rosca-1-pol.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },

  {
    id: 47,
    codigo: "121",
    nome: "ADAPTADOR ESPIGÃO C/ ROSCA EXT. 3/4 x 1/2' ", 
    desc: "Embalagem com 50 unidades", 
    img: "img/adaptador-espigao-c-rosca-1-pol.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },

  {
    id: 48,
    codigo: "122",
    nome: "ADAPTADOR ESPIGÃO C/ ROSCA EXT. 3/4 x 1' ", 
    desc: "Embalagem com 50 unidades", 
    img: "img/adaptador-espigao-c-rosca-1-pol.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },

  {
    id: 49,
    codigo: "123",
    nome: "ADAPTADOR ESPIGÃO C/ ROSCA EXT. 3/4' ", 
    desc: "Embalagem com 50 unidades", 
    img: "img/adaptador-espigao-c-rosca-1-pol.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },

  {
    id: 50,
    codigo: "124",
    nome: "JOELHO 90° SOLDÁVEL DN 20MM", 
    desc: "Embalagem com 50 unidades", 
    img: "img/joelho-25mm.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },

  {
    id: 51,
    codigo: "125",
    nome: "JOELHO 90° SOLDÁVEL DN 25MM", 
    desc: "Embalagem com 50 unidades", 
    img: "img/joelho-25mm.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },

  {
    id: 52,
    codigo: "1401",
    nome: "JOELHO 90° SOLDÁVEL DN 32MM", 
    desc: "Embalagem com 50 unidades", 
    img: "img/joelho-25mm.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },

  {
    id: 53,
    codigo: "125",
    nome: "JOELHO 90° SOLDÁVEL DN 50MM", 
    desc: "Embalagem com 10 unidades", 
    img: "img/joelho-25mm.webp",
    undPorEmbalagem: 10,
    undMedida: "unidades"
  },

  {
    id: 54,
    codigo: "127",
    nome: "JOELHO 45° SOLDÁVEL DN 35MM", 
    desc: "Embalagem com 25 unidades", 
    img: "img/joelho-45-35mm.webp",
    undPorEmbalagem: 25,
    undMedida: "unidades"
  },

  {
    id: 55,
    codigo: "1404",
    nome: "JOELHO 45° SOLDÁVEL DN 50MM", 
    desc: "Embalagem com 10 unidades", 
    img: "img/joelho-45-35mm.webp",
    undPorEmbalagem: 10,
    undMedida: "unidades"
  },

  {
    id: 56,
    codigo: "129",
    nome: "JOELHO 90° REDUÇÃO SOLDÁVEL DN 25 x 20", 
    desc: "Embalagem com 50 unidades", 
    img: "img/joelho-reducao-soldavel-25x20mm.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },

  {
    id: 57,
    codigo: "130",
    nome: "LUVA IRRIGA SOLDÁVEL DN 20MM", 
    desc: "Embalagem com 50 unidades", 
    img: "img/luva-irriga-soldavel-dn-50mm.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },

  {
    id: 58,
    codigo: "131",
    nome: "LUVA IRRIGA SOLDÁVEL DN 25MM", 
    desc: "Embalagem com 50 unidades", 
    img: "img/luva-irriga-soldavel-dn-50mm.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },

  {
    id: 59,
    codigo: "132",
    nome: "LUVA IRRIGA SOLDÁVEL DN 35MM", 
    desc: "Embalagem com 25 unidades", 
    img: "img/luva-irriga-soldavel-dn-50mm.webp",
    undPorEmbalagem: 25,
    undMedida: "unidades"
  },

  {
    id: 60,
    codigo: "1399",
    nome: "LUVA IRRIGA SOLDÁVEL DN 50MM", 
    desc: "Embalagem com 10 unidades", 
    img: "img/luva-irriga-soldavel-dn-50mm.webp",
    undPorEmbalagem: 10,
    undMedida: "unidades"
  },

  {
    id: 61,
    codigo: "133",
    nome: "LUVA DE REDUÇÃO SOLDÁVEL DN 25 x 20", 
    desc: "Embalagem com 50 unidades", 
    img: "img/luva-reducao-soldavel.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },

  {
    id: 62,
    codigo: "1476",
    nome: "LUVA DE 20MM x 1/2' ROSCA EXTERNA", 
    desc: "Embalagem com 50 unidades", 
    img: "img/luva-reducao-roscavel-32x1pol.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },

  {
    id: 63,
    codigo: "134",
    nome: "LUVA DE 25MM x 3/4' ROSCA EXTERNA", 
    desc: "Embalagem com 50 unidades", 
    img: "img/luva-roscavel-25x3.4.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },

  {
    id: 64,
    codigo: "1341",
    nome: "LUVA DE 32MM x 1' ROSCA EXTERNA", 
    desc: "Embalagem com 25 unidades", 
    img: "img/luva-reducao-roscavel-32x1pol.webp",
    undPorEmbalagem: 25,
    undMedida: "unidades"
  },

  {
    id: 65,
    codigo: "1349",
    nome: "LUVA DE 50 X 1.1/2' ROSCA EXTERNA", 
    desc: "Embalagem com 10 unidades", 
    img: "img/luva-roscavel-50x1-1.2pol.webp",
    undPorEmbalagem: 25,
    undMedida: "unidades"
  },

  {
    id: 66,
    codigo: "135",
    nome: "TE SOLDÁVEL DN 20MM", 
    desc: "Embalagem com 50 unidades", 
    img: "img/tee-20mm.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },

  {
    id: 67,
    codigo: "135",
    nome: "TE SOLDÁVEL DN 25MM", 
    desc: "Embalagem com 25 unidades", 
    img: "img/tee-20mm.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },

  {
    id: 68,
    codigo: "1461",
    nome: "TE SOLDÁVEL DN 32MM", 
    desc: "Embalagem com 25 unidades", 
    img: "img/tee-soldavel-50mm.webp",
    undPorEmbalagem: 25,
    undMedida: "unidades"
  },

  {
    id: 69,
    codigo: "1477",
    nome: "TE SOLDÁVEL DN 35MM", 
    desc: "Embalagem com 10 unidades", 
    img: "img/tee-soldavel-50mm.webp",
    undPorEmbalagem: 10,
    undMedida: "unidades"
  },

  {
    id: 70,
    codigo: "137",
    nome: "TE SOLDÁVEL DN 50MM", 
    desc: "Embalagem com 10 unidades", 
    img: "img/tee-soldavel-50mm.webp",
    undPorEmbalagem: 10,
    undMedida: "unidades"
  },

  {
    id: 71,
    codigo: "138",
    nome: "TE REDUÇÃO SOLDÁVEL DN 25 X 20MM", 
    desc: "Embalagem com 50 unidades", 
    img: "img/tee-reducao-soldavel-25x20mm.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },

  {
    id: 72,
    codigo: "139",
    nome: "TE REDUÇÃO SOLDÁVEL DN 32 X 25MM", 
    desc: "Embalagem com 50 unidades", 
    img: "img/tee-reducao-soldavel-25x20mm.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },

  {
    id: 72,
    codigo: "140",
    nome: "TE REDUÇÃO SOLDÁVEL DN 50 X 25MM", 
    desc: "Embalagem com 10 unidades", 
    img: "img/tee-reducao-soldavel-50x25mm.webp",
    undPorEmbalagem: 10,
    undMedida: "unidades"
  },

  {
    id: 73,
    codigo: "141",
    nome: "CURVA IRRI DN 50MM", 
    desc: "Embalagem com 10 unidades", 
    img: "img/curva-irri-90graus-soldavel-50mm.webp",
    undPorEmbalagem: 10,
    undMedida: "unidades"
  },

  {
    id: 74,
    codigo: "142",
    nome: "PLUG ROSCÁVEL 1/2' ", 
    desc: "Embalagem com 50 unidades", 
    img: "img/plug-roscavel-1.2.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },

  {
    id: 75,
    codigo: "1475",
    nome: "PLUG ROSCÁVEL 3/4' ", 
    desc: "Embalagem com 50 unidades", 
    img: "img/plug-roscavel-1.2.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },

  {
    id: 76,
    codigo: "143",
    nome: "NÍPEL 3/4' ", 
    desc: "Embalagem com 50 unidades", 
    img: "img/nipel-roscavel-3.4.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },

  {
    id: 77,
    codigo: "1478",
    nome: "BUCHA DE REDUÇÃO SOLDÁVEL 3/4 X 1/2 ", 
    desc: "Embalagem com 50 unidades", 
    img: "dist/img/bucha-reducao-roscavel.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },

  {
    id: 78,
    codigo: "1203",
    nome: "CAP 25MM", 
    desc: "Embalagem com 50 unidades", 
    img: "dist/img/cap-25mm.webp",
    undPorEmbalagem: 50,
    undMedida: "unidades"
  },

  {
    id: 79,
    codigo: "57",
    nome: "MANGUEIRA 16MM C/ 500MTS", 
    desc: "1 Unidade de bobina", 
    img: "dist/img/mangueira-polietileno.webp",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },

  {
    id: 80,
    codigo: "58",
    nome: "MANGUEIRA 16MM C/ 200MTS", 
    desc: "1 Unidade de bobina", 
    img: "dist/img/mangueira-polietileno.webp",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },

  {
    id: 81,
    codigo: "61",
    nome: "MANGUEIRA 1/2 C/ 100MTS", 
    desc: "1 Unidade de bobina", 
    img: "dist/img/mangueira-polietileno.webp",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },

  {
    id: 82,
    codigo: "60",
    nome: "MANGUEIRA 3/4 C/ 100MTS", 
    desc: "1 Unidade de bobina", 
    img: "dist/img/mangueira-polietileno.webp",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },

  {
    id: 83,
    codigo: "59",
    nome: "MANGUEIRA 1\"\ C/ 100MTS", 
    desc: "1 Unidade de bobina", 
    img: "dist/img/mangueira-polietileno.webp",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },

  {
    id: 84,
    codigo: "62",
    nome: "MANGUEIRA 1.1/2\"\ C/ 50MTS", 
    desc: "1 Unidade de bobina", 
    img: "dist/img/mangueira-polietileno.webp",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },

  {
    id: 85,
    codigo: "63",
    nome: "MANGUEIRA 1.1/4\"\ C/ 50MTS", 
    desc: "1 Unidade de bobina", 
    img: "dist/img/mangueira-polietileno.webp",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },

  {
    id: 86,
    codigo: "1165",
    nome: "MANGUEIRA 1\"\ X 3.0MM C/ 100MTS", 
    desc: "1 Unidade de bobina", 
    img: "dist/img/mangueira-polietileno.webp",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },

  {
    id: 87,
    codigo: "64",
    nome: "TUBO PEBDA DE 40MM (TUBO PRETO)", 
    desc: "1 Unidade de tubo", 
    img: "dist/img/tubo-pebda.jpg",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },

  {
    id: 88,
    codigo: "69",
    nome: "TUBO PVC RÍG. PN60 20MM C/ 6MTS", 
    desc: "1 Unidade de tubo", 
    img: "dist/img/tubo-rigido.png",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },

  {
    id: 89,
    codigo: "70",
    nome: "TUBO PVC RÍG. PN60 25MM C/ 6MTS", 
    desc: "1 Unidade de tubo", 
    img: "dist/img/tubo-rigido.png",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },

  {
    id: 90,
    codigo: "71",
    nome: "TUBO PVC RÍG. PN60 32MM C/ 6MTS", 
    desc: "1 Unidade de tubo", 
    img: "dist/img/tubo-rigido.png",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },

  {
    id: 91,
    codigo: "65",
    nome: "TUBO PVC RÍG. PN40 35MM C/ 6MTS", 
    desc: "1 Unidade de tubo", 
    img: "dist/img/tubo-rigido.png",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },

  {
    id: 92,
    codigo: "66",
    nome: "TUBO PVC RÍG. PN40 50MM C/ 6MTS", 
    desc: "1 Unidade de tubo", 
    img: "dist/img/tubo-rigido.png",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },

  {
    id: 93,
    codigo: "75",
    nome: "TUBO PVC RÍG. PN80 50MM C/ 6MTS", 
    desc: "1 Unidade de tubo", 
    img: "dist/img/tubo-rigido.png",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },

  {
    id: 94,
    codigo: "67",
    nome: "TUBO PVC RÍG. PN40 75MM C/ 6MTS", 
    desc: "1 Unidade de tubo", 
    img: "dist/img/tubo-rigido.png",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },

  {
    id: 95,
    codigo: "76",
    nome: "TUBO PVC RÍG. PN80 75MM C/ 6MTS", 
    desc: "1 Unidade de tubo", 
    img: "dist/img/tubo-rigido.png",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },

  {
    id: 96,
    codigo: "68",
    nome: "TUBO PVC RÍG. PN40 100MM C/ 6MTS", 
    desc: "1 Unidade de tubo", 
    img: "dist/img/tubo-rigido.png",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },

  {
    id: 97,
    codigo: "77",
    nome: "TUBO PVC RÍG. PN80 100MM C/ 6MTS", 
    desc: "1 Unidade de tubo", 
    img: "dist/img/tubo-rigido.png",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },

  {
    id: 98,
    codigo: "78",
    nome: "TUBO PVC ROSCÁVEL 1\"\ C/ 6MTS", 
    desc: "1 Unidade de tubo", 
    img: "dist/img/tubo-roscavel.png",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },

  {
    id: 99,
    codigo: "79",
    nome: "TUBO PVC ROSCÁVEL 1.1/4\"\ C/ 6MTS", 
    desc: "1 Unidade de tubo", 
    img: "dist/img/tubo-roscavel.png",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },

  {
    id: 100,
    codigo: "1311",
    nome: "TUBO PVC ROSCÁVEL 1.1/2\"\ C/ 6MTS", 
    desc: "1 Unidade de tubo", 
    img: "dist/img/tubo-roscavel.png",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },

  {
    id: 101,
    codigo: "1312",
    nome: "TUBO PVC ROSCÁVEL 2\"\ C/ 6MTS", 
    desc: "1 Unidade de tubo", 
    img: "dist/img/tubo-roscavel.png",
    undPorEmbalagem: 1,
    undMedida: "unidades"
  },
];

export default function App() {
  const [busca, setBusca] = useState("");
  const [carrinho, setCarrinho] = useState({});
  const [cnpj, setCnpj] = useState("");
  
  const [pagamento, setPagamento] = useState("avista");
  const [ cnpjErro, setCnpjErro] = useState("");

// Novos estados para dados da empresa
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
    if (cnpjLimpo === cnpjConsultado) return; // Evita consultas repetidas

    setCarregandoDados(true);
    setCnpjConsultado(cnpjLimpo);

    try {
      // Primeira tentativa: BrasilAPI
      let response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`);

      if (response.ok) {
        const data = await response.json();
        
        // Padronizar os dados independente da API
        const dadosFormatados = {
          razao_social: data.company_name || data.nome || '',
          nome_fantasia: data.trade_name || data.fantasia || '',
          municipio: data.city || data.municipio || '',
          uf: data.state || data.uf || '',
          logradouro: data.street || data.logradouro || '',
          numero: data.number || data.numero || '',
          bairro: data.neighborhood || data.bairro || '',
          cep: data.zip_code || data.cep || '',
          situacao: data.registration_status || data.situacao || '',
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
        // Consulta automaticamente quando CNPJ é válido e completo
        await consultarCNPJ(somenteNumeros);
      }
    } else if (somenteNumeros.length > 0) {
      setCnpjErro("");
      setDadosEmpresa(null);
    }
  };

//  ---------------------------------------------------------------------
// FUNÇÕES DE ADICIONAR E REMOVER PRODUTOS DO CARRINHO
  const adicionar = (id) => {
    const produto = produtosMock.find(p => p.id === id);
    const incremento = produto?.undPorEmbalagem || 1;
    setCarrinho((c) => ({ ...c, [id]: (c[id] || 0) + incremento }));
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

  const produtosFiltrados = produtosMock.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const totalItens = Object.values(carrinho).reduce((total, qtd) => total + qtd, 0);
  // --------------------------------------------------------------------


  /* FUNÇÃO PARA GERAR PDF */
  const gerarPDF = () => {

    // Validação antes de gerar o PDF
    if (!cnpj.trim()) {
      alert("Por favor, informe o CNPJ do cliente.");
      return;
    }

    if (cnpjErro) {
      alert("Por favor, corrija o CNPJ antes de gerar o PDF.");
      return;
    }

    if (!dadosEmpresa || (!dadosEmpresa)) {
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
      yPos +=5;
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

    // Salvar com nome mais espeficico
    const nomeArquivo = `pedido_${dadosEmpresa.razao_social.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;

    // Salvar
    doc.save(nomeArquivo);
  };


  return (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      {/* Container principal com glassmorphism */}
      <div className="glass" style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '2rem' 
      }}>
        
        {/* Título principal */}
        <h1>VallePedidos</h1>

        {/* FORMULÁRIO DE CLIENTE */}
        <div className="form-container">
          <h3>Dados do Cliente</h3>

          <div style={{ position: 'relative', marginBottom: '1rem'}}>
            <input 
            type="text" 
            placeholder="CNPJ"
            className={`modern-input ${cnpjErro ? 'error' : ''}`}
            value={cnpj}
            onChange={handleCNPJChange}
            maxLength="18"
            style={{
              borderColor: cnpjErro ? '#ef4444' : (dadosEmpresa ? '#10b981' : undefined),
              boxShadow: cnpjErro ? '0 0 0 1px #ef4444' : (dadosEmpresa ? '0 0 0 1px #10b981' : undefined)
            }}
            />
            {carregandoDados && (
              <div style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1rem'
              }}>
                ⏳
              </div> 
            )}
            {cnpjErro && (
              <div style={{
                color: '#ef4444',
                fontSize: '0.85rem',
                marginTop: '.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '.25rem'
              }}>
                ⚠️ {cnpjErro}
              </div>
            )}
            {dadosEmpresa && !cnpjErro && (
              <div style={{
                color: '#10b981',
                fontSize: '.85rem',
                marginTop: '.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '.25rem'
              }}>
                ✅ CNPJ válido e dados carregados
              </div>
            )}
          </div>
          
          <input 
            type = "text" 
            placeholder = "Razão Social" 
            className = "modern-input"
            value = {dadosEmpresa?.razao_social || ""}
            onChange={(e) => setDadosEmpresa(prev => ({ ...prev, razao_social: e.target.value }))}
            style = {{ marginBottom: '1rem' }}
          />

          {/* Exibir dados da empresa quando carregados */}
          {dadosEmpresa && (
            <div className="glass-light" style={{
              padding: '1rem',
              marginBottom: '1rem',
              fontSize: '.9rem',
              color: '#475569'
            }}>
              <div style={{ fontWeight: '600', marginBottom: '.5rem', color: '#334155'}}>
                📋 Dados da Empresa:
              </div>
              {dadosEmpresa.nome_fantasia && (
                <div>🏷️ Nome Fantasia: {dadosEmpresa.nome_fantasia}</div>
              )}
              <div>🏙️ Cidade: {dadosEmpresa.municipio} - {dadosEmpresa.uf}</div>
              {dadosEmpresa.situacao && (
                <div>📊 Situação: {dadosEmpresa.situacao}</div>
              )}
            </div>
            
          )}
          
          {/* Condições de pagamento */}
          <div className="payment-options">
            <label>
              <input
                type="radio"
                value="avista"
                checked={pagamento === "avista"}
                onChange={() => setPagamento("avista")}
              /> À vista
            </label>
            <label>
              <input
                type="radio"
                value="aprazo"
                checked={pagamento === "aprazo"}
                onChange={() => setPagamento("aprazo")}
              /> A prazo
            </label>
          </div>
        </div>

        {/* Barra de pesquisa moderna */}
        <div style={{ marginBottom: '2rem' }}>
          <input
            type="text"
            placeholder="🔍 Pesquisar produtos..."
            className="modern-input fade-in"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '2rem',
          alignItems: 'flex-start'
        }}>
          {/* Lista de produtos */}
          <div style={{ 
            flex: '1', 
            display: 'flex', 
            flexDirection: 'column',
            gap: '1.5rem' 
          }}>
            {produtosFiltrados.length === 0 ? (
              <div className="glass-light" style={{ 
                padding: '3rem', 
                textAlign: 'center' 
              }}>
                <p style={{ fontSize: '1.1rem', color: '#64748b' }}>
                  Nenhum produto encontrado para "{busca}"
                </p>
              </div>
            ) : (
              produtosFiltrados.map((p, index) => (
                <div
                  key={p.id}
                  className="product-card fade-in"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem'
                  }}
                >
                  <img
                    src={p.img}
                    alt={p.nome}
                    className="product-image"
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      objectFit: 'cover' 
                    }}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZjFmNWY5IiByeD0iOCIvPgo8cGF0aCBkPSJtMjQgMzJoMzJ2MTZoLTMyeiIgZmlsbD0iI2NiZDVlMSIvPgo8Y2lyY2xlIGN4PSIzMiIgY3k9IjM2IiByPSIyIiBmaWxsPSIjOTRhM2I4Ii8+CjxwYXRoIGQ9Im0yNiA0NiA2LTYgNC4wMiA0LjAyIDEwLTEwIDQgNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+';
                    }}
                  />
                  <div style={{ flex: '1' }}>
                    <h2>{p.nome}</h2>
                    <p>{p.desc}</p>
                  </div>
                  <div className="quantity-controls">
                    <button
                      onClick={() => remover(p.id)}
                      className="btn-remover"
                      disabled={!carrinho[p.id]}
                      style={{
                        opacity: carrinho[p.id] ? 1 : 0.5,
                        cursor: carrinho[p.id] ? 'pointer' : 'not-allowed'
                      }}
                    >
                      −
                    </button>
                    <span className="quantity-display">
                      {carrinho[p.id] || 0}
                    </span>
                    <button
                      onClick={() => adicionar(p.id)}
                      className="btn-adicionar"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Carrinho lateral */}
          <div className="cart-container" style={{ 
            width: '350px', 
            padding: '2rem' 
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '1.5rem'
            }}>
              <h3>🛒 Carrinho</h3>
              {totalItens > 0 && (
                <span style={{ 
                  background: 'linear-gradient(135deg, #0020adff 0%, #758effff 100%)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }}>
                  {totalItens.toLocaleString('pt-BR')} itens
                </span>
              )}
            </div>
            
            {Object.entries(carrinho).length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '3rem 1rem',
                color: '#64748b'
              }}>
                <div style={{ 
                  fontSize: '3rem', 
                  marginBottom: '1rem',
                  opacity: 0.5
                }}>
                  🛍️
                </div>
                <p>Nenhum item adicionado.</p>
                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  Adicione produtos para começar seu pedido
                </p>
              </div>
            ) : (
              <>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: '1rem',
                  marginBottom: '2rem'
                }}>
                  {Object.entries(carrinho).map(([id, qtd]) => {
                    const prod = produtosMock.find((p) => p.id == id);
                    return (
                      <div
                        key={id}
                        className="glass-light"
                        style={{ 
                          padding: '1rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <div style={{ 
                            fontWeight: '600', 
                            fontSize: '0.95rem',
                            color: '#334155'
                          }}>
                            {prod.nome}
                          </div>
                          <div style={{ 
                            fontSize: '0.8rem', 
                            color: '#64748b',
                            marginTop: '0.25rem'
                          }}>
                            Quantidade: {qtd.toLocaleString('pt-BR')}
                          </div>
                        </div>
                        <button
                          onClick={() => remover(id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            borderRadius: '6px',
                            fontSize: '1.1rem',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
                          onMouseOut={(e) => e.target.style.background = 'none'}
                        >
                          🗑️
                        </button>
                      </div>
                    );
                  })}
                </div>
                
                {/*
                
                <button 
                  className="btn-primary" 
                  onClick={() => alert('Pedido enviado! 🎉')}
                >
                  Finalizar Pedido
                </button>
                */}
                
                <button 
                  className="btn-pdf" 
                  onClick={gerarPDF}
                >
                  Gerar PDF
                </button>


              </>

              
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
