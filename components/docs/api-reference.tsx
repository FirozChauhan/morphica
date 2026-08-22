import { CodeBlock } from "@/components/docs/code-block";

const BASE_URL = (process.env.APP_URL ?? "https://your-domain.com").replace(
  /\/$/,
  "",
);

const KEY = "pk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

const CURL = `curl -X POST ${BASE_URL}/api/process \\
  -H "Authorization: Bearer ${KEY}" \\
  -F "image=@image.jpg" \\
  -F "op=resize" \\
  -F "width=200" \\
  -o resized.jpg`;

const JS = `const form = new FormData();
form.append("image", file);
form.append("op", "resize");
form.append("width", "200");

const res = await fetch("${BASE_URL}/api/process", {
  method: "POST",
  headers: { Authorization: "Bearer ${KEY}" },
  body: form,
});

if (res.ok) {
  const blob = await res.blob();
  // blob is your resized image
}`;

const NODE = `import { readFileSync } from "node:fs";

const form = new FormData();
form.append("image", new Blob([readFileSync("image.jpg")], { type: "image/jpeg" }));
form.append("op", "resize");
form.append("width", "200");

const res = await fetch("${BASE_URL}/api/process", {
  method: "POST",
  headers: { Authorization: "Bearer ${KEY}" },
  body: form,
});

if (res.ok) {
  const buffer = Buffer.from(await res.arrayBuffer());
  // buffer is your resized image
}`;

const PYTHON = `import requests

with open("image.jpg", "rb") as f:
    res = requests.post(
        "${BASE_URL}/api/process",
        headers={"Authorization": "Bearer ${KEY}"},
        data={"op": "resize", "width": "200"},
        files={"image": f},
    )

if res.status_code == 200:
    open("resized.jpg", "wb").write(res.content)`;

export function ApiReference() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">API Reference</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Stateless, serverless image processing — one request, zero
          persistence.
        </p>
      </div>

      <section>
        <h2 className="text-xl font-semibold tracking-tight">
          POST /api/process
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Resize an image on the fly. The request is{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
            multipart/form-data
          </code>{" "}
          and the response is the processed image bytes.
        </p>
      </section>

      <section>
        <h3 className="text-base font-semibold">Authentication</h3>
        <div className="mt-3">
          <CodeBlock
            label="Headers"
            code={`Authorization: Bearer pk_live_xxxxxxxx...`}
          />
        </div>
      </section>

      <section>
        <h3 className="text-base font-semibold">Form fields</h3>
        <div className="mt-3 overflow-x-auto border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Field
                </th>
                <th className="px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Type
                </th>
                <th className="px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["image", "file", "jpeg, png, webp, or gif; ≤ 3 MB"],
                ["op", "string", 'currently only "resize"'],
                ["width", "int", "optional; pixels"],
                ["height", "int", "optional; pixels"],
              ].map(([field, type, notes]) => (
                <tr key={field} className="border-b border-border last:border-0">
                  <td className="px-4 py-2.5">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                      {field}
                    </code>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{type}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          At least one of <code className="text-foreground">width</code> or{" "}
          <code className="text-foreground">height</code> is required. If only
          one is given, the aspect ratio is preserved.
        </p>
      </section>

      <section>
        <h3 className="text-base font-semibold">curl</h3>
        <div className="mt-3">
          <CodeBlock label="Terminal" code={CURL} />
        </div>
      </section>

      <section>
        <h3 className="text-base font-semibold">JavaScript (fetch)</h3>
        <div className="mt-3">
          <CodeBlock label="browser.js" code={JS} />
        </div>
      </section>

      <section>
        <h3 className="text-base font-semibold">Node.js</h3>
        <div className="mt-3">
          <CodeBlock label="index.mjs" code={NODE} />
        </div>
      </section>

      <section>
        <h3 className="text-base font-semibold">Python</h3>
        <div className="mt-3">
          <CodeBlock label="main.py" code={PYTHON} />
        </div>
      </section>

      <section>
        <h3 className="text-base font-semibold">Responses</h3>
        <div className="mt-3 overflow-x-auto border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Code
                </th>
                <th className="px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Meaning
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["200", "Processed image returned"],
                ["400", "Bad/missing params, unknown op, or unprocessable image"],
                ["401", "Missing, invalid, or revoked API key"],
                ["413", "Payload larger than 3 MB"],
                ["415", "Unsupported content type"],
              ].map(([code, meaning]) => (
                <tr key={code} className="border-b border-border last:border-0">
                  <td className="px-4 py-2.5 font-medium">{code}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="text-base font-semibold">Notes</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Animated GIFs are returned as a static image (first frame).</li>
          <li>Images are processed in memory and never stored.</li>
          <li>Usage is recorded per request and visible in your dashboard.</li>
        </ul>
      </section>
    </div>
  );
}
