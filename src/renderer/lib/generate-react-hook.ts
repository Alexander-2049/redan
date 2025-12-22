/* eslint-disable @typescript-eslint/consistent-type-definitions */

export interface Field {
  name: string; // "realtime.throttle", "drivers[].lapDistPct"
  type: 'number' | 'string' | 'boolean' | 'enum';
  enumValues?: readonly (string | number | boolean)[];
  optional?: boolean;
}

/* =======================
 * INTERNAL TYPES
 * ======================= */

type ParsedField = {
  raw: Field;
  root: string;
  isArray: boolean;
  pathParts: string[];
  tsType: string;
};

type FieldNode = {
  field?: ParsedField;
  children: Record<string, FieldNode>;
};

/* =======================
 * HELPERS
 * ======================= */

function capitalize(s: string): string {
  return s[0].toUpperCase() + s.slice(1);
}

function parseField(field: Field): ParsedField {
  const isArray = field.name.includes('[]');
  const clean = field.name.replace('[]', '');
  const parts = clean.split('.');

  const root = parts[0];
  const pathParts = parts.slice(1);

  let tsType: string = field.type;
  if (field.type === 'enum' && field.enumValues) {
    tsType = field.enumValues.map(v => JSON.stringify(v)).join(' | ');
  }

  return {
    raw: field,
    root,
    isArray,
    pathParts,
    tsType,
  };
}

/* =======================
 * TREE
 * ======================= */

function buildTree(fields: ParsedField[]): FieldNode {
  const root: FieldNode = { children: {} };

  for (const f of fields) {
    let node = root;
    for (const part of f.pathParts) {
      node.children[part] ??= { children: {} };
      node = node.children[part];
    }
    node.field = f;
  }

  return root;
}

/* =======================
 * TYPE GENERATION
 * ======================= */

function renderType(node: FieldNode, indent = '  ', optionalAware = true): string {
  return Object.entries(node.children)
    .map(([key, child]) => {
      if (child.field) {
        const f = child.field;
        const type = optionalAware && f.raw.optional ? `${f.tsType} | null` : f.tsType;

        return `${indent}${key}: ${type};`;
      }

      return `${indent}${key}: {\n${renderType(child, indent + '  ', optionalAware)}\n${indent}};`;
    })
    .join('\n');
}

/* =======================
 * VALIDATOR GENERATION
 * ======================= */

function renderValidatorAssignments(root: string, node: FieldNode, path: string[] = []): string[] {
  const out: string[] = [];

  for (const [key, child] of Object.entries(node.children)) {
    const nextPath = [...path, key];

    if (child.field) {
      const f = child.field;
      const varName = `${root}_${nextPath.join('_')}`;

      if (f.raw.type === 'enum' && f.raw.enumValues) {
        const checks = f.raw.enumValues
          .map(v => `${varName}Raw === ${JSON.stringify(v)}`)
          .join(' || ');

        out.push(`
    const ${varName}Raw = raw["${f.raw.name}"];
    const ${varName} =
      (${checks})
        ? ${varName}Raw
        : null;
`);
      } else {
        out.push(`
    const ${varName} =
      typeof raw["${f.raw.name}"] === "${f.raw.type}"
        ? raw["${f.raw.name}"]
        : null;
`);
      }
    } else {
      out.push(...renderValidatorAssignments(root, child, nextPath));
    }
  }

  return out;
}

function renderRequiredChecks(root: string, node: FieldNode, path: string[] = []): string[] {
  const checks: string[] = [];

  for (const [key, child] of Object.entries(node.children)) {
    const nextPath = [...path, key];

    if (child.field && !child.field.raw.optional) {
      checks.push(`${root}_${nextPath.join('_')} === null`);
    } else {
      checks.push(...renderRequiredChecks(root, child, nextPath));
    }
  }

  return checks;
}

