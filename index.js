#!/usr/bin/env node

// ════════════════════════════════════════════════════════
//   GRACIAS JEREMY CLI  —  v2.1.0
//   Automatizador de Git & GitHub  |  by Jeremy Sánchez
//   github.com/JeremySG31
// ════════════════════════════════════════════════════════

'use strict';

const { execFileSync, execSync } = require('child_process');
const readline                   = require('readline-sync');
const os                         = require('os');

const VERSION    = '2.1.0';
const MAX_RETRY  = 5;   // Máximo de intentos en cualquier input

// ──────────────────────────────────────────────────────
//  COLORES  (256-color ANSI para terminales modernas)
// ──────────────────────────────────────────────────────
const K = {
  reset:    '\x1b[0m',
  bold:     '\x1b[1m',
  dim:      '\x1b[2m',
  morado:   '\x1b[38;5;135m',
  verde:    '\x1b[38;5;82m',
  amarillo: '\x1b[38;5;220m',
  rojo:     '\x1b[38;5;203m',
  cian:     '\x1b[38;5;51m',
  rosa:     '\x1b[38;5;213m',
  gris:     '\x1b[38;5;245m',
  blanco:   '\x1b[97m',
  bgVioleta:'\x1b[48;5;55m',
};

// ──────────────────────────────────────────────────────
//  EJECUCIÓN SEGURA  (sin shell — previene inyección)
//
//  ✔ execFileSync(cmd, args[]) NO pasa por /bin/sh,
//    por lo que caracteres como ; | & $ ` no son
//    interpretados como comandos de shell.
// ──────────────────────────────────────────────────────

/**
 * Ejecuta un comando sin shell y muestra su salida.
 * @param {string}   cmd  - Ejecutable (p.ej. 'git')
 * @param {string[]} args - Argumentos como array (p.ej. ['commit', '-m', msg])
 */
function run(cmd, args = []) {
  try {
    return execFileSync(cmd, args, { stdio: 'inherit', encoding: 'utf8' });
  } catch {
    return null;
  }
}

/**
 * Igual que run() pero captura y retorna la salida estándar.
 */
