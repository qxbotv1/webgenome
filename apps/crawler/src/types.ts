export type CrawlStatus = "queued" | "running" | "done" | "failed" | "waiting_for_access";

export interface CrawlJob {
  crawlId: string;
  url: string;
  maxPages: number;
  sessionCookie?: string;
}

export interface PageElement {
  tag: string;
  text: string | null;
  css: string;
  xpath: string;
  type: string | null;
  href: string | null;
  name: string | null;
  id: string | null;
  role: string | null;
  testId: string | null;
}

export interface CrawledPage {
  crawlId: string;
  url: string;
  title: string;
  statusCode: number | null;
  elements: PageElement[];
  screenshotUrl: string | null;
  crawledAt: Date;
  isGated?: boolean;
  gateReason?: string;
}

export interface CrawlRecord {
  crawlId: string;
  siteUrl: string;
  status: CrawlStatus;
  maxPages: number;
  pagesTotal: number;
  pagesCrawled: number;
  errorMessage?: string;
  blockedAtUrl?: string;
  blockedReason?: string;
  createdAt: Date;
  startedAt?: Date;
  finishedAt?: Date;
}

export interface CrawlExport {
  crawl: CrawlRecord;
  pages: CrawledPage[];
  elementsTotal: number;
}
