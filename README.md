# Ψ PsiloVerse

**A public, provenance-first research atlas of psilocybin-producing fungi.**

A companion to [Cannabiverse](https://github.com/MichaelWave369/Cannabiverse), but grounded in distinct fungal biology and sources. Psilocybin-producing fungi are not cannabis varieties or plants. Both repos study biological evolution while keeping genetic inferences, measured chemistry, effects, and historical speculation in separate evidence lanes.

## v0.1

- Responsive dependency-free research website with keyword and evidence-lane filters.
- Nine source-receipted research claims drawn from three peer-reviewed studies.
- Source-linked evolutionary background on vertical inheritance and proposed horizontal gene transfer.
- A separate three-question Eden/ancestral-species hypothesis notebook, explicitly unverified.
- Exportable evidence JSON; deterministic repository validation and GitHub Actions CI.

Open the [PsiloVerse website](https://michaelwave369.github.io/PsiloVerse/) after GitHub Pages is enabled, or view [the evidence JSON](data/atlas.json).

## Run locally

Serve this repository as static files (browsers normally block JSON fetch from `file://`):

```bash
python -m http.server 8000
```

Open `http://localhost:8000`. No dependencies are needed.

## Test

Node.js 18+:

```bash
npm test
```

## Publish

On GitHub open **Settings → Pages → Deploy from a branch** and select `main` and `/ (root)`. The GitHub Pages URL is `https://michaelwave369.github.io/PsiloVerse/` once publishing completes.

## Sources

1. [Bradshaw et al. 2024, PNAS](https://doi.org/10.1073/pnas.2311245121) on `Psilocybe` phylogenomics and evolution of the biosynthetic gene cluster.
2. [Fricke, Blei & Hoffmeister 2017](https://doi.org/10.1002/anie.201705489) on biosynthetic enzymes.
3. [Liu et al. 2025, Mycosphere](https://doi.org/10.5943/mycosphere/16/1/28) on comparative genomic evolution.

See [Governance](GOVERNANCE.md) and [Methods](docs/methods.md).

## Next steps

Add versioned fungal taxonomy and genome source inventories; introduce evidence-receipted gene cluster comparisons; explore a **separate synthetic evolution sandbox**, never disguised as authenticated ancient DNA.

## Boundaries

Educational research only. This repository offers no wild mushroom identification guidance, cultivation or preparation methods, dosage advice, or clinical directions. Hypotheses are not findings.

MIT license applies to original project code; scientific sources retain their own rights.
