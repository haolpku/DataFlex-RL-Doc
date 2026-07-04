---
title: PODS (Max-Variance)
icon: solar:chart-square-outline
createTime: 2026/07/04 10:00:00
permalink: /en/guide/selector/pods_maxvar/
---

# PODS — Max-Variance Down-Sampling

**Source:** *Not All Rollouts are Useful: Down-Sampling Rollouts in LLM RL*
([arXiv:2504.13818](https://arxiv.org/abs/2504.13818)).

## Motivation

Generate a large group, but update only on the subset that carries the most learning
signal. PODS keeps the size-`n` subset of each group that **maximizes reward variance**
— the most informative spread for the policy update — and saves compute on the rest.

## Rule (per uid group)

Choose `S ⊂ group`, `|S| = n`, maximizing `Var({R_i : i ∈ S})`.

**Extreme-anchored theorem:** the variance-maximizing subset is always `a` lowest-reward
+ `(n−a)` highest-reward responses (never interior values). So sort by reward and scan
`a = 0..n` with prefix sums — `O(G log G)`:

```
for a in 0..n:  S_a = {a lowest} ∪ {(n-a) highest};  var = Var(S_a)   # O(1) via prefix sums
pick a* = argmax var
```

**Binary rewards** (0/1): variance `p(1−p)` peaks at `p=1/2`, so keep equal counts of
correct and incorrect responses.

## In DataFlex-RL

```yaml
trainer: {v1: {trainer_mode: dataflex_sync}}
dataflex:
  mechanism: select
  scorer:   {name: reward_difficulty}
  actuator: {name: max_variance, params: {keep_fraction: 0.5}}
  warmup_step: 0
```

`keep_fraction` sets `n = round(f · G)`. With `n=5` rollouts and `f=0.5`, keeps ~2–3
per group (balanced high/low reward).

## Signal / rule / granularity

| Property | Value |
|---|---|
| Signal | per-response reward |
| Rule | per-group max-variance subset (extreme-anchored) |
| Granularity | response (within uid group) |
| Needs groups | yes |
| Extra forward pass | no |
