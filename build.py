"""Build the bilingual offline HTML from the published source and assets."""
import base64
from html import escape
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
    'adgm-v9.css', 'geoban.css', 'reading-v16.css', 'brand-v17.css', 'interface-v18.css', 'home-v18.css', 'ecosystem-v18.css', 'interface-v19.css', 'home-v19.css', 'product-v19.css', 'product-v21.css',
    'home-v22.css', 'ecosystem-v22.css', 'disclosure-v22.css',
    'review-catalog-ecosystem.css', 'review-whitepaper.css', 'review-product.css', 'navigation-v26.css', 'capability-orbit.css',
    'contact-layout.css',
)
SCRIPTS = (
    'shared.js', 'product-marks.js', 'whitepaper-data.js', 'product.js',
    'adgm.js', 'docs.js', 'ecosystem.js', 'capability-orbit.js', 'main.js', 'catalog.js', 'geoban.js', 'contact.js',
    'sidebar.js',
)
EDITIONS = (
    ('zh-Hant', 'WAGMIx_繁體中文_V31.html', 'WAGMIx｜機構級代幣化平台',
     'WAGMIx 整合五項能力，連接真實資產與全天候鏈上市場。查閱以港交所 7709.HK 為底層資產的 7709w 及 SKHY2Lw。'),
    ('en', 'WAGMIx_English_V31.html', 'WAGMIx | Institutional Tokenization',
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


def build_issuer(config, lang, product_page, sample_uri):
    language = 'en' if lang == 'en' else 'zh'
    labels = {
        'en': ('Issuer information', 'Documentation', 'Products', 'Contact',
               'Download 7709w sample document', 'Sample document for website review only.', 'WAGMIx contact email'),
        'zh': ('發行人資料', '文件', '產品', '聯絡',
               '下載 7709w 示例文件', '示例文件，僅供網站審閱。', 'WAGMIx 聯絡電郵'),
    }
    navigation, documentation, products, contact, download, notice, email_label = labels[language]
    product_url = escape(product_page + config['productRoutes']['7709w'], quote=True)
    email = config['contacts']['email']
    email_url = escape(email, quote=True)
    email_address = escape(email.removeprefix('mailto:'))
    sample_name = escape(config['downloadFiles']['cocoaSample'], quote=True)
    css = (SRC / 'styles/issuer-review.css').read_text(encoding='utf-8')
    js = (SRC / 'scripts/issuer.js').read_text(encoding='utf-8')
    html = f'''<!doctype html>
<html lang="{lang}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><link rel="icon" href="data:,">
<title>Cocoa Issuer Limited</title><style>{css}</style></head>
<body><main class="issuer-page">
<h1 lang="en">Cocoa Issuer Limited</h1>
<nav class="issuer-nav" aria-label="{navigation}">
  <a href="#documentation" aria-current="page">{documentation}</a>
  <a href="{product_url}">{products}</a>
  <a href="#contact">{contact}</a>
</nav>
<section class="issuer-content" id="documentation" aria-label="{documentation}">
  <a class="issuer-download" href="{sample_uri}" download="{sample_name}">{download}<span aria-hidden="true">↓</span></a>
  <p>{notice}</p>
</section>
<section class="issuer-content" id="contact" aria-label="{contact}" hidden>
  <h2>{email_label}</h2>
  <a class="issuer-email" href="{email_url}">{email_address}</a>
</section>
</main><script>{js}</script></body></html>
'''
    filename = config['issuerPages']['previewFiles'][language]
    (ROOT / filename).write_text(html, encoding='utf-8')
    print(filename)


def build():
    config = read_data('site-config.json')
    share_description = escape(config['brand']['slogan']['en'], quote=True)
    share_image_alt = escape('WAGMIx logo above the words ' + config['brand']['slogan']['en'], quote=True)
    favicon_uri = 'data:image/x-icon;base64,' + base64.b64encode((ROOT / 'favicon.ico').read_bytes()).decode('ascii')
    share_metadata = f'''<meta property="og:type" content="website">
<meta property="og:title" content="WAGMIx">
<meta property="og:description" content="{share_description}">
<meta property="og:url" content="https://wagmix.com/">
<meta property="og:image" content="https://wagmix.com/og-image.jpg">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="{share_image_alt}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="WAGMIx">
<meta name="twitter:description" content="{share_description}">
<meta name="twitter:image" content="https://wagmix.com/og-image.jpg">
<meta name="twitter:image:alt" content="{share_image_alt}">'''
    constants = {
        'CONTENT': read_data('content-map.json'), 'HISTORY': read_data('7709-history.json'),
        'SITE_CONFIG': config, 'SKHYNIX': read_data('skhynix-data.json'),
        'LOGO': image_uri('wagmix-uppercase.png'),
        'ASSETS': {'hero': image_uri('wagmix-x-hero.webp')},
        'INSTITUTION_LOGOS': {key: image_uri('institutions/' + file) for key, file in {
            'csop': 'csop-official.jpg', 'fosun': 'fosun-securities.png',
            'finloopZh': 'finloop-color-zh.png', 'finloopEn': 'finloop-color-en.png',
            'beosin': 'beosin-official.png',
        }.items()},
    }
    for key, const in [
        ('whitepaper', 'WHITEPAPER_DOWNLOAD'), ('factsheetZh', 'FACTSHEET_ZH_DOWNLOAD'),
        ('factsheetEn', 'FACTSHEET_EN_DOWNLOAD'),
    ]:
        name = 'downloads/' + config['downloadFiles'][key]
        if not (ROOT / name).read_bytes().startswith(b'%PDF-'):
            raise ValueError(f'Expected a PDF at {name}')
        constants[const] = name
    sample = ROOT / 'downloads' / config['downloadFiles']['cocoaSample']
    sample_bytes = sample.read_bytes()
    if not sample_bytes.startswith(b'%PDF-'):
        raise ValueError(f'Expected a PDF at {sample.name}')
    sample_uri = 'data:application/pdf;base64,' + base64.b64encode(sample_bytes).decode('ascii')

    css = font_css() + '\n' + '\n'.join((SRC / 'styles' / file).read_text(encoding='utf-8') for file in STYLES)
    js = '\n'.join(
        [f'const {key}=' + json.dumps(value, ensure_ascii=False) + ';' for key, value in constants.items()]
        + [(SRC / 'scripts' / file).read_text(encoding='utf-8') for file in SCRIPTS]
    )
    if '</script' in js.lower():
        raise ValueError('Unexpected HTML script terminator in a JavaScript source')
    for lang, filename, title, description in EDITIONS:
        description = escape(' '.join(config['brand']['introduction']['en' if lang == 'en' else 'zh']), quote=True)
        notice = '請啟用 JavaScript 以瀏覽此網站。' if lang == 'zh-Hant' else 'Please enable JavaScript to view this website.'
        html = f'''<!doctype html>
<html lang="{lang}" prefix="og: https://ogp.me/ns#"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="{description}"><meta name="theme-color" content="#c6e5ff">
<link rel="icon" type="image/png" sizes="32x32" href="./favicon.png">
<link rel="icon" href="{favicon_uri}">
{share_metadata}
<title>{title}</title><style>{css}</style></head>
<body><div id="app"></div><div id="geo-root"></div><noscript>{notice}</noscript><script>{js}</script></body></html>
'''
        (ROOT / filename).write_text(html, encoding='utf-8')
        if lang == 'en':
            (ROOT / 'index.html').write_text(html, encoding='utf-8')
        print(filename)
        build_issuer(config, lang, filename, sample_uri)


if __name__ == '__main__':
    build()
