// PDF export: render a report (a complete HTML document) to A4 pages and return a PDF Blob.
// Used by public/app.js (exportPDF) through window.__ofsHtmlToPdf, so the PDF is saved as a
// file download instead of opening a print window (window.open is blocked in embedded
// workplaces). Lazy-loaded from main.tsx: jsPDF and html2canvas only load on the first export.
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const A4_W_MM = 210;
const A4_H_MM = 297;
const MARGIN_MM = 10;
const RENDER_W_PX = 794; // report layout width in CSS px (A4 at 96 dpi)
const SCALE = 2; // render resolution: 2 device px per CSS px

function waitForImages(doc: Document): Promise<unknown> {
  return Promise.all(Array.from(doc.images).map(img => (img.complete ? null : new Promise(done => {
    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', done, { once: true });
  }))));
}

// Bottom edges of blocks that may end a page, so a page break does not cut through a photo,
// a ticket card or a table row.
function breakCandidates(doc: Document): number[] {
  const sel = 'h1,h2,h3,h4,p,li,tr,figure,img,table,section,.section,.ticket-card,.photos-grid,.meta-grid,footer';
  const scrollY = doc.defaultView?.scrollY || 0;
  const out = new Set<number>();
  doc.querySelectorAll(sel).forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.height > 0) out.add(Math.round(r.bottom + scrollY));
  });
  return Array.from(out).sort((a, b) => a - b);
}

export async function htmlToPdf(html: string): Promise<Blob> {
  const frame = document.createElement('iframe');
  frame.setAttribute('aria-hidden', 'true');
  frame.tabIndex = -1;
  Object.assign(frame.style, { position: 'fixed', left: '-10000px', top: '0', width: `${RENDER_W_PX}px`, height: '1123px', border: '0' });
  document.body.appendChild(frame);
  try {
    await new Promise<void>(resolve => {
      frame.addEventListener('load', () => resolve(), { once: true });
      frame.srcdoc = html;
    });
    const doc = frame.contentDocument;
    if (!doc) throw new Error('Report frame has no document');
    await waitForImages(doc);
    if (doc.fonts?.ready) await doc.fonts.ready;

    const fullH = Math.ceil(Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight));
    frame.style.height = `${fullH}px`;

    const contentWmm = A4_W_MM - 2 * MARGIN_MM;
    const pxPerMm = RENDER_W_PX / contentWmm;
    const pageHpx = (A4_H_MM - 2 * MARGIN_MM) * pxPerMm;
    const breaks = breakCandidates(doc);

    // Page ranges: fill a page, then step back to the last block edge in its lower 40 %.
    const pages: Array<[number, number]> = [];
    for (let y = 0; y < fullH - 1;) {
      let end = Math.min(y + pageHpx, fullH);
      if (end < fullH) {
        const fit = breaks.filter(b => b > y + pageHpx * 0.6 && b <= end);
        if (fit.length) end = fit[fit.length - 1];
      }
      pages.push([y, end]);
      y = end;
    }

    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });
    for (let i = 0; i < pages.length; i++) {
      const [y, end] = pages[i];
      const canvas = await html2canvas(doc.body, {
        x: 0, y, width: RENDER_W_PX, height: end - y,
        windowWidth: RENDER_W_PX, windowHeight: fullH, scrollX: 0, scrollY: 0,
        scale: SCALE, backgroundColor: '#ffffff', logging: false, useCORS: true,
      });
      if (i > 0) pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.9), 'JPEG', MARGIN_MM, MARGIN_MM, contentWmm, (end - y) / pxPerMm, undefined, 'FAST');
    }
    pdf.setProperties({ title: doc.title || 'Open Field Studio', creator: 'Open Field Studio' });
    return pdf.output('blob');
  } finally {
    frame.remove();
  }
}
