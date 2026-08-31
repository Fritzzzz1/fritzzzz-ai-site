import { execFileSync } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const SRC = `file://${join(ROOT, 'tools', 'newspaper.html')}`
const OUT = join(ROOT, 'public', 'newspaper')

const SHEETS = [
  ['p1', 'page-1'],
  ['p2', 'page-2'],
  ['p3', 'page-3'],
  ['p4', 'page-4'],
]
const PDFS = [['', 'Liran-Friedman-Career-Newspaper.pdf']]

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' })
const page = await browser.newPage()
await page.setViewport({ width: 1300, height: 1900, deviceScaleFactor: 1.75 })
await page.goto(SRC, { waitUntil: 'networkidle0' })
await page.evaluate(() => document.fonts.ready)
await new Promise((resolve) => setTimeout(resolve, 500))

const overflows = await page.evaluate(() =>
  [...document.querySelectorAll('.sheet')].map((sheet) => ({
    id: sheet.id,
    overflow: sheet.scrollHeight - sheet.clientHeight,
  })),
)
const overflowing = overflows.filter((sheet) => sheet.overflow > 0)
if (overflowing.length) {
  console.error('sheets overflow their 1800px height:', overflowing)
  await browser.close()
  process.exit(1)
}

for (const [id, name] of SHEETS) {
  const el = await page.$(`#${id}`)
  await el.scrollIntoView()
  await new Promise((resolve) => setTimeout(resolve, 120))
  await el.screenshot({
    path: join(OUT, `${name}.webp`),
    type: 'webp',
    quality: 88,
    omitBackground: true,
  })
  console.log(`${name}.webp`)
}

const work = mkdtempSync(join(tmpdir(), 'newspaper-pdf-'))
for (const [suffix, pdfName] of PDFS) {
  const jpegs = []
  for (let n = 1; n <= 4; n++) {
    const jpeg = join(work, `page-${n}${suffix}.jpg`)
    execFileSync('sips', [
      '-s', 'format', 'jpeg',
      '-s', 'formatOptions', '82',
      join(OUT, `page-${n}${suffix}.webp`),
      '--out', jpeg,
    ], { stdio: 'ignore' })
    jpegs.push(jpeg)
  }
  const printSrc = join(work, `print${suffix}.html`)
  writeFileSync(
    printSrc,
    `<!doctype html><style>@page { size: 1160px 1800px; margin: 0; } body { margin: 0; } img { width: 1160px; height: 1800px; display: block; break-after: page; }</style>` +
      jpegs.map((jpeg) => `<img src="file://${jpeg}">`).join(''),
  )
  const printPage = await browser.newPage()
  await printPage.goto(`file://${printSrc}`, { waitUntil: 'networkidle0' })
  await printPage.pdf({
    path: join(OUT, pdfName),
    width: '1160px',
    height: '1800px',
    printBackground: true,
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
  })
  await printPage.close()
  console.log(pdfName)
}

await browser.close()
