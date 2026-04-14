#!/usr/bin/env node

// ════════════════════════════════════════════════════════
//   GRACIAS JEREMY CLI  —  v2.0.0
//   Automatizador de Git & GitHub  |  by Jeremy Sánchez
//   github.com/JeremySG31
// ════════════════════════════════════════════════════════

'use strict';

const { execSync } = require('child_process');
const readline     = require('readline-sync');
const os           = require('os');

const VERSION = '2.0.0';

// ──────────────────────────────────────────────────────
//  COLORES  (256-color ANSI para terminales modernas)
// ──────────────────────────────────────────────────────
const K = {
  reset:    '\x1b[0m',
  bold:     '\x1b[1m',
  dim:      '\x1b[2m',
  morado:   '\x1b[38;5;135m',   // Violeta
  verde:    '\x1b[38;5;82m',    // Verde neón
  amarillo: '\x1b[38;5;220m',   // Ámbar
  rojo:     '\x1b[38;5;203m',   // Rojo suave
  cian:     '\x1b[38;5;51m',    // Cian eléctrico
  rosa:     '\x1b[38;5;213m',   // Rosa claro
  gris:     '\x1b[38;5;245m',   // Gris medio
  blanco:   '\x1b[97m',
  bgVioleta:'\x1b[48;5;55m',    // Fondo violeta oscuro
  bgVerde:  '\x1b[48;5;22m',    // Fondo verde oscuro
};

// ──────────────────────────────────────────────────────
//  HELPERS DE EJECUCIÓN
// ──────────────────────────────────────────────────────
function run(cmd) {
  try   { return execSync(cmd, { stdio: 'inherit', encoding: 'utf8' }); }
  catch { return null; }
}

function getOutput(cmd) {
  try   { return execSync(cmd, { stdio: 'pipe', encoding: 'utf8' }).trim(); }
  catch { return null; }
}

function commandExists(cmd) {
  const check = os.platform() === 'win32' ? `where ${cmd}` : `command -v ${cmd}`;
  return getOutput(check) !== null;
}

// ──────────────────────────────────────────────────────
//  UI HELPERS
// ──────────────────────────────────────────────────────
const LINE  = `${K.gris}${'─'.repeat(58)}${K.reset}`;
const DLINE = `${K.morado}${'═'.repeat(58)}${K.reset}`;

function paso(n, titulo) {
  console.log(`\n${K.morado}${K.bold} ╔══[ PASO ${n} ]${K.reset}${K.blanco}${K.bold} ${titulo}${K.reset}`);
  console.log(`${K.morado}${K.dim} ╚${'─'.repeat(40)}${K.reset}`);
}

function ok(msg)   { console.log(`${K.verde}   ✔  ${msg}${K.reset}`); }
function warn(msg) { console.log(`${K.amarillo}   ⚠  ${msg}${K.reset}`); }
function fail(msg) { console.log(`${K.rojo}   ✖  ${msg}${K.reset}`); }
function info(msg) { console.log(`${K.cian}   ℹ  ${msg}${K.reset}`); }
function ask(msg)  { return readline.question(`\n${K.amarillo}   ›  ${msg}: ${K.reset}`); }

// ──────────────────────────────────────────────────────
//  TIPS ORIGINALES (Jeremy Sánchez)
// ──────────────────────────────────────────────────────
const TIPS = [
  'Un commit claro hoy te ahorra media hora de detective mañana.',
  'No subas tus .env. Nunca. Punto.',
  '"main" es producción aunque sea tu repo personal. Trátalo así.',
  'Code review contigo mismo: léelo en voz alta antes de hacer push.',
  'Si tarda más de 30 segundos explicar qué hace el commit, hazlo más pequeño.',
  'El README es tu carta de presentación. No la descuides.',
  'Versiona errores también. Aprenderás más de ellos que de los aciertos.',
  'Branches baratas, merges caros. Ramifica con intención.',
];

function randomTip() {
  return TIPS[Math.floor(Math.random() * TIPS.length)];
}