function getOutput(cmd, args = []) {
  try {
    return execFileSync(cmd, args, { stdio: 'pipe', encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

/**
 * Verifica si un ejecutable existe en el PATH sin pasar por shell.
 */
function commandExists(cmd) {
  try {
    const checkCmd  = os.platform() === 'win32' ? 'where' : 'which';
    execFileSync(checkCmd, [cmd], { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

// ──────────────────────────────────────────────────────
//  VALIDACIÓN DE INPUTS
// ──────────────────────────────────────────────────────

/**
 * Limpia el mensaje de commit:
 * - Elimina caracteres de control (salvo espacios normales)
 * - Recorta a 200 caracteres máximo
 */
function sanitizeCommit(msg) {
  return msg.replace(/[\x00-\x08\x0b-\x1f\x7f]/g, '').trim().slice(0, 200);
}

/**
 * Nombre de usuario Git: solo caracteres imprimibles ASCII, máx 100 chars.
 */
function isValidName(name) {
  return name.length > 0 && name.length <= 100 && /^[\x20-\x7e]+$/.test(name);
}

/**
 * Validación básica de formato de email.
 */
function isValidEmail(email) {
  return /^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{2,}$/.test(email);
}

/**
 * URL de repositorio Git válida:
 * - HTTPS:  https://github.com/user/repo  (o .git)
 * - SSH:    git@github.com:user/repo.git
 */
function isValidGitUrl(url) {
  return (
    /^https:\/\/[a-zA-Z0-9._/-]+$/.test(url) ||
    /^git@[a-zA-Z0-9._-]+:[a-zA-Z0-9._/-]+$/.test(url)
  );
}

/**
 * Nombre de repo GitHub: alfanumérico, guiones, subrayados, puntos.
 * Sin espacios, sin comenzar/terminar con punto o guión.
 */
function isValidRepoName(name) {
  return /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,98}[a-zA-Z0-9]$|^[a-zA-Z0-9]$/.test(name);
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

/**
 * Pide un input al usuario con validación y límite de reintentos.
 * @param {string}   prompt   - Texto que se muestra al usuario
 * @param {Function} validate - Función que retorna true si el valor es válido
 * @param {string}   errorMsg - Mensaje de error cuando no pasa la validación
 * @returns {string|null} - El valor válido o null si se agotaron los intentos
 */
function askValidated(prompt, validate, errorMsg) {
  for (let i = 0; i < MAX_RETRY; i++) {
    const valor = ask(prompt).trim();
    if (validate(valor)) return valor;
    fail(errorMsg);
    if (i < MAX_RETRY - 1) warn(`Intento ${i + 1}/${MAX_RETRY}.`);
  }
  fail(`Se superaron los ${MAX_RETRY} intentos permitidos. Abortando.`);
  return null;
}

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
  const header = `  🛰   GRACIAS JEREMY CLI   ·   v${VERSION}   ·   Jeremy Sánchez  `;
  console.log();
  console.log(`${K.bgVioleta}${K.blanco}${K.bold}${header.padEnd(60)}${K.reset}`);
  console.log();

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

let gitUser  = getOutput('git', ['config', '--global', 'user.name']);
let gitEmail = getOutput('git', ['config', '--global', 'user.email']);

if (!gitUser || !gitEmail) {
  warn('Git no está configurado en este sistema.');

  const nuevoNombre = askValidated(
    'Tu nombre completo',
    isValidName,
    'Nombre inválido. Solo caracteres imprimibles, máx 100 caracteres.'
  );

  const nuevoEmail = askValidated(
    'Tu correo de GitHub',
    isValidEmail,
    'Formato de email inválido (ejemplo: tu@correo.com).'
  );

  if (nuevoNombre && nuevoEmail) {
    // Los args se pasan como array — sin riesgo de inyección
    run('git', ['config', '--global', 'user.name',  nuevoNombre]);
    run('git', ['config', '--global', 'user.email', nuevoEmail]);
    gitUser  = nuevoNombre;
    gitEmail = nuevoEmail;
    ok('Identidad Git guardada correctamente.');
    acciones.push('Git configurado con nueva identidad');
  } else {
    fail('No se pudo configurar Git. Continuando sin identidad.');
  }
} else {
  ok(`Hola, ${K.bold}${gitUser}${K.reset}${K.verde} · ${gitEmail}`);
  acciones.push(`Identidad detectada: ${gitUser}`);
}

// ── PASO 2: Staging y commit ──────────────────────────
paso(2, 'Preparar staging y crear commit');

run('git', ['init']);
run('git', ['add', '.']);
ok('Archivos añadidos al área de staging.');

const commitRaw = askValidated(
  'Descripción del commit (obligatorio)',
  v => v.length > 0,
  'El mensaje de commit no puede estar vacío.'
);

if (!commitRaw) {
  fail('No se pudo obtener un mensaje de commit válido. Abortando.');
  process.exit(1);
}

// Sanitizar antes de usar (elimina caracteres de control)
const commitMsg = sanitizeCommit(commitRaw);

const committed = run('git', ['commit', '-m', commitMsg]);
if (committed !== null) {
  ok(`Commit creado: "${commitMsg}"`);
  acciones.push(`Commit: "${commitMsg}"`);
} else {
  warn('Nada nuevo que commitear — árbol sin cambios.');
}

run('git', ['branch', '-M', 'main']);

// ── PASO 3: Gestión del origen remoto ─────────────────
paso(3, 'Gestión del origen remoto');

const remotoActual = getOutput('git', ['remote', 'get-url', 'origin']);

if (remotoActual) {
  warn('Este proyecto ya tiene un repositorio enlazado:');
  info(remotoActual);

  const reemplazar = readline.keyInYN(
    `\n${K.amarillo}   ›  ¿Eliminar este enlace y configurar uno nuevo?${K.reset}`
  );

  if (!reemplazar) {
    info('Subiendo cambios al repositorio actual...');
    run('git', ['push', 'origin', 'main']);
    acciones.push(`Push → ${remotoActual}`);
    showResumen(acciones);
    process.exit(0);
  }

  run('git', ['remote', 'remove', 'origin']);
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
      // apt requiere shell compuesto — se usa execSync solo aquí,
      // con comandos fijos (sin input de usuario), por lo que es seguro.
      try {
        execSync('sudo apt update && sudo apt install gh -y', { stdio: 'inherit' });
      } catch { /* el usuario puede instalarlo manualmente */ }
      tieneGH = commandExists('gh');
    } else {
      info('Descárgalo en:  https://cli.github.com/');
    }
  }

  if (tieneGH) {
    const estadoAuth = getOutput('gh', ['auth', 'status']);
    if (!estadoAuth || estadoAuth.includes('not logged in')) {
      info('Abriendo el navegador para iniciar sesión en GitHub...');
      run('gh', ['auth', 'login', '--hostname', 'github.com', '-p', 'https', '-w']);
    } else {
      ok('Sesión de GitHub activa.');
    }

    const nombreRepo = askValidated(
      'Nombre del nuevo repositorio en GitHub',
      isValidRepoName,
      'Nombre inválido. Usa solo letras, números, guiones o subrayados (sin espacios).'
    );

    if (!nombreRepo) {
      fail('Nombre de repositorio inválido. Abortando.');
      process.exit(1);
    }

    const esPrivado  = readline.keyInYN(`\n${K.amarillo}   ›  ¿Hacerlo privado?${K.reset}`);
    const flagVisib  = esPrivado ? '--private' : '--public';
    const labelVisib = esPrivado ? 'privado' : 'público';

    info(`Creando "${nombreRepo}" (${labelVisib}) y subiendo el código...`);
    // Todos los argumentos como array — sin interpolación en shell
    run('gh', ['repo', 'create', nombreRepo, flagVisib, '--source=.', '--remote=origin', '--push']);
    acciones.push(`Repo creado en GitHub: ${nombreRepo} (${labelVisib})`);
  }

// ── Opción: Enlazar repo existente ───────────────────
} else if (eleccion === 1) {
  const urlRemoto = askValidated(
    'URL del repositorio (https://... o git@...)',
    isValidGitUrl,
    'URL inválida. Debe comenzar con https:// o git@ y no contener espacios.'
  );

  if (!urlRemoto) {
    fail('URL inválida tras varios intentos. Abortando.');
    process.exit(1);
  }

  run('git', ['remote', 'remove', 'origin']);
  run('git', ['remote', 'add', 'origin', urlRemoto]);
  run('git', ['push', '-u', 'origin', 'main']);
  acciones.push(`Enlazado a: ${urlRemoto}`);

// ── Cancelado ─────────────────────────────────────────
} else {
  warn('Operación cancelada por el usuario.');
  acciones.push('Operación cancelada manualmente');
}

// ── FIN ───────────────────────────────────────────────
showResumen(acciones);