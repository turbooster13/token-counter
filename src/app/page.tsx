"use client";

import { useMemo, useState } from "react";
import { MODELS, PRICING_AS_OF } from "@/lib/pricing";
import { estimateTokenCount, exactTokenCount } from "@/lib/tokenize";

const numberFmt = new Intl.NumberFormat("en-US");
const costFmt = (n: number) =>
  n < 0.01 && n > 0 ? `$${n.toFixed(6)}` : `$${n.toFixed(4)}`;

const SAMPLE =
  "Paste a prompt, a document, or your whole codebase context here to see how many tokens it costs across models.";

export default function Home() {
  const [text, setText] = useState(SAMPLE);

  const stats = useMemo(() => {
    const cl100k = exactTokenCount(text, "cl100k_base");
    const o200k = exactTokenCount(text, "o200k_base");
    const estimated = estimateTokenCount(text);
    const tokensByEncoding = { cl100k_base: cl100k, o200k_base: o200k, estimate: estimated };

    return {
      chars: text.length,
      words: text.trim() ? text.trim().split(/\s+/).length : 0,
      rows: MODELS.map((m) => {
        const tokens = tokensByEncoding[m.encoding];
        return { ...m, tokens, cost: (tokens / 1_000_000) * m.inputPerMillion };
      }),
    };
  }, [text]);

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-3xl flex-1 px-6 py-16 sm:px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-emerald-500">
          Token Counter &amp; Cost Calculator
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          See exactly how many tokens your text costs across GPT, Claude, and Gemini models —
          and what it'll cost you.
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          className="mt-6 w-full resize-y rounded-xl border border-zinc-300 bg-white p-4 font-mono text-sm text-black shadow-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          placeholder="Paste your text here..."
        />

        <div className="mt-3 flex gap-6 text-sm text-zinc-500 dark:text-zinc-400">
          <span>{numberFmt.format(stats.chars)} characters</span>
          <span>{numberFmt.format(stats.words)} words</span>
        </div>

        <table className="mt-8 w-full border-collapse overflow-hidden rounded-xl border border-zinc-200 text-sm dark:border-zinc-800">
          <thead>
            <tr className="bg-zinc-100 text-left dark:bg-zinc-900">
              <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">Model</th>
              <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">Tokens</th>
              <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                Est. input cost
              </th>
            </tr>
          </thead>
          <tbody>
            {stats.rows.map((row) => (
              <tr key={row.id} className="border-t border-zinc-200 dark:border-zinc-800">
                <td className="px-4 py-3 text-black dark:text-zinc-50">
                  {row.label}
                  <span className="ml-2 text-xs text-zinc-400">{row.provider}</span>
                </td>
                <td className="px-4 py-3 tabular-nums text-black dark:text-zinc-50">
                  {numberFmt.format(row.tokens)}
                  {row.encoding === "estimate" && (
                    <span className="ml-1 text-xs text-zinc-400">(est.)</span>
                  )}
                </td>
                <td className="px-4 py-3 tabular-nums text-black dark:text-zinc-50">
                  {costFmt(row.cost)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-zinc-400">
          Prices per official provider pages as of {PRICING_AS_OF}, input tokens only — verify
          current pricing before budgeting. GPT models use OpenAI's real tiktoken tokenizer, run
          entirely in your browser; Claude and Gemini don't publish a public tokenizer, so those
          counts are estimated from character length.
        </p>

        <section className="mt-16 space-y-6 text-zinc-700 dark:text-zinc-300">
          <div>
            <h2 className="text-lg font-semibold text-black dark:text-zinc-50">
              What is a token?
            </h2>
            <p className="mt-2 text-sm leading-6">
              A token is the unit language models actually read and pay for — usually a chunk of
              a word, not a whole word. "Tokenization" is roughly 4 characters or ¾ of a word in
              English, but it varies by model, language, and content (code and non-English text
              often tokenize less efficiently).
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-black dark:text-zinc-50">
              Why token count matters
            </h2>
            <p className="mt-2 text-sm leading-6">
              Every API call to a model is billed per token, and every model has a maximum
              context window measured in tokens. Knowing your token count before you hit "send"
              helps you estimate cost, stay under context limits, and compare which model is
              actually cheapest for your use case.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
