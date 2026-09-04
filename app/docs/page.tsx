import { SignInButton } from "@/components/landing/auth-buttons";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { ApiReference } from "@/components/docs/api-reference";
import { Wordmark } from "@/components/wordmark";

// Docs layout mirrors opencode.ai/docs: a full-width fixed header, a 300px
// left sidebar with the page list, a reading column, and a right-hand
// "On this page" TOC.
export default function DocsPage() {
  return (
    <main className="min-h-dvh">
      <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-6">
        <Wordmark className="text-lg text-foreground" />
        <div className="flex items-center gap-5">
          <SignInButton
            compact
            className="flex h-8 items-center rounded-[4px] border border-border px-3 text-xs text-foreground transition-colors hover:bg-accent"
          />
        </div>
      </header>

      <div className="pt-16">
        <DocsSidebar />
        <div className="pl-0 max-lg:pl-0 lg:pl-[300px]">
          <div className="mx-auto flex w-full max-w-[1140px]">
            <article className="min-w-0 flex-1 border-x-0 px-6 py-8 max-md:px-4 lg:px-12 lg:py-8 xl:px-12">
              <ApiReference />
            </article>

            <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] w-[360px] shrink-0 border-l border-border xl:block">
              <div className="overflow-y-auto px-6 py-6">
                <h2 className="pb-3 text-sm font-medium text-foreground">
                  On this page
                </h2>
                <ul className="space-y-1 border-l border-transparent text-sm">
                  {[
                    ["#intro", "Overview"],
                    ["#self-hosting", "Self-hosting"],
                    ["#post-apiprocess", "POST /api/process"],
                    ["#authentication", "Authentication"],
                    ["#form-fields", "Form fields"],
                    ["#curl", "curl"],
                    ["#javascript-fetch", "JavaScript (fetch)"],
                    ["#python", "Python"],
                    ["#responses", "Responses & errors"],
                    ["#notes", "Notes"],
                  ].map(([href, label]) => (
                    <li key={href}>
                      <a
                        href={href}
                        className="-ml-px block rounded-[4px] border-l border-transparent py-1 pr-2 pl-4 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
