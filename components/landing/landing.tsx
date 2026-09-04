import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Braces,
  Database,
  FileCode2,
  Globe,
  Menu,
  Shapes,
  Terminal,
  TerminalSquare,
  Webhook,
  Zap,
} from "lucide-react";

import { Demo } from "@/components/landing/demo";
import { InstallTabs } from "@/components/landing/install-tabs";
import { Wordmark } from "@/components/wordmark";

const NAV = [
  { href: "https://github.com/FirozChauhan/morphica", label: "GitHub", external: true },
  { href: "/docs", label: "Docs" },
  { href: "/dashboard", label: "Dashboard" },
];

const FEATURES = [
  ["One endpoint", "POST an image, get the processed bytes back in milliseconds"],
  ["Stateless", "Nothing is ever written to disk — memory in, memory out"],
  ["Any format", "JPEG, PNG, WebP and GIF in, any of them back out"],
  ["Resize on the fly", "Target width or height, aspect ratio preserved automatically"],
  ["Serverless", "Scales to zero and back again, no servers to babysit"],
  ["API keys in seconds", "Create a key, drop it into curl, ship it to production"],
  ["Usage included", "Every call is metered and visible in your dashboard"],
] as const;

function Container({ children }: { children: React.ReactNode }) {
  // The opencode page frame: a single centered 1080px column with side +
  // bottom rules; every section stacks inside it separated by top rules.
  return (
    <div className="mx-auto w-full max-w-[1080px] border-x border-b border-border max-md:border-x-0">
      {children}
    </div>
  );
}

function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`border-t border-border px-20 max-md:px-6 ${className}`}
    >
      {children}
    </section>
  );
}

