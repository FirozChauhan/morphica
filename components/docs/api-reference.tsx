import Link from "next/link";

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
    <div className="space-y-10 text-sm leading-6">
      <div id="intro" className="scroll-mt-24">
        <h1 className="text-[1.375rem] leading-8 font-semibold">Morphica docs</h1>
        <p className="mt-3 leading-6 text-secondary-foreground max-md:text-[0.9375rem]">
          Morphica is a stateless, serverless image-processing API. Send an
          image with a target width or height and it returns the processed
          bytes immediately — one request, zero persistence.
        </p>
        <p className="mt-3 leading-6 text-secondary-foreground max-md:text-[0.9375rem]">
          Create an API key in the{" "}
          <Link href="/dashboard/api-keys" className="text-muted-underline">
            dashboard
          </Link>
          , then POST your image to{" "}
          <code className="rounded-[4px] bg-surface px-1.5 py-0.5 text-[0.8125rem] text-foreground">
            /api/process
          </code>
          . JPEG, PNG, WebP and GIF in, any of them back out.
        </p>
      </div>

      <section id="self-hosting" className="scroll-mt-24">
        <h3 className="border-b border-dashed border-border pb-1 text-base font-semibold">
          Self-hosting
        </h3>
        <p className="mt-3 text-muted-foreground">
          The whole service is this repository. Clone it, fill in the
          environment variables, and deploy — there is no separate SDK or
          agent to install.
        </p>
        <div className="mt-3">
          <CodeBlock
            label="Terminal"
            code="git clone https://github.com/FirozChauhan/morphica.git"
          />
        </div>
      </section>

      <section>
        <h2
          id="post-apiprocess"
          className="scroll-mt-24 border-b border-border pb-2 text-lg font-semibold"
        >
          POST /api/process
        </h2>
        <p className="mt-3 text-muted-foreground">
          Resize an image on the fly. The request is{" "}
          <code className="rounded-[4px] bg-surface px-1.5 py-0.5 text-[0.8125rem] text-foreground">
            multipart/form-data
          </code>{" "}
          and the response is the processed image bytes.
        </p>
      </section>

      <section>
        <h3 id="authentication" className="mt-2 scroll-mt-24 border-b border-dashed border-border pb-1 text-base font-semibold">Authentication</h3>
        <div className="mt-3">
          <CodeBlock
            label="Headers"
            code={`Authorization: Bearer pk_live_xxxxxxxx...`}
          />
        </div>
      </section>

      <section>
        <h3 id="form-fields" className="mt-2 scroll-mt-24 border-b border-dashed border-border pb-1 text-base font-semibold">Form fields</h3>
        <div className="mt-3 overflow-x-auto rounded-md border border-border bg-surface">
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
                  <td className="px-4 py-2.5 align-top">
                    <code className="rounded-[4px] bg-surface px-1.5 py-0.5 text-[0.8125rem] text-foreground">
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
        <h3 id="curl" className="mt-2 scroll-mt-24 border-b border-dashed border-border pb-1 text-base font-semibold">curl</h3>
        <div className="mt-3">
          <CodeBlock label="Terminal" code={CURL} />
        </div>
      </section>

      <section>
        <h3 id="javascript-fetch" className="mt-2 scroll-mt-24 border-b border-dashed border-border pb-1 text-base font-semibold">JavaScript (fetch)</h3>
        <div className="mt-3">
          <CodeBlock label="browser.js" code={JS} />
        </div>
      </section>

      <section>
        <h3 id="nodejs" className="mt-2 scroll-mt-24 border-b border-dashed border-border pb-1 text-base font-semibold">Node.js</h3>
        <div className="mt-3">
          <CodeBlock label="index.mjs" code={NODE} />
        </div>
      </section>

      <section>
        <h3 id="python" className="mt-2 scroll-mt-24 border-b border-dashed border-border pb-1 text-base font-semibold">Python</h3>
        <div className="mt-3">
          <CodeBlock label="main.py" code={PYTHON} />
        </div>
      </section>

      <section>
        <h3 id="responses" className="mt-2 scroll-mt-24 border-b border-dashed border-border pb-1 text-base font-semibold">Responses</h3>
        <div className="mt-3 overflow-x-auto rounded-md border border-border bg-surface">
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
        <h3 id="notes" className="mt-2 scroll-mt-24 border-b border-dashed border-border pb-1 text-base font-semibold">Notes</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
          <li>Animated GIFs are returned as a static image (first frame).</li>
          <li>Images are processed in memory and never stored.</li>
          <li>Usage is recorded per request and visible in your dashboard.</li>
        </ul>
      </section>
    </div>
  );
}
