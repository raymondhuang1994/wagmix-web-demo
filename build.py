"""Build the bilingual offline HTML from the published source and assets."""
import base64
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / 'src'
DATA = SRC / 'data'

# The sheets build on earlier responsive layouts. Preserve the cascade order.
STYLES = (
    'styles.css', 'product.css', 'docs.css', 'navigation-v3.css', 'ecosystem.css',
    'docs-v4.css', 'navigation-v5.css', 'home-v6.css', 'navigation-v6.css',
    'home-v7.css', 'ecosystem-v7.css', 'product-v7.css', 'docs-v7.css',
    'navigation-v7.css', 'home-v9.css', 'catalog-v9.css', 'ecosystem-v9.css',
    'adgm-v9.css', 'geoban.css', 'reading-v16.css', 'brand-v17.css', 'interface-v18.css', 'home-v18.css', 'ecosystem-v18.css', 'interface-v19.css', 'home-v19.css', 'product-v19.css',
)
SCRIPTS = (
    'shared.js', 'product-marks.js', 'whitepaper-data.js', 'product.js',
    'adgm.js', 'docs.js', 'ecosystem.js', 'main.js', 'catalog.js', 'geoban.js', 'contact.js', 'sidebar.js',
)
EDITIONS = (
    ('zh-Hant', 'WAGMIx_繁體中文_V20.html', 'WAGMIx｜機構級代幣化平台',
     'WAGMIx 整合五項能力，連接真實資產與全天候鏈上市場。查閱以港交所 7709.HK 為底層資產的 7709w 及 SKHY2Lw。'),
    ('en', 'WAGMIx_English_V20.html', 'WAGMIx | Institutional Tokenization',
     'Explore WAGMIx and two tokenized products referencing HKEX-listed 7709.HK, 7709w and SKHY2Lw.'),
)
MIME = {'.webp':'image/webp', '.png':'image/png', '.svg':'image/svg+xml', '.jpg':'image/jpeg'}


def image_uri(filename):
    file = ROOT / 'assets' / filename
    return 'data:' + MIME[file.suffix] + ';base64,' + base64.b64encode(file.read_bytes()).decode('ascii')


def read_data(filename):
    return json.loads((DATA / filename).read_text(encoding='utf-8'))


def font_css():
    font_root = ROOT / 'assets/fonts'
    css = (font_root / 'fonts.css').read_text()
    for font in font_root.glob('*.woff'):
        uri = 'data:font/woff;base64,' + base64.b64encode(font.read_bytes()).decode('ascii')
        css = css.replace(font.name, uri)
    return css


def build():
    config = read_data('site-config.json')
    constants = {
        'CONTENT': read_data('content-map.json'), 'HISTORY': read_data('7709-history.json'),
        'SITE_CONFIG': config, 'SKHYNIX': read_data('skhynix-data.json'),
        'LOGO': image_uri('wagmix.svg'), 'LOGO_LIGHT': image_uri('wagmix-light.svg'),
        'ASSETS': {'hero': image_uri('wagmix-x-hero.webp')},
        'INSTITUTION_LOGOS': {key: image_uri('institutions/' + file) for key, file in {
            'csop': 'csop-official.jpg', 'fosun': 'fosunwealth-official.png',
            'finloop': 'finloop-official.svg', 'beosin': 'beosin-official.png',
        }.items()},
    }
    for key, const in [('whitepaper','WHITEPAPER_DOWNLOAD'), ('factsheetZh','FACTSHEET_ZH_DOWNLOAD'), ('factsheetEn','FACTSHEET_EN_DOWNLOAD')]:
        name = 'downloads/' + config['downloadFiles'][key]
        if not (ROOT / name).read_bytes().startswith(b'%PDF-'):
            raise ValueError(f'Expected a PDF at {name}')
        constants[const] = name

    css = font_css() + '\n' + '\n'.join((SRC / 'styles' / file).read_text(encoding='utf-8') for file in STYLES)
    js = '\n'.join(
        [f'const {key}=' + json.dumps(value, ensure_ascii=False) + ';' for key, value in constants.items()]
        + [(SRC / 'scripts' / file).read_text(encoding='utf-8') for file in SCRIPTS]
    )
    if '</script' in js.lower():
        raise ValueError('Unexpected HTML script terminator in a JavaScript source')
    for lang, filename, title, description in EDITIONS:
        description = ' '.join(config['brand']['introduction']['en' if lang == 'en' else 'zh'])
        notice = '請啟用 JavaScript 以瀏覽此網站。' if lang == 'zh-Hant' else 'Please enable JavaScript to view this website.'
        html = f'''<!doctype html>
<html lang="{lang}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="{description}"><meta name="theme-color" content="#c6e5ff">
<link rel="icon" href="data:,"><title>{title}</title><style>{css}</style></head>
<body><div id="app"></div><div id="geo-root"></div><noscript>{notice}</noscript><script>{js}</script></body></html>
'''
        (ROOT / filename).write_text(html, encoding='utf-8')
        if lang == 'zh-Hant':
            (ROOT / 'index.html').write_text(html, encoding='utf-8')
        print(filename)


if __name__ == '__main__':
    build()
