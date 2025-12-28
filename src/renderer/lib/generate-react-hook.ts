/* eslint-disable @typescript-eslint/consistent-type-definitions */

export interface Field {
  name: string;
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

  let tsType: string = field.type;
  if (field.type === 'enum' && field.enumValues) {
    tsType = field.enumValues.map(v => JSON.stringify(v)).join(' | ');
  }

  return {
    raw: field,
    root: parts[0],
    isArray,
    pathParts: parts.slice(1),
    tsType,
  };
}

function hasRequiredFields(fields: ParsedField[]): boolean {
  return fields.some(f => !f.raw.optional);
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
 * TYPE RENDER
 * ======================= */

function renderType(node: FieldNode, indent = '  '): string {
  return Object.entries(node.children)
    .map(([key, child]) => {
      if (child.field) {
        const f = child.field;
        const type = f.raw.optional ? `${f.tsType} | null` : f.tsType;
        return `${indent}${key}: ${type};`;
      }

      return `${indent}${key}: {\n${renderType(child, indent + '  ')}\n${indent}};`;
    })
    .join('\n');
}

/* =======================
 * VALIDATOR HELPERS
 * ======================= */

function renderAssignments(
  varRoot: string,
  node: FieldNode,
  path: string[] = [],
  rawPrefix: string,
): string[] {
  const out: string[] = [];

  for (const [key, child] of Object.entries(node.children)) {
    const next = [...path, key];
    const varName = `${varRoot}_${next.join('_')}`;
    const rawPath = `${rawPrefix}.${key}`;

    if (child.field) {
      out.push(`
      const ${varName} =
        typeof src["${rawPath}"] === "${child.field.raw.type}"
          ? src["${rawPath}"]
          : null;
`);
    } else {
      out.push(...renderAssignments(varRoot, child, next, rawPath));
    }
  }

  return out;
}

function renderRequiredChecks(varRoot: string, node: FieldNode, path: string[] = []): string[] {
  const out: string[] = [];

  for (const [key, child] of Object.entries(node.children)) {
    const next = [...path, key];
    if (child.field && !child.field.raw.optional) {
      out.push(`${varRoot}_${next.join('_')} === null`);
    } else {
      out.push(...renderRequiredChecks(varRoot, child, next));
    }
  }

  return out;
}

function renderBuild(
  varRoot: string,
  node: FieldNode,
  path: string[] = [],
  indent = '        ',
): string {
  return Object.entries(node.children)
    .map(([key, child]) => {
      const next = [...path, key];
      const v = `${varRoot}_${next.join('_')}`;

      if (child.field) {
        return `${indent}${key}: ${v},`;
      }

      return `${indent}${key}: {\n${renderBuild(varRoot, child, next, indent + '  ')}\n${indent}},`;
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
    const tree = buildTree(items);
    const requiredChecks = renderRequiredChecks(root, tree);
    const hasRequired = hasRequiredFields(items);

    if (items[0].isArray) {
      v.push(`
    // --- ${root}[] ---
    const ${root}Arr = raw["${root}"];
    if (!Array.isArray(${root}Arr)) return null;

    const ${root}: ${capitalize(root)}Data[] = [];

    for (const src of ${root}Arr as any[]) {
${renderAssignments(root, tree, [], root).join('\n')}

${hasRequired ? `      if (${requiredChecks.join(' || ')}) continue;` : ''}

      ${root}.push({
${renderBuild(root, tree)}
      });
    }

${hasRequired ? `    if (${root}.length === 0) return null;` : ''}
`);
    } else {
      v.push(`
    // --- ${root} ---
    const src = raw;

${renderAssignments(root, tree, [], root).join('\n')}

${hasRequired ? `    if (${requiredChecks.join(' || ')}) return null;` : ''}

    const ${root}: ${capitalize(root)}Data = {
${renderBuild(root, tree, [], '      ')}
    };
`);
    }
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