function renderObjectBuild(
  root: string,
  node: FieldNode,
  path: string[] = [],
  indent = '      ',
): string {
  return Object.entries(node.children)
    .map(([key, child]) => {
      const nextPath = [...path, key];

      if (child.field) {
        return `${indent}${key}: ${root}_${nextPath.join('_')},`;
      }

      return `${indent}${key}: {\n${renderObjectBuild(
        root,
        child,
        nextPath,
        indent + '  ',
      )}\n${indent}},`;
    })
    .join('\n');
}

/* =======================
 * MAIN GENERATOR
 * ======================= */

export function generateReactHook(fields: Field[]): string {
  const parsed = fields.map(parseField);

  const grouped = parsed.reduce<Record<string, ParsedField[]>>((acc, f) => {
    (acc[f.root] ??= []).push(f);
    return acc;
  }, {});

  const meta = {
    version: 1,
    generatedAt: new Date().toISOString(),
    fields: fields.map(f => ({
      name: f.name,
      type: f.type,
      optional: Boolean(f.optional),
    })),
  };

  const params = fields.map(f => `"${f.name}"`).join(',\n      ');

  /* ---------- TYPES ---------- */

  const typeBlocks: string[] = [];

  for (const [root, items] of Object.entries(grouped)) {
    if (items[0].isArray) continue;

    const tree = buildTree(items);

    typeBlocks.push(`
type ${capitalize(root)}Data = {
${renderType(tree)}
};
`);
  }

  typeBlocks.push(`
export type GameData = {
${Object.entries(grouped)
  .map(([root, items]) =>
    items[0].isArray
      ? `  ${root}: ${capitalize(root)}Data[];`
      : `  ${root}: ${capitalize(root)}Data;`,
  )
  .join('\n')}
};
`);

  /* ---------- VALIDATOR ---------- */

  const v: string[] = [];

  v.push(`
function validateGameData(raw: Record<string, unknown>): GameData | null {
  try {
`);

  for (const [root, items] of Object.entries(grouped)) {
    if (items[0].isArray) continue;

    const tree = buildTree(items);

    v.push(`
    // --- ${root} ---
${renderValidatorAssignments(root, tree).join('\n')}
`);

    const required = renderRequiredChecks(root, tree);
    if (required.length) {
      v.push(`
    if (${required.join(' || ')}) return null;
`);
    }

    v.push(`
    const ${root}: ${capitalize(root)}Data = {
${renderObjectBuild(root, tree)}
    };
`);
  }

  v.push(`
    return {
${Object.keys(grouped)
  .map(r => `      ${r},`)
  .join('\n')}
    };
  } catch {
    return null;
  }
}
`);

  /* ---------- RESULT ---------- */

  return `
/**
 * @generated
 * ${JSON.stringify(meta, null, 2)}
 */

import { useEffect, useMemo, useRef, useState } from "react";

// --- Types ---
${typeBlocks.join('\n')}

// --- Validator ---
${v.join('\n')}

// --- Hook ---
const useGameData = () => {
  const url = "ws://localhost:42049";

  const params = useMemo(
    () => [
      ${params}
    ],
    []
  );

  const isPreview = useMemo(() => {
    const p = new URLSearchParams(window.location.search).get("preview");
    return p === "" || p === "true";
  }, []);

  const [data, setData] = useState<GameData | null>(null);
  const accumulatedRef = useRef<Record<string, unknown>>({});

  useEffect(() => {
    const ws = new WebSocket(
      \`\${url}?preview=\${isPreview ? "true" : "false"}&q=\${params.join(",")}\`
    );

    ws.onmessage = e => {
      const msg = JSON.parse(e.data) as {
        success: boolean;
        data?: [string, unknown][];
      };

      if (msg.success && msg.data) {
        accumulatedRef.current = {
          ...accumulatedRef.current,
          ...Object.fromEntries(msg.data),
        };
        setData(validateGameData(accumulatedRef.current));
      }
    };

    return () => ws.close();
  }, [params, isPreview]);

  return { data };
};

export default useGameData;
`;
}
