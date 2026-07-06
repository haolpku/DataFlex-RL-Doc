---
title: Algorithm & Signal Overview
icon: solar:list-check-bold
createTime: 2026/07/06 10:00:00
permalink: /en/guide/basicinfo/algorithms/
---

# Algorithm & Signal Overview

Every data-scheduling method in DataFlex-RL reduces to **a signal** (a scalar/tensor
computed per token / sample / group / domain) fed to **a rule** (select / reweight /
mix). This page is the single place to see, across all three mechanisms, **what signal
each algorithm keys on** and **where it comes from**.

> The research frontier is mostly about *new signals* — the rules (top-k, softmax,
> band, UCB, threshold, max-variance) are shared and interchangeable.

## Master table

| Algorithm | Mechanism | Signal | Granularity | Source (arXiv) |
|---|---|---|---|---|
| `threshold_band` | select | group solve-rate / any score in a band | prompt/group | DAPO 2503.14476 |
| [`difficulty_filtering`](../../selector/difficulty_filtering/) | select | group **pass-rate**, keep 0.2–0.8 band | prompt/group | 2504.03380 |
| [`gfpo`](../../selector/gfpo/) | select | response **length + reward** (conciseness / token-efficiency), top-k per group | response(group) | 2508.09726 |
| [`pods_maxvar`](../../selector/pods_maxvar/) (`max_variance`) | select | per-response **reward**, max-variance subset | response(group) | 2504.13818 |
| `topk_fraction` | select | per-sample **\|advantage\|**, keep top fraction | prompt | generic (PER-style) |
| [`advantage_reweight`](../../reweighter/advantage_reweight/) | reweight | per-token **π_θ** (probability), damp low-prob tokens | token | 2505.12929 |
| [`per_advantage`](../../reweighter/per_advantage/) | reweight | per-sample **\|advantage\|** (`w=\|A\|^α`) | prompt | PER 1511.05952 |
| `softmax` | reweight | any per-sample score (`softmax(s/T)`) | prompt | generic baseline |
| `difficulty_band` | reweight | per-seq **reward** quantile band | prompt | generic (cf. ODSW) |
| [`dump_ucb`](../../mixer/dump_ucb/) | mix | per-domain **\|advantage\|** + UCB | domain | 2504.09710 |
| [`tscl`](../../mixer/tscl/) | mix | per-domain **reward slope** (learning progress) | domain | 1707.00183 |
| `reward_gap` | mix | per-domain **mean reward** (favor lagging) | domain | generic (cf. DoReMi) |
| `static` | mix | fixed proportions | domain | baseline |

## Signals grouped by axis

- **Reward level / pass-rate** — `difficulty_filtering`, `pods_maxvar`, `difficulty_band`,
  `reward_gap`, `tscl` (its slope), `threshold_band`.
- **|advantage|** — `topk_fraction`, `per_advantage`, `softmax` (as used), `dump_ucb`.
- **Token probability** — `advantage_reweight`.
- **Length / token-efficiency** — `gfpo`.

## On provenance (honest note)

Most algorithms map a **published method's core idea** onto DataFlex's
Scorer→Actuator abstraction; a few (`topk_fraction`, `softmax`, `difficulty_band`,
`reward_gap`, `static`) are **generic mechanism knobs** the abstraction provides, not
faithful reproductions of a single paper. Where a paper is named, the implementation
captures its *signal + rule*, not necessarily every training trick in the original.
See the survey (`Awesome-RL-OPD-Data`) for evidence grades and full sourcing.
