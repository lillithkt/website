import type { Component } from 'svelte';
import { chromium, expect, type Browser, type Page } from '@playwright/test';
import { test } from '@playwright/test';

export enum PageTest {
	DESCRIPTION_META_TAG = 'descriptionMetaTag',
}

function normalizePath(path: string): string {
	if (path === '/') return '/';
	return path.replace(/\/$/, '') || '/';
}

const allPages: string[] = ["/"];
/**
 * cursor generated because scrapers are scawwy :uwaaaaaaa:
 */
async function getAllPages(): Promise<string[]> {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  if (allPages.length > 1) return allPages;
  const baseUrl = 'http://localhost:4173';
  const crawlPage: (pagePath: string) => Promise<string[]> = async (pagePath) => {
    // Convert relative path to full URL for navigation
    const fullUrl = pagePath.startsWith('http') ? pagePath : new URL(pagePath, baseUrl).href;
    await page.goto(fullUrl);
    await page.waitForLoadState('networkidle');
    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a')).map(a => a.href);
    });
    
    // Normalize URLs to relative paths and filter
    const normalizedLinks = links
      .map(link => {
        try {
          const url = new URL(link);
          // Only include same-origin links
          if (url.origin !== new URL(baseUrl).origin) {
            return null;
          }
          return normalizePath(url.pathname);
        } catch {
          return null;
        }
      })
      .filter((link): link is string => link !== null && link.length > 0);
    
    const newPages = normalizedLinks.filter(link => !allPages.includes(link));
    allPages.push(...newPages);
    return normalizedLinks;
  };
	
  // Crawl all pages starting from root
  const toVisit = new Set<string>(['/']);
  const visited = new Set<string>();
  
  while (toVisit.size > 0) {
    const currentPage = Array.from(toVisit)[0];
    toVisit.delete(currentPage);
    
    const normalizedPage = normalizePath(currentPage);
    if (visited.has(normalizedPage)) {
      continue;
    }
    
    visited.add(normalizedPage);
    
    try {
      const discoveredLinks = await crawlPage(currentPage);
      
      // Add newly discovered pages to the queue
      for (const link of discoveredLinks) {
        const normalizedLink = normalizePath(link);
        if (!visited.has(normalizedLink) && !toVisit.has(normalizedLink)) {
          toVisit.add(normalizedLink);
        }
      }
    } catch (error) {
      console.warn(`Failed to crawl ${currentPage}:`, error);
    }
  }
  
  // Sort and log all discovered pages
  allPages.sort();
  return allPages;
};

test('All pages should have a description meta tag', async ({ page }) => {
  const allPages = await getAllPages();
	for (const path of allPages) {
      console.log(`Testing ${path}`);
      await page.goto(path);
      await page.waitForLoadState('networkidle');
			expect(page.locator('meta[name="description"]')).toHaveAttribute('content');
  };
});