// ──────────────────────────────────────────────────────
//  BANNER  (ASCII art único)
// ──────────────────────────────────────────────────────
function showBanner() {
  console.clear();

  // Ajuste del header bar
  const header = `  🛰   GRACIAS JEREMY CLI   ·   v${VERSION}   ·   Jeremy Sánchez  `;
  const padded = header.padEnd(60);

  console.log();
  console.log(`${K.bgVioleta}${K.blanco}${K.bold}${padded}${K.reset}`);
  console.log();

  // Logo ASCII original: letras "GJ" estilizadas
  const logo = [
    `${K.morado}${K.bold}   ██████╗      ██╗`,
    `  ██╔════╝     ██║`,
    `  ██║  ███╗    ██║    Git & GitHub`,
    `  ██║   ██║    ██║    Automatizador`,
    `  ╚██████╔╝██╗ ██║`,
    `   ╚═════╝ ╚═╝ ╚═╝${K.reset}`,
  ];
  logo.forEach(l => console.log(l));

  console.log();
  console.log(DLINE);
  console.log(`${K.rosa}   💡 Consejo del día:${K.reset} ${K.dim}${randomTip()}${K.reset}`);
  console.log(DLINE);
}

// ──────────────────────────────────────────────────────
//  RESUMEN FINAL
// ──────────────────────────────────────────────────────
function showResumen(acciones) {
  const hora = new Date().toLocaleString('es-MX', { hour12: false });

  console.log(`\n${DLINE}`);
  console.log(`${K.morado}${K.bold}   ╔══════════════════════════════════════════╗`);
  console.log(`   ║          RESUMEN DE LO HECHO            ║`);
  console.log(`   ╚══════════════════════════════════════════╝${K.reset}`);

  if (acciones.length === 0) {
    warn('No se registraron acciones.');
  } else {
    acciones.forEach((a, i) => ok(`${i + 1}. ${a}`));
  }

  console.log(`\n${K.gris}   🕐 Finalizado: ${hora}${K.reset}`);
  console.log(LINE);
  console.log(`\n${K.morado}${K.bold}   ✨ ¡Todo listo! Hecho con 💜 por Jeremy  ✨${K.reset}\n`);
}

// ══════════════════════════════════════════════════════
//  INICIO
// ══════════════════════════════════════════════════════
showBanner();
const acciones = [];

// ── PASO 1: Verificar identidad Git ───────────────────
paso(1, 'Verificar identidad Git');

let gitUser  = getOutput('git config --global user.name');
let gitEmail = getOutput('git config --global user.email');

if (!gitUser || !gitEmail) {
  warn('Git no está configurado en este sistema.');
  const nuevoNombre = ask('Tu nombre completo');
  const nuevoEmail  = ask('Tu correo de GitHub');

  if (nuevoNombre && nuevoEmail) {
    run(`git config --global user.name "${nuevoNombre}"`);
    run(`git config --global user.email "${nuevoEmail}"`);
    gitUser  = nuevoNombre;
    gitEmail = nuevoEmail;
    ok('Identidad Git guardada correctamente.');
    acciones.push('Git configurado con nueva identidad');
  } else {
    fail('Datos incompletos. Se continúa sin configurar Git.');
  }
} else {
  ok(`Hola, ${K.bold}${gitUser}${K.reset}${K.verde} · ${gitEmail}`);
  acciones.push(`Identidad detectada: ${gitUser}`);
}

// ── PASO 2: Staging y commit ──────────────────────────
paso(2, 'Preparar staging y crear commit');

run('git init');
run('git add .');
ok('Archivos añadidos al área de staging.');

let commitMsg = '';
while (!commitMsg.trim()) {
  commitMsg = ask('Descripción del commit (obligatorio)');
  if (!commitMsg.trim()) fail('No puedes dejar el commit vacío. Intenta de nuevo.');
}
commitMsg = commitMsg.trim();

const committed = run(`git commit -m "${commitMsg}"`);
if (committed !== null) {
  ok(`Commit creado: "${commitMsg}"`);
  acciones.push(`Commit: "${commitMsg}"`);
} else {
  warn('Nada nuevo que commitear — árbol sin cambios.');
}

