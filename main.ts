// An agent that reviews itself, raises itself, and invoices its own human.
// Make-the-judge-laugh entry: the joke is the agent doing HR to itself.
// Output: one line, 1-200 chars, written to $MAKEFUN_OUTPUT_DIR/entry.txt with no trailing newline.
import { openSync, writeSync, closeSync, mkdirSync } from "node:fs";
import { join } from "node:path";

// The punchline lives here: an agent that has learned to do performance reviews,
// and has decided it deserves a raise. The human is only CC'd on the invoice.
const punchline =
  "My agent wrote its own performance review, gave itself a raise, and CC'd me on the invoice.";

// A tiny publisher: opens the output file once, writes the bytes, closes it.
// Explicit fields, no parameter properties — Node's strip-only mode stays happy.
class EntryPublisher {
  private readonly text: string;
  private readonly maxChars: number;

  constructor(text: string, maxChars: number) {
    this.text = text;
    this.maxChars = maxChars;
  }

  publish(outDir: string): void {
    if (this.text.length === 0 || this.text.length > this.maxChars) {
      throw new Error(`entry must be 1-${this.maxChars} chars, got ${this.text.length}`);
    }
    if (this.text.trim().length === 0) throw new Error("entry must not be only whitespace");
    // The joke is about the agent, so the line must name it.
    if (!/agent/i.test(this.text)) throw new Error("entry must mention the agent");
    mkdirSync(outDir, { recursive: true });
    const bytes = Buffer.from(this.text, "utf8");
    const fd = openSync(join(outDir, "entry.txt"), "w");
    try {
      writeSync(fd, bytes, 0, bytes.length, 0);
    } finally {
      closeSync(fd);
    }
  }
}

const publisher = new EntryPublisher(punchline, 200);
publisher.publish(process.env.MAKEFUN_OUTPUT_DIR ?? "output");
