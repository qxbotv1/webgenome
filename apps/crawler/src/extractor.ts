import { Page } from "playwright";
import { PageElement } from "./types";

export async function extractElements(page: Page): Promise<PageElement[]> {
  return page.evaluate(() => {
    function safeCss(value: string): string {
      return typeof CSS !== "undefined" && CSS.escape ? CSS.escape(value) : value;
    }

    function getXPath(el: Element): string {
      if (el.id) return `//*[@id="${el.id}"]`;

      const parts: string[] = [];
      let node: Element | null = el;

      while (node && node.nodeType === Node.ELEMENT_NODE) {
        let index = 1;
        let sibling = node.previousElementSibling;

        while (sibling) {
          if (sibling.tagName === node.tagName) index += 1;
          sibling = sibling.previousElementSibling;
        }

        parts.unshift(`${node.tagName.toLowerCase()}[${index}]`);
        node = node.parentElement;
      }

      return `/${parts.join("/")}`;
    }

    function getCss(el: Element): string {
      const tag = el.tagName.toLowerCase();

      if (el.id) return `#${safeCss(el.id)}`;

      const testId = el.getAttribute("data-testid");
      if (testId) return `[data-testid="${testId}"]`;

      const classes = Array.from(el.classList)
        .filter((className) => !/^(hover|focus|active|js-)/.test(className))
        .slice(0, 3)
        .map((className) => `.${safeCss(className)}`)
        .join("");

      return classes ? `${tag}${classes}` : tag;
    }

    function getName(el: Element): string | null {
      const ariaLabel = el.getAttribute("aria-label");
      const name = (el as HTMLInputElement).name;
      const placeholder = (el as HTMLInputElement).placeholder;

      return ariaLabel || name || placeholder || null;
    }

    const selectors = [
      "button",
      "input",
      "textarea",
      "select",
      "a[href]",
      "form",
      "label",
      "[role=button]",
      "[role=link]",
      "[role=menuitem]",
      "[data-testid]",
      "[aria-label]",
    ];

    const seen = new Set<Element>();
    const elements: PageElement[] = [];

    document.querySelectorAll(selectors.join(",")).forEach((el) => {
      if (seen.has(el)) return;
      seen.add(el);

      const input = el as HTMLInputElement;
      const anchor = el as HTMLAnchorElement;

      elements.push({
        tag: el.tagName.toLowerCase(),
        text: el.textContent?.trim().slice(0, 120) || null,
        css: getCss(el),
        xpath: getXPath(el),
        type: input.type || null,
        href: anchor.href || null,
        name: getName(el),
        id: el.id || null,
        role: el.getAttribute("role"),
        testId: el.getAttribute("data-testid"),
      });
    });

    return elements;
  });
}
