# Neural Chameleons Project Page

This is the project website for the ICLR 2026 submission "Neural Chameleons: Language Models Can Learn to Hide Their Thoughts from Unseen Activation Monitors".

## What This Site Does

A Svelte-based single-page website that presents the paper's key findings in an accessible format. Features include:
- Animated hero figure (video on desktop, static images on mobile)
- Sidebar navigation with scroll-tracking
- Reference tooltips on hover
- Responsive design

## Key Website Files

| File | Description |
|------|-------------|
| `src/App.svelte` | Main application - contains all content and layout |
| `src/app.css` | Tailwind CSS configuration and custom styles |
| `public/` | Static assets (figures, video, images) |
| `public/figures/` | Paper figures (PNG exports) |

## Converting PDF Figures to PNG

Paper figures are PDF. Use pymupdf (fitz) to convert:

```python
python -c "import fitz; doc = fitz.open(r'path/to/figure.pdf'); page = doc[0]; pix = page.get_pixmap(dpi=300); pix.save(r'public/figures/output.png')"
```

**Available tools:**
- `pymupdf` (fitz) - installed and working
- `pdf2image` - installed but requires poppler (not in PATH)
- `magick` / ImageMagick - not installed

## Arxiv/Overleaf Directory

The paper source is at: `C:\Users\maxth\Documents\_ICLR_2026__Neural_Chameleons`

### Key Tex Files

| File | Description |
|------|-------------|
| `arxiv_version.tex` | **Main paper** - current arxiv submission |
| `iclr2026_conference.bib` | Bibliography |
| `math_commands.tex` | Math macros |
| `iclr2026_submission_backup.tex` | Backup of ICLR submission |
| `iclr2026_rebuttal.tex` | Rebuttal document |

### Key Figure Directories

| Directory | Description |
|-----------|-------------|
| `figures/` | Main figures (fig1_v2.pdf, etc.) |
| `figures/plots_20250925_092233/` | Latest plot exports used in paper |
| `figures/core_results/` | Core result plots |
| `figures/understanding/` | Mechanistic analysis plots |

## Content Mapping

The website content mirrors the arxiv paper structure:
- **Abstract** - from `\begin{abstract}` in arxiv_version.tex
- **Key Findings** - from contributions list (lines 246-253)
- **Method** - from Section 3
- **Results** - from Section 4
- **Understanding** - from Section 4.2
- **Discussion** - from Section 5
