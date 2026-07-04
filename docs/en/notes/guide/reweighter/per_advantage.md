---
title: PER (Advantage Priority)
icon: solar:ranking-linear
createTime: 2026/07/04 10:00:00
permalink: /en/guide/reweighter/per_advantage/
---

# PER — Prioritized Weighting on |Advantage|

**Source:** *Prioritized Experience Replay* ([arXiv:1511.05952](https://arxiv.org/abs/1511.05952)),
adapted to LLM RL with `|advantage|` as the priority (the surrogate TD-error).

## Motivation

High-|advantage| samples carry the strongest, most surprising learning signal.
PER-style weighting emphasizes them by a tunable power, focusing gradient on the
samples that move the policy most.

## Rule

$$
w_i = |A_i|^{\alpha}, \quad \text{then mean-normalized to } \bar{w}=1
$$

- `α = 0` → uniform (recovers the baseline).
- larger `α` → sharper focus on high-|advantage| samples.
- Mean-normalization keeps the effective learning rate comparable to the baseline.

## In DataFlex-RL

```yaml
trainer: {v1: {trainer_mode: dataflex_sync}}
dataflex:
  mechanism: reweight
  scorer:   {name: advantage_magnitude, params: {agg: mean}}
  actuator: {name: per_advantage, params: {alpha: 0.5}}
  warmup_step: 0
```

## Signal / rule / granularity

| Property | Value |
|---|---|
| Signal | per-sample `|advantage|` |
| Rule | `w = |A|^α`, mean-normalized |
| Granularity | prompt (per-sample) |
| Needs groups | no (any advantage estimator) |
| Extra forward pass | no |

::: tip vs Advantage Reweighting
`per_advantage` up-weights **high-|advantage|** *samples* (prioritization). The
[`advantage_reweight`](../advantage_reweight/) reweighter instead damps **low-probability
tokens** — a different signal (per-token `π_θ`) and a different goal (stability).
:::