export function Landing() {
  return (
    <main className="flex flex-col gap-16 pb-20">
      <Container>
        {/* ── Header ─────────────────────────────────────────────── */}
        <header className="flex items-center justify-between px-20 py-6 max-md:px-6">
          <Wordmark className="text-[1.3rem] text-foreground" />
          <nav className="flex items-center gap-2 max-md:hidden">
            <ul className="flex items-center gap-8 text-sm">
              {NAV.map((item) => (
                <li key={item.label}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground transition-colors hover:text-muted-foreground"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-foreground transition-colors hover:text-muted-foreground"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <Link
              href="/sign-in"
              className="ml-6 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="flex h-10 items-center gap-2 rounded-[4px] bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <ArrowUpRight className="size-4" />
              Get started
            </Link>
          </nav>
          {/* Mobile: hamburger icon button (40x40) like the reference. */}
          <button
            type="button"
            className="flex size-10 cursor-pointer items-center justify-center rounded-[4px] text-foreground transition-colors hover:bg-accent md:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
        </header>

        {/* ── Hero ───────────────────────────────────────────────── */}
        <Section className="pt-24 pb-24 max-md:pt-12 max-md:pb-12">
          <div className="flex items-center gap-3 text-sm max-md:flex-wrap">
            <span className="bg-primary px-2 py-1 text-[0.8125rem] font-medium text-primary-foreground">
              New
            </span>
            <p className="text-foreground">
              Stateless image processing is{" "}
              <Link
                href="#demo"
                className="text-muted-underline text-muted-foreground transition-colors hover:text-foreground"
              >
                live
              </Link>
              .
            </p>
          </div>

          <h1 className="mt-14 max-w-3xl text-[2.375rem] leading-[1.5] font-bold max-md:mt-10 max-md:text-[1.375rem]">
            The stateless image
            <br />
            processing API
          </h1>
          <p className="mt-2 max-w-2xl text-base leading-8 text-secondary-foreground max-md:text-[0.9375rem] max-md:leading-6">
            One request, zero persistence — resize and convert any image at URL
            speed, from curl or any HTTP client.{" "}
            <span className="text-muted-foreground">
              Nothing is ever stored.
            </span>
          </p>

          <div className="mt-6">
            <InstallTabs />
          </div>
        </Section>

        {/* ── Live demo (the "video" slot) ───────────────────────── */}
        <section id="demo" className="scroll-mt-24 border-t border-border">
          <Demo />
        </section>

        {/* ── What is Morphica? ──────────────────────────────────── */}
        <Section className="py-16 max-md:py-12">
          <div className="max-md:space-y-4">
            <h3 className="text-base font-bold">What is Morphica?</h3>
            <p className="leading-8 text-secondary-foreground max-md:leading-6">
              Morphica is an image-processing API that resizes and converts
              images on the fly. Send a picture with your target width or
              height and get the processed bytes back in milliseconds.
            </p>
          </div>
          <ul className="mt-8 space-y-2 text-base leading-8 text-secondary-foreground max-md:text-[0.9375rem] max-md:leading-7">
            {FEATURES.map(([title, body]) => (
              <li key={title} className="flex gap-3 max-md:block">
                <span aria-hidden className="w-8 shrink-0 text-muted-foreground max-md:hidden">
                  [*]
                </span>
                <div>
                  <strong className="font-medium text-foreground">
                    {title}
                  </strong>{" "}
                  {body}
                </div>
              </li>
            ))}
          </ul>
          <Link
            href="/docs"
            className="mt-10 inline-flex h-10 items-center gap-2 rounded-[4px] bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Read docs
            <ArrowRight className="size-4" />
          </Link>
        </Section>

        {/* ── Stats ──────────────────────────────────────────────── */}
        <Section className="py-16 max-md:py-12">
          <h3 className="text-base font-bold">
            The stateless image processing API
          </h3>
          <div className="mt-3 flex gap-3">
            <span aria-hidden className="w-8 shrink-0 text-base leading-8 text-muted-foreground max-md:hidden">
              [*]
            </span>
            <p className="text-base leading-8 text-secondary-foreground max-md:text-[0.9375rem] max-md:leading-7">
              Built on sharp, Morphica processes images entirely in memory
              with <strong className="font-medium text-foreground">~40ms</strong>{" "}
              median latency, <strong className="font-medium text-foreground">0</strong>{" "}
              bytes written to disk, and{" "}
              <strong className="font-medium text-foreground">100%</strong>{" "}
              stateless handling across{" "}
              <strong className="font-medium text-foreground">4</strong>{" "}
              image formats.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-3 gap-12 max-md:mt-10 max-md:grid-cols-1 max-md:gap-10">
            {[
              { figure: "~40ms", label: "Median resize", Icon: ZapIcon },
              { figure: "0 bytes", label: "Stored on disk", Icon: DatabaseIcon },
              { figure: "4", label: "Formats in & out", Icon: ShapesIcon },
            ].map(({ figure, label, Icon }) => (
              <div key={figure} className="flex flex-col items-center gap-4 text-center">
                <Icon />
                <span className="flex flex-col items-center">
                  <figure className="text-xs text-muted-foreground">Fig.</figure>
                  <strong className="text-lg font-medium">{figure}</strong>
                  <span className="text-sm text-muted-foreground">{label}</span>
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Privacy ────────────────────────────────────────────── */}
        <Section className="py-16 max-md:py-12">
          <h3 className="text-base font-bold">Built for privacy first</h3>
          <div className="mt-3 flex gap-3">
            <span aria-hidden className="w-8 shrink-0 text-base leading-8 text-muted-foreground max-md:hidden">
              [*]
            </span>
            <p className="text-base leading-8 text-secondary-foreground max-md:text-[0.9375rem] max-md:leading-7">
              Morphica does not store any of your images or metadata, so that
              it can operate in complete privacy. Learn more about{" "}
              <Link href="/docs" className="text-muted-underline">
                privacy
              </Link>
              .
            </p>
          </div>
        </Section>

        {/* ── Quickstart (the "Zen" slot) ────────────────────────── */}
        <Section className="py-16 max-md:py-12">
          <strong className="text-base font-bold">
            One endpoint, any client
          </strong>
          <p className="mt-2 max-w-[90%] leading-8 text-secondary-foreground max-md:leading-6">
            Morphica is plain HTTP, so it works from curl, the browser, Node,
            Python, or anything that can send a POST request. Create a key and
            make your first call in under a minute.
          </p>
          <div className="mt-12 flex items-center justify-center gap-6 text-foreground">
            {[
              { label: "Terminal", Icon: TerminalIcon },
              { label: "JavaScript", Icon: JsIcon },
              { label: "Python", Icon: PythonIcon },
              { label: "Node", Icon: ServerIcon },
              { label: "cURL", Icon: CurlIcon },
              { label: "Webhooks", Icon: WebhookIcon },
            ].map(({ label, Icon }) => (
              <span key={label} title={label} className="flex flex-col items-center gap-2">
                <Icon />
                <span className="sr-only">{label}</span>
              </span>
            ))}
          </div>
          <Link
            href="/docs"
            className="mt-12 inline-flex h-10 items-center gap-2 self-start rounded-[4px] border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Read the docs
            <ArrowRight className="size-4" />
          </Link>
        </Section>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <footer className="grid grid-cols-4 border-t border-border max-md:grid-cols-2">
          {[
            ["GitHub", "https://github.com/FirozChauhan/morphica", null, true],
            ["Docs", "/docs", null],
            ["Dashboard", "/dashboard", null],
            ["Sign up", "/sign-up", null],
          ].map(([label, href, stat, external]) => (
            <div key={label as string} className="border-r border-border last:border-r-0 max-md:[&:nth-child(2n)]:border-r-0">
              {external ? (
                <a
                  href={href as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-8 text-sm transition-colors hover:bg-accent max-md:py-5"
                >
                  {label}
                  {stat ? <span className="text-muted-foreground">[{stat}]</span> : null}
                </a>
              ) : (
                <Link
                  href={href as string}
                  className="flex items-center gap-2 px-5 py-8 text-sm transition-colors hover:bg-accent max-md:py-5"
                >
                  {label}
                  {stat ? <span className="text-muted-foreground">[{stat}]</span> : null}
                </Link>
              )}
            </div>
          ))}
        </footer>
      </Container>

      {/* Bottom bar — outside the framed column, like opencode. */}
      <div className="mx-auto flex w-full max-w-[1080px] flex-wrap items-center justify-between gap-4 px-2 text-sm text-muted-foreground max-md:max-w-full max-md:flex-col max-md:items-start max-md:px-6">
        <span>
          © {new Date().getFullYear()}{" "}
          <span className="text-foreground">Firoz Khan Chauhan</span>
        </span>
        <div className="flex items-center gap-6">
          <Link href="/docs" className="transition-colors hover:text-foreground">
            Docs
          </Link>
          <Link href="/dashboard" className="transition-colors hover:text-foreground">
            Dashboard
          </Link>
          <Link href="/sign-in" className="transition-colors hover:text-foreground">
            Sign in
          </Link>
          <Link href="/sign-up" className="transition-colors hover:text-foreground">
            Get started
          </Link>
        </div>
      </div>
    </main>
  );
}

function ZapIcon() {
  return <Zap className="size-16 stroke-1 text-muted-foreground max-md:size-12" />;
}
function DatabaseIcon() {
  return <Database className="size-16 stroke-1 text-muted-foreground max-md:size-12" />;
}
function ShapesIcon() {
  return <Shapes className="size-16 stroke-1 text-muted-foreground max-md:size-12" />;
}

function TerminalIcon() {
  return <TerminalSquare className="size-6" />;
}
function JsIcon() {
  return <Braces className="size-6" />;
}
function PythonIcon() {
  return <FileCode2 className="size-6" />;
}
function ServerIcon() {
  return <Globe className="size-6" />;
}
function CurlIcon() {
  return <Terminal className="size-6" />;
}
function WebhookIcon() {
  return <Webhook className="size-6" />;
}
