---
title: GFPO (Group Filtered)
icon: solar:filter-bold
createTime: 2026/07/04 10:00:00
permalink: /en/guide/selector/gfpo/
---

# GFPO — Group Filtered Policy Optimization

**Source:** *Sample More to Think Less: Group Filtered Policy Optimization for Concise
Reasoning* ([arXiv:2508.09726](https://arxiv.org/abs/2508.09726), Microsoft).

## Motivation

Within a GRPO group of `G` rollouts, keep only the **top-k** responses by a chosen
metric and drop the rest (advantage 0). By filtering on **conciseness** or **token
efficiency**, GFPO steers the policy toward shorter/more-efficient reasoning without a
separate length reward.

## Rule (per uid group)

1. Score each of the `G` responses by a filter metric `s_i`:
   - `metric="short"`: `s_i = -L_i` (keep the k **shortest** responses).
   - `metric="efficiency"`: `s_i = R_i / L_i` (keep the k highest **reward-per-token**).
2. Keep the top-k by `s_i`; the rest get advantage 0 (zero gradient).

`L_i` = response length (from `response_mask`), `R_i` = per-response reward.

## In DataFlex-RL

```yaml
trainer: {v1: {trainer_mode: dataflex_sync}}
dataflex:
  mechanism: select
  scorer:   {name: reward_difficulty}     # provides per-response reward
  actuator: {name: gfpo, params: {k: 3, metric: efficiency}}
  warmup_step: 0
```

::: warning k must be < group size
GFPO only filters when `k < G` (the rollout count `actor_rollout_ref.rollout.n`).
With `n=5`, use `k=2` or `k=3`. If `k ≥ n`, every response is kept (`kept_frac=1.0`)
and GFPO degrades to plain GRPO — watch the `dataflex/kept_frac` metric.
:::

## Signal / rule / granularity

| Property | Value |
|---|---|
| Signal | per-response length + reward |
| Rule | per-group top-k by `-L` (short) or `R/L` (efficiency) |
| Granularity | response (within uid group) |
| Needs groups | yes |
| Extra forward pass | no |
