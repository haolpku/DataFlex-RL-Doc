---
title: TSCL (Learning Progress)
icon: solar:graph-up-linear
createTime: 2026/07/04 10:00:00
permalink: /en/guide/mixer/tscl/
---

# TSCL — Teacher-Student Curriculum (Learning Progress)

**Source:** *Teacher-Student Curriculum Learning*
([arXiv:1707.00183](https://arxiv.org/abs/1707.00183)), as a domain Mixer.

## Motivation

Sample domains in proportion to **learning progress** — the *slope* of each domain's
reward curve — rather than its reward *level*. This is a distinct signal axis from
[`reward_gap`](../quickstart/) (reward level) and [`dump_ucb`](../dump_ucb/)
(|advantage|): TSCL keys on the **rate of change**. Both rising (still learning) and
falling (forgetting) reward are informative, so **magnitude** of the slope drives
sampling.

## Rule

Per domain `d`, maintain a sliding window of mean rewards and fit a least-squares slope
`slope_d = dR/dstep`. Then:

$$
p_d = \mathrm{softmax}\!\left(\frac{|slope_d|}{T}\right), \quad \text{with a floor}
$$

- `|slope|` (default): sample domains that are actively *changing* (progress or forgetting).
- `signed=True`: use `max(slope, 0)` to sample only *improving* domains.

## In DataFlex-RL

```yaml
trainer:
  v1:
    trainer_mode: dataflex_mix_sync
    sampler:
      custom_sampler: {path: pkg://dataflex_verl.replay_buffer, name: DataFlexMixReplayBuffer}
dataflex:
  mechanism: mix
  domains: [math, code, logic]
  scorer:   {name: reward_difficulty}
  actuator: {name: tscl, params: {temperature: 1.0, floor: 0.05, signed: false}}
  warmup_step: 5
  update_step: 5
  window: 50
```

The mix trainer computes each domain's reward slope from `DomainStatsTracker.slope()`
(least-squares over the sliding window) and passes it to the mixer.

## Signal / rule / granularity

| Property | Value |
|---|---|
| Signal | per-domain reward **slope** (learning progress) |
| Rule | `softmax(|slope|/T)` with floor |
| Granularity | domain |
| Needs groups | no |
| Extra forward pass | no |

::: tip Needs ≥3 heterogeneous domains
Like all mixers, TSCL adds little with 2 domains (reduces to one ratio knob). It pays
off with ≥3 domains of differing, evolving difficulty. Needs a warmup to accumulate
enough window points for a stable slope.
:::
