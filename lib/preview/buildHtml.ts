//logica de randare a codului generat intr-un iframe izolat
//extrasa aici ca sa fie refolosita atat in preview (editor) cat si in pagina publica /s/[subdomain]

//curata codul generat: scoate import-urile, destructurarile si transforma lucide in proxy sigur
export function cleanGeneratedCode(code: string): string
{
  return code
    .trim()
    .replace(/^```(?:tsx|jsx|ts|js|typescript|javascript)?\s*/i, '')
    .replace(/\s*```$/i, '')
    // sterge orice import din "react"
    .replace(/import\s+[^;]*?\s+from\s+['"]react['"];?\s*/g, '')
    // sterge import-ul de createRoot
    .replace(/import\s+[^;]*?\s+from\s+['"]react-dom\/client['"];?\s*/g, '')
    // sterge destructurarea din React (ex: const { useState, useEffect } = React;)
    .replace(/const\s*\{[^}]*\}\s*=\s*React\s*;?/g, '')
    // transforma "import { A, B } from 'lucide-react'" in destructurare din proxy-ul sigur
    .replace(
      /import\s*\{([^}]*)\}\s*from\s*['"]lucide-react['"];?/g,
      'const {$1} = Lucide;'
    )
    .replace(/export\s+default\s+function\s+App/, 'function App')
    .replace(/export\s+default\s+App\s*;?/g, '')
    .replace(/<\/script/gi, '<\\/script')
}

//construieste documentul HTML complet care ruleaza codul React in iframe
export function buildPreviewHtml(code: string): string
{
  const cleaned = cleanGeneratedCode(code)

  return `<!DOCTYPE html>
<html lang="ro">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@18.3.1",
    "react-dom/client": "https://esm.sh/react-dom@18.3.1/client",
    "react/jsx-runtime": "https://esm.sh/react@18.3.1/jsx-runtime",
    "lucide-react": "https://esm.sh/lucide-react@0.456.0?deps=react@18.3.1"
  }
}
<\/script>

<script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    width: 100%;
    min-height: 100%;
  }

  body {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background: #ffffff;
  }

  .preview-error {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: #fafafa;
    color: #111;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .preview-error-box {
    max-width: 760px;
    width: 100%;
    border: 1px solid #f1b8b8;
    background: #fff;
    border-radius: 10px;
    padding: 18px;
  }

  .preview-error-title {
    margin: 0 0 10px;
    color: #b42318;
    font-size: 15px;
    font-weight: 700;
  }

  .preview-error-text {
    white-space: pre-wrap;
    margin: 0;
    color: #444;
    font-size: 13px;
    line-height: 1.5;
  }
</style>
</head>

<body>
<div id="root"></div>

<script type="text/babel" data-type="module" data-presets="typescript,react">
import React, { useState, useEffect, useRef, useMemo, useCallback, useReducer, useContext, useLayoutEffect, Fragment } from "react";
import { createRoot } from "react-dom/client";
import * as LucideIcons from "lucide-react";

// proxy sigur pentru iconite: orice iconita inexistenta devine un placeholder gol
// (asa o iconita halucinata de model nu mai daramaa tot site-ul)
const SafeIcon = (props) => React.createElement("span", {
  style: { display: "inline-block", width: (props && props.size) || 24, height: (props && props.size) || 24 }
});
const Lucide = new Proxy(LucideIcons, {
  get(target, prop) {
    return target[prop] || SafeIcon;
  }
});

// expunem React si hook-urile global pentru codul generat care le foloseste fara import
Object.assign(window, { React, useState, useEffect, useRef, useMemo, useCallback, useReducer, useContext, useLayoutEffect, Fragment, Lucide });

window.addEventListener("error", function (event) {
  document.body.innerHTML = '<div class="preview-error"><div class="preview-error-box"><p class="preview-error-title">Eroare în preview</p><pre class="preview-error-text">' + String(event.message || "Eroare necunoscută") + '</pre></div></div>';
});

window.addEventListener("unhandledrejection", function (event) {
  document.body.innerHTML = '<div class="preview-error"><div class="preview-error-box"><p class="preview-error-title">Eroare în preview</p><pre class="preview-error-text">' + String(event.reason?.message || event.reason || "Eroare necunoscută") + '</pre></div></div>';
});

${cleaned}

const rootElement = document.getElementById("root");

if (typeof App !== "function") {
  throw new Error('Codul generat trebuie să exporte o funcție default numită App.');
}

createRoot(rootElement).render(React.createElement(App));
<\/script>
</body>
</html>`
}