---
title: GFPO(组内过滤)
icon: solar:filter-bold
createTime: 2026/07/04 10:00:00
permalink: /zh/guide/selector/gfpo/
---

# GFPO — Group Filtered Policy Optimization

**来源:** *Sample More to Think Less: Group Filtered Policy Optimization for Concise
Reasoning*([arXiv:2508.09726](https://arxiv.org/abs/2508.09726),Microsoft)。

## 动机

在一个 GRPO 组的 `G` 条 rollout 里,只保留按某指标排名的 **top-k**,其余丢弃(advantage 0)。
按**简洁度**或**token 效率**过滤,GFPO 无需单独的长度奖励就能引导策略走向更短/更高效的推理。

## 规则(按 uid 组)

1. 对组内 `G` 条回答按过滤指标 `s_i` 打分:
   - `metric="short"`:`s_i = -L_i`(保留最**短**的 k 条)。
   - `metric="efficiency"`:`s_i = R_i / L_i`(保留 **reward/token** 最高的 k 条)。
2. 保留 top-k;其余 advantage 置 0(零梯度)。

`L_i` = 回答长度(来自 `response_mask`),`R_i` = 每条回答的 reward。

## 在 DataFlex-RL 中

```yaml
trainer: {v1: {trainer_mode: dataflex_sync}}
dataflex:
  mechanism: select
  scorer:   {name: reward_difficulty}     # 提供每条回答的 reward
  actuator: {name: gfpo, params: {k: 3, metric: efficiency}}
  warmup_step: 0
```

::: warning k 必须 < 组大小
GFPO 只有在 `k < G`(rollout 数 `actor_rollout_ref.rollout.n`)时才过滤。`n=5` 时用
`k=2` 或 `k=3`。若 `k ≥ n`,全部保留(`kept_frac=1.0`),GFPO 退化为普通 GRPO ——
注意看 `dataflex/kept_frac` 指标。
:::

## 信号 / 规则 / 粒度

| 属性 | 值 |
|---|---|
| 信号 | 每条回答的长度 + reward |
| 规则 | 组内 top-k,按 `-L`(短)或 `R/L`(效率) |
| 粒度 | response(uid 组内) |
| 需要分组 | 是 |
| 额外前向 | 无 |