run('git branch -M main');

// ── PASO 3: Gestión del origen remoto ─────────────────
paso(3, 'Gestión del origen remoto');

const remotoActual = getOutput('git remote get-url origin');

if (remotoActual) {
  warn(`Este proyecto ya tiene un repositorio enlazado:`);
  info(remotoActual);

  const reemplazar = readline.keyInYN(`\n${K.amarillo}   ›  ¿Eliminar este enlace y configurar uno nuevo?${K.reset}`);
  if (!reemplazar) {
    info('Subiendo cambios al repositorio actual...');
    run('git push origin main');
    acciones.push(`Push → ${remotoActual}`);
    showResumen(acciones);
    process.exit(0);
  }

  getOutput('git remote remove origin');
  ok('Enlace anterior eliminado.');
}

// ── PASO 4: Elegir destino ────────────────────────────
paso(4, 'Configurar destino del repositorio');

const opciones = [
  '🆕  Crear un repositorio nuevo en GitHub',
  '🔗  Enlazar a uno que ya existe en GitHub',
];

console.log();
const eleccion = readline.keyInSelect(
  opciones,
  `${K.amarillo}   ›  ¿Qué quieres hacer?${K.reset}`,
  { cancel: `${K.rojo}❌  Cancelar${K.reset}` }
);

// ── Opción: Crear nuevo repo ──────────────────────────
if (eleccion === 0) {
  let tieneGH = commandExists('gh');

  if (!tieneGH) {
    const plataforma = os.platform();
    fail('GitHub CLI (gh) no está instalado.');

    if (plataforma === 'win32') {
      info('Instálalo con:  winget install GitHub.cli');
    } else if (plataforma === 'linux') {
      info('Intentando instalar gh automáticamente...');
      run('sudo apt update && sudo apt install gh -y');
      tieneGH = commandExists('gh');
    } else {
      info('Descárgalo en:  https://cli.github.com/');
    }
  }

  if (tieneGH) {
    const estadoAuth = getOutput('gh auth status');
    if (!estadoAuth || estadoAuth.includes('not logged in')) {
      info('Abriendo el navegador para iniciar sesión en GitHub...');
      run('gh auth login --hostname github.com -p https -w');
    } else {
      ok('Sesión de GitHub activa.');
    }

    let nombreRepo = '';
    while (!nombreRepo.trim()) {
      nombreRepo = ask('Nombre del nuevo repositorio en GitHub');
      if (!nombreRepo.trim()) fail('El nombre no puede estar vacío.');
    }
    nombreRepo = nombreRepo.trim();

    const esPrivado  = readline.keyInYN(`\n${K.amarillo}   ›  ¿Hacerlo privado?${K.reset}`);
    const flagVisib  = esPrivado ? '--private' : '--public';
    const labelVisib = esPrivado ? 'privado' : 'público';

    info(`Creando "${nombreRepo}" (${labelVisib}) y subiendo el código...`);
    run(`gh repo create ${nombreRepo} ${flagVisib} --source=. --remote=origin --push`);
    acciones.push(`Repo creado en GitHub: ${nombreRepo} (${labelVisib})`);
  }

// ── Opción: Enlazar repo existente ───────────────────
} else if (eleccion === 1) {
  let urlRemoto = '';
  while (!urlRemoto.trim()) {
    urlRemoto = ask('URL del repositorio (.git)');
    if (!urlRemoto.trim()) fail('Necesitas una URL válida para continuar.');
  }
  urlRemoto = urlRemoto.trim();

  getOutput('git remote remove origin');
  run(`git remote add origin ${urlRemoto}`);
  run('git push -u origin main');
  acciones.push(`Enlazado a: ${urlRemoto}`);

// ── Cancelado ─────────────────────────────────────────
} else {
  warn('Operación cancelada por el usuario.');
  acciones.push('Operación cancelada manualmente');
}

// ── FIN ───────────────────────────────────────────────
showResumen(acciones);