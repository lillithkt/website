<script lang="ts" module>
  import { createHighlighter, type BundledLanguage } from 'shiki';
  import theme from "@shikijs/themes/laserwave"
	import z from 'zod';
  const htmlAppend = `
  <style>
    pre { 
      display: inline;
    }
  </style>`;

  const supportedLanguages = z.enum(['javascript', 'typescript', "txt"]);

  const highlighter = await createHighlighter({
    langs: supportedLanguages.options,
    themes: [theme]
  });
</script>

<script lang="ts">
  interface Props {
    code: string;
    language: BundledLanguage;
    inline?: boolean;
  }
  const { code, language, inline }: Props = $props();

  const htmlWorking = $derived(highlighter.codeToHtml(code, { lang: language, theme: theme }));

  const html = $derived(htmlWorking + htmlAppend);
</script>

<span>
  {#if inline}
  {@html html}
{:else}
  <div class="code-container rounded-lg p-5 border border-stone-700" style="background-color: {theme.colors!['editor.background']}">
    {@html html}
  </div>
{/if}
</span>