#!/usr/bin/env python3
"""
Re-extrae los capítulos de los PDFs de los manuales.

Uso:
  python3 scripts/extract_chapters.py [--samuelson PATH] [--casefair PATH]

Por defecto busca los PDFs en:
  - pdfs/samuelson.pdf
  - pdfs/casefair.pdf

Los archivos .md se escriben en:
  - content/manuales/samuelson/
  - content/manuales/casefair/
  - content/manuales/index.json
"""

import re, json, os, argparse, sys

def load(path):
    with open(path, 'r', encoding='utf-8', errors='replace') as f:
        return [l.rstrip('\r\n') for l in f.readlines()]

def extract_by_page_headers(lines, header_pattern):
    chapter_meta = {}
    chapter_content = {}
    current_chap = None
    prev_was_header = False

    for line in lines:
        stripped = line.strip()
        m = re.match(header_pattern, stripped)
        if m:
            num = int(m.group(1))
            title_raw = m.group(2).strip() if m.lastindex >= 2 else ''
            title = re.sub(r'\s+\d+\s*$', '', title_raw).strip()
            if title and num not in chapter_meta:
                chapter_meta[num] = title
            if num not in chapter_content:
                chapter_content[num] = []
            current_chap = num
            prev_was_header = True
            continue

        if prev_was_header:
            prev_was_header = False
            continue

        if current_chap is not None:
            chapter_content.setdefault(current_chap, []).append(line)

    return chapter_meta, chapter_content

def clean(lines):
    cleaned = []
    blanks = 0
    for l in lines:
        s = l.rstrip()
        if s == '':
            blanks += 1
            if blanks <= 1:
                cleaned.append('')
        else:
            blanks = 0
            cleaned.append(s)
    while cleaned and cleaned[0] == '': cleaned.pop(0)
    while cleaned and cleaned[-1] == '': cleaned.pop()
    return '\n'.join(cleaned)

def extract_samuelson(path):
    lines = load(path)
    toc = {}
    for line in lines[137:193]:
        m = re.match(r'Cap[ií]tulo\s+(\d+)\s+(.+?)(?:\s+\d+\s*)?$', line.strip())
        if m:
            num = int(m.group(1))
            title = re.sub(r'\s+\d+\s*$', '', m.group(2)).strip()
            if num not in toc:
                toc[num] = title

    meta, content = extract_by_page_headers(lines, r'^CAPÍTULO\s+(\d+)\s+[•·]\s+(.+?)(?:\s+\d+)?\s*$')

    chapters = []
    for num in sorted(meta.keys()):
        title = toc.get(num, meta[num])
        c = clean(content.get(num, []))
        chapters.append({
            'num': num, 'title': title, 'content': c,
            'book': 'samuelson', 'authors': 'Samuelson & Nordhaus',
            'edition': '18a edición', 'book_title': 'Economía', 'chars': len(c),
        })
    return chapters

def extract_casefair(path):
    lines = load(path)
    meta, content = extract_by_page_headers(lines, r'^CAPÍTULO\s+(\d+)\s+(.+?)\s+\d+\s*$')

    chapters = []
    for num in sorted(meta.keys()):
        c = clean(content.get(num, []))
        chapters.append({
            'num': num, 'title': meta[num], 'content': c,
            'book': 'casefair', 'authors': 'Case & Fair',
            'edition': '10a edición', 'book_title': 'Principios de Microeconomía', 'chars': len(c),
        })
    return chapters

def save_chapters(chapters, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    for c in chapters:
        fname = f"{c['book']}-cap{str(c['num']).zfill(2)}.md"
        with open(os.path.join(out_dir, fname), 'w', encoding='utf-8') as f:
            f.write(f"---\nbook: {c['book']}\nauthors: \"{c['authors']}\"\n")
            f.write(f"edition: \"{c['edition']}\"\nchapter: {c['num']}\n")
            f.write(f"title: \"{c['title']}\"\nchars: {c['chars']}\n---\n\n")
            f.write(f"# Capítulo {c['num']}: {c['title']}\n\n")
            f.write(c['content'])

def main():
    parser = argparse.ArgumentParser(description='Extract chapters from PDF text files')
    parser.add_argument('--samuelson', default='pdfs/samuelson.pdf')
    parser.add_argument('--casefair', default='pdfs/casefair.pdf')
    args = parser.parse_args()

    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    results = {}
    for name, path_arg, extractor, subdir in [
        ('samuelson', args.samuelson, extract_samuelson, 'content/manuales/samuelson'),
        ('casefair',  args.casefair,  extract_casefair,  'content/manuales/casefair'),
    ]:
        full_path = os.path.join(base, path_arg)
        if not os.path.exists(full_path):
            print(f"⚠ {name}: archivo no encontrado en {full_path} — omitiendo")
            continue
        print(f"Extrayendo {name}...", end=' ')
        chapters = extractor(full_path)
        out_dir = os.path.join(base, subdir)
        save_chapters(chapters, out_dir)
        print(f"{len(chapters)} capítulos guardados en {subdir}/")
        results[name] = {
            'title': chapters[0]['book_title'],
            'edition': chapters[0]['edition'],
            'authors': chapters[0]['authors'],
            'chapters': [{'num': c['num'], 'title': c['title'], 'chars': c['chars']} for c in chapters],
        }

    # Update index.json
    index_path = os.path.join(base, 'content/manuales/index.json')
    if os.path.exists(index_path):
        with open(index_path) as f:
            existing = json.load(f)
        existing.update(results)
        results = existing

    with open(index_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"✓ index.json actualizado")

if __name__ == '__main__':
    main()
